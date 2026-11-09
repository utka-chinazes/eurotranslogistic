// Замовлення: генерація, підбір транспорту, призначення
Object.assign(EuroLogisticsGame.prototype, {
  generateContract() {
    const cityKeys = Object.keys(CITIES);
    const perk = this.state.basePerk || {};
    let originKey = this.pickRandom(cityKeys);
    let cargo = this.pickRandom(CARGO_TYPES);
    let maxWeight = Infinity;

    const roll = Math.random();
    if (roll < 0.4 && this.state.fleet.length) {
      // Частина замовлень «під ваш флот»: поруч із транспортом і в межах його місткості
      const v = this.pickRandom(this.state.fleet);
      const anchor = v.status === 'idle' ? v.location : (v.currentContract?.destination || v.location);
      const near = cityKeys.filter(k => this.cityDistance(anchor, k) < 750);
      originKey = this.pickRandom(near.length ? near : [anchor]);
      const fitting = CARGO_TYPES.filter(c => c.weightRange[0] <= v.capacity);
      if (fitting.length) cargo = this.pickRandom(fitting);
      maxWeight = v.capacity;
    } else if (roll < 0.55 && perk.heavyBonus) {
      // Морський порт генерує важкі вантажі
      originKey = this.state.homeBase;
      cargo = this.pickRandom(CARGO_TYPES.filter(c => c.isHeavy));
    } else if (roll < 0.6) {
      // Невелика частка замовлень зі штабу
      originKey = this.state.homeBase;
    }

    let destKey = originKey;
    while (destKey === originKey) {
      destKey = this.pickRandom(cityKeys);
    }

    let weight = cargo.weightRange[0] + Math.random() * (cargo.weightRange[1] - cargo.weightRange[0]);
    weight = +Math.min(weight, maxWeight).toFixed(1);

    const straightDist = this.cityDistance(originKey, destKey);
    const isHeavy = cargo.isHeavy || weight > 20;

    // Розрахунок винагороди з урахуванням бонусів, репутації та компромісних технологій
    let urgencyFactor = cargo.isUrgent ? 1.4 : 1.0;
    // VIP-замовлення доступні лише з ліцензією та репутацією від 70%
    const isVip = this.state.hasVipLicense && this.state.reputation >= 70 && Math.random() < 0.25;
    if (isVip) urgencyFactor = 1.9;
    const isUrgent = cargo.isUrgent || isVip;

    const mods = this.getTradeoffModifiers();
    let perkMult = 1;
    if (perk.homeRouteBonus && (originKey === this.state.homeBase || destKey === this.state.homeBase)) perkMult += perk.homeRouteBonus;
    if (perk.heavyBonus && isHeavy) perkMult += perk.heavyBonus;
    if (perk.urgentBonus && isUrgent) perkMult += perk.urgentBonus;
    const eventMult = this.state.event.rewardMultiplier || 1;
    const ownerMult = 1 + (this.state.ownerPerk.rewardMod || 0);

    const baseReward = Math.round(
      straightDist * cargo.valuePerKm * urgencyFactor * this.state.rewardBonus * (1 + mods.rewardMod) *
      this.getReputationMultiplier() * perkMult * eventMult * ownerMult * REWARD_SCALE * this.state.diff.reward
    );
    const deadlineFactor = (cargo.isUrgent ? 1.2 : 2.0) * (1 + mods.deadlineMod) * (isUrgent && perk.urgentDeadline ? 1 + perk.urgentDeadline : 1) * this.state.diff.deadline;
    const deadlineSeconds = Math.max(40, Math.round((straightDist / 25) * deadlineFactor));

    return {
      id: 'c_' + Math.random().toString(36).slice(2, 11),
      origin: originKey,
      destination: destKey,
      cargoType: cargo.id,
      cargoName: cargo.name,
      cargoIcon: cargo.icon,
      weight: weight,
      distance: Math.round(straightDist),
      reward: baseReward,
      penalty: Math.round(baseReward * 0.4),
      deadline: deadlineSeconds,
      timeLeft: deadlineSeconds,
      isUrgent: isUrgent,
      isVip: isVip,
      isHeavy: isHeavy
    };
  },

  generateInitialContracts() {
    for (let i = 0; i < 6; i++) {
      this.state.contracts.push(this.generateContract());
    }
  },

  // Причина, чому ТЗ не може взяти замовлення (або null, якщо може)
  getAssignBlocker(v, contract, est) {
    if (v.status !== 'idle') return this.t('in_transit_short');
    const driver = this.state.drivers.find(d => d.id === v.assignedDriverId);
    if (!driver) return this.t('assign_no_driver');
    if (!Economy.driverCanOperate(driver, v)) return this.t('toast_qual_mismatch');
    if (est.perf.capacity < contract.weight) return `${est.perf.capacity}t < ${contract.weight}t`;
    if (!est.possible) return this.t('assign_no_route');
    return null;
  },

  getBestVehicleFor(contract) {
    let best = null;
    this.state.fleet.forEach(v => {
      if (v.status !== 'idle') return;
      const est = this.estimateTrip(v, contract);
      if (this.getAssignBlocker(v, contract, est)) return;
      const score = (est.onTime ? 1e7 : 0) + est.profit;
      if (!best || score > best.score) best = { vehicle: v, est, score };
    });
    return best;
  },

  assignContract(contractId, vehicleId) {
    const cIdx = this.state.contracts.findIndex(c => c.id === contractId);
    if (cIdx === -1) return;
    const contract = this.state.contracts[cIdx];
    const vehicle = this.state.fleet.find(v => v.id === vehicleId);
    if (!vehicle || vehicle.status !== 'idle') return;
    const blocker = this.getAssignBlocker(vehicle, contract, this.estimateTrip(vehicle, contract));
    if (blocker) {
      this.showToast(`⛔ ${blocker}`, 'error');
      return;
    }

    this.closeAssignModal();

    // Видаляємо зі списку доступних контрактів
    this.state.contracts.splice(cIdx, 1);

    vehicle.currentContract = contract;
    // Кілометраж рейсу (подача + доставка) — для оплати водія
    vehicle.tripKm = this.calculatePathDistance(this.findPath(vehicle.location, contract.origin, vehicle.network)) +
      this.calculatePathDistance(this.findPath(contract.origin, contract.destination, vehicle.network));

    // Якщо транспорт вже в місті відправлення — одразу завантажуємося
    if (vehicle.location === contract.origin) {
      vehicle.status = 'loading';
      vehicle.waitTimer = this.getVehiclePerformance(vehicle).loadTime;
      vehicle.path = this.findPath(contract.origin, contract.destination, vehicle.network);
      vehicle.currentLeg = 0;
      vehicle.legProgress = 0;
    } else {
      // Інакше потрібно доїхати до точки забору вантажу
      vehicle.status = 'moving_to_pickup';
      vehicle.path = this.findPath(vehicle.location, contract.origin, vehicle.network);
      vehicle.currentLeg = 0;
      vehicle.legProgress = 0;
    }

    this.sound.playOrderAccepted();
    this.showToast(`${vehicle.icon} ${vehicle.name} ➔ ${this.getCityName(contract.origin)} ➔ ${this.getCityName(contract.destination)}`, 'info');
    this.afterAction('contracts', 'fleet', 'routes');
  }
});
