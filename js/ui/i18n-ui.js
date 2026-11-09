// =============================================================================
// Локалізація інтерфейсу. Статичні тексти розмічені атрибутами:
//   data-i18n="key"        → textContent
//   data-i18n-title="key"  → title
//   data-i18n-ph="key"     → placeholder
// =============================================================================
Object.assign(EuroLogisticsGame.prototype, {
  t(key) {
    return typeof t === 'function' ? t(key, this.state.lang) : key;
  },

  tTemplate(key, vars = {}) {
    return typeof tTemplate === 'function' ? tTemplate(key, vars, this.state.lang) : this.t(key);
  },

  // Локалізований текст з об'єкта {uk, sk, en, de}
  L(obj) {
    if (!obj || typeof obj !== 'object') return obj || '';
    return obj[this.state.lang] || obj.uk || obj.en || '';
  },

  // Прибирає емодзі-префікс зі старих ключів («📋 Замовлення» → «Замовлення»)
  plain(key) {
    return this.t(key).replace(/^[^\p{L}\p{N}]+/u, '');
  },

  getCityName(cityId) {
    if (!cityId) return '';
    const entry = typeof CITIES_I18N !== 'undefined' ? CITIES_I18N[cityId] : null;
    return (entry && (entry[this.state.lang] || entry.uk)) || CITIES[cityId]?.name || cityId;
  },

  getCountryName(cityId) {
    const city = CITIES[cityId];
    if (!city) return '';
    return (typeof COUNTRIES_I18N !== 'undefined' && COUNTRIES_I18N[city.country]?.[this.state.lang]) || city.country;
  },

  getCargoType(contract) {
    if (contract && contract.cargoType) return contract.cargoType;
    const match = contract && CARGO_TYPES.find(ct => ct.icon === contract.cargoIcon || ct.name === contract.cargoName);
    return match ? match.id : 'consumer';
  },

  getCargoName(cargoType, fallback = '') {
    const entry = typeof CARGO_I18N !== 'undefined' ? CARGO_I18N[cargoType] : null;
    return (entry && (entry[this.state.lang] || entry.uk)) || fallback || cargoType;
  },

  getCargoDesc(cargoType) {
    const entry = typeof CARGO_I18N !== 'undefined' ? CARGO_I18N[cargoType] : null;
    return (entry && entry.desc && (entry.desc[this.state.lang] || entry.desc.uk)) || '';
  },

  getVehicleCategory(vOrTypeId, fallback = '') {
    const typeId = typeof vOrTypeId === 'object' && vOrTypeId ? vOrTypeId.typeId : vOrTypeId;
    const entry = typeof VEHICLES_I18N !== 'undefined' ? VEHICLES_I18N[typeId] : null;
    const raw = typeof vOrTypeId === 'object' && vOrTypeId ? vOrTypeId.category : fallback;
    return (entry && entry.category && (entry.category[this.state.lang] || entry.category.uk)) || raw || '';
  },

  getVehicleDesc(typeId, fallback = '') {
    const entry = typeof VEHICLES_I18N !== 'undefined' ? VEHICLES_I18N[typeId] : null;
    return (entry && entry.desc && (entry.desc[this.state.lang] || entry.desc.uk)) || fallback;
  },

  getQualificationName(q) {
    return (typeof QUALIFICATION_I18N !== 'undefined' && QUALIFICATION_I18N[q]?.[this.state.lang]) || q;
  },

  getDriverName(name) {
    if (!name || this.state.lang === 'uk') return name || '';
    return typeof transliterateUkrainian === 'function' ? transliterateUkrainian(name) : name;
  },

  updateMapCityIndicator() {
    const indicator = document.getElementById('mapCityIndicator');
    if (!indicator) return;
    const id = this.state.selectedCity;
    if (id) {
      indicator.innerHTML = `📍 <b>${this.getCityName(id)}</b> <span class="muted">${this.getCountryName(id)}</span>
        <button class="link-btn" data-action="clear-city">${this.t('btn_reset_city_filter')}</button>`;
    } else {
      indicator.innerHTML = `<span class="muted">${this.t('map_hint_default')}</span>`;
    }
  },

  updateTickerText() {
    const ticker = document.getElementById('tickerContent');
    if (!ticker) return;
    const ev = this.state.event;
    const raw = ev && ev.id && typeof EVENTS_I18N !== 'undefined' ? EVENTS_I18N.find(e => e.id === ev.id) : null;
    ticker.textContent = raw && ev.timer > 0 ? `${this.L(raw.name)} — ${this.L(raw.desc)}` : this.t('ticker_default');
    ticker.classList.toggle('live', !!(raw && ev.timer > 0));
  },

  setLanguage(lang, showToast = true) {
    if (!['sk', 'uk', 'en', 'de'].includes(lang)) return;
    this.state.lang = lang;
    this.saveSettings({ lang });
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    this.applyStaticTranslations();
    this.updateMapCityIndicator();
    this.updateTickerText();

    if (this.screen === 'title') this.renderTitleScreen();
    if (this.screen === 'setup') this.renderSetupScreen();
    if (this.screen === 'game') {
      this.updateBrand();
      this.markDirty('contracts', 'fleet', 'shop', 'garages', 'drivers', 'upgrades', 'finance', 'routes', 'hud');
      this.renderDirty(true);
      this.updateHUD();
      if (this.currentAssignContractId) this.openAssignModal(this.currentAssignContractId);
      if (this.isTutorialOpen()) this.renderTutorialStep(this.currentTutorialStep);
      const pauseModal = document.getElementById('pauseModal');
      if (pauseModal && !pauseModal.classList.contains('hidden')) this.setPauseTab(this.profileTab);
    }

    if (showToast) this.showToast(this.t('toast_lang_changed'), 'info');
  },

  applyStaticTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.plain(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      el.title = this.plain(el.getAttribute('data-i18n-title'));
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      el.placeholder = this.t(el.getAttribute('data-i18n-ph'));
    });
  }
});
