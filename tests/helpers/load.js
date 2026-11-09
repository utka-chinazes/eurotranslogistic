// Завантажує ігрові скрипти у vm-контекст так само, як браузер (спільна глобальна область),
// щоб тестувати чисту логіку без DOM.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..', '..');

const DEFAULT_FILES = [
  'js/data/world.js',
  'js/data/catalog.js',
  'js/data/progression.js',
  'js/data/i18n.js',
  'js/data/i18n-v4.js',
  'js/core/state.js',
  'js/systems/routing.js',
  'js/systems/economy.js',
  'js/systems/persistence.js'
];

// Мінімальний localStorage у пам'яті
function memoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: k => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: k => data.delete(k),
    clear: () => data.clear(),
    _data: data
  };
}

function loadGame({ files = DEFAULT_FILES, storage = memoryStorage() } = {}) {
  // economy.js підмішує методи в клас гри — даємо порожню заглушку
  const context = vm.createContext({ console, localStorage: storage, EuroLogisticsGame: class {} });
  context.globalThis = context;
  for (const file of files) {
    const code = fs.readFileSync(path.join(ROOT, file), 'utf8');
    vm.runInContext(code, context, { filename: file });
  }
  const get = expr => vm.runInContext(expr, context);
  return { context, get, storage };
}

module.exports = { loadGame, memoryStorage, ROOT };
