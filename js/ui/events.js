// =============================================================================
// Обробники подій. Кнопки в динамічних списках мають data-action і data-id —
// тут один делегований слухач замість inline onclick і глобального window.game.
// =============================================================================

Object.assign(EuroLogisticsGame.prototype, {
  // Дії по кліку: data-action → метод гри
  getClickActions() {
    return {
      'accept': (el) => this.openAssignModal(el.dataset.id),
      'assign': (el) => this.assignContract(el.dataset.id, el.dataset.vehicle),
      'buy-vehicle': (el) => this.buyVehicle(el.dataset.id),
      'sell': (el) => this.sellVehicle(el.dataset.id),
      'service': (el) => this.serviceVehicle(el.dataset.id),
      'buy-garage': (el) => this.buyGarage(el.dataset.id),
      'upgrade-garage': (el) => this.upgradeGarage(el.dataset.id),
      'hire': (el) => this.hireDriver(el.dataset.id),
      'fire': (el) => this.fireDriver(el.dataset.id),
      'tradeoff': (el) => this.toggleTradeoff(el.dataset.id),
      'upgrade': (el) => this.buyUpgrade(el.dataset.id),
      'loan-take': () => this.takeLoan(),
      'loan-repay': () => this.repayLoan(),
      'clear-city': () => this.selectCity(null),
      'market-filter': (el) => { this.marketFilter = el.dataset.id; this.renderDriversUI(); }
    };
  },

  // Дії по зміні select
  getChangeActions() {
    return {
      'relocate': (el) => { if (el.value) this.relocateVehicle(el.dataset.id, el.value); },
      'assign-driver': (el) => this.assignDriverToVehicle(el.dataset.id, el.value)
    };
  },

  bindEvents() {
    const click = this.getClickActions();
    const change = this.getChangeActions();

    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-action]');
      if (el && el.tagName !== 'SELECT' && !el.disabled && click[el.dataset.action]) {
        click[el.dataset.action](el);
        return;
      }
      const closer = e.target.closest('[data-close]');
      if (closer) {
        const id = closer.getAttribute('data-close');
        if (id === 'assignModal') this.closeAssignModal();
        else document.getElementById(id)?.classList.add('hidden');
      }
    });
    document.addEventListener('change', (e) => {
      const el = e.target.closest('select[data-action]');
      if (el && change[el.dataset.action]) change[el.dataset.action](el);
    });
    // Клавіатура для варіантів у модалці призначення
    document.getElementById('modalVehiclesList')?.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-action="assign"]')) {
        e.preventDefault();
        e.target.click();
      }
    });

    // Клік по фону модалки закриває її (крім паузи та банкрутства)
    ['assignModal', 'helpModal'].forEach(id => {
      document.getElementById(id)?.addEventListener('mousedown', (e) => {
        if (e.target.id === id) id === 'assignModal' ? this.closeAssignModal() : e.target.classList.add('hidden');
      });
    });

    // Навігація
    document.querySelectorAll('.rail-btn[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.getAttribute('data-tab')));
    });
    document.querySelectorAll('.chip[data-filter]').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.chip[data-filter]').forEach(c => c.classList.toggle('active', c === chip));
        this.state.activeFilter = chip.getAttribute('data-filter');
        this.renderContractsUI();
      });
    });
    document.querySelectorAll('.chip[data-shopnet]').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.chip[data-shopnet]').forEach(c => c.classList.toggle('active', c === chip));
        this.shopFilter = chip.getAttribute('data-shopnet');
        this.renderShopUI();
      });
    });
    document.querySelectorAll('.seg-btn[data-subtab]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.driverSubtab = btn.getAttribute('data-subtab');
        this.renderDriversUI();
      });
    });

    // Час
    document.querySelectorAll('[data-speed]').forEach(btn => {
      btn.addEventListener('click', () => {
        const v = Number(btn.getAttribute('data-speed'));
        if (v === 0) this.toggleMapFreeze();
        else this.setSpeed(v);
      });
    });
    document.getElementById('btnUnfreezeMap')?.addEventListener('click', () => this.toggleMapFreeze());

    // Верхня панель
    document.getElementById('btnProfile')?.addEventListener('click', () => this.openPauseMenu('profile'));
    document.getElementById('btnMenu')?.addEventListener('click', () => this.togglePauseMenu());
    document.getElementById('btnHelp')?.addEventListener('click', () => document.getElementById('helpModal')?.classList.remove('hidden'));
    document.getElementById('btnRestartTutorialFromHelp')?.addEventListener('click', () => {
      document.getElementById('helpModal')?.classList.add('hidden');
      this.startTutorial();
    });

    // Меню паузи
    document.getElementById('btnResumeGame')?.addEventListener('click', () => this.closePauseMenu());
    document.querySelectorAll('.tab[data-ptab]').forEach(btn => {
      btn.addEventListener('click', () => this.setPauseTab(btn.getAttribute('data-ptab')));
    });
    document.getElementById('btnSaveProfile')?.addEventListener('click', () => this.saveProfileFromForm());
    document.getElementById('profileAvatars')?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-avatar]');
      if (!btn) return;
      this.state.ownerAvatar = btn.getAttribute('data-avatar');
      this.updateBrand();
      this.renderProfile();
      this.requestSave();
    });
    document.getElementById('profileColors')?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-color]');
      if (!btn) return;
      this.state.brandColor = btn.getAttribute('data-color');
      this.updateBrand();
      this.renderProfile();
      this.requestSave();
    });
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.addEventListener('click', () => this.setLanguage(btn.getAttribute('data-lang')));
    });

    const volSlider = document.getElementById('volumeSlider');
    volSlider?.addEventListener('input', () => {
      const val = parseInt(volSlider.value, 10);
      this.setText('volumePercent', `${val}%`);
      this.sound.setVolume(val / 100);
      this.saveSettings({ volume: val });
    });
    document.getElementById('btnTestSound')?.addEventListener('click', () => this.sound.playCash());
    document.getElementById('toggleSoundEffects')?.addEventListener('change', (e) => {
      this.sound.setEnabled(e.target.checked);
      this.saveSettings({ sound: e.target.checked });
    });

    document.getElementById('btnSaveNow')?.addEventListener('click', () => {
      if (this.saveGame()) this.showToast(`💾 ${this.t('save_saved')}`, 'success');
      this.renderSettingsInfo();
    });
    document.getElementById('btnExportSave')?.addEventListener('click', () => this.exportSave());
    document.getElementById('importFilePause')?.addEventListener('change', (e) => {
      this.importSave(e.target.files[0]);
      e.target.value = '';
    });
    document.getElementById('btnRestartTutorialFromPause')?.addEventListener('click', () => {
      this.closePauseMenu();
      this.startTutorial();
    });
    document.getElementById('btnOpenHelpFromPause')?.addEventListener('click', () => {
      this.closePauseMenu();
      document.getElementById('helpModal')?.classList.remove('hidden');
    });
    document.getElementById('btnToTitle')?.addEventListener('click', () => {
      this.saveGame();
      this.openTitleScreen();
    });
    document.getElementById('btnRestartGameFromPause')?.addEventListener('click', () => this.requestNewCompany());

    // Туторіал
    document.getElementById('btnSkipTutorial')?.addEventListener('click', () => this.closeTutorial());
    document.getElementById('btnTutNext')?.addEventListener('click', () => this.nextTutorialStep());
    document.getElementById('btnTutPrev')?.addEventListener('click', () => this.prevTutorialStep());
    document.getElementById('tutDotsContainer')?.addEventListener('click', (e) => {
      const dot = e.target.closest('[data-tut-step]');
      if (dot) this.renderTutorialStep(Number(dot.getAttribute('data-tut-step')));
    });

    // Мапа
    this.canvas.addEventListener('mousemove', (e) => this.handleCanvasHover(e));
    this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
    this.canvas.addEventListener('mouseleave', () => {
      this.tooltip.classList.add('hidden');
      this.state.hoveredCity = null;
    });

    window.addEventListener('keydown', (e) => this.handleKey(e));
  },

  handleKey(e) {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);

    if (e.key === 'Escape') {
      if (this.screen === 'setup') { if (this.setupDraft?.step > 0) this.wizardBack(); else this.closeSetupScreen(); return; }
      if (this.screen !== 'game') return;
      if (!document.getElementById('assignModal').classList.contains('hidden')) { this.closeAssignModal(); return; }
      const help = document.getElementById('helpModal');
      if (!help.classList.contains('hidden')) { help.classList.add('hidden'); return; }
      if (this.isTutorialOpen()) { this.closeTutorial(); return; }
      this.togglePauseMenu();
      return;
    }

    if (this.screen === 'title' && e.key === 'Enter' && !typing) {
      if (SaveStore.hasSave()) this.continueGame(); else this.openSetupScreen(false);
      return;
    }

    if (this.screen !== 'game' || typing || this.isPauseOpen() || e.ctrlKey || e.metaKey || e.altKey) return;

    // Гарячі клавіші: пробіл — пауза, 1/2/3 — швидкість, Q..U — вкладки
    const tabs = { q: 'contracts', w: 'fleet', e: 'shop', r: 'garages', t: 'drivers', y: 'upgrades', u: 'finance' };
    if (e.code === 'Space') { e.preventDefault(); this.toggleMapFreeze(); }
    else if (e.key === '1') this.setSpeed(1);
    else if (e.key === '2') this.setSpeed(2);
    else if (e.key === '3') this.setSpeed(4);
    else if (tabs[e.key.toLowerCase()]) this.switchTab(tabs[e.key.toLowerCase()]);
  }
});
