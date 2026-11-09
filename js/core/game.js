// =============================================================================
// Головний клас гри: життєвий цикл, симуляція, керування часом і оновлення UI.
// Решта поведінки підмішується з js/systems, js/render та js/ui.
//
// Продуктивність: симуляція й мапа працюють щокадру, а DOM оновлюється
// не частіше ніж UI_TICK і лише для «брудних» панелей (markDirty).
// =============================================================================

const UI_TICK = 0.2;          // секунд між оновленнями DOM
const AUTOSAVE_EVERY = 10000; // мс

class EuroLogisticsGame {
  constructor() {
    this.settings = SaveStore.loadSettings();
    this.state = new GameState({ lang: this.settings.lang, homeBase: 'berlin' });
    this.sound = new SoundFX();
    this.sound.setVolume(this.settings.volume / 100);
    this.sound.setEnabled(this.settings.sound);

    this.canvas = document.getElementById('mapCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.tooltip = document.getElementById('mapTooltip');
    this.geoBounds = { minLon: -11.0, maxLon: 38.5, minLat: 35.5, maxLat: 62.0 };

    this.lastTimestamp = performance.now();
    this.uiClock = 0;
    this.contractGenTimer = 0;
    this.eventTimer = 40;
    this.dirty = new Set();
    this.activeTab = this.settings.lastTab || 'contracts';

    this.prePauseSpeed = 1;
    this.preFreezeSpeed = 1;
    this.preTutorialSpeed = 1;
    this.currentTutorialStep = 0;
    this.tutorialMapFocus = null;
    this.profileTab = 'profile';
    this.screen = 'title'; // title | setup | game
    this.setupOpen = true;  // поки не в грі — симуляція й автозбереження вимкнені

    this.bindEvents();
    this.bindSetupEvents();
    this.resizeCanvas();
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      if (this.isTutorialOpen()) this.positionTutorialCard();
    });

    this.setLanguage(this.settings.lang, false);
    this.openTitleScreen();

    setInterval(() => { if (this.screen === 'game') this.saveGame(); }, AUTOSAVE_EVERY);
    const flush = () => { if (this.screen === 'game') this.saveGame(); };
    window.addEventListener('beforeunload', flush);
    document.addEventListener('visibilitychange', () => { if (document.hidden) flush(); });

    requestAnimationFrame((t) => this.loop(t));
  }

  // Перехід до самої гри (після заснування, продовження або імпорту)
  enterGame() {
    this.screen = 'game';
    this.setupOpen = false;
    document.body.classList.remove('setup-active', 'title-active');
    document.getElementById('titleScreen')?.classList.add('hidden');
    document.getElementById('setupScreen')?.classList.add('hidden');
    document.getElementById('bankruptModal')?.classList.add('hidden');
    document.getElementById('pauseModal')?.classList.add('hidden');

    this.contractGenTimer = 0;
    this.eventTimer = 40;
    this.invalidateModifiers();
    this.topUpDriverMarket(); // старі збереження мали лише 4 кандидати
    if (!this.state.contracts.length) this.generateInitialContracts();

    this.setLanguage(this.state.lang, false);
    this.switchTab(this.activeTab);
    this.renderUI();
    this.setSpeed(this.state.timeSpeed || 1);
    this.updateSaveIndicator(Date.now());

    if (this.state.bankrupt) {
      this.setSpeed(0);
      this.openBankruptcyScreen();
    } else if (!this.settings.tutorialDone) {
      setTimeout(() => this.startTutorial(), 450);
    }
  }

  // ---- Утиліти --------------------------------------------------------------
  esc(str) {
    return String(str ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

  pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  fmtMoney(n) {
    const v = Math.round(n);
    return `${v < 0 ? '−' : ''}€${Math.abs(v).toLocaleString()}`;
  }

  formatEta(seconds) {
    return `${Math.max(0, Math.round(seconds))}s`;
  }

  // Позначити панелі для перерендеру на наступному UI-тіку
  markDirty(...panels) {
    panels.forEach(p => this.dirty.add(p));
  }

  // Після дії гравця: оновити UI одразу й запланувати збереження
  afterAction(...panels) {
    this.markDirty('hud', ...panels);
    this.uiTick();
    this.requestSave();
  }

  // ---- Симуляція -----------------------------------------------------------
  update(dt) {
    if (this.state.timeSpeed === 0 || this.screen !== 'game') return;
    const effectiveDt = dt * this.state.timeSpeed;

    // 1 реальна секунда на 1x = 10 ігрових хвилин
    this.state.minute += effectiveDt * 10;
    while (this.state.minute >= 60) {
      this.state.minute -= 60;
      this.state.hour++;
      if (this.state.hour >= 24) {
        this.state.hour = 0;
        this.state.day++;
        this.endOfDay();
        if (this.state.bankrupt) return;
      }
    }

    // Замовлення на біржі згорають
    for (let i = this.state.contracts.length - 1; i >= 0; i--) {
      const c = this.state.contracts[i];
      c.timeLeft -= effectiveDt;
      if (c.timeLeft <= 0) {
        this.state.contracts.splice(i, 1);
        this.state.stats.expired++;
        this.markDirty('contracts');
        if (this.currentAssignContractId === c.id) this.closeAssignModal();
      }
    }

    // Дедлайн взятих у роботу замовлень теж іде
    this.state.fleet.forEach(v => {
      if (v.currentContract) v.currentContract.timeLeft -= effectiveDt;
    });

    if (this.state.event.timer > 0) {
      this.state.event.timer -= effectiveDt;
      if (this.state.event.timer <= 0) this.resetEvent(true);
    }

    // Нові замовлення: що більше флот, то жвавіша біржа
    const maxContracts = Math.min(14, 7 + Math.floor(this.state.fleet.length / 2));
    this.contractGenTimer += effectiveDt;
    if (this.contractGenTimer >= 7 && this.state.contracts.length < maxContracts) {
      this.contractGenTimer = 0;
      this.state.contracts.push(this.generateContract());
      this.markDirty('contracts');
    }

    this.eventTimer -= effectiveDt;
    if (this.eventTimer <= 0) {
      this.triggerRandomEvent();
      this.eventTimer = 45 + Math.random() * 30;
    }

    for (const vehicle of this.state.fleet) this.updateVehicle(vehicle, effectiveDt);
  }

  loop(timestamp) {
    const dt = Math.min((timestamp - this.lastTimestamp) / 1000, 0.1);
    this.lastTimestamp = timestamp;

    this.update(dt);
    this.draw();

    this.uiClock += dt;
    if (this.uiClock >= UI_TICK) {
      this.uiClock = 0;
      this.uiTick();
    }
    requestAnimationFrame((t) => this.loop(t));
  }

  // Оновлення DOM: HUD, живі лічильники та «брудні» панелі
  uiTick() {
    if (this.screen !== 'game') return;
    this.updateHUD();
    this.updateLiveCounters();
    this.renderDirty();
  }

  // ---- Керування часом ------------------------------------------------------
  setSpeed(val) {
    this.state.timeSpeed = val;
    document.querySelectorAll('[data-speed]').forEach(btn => {
      btn.classList.toggle('active', Number(btn.getAttribute('data-speed')) === val);
    });

    const overlayOpen = this.isTutorialOpen() || !document.getElementById('pauseModal')?.classList.contains('hidden') || this.screen !== 'game';
    const frozen = val === 0 && !overlayOpen;
    document.getElementById('mapFreezeBanner')?.classList.toggle('hidden', !frozen);
    document.getElementById('canvasWrapper')?.classList.toggle('is-frozen', frozen);
  }

  toggleMapFreeze() {
    if (this.state.timeSpeed === 0) {
      this.setSpeed(this.preFreezeSpeed || 1);
    } else {
      this.preFreezeSpeed = this.state.timeSpeed;
      this.setSpeed(0);
    }
  }
}
