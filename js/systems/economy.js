// =============================================================================
// Економіка. Чисті формули (Economy.*) працюють лише зі станом і даними,
// тому покриті юніт-тестами; міксин нижче підключає їх до гри.
// =============================================================================

const Economy = {
  // Множник оплати від репутації: 10% → ×0.88, 80% → ×1.09, 100% → ×1.15
  reputationMultiplier(reputation) {
    return 0.85 + 0.3 * (Math.max(0, Math.min(100, reputation)) / 100);
  },

  tradeoffModifiers(activeTradeoffs) {
    const m = { speedMod: 0, fuelMod: 0, capacityMod: 0, rewardMod: 0, deadlineMod: 0, loadingMod: 0, noPenalty: false, feeMod: 0, dailyFee: 0 };
    TRADEOFFS_CONFIG.forEach(t => {
      if (!activeTradeoffs[t.id]) return;
      ['speedMod', 'fuelMod', 'capacityMod', 'rewardMod', 'deadlineMod', 'loadingMod', 'feeMod', 'dailyFee'].forEach(k => {
        if (t[k]) m[k] += t[k];
      });
      if (t.noPenalty) m.noPenalty = true;
    });
    return m;
  },

  // Бонус гаража у місті відправлення
  garagePayoutMultiplier(garage) {
    if (!garage) return 1;
    if (garage.level === 3) return 1.25;
    if (garage.level === 2) return 1.12;
    return 1;
  },

  payout(contract, onTime, { garage, mods }) {
    let payout = contract.reward * Economy.garagePayoutMultiplier(garage);
    if (!onTime && !mods.noPenalty) payout = Math.max(contract.reward * 0.5, payout - contract.penalty);
    if (mods.feeMod > 0) payout *= (1 - mods.feeMod);
    return Math.round(payout);
  },

  streakBonus(streak) {
    return Math.min(10, Math.max(0, streak)) * 0.02;
  },

  // Вартість ТЗ при продажу залежить від стану
  resaleValue(vehicle) {
    const price = vehicle.purchasePrice || 0;
    const cond = Math.max(0, Math.min(100, vehicle.condition ?? 100));
    return Math.round(price * WEAR.resaleShare * (0.4 + 0.6 * cond / 100));
  },

  serviceCost(vehicle, serviceMod = 0, atBase = true) {
    const missing = 100 - Math.max(0, Math.min(100, vehicle.condition ?? 100));
    const roadside = atBase ? 1 : 1 + WEAR.roadsideServiceMod;
    return Math.round((vehicle.purchasePrice || 0) * WEAR.serviceCostShare * (missing / 100) * (1 + serviceMod) * roadside);
  },

  // Оплата водія за рейс: ставка + кілометраж
  driverPay(driver, km) {
    if (!driver) return 0;
    return Math.round(driver.salaryPerTrip + km * DRIVER_PAY_PER_KM);
  },

  // Знос за пройдені км (у відсотках стану)
  wearForKm(km, network, { difficultyWear = 1, wearMod = 0 } = {}) {
    return km / 100 * (WEAR_PER_100KM[network] || 1) * difficultyWear * (1 + wearMod);
  },

  conditionSpeedMultiplier(condition) {
    return condition < WEAR.slowBelow ? 1 - WEAR.slowPenalty : 1;
  },

  creditLimit(state) {
    const diff = DIFFICULTIES[state.difficulty] || DIFFICULTIES.normal;
    const ownerMod = (state.ownerPerk && state.ownerPerk.creditMod) || 0;
    const raw = (diff.creditBase + state.stats.totalEarned * FINANCE.creditFromEarnings) * (1 + ownerMod);
    return Math.floor(raw / FINANCE.loanStep) * FINANCE.loanStep;
  },

  loanRate(state) {
    return (state.ownerPerk && state.ownerPerk.loanRate) || FINANCE.loanRate;
  },

  dailyInterest(state) {
    return Math.round(state.loan * Economy.loanRate(state));
  },

  dailyUpkeep(state) {
    const diff = DIFFICULTIES[state.difficulty] || DIFFICULTIES.normal;
    let total = 0;
    Object.values(state.garages).forEach(g => { total += GARAGE_UPKEEP[g.level] || 0; });
    return Math.round(total * diff.upkeep);
  },

  // Вартість компанії: гроші + техніка + бази − борг. Головний «рахунок» гравця.
  companyValue(state) {
    let fleet = 0;
    state.fleet.forEach(v => { fleet += Economy.resaleValue(v); });
    let bases = 0;
    Object.values(state.garages).forEach(g => {
      bases += GARAGE_TIERS[1].cost;
      for (let l = 1; l < g.level; l++) bases += GARAGE_TIERS[l].upgradeCost;
    });
    return Math.round(state.money + fleet + bases * 0.6 - state.loan);
  },

  // Чи може водій керувати ТЗ (за полем requiredCategory моделі)
  driverCanOperate(driver, vehicle) {
    if (!driver) return false;
    if (driver.qualification === 'all') return true;
    if (driver.qualification === vehicle.requiredCategory) return true;
    // Водій тягача впорається і з фургоном
    return driver.qualification === 'truck' && vehicle.requiredCategory === 'van';
  }
};

Object.assign(EuroLogisticsGame.prototype, {
  earn(amount) {
    if (amount <= 0) return;
    this.state.money += amount;
    this.state.stats.totalEarned += amount;
    this.state.today.income += amount;
    if (this.state.money > this.state.stats.peakMoney) this.state.stats.peakMoney = this.state.money;
    this.bumpCareer({ earned: amount });
  },

  // Операційні витрати (пальне, зарплати, утримання, відсотки) можуть загнати в мінус —
  // це борг, який веде до банкрутства. Покупки перевіряють баланс заздалегідь.
  spend(amount, category) {
    const actual = Math.max(0, amount);
    this.state.money -= actual;
    const ex = this.state.stats.expenses;
    ex[category] = (ex[category] || 0) + actual;
    this.state.today.expense += actual;
    return actual;
  },

  canAfford(amount) {
    return this.state.money >= amount;
  },

  getBase(cityId = this.state.homeBase) {
    return STARTING_BASES.find(b => b.cityId === cityId) || null;
  },

  getOwnerBackground() {
    return OWNER_BACKGROUNDS.find(b => b.id === this.state.ownerBackground) || OWNER_BACKGROUNDS[0];
  },

  getReputationMultiplier() {
    return Economy.reputationMultiplier(this.state.reputation);
  },

  getTotalGarageSlots() {
    return Object.values(this.state.garages).reduce((t, g) => t + (g.slots || 2), 0);
  },

  // Модифікатори компромісів кешуються, поки гравець їх не перемкне
  getTradeoffModifiers() {
    if (!this._modsCache) this._modsCache = Economy.tradeoffModifiers(this.state.activeTradeoffs);
    return this._modsCache;
  },

  invalidateModifiers() {
    this._modsCache = null;
  },

  // Ефективні характеристики ТЗ з урахуванням водія, апгрейдів, бази, стану та події
  getVehiclePerformance(v) {
    const driver = this.state.drivers.find(d => d.id === v.assignedDriverId);
    const mods = this.getTradeoffModifiers();
    const perk = this.state.basePerk || {};
    const ev = this.state.event;

    const effectiveSpeed = v.speed * this.state.speedBoost * ev.speedMultiplier * (1 + mods.speedMod) *
      (1 + (driver ? driver.speedBonus : 0)) * Economy.conditionSpeedMultiplier(v.condition ?? 100);
    const speedKmS = (effectiveSpeed / 3600) * 1100;
    const fuelPerKm = Math.max(0.02, v.fuelPerKm * (1 - this.state.fuelDiscount) * ev.fuelMultiplier *
      (1 + mods.fuelMod) * (1 - (driver ? driver.fuelBonus : 0)) * (1 + (perk.fuelMod || 0)));
    const capacity = v.network === 'road' ? +(v.capacity * (1 + mods.capacityMod)).toFixed(1) : v.capacity;
    const loadTime = Math.max(0.4, 2.0 * (1 + mods.loadingMod));

    return { driver, speedKmS, fuelPerKm, capacity, loadTime, mods };
  },

  // Прогноз рейсу для конкретного ТЗ: час, витрати, прибуток, чи встигне
  estimateTrip(v, contract) {
    const perf = this.getVehiclePerformance(v);
    const pickupPath = this.findPath(v.location, contract.origin, v.network);
    const tripPath = this.findPath(contract.origin, contract.destination, v.network);
    if (!pickupPath || !tripPath) return { possible: false, perf };

    const pickupKm = this.calculatePathDistance(pickupPath);
    const tripKm = this.calculatePathDistance(tripPath);
    const seconds = (pickupKm + tripKm) / perf.speedKmS + perf.loadTime * 2;
    const fuel = (pickupKm + tripKm) * perf.fuelPerKm;
    const salary = Economy.driverPay(perf.driver, pickupKm + tripKm);
    const onTime = seconds <= contract.timeLeft;
    const payout = this.calculatePayout(contract, onTime);

    return { possible: true, perf, pickupKm, tripKm, seconds, fuel, salary, onTime, payout, profit: payout - fuel - salary };
  },

  calculatePayout(c, onTime) {
    return Economy.payout(c, onTime, { garage: this.state.garages[c.origin], mods: this.getTradeoffModifiers() });
  },

  getStreakBonus() {
    return Economy.streakBonus(this.state.stats.streak);
  },

  getCompanyValue() {
    return Economy.companyValue(this.state);
  },

  // Перевіряє досягнення і видає нагороди за нові
  checkAchievements() {
    ACHIEVEMENTS.forEach(a => {
      if (this.state.achievements[a.id] || !a.check(this.state)) return;
      this.state.achievements[a.id] = this.state.day;
      this.earn(a.reward);
      this.sound.playCash();
      this.showToast(this.tTemplate('toast_achievement', { icon: a.icon, title: this.L(a.title), reward: a.reward.toLocaleString() }), 'success');
      this.requestSave();
    });
  },

  // Ранг компанії залежить від виконаних рейсів і заробленого за весь час
  getCompanyTierKey() {
    const d = this.state.deliveriesCount;
    const e = this.state.stats.totalEarned;
    if (d >= 60 || e >= 600000) return 'company_tier_leader';
    if (d >= 30 || e >= 250000) return 'company_tier_international';
    if (d >= 12 || e >= 100000) return 'company_tier_national';
    if (d >= 4 || e >= 25000) return 'company_tier_regional';
    return 'company_tier_starter';
  },

  // ---- Кредити --------------------------------------------------------------
  getCreditLimit() {
    return Economy.creditLimit(this.state);
  },

  takeLoan() {
    const step = FINANCE.loanStep;
    if (this.state.loan + step > this.getCreditLimit()) {
      this.showToast(this.t('toast_credit_limit'), 'error');
      return;
    }
    this.state.loan += step;
    this.state.money += step; // позика — не дохід, у статистику не йде
    this.sound.playCash();
    this.showToast(this.tTemplate('toast_loan_taken', { amount: step.toLocaleString(), rate: (Economy.loanRate(this.state) * 100).toFixed(1) }), 'info');
    this.afterAction();
  },

  repayLoan() {
    const amount = Math.min(this.state.loan, FINANCE.loanStep);
    if (amount <= 0) return;
    if (!this.canAfford(amount)) {
      this.showToast(this.t('btn_not_enough_funds'), 'error');
      return;
    }
    this.state.loan -= amount;
    this.state.money -= amount;
    this.showToast(this.tTemplate('toast_loan_repaid', { amount: amount.toLocaleString() }), 'success');
    this.afterAction();
  }
});
