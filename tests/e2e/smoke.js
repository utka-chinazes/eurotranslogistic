// Наскрізний тест у справжньому Chrome: титулка → майстер → гра → механіки →
// перезавантаження зі збереженням → банкрутство → архів.
// Запуск: npm i -D puppeteer-core && npm run test:e2e
// Шлях до браузера: змінна CHROME_PATH (інакше шукаємо стандартні шляхи Chrome/Edge).
// SCREENSHOTS=docs/screenshots — зберегти скріншоти для README.
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const assert = require('node:assert/strict');
const puppeteer = require('puppeteer-core');

const ROOT = path.resolve(__dirname, '..', '..');
const URL = 'file:///' + path.join(ROOT, 'index.html').replace(/\\/g, '/');
const SHOTS = process.env.SCREENSHOTS ? path.resolve(ROOT, process.env.SCREENSHOTS) : null;
const wait = ms => new Promise(r => setTimeout(r, ms));

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium'
  ].filter(Boolean);
  const found = candidates.find(p => fs.existsSync(p));
  if (!found) throw new Error('Chrome не знайдено — вкажіть CHROME_PATH');
  return found;
}

(async () => {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'eurotrans-e2e-'));
  const browser = await puppeteer.launch({ executablePath: findChrome(), headless: 'new', args: [`--user-data-dir=${profile}`] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('dialog', d => d.accept());
  const shot = async name => {
    if (!SHOTS) return;
    fs.mkdirSync(SHOTS, { recursive: true });
    await page.screenshot({ path: path.join(SHOTS, `${name}.png`) });
  };
  const state = () => page.evaluate(() => JSON.parse(JSON.stringify(window.game.state)));
  const step = (name) => console.log(`✓ ${name}`);

  try {
    await page.goto(URL);
    await wait(800);
    assert.equal(await page.evaluate(() => window.game.screen), 'title');
    await shot('title');
    step('титульний екран');

    // Майстер: валідація, 4 кроки
    await page.click('#btnNewCompany');
    await wait(300);
    await page.click('#btnWizNext');
    assert.equal(await page.evaluate(() => window.game.setupDraft.step), 0, 'порожнє ім\'я не пропускається');
    await page.type('#setupOwnerName', 'Олена Ковальчук');
    await page.click('[data-background="engineer"]');
    await page.click('#btnWizNext');
    await wait(200);
    await page.click('#setupCompanyName', { clickCount: 3 });
    await page.type('#setupCompanyName', 'Danube Freight');
    await page.click('[data-color="#36c9f5"]');
    await page.click('#btnWizNext');
    await wait(200);
    await page.click('[data-base="milan"]');
    await wait(300);
    await shot('wizard');
    await page.click('#btnWizNext');
    await page.click('[data-difficulty="hard"]');
    await page.click('#btnWizNext');
    await wait(900);
    let s = await state();
    assert.equal(s.companyName, 'Danube Freight');
    assert.equal(s.homeBase, 'milan');
    assert.equal(s.ownerBackground, 'engineer');
    assert.equal(s.difficulty, 'hard');
    assert.ok(await page.evaluate(() => window.game.isTutorialOpen()), 'туторіал стартує');
    step('майстер заснування');

    await page.click('#btnTutNext');
    await page.click('#btnTutNext');
    await wait(500);
    await shot('tutorial');
    await page.click('#btnSkipTutorial');
    step('туторіал');

    // Призначення через інтерфейс
    await page.evaluate(() => window.game.setSpeed(0));
    const assigned = await page.evaluate(() => {
      const g = window.game;
      const c = g.state.contracts.find(x => g.getBestVehicleFor(x));
      if (!c) return false;
      g.openAssignModal(c.id);
      return true;
    });
    if (assigned) {
      await wait(200);
      await page.click('#modalVehiclesList [data-action="assign"]');
      s = await state();
      assert.ok(s.fleet.some(v => v.status !== 'idle'), 'ТЗ поїхав у рейс');
      step('призначення рейсу');
    }

    // Механіки: кредит, купівля, сервіс, продаж
    const mech = await page.evaluate(() => {
      const g = window.game;
      g.takeLoan();
      const loan = g.state.loan;
      g.buyVehicle('van_eco');
      const v = g.state.fleet[g.state.fleet.length - 1];
      v.condition = 30;
      g.serviceVehicle(v.id);
      const cond = v.condition;
      g.sellVehicle(v.id);
      g.repayLoan();
      return { loan, cond, fleet: g.state.fleet.length, loanAfter: g.state.loan };
    });
    assert.equal(mech.loan, 10000);
    assert.equal(mech.cond, 100);
    assert.equal(mech.fleet, 1);
    assert.equal(mech.loanAfter, 0);
    step('кредит, купівля, сервіс, продаж');

    // Кілька ігрових днів
    await page.evaluate(() => { const g = window.game; g.setSpeed(4); for (let i = 0; i < 2500; i++) g.update(0.1); g.uiTick(); });
    s = await state();
    assert.ok(s.day >= 5, 'час іде');
    assert.ok(s.history.length >= 4, 'щоденні звіти пишуться');
    await page.evaluate(() => window.game.setSpeed(0));
    for (const tab of ['contracts', 'fleet', 'shop', 'finance']) {
      await page.click(`.rail-btn[data-tab="${tab}"]`);
      await wait(250);
      await shot(`tab-${tab}`);
    }
    step('симуляція днів і вкладки');

    await page.keyboard.press('Escape');
    await wait(300);
    await shot('profile');
    await page.click('.tab[data-ptab="stats"]');
    await wait(200);
    await shot('stats');
    await page.click('#btnResumeGame');
    step('меню паузи');

    // Перезавантаження: компанія відновлюється
    const before = await state();
    await page.reload();
    await wait(800);
    await shot('title-continue');
    await page.click('#btnContinue');
    await wait(500);
    const after = await state();
    assert.equal(after.companyName, before.companyName);
    assert.equal(after.day, before.day);
    assert.equal(Math.round(after.money), Math.round(before.money));
    assert.equal(after.fleet.length, before.fleet.length);
    step('збереження після перезавантаження');

    // Банкрутство → нова компанія → архів
    await page.evaluate(() => { const g = window.game; g.state.money = -50000; g.state.debtDays = 10; g.endOfDay(); });
    assert.ok(await page.evaluate(() => window.game.state.bankrupt));
    await page.click('#btnBankruptNew');
    await wait(200);
    await page.type('#setupOwnerName', 'Олена');
    for (let i = 0; i < 4; i++) { await page.click('#btnWizNext'); await wait(120); }
    await wait(400);
    const archive = await page.evaluate(() => SaveStore.loadArchive());
    assert.equal(archive[0].company, 'Danube Freight');
    assert.equal(archive[0].reason, 'bankrupt');
    step('банкрутство й архів');

    assert.deepEqual(errors, [], 'помилок у консолі немає');
    console.log('\nE2E OK');
  } catch (e) {
    console.error('\nE2E FAILED:', e.message);
    if (errors.length) console.error('Console errors:', errors);
    process.exitCode = 1;
  } finally {
    await browser.close();
    fs.rmSync(profile, { recursive: true, force: true });
  }
})();
