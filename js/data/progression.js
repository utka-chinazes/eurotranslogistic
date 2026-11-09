// =============================================================================
// Стартові бази, досягнення, утримання та розкладка туторіалу
// =============================================================================

// Стартові бази: кожна дає власний стратегічний бонус
const STARTING_BASES = [
  {
    cityId: 'kyiv', icon: '🌅',
    perk: { startMoney: 8000, salaryMod: -0.15 },
    title: { uk: 'Східні ворота', sk: 'Východná brána', en: 'Eastern Gateway', de: 'Osttor' },
    desc: {
      uk: '+€8 000 стартового гранту, зарплати водіїв −15%. Далеко від центру — рейси довші.',
      sk: '+€8 000 štartovací grant, mzdy vodičov −15 %. Ďaleko od centra — trasy sú dlhšie.',
      en: '+€8,000 starting grant, driver wages −15%. Far from the centre — longer hauls.',
      de: '+8.000 € Startzuschuss, Fahrerlöhne −15 %. Weit vom Zentrum — längere Touren.'
    }
  },
  {
    cityId: 'warsaw', icon: '🧑‍🔧',
    perk: { hireMod: -0.3, starterDriverLevel: 2 },
    title: { uk: 'Кадровий хаб', sk: 'Personálny uzol', en: 'Talent Hub', de: 'Personal-Drehkreuz' },
    desc: {
      uk: 'Найм водіїв −30%, стартовий водій одразу 2-го рівня.',
      sk: 'Nábor vodičov −30 %, štartovací vodič má hneď úroveň 2.',
      en: 'Hiring costs −30%, your first driver starts at level 2.',
      de: 'Einstellungskosten −30 %, Ihr erster Fahrer startet auf Stufe 2.'
    }
  },
  {
    cityId: 'berlin', icon: '🫀',
    perk: { homeRouteBonus: 0.15 },
    title: { uk: 'Серце мережі', sk: 'Srdce siete', en: 'Network Heart', de: 'Herz des Netzes' },
    desc: {
      uk: '+15% до виплат за рейси, що починаються або завершуються у вашому штабі.',
      sk: '+15 % k odmene za trasy, ktoré začínajú alebo končia vo vašom sídle.',
      en: '+15% pay on routes that start or end at your HQ.',
      de: '+15 % Vergütung für Routen, die am Hauptsitz beginnen oder enden.'
    }
  },
  {
    cityId: 'rotterdam', icon: '⚓',
    perk: { heavyBonus: 0.2 },
    title: { uk: 'Морський порт', sk: 'Námorný prístav', en: 'Seaport', de: 'Seehafen' },
    desc: {
      uk: 'Важкі вантажі платять +20%. Порт генерує більше важких замовлень.',
      sk: 'Ťažký náklad platí +20 %. Prístav generuje viac ťažkých zákaziek.',
      en: 'Heavy cargo pays +20%. The port spawns more heavy orders.',
      de: 'Schwere Fracht zahlt +20 %. Der Hafen erzeugt mehr Schwerlastaufträge.'
    }
  },
  {
    cityId: 'milan', icon: '🏔️',
    perk: { fuelMod: -0.12 },
    title: { uk: 'Альпійський коридор', sk: 'Alpský koridor', en: 'Alpine Corridor', de: 'Alpenkorridor' },
    desc: {
      uk: 'Пальне для всього флоту −12% назавжди.',
      sk: 'Palivo pre celú flotilu −12 % natrvalo.',
      en: 'Fuel costs for the whole fleet −12%, permanently.',
      de: 'Treibstoffkosten der gesamten Flotte dauerhaft −12 %.'
    }
  },
  {
    cityId: 'paris', icon: '⚡',
    perk: { urgentBonus: 0.15, urgentDeadline: 0.15 },
    title: { uk: 'Експрес-столиця', sk: 'Expresná metropola', en: 'Express Capital', de: 'Express-Metropole' },
    desc: {
      uk: 'Термінові замовлення: +15% оплати і +15% часу на дедлайн.',
      sk: 'Expresné zákazky: +15 % odmena a +15 % času na termín.',
      en: 'Urgent orders: +15% pay and +15% more deadline time.',
      de: 'Eilaufträge: +15 % Vergütung und +15 % mehr Zeit.'
    }
  }
];

const OWNER_AVATARS = ['🧑‍💼', '👩‍💼', '👨‍✈️', '👩‍✈️', '🧔', '👩‍🔧', '🦊', '🐺'];

// Щоденне утримання баз за рівнем
const GARAGE_UPKEEP = { 1: 120, 2: 300, 3: 650 };

// Скільки секунд симуляції триває подія з біжучого рядка
const EVENT_DURATION = 40;
// Додаткові ефекти подій, яких немає в описі EVENTS_I18N
const EVENT_EXTRA_EFFECTS = { economic_boom: { rewardMultiplier: 1.25 } };

// Досягнення з грошовою нагородою
const ACHIEVEMENTS = [
  { id: 'first_delivery', icon: '🎉', reward: 1000, check: (s) => s.stats.onTime + s.stats.late >= 1,
    title: { uk: 'Перший рейс', sk: 'Prvá jazda', en: 'First Run', de: 'Erste Fahrt' },
    desc: { uk: 'Виконайте першу доставку', sk: 'Dokončite prvé doručenie', en: 'Complete your first delivery', de: 'Erste Lieferung abschließen' } },
  { id: 'deliveries_10', icon: '📦', reward: 3000, check: (s) => s.stats.onTime + s.stats.late >= 10,
    title: { uk: 'Десятка', sk: 'Desiatka', en: 'Top Ten', de: 'Zehner' },
    desc: { uk: '10 виконаних доставок', sk: '10 doručení', en: '10 deliveries', de: '10 Lieferungen' } },
  { id: 'deliveries_50', icon: '🚚', reward: 10000, check: (s) => s.stats.onTime + s.stats.late >= 50,
    title: { uk: 'Півсотні рейсів', sk: 'Päťdesiatka', en: 'Half a Hundred', de: 'Fünfzig Touren' },
    desc: { uk: '50 виконаних доставок', sk: '50 doručení', en: '50 deliveries', de: '50 Lieferungen' } },
  { id: 'deliveries_150', icon: '🏆', reward: 30000, check: (s) => s.stats.onTime + s.stats.late >= 150,
    title: { uk: 'Ветеран логістики', sk: 'Veterán logistiky', en: 'Logistics Veteran', de: 'Logistik-Veteran' },
    desc: { uk: '150 виконаних доставок', sk: '150 doručení', en: '150 deliveries', de: '150 Lieferungen' } },
  { id: 'streak_10', icon: '⏱️', reward: 5000, check: (s) => s.stats.bestStreak >= 10,
    title: { uk: 'Швейцарський годинник', sk: 'Švajčiarske hodinky', en: 'Swiss Watch', de: 'Schweizer Uhrwerk' },
    desc: { uk: '10 вчасних доставок поспіль', sk: '10 včasných doručení za sebou', en: '10 on-time deliveries in a row', de: '10 pünktliche Lieferungen in Folge' } },
  { id: 'long_haul', icon: '🗺️', reward: 3000, check: (s) => s.stats.longestRoute >= 2500,
    title: { uk: 'Далекобій', sk: 'Diaľkar', en: 'Long Hauler', de: 'Fernfahrer' },
    desc: { uk: 'Доставка на 2 500+ км', sk: 'Doručenie na 2 500+ km', en: 'A delivery of 2,500+ km', de: 'Eine Lieferung über 2.500+ km' } },
  { id: 'earned_100k', icon: '💶', reward: 5000, check: (s) => s.stats.totalEarned >= 100000,
    title: { uk: 'Перші сто тисяч', sk: 'Prvých sto tisíc', en: 'First Hundred Grand', de: 'Die ersten Hunderttausend' },
    desc: { uk: 'Заробіть €100 000 за весь час', sk: 'Zarobte celkovo €100 000', en: 'Earn €100,000 in total', de: 'Insgesamt 100.000 € verdienen' } },
  { id: 'earned_1m', icon: '💎', reward: 50000, check: (s) => s.stats.totalEarned >= 1000000,
    title: { uk: 'Мільйонер', sk: 'Milionár', en: 'Millionaire', de: 'Millionär' },
    desc: { uk: 'Заробіть €1 000 000 за весь час', sk: 'Zarobte celkovo €1 000 000', en: 'Earn €1,000,000 in total', de: 'Insgesamt 1.000.000 € verdienen' } },
  { id: 'garages_3', icon: '🏠', reward: 6000, check: (s) => Object.keys(s.garages).length >= 3,
    title: { uk: 'Мережа баз', sk: 'Sieť základní', en: 'Depot Network', de: 'Depot-Netz' },
    desc: { uk: 'Відкрийте 3 бази', sk: 'Otvorte 3 základne', en: 'Own 3 depots', de: '3 Depots besitzen' } },
  { id: 'hub_lvl3', icon: '🏗️', reward: 10000, check: (s) => Object.values(s.garages).some(g => g.level >= 3),
    title: { uk: 'Мультимодальний хаб', sk: 'Multimodálny uzol', en: 'Multimodal Hub', de: 'Multimodaler Hub' },
    desc: { uk: 'Модернізуйте базу до 3 рівня', sk: 'Vylepšite základňu na úroveň 3', en: 'Upgrade a depot to level 3', de: 'Ein Depot auf Stufe 3 ausbauen' } },
  { id: 'first_train', icon: '🚂', reward: 5000, check: (s) => s.fleet.some(v => v.network === 'rail'),
    title: { uk: 'На рейках', sk: 'Na koľajniciach', en: 'On the Rails', de: 'Auf Schienen' },
    desc: { uk: 'Купіть перший потяг', sk: 'Kúpte prvý vlak', en: 'Buy your first train', de: 'Ersten Zug kaufen' } },
  { id: 'first_plane', icon: '✈️', reward: 15000, check: (s) => s.fleet.some(v => v.network === 'air'),
    title: { uk: 'Крила компанії', sk: 'Krídla firmy', en: 'Company Wings', de: 'Firmenflügel' },
    desc: { uk: 'Купіть перший літак', sk: 'Kúpte prvé lietadlo', en: 'Buy your first aircraft', de: 'Erstes Flugzeug kaufen' } },
  { id: 'fleet_10', icon: '🚛', reward: 12000, check: (s) => s.fleet.length >= 10,
    title: { uk: 'Великий автопарк', sk: 'Veľká flotila', en: 'Big Fleet', de: 'Große Flotte' },
    desc: { uk: '10 транспортних засобів у флоті', sk: '10 vozidiel vo flotile', en: '10 vehicles in the fleet', de: '10 Fahrzeuge in der Flotte' } },
  { id: 'driver_lvl5', icon: '🎖️', reward: 4000, check: (s) => s.drivers.some(d => d.level >= 5),
    title: { uk: 'Ас дороги', sk: 'Eso cesty', en: 'Road Ace', de: 'Straßen-Ass' },
    desc: { uk: 'Водій досягає 5 рівня', sk: 'Vodič dosiahne úroveň 5', en: 'A driver reaches level 5', de: 'Ein Fahrer erreicht Stufe 5' } }
];

// Розкладка кроків туторіалу: на що вказує картка і що підсвічується на мапі.
// Тексти кроків — у TUTORIAL_I18N (i18n.js), індекси збігаються.
const TUTORIAL_LAYOUT = [
  { target: '#hud',                  placement: 'bottom', map: 'base' },
  { target: '#canvasWrapper',                placement: 'inside', map: 'network' },
  { target: '#contractsList .contract-card', fallback: '#tab-contracts', placement: 'right', tab: 'contracts', map: 'contract' },
  { target: '#tab-shop',                     placement: 'right',  tab: 'shop',      map: 'fleet' },
  { target: '#fleetList .vehicle-card', fallback: '#tab-fleet', placement: 'right', tab: 'fleet', map: 'fleet' },
  { target: '#tab-garages',                  placement: 'right',  tab: 'garages',   map: 'garages' },
  { target: '#tab-drivers',                  placement: 'right',  tab: 'drivers',   map: 'fleet' },
  { target: '#tab-upgrades',                 placement: 'right',  tab: 'upgrades',  map: null },
  { target: '.speed-seg',               placement: 'bottom', tab: 'contracts', map: 'vehicles' },
  { target: '#btnProfile',                   placement: 'bottom', tab: 'contracts', map: 'base' }
];

// =============================================================================
// Власник, бренд, складність, фінанси та знос техніки
// =============================================================================

// Походження власника: постійний бонус на всю гру
const OWNER_BACKGROUNDS = [
  {
    id: 'trucker', icon: '🚚',
    perk: { driverXpMod: 0.3, starterDriverBonus: 1 },
    title: { uk: 'Колишній далекобійник', sk: 'Bývalý diaľkar', en: 'Former Trucker', de: 'Ex-Fernfahrer' },
    desc: {
      uk: 'Водії отримують +30% досвіду, стартовий водій на рівень вищий.',
      sk: 'Vodiči získavajú +30 % skúseností, štartovací vodič o úroveň vyššie.',
      en: 'Drivers gain +30% XP, your first driver starts one level higher.',
      de: 'Fahrer erhalten +30 % EP, der erste Fahrer startet eine Stufe höher.'
    }
  },
  {
    id: 'financier', icon: '📊',
    perk: { startMoney: 5000, loanRate: 0.006, creditMod: 0.5 },
    title: { uk: 'Фінансист', sk: 'Finančník', en: 'Financier', de: 'Finanzexperte' },
    desc: {
      uk: '+€5 000 на старті, кредити під 0.6% на день замість 1.2%, ліміт кредиту +50%.',
      sk: '+€5 000 na štart, úvery za 0,6 % denne namiesto 1,2 %, úverový limit +50 %.',
      en: '+€5,000 at start, loans at 0.6% a day instead of 1.2%, credit limit +50%.',
      de: '+5.000 € Start, Kredite zu 0,6 % statt 1,2 % pro Tag, Kreditlimit +50 %.'
    }
  },
  {
    id: 'engineer', icon: '🔧',
    perk: { wearMod: -0.35, serviceMod: -0.4 },
    title: { uk: 'Інженер', sk: 'Inžinier', en: 'Engineer', de: 'Ingenieur' },
    desc: {
      uk: 'Техніка зношується на 35% повільніше, сервіс дешевший на 40%.',
      sk: 'Technika sa opotrebúva o 35 % pomalšie, servis je o 40 % lacnejší.',
      en: 'Vehicles wear 35% slower and servicing costs 40% less.',
      de: 'Fahrzeuge verschleißen 35 % langsamer, Wartung kostet 40 % weniger.'
    }
  },
  {
    id: 'negotiator', icon: '🤝',
    perk: { rewardMod: 0.06, repGainBonus: 1 },
    title: { uk: 'Переговорник', sk: 'Vyjednávač', en: 'Negotiator', de: 'Verhandler' },
    desc: {
      uk: '+6% до оплати всіх замовлень, репутація зростає швидше.',
      sk: '+6 % k odmene všetkých zákaziek, reputácia rastie rýchlejšie.',
      en: '+6% pay on every order, reputation grows faster.',
      de: '+6 % Vergütung auf alle Aufträge, der Ruf wächst schneller.'
    }
  }
];

// Фірмові кольори компанії (бейдж, ореоли транспорту на мапі)
const BRAND_COLORS = ['#ffa53d', '#ff5c7a', '#c084fc', '#36c9f5', '#3ee6a0', '#ffd23f'];

// Генератор назв компаній
const COMPANY_NAME_PARTS = {
  first: ['Euro', 'Trans', 'Nord', 'Danube', 'Carpathian', 'Baltic', 'Atlas', 'Vector', 'Orion', 'Polar', 'Iron', 'Blue', 'Swift', 'Meridian'],
  second: ['Freight', 'Logistics', 'Cargo', 'Express', 'Lines', 'Haulage', 'Transit', 'Movers', 'Route', 'Link']
};

// Рівні складності
const DIFFICULTIES = {
  easy: {
    icon: '🌱', reward: 1.1, startMoney: 1.4, upkeep: 0.6, deadline: 1.25, wear: 0.7, creditBase: 30000, bankruptDays: 5,
    title: { uk: 'Легко', sk: 'Ľahká', en: 'Easy', de: 'Leicht' },
    desc: {
      uk: 'Більше грошей, м\'якші дедлайни, дешеве утримання. Для знайомства з грою.',
      sk: 'Viac peňazí, voľnejšie termíny, lacná údržba. Na zoznámenie s hrou.',
      en: 'More cash, softer deadlines, cheap upkeep. Good for learning the ropes.',
      de: 'Mehr Geld, lockerere Fristen, günstiger Unterhalt. Zum Kennenlernen.'
    }
  },
  normal: {
    icon: '⚖️', reward: 1, startMoney: 1, upkeep: 1, deadline: 1, wear: 1, creditBase: 20000, bankruptDays: 3,
    title: { uk: 'Нормально', sk: 'Normálna', en: 'Normal', de: 'Normal' },
    desc: {
      uk: 'Збалансована економіка — так гра задумана.',
      sk: 'Vyvážená ekonomika — tak, ako bola hra navrhnutá.',
      en: 'Balanced economy — the game as designed.',
      de: 'Ausgewogene Wirtschaft — so ist das Spiel gedacht.'
    }
  },
  hard: {
    icon: '🔥', reward: 0.85, startMoney: 0.7, upkeep: 1.4, deadline: 0.85, wear: 1.35, creditBase: 12000, bankruptDays: 2,
    title: { uk: 'Складно', sk: 'Ťažká', en: 'Hard', de: 'Schwer' },
    desc: {
      uk: 'Менше капіталу, жорсткі дедлайни, швидкий знос. Кожне рішення має вагу.',
      sk: 'Menej kapitálu, prísne termíny, rýchle opotrebenie. Každé rozhodnutie má váhu.',
      en: 'Less capital, tight deadlines, fast wear. Every decision matters.',
      de: 'Weniger Kapital, enge Fristen, schneller Verschleiß. Jede Entscheidung zählt.'
    }
  }
};

// Фінанси
const FINANCE = {
  loanStep: 10000,          // крок кредиту
  loanRate: 0.012,          // відсоток за ігровий день
  creditFromEarnings: 0.15, // ліміт кредиту зростає з заробленим
  bankruptLine: 0           // баланс нижче — день у боргу
};

// Економіка рейсу
const REWARD_SCALE = 0.8;        // загальний множник винагород
const DRIVER_PAY_PER_KM = 0.15;  // зарплата водія за км (плюс ставка за рейс)

// Знос техніки: % стану за 100 км
const WEAR_PER_100KM = { road: 1.1, rail: 0.5, air: 0.7 };
const WEAR = {
  slowBelow: 40,          // нижче — швидкість падає
  slowPenalty: 0.15,
  breakdownBelow: 25,     // нижче — можлива поломка на кожному відрізку
  breakdownChance: 0.12,
  breakdownDelay: 4,      // секунд простою
  breakdownCostShare: 0.03,
  serviceCostShare: 0.22, // вартість повного сервісу від ціни ТЗ
  roadsideServiceMod: 0.5, // сервіс поза власною базою дорожчий
  resaleShare: 0.65       // базова частка ціни при продажу
};
