// =============================================================================
// Титульний екран, майстер заснування компанії (4 кроки) і банкрутство
// =============================================================================

const WIZARD_STEPS = 4;
const SETUP_PANEL_WIDTH = 560;

Object.assign(EuroLogisticsGame.prototype, {
  // ---- Титульний екран ----------------------------------------------------
  openTitleScreen() {
    this.screen = 'title';
    this.setupOpen = true;
    this.setSpeed(0);
    this.closeTutorial(false);
    this.closeAssignModal();
    document.getElementById('pauseModal')?.classList.add('hidden');
    document.getElementById('setupScreen')?.classList.add('hidden');
    document.getElementById('titleScreen')?.classList.remove('hidden');
    document.body.classList.add('title-active');
    document.body.classList.remove('setup-active');
    this.setMapInset(0);
    this.renderTitleScreen();
    setTimeout(() => document.getElementById(SaveStore.hasSave() ? 'btnContinue' : 'btnNewCompany')?.focus(), 50);
  },

  renderTitleScreen() {
    const peek = SaveStore.peek();
    const card = document.getElementById('titleContinue');
    const btn = document.getElementById('btnContinue');
    if (peek && card && btn) {
      const s = peek.summary;
      const base = this.getBase(s.homeBase);
      card.innerHTML = `
        <div class="cc-badge" style="--brand:${this.esc(s.brandColor || '#ffa53d')}">${this.esc(this.monogram(s.company))}</div>
        <div class="cc-info">
          <div class="cc-company">${this.esc(s.company)}</div>
          <div class="cc-owner">${this.esc(s.avatar || '')} ${this.esc(s.owner)} · ◆ ${this.getCityName(s.homeBase)}${base ? ` · ${base.icon}` : ''}</div>
          <div class="cc-stats">
            <span><b class="mono">${this.t('day_prefix')} ${s.day}</b></span>
            <span><b class="mono">${this.fmtMoney(s.money)}</b> ${this.t('stat_capital').toLowerCase()}</span>
            <span><b class="mono">${s.deliveries}</b> ${this.t('stat_deliveries').toLowerCase()}</span>
            <span><b class="mono">${this.fmtMoney(s.value)}</b> ${this.t('hud_company_value').toLowerCase()}</span>
          </div>
          ${peek.savedAt ? `<div class="cc-saved">💾 ${this.t('title_saved_at')} ${this.formatAgo(peek.savedAt)}</div>` : ''}
          ${s.bankrupt ? `<div class="tag bad">📉 ${this.t('bankrupt_title')}</div>` : ''}
        </div>`;
      card.classList.remove('hidden');
      btn.classList.remove('hidden');
    } else {
      card?.classList.add('hidden');
      btn?.classList.add('hidden');
    }
    // Один головний заклик: «Продовжити», якщо є збереження, інакше «Нова компанія»
    document.getElementById('btnNewCompany')?.classList.toggle('btn-primary', !peek);

    const archive = SaveStore.loadArchive();
    const arch = document.getElementById('titleArchive');
    if (arch) {
      arch.classList.toggle('hidden', !archive.length);
      arch.innerHTML = archive.length ? `
        <div class="archive-title">${this.t('archive_title')}</div>
        ${archive.slice(0, 3).map(a => `
          <div class="archive-row">
            <span class="cc-badge sm" style="--brand:${this.esc(a.brandColor || '#ffa53d')}">${this.esc(this.monogram(a.company))}</span>
            <span class="grow">${this.esc(a.company)} <span class="muted">· ${this.t('day_prefix')} ${a.day}</span></span>
            <span class="mono ${a.reason === 'bankrupt' ? 'neg' : ''}">${a.reason === 'bankrupt' ? '📉' : '🏁'} ${this.fmtMoney(a.value)}</span>
          </div>`).join('')}` : '';
    }

    const storage = document.getElementById('titleStorage');
    if (storage) storage.textContent = SaveStore.available() ? `💾 ${this.t('title_autosave_on')}` : `⚠ ${this.t('save_failed')}`;
  },

  formatAgo(ts) {
    const sec = Math.max(0, Math.round((Date.now() - ts) / 1000));
    if (sec < 60) return this.t('ago_just_now');
    const min = Math.round(sec / 60);
    if (min < 60) return this.tTemplate('ago_minutes', { n: min });
    const h = Math.round(min / 60);
    if (h < 48) return this.tTemplate('ago_hours', { n: h });
    return new Date(ts).toLocaleDateString();
  },

  continueGame() {
    if (!this.loadGame()) {
      this.showToast(`⚠ ${this.t('toast_import_failed')}`, 'error');
      this.renderTitleScreen();
      return;
    }
    this.enterGame();
    this.showToast(this.tTemplate('toast_game_loaded', { company: this.state.companyName, day: this.state.day }), 'success');
  },

  // ---- Майстер заснування -------------------------------------------------
  openSetupScreen(fromGame = false) {
    this.setupReturnToGame = fromGame;
    this.screen = 'setup';
    this.setupOpen = true;
    this.closeTutorial(false);
    this.closeAssignModal();
    this.setSpeed(0);
    document.getElementById('titleScreen')?.classList.add('hidden');
    document.getElementById('pauseModal')?.classList.add('hidden');
    document.getElementById('bankruptModal')?.classList.add('hidden');
    document.getElementById('setupScreen')?.classList.remove('hidden');
    document.body.classList.remove('title-active');
    document.body.classList.add('setup-active');
    this.setMapInset(Math.min(SETUP_PANEL_WIDTH, window.innerWidth * 0.5));

    const prevOwner = fromGame || this.state.bankrupt ? this.state.ownerName : '';
    this.setupDraft = {
      step: 0,
      ownerName: prevOwner || '',
      avatar: (fromGame && this.state.ownerAvatar) || OWNER_AVATARS[0],
      background: OWNER_BACKGROUNDS[0].id,
      companyName: '',
      brandColor: BRAND_COLORS[0],
      homeBase: 'berlin',
      difficulty: 'normal'
    };
    document.getElementById('setupOwnerName').value = this.setupDraft.ownerName;
    document.getElementById('setupCompanyName').value = '';
    this.renderSetupScreen();
    setTimeout(() => document.getElementById('setupOwnerName')?.focus(), 60);
  },

  closeSetupScreen() {
    if (this.setupReturnToGame) {
      document.getElementById('setupScreen')?.classList.add('hidden');
      document.body.classList.remove('setup-active');
      this.setMapInset(0);
      this.enterGame();
    } else {
      this.openTitleScreen();
    }
  },

  // Характеристики штабу для порівняння
  getBaseStats(cityId) {
    const ids = Object.keys(CITIES);
    const avg = ids.reduce((t, id) => t + this.cityDistance(cityId, id), 0) / (ids.length - 1);
    const road = Routing.graphs.road[cityId]?.length || 0;
    const rail = Routing.graphs.rail[cityId]?.length || 0;
    return {
      centrality: Math.round(Math.max(0, Math.min(100, (2000 - avg) / 13))),
      road,
      rail,
      avgKm: Math.round(avg)
    };
  },

  renderSetupScreen() {
    const d = this.setupDraft;
    if (!d) return;

    document.querySelectorAll('#setupStepper li').forEach(li => {
      const i = Number(li.getAttribute('data-step'));
      li.classList.toggle('active', i === d.step);
      li.classList.toggle('done', i < d.step);
    });
    document.querySelectorAll('.wiz-step').forEach(sec => sec.classList.toggle('active', Number(sec.getAttribute('data-step')) === d.step));
    document.getElementById('btnWizBack').disabled = d.step === 0;
    document.getElementById('btnWizNext').textContent = d.step === WIZARD_STEPS - 1 ? this.t('setup_start_btn') : this.t('btn_wiz_next');
    document.getElementById('btnSetupCancel').classList.toggle('hidden', !this.setupReturnToGame && !SaveStore.hasSave() && !this.state.bankrupt);

    document.getElementById('setupAvatars').innerHTML = OWNER_AVATARS.map(a =>
      `<button type="button" class="avatar-pick ${a === d.avatar ? 'active' : ''}" data-avatar="${a}" aria-pressed="${a === d.avatar}">${a}</button>`).join('');

    document.getElementById('setupBackgrounds').innerHTML = OWNER_BACKGROUNDS.map(b => `
      <button type="button" class="option ${b.id === d.background ? 'active' : ''}" data-background="${b.id}" aria-pressed="${b.id === d.background}">
        <span class="option-icon">${b.icon}</span>
        <span class="option-title">${this.L(b.title)}</span>
        <span class="option-desc">${this.L(b.desc)}</span>
      </button>`).join('');

    document.getElementById('setupColors').innerHTML = BRAND_COLORS.map(c =>
      `<button type="button" class="swatch ${c === d.brandColor ? 'active' : ''}" data-color="${c}" style="--sw:${c}" aria-label="${c}"></button>`).join('');

    document.getElementById('setupBases').innerHTML = STARTING_BASES.map(b => {
      const st = this.getBaseStats(b.cityId);
      return `
        <button type="button" class="base-option ${b.cityId === d.homeBase ? 'active' : ''}" data-base="${b.cityId}">
          <span class="bo-head">
            <span class="option-icon">${b.icon}</span>
            <span class="bo-city">${this.getCityName(b.cityId)} <small>${this.getCountryName(b.cityId)}</small></span>
            <span class="bo-perk">${this.L(b.title)}</span>
          </span>
          <span class="option-desc">${this.L(b.desc)}</span>
          <span class="bo-stats">
            <span class="stat-bar"><em>${this.t('wiz_centrality')}</em><i><b style="width:${st.centrality}%"></b></i></span>
            <span class="bo-links">🛣️ ${st.road} · 🚂 ${st.rail}</span>
          </span>
        </button>`;
    }).join('');

    document.getElementById('setupDifficulty').innerHTML = Object.entries(DIFFICULTIES).map(([id, diff]) => `
      <button type="button" class="option ${id === d.difficulty ? 'active' : ''}" data-difficulty="${id}">
        <span class="option-icon">${diff.icon}</span>
        <span class="option-title">${this.L(diff.title)}</span>
        <span class="option-desc">${this.L(diff.desc)}</span>
      </button>`).join('');

    this.renderSetupSummary();
    this.renderSetupPreview();
  },

  // Стартові умови з урахуванням усіх виборів
  previewStartState() {
    const d = this.setupDraft;
    return new GameState({ homeBase: d.homeBase, ownerBackground: d.background, difficulty: d.difficulty });
  },

  renderSetupSummary() {
    const d = this.setupDraft;
    const s = this.previewStartState();
    const bg = OWNER_BACKGROUNDS.find(b => b.id === d.background);
    const base = this.getBase(d.homeBase);
    const diff = DIFFICULTIES[d.difficulty];
    document.getElementById('setupSummary').innerHTML = `
      <div class="kv"><span>${this.t('stat_capital')}</span><b class="mono pos">${this.fmtMoney(s.money)}</b></div>
      <div class="kv"><span>${this.t('wiz_credit_limit')}</span><b class="mono">${this.fmtMoney(Economy.creditLimit(s))}</b></div>
      <div class="kv"><span>${this.t('garage_upkeep_label')}</span><b class="mono">−${this.fmtMoney(Economy.dailyUpkeep(s))}/${this.t('day_unit')}</b></div>
      <div class="kv"><span>${this.t('wiz_bankrupt_after')}</span><b class="mono">${diff.bankruptDays} ${this.t('day_unit')}</b></div>
      <div class="kv"><span>${bg.icon} ${this.L(bg.title)}</span><span class="muted">${this.L(bg.desc)}</span></div>
      <div class="kv"><span>${base.icon} ${this.L(base.title)}</span><span class="muted">${this.L(base.desc)}</span></div>`;
  },

  renderSetupPreview() {
    const d = this.setupDraft;
    const el = document.getElementById('setupPreview');
    if (!el) return;
    const bg = OWNER_BACKGROUNDS.find(b => b.id === d.background);
    const base = this.getBase(d.homeBase);
    const diff = DIFFICULTIES[d.difficulty];
    const company = d.companyName.trim() || this.t('wiz_company_placeholder');
    const owner = d.ownerName.trim() || this.t('wiz_owner_placeholder');
    el.style.setProperty('--brand', d.brandColor);
    el.classList.toggle('compact', d.step === 2);
    el.innerHTML = `
      <div class="pc-kicker">${this.t('wiz_preview')}</div>
      <div class="pc-head">
        <div class="cc-badge lg" style="--brand:${d.brandColor}">${this.esc(this.monogram(company))}</div>
        <div>
          <div class="pc-company">${this.esc(company)}</div>
          <div class="pc-owner">${d.avatar} ${this.esc(owner)}</div>
        </div>
      </div>
      <div class="pc-truck" aria-hidden="true">
        <div class="pc-trailer"><span>${this.esc(company)}</span></div><div class="pc-cab"></div>
        <i class="pc-wheel w1"></i><i class="pc-wheel w2"></i><i class="pc-wheel w3"></i>
      </div>
      <div class="pc-rows">
        <div><span>${this.t('wiz_background_label')}</span><b>${bg.icon} ${this.L(bg.title)}</b></div>
        <div><span>${this.t('profile_base')}</span><b>◆ ${this.getCityName(d.homeBase)} · ${this.L(base.title)}</b></div>
        <div><span>${this.t('wiz_difficulty_label')}</span><b>${diff.icon} ${this.L(diff.title)}</b></div>
      </div>`;
  },

  validateSetupStep() {
    const d = this.setupDraft;
    if (d.step === 0) {
      d.ownerName = document.getElementById('setupOwnerName').value.trim();
      const ok = d.ownerName.length >= 2;
      document.getElementById('setupOwnerName').closest('.field').classList.toggle('invalid', !ok);
      if (!ok) document.getElementById('setupOwnerName').focus();
      return ok;
    }
    if (d.step === 1) {
      d.companyName = document.getElementById('setupCompanyName').value.trim();
      const ok = d.companyName.length >= 2;
      document.getElementById('setupCompanyName').closest('.field').classList.toggle('invalid', !ok);
      if (!ok) document.getElementById('setupCompanyName').focus();
      return ok;
    }
    return true;
  },

  wizardNext() {
    if (!this.validateSetupStep()) return;
    if (this.setupDraft.step < WIZARD_STEPS - 1) {
      this.setupDraft.step++;
      if (this.setupDraft.step === 1 && !document.getElementById('setupCompanyName').value.trim()) {
        // Підказка-назва, яку можна змінити
        const cityEn = (typeof CITIES_I18N !== 'undefined' && CITIES_I18N[this.setupDraft.homeBase]?.en) || this.pickRandom(COMPANY_NAME_PARTS.first);
        this.setupDraft.companyName = `${cityEn} ${this.pickRandom(COMPANY_NAME_PARTS.second)}`;
        document.getElementById('setupCompanyName').value = this.setupDraft.companyName;
      }
      this.sound.playOrderAccepted();
      this.renderSetupScreen();
      const focusId = this.setupDraft.step === 1 ? 'setupCompanyName' : null;
      if (focusId) setTimeout(() => document.getElementById(focusId)?.select(), 40);
    } else {
      this.foundCompany();
    }
  },

  wizardBack() {
    if (this.setupDraft.step > 0) {
      this.setupDraft.step--;
      this.renderSetupScreen();
    }
  },

  randomCompanyName() {
    const name = `${this.pickRandom(COMPANY_NAME_PARTS.first)} ${this.pickRandom(COMPANY_NAME_PARTS.second)}`;
    this.setupDraft.companyName = name;
    document.getElementById('setupCompanyName').value = name;
    document.getElementById('setupCompanyName').closest('.field').classList.remove('invalid');
    this.renderSetupPreview();
  },

  selectSetupBase(cityId) {
    if (!STARTING_BASES.some(b => b.cityId === cityId)) return;
    this.setupDraft.homeBase = cityId;
    this.sound.playOrderAccepted();
    this.renderSetupScreen();
  },

  bindSetupEvents() {
    const setup = document.getElementById('setupScreen');
    setup?.addEventListener('click', (e) => {
      const d = this.setupDraft;
      if (!d) return;
      const pick = (attr) => e.target.closest(`[${attr}]`)?.getAttribute(attr);
      const avatar = pick('data-avatar');
      const background = pick('data-background');
      const color = pick('data-color');
      const base = pick('data-base');
      const difficulty = pick('data-difficulty');
      if (avatar) d.avatar = avatar;
      if (background) d.background = background;
      if (color) d.brandColor = color;
      if (difficulty) d.difficulty = difficulty;
      if (base) { this.selectSetupBase(base); return; }
      if (avatar || background || color || difficulty) this.renderSetupScreen();
    });

    ['setupOwnerName', 'setupCompanyName'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', (e) => {
        if (!this.setupDraft) return;
        this.setupDraft[id === 'setupOwnerName' ? 'ownerName' : 'companyName'] = e.target.value;
        e.target.closest('.field').classList.remove('invalid');
        this.renderSetupPreview();
      });
    });

    document.getElementById('setupForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.wizardNext();
    });
    document.getElementById('btnWizBack')?.addEventListener('click', () => this.wizardBack());
    document.getElementById('btnRandomName')?.addEventListener('click', () => this.randomCompanyName());
    document.getElementById('btnSetupCancel')?.addEventListener('click', () => this.closeSetupScreen());
    document.querySelectorAll('#setupStepper li').forEach(li => li.addEventListener('click', () => {
      const target = Number(li.getAttribute('data-step'));
      // Повертатися можна завжди, вперед — лише через перевірку
      if (target < this.setupDraft.step) { this.setupDraft.step = target; this.renderSetupScreen(); }
      else if (target === this.setupDraft.step + 1) this.wizardNext();
    }));

    // Титульний екран
    document.getElementById('btnContinue')?.addEventListener('click', () => this.continueGame());
    document.getElementById('btnNewCompany')?.addEventListener('click', () => {
      const peek = SaveStore.peek();
      if (peek && !peek.summary.bankrupt && !confirm(this.tTemplate('confirm_overwrite', { company: peek.summary.company }))) return;
      this.openSetupScreen(false);
    });
    document.getElementById('importFileTitle')?.addEventListener('change', (e) => {
      this.importSave(e.target.files[0]);
      e.target.value = '';
    });
    document.getElementById('btnBankruptNew')?.addEventListener('click', () => this.openSetupScreen(false));
  },

  foundCompany() {
    const d = this.setupDraft;
    // Попередня компанія йде в архів
    const prev = SaveStore.load();
    if (prev) SaveStore.archive(prev, prev.bankrupt ? 'bankrupt' : 'closed');

    this.state = new GameState({
      homeBase: d.homeBase,
      ownerName: d.ownerName.slice(0, 32),
      companyName: d.companyName.slice(0, 32),
      ownerAvatar: d.avatar,
      ownerBackground: d.background,
      brandColor: d.brandColor,
      difficulty: d.difficulty,
      lang: this.settings.lang
    });
    this.state.initDefaultFleet();
    this.generateCandidateDrivers();
    this.generateInitialContracts();
    this.bumpCareer({ companies: 1 });
    this.setupDraft = null;
    this.state.selectedCity = null;
    this.setMapInset(0);

    this.enterGame();
    this.saveGame();
    this.sound.playCash();
    this.showToast(this.tTemplate('toast_company_founded', { company: this.state.companyName, city: this.getCityName(this.state.homeBase) }), 'success');
  },

  requestNewCompany() {
    if (!confirm(this.t('toast_confirm_reset'))) return;
    if (this.state.timeSpeed > 0) this.prePauseSpeed = this.state.timeSpeed;
    this.saveGame();
    this.openSetupScreen(true);
  },

  // ---- Банкрутство ----------------------------------------------------------
  openBankruptcyScreen() {
    const s = this.state;
    const kpi = (label, value) => `<div class="kpi"><span class="kpi-label">${label}</span><span class="kpi-value">${value}</span></div>`;
    document.getElementById('bankruptStats').innerHTML = [
      kpi(this.t('profile_days'), s.day),
      kpi(this.t('stat_orders_done'), s.stats.onTime + s.stats.late),
      kpi(this.t('stat_total_earned'), this.fmtMoney(s.stats.totalEarned)),
      kpi(this.t('stat_capital'), this.fmtMoney(s.money)),
      kpi(this.t('finance_loan'), this.fmtMoney(s.loan)),
      kpi(this.t('stat_best_payout'), this.fmtMoney(s.stats.bestPayout))
    ].join('');
    document.getElementById('bankruptModal').classList.remove('hidden');
    this.sound.playWarning();
  }
});
