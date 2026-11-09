// Типи вантажів
const CARGO_TYPES = [
  { id: 'medical', name: 'Медикаменти', icon: '💊', valuePerKm: 3.0, weightRange: [1, 3.5], isUrgent: true },
  { id: 'electronics', name: 'Електроніка', icon: '💻', valuePerKm: 2.6, weightRange: [2, 10] },
  { id: 'fruits', name: 'Свіжі фрукти', icon: '🍊', valuePerKm: 2.0, weightRange: [4, 15], isUrgent: true },
  { id: 'auto_parts', name: 'Автозапчастини', icon: '⚙️', valuePerKm: 2.3, weightRange: [6, 22] },
  { id: 'machinery', name: 'Промислові верстати', icon: '🏗️', valuePerKm: 2.8, weightRange: [18, 50], isHeavy: true },
  { id: 'consumer', name: 'Експрес посилки', icon: '📦', valuePerKm: 2.4, weightRange: [0.5, 2.5], isUrgent: true },
  { id: 'metallurgy', name: 'Металопрокат та сталь', icon: '🔩', valuePerKm: 1.6, weightRange: [25, 70], isHeavy: true },
  { id: 'chemicals', name: 'Хімічні реактиви', icon: '🧪', valuePerKm: 3.4, weightRange: [8, 25] },
  { id: 'aerospace', name: 'Аерокосмічні компоненти', icon: '🚀', valuePerKm: 4.8, weightRange: [30, 110], isHeavy: true, isUrgent: true }
];

// Розширений автосалон (12 моделей ТЗ)
const VEHICLE_CATALOG = [
  // Фургони та буси
  {
    typeId: 'van_eco',
    name: 'Renault Master E-Tech',
    category: 'Електрофургон',
    icon: '🚐',
    network: 'road',
    price: 4500,
    capacity: 2.2,
    speed: 110,
    fuelPerKm: 0.08,
    requiredCategory: 'van',
    desc: 'Екологічний електробус. Ультра-низькі витрати на пальне.'
  },
  {
    typeId: 'van',
    name: 'Mercedes Sprinter Cargo',
    category: 'Бус / Мінівен',
    icon: '🚐',
    network: 'road',
    price: 6800,
    capacity: 3.5,
    speed: 140,
    fuelPerKm: 0.22,
    requiredCategory: 'van',
    desc: 'Швидкий, надійний та динамічний експрес-бус.'
  },
  // Вантажівки
  {
    typeId: 'truck_daf',
    name: 'DAF XF 480 SpaceCab',
    category: 'Магістральний TIR',
    icon: '🚚',
    network: 'road',
    price: 16000,
    capacity: 16,
    speed: 90,
    fuelPerKm: 0.50,
    requiredCategory: 'truck',
    desc: 'Збалансований далекобійний тягач для автобанів.'
  },
  {
    typeId: 'truck_volvo',
    name: 'Volvo FH16 Globetrotter',
    category: 'Потужний тягач',
    icon: '🚚',
    network: 'road',
    price: 24000,
    capacity: 22,
    speed: 95,
    fuelPerKm: 0.65,
    requiredCategory: 'truck',
    desc: 'Преміальний тягач високої надійності.'
  },
  {
    typeId: 'truck_scania',
    name: 'Scania 770S V8 Heavy',
    category: 'Важкий тягач TIR',
    icon: '🚛',
    network: 'road',
    price: 38000,
    capacity: 28,
    speed: 88,
    fuelPerKm: 0.80,
    requiredCategory: 'truck',
    desc: 'Флагманський V8 для важких промислових вантажів.'
  },
  {
    typeId: 'truck_gigaliner',
    name: 'EuroCombi 25.25m Gigaliner',
    category: 'Автопоїзд (Double)',
    icon: '🚛',
    network: 'road',
    price: 52000,
    capacity: 38,
    speed: 82,
    fuelPerKm: 0.95,
    requiredCategory: 'truck',
    desc: 'Подвійний зчіпний автопоїзд гігантської місткості.'
  },
  // Залізничний флот
  {
    typeId: 'train_feeder',
    name: 'Alstom Traxx Rail Feeder',
    category: 'Регіональний електровоз',
    icon: '🚂',
    network: 'rail',
    price: 48000,
    capacity: 45,
    speed: 115,
    fuelPerKm: 0.38,
    requiredCategory: 'train',
    desc: 'Економічний залізничний вантажний локомотив.'
  },
  {
    typeId: 'train',
    name: 'Siemens Vectron Master',
    category: 'Магістральний потяг',
    icon: '🚂',
    network: 'rail',
    price: 75000,
    capacity: 70,
    speed: 130,
    fuelPerKm: 0.45,
    requiredCategory: 'train',
    desc: 'Потужний електровоз для багатотонних партій сировини.'
  },
  {
    typeId: 'train_tgv',
    name: 'TGV EuroCargo Express',
    category: 'Швидкісний вантажний потяг',
    icon: '🚅',
    network: 'rail',
    price: 110000,
    capacity: 40,
    speed: 240,
    fuelPerKm: 0.70,
    requiredCategory: 'train',
    desc: 'Надшвидкісний потяг для термінової доставки між мегаполісами.'
  },
  // Авіаційний флот
  {
    typeId: 'plane_atr',
    name: 'ATR 72-600F TurboFeeder',
    category: 'Регіональний літак',
    icon: '🛩️',
    network: 'air',
    price: 90000,
    capacity: 12,
    speed: 420,
    fuelPerKm: 1.60,
    requiredCategory: 'plane',
    desc: 'Швидкий турбогвинтовий транспортник для коротких рейсів.'
  },
  {
    typeId: 'plane',
    name: 'Airbus A330-200F Cargo',
    category: 'Вантажний лайнер',
    icon: '✈️',
    network: 'air',
    price: 180000,
    capacity: 35,
    speed: 580,
    fuelPerKm: 2.60,
    requiredCategory: 'plane',
    desc: 'Міжконтинентальний вантажний літак великої швидкості.'
  },
  {
    typeId: 'plane_an124',
    name: 'Antonov An-124 «Руслан»',
    category: 'Надважкий авіагігант',
    icon: '🛫',
    network: 'air',
    price: 320000,
    capacity: 120,
    speed: 620,
    fuelPerKm: 4.50,
    requiredCategory: 'plane',
    desc: 'Легендарний український літак для гігантських партій (до 120 т).'
  }
];

// Конфігурація рівнів гаражів
const GARAGE_TIERS = {
  1: { level: 1, name: 'Базовий автогараж', slots: 2, cost: 10000, upgradeCost: 14000, perkDesc: 'Місткість: 2 ТЗ. Знижка на подачу авто: 10%' },
  2: { level: 2, name: 'Логістичний ангар', slots: 5, cost: 24000, upgradeCost: 36000, perkDesc: 'Місткість: 5 ТЗ. Бонус до виплат з міста: +12%' },
  3: { level: 3, name: 'Мультимодальний хаб', slots: 12, cost: 60000, upgradeCost: 0, perkDesc: 'Місткість: 12 ТЗ. Бонус до виплат: +25%, пальне: -15%, дозволено потяги й авіа' }
};

// Інженерні компроміси (Trade-off Upgrades)
const TRADEOFFS_CONFIG = [
  {
    id: 'turbo_boost',
    title: 'Турбо-наддув Twin-Turbo',
    icon: '⚡',
    pro: '+25% Швидкість усього флоту',
    con: '+20% Витрати пального',
    price: 15000,
    speedMod: 0.25,
    fuelMod: 0.20,
    desc: 'Форсування турбокомпресорів скорочує час рейсів, проте підвищує споживання палива.'
  },
  {
    id: 'mega_trailers',
    title: 'Подовжені платформи Mega-Trailer',
    icon: '📦',
    pro: '+35% Місткість фургонів і тягачів',
    con: '-15% Максимальна швидкість',
    price: 18000,
    capacityMod: 0.35,
    speedMod: -0.15,
    desc: 'Подовжені причепи дозволяють брати значно більше вантажу ціною аеродинаміки.'
  },
  {
    id: 'eco_euro7',
    title: 'Еко-стандарт Євро-7 «Green Fleet»',
    icon: '🌿',
    pro: '-35% Споживання палива та викиди',
    con: '-10% Потужність та динаміка',
    price: 22000,
    fuelMod: -0.35,
    speedMod: -0.10,
    desc: 'Суворе програмне обмеження впорскування заощаджує пальне, але дещо сповільнює розгін.'
  },
  {
    id: 'express_24_7',
    title: 'Експрес-служба 24/7 «Night Express»',
    icon: '🔥',
    pro: '+40% До вартості всіх контрактів',
    con: '-25% Доступного часу на дедлайн',
    price: 30000,
    rewardMod: 0.40,
    deadlineMod: -0.25,
    desc: 'Преміальний надтерміновий сервіс платить значно більше, проте дедлайни стають жорсткішими.'
  },
  {
    id: 'ai_dispatcher',
    title: 'Нейромережевий диспетчер NeuraLog',
    icon: '🤖',
    pro: '-75% Час навантаження / розвантаження',
    con: '€400 Щоденна абонплата за ШІ-сервери',
    price: 35000,
    loadingMod: -0.75,
    dailyFee: 400,
    desc: 'Штучний інтелект миттєво обробляє митні документи, але вимагає щоденної оплати за сервери.'
  },
  {
    id: 'allianz_insurance',
    title: 'Міжнародний поліс Allianz Ultra',
    icon: '🛡️',
    pro: '0% Штрафів за запізнення та репутацію',
    con: '-12% Страховий відрахунок з кожного рейсу',
    price: 25000,
    noPenalty: true,
    feeMod: 0.12,
    desc: 'Страхова компанія покриває будь-які збитки при запізненні, але утримує 12% комісії.'
  }
];

// Базові апгрейди компанії
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

// Імена та аватари для біржі персоналу
const CANDIDATE_NAMES = [
  'Олександр Савченко', 'Максим Бондар', 'Ярослав Кравчук', 'Олена Мельник',
  'Віталій Шевчук', 'Дмитро Коваль', 'Peter Horváth', 'Martin Kováč',
  'Juraj Kučera', 'Tomáš Novák', 'Hans Gruber', 'Jean Dupont',
  'Marco Rossi', 'Lars Larsson', 'Carlos Santana', 'David Miller',
  'Anna Lindqvist', 'Piotr Wisniewski', 'Tamas Kovacs',
  'Ірина Ткаченко', 'Богдан Олійник', 'Сергій Литвиненко', 'Наталія Гончаренко',
  'Тарас Мороз', 'Юлія Бойко', 'Андрій Руденко', 'Оксана Павленко',
  'Katarzyna Nowak', 'Jakub Dvořák', 'Lukas Weber', 'Sophie Martin',
  'Giulia Bianchi', 'Javier García', 'Erik Johansson', 'Mikkel Jensen',
  'Ana Popescu', 'Georgi Dimitrov', 'Eleni Papadopoulou', 'Zoltán Nagy',
  'Pieter de Vries', 'Emma Wouters', 'Felix Bauer', 'Lucía Fernández'
];

// Склад біржі праці: мінімум кандидатів кожної кваліфікації
const DRIVER_MARKET_COMPOSITION = { van: 2, truck: 3, train: 2, plane: 2, all: 1 };
const DRIVER_MARKET_DAILY_CHURN = 3; // скільки кандидатів щодня змінюється

const CANDIDATE_AVATARS = ['👨‍✈️', '👩‍✈️', '🧔', '👨‍💼', '👩‍💼', '👨‍🔧', '👩‍🔧', '🧑‍✈️', '👱', '👩‍🦰'];
