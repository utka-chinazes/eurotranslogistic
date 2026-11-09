// =============================================================================
// Флот і водії: рух, знос, поломки, доставка, купівля/продаж, сервіс, перегін, найм
// =============================================================================

const MOVING_STATUSES = ['moving_to_pickup', 'in_transit', 'relocating'];

Object.assign(EuroLogisticsGame.prototype, {
  updateVehicle(v, dt) {
    if (v.status === 'idle') return;

    if (v.status === 'loading') {
      v.waitTimer -= dt;
      if (v.waitTimer <= 0) {
        v.status = 'in_transit';
        this.markDirty('fleet', 'routes');
      }
      return;
    }

    if (v.status === 'unloading') {
      v.waitTimer -= dt;
      if (v.waitTimer <= 0) this.completeDelivery(v);
      return;
    }

    // Поломка: простій, потім рух продовжується
    if (v.status === 'broken') {
      v.waitTimer -= dt;
      if (v.waitTimer <= 0) {
        v.status = v.resumeStatus || 'in_transit';
        v.resumeStatus = null;
        this.markDirty('fleet', 'routes');
      }
      return;
    }

    if (!MOVING_STATUSES.includes(v.status)) return;
    if (!v.path || v.path.length < 2) {
      this.abortTrip(v);
      return;
    }

    const fromId = v.path[v.currentLeg];
    const toId = v.path[v.currentLeg + 1];
    const segDistance = this.cityDistance(fromId, toId);
    const perf = this.getVehiclePerformance(v);

    const stepProgress = (perf.speedKmS * dt) / Math.max(1, segDistance);
    v.legProgress += stepProgress;

    const km = segDistance * stepProgress;
    this.spend(km * perf.fuelPerKm, 'fuel');
    this.state.stats.kmDriven += km;
    v.condition = Math.max(0, (v.condition ?? 100) - Economy.wearForKm(km, v.network, {
      difficultyWear: this.state.diff.wear,
      wearMod: this.state.ownerPerk.wearMod || 0
    }));

    if (v.legProgress < 1) return;

    v.legProgress = 0;
    v.currentLeg++;
    v.location = toId;

    // Зношена техніка може зламатися на будь-якому відрізку
    if (v.condition < WEAR.breakdownBelow && v.currentLeg < v.path.length - 1 && Math.random() < WEAR.breakdownChance) {
      this.breakdown(v);
      return;
    }

    if (v.currentLeg < v.path.length - 1) return;

    // Кінець маршруту
    if (v.status === 'moving_to_pickup') {
      v.status = 'loading';
      v.waitTimer = perf.loadTime;
      v.path = this.findPath(v.currentContract.origin, v.currentContract.destination, v.network);
      v.currentLeg = 0;
      v.legProgress = 0;
    } else if (v.status === 'in_transit') {
      v.status = 'unloading';
      v.waitTimer = perf.loadTime;
    } else if (v.status === 'relocating') {
      this.resetVehicleTrip(v);
      this.showToast(this.tTemplate('toast_relocated', { vehicle: v.name, city: this.getCityName(v.location) }), 'info');
    }
    this.markDirty('fleet', 'routes');
  },

  breakdown(v) {
    const repair = Math.round((v.purchasePrice || 10000) * WEAR.breakdownCostShare);
    this.spend(repair, 'service');
    this.state.stats.breakdowns++;
    v.resumeStatus = v.status;
    v.status = 'broken';
    v.waitTimer = WEAR.breakdownDelay;
    this.sound.playWarning();
    this.showToast(this.tTemplate('toast_breakdown', { vehicle: v.name, city: this.getCityName(v.location), cost: repair.toLocaleString() }), 'warning');
    this.markDirty('fleet', 'routes');
  },

  resetVehicleTrip(v) {
    v.status = 'idle';
    v.currentContract = null;
    v.path = [];
    v.currentLeg = 0;
    v.legProgress = 0;
    v.resumeStatus = null;
  },

  // Маршрут неможливий: повертаємо замовлення на біржу
  abortTrip(v) {
    if (v.currentContract) {
      this.state.contracts.push(v.currentContract);
      this.showToast(this.t('toast_trip_aborted'), 'warning');
    }
    this.resetVehicleTrip(v);
    this.markDirty('fleet', 'contracts', 'routes');
  },

  completeDelivery(v) {
    const c = v.currentContract;
    if (!c) {
      this.resetVehicleTrip(v);
      return;
    }

    const mods = this.getTradeoffModifiers();
    const stats = this.state.stats;
    const onTime = c.timeLeft >= 0;
    let payout = this.calculatePayout(c, onTime);
    let repChange;
    const cargoLocalized = `${c.cargoIcon} ${this.getCargoName(this.getCargoType(c), c.cargoName)}`;

    if (!onTime) {
      stats.late++;
      stats.streak = 0;
      if (mods.noPenalty) {
        repChange = 1;
        this.showToast(this.tTemplate('toast_trip_late_insured', { payout: payout.toLocaleString() }), 'info');
      } else {
        repChange = -6;
        this.showToast(this.tTemplate('toast_trip_late', { payout: payout.toLocaleString() }), 'warning');
        this.sound.playWarning();
      }
    } else {
      stats.onTime++;
      const streakBonus = this.getStreakBonus();
      if (streakBonus > 0) payout = Math.round(payout * (1 + streakBonus));
      stats.streak++;
      stats.bestStreak = Math.max(stats.bestStreak, stats.streak);
      repChange = (c.isUrgent ? 3 : 2) + (this.state.ownerPerk.repGainBonus || 0);

      this.showToast(this.tTemplate('toast_trip_success', {
        cargo: cargoLocalized,
        city: this.getCityName(c.destination),
        payout: payout.toLocaleString()
      }), 'success');
      if (stats.streak >= 3 && stats.streak % 3 === 0) {
        this.showToast(this.tTemplate('toast_streak', { n: stats.streak, pct: Math.round(this.getStreakBonus() * 100) }), 'info');
      }
      this.sound.playCash();
    }

    this.earn(payout);
    this.state.reputation = Math.min(100, Math.max(10, this.state.reputation + repChange));
    this.state.deliveriesCount++;
    if (payout > stats.bestPayout) {
      stats.bestPayout = payout;
      stats.bestPayoutRoute = `${c.origin}>${c.destination}`;
    }
    stats.longestRoute = Math.max(stats.longestRoute, c.distance);
    this.bumpCareer({ deliveries: 1, km: c.distance });

    // Досвід та зарплата водія
    const driver = this.state.drivers.find(d => d.id === v.assignedDriverId);
    if (driver) {
      this.spend(Economy.driverPay(driver, v.tripKm || c.distance), 'salaries');
      driver.xp += Math.round((30 + c.distance / 100) * (1 + (this.state.ownerPerk.driverXpMod || 0)));
      while (driver.xp >= driver.xpNeeded) {
        driver.level++;
        driver.xp -= driver.xpNeeded;
        driver.xpNeeded = Math.round(driver.xpNeeded * 1.4);
        driver.speedBonus = +(driver.speedBonus + 0.02).toFixed(2);
        driver.fuelBonus = +(driver.fuelBonus + 0.02).toFixed(2);
        driver.salaryPerTrip += 20;
        this.showToast(this.tTemplate('toast_driver_levelup', { driver: this.getDriverName(driver.name), level: driver.level }), 'success');
      }
    }

    this.resetVehicleTrip(v);
    if (v.condition < WEAR.slowBelow) {
      this.showToast(this.tTemplate('toast_needs_service', { vehicle: v.name, cond: Math.round(v.condition) }), 'warning');
    }
    this.checkAchievements();
    this.afterAction('fleet', 'contracts', 'drivers', 'routes');
  },

  // ---- Купівля / продаж / сервіс / перегін -------------------------------
  buyVehicle(typeId) {
    const model = VEHICLE_CATALOG.find(m => m.typeId === typeId);
    if (!model) return;
    if (this.state.fleet.length >= this.getTotalGarageSlots()) {
      this.showToast(`${this.t('btn_no_garage_slots')} (${this.state.fleet.length}/${this.getTotalGarageSlots()})`, 'error');
      return;
    }
    if (!this.canAfford(model.price)) {
      this.showToast(this.t('btn_not_enough_funds'), 'error');
      return;
    }

    this.spend(model.price, 'vehicles');
    this.state.stats.vehiclesBought++;
    const ordinal = this.state.fleet.filter(v => v.typeId === model.typeId).length + 1;
    // Новий транспорт з'являється в обраному місті з базою, інакше — у штабі
    const city = (this.state.selectedCity && this.state.garages[this.state.selectedCity]) ? this.state.selectedCity : this.state.homeBase;
    const vehicle = createVehicleFromModel(model, city, null, ordinal);

    const freeDriver = this.state.drivers.find(d => !d.assignedVehicleId && Economy.driverCanOperate(d, vehicle));
    if (freeDriver) {
      vehicle.assignedDriverId = freeDriver.id;
      freeDriver.assignedVehicleId = vehicle.id;
    }
    this.state.fleet.push(vehicle);

    this.sound.playCash();
    const driverMsg = freeDriver ? `${this.t('driver_assigned')} ${this.getDriverName(freeDriver.name)}` : this.t('driver_not_assigned');
    this.showToast(`🎉 ${model.name} ➔ ${this.getCityName(city)}. ${driverMsg}`, 'success');
    this.checkAchievements();
    this.afterAction('shop', 'fleet', 'drivers', 'garages', 'contracts');
  },

  sellVehicle(vehicleId) {
    const v = this.state.fleet.find(x => x.id === vehicleId);
    if (!v) return;
    if (v.status !== 'idle') {
      this.showToast(this.t('toast_vehicle_in_transit'), 'warning');
      return;
    }
    if (this.state.fleet.length <= 1) {
      this.showToast(this.t('toast_last_vehicle'), 'warning');
      return;
    }
    const value = Economy.resaleValue(v);
    if (!confirm(this.tTemplate('confirm_sell_vehicle', { vehicle: v.name, value: value.toLocaleString() }))) return;

    const driver = this.state.drivers.find(d => d.id === v.assignedDriverId);
    if (driver) driver.assignedVehicleId = null;
    this.state.fleet = this.state.fleet.filter(x => x.id !== v.id);
    this.state.money += value; // повернення капіталу, не дохід від рейсів
    this.state.stats.vehiclesSold++;
    this.sound.playCash();
    this.showToast(this.tTemplate('toast_vehicle_sold', { vehicle: v.name, value: value.toLocaleString() }), 'success');
    this.afterAction('fleet', 'drivers', 'shop', 'garages', 'contracts', 'routes');
  },

  serviceVehicle(vehicleId) {
    const v = this.state.fleet.find(x => x.id === vehicleId);
    if (!v || v.status !== 'idle') return;
    const cost = Economy.serviceCost(v, this.state.ownerPerk.serviceMod || 0, !!this.state.garages[v.location]);
    if (cost <= 0) return;
    if (!this.canAfford(cost)) {
      this.showToast(this.t('btn_not_enough_funds'), 'error');
      return;
    }
    this.spend(cost, 'service');
    v.condition = 100;
    this.sound.playHorn();
    this.showToast(this.tTemplate('toast_serviced', { vehicle: v.name, cost: cost.toLocaleString() }), 'success');
    this.afterAction('fleet');
  },

  // Порожній перегін ТЗ на іншу власну базу
  relocateVehicle(vehicleId, cityId) {
    const v = this.state.fleet.find(x => x.id === vehicleId);
    if (!v || v.status !== 'idle' || !cityId || cityId === v.location) return;
    if (!v.assignedDriverId) {
      this.showToast(this.t('assign_no_driver'), 'warning');
      return;
    }
    const path = this.findPath(v.location, cityId, v.network);
    if (!path) {
      this.showToast(this.t('toast_trip_aborted'), 'warning');
      return;
    }
    v.status = 'relocating';
    v.path = path;
    v.currentLeg = 0;
    v.legProgress = 0;
    this.sound.playOrderAccepted();
    this.afterAction('fleet', 'routes');
  },

  // ---- Персонал ---------------------------------------------------------
  // Новий кандидат заданої кваліфікації з унікальним ім'ям
  createCandidate(qual) {
    const perk = this.state.basePerk || {};
    const taken = new Set([...this.state.drivers, ...this.state.driverMarket].map(d => d.name));
    const free = CANDIDATE_NAMES.filter(n => !taken.has(n));
    const level = Math.floor(Math.random() * 3) + 1;
    // Універсали, пілоти й машиністи дорожчі
    const qualMult = qual === 'all' ? 1.35 : (qual === 'plane' ? 1.25 : (qual === 'train' ? 1.1 : 1));
    return {
      id: 'd_market_' + Math.random().toString(36).slice(2, 11),
      name: this.pickRandom(free.length ? free : CANDIDATE_NAMES),
      avatar: this.pickRandom(CANDIDATE_AVATARS),
      qualification: qual,
      level,
      xp: 0,
      xpNeeded: level * 100,
      speedBonus: +(0.03 * level).toFixed(2),
      fuelBonus: +(0.04 * level).toFixed(2),
      salaryPerTrip: Math.round(level * 110 * qualMult * (1 + (perk.salaryMod || 0))),
      hireCost: Math.round(level * 1200 * qualMult * (1 + (perk.hireMod || 0)))
    };
  },

  // Доповнює біржу до мінімального складу по кожній кваліфікації
  topUpDriverMarket() {
    const market = this.state.driverMarket;
    Object.entries(DRIVER_MARKET_COMPOSITION).forEach(([qual, min]) => {
      let have = market.filter(d => d.qualification === qual).length;
      while (have < min) {
        market.push(this.createCandidate(qual));
        have++;
      }
    });
    // Групуємо за кваліфікацією, всередині — від дешевших
    const order = Object.keys(DRIVER_MARKET_COMPOSITION);
    market.sort((x, y) => order.indexOf(x.qualification) - order.indexOf(y.qualification) || x.hireCost - y.hireCost);
  },

  generateCandidateDrivers() {
    this.state.driverMarket = [];
    this.topUpDriverMarket();
  },

  // Щоденна ротація: частина кандидатів іде, приходять нові
  refreshDriverMarket() {
    const market = this.state.driverMarket;
    for (let i = 0; i < DRIVER_MARKET_DAILY_CHURN && market.length; i++) {
      market.splice(Math.floor(Math.random() * market.length), 1);
    }
    this.topUpDriverMarket();
    this.markDirty('drivers');
  },

  hireDriver(driverId) {
    const idx = this.state.driverMarket.findIndex(d => d.id === driverId);
    if (idx === -1) return;
    const candidate = this.state.driverMarket[idx];
    if (!this.canAfford(candidate.hireCost)) {
      this.showToast(this.t('btn_not_enough_funds'), 'error');
      return;
    }

    this.spend(candidate.hireCost, 'hiring');
    this.state.driverMarket.splice(idx, 1);

    const vehicle = this.state.fleet.find(v => !v.assignedDriverId && Economy.driverCanOperate(candidate, v));
    if (vehicle) {
      candidate.assignedVehicleId = vehicle.id;
      vehicle.assignedDriverId = candidate.id;
    } else {
      candidate.assignedVehicleId = null;
    }
    this.state.drivers.push(candidate);
    this.topUpDriverMarket();

    this.sound.playCash();
    this.showToast(`🤝 ${this.t('toast_driver_hired')} ${this.getDriverName(candidate.name)}`, 'success');
    this.afterAction('drivers', 'fleet', 'contracts');
  },

  fireDriver(driverId) {
    const idx = this.state.drivers.findIndex(d => d.id === driverId);
    if (idx === -1) return;
    const driver = this.state.drivers[idx];
    const v = this.state.fleet.find(veh => veh.id === driver.assignedVehicleId);
    if (v && v.status !== 'idle') {
      this.showToast(this.t('toast_vehicle_in_transit'), 'warning');
      return;
    }
    if (!confirm(this.tTemplate('confirm_fire_driver', { driver: this.getDriverName(driver.name) }))) return;

    if (v) v.assignedDriverId = null;
    this.state.drivers.splice(idx, 1);
    this.showToast(`👋 ${this.t('toast_driver_fired')} ${this.getDriverName(driver.name)}`, 'info');
    this.afterAction('drivers', 'fleet', 'contracts');
  },

  assignDriverToVehicle(driverId, vehicleId) {
    const driver = this.state.drivers.find(d => d.id === driverId);
    if (!driver) return;
    const oldV = this.state.fleet.find(v => v.id === driver.assignedVehicleId);

    if (oldV && oldV.status !== 'idle') {
      this.showToast(this.t('toast_vehicle_in_transit'), 'warning');
      this.markDirty('drivers');
      return;
    }

    // Зняти водія в резерв
    if (!vehicleId) {
      if (oldV) oldV.assignedDriverId = null;
      driver.assignedVehicleId = null;
      this.afterAction('drivers', 'fleet', 'contracts');
      return;
    }

    const vehicle = this.state.fleet.find(v => v.id === vehicleId);
    if (!vehicle) return;
    if (vehicle.status !== 'idle') {
      this.showToast(this.t('toast_vehicle_in_transit'), 'warning');
      this.markDirty('drivers');
      return;
    }
    if (!Economy.driverCanOperate(driver, vehicle)) {
      this.showToast(this.t('toast_qual_mismatch'), 'error');
      this.markDirty('drivers');
      return;
    }

    if (oldV) oldV.assignedDriverId = null;
    const prevDriver = this.state.drivers.find(d => d.id === vehicle.assignedDriverId);
    if (prevDriver) prevDriver.assignedVehicleId = null;

    driver.assignedVehicleId = vehicle.id;
    vehicle.assignedDriverId = driver.id;
    this.sound.playHorn();
    this.showToast(`✅ ${this.getDriverName(driver.name)} ➔ ${vehicle.name}`, 'success');
    this.afterAction('drivers', 'fleet', 'contracts');
  }
});
