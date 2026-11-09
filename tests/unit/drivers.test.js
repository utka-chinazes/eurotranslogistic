const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('../helpers/load');

// Біржа праці: підключаємо міксин флоту до мінімальної «гри» без DOM
function makeGame() {
  const { get, context } = loadGame({
    files: [
      'js/data/world.js', 'js/data/catalog.js', 'js/data/progression.js',
      'js/core/state.js', 'js/systems/routing.js', 'js/systems/economy.js', 'js/systems/fleet.js'
    ]
  });
  const Game = get('EuroLogisticsGame');
  const game = new Game();
  game.state = new (get('GameState'))({});
  game.state.initDefaultFleet();
  game.pickRandom = arr => arr[Math.floor(Math.random() * arr.length)];
  game.markDirty = () => {};
  return { game, get, context };
}

test('біржа має мінімум кандидатів кожної кваліфікації', () => {
  const { game, get } = makeGame();
  const composition = get('DRIVER_MARKET_COMPOSITION');
  game.generateCandidateDrivers();
  for (const [qual, min] of Object.entries(composition)) {
    const have = game.state.driverMarket.filter(d => d.qualification === qual).length;
    assert.ok(have >= min, `${qual}: ${have} < ${min}`);
  }
  assert.ok(game.state.driverMarket.length >= 10);
});

test('імена кандидатів не повторюються і не збігаються зі штатом', () => {
  const { game } = makeGame();
  game.generateCandidateDrivers();
  const names = [...game.state.drivers, ...game.state.driverMarket].map(d => d.name);
  assert.equal(new Set(names).size, names.length);
});

test('щоденна ротація змінює частину кандидатів і зберігає склад', () => {
  const { game, get } = makeGame();
  const composition = get('DRIVER_MARKET_COMPOSITION');
  game.generateCandidateDrivers();
  const before = new Set(game.state.driverMarket.map(d => d.id));
  game.refreshDriverMarket();
  const after = game.state.driverMarket;
  assert.ok(after.some(d => !before.has(d.id)), 'з\'явилися нові кандидати');
  for (const [qual, min] of Object.entries(composition)) {
    assert.ok(after.filter(d => d.qualification === qual).length >= min, qual);
  }
});

test('старе збереження з 4 кандидатами доповнюється до повного складу', () => {
  const { game } = makeGame();
  game.state.driverMarket = [game.createCandidate('van')];
  game.topUpDriverMarket();
  assert.ok(game.state.driverMarket.filter(d => d.qualification === 'plane').length >= 2);
});

test('універсали дорожчі за водіїв фургонів того самого рівня', () => {
  const { game } = makeGame();
  let van, all;
  do { van = game.createCandidate('van'); all = game.createCandidate('all'); } while (van.level !== all.level);
  assert.ok(all.hireCost > van.hireCost);
});
