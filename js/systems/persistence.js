// =============================================================================
// Збереження.
//   eurotrans_save      — поточна компанія: { version, savedAt, summary, state }
//   eurotrans_settings  — мова, звук, туторіал, остання вкладка
//   eurotrans_career    — кар'єра власника через усі компанії
//   eurotrans_archive   — підсумки закритих компаній (до 8 записів)
// Старі ключі (v3 і раніше) автоматично мігрують при першому завантаженні.
// =============================================================================

const SaveStore = (() => {
  const KEYS = {
    save: 'eurotrans_save',
    settings: 'eurotrans_settings',
    career: 'eurotrans_career',
    archive: 'eurotrans_archive',
    legacySave: 'eurotrans_save_v3'
  };
  const DEFAULT_SETTINGS = { lang: 'uk', volume: 70, sound: true, tutorialDone: false, lastTab: 'contracts' };

  function storage() {
    try {
      const s = globalThis.localStorage;
      const probe = '__eurotrans_probe__';
      s.setItem(probe, '1');
      s.removeItem(probe);
      return s;
    } catch (e) {
      return null;
    }
  }

  function readJSON(key, fallback) {
    const s = storage();
    if (!s) return fallback;
    try {
      const raw = s.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    const s = storage();
    if (!s) return false;
    try {
      s.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function summarize(state) {
    return {
      company: state.companyName,
      owner: state.ownerName,
      avatar: state.ownerAvatar,
      brandColor: state.brandColor,
      homeBase: state.homeBase,
      difficulty: state.difficulty,
      day: state.day,
      money: Math.round(state.money),
      deliveries: state.deliveriesCount,
      value: typeof Economy !== 'undefined' ? Economy.companyValue(state) : Math.round(state.money),
      bankrupt: !!state.bankrupt
    };
  }

  // Сирі дані стану з конверта або зі старого формату
  function readSaveData() {
    const env = readJSON(KEYS.save, null);
    if (env && env.state) return env;
    const legacy = readJSON(KEYS.legacySave, null);
    if (legacy && Array.isArray(legacy.fleet)) return { version: 3, savedAt: null, summary: null, state: legacy };
    return null;
  }

  function isValidState(data) {
    return !!data && typeof data === 'object' && Array.isArray(data.fleet) && data.fleet.length > 0 &&
      typeof data.money === 'number' && typeof data.homeBase === 'string' && !!CITIES[data.homeBase];
  }

  return {
    KEYS,
    available() { return !!storage(); },

    loadSettings() {
      const s = storage();
      const settings = { ...DEFAULT_SETTINGS, ...readJSON(KEYS.settings, {}) };
      // Міграція окремих ключів старих версій
      if (s && !s.getItem(KEYS.settings)) {
        const lang = s.getItem('eurotrans_lang');
        const vol = s.getItem('eurotrans_volume');
        const snd = s.getItem('eurotrans_sound_enabled');
        if (lang) settings.lang = lang;
        if (vol !== null) settings.volume = parseInt(vol, 10) || 0;
        if (snd !== null) settings.sound = snd === 'true';
        if (s.getItem('eurotrans_tutorial_completed')) settings.tutorialDone = true;
        writeJSON(KEYS.settings, settings);
        ['eurotrans_lang', 'eurotrans_volume', 'eurotrans_sound_enabled', 'eurotrans_tutorial_completed', 'eurotrans_theme']
          .forEach(k => s.removeItem(k));
      }
      if (!['uk', 'sk', 'en', 'de'].includes(settings.lang)) settings.lang = 'uk';
      return settings;
    },

    saveSettings(settings) { return writeJSON(KEYS.settings, settings); },

    hasSave() { return isValidState(readSaveData()?.state); },

    // Короткий опис збереження для титульного екрана
    peek() {
      const env = readSaveData();
      if (!env || !isValidState(env.state)) return null;
      return { savedAt: env.savedAt, summary: env.summary || summarize(env.state) };
    },

    load() {
      const env = readSaveData();
      if (!env || !isValidState(env.state)) return null;
      const state = GameState.fromJSON(env.state);
      // Після міграції пишемо вже у новому форматі
      if (env.version !== SAVE_VERSION) {
        writeJSON(KEYS.save, { version: SAVE_VERSION, savedAt: Date.now(), summary: summarize(state), state });
        const s = storage();
        if (s) s.removeItem(KEYS.legacySave);
      }
      return state;
    },

    save(state) {
      const savedAt = Date.now();
      const ok = writeJSON(KEYS.save, { version: SAVE_VERSION, savedAt, summary: summarize(state), state });
      return ok ? savedAt : null;
    },

    clear() {
      const s = storage();
      if (s) { s.removeItem(KEYS.save); s.removeItem(KEYS.legacySave); }
    },

    // Файл для експорту: той самий конверт, що й у сховищі
    exportPayload(state) {
      return JSON.stringify({ game: 'EuroTrans Logistics', version: SAVE_VERSION, savedAt: Date.now(), summary: summarize(state), state }, null, 2);
    },

    parseImport(text) {
      const data = JSON.parse(text);
      const raw = data && data.state ? data.state : data;
      if (!isValidState(raw)) throw new Error('invalid save');
      return GameState.fromJSON(raw);
    },

    loadCareer() { return { companies: 0, earned: 0, deliveries: 0, km: 0, ...readJSON(KEYS.career, {}) }; },
    saveCareer(career) { return writeJSON(KEYS.career, career); },

    loadArchive() { return readJSON(KEYS.archive, []); },
    archive(state, reason) {
      const list = readJSON(KEYS.archive, []);
      list.unshift({ ...summarize(state), closedAt: Date.now(), reason });
      writeJSON(KEYS.archive, list.slice(0, 8));
    },

    summarize
  };
})();

if (typeof EuroLogisticsGame !== 'undefined') Object.assign(EuroLogisticsGame.prototype, {
  saveGame() {
    if (this.setupOpen || !this.state || !this.state.fleet.length) return false;
    const savedAt = SaveStore.save(this.state);
    this.saveDirty = false;
    this.updateSaveIndicator(savedAt);
    return !!savedAt;
  },

  // Відкладене збереження після дій гравця (кілька дій поспіль — один запис)
  requestSave() {
    this.saveDirty = true;
    clearTimeout(this._saveTimer);
    this._saveTimer = setTimeout(() => this.saveGame(), 600);
  },

  loadGame() {
    const state = SaveStore.load();
    if (!state) return false;
    state.lang = this.settings.lang;
    this.state = state;
    this.invalidateModifiers();
    return true;
  },

  updateSaveIndicator(savedAt) {
    const el = document.getElementById('saveStatus');
    if (!el) return;
    if (!SaveStore.available() || !savedAt) {
      el.className = 'save-status error';
      el.textContent = `⚠ ${this.t('save_failed')}`;
      return;
    }
    const time = new Date(savedAt).toLocaleTimeString(this.state.lang === 'en' ? 'en-GB' : this.state.lang, { hour: '2-digit', minute: '2-digit' });
    el.className = 'save-status ok flash';
    el.textContent = `${this.t('save_saved')} · ${time}`;
    el.title = this.t('save_hint');
    clearTimeout(this._flashTimer);
    this._flashTimer = setTimeout(() => el.classList.remove('flash'), 900);
  },

  saveSettings(patch = {}) {
    Object.assign(this.settings, patch);
    SaveStore.saveSettings(this.settings);
  },

  // Кар'єра власника тримається в пам'яті й пишеться разом зі збереженням
  getCareer() {
    if (!this._career) this._career = SaveStore.loadCareer();
    return this._career;
  },

  bumpCareer(delta) {
    const c = this.getCareer();
    Object.keys(delta).forEach(k => { c[k] = (c[k] || 0) + delta[k]; });
    SaveStore.saveCareer(c);
  },

  exportSave() {
    if (!this.state || !this.state.fleet.length) return;
    this.saveGame();
    const blob = new Blob([SaveStore.exportPayload(this.state)], { type: 'application/json' });
    const a = document.createElement('a');
    const safeName = this.state.companyName.replace(/[^\p{L}\p{N}_-]+/gu, '_').slice(0, 30) || 'company';
    a.href = URL.createObjectURL(blob);
    a.download = `eurotrans_${safeName}_day${this.state.day}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 0);
    this.showToast(`📤 ${this.t('toast_save_exported')}`, 'success');
  },

  importSave(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const state = SaveStore.parseImport(String(reader.result));
        state.lang = this.settings.lang;
        this.state = state;
        this.invalidateModifiers();
        this.enterGame();
        this.saveGame();
        this.showToast(this.tTemplate('toast_save_imported', { company: state.companyName, day: state.day }), 'success');
      } catch (e) {
        this.showToast(`⚠ ${this.t('toast_import_failed')}`, 'error');
      }
    };
    reader.readAsText(file);
  }
});
