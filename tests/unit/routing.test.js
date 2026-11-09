const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame } = require('../helpers/load');

const { get } = loadGame();
const Routing = get('Routing');
const CITIES = get('CITIES');
const CONNECTIONS = get('CONNECTIONS');

test('haversine: Київ → Варшава ≈ 690 км', () => {
  const d = Routing.cityDistance('kyiv', 'warsaw');
  assert.ok(d > 650 && d < 730, `got ${d}`);
});

test('відстань симетрична і нульова для того самого міста', () => {
  assert.equal(Routing.cityDistance('paris', 'paris'), 0);
  assert.equal(Routing.cityDistance('paris', 'rome'), Routing.cityDistance('rome', 'paris'));
});

test('авіамаршрут завжди прямий', () => {
  assert.deepEqual([...Routing.findPath('madrid', 'kyiv', 'air')], ['madrid', 'kyiv']);
});

test('дорожній шлях починається й закінчується де треба і йде по існуючих ребрах', () => {
  const path = Routing.findPath('madrid', 'kyiv', 'road');
  assert.ok(path, 'path exists');
  assert.equal(path[0], 'madrid');
  assert.equal(path[path.length - 1], 'kyiv');
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i], b = path[i + 1];
    const edge = CONNECTIONS.some(c => c.type === 'road' && ((c.from === a && c.to === b) || (c.from === b && c.to === a)));
    assert.ok(edge, `no road edge ${a}-${b}`);
  }
});

test('усі міста досяжні автодорогою з Берліна', () => {
  const unreachable = Object.keys(CITIES).filter(id => id !== 'berlin' && !Routing.findPath('berlin', id, 'road'));
  assert.equal(unreachable.length, 0, unreachable.join(','));
});

test('кеш повертає копію: зміна результату не псує наступні виклики', () => {
  const p1 = Routing.findPath('berlin', 'rome', 'road');
  p1.push('garbage');
  const p2 = Routing.findPath('berlin', 'rome', 'road');
  assert.notEqual(p2[p2.length - 1], 'garbage');
});

test('зворотний шлях — це дзеркало прямого', () => {
  const there = Routing.findPath('paris', 'warsaw', 'rail');
  const back = Routing.findPath('warsaw', 'paris', 'rail');
  assert.deepEqual([...back], [...there].reverse());
});

test('невідоме місто → null', () => {
  assert.equal(Routing.findPath('atlantis', 'berlin', 'road'), null);
});

test('pathDistance складає відрізки', () => {
  const d = Routing.pathDistance(['berlin', 'prague']);
  assert.equal(d, Math.round(Routing.cityDistance('berlin', 'prague')));
  assert.equal(Routing.pathDistance(['berlin']), 0);
});
