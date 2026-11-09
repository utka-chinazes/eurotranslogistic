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
