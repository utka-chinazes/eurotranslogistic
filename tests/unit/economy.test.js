const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('../helpers/load');

const { get } = loadGame();
const Economy = get('Economy');
const GameState = get('GameState');
const WEAR = get('WEAR');
const VEHICLE_CATALOG = get('VEHICLE_CATALOG');
const createVehicleFromModel = get('createVehicleFromModel');

const noMods = () => Economy.tradeoffModifiers({});
const contract = (reward = 1000) => ({ reward, penalty: Math.round(reward * 0.4) });

test('репутація: 10% → ×0.88, 100% → ×1.15, значення обмежені', () => {
  assert.equal(Economy.reputationMultiplier(100).toFixed(2), '1.15');
  assert.equal(Economy.reputationMultiplier(10).toFixed(2), '0.88');
  assert.equal(Economy.reputationMultiplier(250), Economy.reputationMultiplier(100));
});

test('виплата вчасно: повна; із бонусом гаража 3 рівня +25%', () => {
  assert.equal(Economy.payout(contract(), true, { garage: null, mods: noMods() }), 1000);
  assert.equal(Economy.payout(contract(), true, { garage: { level: 3 }, mods: noMods() }), 1250);
});

test('запізнення: штраф, але не менше 50% винагороди', () => {
  assert.equal(Economy.payout(contract(), false, { garage: null, mods: noMods() }), 600);
  const harsh = { reward: 1000, penalty: 900 };
  assert.equal(Economy.payout(harsh, false, { garage: null, mods: noMods() }), 500);
});

test('страховка Allianz прибирає штраф, але бере 12% комісії', () => {
  const mods = Economy.tradeoffModifiers({ allianz_insurance: true });
  assert.equal(Economy.payout(contract(), false, { garage: null, mods }), 880);
});

test('модифікатори компромісів сумуються', () => {
  const m = Economy.tradeoffModifiers({ turbo_boost: true, mega_trailers: true });
  assert.equal(+m.speedMod.toFixed(2), 0.10);
  assert.equal(m.capacityMod, 0.35);
});

test('серія: +2% за доставку, максимум +20%', () => {
  assert.equal(Economy.streakBonus(0), 0);
  assert.equal(Economy.streakBonus(3), 0.06);
  assert.equal(Economy.streakBonus(50), 0.2);
});

test('знос: дорога зношує сильніше за залізницю, інженер — повільніше', () => {
  const road = Economy.wearForKm(1000, 'road');
  const rail = Economy.wearForKm(1000, 'rail');
  assert.ok(road > rail);
  assert.ok(Economy.wearForKm(1000, 'road', { wearMod: -0.35 }) < road);
});

test('стан нижче порогу сповільнює ТЗ', () => {
  assert.equal(Economy.conditionSpeedMultiplier(100), 1);
  assert.equal(Economy.conditionSpeedMultiplier(WEAR.slowBelow - 1), 1 - WEAR.slowPenalty);
});

test('ціна продажу падає зі станом; сервіс нового ТЗ безкоштовний', () => {
  const v = createVehicleFromModel(VEHICLE_CATALOG.find(m => m.typeId === 'truck_daf'), 'berlin', 'x');
  const fresh = Economy.resaleValue(v);
  v.condition = 20;
  assert.ok(Economy.resaleValue(v) < fresh);
  assert.ok(fresh < v.purchasePrice);
  v.condition = 100;
  assert.equal(Economy.serviceCost(v), 0);
});

test('сервіс у дорозі дорожчий за сервіс на базі', () => {
  const v = createVehicleFromModel(VEHICLE_CATALOG[0], 'berlin', 'x');
  v.condition = 40;
  assert.ok(Economy.serviceCost(v, 0, false) > Economy.serviceCost(v, 0, true));
});

test('кваліфікація водія за requiredCategory, водій тягача може вести фургон', () => {
  const van = { requiredCategory: 'van' };
  const train = { requiredCategory: 'train' };
  assert.ok(Economy.driverCanOperate({ qualification: 'all' }, train));
  assert.ok(Economy.driverCanOperate({ qualification: 'truck' }, van));
  assert.ok(!Economy.driverCanOperate({ qualification: 'van' }, train));
  assert.ok(!Economy.driverCanOperate(null, van));
});

test('оплата водія: ставка + кілометраж', () => {
  assert.equal(Economy.driverPay({ salaryPerTrip: 100 }, 1000), 250);
  assert.equal(Economy.driverPay(null, 1000), 0);
});

test('кредитний ліміт залежить від складності й походження і кратний кроку', () => {
  const normal = new GameState({ difficulty: 'normal' });
  const hard = new GameState({ difficulty: 'hard' });
  const fin = new GameState({ difficulty: 'normal', ownerBackground: 'financier' });
  assert.ok(Economy.creditLimit(hard) < Economy.creditLimit(normal));
  assert.ok(Economy.creditLimit(fin) > Economy.creditLimit(normal));
  assert.equal(Economy.creditLimit(normal) % 10000, 0);
});

test('відсотки за кредит і утримання баз', () => {
  const s = new GameState({ difficulty: 'normal' });
  s.loan = 20000;
  assert.equal(Economy.dailyInterest(s), 240);
  assert.equal(Economy.dailyUpkeep(s), 120);
  s.difficulty = 'easy';
  assert.equal(Economy.dailyUpkeep(s), 72);
});

test('вартість компанії = гроші + техніка + бази − борг', () => {
  const s = new GameState({});
  s.initDefaultFleet();
  const before = Economy.companyValue(s);
  s.loan = 10000;
  assert.equal(Economy.companyValue(s), before - 10000);
});
