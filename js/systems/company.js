// =============================================================================
// Компанія: бази, апгрейди, події, кінець дня, банкрутство
// =============================================================================
Object.assign(EuroLogisticsGame.prototype, {
  buyGarage(cityId) {
    if (this.state.garages[cityId]) return;
    const tier1 = GARAGE_TIERS[1];
    if (!this.canAfford(tier1.cost)) {
      this.showToast(this.t('btn_not_enough_funds'), 'error');
      return;
    }

    this.spend(tier1.cost, 'garages');
    this.state.stats.garagesOpened++;
    const cityName = this.getCityName(cityId);
    this.state.garages[cityId] = { cityId, level: 1, name: `${cityName}: ${tier1.name}`, slots: tier1.slots };

    this.sound.playCash();
    this.showToast(`🏠 ${this.t('toast_garage_bought')} ${cityName} (+${tier1.slots})`, 'success');
    this.checkAchievements();
    this.afterAction('garages', 'shop', 'fleet');
  },

  upgradeGarage(cityId) {
    const garage = this.state.garages[cityId];
    if (!garage || garage.level >= 3) return;

    const cost = GARAGE_TIERS[garage.level].upgradeCost;
    const nextTier = GARAGE_TIERS[garage.level + 1];
    if (!this.canAfford(cost)) {
      this.showToast(this.t('btn_not_enough_funds'), 'error');
      return;
    }

    this.spend(cost, 'garages');
    garage.level++;
    garage.slots = nextTier.slots;
    const cityName = this.getCityName(cityId);
    garage.name = `${cityName}: ${nextTier.name}`;

    this.sound.playCash();
    this.showToast(`🏗️ ${cityName} ➔ ${this.t('garage_level_label')} ${garage.level} (${nextTier.slots} ${this.t('vehicles_unit')})`, 'success');
    this.checkAchievements();
    this.afterAction('garages', 'shop', 'contracts');
  },

  toggleTradeoff(tradeoffId) {
    const t = TRADEOFFS_CONFIG.find(item => item.id === tradeoffId);
    if (!t) return;
    const tData = (typeof TRADEOFFS_I18N !== 'undefined' && TRADEOFFS_I18N[t.id]) || null;
    const title = tData ? (tData.title[this.state.lang] || t.title) : t.title;

    if (!this.state.unlockedTradeoffs[t.id]) {
      if (!this.canAfford(t.price)) {
        this.showToast(this.t('btn_not_enough_funds'), 'error');
        return;
      }
      this.spend(t.price, 'upgrades');
      this.state.unlockedTradeoffs[t.id] = true;
      this.state.activeTradeoffs[t.id] = true;
      this.sound.playCash();
      this.showToast(`⚡ ${title}`, 'success');
    } else {
      this.state.activeTradeoffs[t.id] = !this.state.activeTradeoffs[t.id];
      this.showToast(`⚙️ ${title}: ${this.state.activeTradeoffs[t.id] ? 'ON' : 'OFF'}`, 'info');
    }
    this.invalidateModifiers();
    this.afterAction('upgrades', 'contracts');
  },

  buyUpgrade(upgId) {
    const upg = UPGRADES_CONFIG.find(u => u.id === upgId);
    if (!upg) return;
    const currentLevel = this.state.upgrades[upg.id] || 0;
    if (currentLevel >= upg.maxLevel) return;

    const cost = upg.cost * (currentLevel + 1);
    if (!this.canAfford(cost)) {
      this.showToast(this.t('btn_not_enough_funds'), 'error');
      return;
    }

    this.spend(cost, 'upgrades');
    this.state.upgrades[upg.id] = currentLevel + 1;
    upg.apply(this.state);

    const uData = (typeof UPGRADES_I18N !== 'undefined' && UPGRADES_I18N[upg.id]) || null;
    const title = uData ? (uData.title[this.state.lang] || upg.title) : upg.title;
    this.sound.playCash();
    this.showToast(`✨ ${title} (${this.t('upgrade_level_prefix')} ${this.state.upgrades[upg.id]})`, 'success');
    this.afterAction('upgrades', 'contracts');
  },

  triggerRandomEvent() {
    const rawEvents = (typeof EVENTS_I18N !== 'undefined' && Array.isArray(EVENTS_I18N)) ? EVENTS_I18N : [];
    if (!rawEvents.length) return;

    const template = this.pickRandom(rawEvents);
    this.state.event = {
      ...template,
      rewardMultiplier: 1.0,
      ...(EVENT_EXTRA_EFFECTS[template.id] || {}),
      name: this.L(template.name),
      desc: this.L(template.desc),
      timer: EVENT_DURATION
    };
    this.updateTickerText();
    this.showToast(`📢 ${this.L(template.name)}`, template.type || 'info');
    this.markDirty('contracts');
  },

  resetEvent(announce) {
    this.state.event = { name: '', desc: '', fuelMultiplier: 1, speedMultiplier: 1, rewardMultiplier: 1, timer: 0 };
    this.updateTickerText();
    this.markDirty('contracts');
  },

  // Підсумок дня: утримання баз, абонплати, відсотки, звіт, банкрутство
  endOfDay() {
    const paidUpkeep = this.spend(Economy.dailyUpkeep(this.state), 'upkeep');
    const mods = this.getTradeoffModifiers();
    if (mods.dailyFee > 0) this.spend(mods.dailyFee, 'fees');
    const interest = Economy.dailyInterest(this.state);
    if (interest > 0) this.spend(interest, 'interest');

    const report = { day: this.state.day - 1, income: Math.round(this.state.today.income), expense: Math.round(this.state.today.expense) };
    this.state.history.push(report);
    if (this.state.history.length > 30) this.state.history.shift();
    this.state.today = { income: 0, expense: 0 };

    this.showToast(this.tTemplate('toast_daily_report', {
      day: report.day,
      income: report.income.toLocaleString(),
      expense: report.expense.toLocaleString(),
      upkeep: Math.round(paidUpkeep + interest).toLocaleString()
    }), report.income >= report.expense ? 'success' : 'warning');

    // Борг: кілька днів поспіль у мінусі — банкрутство
    if (this.state.money < FINANCE.bankruptLine) {
      this.state.debtDays++;
      const left = this.state.diff.bankruptDays - this.state.debtDays;
      if (left <= 0) {
        this.declareBankruptcy();
        return;
      }
      this.sound.playWarning();
      this.showToast(this.tTemplate('toast_debt_warning', { days: left }), 'error');
    } else {
      this.state.debtDays = 0;
    }

    this.refreshDriverMarket();
    this.checkAchievements();
    this.markDirty('finance');
    this.requestSave();
  },

  declareBankruptcy() {
    this.state.bankrupt = true;
    this.setSpeed(0);
    this.saveGame();
    this.openBankruptcyScreen();
  }
});
