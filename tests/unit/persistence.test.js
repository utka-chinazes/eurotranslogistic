const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame, memoryStorage } = require('../helpers/load');

function fresh(initial) {
  const storage = memoryStorage(initial);
  const { get } = loadGame({ storage });
  return { get, storage, SaveStore: get('SaveStore'), GameState: get('GameState') };
}

function newCompany(GameState, opts = {}) {
  const s = new GameState({ homeBase: 'rotterdam', ownerName: 'Олена', companyName: 'Danube Freight', difficulty: 'hard', ...opts });
  s.initDefaultFleet();
  return s;
}

test('збереження → завантаження відновлює стан компанії', () => {
  const { SaveStore, GameState } = fresh();
  const s = newCompany(GameState);
  s.money = 12345;
  s.day = 7;
  s.stats.onTime = 4;
  s.loan = 10000;
  assert.ok(SaveStore.save(s));

  const loaded = SaveStore.load();
  assert.equal(loaded.companyName, 'Danube Freight');
  assert.equal(loaded.money, 12345);
  assert.equal(loaded.day, 7);
  assert.equal(loaded.stats.onTime, 4);
  assert.equal(loaded.loan, 10000);
  assert.equal(loaded.difficulty, 'hard');
  assert.equal(loaded.fleet.length, 1);
});

test('тимчасові UI-поля не зберігаються', () => {
  const { SaveStore, GameState, storage } = fresh();
  const s = newCompany(GameState);
  s.selectedCity = 'paris';
  s.hoveredCity = 'rome';
  SaveStore.save(s);
  const raw = JSON.parse(storage.getItem(SaveStore.KEYS.save));
  assert.equal(raw.state.selectedCity, undefined);
  assert.equal(raw.state.hoveredCity, undefined);
  assert.equal(raw.version, 4);
});

test('peek дає короткий опис для титульного екрана', () => {
  const { SaveStore, GameState } = fresh();
  SaveStore.save(newCompany(GameState));
  const peek = SaveStore.peek();
  assert.equal(peek.summary.company, 'Danube Freight');
  assert.equal(peek.summary.homeBase, 'rotterdam');
  assert.ok(peek.savedAt > 0);
});

test('міграція збереження v3: дефолти для нових полів і запис у новому форматі', () => {
  const legacy = {
    homeBase: 'kyiv', ownerName: 'Старий', companyName: 'Old Co', money: 5000, reputation: 90, day: 3,
    fleet: [{ id: 'v1', typeId: 'van', network: 'road', status: 'idle', location: 'kyiv', capacity: 3.5, speed: 140, fuelPerKm: 0.22, path: [] }],
    drivers: [], contracts: [], garages: { kyiv: { cityId: 'kyiv', level: 1, slots: 2 } },
    stats: { totalEarned: 100, expenses: { fuel: 5 } }
  };
  const { SaveStore, storage } = fresh({ eurotrans_save_v3: JSON.stringify(legacy) });

  assert.ok(SaveStore.hasSave());
  const s = SaveStore.load();
  assert.equal(s.companyName, 'Old Co');
  assert.equal(s.fleet[0].condition, 100);
  assert.equal(s.fleet[0].requiredCategory, 'van');
  assert.ok(s.fleet[0].purchasePrice > 0);
  assert.equal(s.difficulty, 'normal');
  assert.equal(s.stats.expenses.fuel, 5);
  assert.equal(s.stats.expenses.service, 0);
  assert.equal(storage.getItem('eurotrans_save_v3'), null, 'legacy key removed');
  assert.ok(storage.getItem('eurotrans_save'), 'rewritten as v4');
});

test('ТЗ, що «завис» у русі без маршруту, після завантаження стає вільним', () => {
  const { SaveStore, GameState } = fresh();
  const s = newCompany(GameState);
  s.fleet[0].status = 'relocating';
  s.fleet[0].path = [];
  SaveStore.save(s);
  assert.equal(SaveStore.load().fleet[0].status, 'idle');
});

test('пошкоджене збереження не ламає гру', () => {
  const { SaveStore } = fresh({ eurotrans_save: '{not json' });
  assert.equal(SaveStore.hasSave(), false);
  assert.equal(SaveStore.load(), null);
});

test('збереження з невідомим штабом відкидається', () => {
  const { SaveStore, GameState } = fresh();
  const s = newCompany(GameState);
  s.homeBase = 'atlantis';
  SaveStore.save(s);
  assert.equal(SaveStore.load(), null);
});

test('налаштування мігрують зі старих окремих ключів', () => {
  const { SaveStore, storage } = fresh({
    eurotrans_lang: 'de', eurotrans_volume: '35', eurotrans_sound_enabled: 'false', eurotrans_tutorial_completed: 'true'
  });
  const st = SaveStore.loadSettings();
  assert.equal(st.lang, 'de');
  assert.equal(st.volume, 35);
  assert.equal(st.sound, false);
  assert.equal(st.tutorialDone, true);
  assert.equal(storage.getItem('eurotrans_lang'), null);
});

test('експорт/імпорт файлу зберігає компанію', () => {
  const { SaveStore, GameState } = fresh();
  const s = newCompany(GameState);
  s.money = 777;
  const text = SaveStore.exportPayload(s);
  const back = SaveStore.parseImport(text);
  assert.equal(back.money, 777);
  assert.throws(() => SaveStore.parseImport('{"foo":1}'));
});

test('архів тримає не більше 8 компаній, найновіша перша', () => {
  const { SaveStore, GameState } = fresh();
  for (let i = 0; i < 10; i++) SaveStore.archive(newCompany(GameState, { companyName: `Co ${i}` }), 'closed');
  const list = SaveStore.loadArchive();
  assert.equal(list.length, 8);
  assert.equal(list[0].company, 'Co 9');
});

test('без доступного сховища save повертає null, а не кидає виняток', () => {
  const broken = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); }, removeItem() {} };
  const { get } = loadGame({ storage: broken });
  const SaveStore = get('SaveStore');
  const GameState = get('GameState');
  assert.equal(SaveStore.available(), false);
  assert.equal(SaveStore.save(newCompany(GameState)), null);
});
