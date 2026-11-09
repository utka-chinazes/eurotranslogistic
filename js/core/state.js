// =============================================================================
// Ігровий стан: усе, що зберігається між сесіями
// =============================================================================

const SAVE_VERSION = 4;

// Створює запис ТЗ з моделі каталогу
function createVehicleFromModel(model, location, id, ordinal = 1) {
  return {
    id: id || 'v_' + Math.random().toString(36).slice(2, 11),
    typeId: model.typeId,
    name: `${model.name} #${ordinal}`,
    category: model.category,
    requiredCategory: model.requiredCategory,
    icon: model.icon,
    network: model.network,
    capacity: model.capacity,
    speed: model.speed,
    fuelPerKm: model.fuelPerKm,
    purchasePrice: model.price,
    condition: 100,
    location,
    status: 'idle',
    assignedDriverId: null,
    currentContract: null,
    path: [],
    currentLeg: 0,
    legProgress: 0,
    waitTimer: 0
  };
}

class GameState {
  // opts: { homeBase, ownerName, companyName, ownerAvatar, ownerBackground, brandColor, difficulty, lang }
  constructor(opts = {}) {
    const base = STARTING_BASES.find(b => b.cityId === opts.homeBase) || STARTING_BASES[0];
    const background = OWNER_BACKGROUNDS.find(b => b.id === opts.ownerBackground) || OWNER_BACKGROUNDS[0];
    const difficultyId = DIFFICULTIES[opts.difficulty] ? opts.difficulty : 'normal';
    const diff = DIFFICULTIES[difficultyId];

    this.version = SAVE_VERSION;
    this.lang = opts.lang || 'uk';

    // Профіль власника компанії
    this.homeBase = base.cityId;
    this.ownerName = opts.ownerName || 'Директор';
    this.companyName = opts.companyName || 'EuroTrans Logistics';
    this.ownerAvatar = opts.ownerAvatar || OWNER_AVATARS[0];
    this.ownerBackground = background.id;
    this.brandColor = opts.brandColor || BRAND_COLORS[0];
    this.difficulty = difficultyId;
    this.basePerk = { ...(base.perk || {}) };
    this.ownerPerk = { ...(background.perk || {}) };
    this.foundedAt = Date.now();

    const startMoney = (25000 + (this.basePerk.startMoney || 0) + (this.ownerPerk.startMoney || 0)) * diff.startMoney;
    this.money = Math.round(startMoney / 500) * 500;
    this.loan = 0;
    this.debtDays = 0;
    this.bankrupt = false;
    this.reputation = 80;
    this.deliveriesCount = 0;
    this.day = 1;
    this.hour = 8;
    this.minute = 0;
    this.timeSpeed = 1; // 0 = пауза, 1, 2, 4
    this.fuelDiscount = 0;
    this.speedBoost = 1;
    this.rewardBonus = 1;
    this.hasVipLicense = false;

    this.fleet = [];
    this.contracts = [];
    this.garages = {
      [base.cityId]: { cityId: base.cityId, level: 1, name: 'HQ', slots: 2 }
    };
    this.drivers = [];
    this.driverMarket = [];
    this.driverSubtab = 'my';

    this.upgrades = { eco_driving: 0, gps_telematics: 0, logistics_hub: 0, vip_broker: 0 };
    this.activeTradeoffs = {
      turbo_boost: false, mega_trailers: false, eco_euro7: false,
      express_24_7: false, ai_dispatcher: false, allianz_insurance: false
    };
    this.unlockedTradeoffs = {};

    // Статистика компанії за весь час
    this.stats = {
      totalEarned: 0,
      expenses: { fuel: 0, salaries: 0, vehicles: 0, garages: 0, upgrades: 0, hiring: 0, upkeep: 0, fees: 0, service: 0, interest: 0 },
      onTime: 0,
      late: 0,
      expired: 0,
      kmDriven: 0,
      bestPayout: 0,
      bestPayoutRoute: '',
      longestRoute: 0,
      peakMoney: this.money,
      streak: 0,
      bestStreak: 0,
      vehiclesBought: 0,
      vehiclesSold: 0,
      breakdowns: 0,
      garagesOpened: 1
    };
    this.history = [];               // [{ day, income, expense }]
    this.today = { income: 0, expense: 0 };
    this.achievements = {};          // id -> день отримання

    this.activeFilter = 'all';
    this.selectedCity = null;
    this.hoveredCity = null;

    this.event = { name: '', desc: '', fuelMultiplier: 1, speedMultiplier: 1, rewardMultiplier: 1, timer: 0 };
  }

  get diff() {
    return DIFFICULTIES[this.difficulty] || DIFFICULTIES.normal;
  }

  initDefaultFleet() {
    const lvl = (this.basePerk.starterDriverLevel || 1) + (this.ownerPerk.starterDriverBonus || 0);
    this.drivers.push({
      id: 'd_init_1',
      name: 'Андрій Коваленко',
      avatar: '👨‍✈️',
      qualification: 'all',
      level: lvl,
      xp: 0,
      xpNeeded: lvl * 100,
      speedBonus: +(0.03 + 0.02 * lvl).toFixed(2),
      fuelBonus: +(0.03 + 0.02 * lvl).toFixed(2),
      salaryPerTrip: 80 + 20 * lvl,
      assignedVehicleId: 'v_init_1'
    });

    const van = createVehicleFromModel(VEHICLE_CATALOG.find(m => m.typeId === 'van'), this.homeBase, 'v_init_1');
    van.assignedDriverId = 'd_init_1';
    this.fleet.push(van);
  }

  // Поля, які не потрібно зберігати між сесіями
  toJSON() {
    const { hoveredCity, selectedCity, ...rest } = this;
    return rest;
  }

  // Відновлення з будь-якої попередньої версії збереження
  static fromJSON(data) {
    const s = new GameState({ homeBase: data.homeBase, ownerBackground: data.ownerBackground, difficulty: data.difficulty });
    const fresh = { stats: s.stats, upgrades: s.upgrades, activeTradeoffs: s.activeTradeoffs };
    Object.assign(s, data);

    s.stats = { ...fresh.stats, ...(data.stats || {}), expenses: { ...fresh.stats.expenses, ...((data.stats || {}).expenses || {}) } };
    s.upgrades = { ...fresh.upgrades, ...(data.upgrades || {}) };
    s.activeTradeoffs = { ...fresh.activeTradeoffs, ...(data.activeTradeoffs || {}) };
    s.history = Array.isArray(data.history) ? data.history : [];
    s.today = data.today || { income: 0, expense: 0 };
    s.achievements = data.achievements || {};
    s.loan = data.loan || 0;
    s.debtDays = data.debtDays || 0;

    // v3 → v4: поля власника і техніки
    const background = OWNER_BACKGROUNDS.find(b => b.id === s.ownerBackground) || OWNER_BACKGROUNDS[0];
    s.ownerBackground = background.id;
    s.ownerPerk = { ...(background.perk || {}) };
    if (!s.brandColor) s.brandColor = BRAND_COLORS[0];
    if (!DIFFICULTIES[s.difficulty]) s.difficulty = 'normal';
    s.fleet.forEach(v => {
      const model = VEHICLE_CATALOG.find(m => m.typeId === v.typeId);
      if (v.condition === undefined) v.condition = 100;
      if (!v.requiredCategory && model) v.requiredCategory = model.requiredCategory;
      if (!v.purchasePrice && model) v.purchasePrice = model.price;
      // Перегін і поломка не мають сенсу після перезапуску з напівдороги — коректно відновлюємо
      if (v.status === 'broken') v.status = v.resumeStatus || (v.currentContract ? 'in_transit' : 'relocating');
      if ((v.status === 'relocating' || v.status === 'moving_to_pickup' || v.status === 'in_transit') && (!v.path || v.path.length < 2)) {
        v.status = 'idle';
      }
    });

    s.version = SAVE_VERSION;
    s.hoveredCity = null;
    s.selectedCity = null;
    if (s.timeSpeed === 0) s.timeSpeed = 1;
    return s;
  }
}
