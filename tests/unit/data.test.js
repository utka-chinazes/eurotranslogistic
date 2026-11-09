const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { loadGame, ROOT } = require('../helpers/load');

const { get } = loadGame();
const I18N = get('I18N');
const LANGS = ['uk', 'sk', 'en', 'de'];

// Збирає всі ключі перекладу, які використовує код і розмітка
function usedKeys() {
  const files = [];
  const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (p.endsWith('.js') && !p.includes(`${path.sep}data${path.sep}`)) files.push(p);
  });
  walk(path.join(ROOT, 'js'));
  const src = files.map(f => fs.readFileSync(f, 'utf8')).join('\n') + fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const keys = new Set();
  for (const m of src.matchAll(/this\.(?:t|plain|tTemplate)\('([a-z0-9_]+)'/g)) keys.add(m[1]);
  for (const m of src.matchAll(/data-i18n(?:-title|-ph)?="([a-z0-9_]+)"/g)) keys.add(m[1]);
  ['fuel', 'salaries', 'vehicles', 'garages', 'upgrades', 'hiring', 'upkeep', 'fees', 'service', 'interest'].forEach(k => keys.add(`expense_${k}`));
  // Відкидаємо динамічні префікси на кшталт 'expense_' + k
  return [...keys].filter(k => !k.endsWith('_') && k !== 'key');
}

test('кожен ключ перекладу є в усіх чотирьох мовах', () => {
  const missing = [];
  for (const key of usedKeys()) {
    for (const lang of LANGS) if (I18N[lang][key] === undefined) missing.push(`${lang}:${key}`);
  }
  assert.deepEqual(missing, []);
});

test('шаблони мають однакові плейсхолдери в усіх мовах', () => {
  const bad = [];
  for (const key of Object.keys(I18N.uk)) {
    const ph = s => [...String(s).matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort().join(',');
    const ref = ph(I18N.uk[key]);
    for (const lang of LANGS) if (I18N[lang][key] !== undefined && ph(I18N[lang][key]) !== ref) bad.push(`${lang}:${key}`);
  }
  assert.deepEqual(bad, []);
});

test('стартові бази, походження й складності мають тексти всіма мовами', () => {
  const lists = [get('STARTING_BASES'), get('OWNER_BACKGROUNDS'), Object.values(get('DIFFICULTIES')), get('ACHIEVEMENTS')];
  for (const list of lists) {
    for (const item of list) {
      for (const lang of LANGS) {
        assert.ok(item.title[lang], `title ${lang}`);
        assert.ok(item.desc[lang], `desc ${lang}`);
      }
    }
  }
});

test('кроки туторіалу збігаються з розкладкою', () => {
  assert.equal(get('TUTORIAL_I18N').length, get('TUTORIAL_LAYOUT').length);
});

test('кожна модель каталогу має категорію водія з відомого переліку', () => {
  const quals = ['van', 'truck', 'train', 'plane'];
  for (const m of get('VEHICLE_CATALOG')) assert.ok(quals.includes(m.requiredCategory), m.typeId);
});

test('стартові бази — реальні міста мапи', () => {
  const CITIES = get('CITIES');
  for (const b of get('STARTING_BASES')) assert.ok(CITIES[b.cityId], b.cityId);
});
