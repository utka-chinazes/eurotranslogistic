/**
 * EuroTrans: Логістика Європи — Основний ігровий рушій
 * Включає географічну проекцію, алгоритм Дейкстри для маршрутизації,
 * Web Audio синтезатор звуків, Canvas-анімацію руху та економіку.
 */

// =============================================================================
// 1. Географічні дані міст Європи та транспортна мережа
// =============================================================================

const CITIES = {
  london:    { id: 'london',    name: 'Лондон',    country: 'Велика Британія', lat: 51.5074, lon: -0.1278, hasRail: true,  hasAirport: true },
  paris:     { id: 'paris',     name: 'Париж',     country: 'Франція',         lat: 48.8566, lon: 2.3522,  hasRail: true,  hasAirport: true },
  amsterdam: { id: 'amsterdam', name: 'Амстердам', country: 'Нідерланди',      lat: 52.3676, lon: 4.9041,  hasRail: true,  hasAirport: true },
  berlin:    { id: 'berlin',    name: 'Берлін',    country: 'Німеччина',       lat: 52.5200, lon: 13.4050, hasRail: true,  hasAirport: true },
  copenhagen:{ id: 'copenhagen',name: 'Копенгаген',country: 'Данія',           lat: 55.6761, lon: 12.5683, hasRail: true,  hasAirport: true },
  stockholm: { id: 'stockholm', name: 'Стокгольм', country: 'Швеція',          lat: 59.3293, lon: 18.0686, hasRail: true,  hasAirport: true },
  warsaw:    { id: 'warsaw',    name: 'Варшава',   country: 'Польща',          lat: 52.2297, lon: 21.0122, hasRail: true,  hasAirport: true },
  prague:    { id: 'prague',    name: 'Прага',     country: 'Чехія',           lat: 50.0755, lon: 14.4378, hasRail: true,  hasAirport: true },
  munich:    { id: 'munich',    name: 'Мюнхен',    country: 'Німеччина',       lat: 48.1351, lon: 11.5820, hasRail: true,  hasAirport: true },
  vienna:    { id: 'vienna',    name: 'Відень',    country: 'Австрія',         lat: 48.2082, lon: 16.3738, hasRail: true,  hasAirport: true },
  milan:     { id: 'milan',     name: 'Мілан',     country: 'Італія',          lat: 45.4642, lon: 9.1900,  hasRail: true,  hasAirport: true },
  rome:      { id: 'rome',      name: 'Рим',       country: 'Італія',          lat: 41.9028, lon: 12.4964, hasRail: true,  hasAirport: true },
  barcelona: { id: 'barcelona', name: 'Барселона', country: 'Іспанія',         lat: 41.3879, lon: 2.1699,  hasRail: true,  hasAirport: true },
  madrid:    { id: 'madrid',    name: 'Мадрид',    country: 'Іспанія',         lat: 40.4168, lon: -3.7038, hasRail: true,  hasAirport: true },
  lviv:      { id: 'lviv',      name: 'Львів',     country: 'Україна',         lat: 49.8397, lon: 24.0297, hasRail: true,  hasAirport: true },
  kyiv:      { id: 'kyiv',      name: 'Київ',      country: 'Україна',         lat: 50.4501, lon: 30.5234, hasRail: true,  hasAirport: true },
  odesa:     { id: 'odesa',     name: 'Одеса',     country: 'Україна',         lat: 46.4825, lon: 30.7233, hasRail: true,  hasAirport: true },
  bucharest: { id: 'bucharest', name: 'Бухарест',  country: 'Румунія',         lat: 44.4268, lon: 26.1025, hasRail: true,  hasAirport: true }
};

// Зв'язки між містами (дорожня та залізнична мережі)
const CONNECTIONS = [
  // Автотраси
  { from: 'london', to: 'paris', type: 'road', distance: 450 },
  { from: 'london', to: 'amsterdam', type: 'road', distance: 500 },
  { from: 'paris', to: 'amsterdam', type: 'road', distance: 510 },
  { from: 'paris', to: 'munich', type: 'road', distance: 840 },
  { from: 'paris', to: 'barcelona', type: 'road', distance: 1030 },
  { from: 'paris', to: 'madrid', type: 'road', distance: 1270 },
  { from: 'madrid', to: 'barcelona', type: 'road', distance: 620 },
  { from: 'barcelona', to: 'milan', type: 'road', distance: 980 },
  { from: 'milan', to: 'rome', type: 'road', distance: 570 },
  { from: 'milan', to: 'munich', type: 'road', distance: 500 },
  { from: 'amsterdam', to: 'berlin', type: 'road', distance: 650 },
  { from: 'amsterdam', to: 'copenhagen', type: 'road', distance: 800 },
  { from: 'copenhagen', to: 'stockholm', type: 'road', distance: 650 },
  { from: 'berlin', to: 'copenhagen', type: 'road', distance: 440 },
  { from: 'berlin', to: 'prague', type: 'road', distance: 350 },
  { from: 'berlin', to: 'warsaw', type: 'road', distance: 570 },
  { from: 'munich', to: 'vienna', type: 'road', distance: 430 },
  { from: 'prague', to: 'vienna', type: 'road', distance: 330 },
  { from: 'prague', to: 'warsaw', type: 'road', distance: 640 },
  { from: 'vienna', to: 'warsaw', type: 'road', distance: 670 },
  { from: 'vienna', to: 'bucharest', type: 'road', distance: 1070 },
  { from: 'warsaw', to: 'lviv', type: 'road', distance: 390 },
  { from: 'lviv', to: 'kyiv', type: 'road', distance: 540 },
  { from: 'kyiv', to: 'odesa', type: 'road', distance: 480 },
  { from: 'odesa', to: 'bucharest', type: 'road', distance: 560 },
  { from: 'lviv', to: 'bucharest', type: 'road', distance: 620 },

  // Залізничні швидкісні коридори
  { from: 'paris', to: 'amsterdam', type: 'rail', distance: 500 },
  { from: 'paris', to: 'munich', type: 'rail', distance: 800 },
  { from: 'amsterdam', to: 'berlin', type: 'rail', distance: 630 },
  { from: 'berlin', to: 'prague', type: 'rail', distance: 330 },
  { from: 'prague', to: 'vienna', type: 'rail', distance: 310 },
  { from: 'berlin', to: 'warsaw', type: 'rail', distance: 550 },
  { from: 'warsaw', to: 'vienna', type: 'rail', distance: 650 },
  { from: 'warsaw', to: 'lviv', type: 'rail', distance: 380 },
  { from: 'lviv', to: 'kyiv', type: 'rail', distance: 520 },
  { from: 'milan', to: 'rome', type: 'rail', distance: 550 },
  { from: 'munich', to: 'vienna', type: 'rail', distance: 410 }
];

// Спрощені контури європейського континенту для фону мапи
const EUROPE_COASTLINES = [
  // Скандинавія
  [{lon: 10, lat: 57}, {lon: 18, lat: 60}, {lon: 22, lat: 65}, {lon: 15, lat: 64}, {lon: 6, lat: 62}, {lon: 8, lat: 58}],
  // Британські острови
  [{lon: -5, lat: 50}, {lon: 1.5, lat: 52.5}, {lon: -2, lat: 58.5}, {lon: -6, lat: 56}, {lon: -5, lat: 50}],
  // Західна та Південна Європа (Іберія, Франція, Італія, Балкани)
  [
    {lon: -9, lat: 37}, {lon: -9.5, lat: 42}, {lon: -2, lat: 43.5}, {lon: -4.5, lat: 48.5},
    {lon: 2, lat: 51}, {lon: 8, lat: 54}, {lon: 12, lat: 55}, {lon: 19, lat: 54.5},
    {lon: 31, lat: 46.5}, {lon: 30, lat: 45}, {lon: 28, lat: 42}, {lon: 23, lat: 38},
    {lon: 19, lat: 40}, {lon: 16, lat: 41}, {lon: 18, lat: 40}, {lon: 15.5, lat: 38},
    {lon: 12, lat: 41}, {lon: 9, lat: 44}, {lon: 3, lat: 43}, {lon: 3, lat: 41.5},
    {lon: -0.5, lat: 38.5}, {lon: -2, lat: 36.5}, {lon: -6, lat: 36}, {lon: -9, lat: 37}
  ]
];

// Типи вантажів
const CARGO_TYPES = [
  { name: 'Медикаменти', icon: '💊', valuePerKm: 2.8, weightRange: [1, 3], isUrgent: true },
  { name: 'Електроніка', icon: '💻', valuePerKm: 2.4, weightRange: [2, 8] },
  { name: 'Свіжі фрукти', icon: '🍊', valuePerKm: 1.8, weightRange: [4, 12], isUrgent: true },
  { name: 'Автозапчастини', icon: '⚙️', valuePerKm: 2.1, weightRange: [5, 16] },
  { name: 'Промислові верстати', icon: '🏗️', valuePerKm: 2.6, weightRange: [15, 45], isHeavy: true },
  { name: 'Експрес посилки', icon: '📦', valuePerKm: 2.2, weightRange: [0.5, 2], isUrgent: true },
  { name: 'Зерно та продовольство', icon: '🌾', valuePerKm: 1.5, weightRange: [20, 60], isHeavy: true },
  { name: 'Хімічні реактиви', icon: '🧪', valuePerKm: 3.2, weightRange: [6, 20] }
];

// Доступні для покупки моделі транспорту
const VEHICLE_CATALOG = [
  {
    typeId: 'van',
    name: 'Mercedes Sprinter',
    category: 'Бус / Мінівен',
    icon: '🚐',
    network: 'road',
    price: 6000,
    capacity: 3.5,
    speed: 130, // км/год
    fuelPerKm: 0.22, // € за км
    desc: 'Швидкий та економічний, чудовий для посилок та медикаментів.'
  },
  {
    typeId: 'truck_light',
    name: 'MAN TGX 18t',
    category: 'Вантажівка (TIR)',
    icon: '🚚',
    network: 'road',
    price: 18500,
    capacity: 18,
    speed: 90,
    fuelPerKm: 0.55,
    desc: 'Надійна далекобійна вантажівка для більшості стандартних перевезень.'
  },
  {
    typeId: 'truck_heavy',
    name: 'Scania R500 Heavy',
    category: 'Важкий тягач',
    icon: '🚛',
    network: 'road',
    price: 32000,
    capacity: 25,
    speed: 85,
    fuelPerKm: 0.75,
    desc: 'Витримує важкі промислові вантажі через усю Європу.'
  },
  {
    typeId: 'train',
    name: 'Siemens Vectron Freight',
    category: 'Вантажний потяг',
    icon: '🚂',
    network: 'rail',
    price: 65000,
    capacity: 60,
    speed: 120,
    fuelPerKm: 0.45,
    desc: 'Швидкісний рух залізничними магістралями. Гігантська місткість.'
  },
  {
    typeId: 'plane',
    name: 'Airbus A330F Cargo',
    category: 'Вантажний літак',
    icon: '✈️',
    network: 'air',
    price: 160000,
    capacity: 30,
    speed: 550,
    fuelPerKm: 2.40,
    desc: 'Блискавичні прямі перельоти між аеропортами будь-яких міст.'
  }
];

// Апгрейди компанії
const UPGRADES_CONFIG = [
  {
    id: 'eco_driving',
    title: 'Еко-система палива',
    desc: 'Зменшує витрати пального на 15% для всього автопарку.',
    cost: 8000,
    level: 0,
    maxLevel: 3,
    icon: '⛽',
    apply: (state) => { state.fuelDiscount = 0.15 * state.upgrades.eco_driving; }
  },
  {
    id: 'gps_telematics',
    title: 'Супутникова диспетчеризація',
    desc: 'Оптимізує маршрути, збільшуючи швидкість транспорту на 10%.',
    cost: 12000,
    level: 0,
    maxLevel: 2,
    icon: '🛰️',
    apply: (state) => { state.speedBoost = 1 + (0.1 * state.upgrades.gps_telematics); }
  },
  {
    id: 'logistics_hub',
    title: 'Мережа євроскладів',
    desc: 'Збільшує виплати за всі контракти на 10% завдяки швидкій перевалці.',
    cost: 20000,
    level: 0,
    maxLevel: 3,
    icon: '🏢',
    apply: (state) => { state.rewardBonus = 1 + (0.1 * state.upgrades.logistics_hub); }
  },
  {
    id: 'vip_broker',
    title: 'Європейська ліцензія VIP',
    desc: 'Відкриває доступ до високооплачуваних термінових контрактів ЄС.',
    cost: 35000,
    level: 0,
    maxLevel: 1,
    icon: '🎖️',
    apply: (state) => { state.hasVipLicense = state.upgrades.vip_broker > 0; }
  }
];

// =============================================================================
// 2. Аудіо-синтезатор (Web Audio API без зовнішніх файлів)
// =============================================================================

class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playCash() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (мажорний акорд)
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gain.gain.setValueAtTime(0.12, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.36);
    });
  }

  playOrderAccepted() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  playHorn() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [220, 277.18].forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.42);
    });
  }

  playWarning() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(260, now);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }
}

// =============================================================================
// 3. Ігровий Стан (Game State)
// =============================================================================

class GameState {
  constructor() {
    this.money = 15000;
    this.reputation = 100;
    this.deliveriesCount = 0;
    this.day = 1;
    this.hour = 8;
    this.minute = 0;
    this.timeSpeed = 1; // 0 = pause, 1, 2, 4
    this.fuelDiscount = 0;
    this.speedBoost = 1;
    this.rewardBonus = 1;
    this.hasVipLicense = false;

    this.fleet = [];
    this.contracts = [];
    this.upgrades = {
      eco_driving: 0,
      gps_telematics: 0,
      logistics_hub: 0,
      vip_broker: 0
    };

    this.activeFilter = 'all';
    this.selectedCity = null;
    this.hoveredCity = null;
    this.hoveredVehicle = null;

    this.event = {
      name: 'Штатний режим перевезень',
      desc: 'Європейські дороги вільні, погодні умови сприятливі.',
      fuelMultiplier: 1.0,
      speedMultiplier: 1.0,
      timer: 0
    };
  }

  initDefaultFleet() {
    // Початковий автомобіль
    this.fleet.push({
      id: 'v_init_1',
      name: 'Mercedes Sprinter #1',
      category: 'Бус / Мінівен',
      icon: '🚐',
      network: 'road',
      capacity: 3.5,
      speed: 130,
      fuelPerKm: 0.22,
      location: 'warsaw',
      status: 'idle', // idle, moving_to_pickup, loading, in_transit, unloading
      currentContract: null,
      path: [],
      currentLeg: 0,
      legProgress: 0, // 0..1
      waitTimer: 0 // для завантаження/розвантаження
    });
  }
}

// =============================================================================
// 4. Головний клас Гри: EuroLogisticsGame
// =============================================================================

class EuroLogisticsGame {
  constructor() {
    this.state = new GameState();
    this.sound = new SoundFX();
    this.canvas = document.getElementById('mapCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.tooltip = document.getElementById('mapTooltip');

    // Налаштування проекції мапи
    this.geoBounds = {
      minLon: -10.5,
      maxLon: 34.0,
      minLat: 36.0,
      maxLat: 61.5
    };

    this.lastTimestamp = performance.now();
    this.contractGenTimer = 0;
    this.eventTimer = 40; // кожні 40 секунд нова випадкова подія

    this.bindEvents();
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.state.initDefaultFleet();
    this.generateInitialContracts();
    this.renderUI();

    // Запуск головного ігрового циклу
    requestAnimationFrame((t) => this.loop(t));
  }

  // Перетворення геокоординат у пікселі на Canvas
  project(lon, lat) {
    const padX = 40;
    const padY = 40;
    const w = this.canvas.width - padX * 2;
    const h = this.canvas.height - padY * 2;

    const x = padX + ((lon - this.geoBounds.minLon) / (this.geoBounds.maxLon - this.geoBounds.minLon)) * w;
    // Інверсія Y для широти
    const y = padY + (1 - (lat - this.geoBounds.minLat) / (this.geoBounds.maxLat - this.geoBounds.minLat)) * h;

    return { x, y };
  }

  resizeCanvas() {
    const wrapper = document.getElementById('canvasWrapper');
    if (!wrapper) return;
    this.canvas.width = wrapper.clientWidth || 900;
    this.canvas.height = wrapper.clientHeight || 600;
  }

  // Пошук найкоротшого шляху (Дейкстра) по мережі
  findPath(startCityId, endCityId, networkType) {
    if (startCityId === endCityId) return [startCityId];

    // Літаки літають напряму між містами з аеропортами
    if (networkType === 'air') {
      return [startCityId, endCityId];
    }

    // Для авто та залізниці використовуємо граф
    const dist = {};
    const prev = {};
    const queue = new Set(Object.keys(CITIES));

    Object.keys(CITIES).forEach(c => {
      dist[c] = Infinity;
      prev[c] = null;
    });
    dist[startCityId] = 0;

    // Фільтрація ребер за типом транспорту
    const validConnections = CONNECTIONS.filter(conn => {
      if (networkType === 'rail') {
        return conn.type === 'rail';
      }
      return conn.type === 'road'; // автошляхи
    });

    while (queue.size > 0) {
      let u = null;
      let minDist = Infinity;
      queue.forEach(node => {
        if (dist[node] < minDist) {
          minDist = dist[node];
          u = node;
        }
      });

      if (!u || u === endCityId || minDist === Infinity) break;
      queue.delete(u);

      // Сусіди
      validConnections.forEach(conn => {
        let neighbor = null;
        if (conn.from === u) neighbor = conn.to;
        else if (conn.to === u) neighbor = conn.from;

        if (neighbor && queue.has(neighbor)) {
          const alt = dist[u] + conn.distance;
          if (alt < dist[neighbor]) {
            dist[neighbor] = alt;
            prev[neighbor] = u;
          }
        }
      });
    }

    // Відновлення шляху
    const path = [];
    let curr = endCityId;
    if (prev[curr] || curr === startCityId) {
      while (curr) {
        path.unshift(curr);
        curr = prev[curr];
      }
    }

    // Якщо залізничний шлях не знайдено, пробуємо альтернативу або повертаємо null
    return path.length > 1 ? path : null;
  }

  // Підрахунок реальної відстані маршруту в км
  calculatePathDistance(path) {
    if (!path || path.length < 2) return 0;
    let total = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const c1 = CITIES[path[i]];
      const c2 = CITIES[path[i + 1]];
      // Haversine приблизно
      const d = this.haversineDistance(c1.lat, c1.lon, c2.lat, c2.lon);
      total += d;
    }
    return Math.round(total);
  }

  haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // км
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Генерація нових замовлень
  generateContract() {
    const cityKeys = Object.keys(CITIES);
    const originKey = cityKeys[Math.floor(Math.random() * cityKeys.length)];
    let destKey = originKey;
    while (destKey === originKey) {
      destKey = cityKeys[Math.floor(Math.random() * cityKeys.length)];
    }

    const cargo = CARGO_TYPES[Math.floor(Math.random() * CARGO_TYPES.length)];
    const weight = +(cargo.weightRange[0] + Math.random() * (cargo.weightRange[1] - cargo.weightRange[0])).toFixed(1);

    const straightDist = this.haversineDistance(
      CITIES[originKey].lat, CITIES[originKey].lon,
      CITIES[destKey].lat, CITIES[destKey].lon
    );

    // Розрахунок винагороди
    let urgencyFactor = cargo.isUrgent ? 1.4 : 1.0;
    if (this.state.hasVipLicense && Math.random() < 0.25) urgencyFactor = 1.9;

    const baseReward = Math.round(straightDist * cargo.valuePerKm * urgencyFactor * this.state.rewardBonus);
    const deadlineSeconds = Math.max(45, Math.round((straightDist / 25) * (cargo.isUrgent ? 1.2 : 2.0)));

    return {
      id: 'c_' + Math.random().toString(36).substr(2, 9),
      origin: originKey,
      destination: destKey,
      cargoName: cargo.name,
      cargoIcon: cargo.icon,
      weight: weight,
      distance: Math.round(straightDist),
      reward: baseReward,
      penalty: Math.round(baseReward * 0.4),
      deadline: deadlineSeconds,
      timeLeft: deadlineSeconds,
      isUrgent: cargo.isUrgent || urgencyFactor > 1.4,
      isHeavy: cargo.isHeavy || weight > 20
    };
  }

  generateInitialContracts() {
    for (let i = 0; i < 6; i++) {
      this.state.contracts.push(this.generateContract());
    }
  }

  // =============================================================================
  // 5. Оновлення стану (Update Loop)
  // =============================================================================

  update(dt) {
    if (this.state.timeSpeed === 0) return; // Пауза

    const effectiveDt = dt * this.state.timeSpeed;

    // Внутрішній ігровий час (1 реальна секунда 1x = 10 ігрових хвилин)
    this.state.minute += effectiveDt * 10;
    while (this.state.minute >= 60) {
      this.state.minute -= 60;
      this.state.hour++;
      if (this.state.hour >= 24) {
        this.state.hour = 0;
        this.state.day++;
      }
    }

    // Оновлення контрактів
    for (let i = this.state.contracts.length - 1; i >= 0; i--) {
      const c = this.state.contracts[i];
      c.timeLeft -= effectiveDt;
      if (c.timeLeft <= 0) {
        // Контракт протерміновано в списку
        this.state.contracts.splice(i, 1);
        this.showToast(`⌛ Замовлення ${c.cargoIcon} ${c.cargoName} знято через дедлайн`, 'warning');
      }
    }

    // Періодична генерація нових контрактів (до 8 штук)
    this.contractGenTimer += effectiveDt;
    if (this.contractGenTimer >= 8 && this.state.contracts.length < 8) {
      this.contractGenTimer = 0;
      const newContract = this.generateContract();
      this.state.contracts.push(newContract);
      this.renderContractsUI();
    }

    // Випадкові новини/події Європи
    this.eventTimer -= effectiveDt;
    if (this.eventTimer <= 0) {
      this.triggerRandomEvent();
      this.eventTimer = 45;
    }

    // Рух автопарку
    this.state.fleet.forEach(vehicle => {
      this.updateVehicle(vehicle, effectiveDt);
    });

    this.updateStatsUI();
  }

  updateVehicle(v, dt) {
    if (v.status === 'idle') return;

    // Завантаження вантажу
    if (v.status === 'loading') {
      v.waitTimer -= dt;
      if (v.waitTimer <= 0) {
        v.status = 'in_transit';
        this.showToast(`🚛 ${v.name} завантажено у м. ${CITIES[v.location].name} та рушає!`, 'info');
        this.renderFleetUI();
      }
      return;
    }

    // Розвантаження вантажу
    if (v.status === 'unloading') {
      v.waitTimer -= dt;
      if (v.waitTimer <= 0) {
        this.completeDelivery(v);
      }
      return;
    }

    // Рух по маршруту (moving_to_pickup або in_transit)
    if (v.status === 'moving_to_pickup' || v.status === 'in_transit') {
      if (!v.path || v.path.length < 2) {
        v.status = 'idle';
        return;
      }

      const fromCity = CITIES[v.path[v.currentLeg]];
      const toCity = CITIES[v.path[v.currentLeg + 1]];
      const segDistance = this.haversineDistance(fromCity.lat, fromCity.lon, toCity.lat, toCity.lon);

      // Ефективна швидкість з урахуванням бонусів та подій (збалансована для динамічного ігроладу)
      const speedKmS = (v.speed / 3600) * this.state.speedBoost * this.state.event.speedMultiplier * 1100;

      const stepProgress = (speedKmS * dt) / Math.max(1, segDistance);
      v.legProgress += stepProgress;

      // Списання витрат на пальне
      const fuelCost = segDistance * stepProgress * v.fuelPerKm * (1 - this.state.fuelDiscount) * this.state.event.fuelMultiplier;
      this.state.money = Math.max(0, this.state.money - fuelCost);

      if (v.legProgress >= 1.0) {
        v.legProgress = 0;
        v.currentLeg++;
        v.location = toCity.id;

        // Дісталися кінця всього шляху
        if (v.currentLeg >= v.path.length - 1) {
          if (v.status === 'moving_to_pickup') {
            v.status = 'loading';
            v.waitTimer = 2.0; // 2 секунди завантаження
            // Тепер прокладаємо маршрут до кінцевого пункту призначення контракту
            v.path = this.findPath(v.currentContract.origin, v.currentContract.destination, v.network);
            v.currentLeg = 0;
            v.legProgress = 0;
            this.showToast(`📦 ${v.name} прибув на завантаження до ${fromCity.name}`, 'info');
          } else if (v.status === 'in_transit') {
            v.status = 'unloading';
            v.waitTimer = 2.0; // 2 секунди розвантаження
          }
        }
      }
    }
  }

  completeDelivery(v) {
    const c = v.currentContract;
    if (!c) {
      v.status = 'idle';
      return;
    }

    let payout = c.reward;
    let repChange = 2;

    if (c.timeLeft < 0) {
      // Запізнення
      payout = Math.max(c.reward * 0.5, c.reward - c.penalty);
      repChange = -5;
      this.showToast(`⚠️ Запізнення рейсу! Виплата урізана: +€${payout.toLocaleString()}`, 'warning');
      this.sound.playWarning();
    } else {
      this.showToast(`🎉 Доставка успішна: ${c.cargoIcon} ${c.cargoName} у м. ${CITIES[c.destination].name}! +€${payout.toLocaleString()}`, 'success');
      this.sound.playCash();
    }

    this.state.money += payout;
    this.state.reputation = Math.min(100, Math.max(10, this.state.reputation + repChange));
    this.state.deliveriesCount++;

    v.status = 'idle';
    v.currentContract = null;
    v.path = [];
    v.currentLeg = 0;
    v.legProgress = 0;

    this.updateCompanyTier();
    this.renderFleetUI();
    this.renderContractsUI();
  }

  triggerRandomEvent() {
    const eventsList = [
      {
        name: 'Паливна криза в Західній Європі',
        desc: 'Ціни на нафту підскочили! Вартість пального +30% на 40 секунд.',
        fuelMultiplier: 1.3,
        speedMultiplier: 1.0,
        type: 'warning'
      },
      {
        name: 'Зелений транзитний коридор ЄС',
        desc: 'Спрощено митний контроль. Транспорт рухається на 20% швидше!',
        fuelMultiplier: 1.0,
        speedMultiplier: 1.2,
        type: 'info'
      },
      {
        name: 'Сніговий буран в Альпах',
        desc: 'Гірські перевали через Австрію та Італію уповільнюють автотранспорт на 25%.',
        fuelMultiplier: 1.1,
        speedMultiplier: 0.75,
        type: 'warning'
      },
      {
        name: 'Штатний режим перевезень',
        desc: 'Європейські автобани та залізниця функціонують ідеально.',
        fuelMultiplier: 1.0,
        speedMultiplier: 1.0,
        type: 'info'
      }
    ];

    const ev = eventsList[Math.floor(Math.random() * eventsList.length)];
    this.state.event = ev;

    const ticker = document.getElementById('tickerContent');
    if (ticker) {
      ticker.textContent = `${ev.name} — ${ev.desc}`;
    }
    this.showToast(`📢 Новина: ${ev.name}`, ev.type);
  }

  updateCompanyTier() {
    const tierEl = document.getElementById('companyTier');
    let title = 'Стартап-перевізник';
    const d = this.state.deliveriesCount;
    const m = this.state.money;

    if (d >= 35 || m >= 150000) {
      title = '🏆 Логістичний Імператор Європи';
    } else if (d >= 20 || m >= 75000) {
      title = '🌐 Трансʼєвропейський Консорціум';
    } else if (d >= 10 || m >= 35000) {
      title = '🚛 Регіональний Лідер Доставки';
    } else if (d >= 4 || m >= 20000) {
      title = '📦 Національна Доставка';
    }

    if (tierEl) tierEl.textContent = title;
  }

  // =============================================================================
  // 6. Рендеринг Мапи Canvas (Малюємо Європу, Дороги, Міста та Транспорт)
  // =============================================================================

  draw() {
    const wrapper = document.getElementById('canvasWrapper');
    if (wrapper && (this.canvas.width !== wrapper.clientWidth || this.canvas.height !== wrapper.clientHeight)) {
      this.resizeCanvas();
    }

    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Очищення екрану (глибокий океанічний колір)
    ctx.fillStyle = '#060a14';
    ctx.fillRect(0, 0, w, h);

    // Малюємо координатну сітку диспетчера
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Малюємо спрощені контури суші Європи
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;
    EUROPE_COASTLINES.forEach(poly => {
      ctx.beginPath();
      poly.forEach((pt, idx) => {
        const p = this.project(pt.lon, pt.lat);
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });

    // Малюємо зв'язки (автотраси та залізницю)
    CONNECTIONS.forEach(conn => {
      const c1 = CITIES[conn.from];
      const c2 = CITIES[conn.to];
      if (!c1 || !c2) return;

      const p1 = this.project(c1.lon, c1.lat);
      const p2 = this.project(c2.lon, c2.lat);

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);

      if (conn.type === 'rail') {
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)'; // Помаранчевий пунктир
        ctx.lineWidth = 2.5;
        ctx.setLineDash([5, 5]);
      } else {
        ctx.strokeStyle = 'rgba(2, 132, 199, 0.25)'; // Блакитний для шосе
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Малюємо повітряні лінії для активних літаків
    this.state.fleet.forEach(v => {
      if (v.network === 'air' && v.path && v.path.length >= 2 && v.status !== 'idle') {
        const c1 = CITIES[v.path[0]];
        const c2 = CITIES[v.path[v.path.length - 1]];
        const p1 = this.project(c1.lon, c1.lat);
        const p2 = this.project(c2.lon, c2.lat);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([8, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    // Малюємо міста
    Object.values(CITIES).forEach(city => {
      const p = this.project(city.lon, city.lat);
      const isSelected = this.state.selectedCity === city.id;
      const isHovered = this.state.hoveredCity === city.id;

      // Підрахунок замовлень та транспорту в цьому місті
      const pendingOrders = this.state.contracts.filter(c => c.origin === city.id).length;
      const parkedFleet = this.state.fleet.filter(v => v.location === city.id && v.status === 'idle').length;

      // Пульсуючий ореол, якщо є замовлення
      if (pendingOrders > 0) {
        const pulse = (Math.sin(performance.now() / 250) + 1) * 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.fill();
      }

      // Точка міста
      ctx.beginPath();
      ctx.arc(p.x, p.y, isSelected ? 7 : (isHovered ? 6 : 4.5), 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? '#38bdf8' : (pendingOrders > 0 ? '#10b981' : '#94a3b8');
      ctx.fill();
      ctx.strokeStyle = '#090d16';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Назва міста
      ctx.font = isSelected ? 'bold 11px Inter, sans-serif' : '10px Inter, sans-serif';
      ctx.fillStyle = isSelected ? '#38bdf8' : (isHovered ? '#fff' : '#94a3b8');
      ctx.textAlign = 'center';
      ctx.fillText(city.name, p.x, p.y - 10);

      // Бейдж кількості замовлень біля міста
      if (pendingOrders > 0) {
        ctx.beginPath();
        ctx.arc(p.x + 9, p.y - 7, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
        ctx.font = 'bold 8px Inter, sans-serif';
        ctx.fillStyle = '#000';
        ctx.fillText(pendingOrders, p.x + 9, p.y - 4);
      }
    });

    // Малюємо рухомий транспорт
    this.state.fleet.forEach(v => {
      if (v.status === 'idle') return;

      const pos = this.getVehicleCanvasPos(v);
      if (!pos) return;

      // Сяйво навколо транспорту
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 11, 0, Math.PI * 2);
      ctx.fillStyle = v.network === 'air' ? 'rgba(139, 92, 246, 0.3)' :
                      (v.network === 'rail' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(56, 189, 248, 0.3)');
      ctx.fill();

      // Іконка або мітка транспорту
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(v.icon, pos.x, pos.y);

      // Якщо завантажується чи розвантажується — показуємо годинник
      if (v.status === 'loading' || v.status === 'unloading') {
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText('⏳', pos.x + 10, pos.y - 10);
      }
    });
  }

  // Обчислення поточної Canvas-позиції транспортного засобу
  getVehicleCanvasPos(v) {
    if (v.status === 'idle' || !v.path || v.path.length < 2) {
      const city = CITIES[v.location];
      return city ? this.project(city.lon, city.lat) : null;
    }

    const c1 = CITIES[v.path[v.currentLeg]];
    const c2 = CITIES[v.path[v.currentLeg + 1]];
    if (!c1 || !c2) return null;

    const p1 = this.project(c1.lon, c1.lat);
    const p2 = this.project(c2.lon, c2.lat);

    const x = p1.x + (p2.x - p1.x) * v.legProgress;
    const y = p1.y + (p2.y - p1.y) * v.legProgress;
    return { x, y };
  }

  // =============================================================================
  // 7. Головний ігровий цикл (Game Loop)
  // =============================================================================

  loop(timestamp) {
    const dt = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;

    this.update(Math.min(dt, 0.1));
    this.draw();

    requestAnimationFrame((t) => this.loop(t));
  }

  // =============================================================================
  // 8. Керування інтерфейсом (UI & Event Listeners)
  // =============================================================================

  bindEvents() {
    // Вкладки сайдбару
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        const targetTab = e.currentTarget.getAttribute('data-tab');
        e.currentTarget.classList.add('active');
        const contentEl = document.getElementById(`tab-${targetTab}`);
        if (contentEl) contentEl.classList.add('active');

        if (targetTab === 'shop') this.renderShopUI();
        if (targetTab === 'upgrades') this.renderUpgradesUI();
      });
    });

    // Фільтри замовлень
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.state.activeFilter = e.currentTarget.getAttribute('data-filter');
        this.renderContractsUI();
      });
    });

    // Контроль швидкості
    document.getElementById('btnPause')?.addEventListener('click', () => this.setSpeed(0));
    document.getElementById('btnSpeed1')?.addEventListener('click', () => this.setSpeed(1));
    document.getElementById('btnSpeed2')?.addEventListener('click', () => this.setSpeed(2));
    document.getElementById('btnSpeed4')?.addEventListener('click', () => this.setSpeed(4));

    // Звук
    const btnSound = document.getElementById('btnSound');
    btnSound?.addEventListener('click', () => {
      this.sound.enabled = !this.sound.enabled;
      btnSound.textContent = this.sound.enabled ? '🔊' : '🔇';
      this.showToast(this.sound.enabled ? 'Звук увімкнено' : 'Звук вимкнено', 'info');
    });

    // Довідка
    document.getElementById('btnHelp')?.addEventListener('click', () => {
      document.getElementById('helpModal')?.classList.remove('hidden');
    });
    document.getElementById('btnCloseHelpModal')?.addEventListener('click', () => {
      document.getElementById('helpModal')?.classList.add('hidden');
    });
    document.getElementById('btnGotIt')?.addEventListener('click', () => {
      document.getElementById('helpModal')?.classList.add('hidden');
    });

    // Рестарт гри
    document.getElementById('btnReset')?.addEventListener('click', () => {
      if (confirm('Справді почати нову логістичну компанію з нуля?')) {
        this.state = new GameState();
        this.state.initDefaultFleet();
        this.generateInitialContracts();
        this.renderUI();
        this.showToast('🚀 Розпочато нову гру!', 'success');
      }
    });

    // Модальне вікно призначення
    document.getElementById('btnCloseAssignModal')?.addEventListener('click', () => {
      document.getElementById('assignModal')?.classList.add('hidden');
    });

    // Кліки та наведення на Canvas
    this.canvas.addEventListener('mousemove', (e) => this.handleCanvasHover(e));
    this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
    this.canvas.addEventListener('mouseleave', () => {
      this.tooltip.classList.add('hidden');
      this.state.hoveredCity = null;
    });
  }

  setSpeed(val) {
    this.state.timeSpeed = val;
    ['btnPause', 'btnSpeed1', 'btnSpeed2', 'btnSpeed4'].forEach(id => {
      document.getElementById(id)?.classList.remove('active');
    });
    if (val === 0) document.getElementById('btnPause')?.classList.add('active');
    if (val === 1) document.getElementById('btnSpeed1')?.classList.add('active');
    if (val === 2) document.getElementById('btnSpeed2')?.classList.add('active');
    if (val === 4) document.getElementById('btnSpeed4')?.classList.add('active');
  }

  handleCanvasHover(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let foundCity = null;
    for (const city of Object.values(CITIES)) {
      const p = this.project(city.lon, city.lat);
      const dist = Math.hypot(mx - p.x, my - p.y);
      if (dist < 14) {
        foundCity = city;
        break;
      }
    }

    if (foundCity) {
      this.state.hoveredCity = foundCity.id;
      const orders = this.state.contracts.filter(c => c.origin === foundCity.id).length;
      const vehicles = this.state.fleet.filter(v => v.location === foundCity.id && v.status === 'idle').length;

      this.tooltip.innerHTML = `
        <strong>${foundCity.name} (${foundCity.country})</strong><br>
        📦 Доступних замовлень: <b>${orders}</b><br>
        🚛 Вільного транспорту: <b>${vehicles}</b>
      `;
      this.tooltip.style.left = `${mx}px`;
      this.tooltip.style.top = `${my}px`;
      this.tooltip.classList.remove('hidden');
      return;
    }

    this.tooltip.classList.add('hidden');
    this.state.hoveredCity = null;
  }

  handleCanvasClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (const city of Object.values(CITIES)) {
      const p = this.project(city.lon, city.lat);
      const dist = Math.hypot(mx - p.x, my - p.y);
      if (dist < 14) {
        this.selectCity(city.id);
        return;
      }
    }

    // Клік у порожнє місце скидає фільтр міста
    this.selectCity(null);
  }

  selectCity(cityId) {
    this.state.selectedCity = cityId;
    const indicator = document.getElementById('mapCityIndicator');
    if (indicator) {
      if (cityId) {
        const city = CITIES[cityId];
        indicator.innerHTML = `📍 Обрано хаб: <b>${city.name}</b> (${city.country}) <button id="btnResetCityFilter" style="background:none;border:none;color:#38bdf8;cursor:pointer;margin-left:6px;font-weight:700;">(Скинути ✕)</button>`;
        document.getElementById('btnResetCityFilter')?.addEventListener('click', (e) => {
          e.stopPropagation();
          this.selectCity(null);
        });
      } else {
        indicator.innerHTML = `🗺️ <span>Натисніть на місто або маршрут для деталей</span>`;
      }
    }
    this.renderContractsUI();
  }

  // =============================================================================
  // 9. Відмальовка UI: Картки Замовлень, Автопарк, Магазин, Апгрейди
  // =============================================================================

  renderUI() {
    this.updateStatsUI();
    this.renderContractsUI();
    this.renderFleetUI();
    this.renderShopUI();
    this.renderUpgradesUI();
  }

  updateStatsUI() {
    const moneyEl = document.getElementById('statMoney');
    const repEl = document.getElementById('statReputation');
    const fleetEl = document.getElementById('statFleetCount');
    const delivEl = document.getElementById('statDeliveries');
    const timeEl = document.getElementById('statTime');

    if (moneyEl) moneyEl.textContent = `€${Math.round(this.state.money).toLocaleString()}`;
    if (repEl) repEl.textContent = `⭐ ${this.state.reputation}%`;
    if (fleetEl) {
      const busy = this.state.fleet.filter(v => v.status !== 'idle').length;
      fleetEl.textContent = `${this.state.fleet.length} (В рейсі: ${busy})`;
    }
    if (delivEl) delivEl.textContent = this.state.deliveriesCount;
    if (timeEl) {
      const hh = String(this.state.hour).padStart(2, '0');
      const mm = String(Math.floor(this.state.minute)).padStart(2, '0');
      timeEl.textContent = `День ${this.state.day}, ${hh}:${mm}`;
    }

    // Бейджі в табах
    const bContracts = document.getElementById('badgeContracts');
    const bFleet = document.getElementById('badgeFleet');
    if (bContracts) bContracts.textContent = this.state.contracts.length;
    if (bFleet) bFleet.textContent = this.state.fleet.length;

    this.renderActiveRoutesBar();
  }

  renderContractsUI() {
    const list = document.getElementById('contractsList');
    if (!list) return;

    let filtered = this.state.contracts;

    // Фільтр за містом
    if (this.state.selectedCity) {
      filtered = filtered.filter(c => c.origin === this.state.selectedCity);
    }

    // Фільтр за типом
    if (this.state.activeFilter === 'express') {
      filtered = filtered.filter(c => c.isUrgent);
    } else if (this.state.activeFilter === 'heavy') {
      filtered = filtered.filter(c => c.isHeavy);
    }

    if (filtered.length === 0) {
      list.innerHTML = `
        <div style="padding: 24px; text-align: center; color: #64748b; font-size: 0.85rem;">
          Немає замовлень за обраним фільтром.<br>Зачекайте надходження нових рейсів або оберіть інше місто на мапі.
        </div>
      `;
      return;
    }

    list.innerHTML = filtered.map(c => {
      const originCity = CITIES[c.origin];
      const destCity = CITIES[c.destination];
      const urgentClass = c.isUrgent ? 'urgent' : '';

      return `
        <div class="contract-card ${urgentClass}">
          <div class="contract-top">
            <div class="contract-route">
              <span>${originCity.name}</span>
              <span class="route-arrow">➔</span>
              <span>${destCity.name}</span>
            </div>
            <div class="contract-reward">+€${c.reward.toLocaleString()}</div>
          </div>
          <div class="contract-cargo-info">
            <span class="cargo-name">${c.cargoIcon} ${c.cargoName} (${c.weight} т)</span>
            <span class="contract-dist">📍 ${c.distance} км</span>
          </div>
          <div class="contract-footer">
            <span class="contract-deadline ${c.timeLeft < 15 ? 'warning' : ''}">
              ⏱️ Час: ${Math.max(0, Math.round(c.timeLeft))}с
            </span>
            <button class="btn-accept" onclick="window.game.openAssignModal('${c.id}')">Прийняти</button>
          </div>
        </div>
      `;
    }).join('');
  }

  renderFleetUI() {
    const list = document.getElementById('fleetList');
    if (!list) return;

    list.innerHTML = this.state.fleet.map(v => {
      let statusBadge = '<span class="vehicle-status status-idle">Вільний</span>';
      let routeText = `Локація: <b>${CITIES[v.location].name}</b>`;
      let progressPercent = 0;

      if (v.status === 'moving_to_pickup') {
        statusBadge = '<span class="vehicle-status status-transit">Їде на завантаження</span>';
        routeText = `Курс до: <b>${CITIES[v.currentContract.origin].name}</b>`;
        progressPercent = Math.round((v.currentLeg / (v.path.length - 1)) * 100);
      } else if (v.status === 'loading') {
        statusBadge = '<span class="vehicle-status status-loading">Завантаження...</span>';
        routeText = `У хабі: <b>${CITIES[v.location].name}</b>`;
        progressPercent = 100;
      } else if (v.status === 'in_transit') {
        statusBadge = '<span class="vehicle-status status-transit">У дорозі ➔</span>';
        routeText = `Рейс: <b>${CITIES[v.currentContract.origin].name}</b> ➔ <b>${CITIES[v.currentContract.destination].name}</b>`;
        progressPercent = Math.round(((v.currentLeg + v.legProgress) / (v.path.length - 1)) * 100);
      } else if (v.status === 'unloading') {
        statusBadge = '<span class="vehicle-status status-loading">Розвантаження...</span>';
        routeText = `У пункті: <b>${CITIES[v.location].name}</b>`;
        progressPercent = 100;
      }

      return `
        <div class="fleet-card">
          <div class="fleet-card-header">
            <div class="vehicle-identity">
              <span class="vehicle-icon">${v.icon}</span>
              <div>
                <div class="vehicle-name">${v.name}</div>
                <div class="vehicle-type-tag">${v.category} • до ${v.capacity} т</div>
              </div>
            </div>
            ${statusBadge}
          </div>
          <div class="vehicle-details">
            <div>${routeText}</div>
            <div style="text-align: right;">Швидкість: ${v.speed} км/г</div>
          </div>
          ${v.status !== 'idle' ? `
            <div class="vehicle-progress">
              <div class="vehicle-progress-fill" style="width: ${progressPercent}%;"></div>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  renderShopUI() {
    const list = document.getElementById('shopList');
    if (!list) return;

    list.innerHTML = VEHICLE_CATALOG.map(model => {
      const canAfford = this.state.money >= model.price;

      return `
        <div class="shop-card">
          <div class="shop-card-top">
            <div class="vehicle-identity">
              <span class="vehicle-icon">${model.icon}</span>
              <div>
                <div class="vehicle-name">${model.name}</div>
                <div class="vehicle-type-tag">${model.category}</div>
              </div>
            </div>
            <div class="shop-card-price">€${model.price.toLocaleString()}</div>
          </div>
          <div class="specs-grid">
            <div>Вантажопідйомність: <b>${model.capacity} т</b></div>
            <div>Швидкість: <b>${model.speed} км/г</b></div>
            <div>Витрати палива: <b>€${model.fuelPerKm}/км</b></div>
            <div>Тип шляху: <b>${model.network === 'air' ? '✈️ Авіа' : (model.network === 'rail' ? '🚂 Залізниця' : '🛣️ Шосе')}</b></div>
          </div>
          <div style="font-size: 0.72rem; color: #94a3b8;">${model.desc}</div>
          <button class="btn-buy" ${!canAfford ? 'disabled' : ''} onclick="window.game.buyVehicle('${model.typeId}')">
            ${canAfford ? '🛒 Придбати' : 'Недостатньо коштів'}
          </button>
        </div>
      `;
    }).join('');
  }

  renderUpgradesUI() {
    const list = document.getElementById('upgradesList');
    if (!list) return;

    list.innerHTML = UPGRADES_CONFIG.map(upg => {
      const currentLevel = this.state.upgrades[upg.id] || 0;
      const isMax = currentLevel >= upg.maxLevel;
      const nextCost = upg.cost * (currentLevel + 1);
      const canAfford = this.state.money >= nextCost && !isMax;

      return `
        <div class="upgrade-card">
          <div class="upgrade-info">
            <div class="upgrade-title">${upg.icon} ${upg.title}</div>
            <div class="upgrade-desc">${upg.desc}</div>
            <div class="upgrade-level">Рівень: ${currentLevel} / ${upg.maxLevel}</div>
          </div>
          <div>
            ${isMax ? '<span style="color:#10b981;font-weight:700;font-size:0.75rem;">МАКСИМУМ</span>' : `
              <button class="btn-accept" ${!canAfford ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} onclick="window.game.buyUpgrade('${upg.id}')">
                €${nextCost.toLocaleString()}
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');
  }

  renderActiveRoutesBar() {
    const container = document.getElementById('routesScrollContainer');
    const countEl = document.getElementById('activeRoutesCount');
    if (!container) return;

    const activeVehicles = this.state.fleet.filter(v => v.status !== 'idle');
    if (countEl) countEl.textContent = activeVehicles.length;

    if (activeVehicles.length === 0) {
      container.innerHTML = `<div class="empty-routes-hint">Немає транспорту в дорозі. Прийміть замовлення у вкладці контрактів!</div>`;
      return;
    }

    container.innerHTML = activeVehicles.map(v => {
      let label = '';
      if (v.status === 'moving_to_pickup') {
        label = `Подача ➔ ${CITIES[v.currentContract.origin].name}`;
      } else if (v.status === 'loading') {
        label = `Завантаження у ${CITIES[v.location].name}`;
      } else if (v.status === 'in_transit') {
        label = `${CITIES[v.currentContract.origin].name} ➔ ${CITIES[v.currentContract.destination].name}`;
      } else if (v.status === 'unloading') {
        label = `Розвантаження у ${CITIES[v.location].name}`;
      }

      return `
        <div class="route-pill">
          <span>${v.icon}</span>
          <b>${v.name}</b>
          <span style="color: #38bdf8;">${label}</span>
        </div>
      `;
    }).join('');
  }

  // =============================================================================
  // 10. Механіка Призначення Контракту та Покупки
  // =============================================================================

  openAssignModal(contractId) {
    const contract = this.state.contracts.find(c => c.id === contractId);
    if (!contract) return;

    const modal = document.getElementById('assignModal');
    const brief = document.getElementById('modalContractBrief');
    const list = document.getElementById('modalVehiclesList');
    if (!modal || !brief || !list) return;

    brief.innerHTML = `
      <div><strong>Маршрут:</strong> ${CITIES[contract.origin].name} ➔ ${CITIES[contract.destination].name} (${contract.distance} км)</div>
      <div><strong>Вантаж:</strong> ${contract.cargoIcon} ${contract.cargoName} | Вага: <b>${contract.weight} т</b></div>
      <div><strong>Винагорода:</strong> <span style="color:#10b981;font-weight:700;">+€${contract.reward.toLocaleString()}</span> | Дедлайн: <b>${Math.round(contract.timeLeft)}с</b></div>
    `;

    // Шукаємо підходящий транспорт
    list.innerHTML = this.state.fleet.map(v => {
      const isIdle = v.status === 'idle';
      const hasCapacity = v.capacity >= contract.weight;

      // Перевірка доступності залізничного або повітряного шляху
      let routePossible = true;
      let pathGround = null;
      if (v.network === 'rail') {
        pathGround = this.findPath(contract.origin, contract.destination, 'rail');
        if (!pathGround) routePossible = false;
      }

      const canAssign = isIdle && hasCapacity && routePossible;
      let reason = '';
      if (!isIdle) reason = ' (Зайнятий)';
      else if (!hasCapacity) reason = ` (Замала вантажопідйомність: ${v.capacity}т < ${contract.weight}т)`;
      else if (!routePossible) reason = ' (Між цими хабами немає прямої залізниці)';

      return `
        <div class="modal-vehicle-item ${!canAssign ? 'disabled' : ''}" ${canAssign ? `onclick="window.game.assignContract('${contract.id}', '${v.id}')"` : ''}>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.4rem;">${v.icon}</span>
            <div>
              <div style="font-weight: 700; font-size: 0.85rem;">${v.name} ${reason ? `<span style="color:#ef4444;font-size:0.75rem;">${reason}</span>` : ''}</div>
              <div style="font-size: 0.72rem; color: #94a3b8;">Локація: ${CITIES[v.location].name} • Місткість: ${v.capacity} т</div>
            </div>
          </div>
          <div>
            ${canAssign ? '<button class="btn-accept">Обрати</button>' : ''}
          </div>
        </div>
      `;
    }).join('');

    modal.classList.remove('hidden');
  }

  assignContract(contractId, vehicleId) {
    const cIdx = this.state.contracts.findIndex(c => c.id === contractId);
    if (cIdx === -1) return;
    const contract = this.state.contracts[cIdx];
    const vehicle = this.state.fleet.find(v => v.id === vehicleId);
    if (!vehicle || vehicle.status !== 'idle') return;

    // Закриваємо модалку
    document.getElementById('assignModal')?.classList.add('hidden');

    // Видаляємо зі списку доступних контрактів
    this.state.contracts.splice(cIdx, 1);

    vehicle.currentContract = contract;

    // Якщо транспорт вже в місті відправлення — одразу завантажуємося
    if (vehicle.location === contract.origin) {
      vehicle.status = 'loading';
      vehicle.waitTimer = 1.5;
      vehicle.path = this.findPath(contract.origin, contract.destination, vehicle.network);
      vehicle.currentLeg = 0;
      vehicle.legProgress = 0;
      this.showToast(`📦 ${vehicle.name} розпочав завантаження у м. ${CITIES[vehicle.location].name}`, 'info');
    } else {
      // Інакше потрібно доїхати до точки забору вантажу
      vehicle.status = 'moving_to_pickup';
      vehicle.path = this.findPath(vehicle.location, contract.origin, vehicle.network);
      vehicle.currentLeg = 0;
      vehicle.legProgress = 0;
      this.showToast(`🚚 ${vehicle.name} висувається до ${CITIES[contract.origin].name} для забору вантажу`, 'info');
    }

    this.sound.playOrderAccepted();
    this.renderContractsUI();
    this.renderFleetUI();
  }

  buyVehicle(typeId) {
    const model = VEHICLE_CATALOG.find(m => m.typeId === typeId);
    if (!model || this.state.money < model.price) {
      this.showToast('Недостатньо коштів для купівлі даного транспорту!', 'error');
      return;
    }

    this.state.money -= model.price;
    const countSameType = this.state.fleet.filter(v => v.category === model.category).length + 1;
    const defaultCity = this.state.selectedCity || 'kyiv';

    this.state.fleet.push({
      id: 'v_' + Math.random().toString(36).substr(2, 9),
      name: `${model.name} #${countSameType}`,
      category: model.category,
      icon: model.icon,
      network: model.network,
      capacity: model.capacity,
      speed: model.speed,
      fuelPerKm: model.fuelPerKm,
      location: defaultCity,
      status: 'idle',
      currentContract: null,
      path: [],
      currentLeg: 0,
      legProgress: 0,
      waitTimer: 0
    });

    this.sound.playCash();
    this.showToast(`🎉 Придбано новий ${model.name}! Доставлено у хаб ${CITIES[defaultCity].name}.`, 'success');
    this.renderShopUI();
    this.renderFleetUI();
    this.updateStatsUI();
  }

  buyUpgrade(upgId) {
    const upg = UPGRADES_CONFIG.find(u => u.id === upgId);
    if (!upg) return;

    const currentLevel = this.state.upgrades[upg.id] || 0;
    if (currentLevel >= upg.maxLevel) return;

    const cost = upg.cost * (currentLevel + 1);
    if (this.state.money < cost) {
      this.showToast('Недостатньо коштів для покращення!', 'error');
      return;
    }

    this.state.money -= cost;
    this.state.upgrades[upg.id] = currentLevel + 1;
    upg.apply(this.state);

    this.sound.playCash();
    this.showToast(`✨ Покращено: ${upg.title} (Рівень ${this.state.upgrades[upg.id]})!`, 'success');
    this.renderUpgradesUI();
    this.updateStatsUI();
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Запуск гри після завантаження сторінки
window.addEventListener('DOMContentLoaded', () => {
  window.game = new EuroLogisticsGame();
});
