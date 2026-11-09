/**
 * EuroTrans: Логістика Європи — Розширений ігровий рушій v2.0
 * Включає високоточну географію Європи, 35 хабів, розгалужену мережу доріг,
 * розширений автопарк із 12 машин, систему гаражів та найму персоналу,
 * інженерні компроміси (Trade-off upgrades) та Web Audio.
 */

// =============================================================================
// 1. Географічні дані міст Європи та транспортна мережа
// =============================================================================

const CITIES = {
  // Україна
  kyiv:      { id: 'kyiv',      name: 'Київ',      country: 'Україна',         lat: 50.4501, lon: 30.5234, hasRail: true,  hasAirport: true, isCapital: true },
  lviv:      { id: 'lviv',      name: 'Львів',     country: 'Україна',         lat: 49.8397, lon: 24.0297, hasRail: true,  hasAirport: true },
  odesa:     { id: 'odesa',     name: 'Одеса',     country: 'Україна',         lat: 46.4825, lon: 30.7233, hasRail: true,  hasAirport: true },
  kharkiv:   { id: 'kharkiv',   name: 'Харків',    country: 'Україна',         lat: 49.9935, lon: 36.2304, hasRail: true,  hasAirport: true },
  dnipro:    { id: 'dnipro',    name: 'Дніпро',    country: 'Україна',         lat: 48.4647, lon: 35.0462, hasRail: true,  hasAirport: true },

  // Польща
  warsaw:    { id: 'warsaw',    name: 'Варшава',   country: 'Польща',          lat: 52.2297, lon: 21.0122, hasRail: true,  hasAirport: true, isCapital: true },
  krakow:    { id: 'krakow',    name: 'Краків',    country: 'Польща',          lat: 50.0647, lon: 19.9450, hasRail: true,  hasAirport: true },
  gdansk:    { id: 'gdansk',    name: 'Гданськ',   country: 'Польща',          lat: 54.3520, lon: 18.6466, hasRail: true,  hasAirport: true },

  // Німеччина
  berlin:    { id: 'berlin',    name: 'Берлін',    country: 'Німеччина',       lat: 52.5200, lon: 13.4050, hasRail: true,  hasAirport: true, isCapital: true },
  hamburg:   { id: 'hamburg',   name: 'Гамбург',   country: 'Німеччина',       lat: 53.5511, lon: 9.9937,  hasRail: true,  hasAirport: true },
  frankfurt: { id: 'frankfurt', name: 'Франкфурт', country: 'Німеччина',       lat: 50.1109, lon: 8.6821,  hasRail: true,  hasAirport: true },
  munich:    { id: 'munich',    name: 'Мюнхен',    country: 'Німеччина',       lat: 48.1351, lon: 11.5820, hasRail: true,  hasAirport: true },

  // Франція
  paris:     { id: 'paris',     name: 'Париж',     country: 'Франція',         lat: 48.8566, lon: 2.3522,  hasRail: true,  hasAirport: true, isCapital: true },
  lyon:      { id: 'lyon',      name: 'Ліон',      country: 'Франція',         lat: 45.7640, lon: 4.8357,  hasRail: true,  hasAirport: true },
  marseille: { id: 'marseille', name: 'Марсель',   country: 'Франція',         lat: 43.2965, lon: 5.3698,  hasRail: true,  hasAirport: true },

  // Велика Британія
  london:    { id: 'london',    name: 'Лондон',    country: 'Велика Британія', lat: 51.5074, lon: -0.1278, hasRail: true,  hasAirport: true, isCapital: true },
  manchester:{ id: 'manchester',name: 'Манчестер', country: 'Велика Британія', lat: 53.4808, lon: -2.2426, hasRail: true,  hasAirport: true },

  // Іспанія
  madrid:    { id: 'madrid',    name: 'Мадрид',    country: 'Іспанія',         lat: 40.4168, lon: -3.7038, hasRail: true,  hasAirport: true, isCapital: true },
  barcelona: { id: 'barcelona', name: 'Барселона', country: 'Іспанія',         lat: 41.3879, lon: 2.1699,  hasRail: true,  hasAirport: true },
  valencia:  { id: 'valencia',  name: 'Валенсія',  country: 'Іспанія',         lat: 39.4699, lon: -0.3763, hasRail: true,  hasAirport: true },

  // Італія
  rome:      { id: 'rome',      name: 'Рим',       country: 'Італія',          lat: 41.9028, lon: 12.4964, hasRail: true,  hasAirport: true, isCapital: true },
  milan:     { id: 'milan',     name: 'Мілан',     country: 'Італія',          lat: 45.4642, lon: 9.1900,  hasRail: true,  hasAirport: true },
  naples:    { id: 'naples',    name: 'Неаполь',   country: 'Італія',          lat: 40.8518, lon: 14.2681, hasRail: true,  hasAirport: true },

  // Бенілюкс
  amsterdam: { id: 'amsterdam', name: 'Амстердам', country: 'Нідерланди',      lat: 52.3676, lon: 4.9041,  hasRail: true,  hasAirport: true, isCapital: true },
  rotterdam: { id: 'rotterdam', name: 'Роттердам', country: 'Нідерланди',      lat: 51.9244, lon: 4.4777,  hasRail: true,  hasAirport: true },
  brussels:  { id: 'brussels',  name: 'Брюссель',  country: 'Бельгія',         lat: 50.8503, lon: 4.3517,  hasRail: true,  hasAirport: true, isCapital: true },

  // Центральна та Південно-Східна Європа
  prague:    { id: 'prague',    name: 'Прага',     country: 'Чехія',           lat: 50.0755, lon: 14.4378, hasRail: true,  hasAirport: true, isCapital: true },
  bratislava:{ id: 'bratislava',name: 'Братислава',country: 'Словаччина',     lat: 48.1486, lon: 17.1077, hasRail: true,  hasAirport: true, isCapital: true },
  vienna:    { id: 'vienna',    name: 'Відень',    country: 'Австрія',         lat: 48.2082, lon: 16.3738, hasRail: true,  hasAirport: true, isCapital: true },
  budapest:  { id: 'budapest',  name: 'Будапешт',  country: 'Угорщина',        lat: 47.4979, lon: 19.0402, hasRail: true,  hasAirport: true, isCapital: true },
  zurich:    { id: 'zurich',    name: 'Цюрих',     country: 'Швейцарія',       lat: 47.3769, lon: 8.5417,  hasRail: true,  hasAirport: true },
  bucharest: { id: 'bucharest', name: 'Бухарест',  country: 'Румунія',         lat: 44.4268, lon: 26.1025, hasRail: true,  hasAirport: true, isCapital: true },
  sofia:     { id: 'sofia',     name: 'Софія',     country: 'Болгарія',        lat: 42.6977, lon: 23.3219, hasRail: true,  hasAirport: true, isCapital: true },
  athens:    { id: 'athens',    name: 'Афіни',     country: 'Греція',          lat: 37.9838, lon: 23.7275, hasRail: true,  hasAirport: true, isCapital: true },

  // Північна Європа
  copenhagen:{ id: 'copenhagen',name: 'Копенгаген',country: 'Данія',           lat: 55.6761, lon: 12.5683, hasRail: true,  hasAirport: true, isCapital: true },
  stockholm: { id: 'stockholm', name: 'Стокгольм', country: 'Швеція',          lat: 59.3293, lon: 18.0686, hasRail: true,  hasAirport: true, isCapital: true }
};

// Розширена мережа зв'язків між містами (шосе та залізниця)
const CONNECTIONS = [
  // --- Автомагістралі (Road) ---
  // Україна
  { from: 'kyiv', to: 'lviv', type: 'road', distance: 540 },
  { from: 'kyiv', to: 'odesa', type: 'road', distance: 480 },
  { from: 'kyiv', to: 'kharkiv', type: 'road', distance: 480 },
  { from: 'kyiv', to: 'dnipro', type: 'road', distance: 450 },
  { from: 'kharkiv', to: 'dnipro', type: 'road', distance: 220 },
  { from: 'dnipro', to: 'odesa', type: 'road', distance: 460 },
  { from: 'lviv', to: 'odesa', type: 'road', distance: 790 },
  { from: 'lviv', to: 'warsaw', type: 'road', distance: 390 },
  { from: 'lviv', to: 'krakow', type: 'road', distance: 330 },
  { from: 'lviv', to: 'bucharest', type: 'road', distance: 620 },
  { from: 'lviv', to: 'budapest', type: 'road', distance: 570 },
  { from: 'odesa', to: 'bucharest', type: 'road', distance: 560 },

  // Польща
  { from: 'warsaw', to: 'krakow', type: 'road', distance: 290 },
  { from: 'warsaw', to: 'gdansk', type: 'road', distance: 340 },
  { from: 'warsaw', to: 'berlin', type: 'road', distance: 570 },
  { from: 'krakow', to: 'prague', type: 'road', distance: 530 },
  { from: 'krakow', to: 'budapest', type: 'road', distance: 390 },
  { from: 'gdansk', to: 'berlin', type: 'road', distance: 480 },

  // Німеччина та Бенілюкс
  { from: 'berlin', to: 'hamburg', type: 'road', distance: 290 },
  { from: 'berlin', to: 'frankfurt', type: 'road', distance: 550 },
  { from: 'berlin', to: 'munich', type: 'road', distance: 590 },
  { from: 'berlin', to: 'prague', type: 'road', distance: 350 },
  { from: 'hamburg', to: 'copenhagen', type: 'road', distance: 340 },
  { from: 'hamburg', to: 'amsterdam', type: 'road', distance: 460 },
  { from: 'frankfurt', to: 'munich', type: 'road', distance: 390 },
  { from: 'frankfurt', to: 'zurich', type: 'road', distance: 410 },
  { from: 'frankfurt', to: 'paris', type: 'road', distance: 570 },
  { from: 'frankfurt', to: 'brussels', type: 'road', distance: 400 },
  { from: 'frankfurt', to: 'amsterdam', type: 'road', distance: 440 },
  { from: 'munich', to: 'vienna', type: 'road', distance: 430 },
  { from: 'munich', to: 'zurich', type: 'road', distance: 310 },
  { from: 'munich', to: 'milan', type: 'road', distance: 500 },
  { from: 'munich', to: 'prague', type: 'road', distance: 380 },
  { from: 'amsterdam', to: 'rotterdam', type: 'road', distance: 80 },
  { from: 'rotterdam', to: 'brussels', type: 'road', distance: 140 },
  { from: 'brussels', to: 'paris', type: 'road', distance: 310 },

  // Франція та Велика Британія
  { from: 'paris', to: 'london', type: 'road', distance: 450 },
  { from: 'london', to: 'manchester', type: 'road', distance: 330 },
  { from: 'london', to: 'rotterdam', type: 'road', distance: 420 },
  { from: 'paris', to: 'lyon', type: 'road', distance: 460 },
  { from: 'lyon', to: 'marseille', type: 'road', distance: 320 },
  { from: 'lyon', to: 'zurich', type: 'road', distance: 420 },
  { from: 'lyon', to: 'milan', type: 'road', distance: 440 },
  { from: 'marseille', to: 'barcelona', type: 'road', distance: 510 },
  { from: 'marseille', to: 'milan', type: 'road', distance: 510 },

  // Іспанія
  { from: 'barcelona', to: 'madrid', type: 'road', distance: 620 },
  { from: 'barcelona', to: 'valencia', type: 'road', distance: 350 },
  { from: 'madrid', to: 'valencia', type: 'road', distance: 360 },
  { from: 'madrid', to: 'paris', type: 'road', distance: 1270 },

  // Італія
  { from: 'milan', to: 'rome', type: 'road', distance: 570 },
  { from: 'milan', to: 'zurich', type: 'road', distance: 280 },
  { from: 'rome', to: 'naples', type: 'road', distance: 230 },

  // Центральна та Південна Європа
  { from: 'prague', to: 'vienna', type: 'road', distance: 330 },
  { from: 'vienna', to: 'bratislava', type: 'road', distance: 80 },
  { from: 'bratislava', to: 'budapest', type: 'road', distance: 200 },
  { from: 'bratislava', to: 'prague', type: 'road', distance: 330 },
  { from: 'bratislava', to: 'krakow', type: 'road', distance: 410 },
  { from: 'vienna', to: 'budapest', type: 'road', distance: 240 },
  { from: 'vienna', to: 'zurich', type: 'road', distance: 750 },
  { from: 'budapest', to: 'bucharest', type: 'road', distance: 830 },
  { from: 'budapest', to: 'sofia', type: 'road', distance: 760 },
  { from: 'bucharest', to: 'sofia', type: 'road', distance: 360 },
  { from: 'sofia', to: 'athens', type: 'road', distance: 790 },

  // Північна Європа
  { from: 'copenhagen', to: 'stockholm', type: 'road', distance: 650 },

  // --- Залізничні коридори (Rail) ---
  { from: 'kyiv', to: 'lviv', type: 'rail', distance: 520 },
  { from: 'kyiv', to: 'kharkiv', type: 'rail', distance: 460 },
  { from: 'kyiv', to: 'dnipro', type: 'rail', distance: 440 },
  { from: 'kyiv', to: 'odesa', type: 'rail', distance: 470 },
  { from: 'lviv', to: 'warsaw', type: 'rail', distance: 380 },
  { from: 'lviv', to: 'krakow', type: 'rail', distance: 320 },
  { from: 'warsaw', to: 'krakow', type: 'rail', distance: 270 },
  { from: 'warsaw', to: 'gdansk', type: 'rail', distance: 320 },
  { from: 'warsaw', to: 'berlin', type: 'rail', distance: 550 },
  { from: 'krakow', to: 'prague', type: 'rail', distance: 510 },
  { from: 'krakow', to: 'vienna', type: 'rail', distance: 440 },
  { from: 'vienna', to: 'bratislava', type: 'rail', distance: 75 },
  { from: 'bratislava', to: 'budapest', type: 'rail', distance: 195 },
  { from: 'bratislava', to: 'prague', type: 'rail', distance: 315 },
  { from: 'berlin', to: 'hamburg', type: 'rail', distance: 280 },
  { from: 'berlin', to: 'frankfurt', type: 'rail', distance: 530 },
  { from: 'berlin', to: 'prague', type: 'rail', distance: 330 },
  { from: 'prague', to: 'vienna', type: 'rail', distance: 310 },
  { from: 'vienna', to: 'budapest', type: 'rail', distance: 230 },
  { from: 'vienna', to: 'munich', type: 'rail', distance: 410 },
  { from: 'munich', to: 'frankfurt', type: 'rail', distance: 370 },
  { from: 'munich', to: 'zurich', type: 'rail', distance: 300 },
  { from: 'zurich', to: 'milan', type: 'rail', distance: 260 },
  { from: 'milan', to: 'rome', type: 'rail', distance: 550 },
  { from: 'rome', to: 'naples', type: 'rail', distance: 220 },
  { from: 'frankfurt', to: 'paris', type: 'rail', distance: 560 },
  { from: 'paris', to: 'brussels', type: 'rail', distance: 300 },
  { from: 'brussels', to: 'amsterdam', type: 'rail', distance: 210 },
  { from: 'paris', to: 'london', type: 'rail', distance: 440 },
  { from: 'paris', to: 'lyon', type: 'rail', distance: 450 },
  { from: 'lyon', to: 'marseille', type: 'rail', distance: 310 },
  { from: 'madrid', to: 'barcelona', type: 'rail', distance: 600 },
  { from: 'madrid', to: 'valencia', type: 'rail', distance: 350 },
  { from: 'copenhagen', to: 'stockholm', type: 'rail', distance: 630 }
];

// Високоточні контури європейського континенту
const EUROPE_COASTLINES = [
  // 1. Скандинавія та Фінляндія
  [
    {lon: 5.0, lat: 62.0}, {lon: 8.5, lat: 63.5}, {lon: 14.0, lat: 68.0}, {lon: 24.0, lat: 71.0},
    {lon: 28.0, lat: 70.0}, {lon: 31.0, lat: 69.5}, {lon: 30.0, lat: 65.0}, {lon: 29.0, lat: 61.0},
    {lon: 24.5, lat: 60.0}, {lon: 22.0, lat: 60.5}, {lon: 21.5, lat: 63.5}, {lon: 25.0, lat: 65.5},
    {lon: 21.0, lat: 65.0}, {lon: 17.5, lat: 62.5}, {lon: 18.5, lat: 59.5}, {lon: 16.0, lat: 56.0},
    {lon: 13.0, lat: 55.4}, {lon: 11.5, lat: 58.0}, {lon: 10.5, lat: 59.5}, {lon: 9.0, lat: 58.5},
    {lon: 5.5, lat: 58.5}, {lon: 5.0, lat: 62.0}
  ],
  // 2. Ютландія (Данія)
  [
    {lon: 8.5, lat: 55.0}, {lon: 8.2, lat: 56.5}, {lon: 10.5, lat: 57.7}, {lon: 10.8, lat: 56.0},
    {lon: 9.5, lat: 55.0}, {lon: 8.5, lat: 55.0}
  ],
  // 3. Велика Британія
  [
    {lon: -5.5, lat: 50.0}, {lon: -3.0, lat: 50.6}, {lon: 1.4, lat: 51.3}, {lon: 1.7, lat: 52.8},
    {lon: 0.2, lat: 53.7}, {lon: -1.5, lat: 55.0}, {lon: -2.0, lat: 57.0}, {lon: -3.0, lat: 58.5},
    {lon: -5.0, lat: 58.6}, {lon: -6.0, lat: 56.8}, {lon: -4.8, lat: 55.0}, {lon: -3.0, lat: 53.5},
    {lon: -4.5, lat: 52.8}, {lon: -5.3, lat: 51.7}, {lon: -3.5, lat: 51.4}, {lon: -5.5, lat: 50.0}
  ],
  // 4. Ірландія
  [
    {lon: -6.0, lat: 53.3}, {lon: -5.8, lat: 54.5}, {lon: -7.5, lat: 55.2}, {lon: -10.0, lat: 54.0},
    {lon: -10.3, lat: 52.0}, {lon: -8.0, lat: 51.5}, {lon: -6.0, lat: 52.2}, {lon: -6.0, lat: 53.3}
  ],
  // 5. Піренейський півострів (Іспанія та Португалія)
  [
    {lon: -1.8, lat: 43.4}, {lon: -8.5, lat: 43.8}, {lon: -9.2, lat: 43.0}, {lon: -8.8, lat: 41.5},
    {lon: -9.5, lat: 38.7}, {lon: -9.0, lat: 37.0}, {lon: -7.5, lat: 37.1}, {lon: -5.5, lat: 36.0},
    {lon: -2.0, lat: 36.7}, {lon: -0.5, lat: 38.3}, {lon: 0.5, lat: 40.5}, {lon: 2.2, lat: 41.4},
    {lon: 3.2, lat: 42.4}, {lon: 1.5, lat: 42.6}, {lon: -1.8, lat: 43.4}
  ],
  // 6. Континентальна Європа (Франція, Німеччина, Польща, Бенілюкс, Балтія)
  [
    {lon: -1.8, lat: 43.4}, {lon: -1.2, lat: 46.0}, {lon: -4.5, lat: 48.3}, {lon: -2.0, lat: 49.6},
    {lon: 1.5, lat: 50.5}, {lon: 3.5, lat: 51.3}, {lon: 5.0, lat: 53.0}, {lon: 7.0, lat: 53.6},
    {lon: 8.5, lat: 54.0}, {lon: 10.0, lat: 54.3}, {lon: 14.3, lat: 54.0}, {lon: 19.0, lat: 54.5},
    {lon: 21.0, lat: 55.5}, {lon: 24.0, lat: 57.0}, {lon: 26.5, lat: 59.5}, {lon: 30.0, lat: 60.0},
    {lon: 36.0, lat: 55.0}, {lon: 38.0, lat: 50.0}, {lon: 37.5, lat: 47.0}, {lon: 35.0, lat: 46.5},
    {lon: 30.5, lat: 45.3}, {lon: 28.5, lat: 43.5}, {lon: 27.5, lat: 41.5}, {lon: 24.0, lat: 40.5},
    {lon: 23.0, lat: 40.0}, {lon: 21.0, lat: 40.5}, {lon: 19.5, lat: 42.0}, {lon: 16.0, lat: 43.5},
    {lon: 14.0, lat: 45.0}, {lon: 13.5, lat: 45.6}, {lon: 12.3, lat: 45.4}, {lon: 10.0, lat: 44.0},
    {lon: 7.3, lat: 43.7}, {lon: 5.3, lat: 43.3}, {lon: 3.2, lat: 42.4}
  ],
  // 7. Апеннінський півострів (Італія)
  [
    {lon: 9.0, lat: 44.4}, {lon: 10.2, lat: 43.7}, {lon: 12.0, lat: 41.8}, {lon: 14.2, lat: 40.8},
    {lon: 15.8, lat: 38.2}, {lon: 16.5, lat: 39.0}, {lon: 18.0, lat: 40.3}, {lon: 17.0, lat: 41.1},
    {lon: 15.0, lat: 42.0}, {lon: 13.5, lat: 43.6}, {lon: 12.3, lat: 44.8}, {lon: 11.5, lat: 44.5},
    {lon: 9.0, lat: 44.4}
  ],
  // 8. Сицилія
  [
    {lon: 12.5, lat: 38.0}, {lon: 15.5, lat: 38.2}, {lon: 15.3, lat: 37.0}, {lon: 14.0, lat: 36.7},
    {lon: 12.5, lat: 38.0}
  ],
  // 9. Греція та Пелопоннес
  [
    {lon: 20.8, lat: 39.5}, {lon: 22.0, lat: 38.3}, {lon: 21.5, lat: 37.0}, {lon: 22.5, lat: 36.4},
    {lon: 23.2, lat: 36.8}, {lon: 24.0, lat: 38.0}, {lon: 23.5, lat: 39.5}, {lon: 22.5, lat: 40.0},
    {lon: 20.8, lat: 39.5}
  ],
  // 10. Кримський півострів (Україна)
  [
    {lon: 33.6, lat: 46.1}, {lon: 35.0, lat: 45.3}, {lon: 36.5, lat: 45.3}, {lon: 35.8, lat: 44.9},
    {lon: 34.2, lat: 44.4}, {lon: 33.5, lat: 44.6}, {lon: 32.5, lat: 45.3}, {lon: 33.6, lat: 45.8},
    {lon: 33.6, lat: 46.1}
  ]
];

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
  'Anna Lindqvist', 'Piotr Wisniewski', 'Tamas Kovacs'
];

const CANDIDATE_AVATARS = ['👨‍✈️', '👩‍✈️', '🧔', '👨‍💼', '👩‍💼'];

// =============================================================================
// 2. Аудіо-синтезатор (Web Audio API з керуванням гучністю)
// =============================================================================

class SoundFX {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.enabled = true;
    this.volume = 0.7; // 70% за замовчуванням
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.updateMasterGain();
        this.masterGain.connect(this.ctx.destination);
      }
    }
  }

  updateMasterGain() {
    if (this.ctx && this.masterGain) {
      const targetGain = this.enabled ? this.volume : 0;
      this.masterGain.gain.setValueAtTime(targetGain, this.ctx.currentTime);
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.init();
    this.updateMasterGain();
  }

  setEnabled(enable) {
    this.enabled = enable;
    this.init();
    this.updateMasterGain();
  }

  playCash() {
    if (!this.enabled || this.volume <= 0) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (мажорний акорд)
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gain.gain.setValueAtTime(0.15, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.36);
    });
  }

  playOrderAccepted() {
    if (!this.enabled || this.volume <= 0) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  playHorn() {
    if (!this.enabled || this.volume <= 0) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    [220, 277.18].forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.42);
    });
  }

  playWarning() {
    if (!this.enabled || this.volume <= 0) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(260, now);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.26);
  }
}

// =============================================================================
// Покроковий інтерактивний туторіал
// =============================================================================

const TUTORIAL_STEPS = [
  {
    step: 1,
    badge: "Крок 1 з 8",
    title: "Ласкаво просимо в EuroTrans Logistics v2.0!",
    icon: "🌐",
    desc: "Ви очолюєте сучасну пан'європейську логістичну компанію. Ваша мета — розбудувати мережу доставки між містами Європи, купувати гаражі й ангари, наймати найкращих водіїв та розвивати величезний флот!",
    tip: "У верхній панелі постійно відображаються ваш капітал (€), репутація (⭐), місткість гаражів, штат персоналу та ігровий календар.",
    highlight: ".top-bar",
    tab: null
  },
  {
    step: 2,
    badge: "Крок 2 з 8",
    title: "Детальна інтерактивна мапа Європи",
    icon: "🗺️",
    desc: "Мапа охоплює 35 європейських хабів з детальними береговими лініями. Блакитні лінії — автобани, жовті пунктири — залізниці, фіолетові — авіалінії. Міста, де у вас є власні бази та ангари, позначені іконкою 🏠.",
    tip: "Клацніть на будь-яке місто на мапі, щоб миттєво відфільтрувати список рейсів, які вирушають саме звідти!",
    highlight: ".map-section",
    tab: null
  },
  {
    step: 3,
    badge: "Крок 3 з 8",
    title: "Вибір та прийняття контрактів",
    icon: "📋",
    desc: "У вкладці 'Контракти' зліва з'являються замовлення: від свіжих фруктів та електроніки до промислового обладнання та аерокосмічних компонентів. Кожен контракт має фіксовану винагороду (+€), вагу партії та таймер дедлайну (⏱️).",
    tip: "Звертайте особливу увагу на замовлення з позначкою 🔥 Експрес — вони значно дорожчі, але вимагають швидкого виконання!",
    highlight: "#tab-contracts",
    tab: "contracts"
  },
  {
    step: 4,
    badge: "Крок 4 з 8",
    title: "Флот із 12 моделей транспорту",
    icon: "🚛",
    desc: "У магазині доступно 12 видів техніки: спритні електрофургони, далекобійні тягачі TIR (Volvo FH16, Scania 770S, Gigaliner), важкі локомотиви (Siemens Vectron, TGV) та гігантські вантажні літаки (Airbus, An-124).",
    tip: "Потяги курсують лише залізницею, а вантажні літаки миттєво перетинають континент між авіахабами!",
    highlight: "#tab-shop",
    tab: "shop"
  },
  {
    step: 5,
    badge: "Крок 5 з 8",
    title: "Мережа гаражів та ангарів",
    icon: "🏠",
    desc: "Кількість техніки у флоті обмежена машиномісцями. Відкривайте бази в різних містах Європи та модернізуйте їх до логістичних хабів і ангарів — це відкриває нові слоти та дає постійні бонуси до прибутку з цього міста!",
    tip: "Ангар 3-го рівня дає +25% до виплат за замовлення з цього міста та зменшує витрату палива на 15%.",
    highlight: ".tab-btn[data-tab='garages']",
    tab: "garages"
  },
  {
    step: 6,
    badge: "Крок 6 з 8",
    title: "Штат водіїв та біржа праці",
    icon: "👔",
    desc: "Кожен транспорт потребує кваліфікованого водія відповідної категорії (фургони, тягачі, потяги, авіа). Виконуючи рейси, водії накопичують XP, підвищують рівень і збільшують швидкість та паливну економію флоту.",
    tip: "Закріплюйте найнятих співробітників за машинами у вкладці 'Мої водії' через випадаючий список.",
    highlight: ".tab-btn[data-tab='drivers']",
    tab: "drivers"
  },
  {
    step: 7,
    badge: "Крок 7 з 8",
    title: "Стратегічні компромісні апгрейди",
    icon: "⚡",
    desc: "Доступні 6 потужних компромісних технологій: вони дають величезну перевагу в одній сфері ціною певної втрати в іншій (наприклад, Twin-Turbo +25% швидкості, але +20% витрат палива). Ви можете вільно вмикати та вимикати їх.",
    tip: "Підбирайте комбінацію компромісів під вашу поточну стратегію розвитку компанії!",
    highlight: ".tab-btn[data-tab='upgrades']",
    tab: "upgrades"
  },
  {
    step: 8,
    badge: "Крок 8 з 8",
    title: "Керування часом та Меню Паузи (Esc)",
    icon: "⏸️",
    desc: "Керуйте швидкістю симуляції кнопками 1x, 2x, 4x або заморожуйте мапу кнопкою паузи справа зверху. Натискання клавіші Esc відкриває повноцінне системне меню паузи з налаштуваннями звуку та перезапуском гри.",
    tip: "Натисніть 'Вперед до гри', беріть перші замовлення та створюйте найпотужнішу логістичну імперію Європи!",
    highlight: ".controls-group",
    tab: "contracts"
  }
];

// =============================================================================
// 3. Ігровий Стан (Game State)
// =============================================================================

class GameState {
  constructor() {
    this.lang = localStorage.getItem('eurotrans_lang') || 'uk';
    this.money = 25000;
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

    // Гаражі компанії: cityId -> { cityId, level, name, slots }
    this.garages = {
      kyiv: { cityId: 'kyiv', level: 1, name: 'Київський базовий автогараж', slots: 2 }
    };

    // Персонал (водії)
    this.drivers = [];
    this.driverMarket = [];
    this.driverSubtab = 'my'; // 'my' або 'market'

    // Базові апгрейди
    this.upgrades = {
      eco_driving: 0,
      gps_telematics: 0,
      logistics_hub: 0,
      vip_broker: 0
    };

    // Інженерні компроміси (Trade-off Upgrades)
    this.activeTradeoffs = {
      turbo_boost: false,
      mega_trailers: false,
      eco_euro7: false,
      express_24_7: false,
      ai_dispatcher: false,
      allianz_insurance: false
    };

    this.unlockedTradeoffs = {};

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
    // Початковий водій
    const initDriver = {
      id: 'd_init_1',
      name: 'Андрій Коваленко',
      avatar: '👨‍✈️',
      qualification: 'all',
      level: 1,
      xp: 0,
      xpNeeded: 100,
      speedBonus: 0.05,
      fuelBonus: 0.05,
      salaryPerTrip: 100,
      assignedVehicleId: 'v_init_1'
    };
    this.drivers.push(initDriver);

    // Початковий автомобіль
    this.fleet.push({
      id: 'v_init_1',
      typeId: 'van',
      name: 'Mercedes Sprinter Cargo #1',
      category: 'Бус / Мінівен',
      icon: '🚐',
      network: 'road',
      capacity: 3.5,
      speed: 140,
      fuelPerKm: 0.22,
      location: 'kyiv',
      status: 'idle',
      assignedDriverId: 'd_init_1',
      currentContract: null,
      path: [],
      currentLeg: 0,
      legProgress: 0,
      waitTimer: 0
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

    // Налаштування високоточної проекції мапи Європи
    this.geoBounds = {
      minLon: -11.0,
      maxLon: 38.5,
      minLat: 35.5,
      maxLat: 62.0
    };

    this.lastTimestamp = performance.now();
    this.contractGenTimer = 0;
    this.eventTimer = 40; // кожні 40 секунд нова випадкова подія

    this.prePauseSpeed = 1;
    this.preFreezeSpeed = 1;
    this.preTutorialSpeed = 1;
    this.currentTutorialStep = 0;

    // Відновлення налаштувань звуку
    const savedVol = localStorage.getItem('eurotrans_volume');
    if (savedVol !== null) {
      this.sound.setVolume(parseInt(savedVol, 10) / 100);
    }
    const savedSound = localStorage.getItem('eurotrans_sound_enabled');
    if (savedSound !== null) {
      this.sound.setEnabled(savedSound === 'true');
      const btnSound = document.getElementById('btnSound');
      if (btnSound) btnSound.textContent = this.sound.enabled ? '🔊' : '🔇';
    }

    // Відновлення обраної мови
    const savedLang = localStorage.getItem('eurotrans_lang');
    if (savedLang && ['sk', 'uk', 'en', 'de'].includes(savedLang)) {
      this.state.lang = savedLang;
    }

    // Відновлення теми (темна / світла)
    const savedTheme = localStorage.getItem('eurotrans_theme');
    if (savedTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }

    this.bindEvents();
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.state.initDefaultFleet();
    this.generateCandidateDrivers();
    this.generateInitialContracts();
    this.setLanguage(this.state.lang, false);

    // Запуск головного ігрового циклу
    requestAnimationFrame((t) => this.loop(t));

    // Перевірка першого запуску для показу покрокового туторіалу
    const tutorialCompleted = localStorage.getItem('eurotrans_tutorial_completed');
    if (!tutorialCompleted) {
      setTimeout(() => this.startTutorial(), 600);
    }
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

    // Розрахунок винагороди з урахуванням бонусів та компромісних технологій
    let urgencyFactor = cargo.isUrgent ? 1.4 : 1.0;
    if (this.state.hasVipLicense && Math.random() < 0.25) urgencyFactor = 1.9;

    const mods = this.getTradeoffModifiers();
    const baseReward = Math.round(straightDist * cargo.valuePerKm * urgencyFactor * this.state.rewardBonus * (1 + mods.rewardMod));
    const deadlineFactor = (cargo.isUrgent ? 1.2 : 2.0) * (1 + mods.deadlineMod);
    const deadlineSeconds = Math.max(40, Math.round((straightDist / 25) * deadlineFactor));

    return {
      id: 'c_' + Math.random().toString(36).substr(2, 9),
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

        // Щоденні витрати на компромісні модифікації
        if (this.state.activeTradeoffs.ai_dispatcher) {
          this.state.money = Math.max(0, this.state.money - 400);
          this.showToast(this.t('toast_ai_fee'), 'info');
        }
      }
    }

    // Оновлення контрактів
    for (let i = this.state.contracts.length - 1; i >= 0; i--) {
      const c = this.state.contracts[i];
      c.timeLeft -= effectiveDt;
      if (c.timeLeft <= 0) {
        // Контракт протерміновано в списку
        this.state.contracts.splice(i, 1);
        const cType = this.getCargoType(c);
        const cName = this.getCargoName(cType, c.cargoName);
        this.showToast(this.tTemplate('toast_contract_expired', { cargo: `${c.cargoIcon} ${cName}` }), 'warning');
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

  getTotalGarageSlots() {
    let total = 0;
    Object.values(this.state.garages).forEach(g => {
      total += g.slots || 2;
    });
    return total;
  }

  getTradeoffModifiers() {
    let speedMod = 0;
    let fuelMod = 0;
    let capacityMod = 0;
    let rewardMod = 0;
    let deadlineMod = 0;
    let loadingMod = 0;
    let noPenalty = false;
    let feeMod = 0;

    TRADEOFFS_CONFIG.forEach(t => {
      if (this.state.activeTradeoffs[t.id]) {
        if (t.speedMod) speedMod += t.speedMod;
        if (t.fuelMod) fuelMod += t.fuelMod;
        if (t.capacityMod) capacityMod += t.capacityMod;
        if (t.rewardMod) rewardMod += t.rewardMod;
        if (t.deadlineMod) deadlineMod += t.deadlineMod;
        if (t.loadingMod) loadingMod += t.loadingMod;
        if (t.noPenalty) noPenalty = true;
        if (t.feeMod) feeMod += t.feeMod;
      }
    });

    return { speedMod, fuelMod, capacityMod, rewardMod, deadlineMod, loadingMod, noPenalty, feeMod };
  }

  generateCandidateDrivers() {
    this.state.driverMarket = [];
    const qualifications = ['van', 'truck', 'train', 'plane', 'all'];

    for (let i = 0; i < 4; i++) {
      const name = CANDIDATE_NAMES[Math.floor(Math.random() * CANDIDATE_NAMES.length)];
      const avatar = CANDIDATE_AVATARS[Math.floor(Math.random() * CANDIDATE_AVATARS.length)];
      const qual = qualifications[Math.floor(Math.random() * qualifications.length)];
      const level = Math.floor(Math.random() * 3) + 1;

      this.state.driverMarket.push({
        id: 'd_market_' + Math.random().toString(36).substr(2, 9),
        name: name,
        avatar: avatar,
        qualification: qual,
        level: level,
        xp: 0,
        xpNeeded: level * 100,
        speedBonus: +(0.03 * level).toFixed(2),
        fuelBonus: +(0.04 * level).toFixed(2),
        salaryPerTrip: level * 110,
        hireCost: level * 1200
      });
    }
  }

  updateVehicle(v, dt) {
    if (v.status === 'idle') return;

    const driver = this.state.drivers.find(d => d.id === v.assignedDriverId);
    const driverSpeedBonus = driver ? driver.speedBonus : 0;
    const driverFuelBonus = driver ? driver.fuelBonus : 0;
    const mods = this.getTradeoffModifiers();

    // Завантаження вантажу
    if (v.status === 'loading') {
      v.waitTimer -= dt;
      if (v.waitTimer <= 0) {
        v.status = 'in_transit';
        this.showToast(this.tTemplate('toast_vehicle_loaded', {
          vehicle: v.name,
          city: this.getCityName(v.location)
        }), 'info');
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

      // Ефективна швидкість з урахуванням навичок водія та компромісних апгрейдів
      const effectiveSpeed = v.speed * this.state.speedBoost * this.state.event.speedMultiplier * (1 + mods.speedMod) * (1 + driverSpeedBonus);
      const speedKmS = (effectiveSpeed / 3600) * 1100;

      const stepProgress = (speedKmS * dt) / Math.max(1, segDistance);
      v.legProgress += stepProgress;

      // Списання витрат на пальне (з урахуванням еко-водіння)
      const effectiveFuelPerKm = v.fuelPerKm * (1 - this.state.fuelDiscount) * this.state.event.fuelMultiplier * (1 + mods.fuelMod) * (1 - driverFuelBonus);
      const fuelCost = segDistance * stepProgress * Math.max(0.02, effectiveFuelPerKm);
      this.state.money = Math.max(0, this.state.money - fuelCost);

      if (v.legProgress >= 1.0) {
        v.legProgress = 0;
        v.currentLeg++;
        v.location = toCity.id;

        // Дісталися кінця всього шляху
        if (v.currentLeg >= v.path.length - 1) {
          if (v.status === 'moving_to_pickup') {
            v.status = 'loading';
            const baseWait = 2.0;
            v.waitTimer = Math.max(0.4, baseWait * (1 + mods.loadingMod));
            // Прокладаємо маршрут до кінцевого пункту
            v.path = this.findPath(v.currentContract.origin, v.currentContract.destination, v.network);
            v.currentLeg = 0;
            v.legProgress = 0;
            this.showToast(this.tTemplate('toast_vehicle_arrived_pickup', {
              vehicle: v.name,
              city: this.getCityName(toCity.id)
            }), 'info');
          } else if (v.status === 'in_transit') {
            v.status = 'unloading';
            const baseWait = 2.0;
            v.waitTimer = Math.max(0.4, baseWait * (1 + mods.loadingMod));
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

    const mods = this.getTradeoffModifiers();
    let payout = c.reward;
    let repChange = 2;

    // Бонус гаража у місті відправлення
    const originGarage = this.state.garages[c.origin];
    if (originGarage) {
      if (originGarage.level === 2) payout = Math.round(payout * 1.12);
      if (originGarage.level === 3) payout = Math.round(payout * 1.25);
    }

    // Страховий відрахунок якщо страховка увімкнена
    if (mods.feeMod > 0) {
      payout = Math.round(payout * (1 - mods.feeMod));
    }

    const cType = this.getCargoType(c);
    const cargoLocalized = `${c.cargoIcon} ${this.getCargoName(cType, c.cargoName)}`;

    if (c.timeLeft < 0) {
      if (mods.noPenalty) {
        repChange = 1;
        this.showToast(this.tTemplate('toast_trip_late_insured', { payout: payout.toLocaleString() }), 'info');
      } else {
        payout = Math.max(c.reward * 0.5, payout - c.penalty);
        repChange = -5;
        this.showToast(this.tTemplate('toast_trip_late', { payout: payout.toLocaleString() }), 'warning');
        this.sound.playWarning();
      }
    } else {
      this.showToast(this.tTemplate('toast_trip_success', {
        cargo: cargoLocalized,
        city: this.getCityName(c.destination),
        payout: payout.toLocaleString()
      }), 'success');
      this.sound.playCash();
    }

    this.state.money += payout;
    this.state.reputation = Math.min(100, Math.max(10, this.state.reputation + repChange));
    this.state.deliveriesCount++;

    // Досвід та виплата заробітної плати водієві
    const driver = this.state.drivers.find(d => d.id === v.assignedDriverId);
    if (driver) {
      this.state.money = Math.max(0, this.state.money - driver.salaryPerTrip);
      driver.xp += 30;
      if (driver.xp >= driver.xpNeeded) {
        driver.level++;
        driver.xp -= driver.xpNeeded;
        driver.xpNeeded = Math.round(driver.xpNeeded * 1.4);
        driver.speedBonus = +(driver.speedBonus + 0.02).toFixed(2);
        driver.fuelBonus = +(driver.fuelBonus + 0.02).toFixed(2);
        driver.salaryPerTrip += 20;
        this.showToast(this.tTemplate('toast_driver_levelup', {
          driver: this.getDriverName(driver.name),
          level: driver.level
        }), 'success');
      }
    }

    v.status = 'idle';
    v.currentContract = null;
    v.path = [];
    v.currentLeg = 0;
    v.legProgress = 0;

    this.updateCompanyTier();
    this.renderFleetUI();
    this.renderContractsUI();
    this.renderDriversUI();
  }

  triggerRandomEvent() {
    const lang = this.state.lang || 'uk';
    const rawEvents = (typeof EVENTS_I18N !== 'undefined' && Array.isArray(EVENTS_I18N)) ? EVENTS_I18N : [
      {
        id: 'fuel_spike',
        name: { uk: 'Паливна криза в Західній Європі', sk: 'Ropný šok na európskych trhoch', en: 'European Fuel Price Spike', de: 'Treibstoffpreisschock in Europa' },
        desc: { uk: 'Ціни на нафту підскочили! Вартість пального +30% на 40 секунд.', sk: 'Ceny ropy prudko vzrástli! Náklady na palivo +30% na 40 sekúnd.', en: 'Crude oil prices spiked! Fuel expenses +30% for 40 seconds.', de: 'Rohölpreise explodiert! Kraftstoffkosten +30 % für 40 Sekunden.' },
        fuelMultiplier: 1.3,
        speedMultiplier: 1.0,
        type: 'warning'
      }
    ];

    const template = rawEvents[Math.floor(Math.random() * rawEvents.length)];
    const evName = (template.name && (template.name[lang] || template.name.uk || template.name.en)) || template.name || 'News';
    const evDesc = (template.desc && (template.desc[lang] || template.desc.uk || template.desc.en)) || template.desc || '';

    this.state.event = {
      ...template,
      name: evName,
      desc: evDesc
    };

    const ticker = document.getElementById('tickerContent');
    if (ticker) {
      ticker.textContent = `${evName} — ${evDesc}`;
    }
    const newsTitle = this.t('News') || 'Новина';
    this.showToast(`📢 ${newsTitle}: ${evName}`, template.type || 'info');
  }

  updateCompanyTier() {
    const tierEl = document.getElementById('companyTier');
    let title = this.t('company_tier_starter') || 'Стартап-перевізник';
    const d = this.state.deliveriesCount;
    const m = this.state.money;

    if (d >= 35 || m >= 150000) {
      title = '🏆 ' + (this.t('company_tier_leader') || 'Логістичний Імператор Європи');
    } else if (d >= 20 || m >= 75000) {
      title = '🌐 ' + (this.t('company_tier_international') || 'Трансʼєвропейський Консорціум');
    } else if (d >= 10 || m >= 35000) {
      title = '🚛 ' + (this.t('company_tier_national') || 'Національна Доставка');
    } else if (d >= 4 || m >= 20000) {
      title = '📦 ' + (this.t('company_tier_regional') || 'Регіональний Лідер Доставки');
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

    // Визначаємо кольори залежно від теми
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const colBg       = isLight ? '#dbeafe' : '#060a14';
    const colGrid     = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.03)';
    const colLand     = isLight ? '#e8f4fc' : '#0f172a';
    const colLandLine = isLight ? '#c8ddf0' : '#1e293b';
    const colCityDot  = (selected, hovered, pending) => {
      if (selected) return '#0284c7';
      if (pending > 0) return isLight ? '#059669' : '#10b981';
      return isLight ? '#6b7280' : '#94a3b8';
    };
    const colCityStroke  = isLight ? '#dbeafe' : '#090d16';
    const colCityLabel   = (selected, hovered) => selected ? (isLight ? '#0284c7' : '#38bdf8') : (hovered ? (isLight ? '#111' : '#fff') : (isLight ? '#374151' : '#94a3b8'));

    // Очищення екрану
    ctx.fillStyle = colBg;
    ctx.fillRect(0, 0, w, h);

    // Малюємо координатну сітку диспетчера
    ctx.strokeStyle = colGrid;
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
    ctx.fillStyle = colLand;
    ctx.strokeStyle = colLandLine;
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
      ctx.fillStyle = colCityDot(isSelected, isHovered, pendingOrders);
      ctx.fill();
      ctx.strokeStyle = colCityStroke;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Назва міста
      ctx.font = isSelected ? 'bold 11px Inter, sans-serif' : '10px Inter, sans-serif';
      ctx.fillStyle = colCityLabel(isSelected, isHovered);
      ctx.textAlign = 'center';
      ctx.fillText(this.getCityName(city.id), p.x, p.y - 10);

      // Позначка наявності власного гаража / ангара
      if (this.state.garages[city.id]) {
        const g = this.state.garages[city.id];
        ctx.beginPath();
        ctx.arc(p.x, p.y, isSelected ? 12 : 9, 0, Math.PI * 2);
        ctx.strokeStyle = g.level === 3 ? '#10b981' : '#38bdf8';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🏠', p.x - 11, p.y - 7);
      }

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

        if (targetTab === 'contracts') this.renderContractsUI();
        if (targetTab === 'fleet') this.renderFleetUI();
        if (targetTab === 'shop') this.renderShopUI();
        if (targetTab === 'garages') this.renderGaragesUI();
        if (targetTab === 'drivers') this.renderDriversUI();
        if (targetTab === 'upgrades') this.renderUpgradesUI();
      });
    });

    // Підвкладки водіїв (Мої водії / Ринок праці)
    document.getElementById('subtabMyDrivers')?.addEventListener('click', () => {
      this.state.driverSubtab = 'my';
      document.getElementById('subtabMyDrivers')?.classList.add('active');
      document.getElementById('subtabRecruitDrivers')?.classList.remove('active');
      this.renderDriversUI();
    });

    document.getElementById('subtabRecruitDrivers')?.addEventListener('click', () => {
      this.state.driverSubtab = 'market';
      document.getElementById('subtabRecruitDrivers')?.classList.add('active');
      document.getElementById('subtabMyDrivers')?.classList.remove('active');
      this.renderDriversUI();
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
    document.getElementById('btnPause')?.addEventListener('click', () => this.toggleMapFreeze());
    document.getElementById('btnUnfreezeMap')?.addEventListener('click', () => this.toggleMapFreeze());
    document.getElementById('btnSpeed1')?.addEventListener('click', () => this.setSpeed(1));
    document.getElementById('btnSpeed2')?.addEventListener('click', () => this.setSpeed(2));
    document.getElementById('btnSpeed4')?.addEventListener('click', () => this.setSpeed(4));

    // Звук у верхній панелі
    const btnSound = document.getElementById('btnSound');
    btnSound?.addEventListener('click', () => {
      this.sound.setEnabled(!this.sound.enabled);
      btnSound.textContent = this.sound.enabled ? '🔊' : '🔇';
      const toggleSound = document.getElementById('toggleSoundEffects');
      if (toggleSound) toggleSound.checked = this.sound.enabled;
      localStorage.setItem('eurotrans_sound_enabled', String(this.sound.enabled));
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
    document.getElementById('btnRestartTutorialFromHelp')?.addEventListener('click', () => {
      document.getElementById('helpModal')?.classList.add('hidden');
      this.startTutorial();
    });

    // Рестарт гри з верхньої панелі
    document.getElementById('btnReset')?.addEventListener('click', () => {
      if (confirm('Справді почати нову логістичну компанію з нуля?')) {
        this.state = new GameState();
        this.state.initDefaultFleet();
        this.generateCandidateDrivers();
        this.generateInitialContracts();
        this.renderUI();
        this.showToast('🚀 Розпочато нову гру!', 'success');
      }
    });

    // Модальне вікно призначення
    document.getElementById('btnCloseAssignModal')?.addEventListener('click', () => {
      document.getElementById('assignModal')?.classList.add('hidden');
    });

    // Перемикач мов у меню паузи
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lang = e.currentTarget.getAttribute('data-lang');
        this.setLanguage(lang);
      });
    });

    // Кнопка швидкої зміни мови у верхній панелі
    document.getElementById('btnLang')?.addEventListener('click', () => {
      const order = ['uk', 'sk', 'en', 'de'];
      const next = order[(order.indexOf(this.state.lang) + 1) % order.length];
      this.setLanguage(next);
    });

    // Керування клавішею Esc для меню паузи та закриття модалок
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.code === 'Escape') {
        // 1. Якщо відкрита модалка призначення — закриваємо
        const assignModal = document.getElementById('assignModal');
        if (assignModal && !assignModal.classList.contains('hidden')) {
          assignModal.classList.add('hidden');
          return;
        }
        // 2. Якщо відкрита довідка — закриваємо
        const helpModal = document.getElementById('helpModal');
        if (helpModal && !helpModal.classList.contains('hidden')) {
          helpModal.classList.add('hidden');
          return;
        }
        // 3. Якщо відкритий туторіал — закриваємо
        const tutorialModal = document.getElementById('tutorialModal');
        if (tutorialModal && !tutorialModal.classList.contains('hidden')) {
          this.closeTutorial();
          return;
        }
        // 4. Інакше — перемикаємо меню паузи
        this.togglePauseMenu();
      }
    });

    // Меню паузи: кнопки та налаштування
    document.getElementById('btnResumeGame')?.addEventListener('click', () => this.closePauseMenu());
    document.getElementById('btnClosePauseModal')?.addEventListener('click', () => this.closePauseMenu());

    // Повзунок гучності
    const volSlider = document.getElementById('volumeSlider');
    volSlider?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      const percentEl = document.getElementById('volumePercent');
      if (percentEl) percentEl.textContent = `${val}%`;
      this.sound.setVolume(val / 100);
      localStorage.setItem('eurotrans_volume', String(val));
    });

    // Тест звуку
    document.getElementById('btnTestSound')?.addEventListener('click', () => {
      this.sound.playCash();
    });

    // Перемикач звукових ефектів у паузі
    const toggleSound = document.getElementById('toggleSoundEffects');
    toggleSound?.addEventListener('change', (e) => {
      this.sound.setEnabled(e.target.checked);
      if (btnSound) btnSound.textContent = this.sound.enabled ? '🔊' : '🔇';
      localStorage.setItem('eurotrans_sound_enabled', String(this.sound.enabled));
      this.showToast(this.sound.enabled ? 'Звук увімкнено' : 'Звук вимкнено', 'info');
    });

    // Перемикач теми (Світла / Темна)
    const toggleTheme = document.getElementById('toggleLightTheme');
    toggleTheme?.addEventListener('change', (e) => {
      this.setTheme(e.target.checked ? 'light' : 'dark');
    });

    // Дії в меню паузи
    document.getElementById('btnRestartTutorialFromPause')?.addEventListener('click', () => {
      this.closePauseMenu();
      this.startTutorial();
    });

    document.getElementById('btnOpenHelpFromPause')?.addEventListener('click', () => {
      this.closePauseMenu();
      document.getElementById('helpModal')?.classList.remove('hidden');
    });

    document.getElementById('btnRestartGameFromPause')?.addEventListener('click', () => {
      if (confirm('Справді почати нову логістичну компанію з нуля? Весь флот, баланс і статистика будуть скинуті.')) {
        this.state = new GameState();
        this.state.initDefaultFleet();
        this.generateCandidateDrivers();
        this.generateInitialContracts();
        this.renderUI();
        this.closePauseMenu();
        this.setSpeed(1);
        this.showToast('🚀 Розпочато нову гру!', 'success');
      }
    });

    // Кнопки туторіалу
    document.getElementById('btnSkipTutorial')?.addEventListener('click', () => this.closeTutorial());
    document.getElementById('btnTutNext')?.addEventListener('click', () => this.nextTutorialStep());
    document.getElementById('btnTutPrev')?.addEventListener('click', () => this.prevTutorialStep());

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

    const freezeBanner = document.getElementById('mapFreezeBanner');
    const canvasWrap = document.getElementById('canvasWrapper');

    if (val === 0) {
      document.getElementById('btnPause')?.classList.add('active');
      const pauseModalOpen = !document.getElementById('pauseModal')?.classList.contains('hidden');
      const tutorialOpen = !document.getElementById('tutorialModal')?.classList.contains('hidden');

      if (!pauseModalOpen && !tutorialOpen) {
        freezeBanner?.classList.remove('hidden');
        canvasWrap?.classList.add('is-frozen');
      } else {
        freezeBanner?.classList.add('hidden');
        canvasWrap?.classList.remove('is-frozen');
      }
    } else {
      freezeBanner?.classList.add('hidden');
      canvasWrap?.classList.remove('is-frozen');
      if (val === 1) document.getElementById('btnSpeed1')?.classList.add('active');
      if (val === 2) document.getElementById('btnSpeed2')?.classList.add('active');
      if (val === 4) document.getElementById('btnSpeed4')?.classList.add('active');
    }
  }

  // Заморозка / розморозка мапи (кнопка паузи справа зверху)
  toggleMapFreeze() {
    if (this.state.timeSpeed === 0) {
      this.setSpeed(this.preFreezeSpeed || 1);
      this.showToast('▶️ Симуляцію мапи відновлено', 'info');
    } else {
      this.preFreezeSpeed = this.state.timeSpeed;
      this.setSpeed(0);
      this.showToast('❄️ Мапу заморожено (симуляція на паузі)', 'info');
    }
  }

  // =============================================================================
  // Керування Меню Паузи (Esc) — призупиняє всю гру
  // =============================================================================

  togglePauseMenu() {
    const pauseModal = document.getElementById('pauseModal');
    if (!pauseModal) return;

    if (pauseModal.classList.contains('hidden')) {
      this.openPauseMenu();
    } else {
      this.closePauseMenu();
    }
  }

  openPauseMenu() {
    const pauseModal = document.getElementById('pauseModal');
    if (!pauseModal) return;

    // Ховаємо банер заморозки мапи, бо відкривається повноекранне меню
    document.getElementById('mapFreezeBanner')?.classList.add('hidden');
    document.getElementById('canvasWrapper')?.classList.remove('is-frozen');

    // Зберігаємо швидкість перед паузою
    if (this.state.timeSpeed > 0) {
      this.prePauseSpeed = this.state.timeSpeed;
    } else if (this.preFreezeSpeed) {
      this.prePauseSpeed = this.preFreezeSpeed;
    }
    this.setSpeed(0);

    // Оновлюємо UI налаштувань у модалці
    const volSlider = document.getElementById('volumeSlider');
    const volPercent = document.getElementById('volumePercent');
    const toggleSound = document.getElementById('toggleSoundEffects');

    if (volSlider) volSlider.value = Math.round(this.sound.volume * 100);
    if (volPercent) volPercent.textContent = `${Math.round(this.sound.volume * 100)}%`;
    if (toggleSound) toggleSound.checked = this.sound.enabled;

    // Синхронізуємо перемикач теми
    const toggleTheme = document.getElementById('toggleLightTheme');
    if (toggleTheme) toggleTheme.checked = document.documentElement.getAttribute('data-theme') === 'light';
    const themeLbl = document.getElementById('themeSwitchLabel');
    const themeSub = document.getElementById('themeSwitchSub');
    if (themeLbl) themeLbl.textContent = this.t('setting_theme_label');
    if (themeSub) themeSub.textContent = this.t('setting_theme_sub');

    pauseModal.classList.remove('hidden');
  }

  closePauseMenu() {
    const pauseModal = document.getElementById('pauseModal');
    if (!pauseModal) return;

    pauseModal.classList.add('hidden');
    // Відновлюємо швидкість до паузи
    this.setSpeed(this.prePauseSpeed || 1);
  }

  // =============================================================================
  // Перемикач теми (Темна / Світла)
  // =============================================================================

  setTheme(theme) {
    // 'light' або 'dark'
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('eurotrans_theme', theme);

    // Синхронізуємо стан чекбоксу
    const toggleTheme = document.getElementById('toggleLightTheme');
    if (toggleTheme) toggleTheme.checked = (theme === 'light');

    // Оновлюємо лейбл
    const lbl = document.getElementById('themeSwitchLabel');
    const sub = document.getElementById('themeSwitchSub');
    if (lbl) lbl.textContent = this.t('setting_theme_label');
    if (sub) sub.textContent = this.t('setting_theme_sub');

    // Відмальовуємо карту у новому стилі
    this.draw();
  }

  // =============================================================================
  // Покроковий Інтерактивний Туторіал (із заморозкою гри)
  // =============================================================================

  startTutorial() {
    this.currentTutorialStep = 0;
    const modal = document.getElementById('tutorialModal');
    if (!modal) return;

    // Під час туторіалу ставимо гру на паузу, щоб час і замовлення не спливали
    if (this.state.timeSpeed > 0) {
      this.preTutorialSpeed = this.state.timeSpeed;
    }
    this.setSpeed(0);
    document.getElementById('mapFreezeBanner')?.classList.add('hidden');
    document.getElementById('canvasWrapper')?.classList.remove('is-frozen');

    modal.classList.remove('hidden');
    this.renderTutorialStep(0);
  }

  renderTutorialStep(index) {
    const list = (typeof TUTORIAL_I18N !== 'undefined') ? TUTORIAL_I18N : TUTORIAL_STEPS;
    if (index < 0 || index >= list.length) return;
    this.currentTutorialStep = index;
    const step = list[index];
    const l = this.state.lang || 'uk';

    // Зняти попереднє підсвічування
    document.querySelectorAll('.tutorial-highlight').forEach(el => el.classList.remove('tutorial-highlight'));

    const highlights = [
      '.top-bar', '.map-section', '#tab-contracts', '#tab-shop',
      '.tab-btn[data-tab="garages"]', '.tab-btn[data-tab="drivers"]',
      '.tab-btn[data-tab="upgrades"]', '.controls-group'
    ];
    const tabs = [null, null, 'contracts', 'shop', 'garages', 'drivers', 'upgrades', 'contracts'];
    const icons = ['🌐', '🗺️', '📋', '🚛', '🏠', '👔', '⚡', '⏸️'];

    const targetSelector = step.highlight || highlights[index];
    if (targetSelector) {
      const targetEl = document.querySelector(targetSelector);
      if (targetEl) targetEl.classList.add('tutorial-highlight');
    }

    const targetTab = step.tab || tabs[index];
    if (targetTab) {
      const tabBtn = document.querySelector(`.tab-btn[data-tab="${targetTab}"]`);
      if (tabBtn) tabBtn.click();
    }

    const badgeEl = document.getElementById('tutStepBadge');
    const titleEl = document.getElementById('tutTitle');
    const iconEl = document.getElementById('tutIconBox');
    const descEl = document.getElementById('tutDesc');
    const tipEl = document.getElementById('tutTipText');
    const progressEl = document.getElementById('tutProgressFill');

    const title = typeof step.title === 'object' ? (step.title[l] || step.title.uk) : step.title;
    const desc = typeof step.desc === 'object' ? (step.desc[l] || step.desc.uk) : step.desc;
    const tip = typeof step.tip === 'object' ? (step.tip[l] || step.tip.uk) : step.tip;
    const icon = step.icon || icons[index] || '💡';

    if (badgeEl) badgeEl.textContent = `${this.t('tut_step_prefix')} ${index + 1} ${this.t('tut_from')} ${list.length}`;
    if (titleEl) titleEl.textContent = title;
    if (iconEl) iconEl.textContent = icon;
    if (descEl) descEl.textContent = desc;
    if (tipEl) tipEl.textContent = tip;

    if (progressEl) {
      const progressPercent = ((index + 1) / list.length) * 100;
      progressEl.style.width = `${progressPercent}%`;
    }

    const dotsContainer = document.getElementById('tutDotsContainer');
    if (dotsContainer) {
      dotsContainer.innerHTML = list.map((_, i) => `
        <span class="dot-step ${i === index ? 'active' : ''}" onclick="window.game.renderTutorialStep(${i})" title="${this.t('tut_step_prefix')} ${i + 1}" style="cursor: pointer;"></span>
      `).join('');
    }

    const prevBtn = document.getElementById('btnTutPrev');
    const nextBtn = document.getElementById('btnTutNext');

    if (prevBtn) {
      prevBtn.disabled = index === 0;
      prevBtn.textContent = `⬅ ${this.t('btn_tut_prev')}`;
    }
    if (nextBtn) {
      if (index === list.length - 1) {
        nextBtn.textContent = this.t('btn_tut_finish');
      } else {
        nextBtn.textContent = this.t('btn_tut_next');
      }
    }
  }

  nextTutorialStep() {
    const list = (typeof TUTORIAL_I18N !== 'undefined') ? TUTORIAL_I18N : TUTORIAL_STEPS;
    if (this.currentTutorialStep < list.length - 1) {
      this.renderTutorialStep(this.currentTutorialStep + 1);
    } else {
      this.closeTutorial();
      this.showToast('🚀 ' + this.t('btn_tut_finish'), 'success');
    }
  }

  prevTutorialStep() {
    if (this.currentTutorialStep > 0) {
      this.renderTutorialStep(this.currentTutorialStep - 1);
    }
  }

  closeTutorial() {
    const modal = document.getElementById('tutorialModal');
    if (modal) modal.classList.add('hidden');
    document.querySelectorAll('.tutorial-highlight').forEach(el => el.classList.remove('tutorial-highlight'));
    localStorage.setItem('eurotrans_tutorial_completed', 'true');

    // Відновлюємо швидкість гри після завершення або закриття туторіалу
    this.setSpeed(this.preTutorialSpeed || 1);
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
      const country = (typeof COUNTRIES_I18N !== 'undefined' && COUNTRIES_I18N[foundCity.country]?.[this.state.lang]) || foundCity.country;

      this.tooltip.innerHTML = `
        <strong>${this.getCityName(foundCity.id)} (${country})</strong><br>
        📦 ${this.t('contracts_title')}: <b>${orders}</b><br>
        🚛 ${this.t('status_idle')}: <b>${vehicles}</b>
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
    this.updateMapCityIndicator();
    this.renderContractsUI();
    this.draw();
  }

  // =============================================================================
  // 8.1 Система Локалізації (I18N)
  // =============================================================================

  t(key) {
    return typeof t === 'function' ? t(key, this.state.lang) : key;
  }

  tTemplate(key, vars = {}) {
    return typeof tTemplate === 'function' ? tTemplate(key, vars, this.state.lang) : this.t(key);
  }

  getCityName(cityId) {
    if (!cityId) return '';
    const lang = this.state.lang || 'uk';
    if (typeof CITIES_I18N !== 'undefined' && CITIES_I18N[cityId]) {
      return CITIES_I18N[cityId][lang] || CITIES_I18N[cityId].uk || (CITIES[cityId] ? CITIES[cityId].name : cityId);
    }
    return CITIES[cityId] ? CITIES[cityId].name : cityId;
  }

  getCargoType(contract) {
    if (contract && contract.cargoType) return contract.cargoType;
    if (!contract) return 'consumer';
    const match = CARGO_TYPES.find(ct => ct.icon === contract.cargoIcon || ct.name === contract.cargoName);
    return match ? match.id : 'consumer';
  }

  getCargoName(cargoType, fallback = '') {
    const lang = this.state.lang || 'uk';
    if (typeof CARGO_I18N !== 'undefined' && CARGO_I18N[cargoType]) {
      return CARGO_I18N[cargoType][lang] || CARGO_I18N[cargoType].uk || fallback || cargoType;
    }
    return fallback || cargoType;
  }

  getCargoDesc(cargoType) {
    const lang = this.state.lang || 'uk';
    if (typeof CARGO_I18N !== 'undefined' && CARGO_I18N[cargoType] && CARGO_I18N[cargoType].desc) {
      return CARGO_I18N[cargoType].desc[lang] || CARGO_I18N[cargoType].desc.uk || '';
    }
    return '';
  }

  getVehicleCategory(vOrTypeId, fallback = '') {
    let typeId = (typeof vOrTypeId === 'object' && vOrTypeId !== null) ? vOrTypeId.typeId : vOrTypeId;
    const rawCategory = (typeof vOrTypeId === 'object' && vOrTypeId !== null) ? (vOrTypeId.category || '') : (fallback || (typeof vOrTypeId === 'string' ? vOrTypeId : ''));
    const rawName = (typeof vOrTypeId === 'object' && vOrTypeId !== null) ? (vOrTypeId.name || '') : '';

    if (!typeId) {
      if (rawName.includes('Master') || rawCategory.toLowerCase().includes('електрофургон')) typeId = 'van_eco';
      else if (rawName.includes('Sprinter') || rawCategory.toLowerCase().includes('мінівен') || rawCategory.toLowerCase().includes('бус') || rawCategory.toLowerCase().includes('van')) typeId = 'van';
      else if (rawName.includes('DAF') || rawCategory.toLowerCase().includes('магістральний tir')) typeId = 'truck_daf';
      else if (rawName.includes('Volvo') || rawCategory.toLowerCase().includes('потужний тягач')) typeId = 'truck_volvo';
      else if (rawName.includes('Scania') || rawCategory.toLowerCase().includes('важкий тягач')) typeId = 'truck_scania';
      else if (rawName.includes('Gigaliner') || rawName.includes('EuroCombi') || rawCategory.toLowerCase().includes('автопоїзд')) typeId = 'truck_gigaliner';
      else if (rawName.includes('Alstom') || rawName.includes('Feeder') || rawCategory.toLowerCase().includes('регіональний електровоз')) typeId = 'train_feeder';
      else if (rawName.includes('Vectron') || rawCategory.toLowerCase().includes('магістральний потяг') || rawCategory.toLowerCase().includes('магістральний')) typeId = 'train';
      else if (rawName.includes('TGV') || rawCategory.toLowerCase().includes('швидкісний вантажний')) typeId = 'train_tgv';
      else if (rawName.includes('ATR') || rawCategory.toLowerCase().includes('регіональний літак')) typeId = 'plane_atr';
      else if (rawName.includes('Airbus') || rawName.includes('A330') || rawCategory.toLowerCase().includes('вантажний лайнер')) typeId = 'plane';
      else if (rawName.includes('Руслан') || rawName.includes('An-124') || rawCategory.toLowerCase().includes('авіагігант')) typeId = 'plane_an124';
    }

    const lang = this.state.lang || 'uk';
    if (typeId && typeof VEHICLES_I18N !== 'undefined' && VEHICLES_I18N[typeId]?.category) {
      return VEHICLES_I18N[typeId].category[lang] || VEHICLES_I18N[typeId].category.uk || rawCategory;
    }

    const catMap = {
      'бус / мінівен': 'van',
      'бус/мінівен': 'van',
      'бус': 'van',
      'мінівен': 'van',
      'bus / minivan': 'van',
      'bus/minivan': 'van',
      'dodávka / expres': 'van',
      'dodavka / expres': 'van',
      'електрофургон': 'van_eco',
      'магістральний tir': 'truck_daf',
      'потужний тягач': 'truck_volvo',
      'важкий тягач tir': 'truck_scania',
      'автопоїзд (double)': 'truck_gigaliner',
      'регіональний електровоз': 'train_feeder',
      'магістральний потяг': 'train',
      'швидкісний вантажний потяг': 'train_tgv',
      'регіональний літак': 'plane_atr',
      'вантажний лайнер': 'plane',
      'надважкий авіагігант': 'plane_an124'
    };
    const key = catMap[String(rawCategory || '').trim().toLowerCase()];
    if (key && typeof VEHICLES_I18N !== 'undefined' && VEHICLES_I18N[key]?.category) {
      return VEHICLES_I18N[key].category[lang] || VEHICLES_I18N[key].category.uk || rawCategory;
    }

    return rawCategory || fallback;
  }

  getVehicleDesc(typeId, fallback = '') {
    const lang = this.state.lang || 'uk';
    if (typeof VEHICLES_I18N !== 'undefined' && VEHICLES_I18N[typeId]?.desc) {
      return VEHICLES_I18N[typeId].desc[lang] || VEHICLES_I18N[typeId].desc.uk || fallback;
    }
    return fallback;
  }

  getDriverName(name) {
    if (!name) return '';
    const lang = this.state.lang || 'uk';
    if (lang === 'uk') return name;
    return typeof transliterateUkrainian === 'function' ? transliterateUkrainian(name) : name;
  }

  updateMapCityIndicator() {
    const indicator = document.getElementById('mapCityIndicator');
    if (!indicator) return;
    if (this.state.selectedCity) {
      const city = CITIES[this.state.selectedCity];
      const cityName = this.getCityName(this.state.selectedCity);
      const country = (city && typeof COUNTRIES_I18N !== 'undefined' && COUNTRIES_I18N[city.country]?.[this.state.lang]) || (city ? city.country : '');
      indicator.innerHTML = `${this.t('map_hub_selected')} <b>${cityName}</b> (${country}) <button id="btnResetCityFilter" style="background:none;border:none;color:#38bdf8;cursor:pointer;margin-left:6px;font-weight:700;">${this.t('btn_reset_city_filter')}</button>`;
      document.getElementById('btnResetCityFilter')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectCity(null);
      });
    } else {
      indicator.innerHTML = `🗺️ <span>${this.t('map_hint_default')}</span>`;
    }
  }

  updateTickerText() {
    const tickerLabel = document.querySelector('.ticker-label');
    if (tickerLabel) tickerLabel.textContent = `📰 ${this.t('ticker_label')}`;

    const ticker = document.getElementById('tickerContent');
    if (!ticker) return;

    const lang = this.state.lang || 'uk';
    if (this.state.event && this.state.event.id && typeof EVENTS_I18N !== 'undefined') {
      const raw = EVENTS_I18N.find(e => e.id === this.state.event.id);
      if (raw) {
        const name = (raw.name && (raw.name[lang] || raw.name.uk || raw.name.en)) || raw.name;
        const desc = (raw.desc && (raw.desc[lang] || raw.desc.uk || raw.desc.en)) || raw.desc;
        ticker.textContent = `${name} — ${desc}`;
        return;
      }
    }
    ticker.textContent = this.t('ticker_default');
  }

  setLanguage(lang, showToast = true) {
    if (!['sk', 'uk', 'en', 'de'].includes(lang)) return;
    this.state.lang = lang;
    localStorage.setItem('eurotrans_lang', lang);

    document.documentElement.lang = lang;

    // Оновлення кнопок у модалці налаштувань
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // Оновлення бейджа у верхній панелі
    const badge = document.getElementById('currentLangBadge');
    if (badge) {
      const map = { uk: 'UA', sk: 'SK', en: 'EN', de: 'DE' };
      badge.textContent = map[lang] || lang.toUpperCase();
    }

    // Оновлення статичних текстів
    this.applyStaticTranslations();

    // Оновлення помічника мапи
    this.updateMapCityIndicator();

    // Оновлення рядка новин
    this.updateTickerText();

    // Оновлення динамічного інтерфейсу
    this.renderUI();

    // Якщо модалка призначення відкрита - перерендерити її
    if (this.currentAssignContractId) {
      this.openAssignModal(this.currentAssignContractId);
    }

    // Перемалювати полотно мапи (щоб назви міст оновилися миттєво)
    this.draw();

    // Оновлення туторіалу, якщо він відкритий
    const tutModal = document.getElementById('tutorialModal');
    if (tutModal && !tutModal.classList.contains('hidden')) {
      this.renderTutorialStep(this.currentTutorialStep);
    }

    // Оновлення лейблів перемикача теми
    const themeLbl = document.getElementById('themeSwitchLabel');
    const themeSub = document.getElementById('themeSwitchSub');
    if (themeLbl) themeLbl.textContent = this.t('setting_theme_label');
    if (themeSub) themeSub.textContent = this.t('setting_theme_sub');

    if (showToast) {
      this.showToast(this.t('toast_lang_changed'), 'info');
    }
  }

  applyStaticTranslations() {
    // 1. Оновлення всіх елементів із data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) el.innerHTML = this.t(key);
    });

    // 2. Вкладки сайдбару зі збереженням бейджів
    const tabKeys = {
      contracts: 'tab_contracts',
      fleet: 'tab_fleet',
      shop: 'tab_shop',
      garages: 'tab_garages',
      drivers: 'tab_drivers',
      upgrades: 'tab_upgrades'
    };

    document.querySelectorAll('.tab-btn').forEach(btn => {
      const tabName = btn.getAttribute('data-tab');
      const badge = btn.querySelector('.badge');
      const badgeCount = badge ? badge.textContent : '';
      const text = this.t(tabKeys[tabName]);
      if (badge) {
        btn.innerHTML = `${text} <span class="badge" id="${badge.id}">${badgeCount}</span>`;
      } else {
        btn.textContent = text;
      }
    });

    // 3. Фільтри замовлень
    const filterAll = document.querySelector('.filter-chip[data-filter="all"]');
    if (filterAll) filterAll.textContent = this.t('filter_all');
    const filterExp = document.querySelector('.filter-chip[data-filter="express"]');
    if (filterExp) filterExp.textContent = this.t('filter_express');
    const filterHvy = document.querySelector('.filter-chip[data-filter="heavy"]');
    if (filterHvy) filterHvy.textContent = this.t('filter_heavy');

    // 4. Лейбли статистики у верхній панелі
    const statLabels = document.querySelectorAll('.stat-card .stat-label');
    const statKeys = ['stat_capital', 'stat_reputation', 'stat_garages_fleet', 'stat_drivers', 'stat_deliveries', 'stat_game_time'];
    statLabels.forEach((el, idx) => {
      if (statKeys[idx]) el.textContent = this.t(statKeys[idx]);
    });

    // 5. Заголовки секцій та підказки
    const sContractsH3 = document.querySelector('#tab-contracts .tab-header h3');
    if (sContractsH3) sContractsH3.textContent = this.t('contracts_title');
    const sContractsHint = document.querySelector('#tab-contracts .tab-header .hint');
    if (sContractsHint) sContractsHint.textContent = this.t('contracts_hint');

    const sFleetH3 = document.querySelector('#tab-fleet .tab-header h3');
    if (sFleetH3) sFleetH3.textContent = this.t('fleet_title');
    const sFleetHint = document.querySelector('#tab-fleet .tab-header .hint');
    if (sFleetHint) sFleetHint.textContent = this.t('fleet_hint');

    const sShopH3 = document.querySelector('#tab-shop .tab-header h3');
    if (sShopH3) sShopH3.textContent = this.t('shop_title');
    const sShopHint = document.querySelector('#tab-shop .tab-header .hint');
    if (sShopHint) sShopHint.textContent = this.t('shop_hint');

    const sGaragesH3 = document.querySelector('#tab-garages .tab-header h3');
    if (sGaragesH3) sGaragesH3.textContent = this.t('garages_title');
    const sGaragesHint = document.querySelector('#tab-garages .tab-header .hint');
    if (sGaragesHint) sGaragesHint.textContent = this.t('garages_hint');

    const sDriversH3 = document.querySelector('#tab-drivers .tab-header h3');
    if (sDriversH3) sDriversH3.textContent = this.t('drivers_title');
    const sDriversHint = document.querySelector('#tab-drivers .tab-header .hint');
    if (sDriversHint) sDriversHint.textContent = this.t('drivers_hint');

    const sUpgradesH3 = document.querySelector('#tab-upgrades .tab-header h3');
    if (sUpgradesH3) sUpgradesH3.textContent = this.t('upgrades_title');
    const sUpgradesHint = document.querySelector('#tab-upgrades .tab-header .hint');
    if (sUpgradesHint) sUpgradesHint.textContent = this.t('upgrades_hint');

    // Підвкладки водіїв
    const subtabMy = document.getElementById('subtabMyDrivers');
    if (subtabMy) {
      const cnt = document.getElementById('countMyDrivers')?.textContent || '1';
      subtabMy.innerHTML = `${this.t('subtab_my_drivers')} (<span id="countMyDrivers">${cnt}</span>)`;
    }
    const subtabRecruit = document.getElementById('subtabRecruitDrivers');
    if (subtabRecruit) {
      const cnt = document.getElementById('countMarketDrivers')?.textContent || '4';
      subtabRecruit.innerHTML = `${this.t('subtab_recruit_drivers')} (<span id="countMarketDrivers">${cnt}</span>)`;
    }

    // Заголовки розділів апгрейдів
    const headers = document.querySelectorAll('#tab-upgrades .upgrades-section-header');
    if (headers[0]) headers[0].textContent = this.t('tradeoffs_header');
    if (headers[1]) headers[1].textContent = this.t('regular_upgrades_header');
    const tradeoffHint = document.querySelector('#tab-upgrades .upgrades-section-hint');
    if (tradeoffHint) tradeoffHint.textContent = this.t('tradeoffs_hint');

    // Легенда карти
    const mapLegends = document.querySelectorAll('.map-legend .legend-item');
    if (mapLegends[0]) mapLegends[0].innerHTML = `<span class="dot road"></span> ${this.t('map_legend_road')}`;
    if (mapLegends[1]) mapLegends[1].innerHTML = `<span class="dot rail"></span> ${this.t('map_legend_rail')}`;
    if (mapLegends[2]) mapLegends[2].innerHTML = `<span class="dot air"></span> ${this.t('map_legend_air')}`;

    // Баннер заморозки мапи
    const freezeSpan = document.querySelector('#mapFreezeBanner span:not(.freeze-icon)');
    if (freezeSpan) freezeSpan.textContent = this.t('map_frozen_banner');
    const btnUnfreeze = document.getElementById('btnUnfreezeMap');
    if (btnUnfreeze) btnUnfreeze.textContent = this.t('btn_unfreeze_map');

    // Нижня стрічка рейсів
    const routesTitle = document.querySelector('.routes-bar-title');
    if (routesTitle) {
      const cnt = document.getElementById('activeRoutesCount')?.textContent || '0';
      routesTitle.innerHTML = `${this.t('active_routes_label')} (<span id="activeRoutesCount">${cnt}</span>):`;
    }

    // Бігучий рядок новин
    const tickerLabel = document.querySelector('.ticker-label');
    if (tickerLabel) tickerLabel.textContent = `📰 ${this.t('ticker_label')}`;

    // Довідка (Help Modal)
    const helpH3 = document.querySelector('#helpModal .modal-header h3');
    if (helpH3) helpH3.textContent = `📖 ${this.t('help_modal_title')}`;
    const helpSecAboutH4 = document.querySelector('#helpModal .help-section h4');
    if (helpSecAboutH4) helpSecAboutH4.textContent = `🎯 ${this.t('help_section_about')}`;
    const helpSecAboutP = document.querySelector('#helpModal .help-section p');
    if (helpSecAboutP) helpSecAboutP.textContent = this.t('help_text_about');

    const helpCols = document.querySelectorAll('#helpModal .help-col');
    if (helpCols[0]) {
      helpCols[0].querySelector('h5').textContent = `🚐 ${this.t('help_sec_vans')}`;
      helpCols[0].querySelector('p').textContent = this.t('help_sec_vans_desc');
    }
    if (helpCols[1]) {
      helpCols[1].querySelector('h5').textContent = `🚚 ${this.t('help_sec_trucks')}`;
      helpCols[1].querySelector('p').textContent = this.t('help_sec_trucks_desc');
    }
    if (helpCols[2]) {
      helpCols[2].querySelector('h5').textContent = `🚂 ${this.t('help_sec_trains')}`;
      helpCols[2].querySelector('p').textContent = this.t('help_sec_trains_desc');
    }
    if (helpCols[3]) {
      helpCols[3].querySelector('h5').textContent = `✈️ ${this.t('help_sec_planes')}`;
      helpCols[3].querySelector('p').textContent = this.t('help_sec_planes_desc');
    }

    const helpTipsH4 = document.querySelectorAll('#helpModal .help-section')[1]?.querySelector('h4');
    if (helpTipsH4) helpTipsH4.textContent = `💡 ${this.t('help_tips_title')}`;
    const helpTipsLi = document.querySelectorAll('#helpModal .help-section ul li');
    if (helpTipsLi[0]) helpTipsLi[0].textContent = this.t('help_tip_1');
    if (helpTipsLi[1]) helpTipsLi[1].textContent = this.t('help_tip_2');
    if (helpTipsLi[2]) helpTipsLi[2].textContent = this.t('help_tip_3');
    if (helpTipsLi[3]) helpTipsLi[3].textContent = this.t('help_tip_4');

    const btnGotIt = document.getElementById('btnGotIt');
    if (btnGotIt) btnGotIt.textContent = this.t('btn_got_it');
    const btnRestartTutHelp = document.getElementById('btnRestartTutorialFromHelp');
    if (btnRestartTutHelp) btnRestartTutHelp.textContent = `🎓 ${this.t('btn_restart_tut_help')}`;

    // Меню паузи (Pause Modal)
    const pauseH3 = document.querySelector('#pauseModal .pause-header-title h3');
    if (pauseH3) pauseH3.textContent = this.t('pause_modal_title');
    const pauseHint = document.querySelector('#pauseModal .pause-header-title .hint');
    if (pauseHint) pauseHint.textContent = this.t('pause_modal_hint');
    const btnResume = document.getElementById('btnResumeGame');
    if (btnResume) btnResume.innerHTML = `▶️ ${this.t('btn_resume_game')}`;

    const volLabel = document.querySelector('label[for="volumeSlider"]');
    if (volLabel) volLabel.textContent = this.t('setting_volume');
    const sndLabel = document.querySelector('.setting-item-toggle .setting-label');
    if (sndLabel) sndLabel.textContent = this.t('setting_sound_effects');
    const sndSub = document.querySelector('.setting-item-toggle .setting-subtext');
    if (sndSub) sndSub.textContent = this.t('setting_sound_sub');
    const btnTest = document.getElementById('btnTestSound');
    if (btnTest) btnTest.innerHTML = `🔔 ${this.t('btn_test_sound')}`;

    const btnRestartTutPause = document.getElementById('btnRestartTutorialFromPause');
    if (btnRestartTutPause) btnRestartTutPause.innerHTML = `🎓 ${this.t('btn_restart_tut_help')}`;
    const btnOpenHelpPause = document.getElementById('btnOpenHelpFromPause');
    if (btnOpenHelpPause) btnOpenHelpPause.innerHTML = `📖 ${this.t('btn_open_help')}`;

    const dangerTitle = document.querySelector('.danger-section .section-title');
    if (dangerTitle) dangerTitle.innerHTML = `🔄 ${this.t('pause_danger_section')}`;
    const dangerDesc = document.querySelector('.danger-section .section-desc');
    if (dangerDesc) dangerDesc.textContent = this.t('pause_danger_desc');
    const btnRestartPause = document.getElementById('btnRestartGameFromPause');
    if (btnRestartPause) btnRestartPause.innerHTML = `⚠️ ${this.t('btn_restart_game_pause')}`;

    const escHint = document.querySelector('.esc-hint');
    if (escHint) escHint.innerHTML = this.t('esc_hint');

    // Модалка призначення
    const assignH3 = document.querySelector('#assignModal .modal-header h3');
    if (assignH3) assignH3.textContent = this.t('assign_modal_title');
    const assignH4 = document.querySelector('#assignModal .modal-body h4');
    if (assignH4) assignH4.textContent = this.t('assign_choose_vehicle');

    // Кнопки туторіалу
    const btnSkip = document.getElementById('btnSkipTutorial');
    if (btnSkip) btnSkip.textContent = this.t('btn_skip_tutorial');
  }

  // =============================================================================
  // 9. Відмальовка UI: Картки Замовлень, Автопарк, Магазин, Апгрейди
  // =============================================================================

  renderUI() {
    this.updateStatsUI();
    this.renderContractsUI();
    this.renderFleetUI();
    this.renderShopUI();
    this.renderGaragesUI();
    this.renderDriversUI();
    this.renderUpgradesUI();
  }

  updateStatsUI() {
    const moneyEl = document.getElementById('statMoney');
    const repEl = document.getElementById('statReputation');
    const fleetEl = document.getElementById('statFleetCount');
    const driversEl = document.getElementById('statDriversCount');
    const delivEl = document.getElementById('statDeliveries');
    const timeEl = document.getElementById('statTime');

    const totalSlots = this.getTotalGarageSlots();

    if (moneyEl) moneyEl.textContent = `€${Math.round(this.state.money).toLocaleString()}`;
    if (repEl) repEl.textContent = `⭐ ${this.state.reputation}%`;
    if (fleetEl) {
      fleetEl.textContent = `${this.state.fleet.length} / ${totalSlots} ${this.t('vehicles_unit')}`;
    }
    if (driversEl) {
      driversEl.textContent = `${this.state.drivers.length} ${this.t('drivers_unit')}`;
    }
    if (delivEl) delivEl.textContent = this.state.deliveriesCount;
    if (timeEl) {
      const hh = String(this.state.hour).padStart(2, '0');
      const mm = String(Math.floor(this.state.minute)).padStart(2, '0');
      timeEl.textContent = `${this.t('day_prefix')} ${this.state.day}, ${hh}:${mm}`;
    }

    // Бейджі в табах
    const bContracts = document.getElementById('badgeContracts');
    const bFleet = document.getElementById('badgeFleet');
    const bGarages = document.getElementById('badgeGarages');
    const bDrivers = document.getElementById('badgeDrivers');

    if (bContracts) bContracts.textContent = this.state.contracts.length;
    if (bFleet) bFleet.textContent = this.state.fleet.length;
    if (bGarages) bGarages.textContent = Object.keys(this.state.garages).length;
    if (bDrivers) bDrivers.textContent = this.state.drivers.length;

    this.updateCompanyTier();
    this.renderActiveRoutesBar();
  }

  updateCompanyTier() {
    const tierEl = document.getElementById('companyTier');
    if (!tierEl) return;
    const d = this.state.deliveriesCount;
    const m = this.state.money;

    let tierKey = 'company_tier_starter';
    if (d >= 35 || m >= 150000) {
      tierKey = 'company_tier_leader';
    } else if (d >= 20 || m >= 75000) {
      tierKey = 'company_tier_international';
    } else if (d >= 10 || m >= 35000) {
      tierKey = 'company_tier_national';
    } else if (d >= 4 || m >= 20000) {
      tierKey = 'company_tier_regional';
    }

    tierEl.textContent = this.t(tierKey);
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
          ${this.t('empty_contracts_hint')}
        </div>
      `;
      return;
    }

    list.innerHTML = filtered.map(c => {
      const originCityName = this.getCityName(c.origin);
      const destCityName = this.getCityName(c.destination);
      const urgentClass = c.isUrgent ? 'urgent' : '';

      const cType = this.getCargoType(c);
      const cargoName = this.getCargoName(cType, c.cargoName);
      const cargoDesc = this.getCargoDesc(cType);

      return `
        <div class="contract-card ${urgentClass}">
          <div class="contract-top">
            <div class="contract-route">
              <span>${originCityName}</span>
              <span class="route-arrow">➔</span>
              <span>${destCityName}</span>
            </div>
            <div class="contract-reward">+€${c.reward.toLocaleString()}</div>
          </div>
          <div class="contract-cargo-info">
            <span class="cargo-name">${c.cargoIcon} ${cargoName} (${c.weight} ${this.t('tons_short')})</span>
            <span class="contract-dist">📍 ${c.distance} ${this.t('contract_dist_label')}</span>
          </div>
          ${cargoDesc ? `<div style="font-size:0.72rem; color:#94a3b8; margin: 3px 0 6px;">${cargoDesc}</div>` : ''}
          <div class="contract-footer">
            <span class="contract-deadline ${c.timeLeft < 15 ? 'warning' : ''}">
              ⏱️ ${this.t('contract_deadline_label')} ${Math.max(0, Math.round(c.timeLeft))}s
            </span>
            <button class="btn-accept" onclick="window.game.openAssignModal('${c.id}')">${this.t('contract_btn_accept')}</button>
          </div>
        </div>
      `;
    }).join('');
  }

  renderFleetUI() {
    const list = document.getElementById('fleetList');
    if (!list) return;

    list.innerHTML = this.state.fleet.map(v => {
      let statusBadge = `<span class="vehicle-status status-idle">${this.t('status_idle')}</span>`;
      let routeText = `${this.t('location_label')} <b>${this.getCityName(v.location)}</b>`;
      let progressPercent = 0;

      if (v.status === 'moving_to_pickup') {
        statusBadge = `<span class="vehicle-status status-transit">${this.t('status_moving_to_pickup')}</span>`;
        routeText = `${this.t('course_to_label')} <b>${this.getCityName(v.currentContract.origin)}</b>`;
        progressPercent = Math.round((v.currentLeg / Math.max(1, v.path.length - 1)) * 100);
      } else if (v.status === 'loading') {
        statusBadge = `<span class="vehicle-status status-loading">${this.t('status_loading')}</span>`;
        routeText = `${this.t('in_hub_label')} <b>${this.getCityName(v.location)}</b>`;
        progressPercent = 100;
      } else if (v.status === 'in_transit') {
        statusBadge = `<span class="vehicle-status status-transit">${this.t('status_in_transit')}</span>`;
        routeText = `${this.t('route_label')} <b>${this.getCityName(v.currentContract.origin)}</b> ➔ <b>${this.getCityName(v.currentContract.destination)}</b>`;
        progressPercent = Math.round(((v.currentLeg + v.legProgress) / Math.max(1, v.path.length - 1)) * 100);
      } else if (v.status === 'unloading') {
        statusBadge = `<span class="vehicle-status status-loading">${this.t('status_unloading')}</span>`;
        routeText = `${this.t('in_dest_label')} <b>${this.getCityName(v.location)}</b>`;
        progressPercent = 100;
      }

      const assignedDriver = this.state.drivers.find(d => d.id === v.assignedDriverId);
      const driverHtml = assignedDriver
        ? `<div style="font-size:0.75rem; color:#38bdf8; display:flex; align-items:center; gap:5px; margin-top:4px;">
             <span>${assignedDriver.avatar}</span>
             <span>${this.t('driver_assigned')} <b>${this.getDriverName(assignedDriver.name)}</b> (${this.t('garage_level_label')} ${assignedDriver.level})</span>
           </div>`
        : `<div style="font-size:0.75rem; color:#f87171; display:flex; align-items:center; gap:5px; margin-top:4px;">
             <span>⚠️</span>
             <span>${this.t('driver_not_assigned')}</span>
           </div>`;

      const vehicleCategory = this.getVehicleCategory(v, v.category);

      return `
        <div class="fleet-card">
          <div class="fleet-card-header">
            <div class="vehicle-identity">
              <span class="vehicle-icon">${v.icon}</span>
              <div>
                <div class="vehicle-name">${v.name}</div>
                <div class="vehicle-type-tag">${vehicleCategory} • ${this.t('capacity_to')} ${v.capacity} ${this.t('tons_short')}</div>
              </div>
            </div>
            ${statusBadge}
          </div>
          <div class="vehicle-details">
            <div>${routeText}</div>
            <div style="text-align: right;">${this.t('speed_label')} ${v.speed} km/h</div>
          </div>
          ${driverHtml}
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

    const totalSlots = this.getTotalGarageSlots();
    const currentFleetCount = this.state.fleet.length;
    const hasSpace = currentFleetCount < totalSlots;

    list.innerHTML = VEHICLE_CATALOG.map(model => {
      const canAfford = this.state.money >= model.price;
      const canBuy = canAfford && hasSpace;

      let btnText = this.t('btn_buy_vehicle');
      if (!hasSpace) {
        btnText = `${this.t('btn_no_garage_slots')} (${currentFleetCount}/${totalSlots})`;
      } else if (!canAfford) {
        btnText = this.t('btn_not_enough_funds');
      }

      const netType = model.network === 'air' ? this.t('net_air') : (model.network === 'rail' ? this.t('net_rail') : this.t('net_road'));
      const cat = this.getVehicleCategory(model.typeId, model.category);
      const desc = this.getVehicleDesc(model.typeId, model.desc);

      return `
        <div class="shop-card">
          <div class="shop-card-top">
            <div class="vehicle-identity">
              <span class="vehicle-icon">${model.icon}</span>
              <div>
                <div class="vehicle-name">${model.name}</div>
                <div class="vehicle-type-tag">${cat}</div>
              </div>
            </div>
            <div class="shop-card-price">€${model.price.toLocaleString()}</div>
          </div>
          <div class="specs-grid">
            <div>${this.t('spec_capacity')} <b>${model.capacity} ${this.t('tons_short')}</b></div>
            <div>${this.t('spec_speed')} <b>${model.speed} km/h</b></div>
            <div>${this.t('spec_fuel')} <b>€${model.fuelPerKm}/km</b></div>
            <div>${this.t('spec_network')} <b>${netType}</b></div>
          </div>
          <div style="font-size: 0.72rem; color: #94a3b8;">${desc}</div>
          <button class="btn-buy" ${!canBuy ? 'disabled' : ''} onclick="window.game.buyVehicle('${model.typeId}')">
            ${btnText}
          </button>
        </div>
      `;
    }).join('');
  }

  renderGaragesUI() {
    const summaryEl = document.getElementById('garagesSummary');
    const listEl = document.getElementById('garagesList');
    if (!summaryEl || !listEl) return;

    const totalSlots = this.getTotalGarageSlots();
    const usedSlots = this.state.fleet.length;
    const ownedCount = Object.keys(this.state.garages).length;
    const percentUsed = Math.min(100, Math.round((usedSlots / Math.max(1, totalSlots)) * 100));

    // Summary Card
    summaryEl.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 6px; width: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 700; font-size: 0.95rem; color: #fff;">${this.t('garages_summary_title')}</span>
          <span class="garage-level-badge">${this.t('garages_slots_label')} ${usedSlots} / ${totalSlots}</span>
        </div>
        <div class="garage-slots-bar">
          <div class="garage-slots-fill" style="width: ${percentUsed}%;"></div>
        </div>
        <div class="garage-slots-info">
          <span>${this.t('garages_owned_count')} <b>${ownedCount}</b></span>
          <span>${this.t('garages_capacity_used')} <b>${percentUsed}%</b></span>
        </div>
      </div>
    `;

    // Garages List
    let html = '';

    // 1. Власні гаражі
    html += `<h4 style="font-size: 0.8rem; color: #94a3b8; margin: 4px 0 8px;">${this.t('garages_owned_section')}</h4>`;
    const ownedGarages = Object.values(this.state.garages);

    ownedGarages.forEach(g => {
      const city = CITIES[g.cityId];
      const tier = GARAGE_TIERS[g.level];
      const nextTier = g.level < 3 ? GARAGE_TIERS[g.level + 1] : null;
      const upgradeCost = tier.upgradeCost;
      const canAffordUpgrade = nextTier && this.state.money >= upgradeCost;
      const stationedVehicles = this.state.fleet.filter(v => v.location === g.cityId).length;

      const tierName = (typeof GARAGE_TIERS_I18N !== 'undefined' && GARAGE_TIERS_I18N[g.level]?.name[this.state.lang]) || tier.name;
      const perkDesc = (typeof GARAGE_TIERS_I18N !== 'undefined' && GARAGE_TIERS_I18N[g.level]?.perkDesc[this.state.lang]) || tier.perkDesc;
      const country = (city && typeof COUNTRIES_I18N !== 'undefined' && COUNTRIES_I18N[city.country]?.[this.state.lang]) || (city ? city.country : '');

      html += `
        <div class="garage-card">
          <div class="garage-header">
            <div class="garage-city-title">
              <span>🏠</span>
              <span>${this.getCityName(g.cityId)}</span>
              <span style="font-size: 0.75rem; color: #94a3b8; font-weight: normal;">(${country})</span>
            </div>
            <span class="garage-level-badge">${this.t('garage_level_label')} ${g.level} • ${tierName}</span>
          </div>

          <div class="garage-slots-info">
            <span>${this.t('garage_slots_info')} <b>${g.slots}</b></span>
            <span>${this.t('garage_parked_here')} <b>${stationedVehicles}</b> ${this.t('vehicles_unit')}</span>
          </div>

          <div class="garage-perks">
            <div>✨ <b>${this.t('garage_perk_label')}</b> ${perkDesc}</div>
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: 4px;">
            ${g.level < 3 ? `
              <button class="btn-buy" style="padding: 6px 12px; font-size: 0.75rem;" ${!canAffordUpgrade ? 'disabled' : ''} onclick="window.game.upgradeGarage('${g.cityId}')">
                ${this.t('garage_btn_upgrade')} ${g.level + 1} (€${upgradeCost.toLocaleString()})
              </button>
            ` : `
              <span class="garage-level-badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; border-color: rgba(16, 185, 129, 0.3);">
                ${this.t('garage_max_badge')}
              </span>
            `}
          </div>
        </div>
      `;
    });

    // 2. Доступні міста для відкриття нових гаражів
    const availableCityIds = Object.keys(CITIES).filter(id => !this.state.garages[id]);
    const tier1 = GARAGE_TIERS[1];
    const canAffordNew = this.state.money >= tier1.cost;

    html += `<h4 style="font-size: 0.8rem; color: #94a3b8; margin: 14px 0 8px;">${this.t('garages_available_section')}</h4>`;
    html += '<div style="display: flex; flex-direction: column; gap: 8px;">';

    availableCityIds.forEach(id => {
      const city = CITIES[id];
      const country = (city && typeof COUNTRIES_I18N !== 'undefined' && COUNTRIES_I18N[city.country]?.[this.state.lang]) || (city ? city.country : '');

      html += `
        <div class="garage-card" style="opacity: 0.9;">
          <div class="garage-header">
            <div class="garage-city-title">
              <span>📍</span>
              <span>${this.getCityName(city.id)}</span>
              <span style="font-size: 0.75rem; color: #94a3b8; font-weight: normal;">(${country})</span>
            </div>
            <button class="btn-buy" style="padding: 5px 10px; font-size: 0.72rem;" ${!canAffordNew ? 'disabled' : ''} onclick="window.game.buyGarage('${city.id}')">
              ${this.t('garage_btn_buy')} (€${tier1.cost.toLocaleString()})
            </button>
          </div>
        </div>
      `;
    });
    html += '</div>';

    listEl.innerHTML = html;
  }

  renderDriversUI() {
    const listEl = document.getElementById('driversList');
    const countMy = document.getElementById('countMyDrivers');
    const countMarket = document.getElementById('countMarketDrivers');
    if (!listEl) return;

    if (countMy) countMy.textContent = this.state.drivers.length;
    if (countMarket) countMarket.textContent = this.state.driverMarket.length;

    if (this.state.driverSubtab === 'market') {
      // Ринок кандидатів
      if (this.state.driverMarket.length === 0) {
        listEl.innerHTML = `<div style="text-align: center; color: #64748b; padding: 24px;">${this.t('driver_empty_market')}</div>`;
        return;
      }

      listEl.innerHTML = this.state.driverMarket.map(candidate => {
        const canAfford = this.state.money >= candidate.hireCost;
        const qualLabel = (typeof QUALIFICATION_I18N !== 'undefined' && QUALIFICATION_I18N[candidate.qualification]?.[this.state.lang]) || candidate.qualification;

        return `
          <div class="driver-card">
            <div class="driver-card-top">
              <div class="driver-profile">
                <div class="driver-avatar">${candidate.avatar}</div>
                <div>
                  <div class="driver-name">${this.getDriverName(candidate.name)}</div>
                  <div class="driver-qualification">${qualLabel}</div>
                </div>
              </div>
              <span class="garage-level-badge">${this.t('garage_level_label')} ${candidate.level}</span>
            </div>

            <div class="driver-perks-grid">
              <div class="driver-perk-item">${this.t('driver_stat_speed')} <b>+${Math.round(candidate.speedBonus * 100)}%</b></div>
              <div class="driver-perk-item">${this.t('driver_stat_fuel')} <b>+${Math.round(candidate.fuelBonus * 100)}%</b></div>
              <div class="driver-perk-item">${this.t('driver_stat_salary')} <b>€${candidate.salaryPerTrip}</b></div>
              <div class="driver-perk-item">${this.t('driver_stat_cost')} <b>€${candidate.hireCost.toLocaleString()}</b></div>
            </div>

            <div style="display: flex; justify-content: flex-end;">
              <button class="btn-buy" style="padding: 6px 14px; font-size: 0.75rem;" ${!canAfford ? 'disabled' : ''} onclick="window.game.hireDriver('${candidate.id}')">
                ${this.t('driver_btn_hire')} (€${candidate.hireCost.toLocaleString()})
              </button>
            </div>
          </div>
        `;
      }).join('');
    } else {
      // Наші водії
      if (this.state.drivers.length === 0) {
        listEl.innerHTML = `<div style="text-align: center; color: #64748b; padding: 24px;">${this.t('driver_empty_my')}</div>`;
        return;
      }

      listEl.innerHTML = this.state.drivers.map(driver => {
        const xpPercent = Math.min(100, Math.round((driver.xp / Math.max(1, driver.xpNeeded)) * 100));
        const qualLabel = (typeof QUALIFICATION_I18N !== 'undefined' && QUALIFICATION_I18N[driver.qualification]?.[this.state.lang]) || driver.qualification;

        // Доступні машини для вибору
        const eligibleVehicles = this.state.fleet.filter(v => {
          if (driver.qualification === 'all') return true;
          if (driver.qualification === 'plane' && v.network === 'air') return true;
          if (driver.qualification === 'train' && v.network === 'rail') return true;
          if (driver.qualification === 'truck' && v.network === 'road') return true;
          if (driver.qualification === 'van' && (v.category.toLowerCase().includes('фургон') || v.category.toLowerCase().includes('бус') || v.category.toLowerCase().includes('van') || v.category.toLowerCase().includes('dodávka'))) return true;
          return false;
        });

        const vehicleOptions = eligibleVehicles.map(v => `
          <option value="${v.id}" ${v.id === driver.assignedVehicleId ? 'selected' : ''}>
            ${v.icon} ${v.name} (${v.status === 'idle' ? this.t('status_idle') : this.t('in_transit_short')})
          </option>
        `).join('');

        return `
          <div class="driver-card">
            <div class="driver-card-top">
              <div class="driver-profile">
                <div class="driver-avatar">${driver.avatar}</div>
                <div>
                  <div class="driver-name">${this.getDriverName(driver.name)}</div>
                  <div class="driver-qualification">${qualLabel}</div>
                </div>
              </div>
              <span class="garage-level-badge">${this.t('garage_level_label')} ${driver.level}</span>
            </div>

            <div class="driver-perks-grid">
              <div class="driver-perk-item">${this.t('driver_stat_speed')} <b>+${Math.round(driver.speedBonus * 100)}%</b></div>
              <div class="driver-perk-item">${this.t('driver_stat_fuel')} <b>+${Math.round(driver.fuelBonus * 100)}%</b></div>
              <div class="driver-perk-item">${this.t('driver_stat_salary')} <b>€${driver.salaryPerTrip}</b></div>
              <div class="driver-perk-item">${this.t('driver_stat_xp')} <b>${driver.xp}/${driver.xpNeeded} XP</b></div>
            </div>

            <div class="driver-xp-row">
              <span>${this.t('driver_xp_progress')}</span>
              <div class="driver-xp-bar">
                <div class="driver-xp-fill" style="width: ${xpPercent}%;"></div>
              </div>
              <span>${xpPercent}%</span>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 4px;">
              <div style="flex: 1;">
                <label style="font-size: 0.68rem; color: #94a3b8; display: block; margin-bottom: 2px;">${this.t('driver_assigned_veh_label')}</label>
                <select style="width: 100%; background: #0f172a; border: 1px solid #334155; color: #fff; padding: 4px; border-radius: 4px; font-size: 0.72rem;" onchange="window.game.assignDriverToVehicle('${driver.id}', this.value)">
                  <option value="" ${!driver.assignedVehicleId ? 'selected' : ''}>${this.t('driver_unassigned_opt')}</option>
                  ${vehicleOptions}
                </select>
              </div>
              <button class="btn-toggle-tradeoff" style="color: #ef4444; border-color: rgba(239, 68, 68, 0.3); padding: 5px 8px; margin-top: 14px;" onclick="window.game.fireDriver('${driver.id}')">
                ${this.t('driver_btn_fire')}
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  renderUpgradesUI() {
    // 1. Компромісні апгрейди (Trade-offs)
    const tradeoffsEl = document.getElementById('tradeoffsList');
    if (tradeoffsEl) {
      tradeoffsEl.innerHTML = TRADEOFFS_CONFIG.map(t => {
        const isUnlocked = !!this.state.unlockedTradeoffs[t.id];
        const isActive = !!this.state.activeTradeoffs[t.id];
        const canAfford = this.state.money >= t.price;

        let btnHtml = '';
        if (!isUnlocked) {
          btnHtml = `
            <button class="btn-toggle-tradeoff" ${!canAfford ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} onclick="window.game.toggleTradeoff('${t.id}')">
              ${this.t('btn_unlock_tradeoff')} €${t.price.toLocaleString()}
            </button>
          `;
        } else {
          btnHtml = `
            <button class="btn-toggle-tradeoff ${isActive ? 'enabled' : ''}" onclick="window.game.toggleTradeoff('${t.id}')">
              ${isActive ? this.t('btn_active_tradeoff') : this.t('btn_inactive_tradeoff')}
            </button>
          `;
        }

        const tData = (typeof TRADEOFFS_I18N !== 'undefined' && TRADEOFFS_I18N[t.id]) ? TRADEOFFS_I18N[t.id] : null;
        const title = tData ? (tData.title[this.state.lang] || t.title) : t.title;
        const pro = tData ? (tData.pro[this.state.lang] || t.pro) : t.pro;
        const con = tData ? (tData.con[this.state.lang] || t.con) : t.con;
        const desc = tData ? (tData.desc[this.state.lang] || t.desc) : t.desc;

        return `
          <div class="tradeoff-card ${isActive ? 'active' : ''}">
            <div class="tradeoff-card-header">
              <div class="tradeoff-title">
                <span>${t.icon}</span>
                <span>${title}</span>
              </div>
              ${btnHtml}
            </div>
            <div class="tradeoff-effects-grid">
              <div class="effect-badge pro">▲ ${pro}</div>
              <div class="effect-badge con">▼ ${con}</div>
            </div>
            <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 2px;">
              ${desc}
            </div>
          </div>
        `;
      }).join('');
    }

    // 2. Класичні корпоративні технології
    const upgradesEl = document.getElementById('upgradesList');
    if (upgradesEl) {
      upgradesEl.innerHTML = UPGRADES_CONFIG.map(upg => {
        const currentLevel = this.state.upgrades[upg.id] || 0;
        const isMax = currentLevel >= upg.maxLevel;
        const nextCost = upg.cost * (currentLevel + 1);
        const canAfford = this.state.money >= nextCost && !isMax;

        const uData = (typeof UPGRADES_I18N !== 'undefined' && UPGRADES_I18N[upg.id]) ? UPGRADES_I18N[upg.id] : null;
        const title = uData ? (uData.title[this.state.lang] || upg.title) : upg.title;
        const desc = uData ? (uData.desc[this.state.lang] || upg.desc) : upg.desc;

        return `
          <div class="upgrade-card">
            <div class="upgrade-info">
              <div class="upgrade-title">${upg.icon} ${title}</div>
              <div class="upgrade-desc">${desc}</div>
              <div class="upgrade-level">${this.t('upgrade_level_prefix')} ${currentLevel} / ${upg.maxLevel}</div>
            </div>
            <div>
              ${isMax ? `<span style="color:#10b981;font-weight:700;font-size:0.75rem;">${this.t('upgrade_max_label')}</span>` : `
                <button class="btn-accept" ${!canAfford ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} onclick="window.game.buyUpgrade('${upg.id}')">
                  €${nextCost.toLocaleString()}
                </button>
              `}
            </div>
          </div>
        `;
      }).join('');
    }
  }

  renderActiveRoutesBar() {
    const container = document.getElementById('routesScrollContainer');
    const countEl = document.getElementById('activeRoutesCount');
    if (!container) return;

    const activeVehicles = this.state.fleet.filter(v => v.status !== 'idle');
    if (countEl) countEl.textContent = activeVehicles.length;

    if (activeVehicles.length === 0) {
      container.innerHTML = `<div class="empty-routes-hint">${this.t('empty_routes_hint')}</div>`;
      return;
    }

    container.innerHTML = activeVehicles.map(v => {
      let label = '';
      if (v.status === 'moving_to_pickup') {
        label = `${this.t('status_moving_to_pickup')} ➔ ${this.getCityName(v.currentContract.origin)}`;
      } else if (v.status === 'loading') {
        label = `${this.t('status_loading')} ${this.getCityName(v.location)}`;
      } else if (v.status === 'in_transit') {
        label = `${this.getCityName(v.currentContract.origin)} ➔ ${this.getCityName(v.currentContract.destination)}`;
      } else if (v.status === 'unloading') {
        label = `${this.t('status_unloading')} ${this.getCityName(v.location)}`;
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
  // 10. Механіка Призначення Контракту, Покупки, Гаражів та Водіїв
  // =============================================================================

  openAssignModal(contractId) {
    this.currentAssignContractId = contractId;
    const contract = this.state.contracts.find(c => c.id === contractId);
    if (!contract) return;

    const modal = document.getElementById('assignModal');
    const brief = document.getElementById('modalContractBrief');
    const list = document.getElementById('modalVehiclesList');
    if (!modal || !brief || !list) return;

    const cType = this.getCargoType(contract);
    const cargoName = this.getCargoName(cType, contract.cargoName);
    const cargoDesc = this.getCargoDesc(cType);
    const originCityName = this.getCityName(contract.origin);
    const destCityName = this.getCityName(contract.destination);

    brief.innerHTML = `
      <div><strong>${this.t('assign_route_label')}</strong> ${originCityName} ➔ ${destCityName} (${contract.distance} ${this.t('contract_dist_label')})</div>
      <div><strong>${this.t('assign_cargo_label')}</strong> ${contract.cargoIcon} ${cargoName} | ${this.t('assign_weight_label')} <b>${contract.weight} ${this.t('tons_short')}</b></div>
      ${cargoDesc ? `<div style="font-size:0.75rem; color:#94a3b8; margin-top:2px;">${cargoDesc}</div>` : ''}
      <div><strong>${this.t('assign_reward_label')}</strong> <span style="color:#10b981;font-weight:700;">+€${contract.reward.toLocaleString()}</span> | ${this.t('assign_deadline_label')} <b>${Math.round(contract.timeLeft)}s</b></div>
    `;

    // Шукаємо підходящий транспорт
    list.innerHTML = this.state.fleet.map(v => {
      const isIdle = v.status === 'idle';
      const hasCapacity = v.capacity >= contract.weight;

      // Перевірка доступності залізничного шляху
      let routePossible = true;
      let pathGround = null;
      if (v.network === 'rail') {
        pathGround = this.findPath(contract.origin, contract.destination, 'rail');
        if (!pathGround) routePossible = false;
      }

      const canAssign = isIdle && hasCapacity && routePossible;
      let reason = '';
      if (!isIdle) reason = ` (${this.t('in_transit_short')})`;
      else if (!hasCapacity) reason = ` (${v.capacity}t < ${contract.weight}t)`;
      else if (!routePossible) reason = ' (No rail route)';

      const driver = this.state.drivers.find(d => d.id === v.assignedDriverId);
      const driverBadge = driver
        ? `<span style="color: #38bdf8;">${this.t('driver_assigned')} ${driver.avatar} ${this.getDriverName(driver.name)} (+${Math.round(driver.speedBonus * 100)}%)</span>`
        : `<span style="color: #f87171;">⚠️ ${this.t('driver_not_assigned')}</span>`;

      return `
        <div class="modal-vehicle-item ${!canAssign ? 'disabled' : ''}" ${canAssign ? `onclick="window.game.assignContract('${contract.id}', '${v.id}')"` : ''}>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.4rem;">${v.icon}</span>
            <div>
              <div style="font-weight: 700; font-size: 0.85rem;">${v.name} ${reason ? `<span style="color:#ef4444;font-size:0.75rem;">${reason}</span>` : ''}</div>
              <div style="font-size: 0.72rem; color: #94a3b8;">${this.t('location_label')} ${this.getCityName(v.location)} • ${this.t('spec_capacity')} ${v.capacity} ${this.t('tons_short')} • ${driverBadge}</div>
            </div>
          </div>
          <div>
            ${canAssign ? `<button class="btn-accept">${this.t('assign_btn_select')}</button>` : ''}
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

    this.currentAssignContractId = null;

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
      this.showToast(`📦 ${vehicle.name} ➔ ${this.getCityName(vehicle.location)}`, 'info');
    } else {
      // Інакше потрібно доїхати до точки забору вантажу
      vehicle.status = 'moving_to_pickup';
      vehicle.path = this.findPath(vehicle.location, contract.origin, vehicle.network);
      vehicle.currentLeg = 0;
      vehicle.legProgress = 0;
      this.showToast(`🚚 ${vehicle.name} ➔ ${this.getCityName(contract.origin)}`, 'info');
    }

    this.sound.playOrderAccepted();
    this.renderContractsUI();
    this.renderFleetUI();
  }

  buyVehicle(typeId) {
    if (this.state.fleet.length >= this.getTotalGarageSlots()) {
      this.showToast(`${this.t('btn_no_garage_slots')} (${this.state.fleet.length}/${this.getTotalGarageSlots()})!`, 'error');
      return;
    }

    const model = VEHICLE_CATALOG.find(m => m.typeId === typeId);
    if (!model || this.state.money < model.price) {
      this.showToast(this.t('btn_not_enough_funds'), 'error');
      return;
    }

    this.state.money -= model.price;
    const countSameType = this.state.fleet.filter(v => v.category === model.category).length + 1;
    const defaultCity = this.state.selectedCity || 'kyiv';
    const newVehicleId = 'v_' + Math.random().toString(36).substr(2, 9);

    // Автоматично закріплюємо вільного водія, якщо такий є
    const freeDriver = this.state.drivers.find(d => !d.assignedVehicleId);

    const newVehicle = {
      id: newVehicleId,
      typeId: model.typeId,
      name: `${model.name} #${countSameType}`,
      category: model.category,
      icon: model.icon,
      network: model.network,
      capacity: model.capacity,
      speed: model.speed,
      fuelPerKm: model.fuelPerKm,
      location: defaultCity,
      status: 'idle',
      assignedDriverId: freeDriver ? freeDriver.id : null,
      currentContract: null,
      path: [],
      currentLeg: 0,
      legProgress: 0,
      waitTimer: 0
    };

    if (freeDriver) {
      freeDriver.assignedVehicleId = newVehicleId;
    }

    this.state.fleet.push(newVehicle);

    this.sound.playCash();
    const driverMsg = freeDriver ? ` ${this.t('driver_assigned')} ${this.getDriverName(freeDriver.name)}.` : ` ${this.t('driver_not_assigned')}.`;
    this.showToast(`🎉 ${model.name} ➔ ${this.getCityName(defaultCity)}.${driverMsg}`, 'success');
    this.renderShopUI();
    this.renderFleetUI();
    this.renderDriversUI();
    this.updateStatsUI();
  }

  buyGarage(cityId) {
    if (this.state.garages[cityId]) {
      this.showToast('Garage already owned in this city!', 'warning');
      return;
    }

    const tier1 = GARAGE_TIERS[1];
    if (this.state.money < tier1.cost) {
      this.showToast(this.t('btn_not_enough_funds'), 'error');
      return;
    }

    this.state.money -= tier1.cost;
    const cityName = this.getCityName(cityId);
    this.state.garages[cityId] = {
      cityId: cityId,
      level: 1,
      name: `${cityName}: ${tier1.name}`,
      slots: tier1.slots
    };

    this.sound.playCash();
    this.showToast(`🏠 ${this.t('toast_garage_bought')} ${cityName} (+${tier1.slots})!`, 'success');
    this.renderGaragesUI();
    this.renderShopUI();
    this.updateStatsUI();
  }

  upgradeGarage(cityId) {
    const garage = this.state.garages[cityId];
    if (!garage) return;
    if (garage.level >= 3) {
      this.showToast(this.t('garage_max_badge'), 'info');
      return;
    }

    const currentTier = GARAGE_TIERS[garage.level];
    const nextTier = GARAGE_TIERS[garage.level + 1];
    const cost = currentTier.upgradeCost;

    if (this.state.money < cost) {
      this.showToast(this.t('btn_not_enough_funds'), 'error');
      return;
    }

    this.state.money -= cost;
    garage.level++;
    garage.slots = nextTier.slots;
    const cityName = this.getCityName(cityId);
    garage.name = `${cityName}: ${nextTier.name}`;

    this.sound.playCash();
    this.showToast(`🏗️ ${cityName} ➔ ${this.t('garage_level_label')} ${garage.level} (${nextTier.slots} ${this.t('vehicles_unit')})!`, 'success');
    this.renderGaragesUI();
    this.renderShopUI();
    this.updateStatsUI();
  }

  hireDriver(driverId) {
    const idx = this.state.driverMarket.findIndex(d => d.id === driverId);
    if (idx === -1) return;
    const candidate = this.state.driverMarket[idx];

    if (this.state.money < candidate.hireCost) {
      this.showToast(this.t('btn_not_enough_funds'), 'error');
      return;
    }

    this.state.money -= candidate.hireCost;
    this.state.driverMarket.splice(idx, 1);

    // Автоматичне закріплення за вільним транспортом без водія
    const unassignedVehicle = this.state.fleet.find(v => !v.assignedDriverId);
    if (unassignedVehicle) {
      candidate.assignedVehicleId = unassignedVehicle.id;
      unassignedVehicle.assignedDriverId = candidate.id;
    }

    this.state.drivers.push(candidate);

    // Оновлюємо ринок, якщо кандидатів мало
    if (this.state.driverMarket.length < 3) {
      this.generateCandidateDrivers();
    }

    this.sound.playCash();
    this.showToast(`🤝 ${this.t('toast_driver_hired')} ${this.getDriverName(candidate.name)}!`, 'success');
    this.renderDriversUI();
    this.renderFleetUI();
    this.updateStatsUI();
  }

  fireDriver(driverId) {
    const idx = this.state.drivers.findIndex(d => d.id === driverId);
    if (idx === -1) return;
    const driver = this.state.drivers[idx];

    // Перевірка, чи не в рейсі закріплений автомобіль
    if (driver.assignedVehicleId) {
      const v = this.state.fleet.find(veh => veh.id === driver.assignedVehicleId);
      if (v && v.status !== 'idle') {
        this.showToast(this.t('toast_vehicle_in_transit'), 'warning');
        return;
      }
      if (v) v.assignedDriverId = null;
    }

    if (confirm(`Dismiss ${this.getDriverName(driver.name)}?`)) {
      this.state.drivers.splice(idx, 1);
      this.showToast(`👋 ${this.t('toast_driver_fired')} ${this.getDriverName(driver.name)}`, 'info');
      this.renderDriversUI();
      this.renderFleetUI();
      this.updateStatsUI();
    }
  }

  assignDriverToVehicle(driverId, vehicleId) {
    const driver = this.state.drivers.find(d => d.id === driverId);
    if (!driver) return;

    // Зняти водія в резерв
    if (!vehicleId) {
      if (driver.assignedVehicleId) {
        const oldV = this.state.fleet.find(v => v.id === driver.assignedVehicleId);
        if (oldV) {
          if (oldV.status !== 'idle') {
            this.showToast(this.t('toast_vehicle_in_transit'), 'warning');
            this.renderDriversUI();
            return;
          }
          oldV.assignedDriverId = null;
        }
      }
      driver.assignedVehicleId = null;
      this.showToast(`${this.getDriverName(driver.name)} ➔ ${this.t('driver_unassigned_opt')}`, 'info');
      this.renderDriversUI();
      this.renderFleetUI();
      return;
    }

    const vehicle = this.state.fleet.find(v => v.id === vehicleId);
    if (!vehicle) return;

    if (vehicle.status !== 'idle') {
      this.showToast(this.t('toast_vehicle_in_transit'), 'warning');
      this.renderDriversUI();
      return;
    }

    // Перевірка кваліфікації
    if (driver.qualification !== 'all') {
      const net = vehicle.network;
      const cat = vehicle.category.toLowerCase();
      let match = false;
      if (driver.qualification === 'plane' && net === 'air') match = true;
      else if (driver.qualification === 'train' && net === 'rail') match = true;
      else if (driver.qualification === 'truck' && cat.includes('тягач')) match = true;
      else if (driver.qualification === 'van' && (cat.includes('фургон') || cat.includes('бус') || cat.includes('van') || cat.includes('dodávka'))) match = true;
      else if (driver.qualification === 'truck' && net === 'road') match = true;

      if (!match) {
        this.showToast(this.t('toast_qual_mismatch'), 'error');
        this.renderDriversUI();
        return;
      }
    }

    // Відв'язуємо попереднє авто водія
    if (driver.assignedVehicleId) {
      const oldV = this.state.fleet.find(v => v.id === driver.assignedVehicleId);
      if (oldV) oldV.assignedDriverId = null;
    }

    // Відв'язуємо попереднього водія машини
    if (vehicle.assignedDriverId) {
      const oldD = this.state.drivers.find(d => d.id === vehicle.assignedDriverId);
      if (oldD) oldD.assignedVehicleId = null;
    }

    driver.assignedVehicleId = vehicle.id;
    vehicle.assignedDriverId = driver.id;

    this.sound.playHorn();
    this.showToast(`✅ ${this.getDriverName(driver.name)} ➔ ${vehicle.name}`, 'success');
    this.renderDriversUI();
    this.renderFleetUI();
  }

  toggleTradeoff(tradeoffId) {
    const t = TRADEOFFS_CONFIG.find(item => item.id === tradeoffId);
    if (!t) return;

    const tData = (typeof TRADEOFFS_I18N !== 'undefined' && TRADEOFFS_I18N[t.id]) ? TRADEOFFS_I18N[t.id] : null;
    const title = tData ? (tData.title[this.state.lang] || t.title) : t.title;

    // Якщо ще не розблоковано — купуємо
    if (!this.state.unlockedTradeoffs[t.id]) {
      if (this.state.money < t.price) {
        this.showToast(this.t('btn_not_enough_funds'), 'error');
        return;
      }
      this.state.money -= t.price;
      this.state.unlockedTradeoffs[t.id] = true;
      this.state.activeTradeoffs[t.id] = true;
      this.sound.playCash();
      this.showToast(`⚡ ${title}!`, 'success');
    } else {
      // Якщо вже придбано — перемикаємо статус активності
      this.state.activeTradeoffs[t.id] = !this.state.activeTradeoffs[t.id];
      this.showToast(`⚙️ ${title}`, 'info');
    }

    this.renderUpgradesUI();
    this.updateStatsUI();
  }

  buyUpgrade(upgId) {
    const upg = UPGRADES_CONFIG.find(u => u.id === upgId);
    if (!upg) return;

    const currentLevel = this.state.upgrades[upg.id] || 0;
    if (currentLevel >= upg.maxLevel) return;

    const cost = upg.cost * (currentLevel + 1);
    if (this.state.money < cost) {
      this.showToast(this.t('btn_not_enough_funds'), 'error');
      return;
    }

    this.state.money -= cost;
    this.state.upgrades[upg.id] = currentLevel + 1;
    upg.apply(this.state);

    const uData = (typeof UPGRADES_I18N !== 'undefined' && UPGRADES_I18N[upg.id]) ? UPGRADES_I18N[upg.id] : null;
    const title = uData ? (uData.title[this.state.lang] || upg.title) : upg.title;

    this.sound.playCash();
    this.showToast(`✨ ${title} (${this.t('upgrade_level_prefix')} ${this.state.upgrades[upg.id]})!`, 'success');
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
