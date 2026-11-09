// =============================================================================
// Панелі інтерфейсу.
//  • Кнопки мають data-action — обробка делегована в events.js.
//  • Списки перебудовуються лише коли панель «брудна» і видима.
//  • Таймери, прогрес і HUD оновлюються точково (без innerHTML) у uiTick.
// =============================================================================

const PANEL_RENDERERS = {
  contracts: 'renderContractsUI',
  fleet: 'renderFleetUI',
  shop: 'renderShopUI',
  garages: 'renderGaragesUI',
  drivers: 'renderDriversUI',
  upgrades: 'renderUpgradesUI',
  finance: 'renderFinanceUI'
};

const STATUS_KEYS = {
  idle: 'status_idle',
  moving_to_pickup: 'status_moving_to_pickup',
  loading: 'status_loading',
  in_transit: 'status_in_transit',
  unloading: 'status_unloading',
  relocating: 'status_relocating',
  broken: 'status_broken'
};

Object.assign(EuroLogisticsGame.prototype, {
  // ---- Інфраструктура рендеру --------------------------------------------
  renderUI() {
    this.markDirty(...Object.keys(PANEL_RENDERERS), 'routes', 'hud');
    this.updateBrand();
    this.updateMapCityIndicator();
    this.updateTickerText();
    this.renderDirty(true);
    this.updateHUD();
  },

  // force — рендерити навіть невидимі панелі
  renderDirty(force = false) {
    if (this.dirty.has('routes')) {
      this.renderActiveRoutesBar();
      this.dirty.delete('routes');
    }
    if (this.dirty.has('hud')) {
      this.updateBadges();
      this.dirty.delete('hud');
    }
    Object.entries(PANEL_RENDERERS).forEach(([panel, fn]) => {
      if (!this.dirty.has(panel)) return;
      if (!force && panel !== this.activeTab) return;
      this[fn]();
      this.dirty.delete(panel);
    });
  },

  switchTab(tab) {
    if (!PANEL_RENDERERS[tab]) tab = 'contracts';
    this.activeTab = tab;
    document.querySelectorAll('.rail-btn[data-tab]').forEach(b => b.classList.toggle('active', b.getAttribute('data-tab') === tab));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === `tab-${tab}`));
    this[PANEL_RENDERERS[tab]]();
    this.dirty.delete(tab);
    this.saveSettings({ lastTab: tab });
  },

  // Пише текст лише якщо він змінився (менше перерахунків стилів)
  setText(id, text) {
    const el = document.getElementById(id);
    if (el && el.textContent !== text) el.textContent = text;
    return el;
  },

  updateBrand() {
    const s = this.state;
    this.setText('brandCompanyName', s.companyName);
    this.setText('btnProfileAvatar', s.ownerAvatar);
    const mark = document.getElementById('brandMark');
    if (mark) {
      mark.textContent = this.monogram(s.companyName);
      mark.style.setProperty('--brand', s.brandColor);
    }
    document.documentElement.style.setProperty('--brand', s.brandColor);
    document.title = `${s.companyName} — EuroTrans Logistics`;
  },

  monogram(name) {
    const words = String(name || 'ET').trim().split(/\s+/).filter(Boolean);
    const letters = words.length > 1 ? words[0][0] + words[1][0] : (words[0] || 'ET').slice(0, 2);
    return letters.toUpperCase();
  },

  updateHUD() {
    const s = this.state;
    const moneyEl = this.setText('hudMoney', this.fmtMoney(s.money));
    moneyEl?.classList.toggle('neg', s.money < 0);
    const todayNet = s.today.income - s.today.expense;
    const todayEl = this.setText('hudToday', `${todayNet >= 0 ? '+' : '−'}€${Math.abs(Math.round(todayNet)).toLocaleString()} ${this.t('hud_today')}`);
    if (todayEl) todayEl.className = `hud-sub mono ${todayNet >= 0 ? 'pos' : 'neg'}`;

    this.setText('hudRep', `${Math.round(s.reputation)}%`);
    const repBar = document.getElementById('hudRepBar');
    if (repBar) repBar.style.width = `${s.reputation}%`;

    const active = s.fleet.filter(v => v.status !== 'idle').length;
    this.setText('hudFleet', `${active}/${s.fleet.length}`);
    this.setText('hudFleetSub', `${this.t('hud_slots')} ${s.fleet.length}/${this.getTotalGarageSlots()}`);
    this.setText('hudDeliveries', String(s.deliveriesCount));
    this.setText('hudStreak', s.stats.streak > 0 ? `🔥 ${s.stats.streak} · +${Math.round(this.getStreakBonus() * 100)}%` : '');
    this.setText('hudValue', this.fmtMoney(this.getCompanyValue()));
    this.setText('hudLoan', s.loan > 0 ? `${this.t('finance_loan')}: ${this.fmtMoney(s.loan)}` : '');

    this.setText('hudDay', `${this.t('day_prefix')} ${s.day}`);
    this.setText('hudTime', `${String(s.hour).padStart(2, '0')}:${String(Math.floor(s.minute)).padStart(2, '0')}`);
    this.setText('companyTier', this.t(this.getCompanyTierKey()));
  },

  updateBadges() {
    const s = this.state;
    const setBadge = (id, val) => {
      const el = this.setText(id, val ? String(val) : '');
      el?.classList.toggle('hidden', !val);
    };
    setBadge('badgeContracts', s.contracts.length);
    setBadge('badgeFleet', s.fleet.filter(v => v.condition < WEAR.slowBelow).length);
    setBadge('badgeDrivers', s.fleet.filter(v => !v.assignedDriverId).length);
    setBadge('badgeFinance', s.money < 0 ? '!' : '');
  },

  // Точкові оновлення: таймери замовлень, прогрес рейсів, стан техніки
  updateLiveCounters() {
    this.updateBadges();
    const byId = {};
    this.state.contracts.forEach(c => { byId[c.id] = c; });

    if (this.activeTab === 'contracts') {
      document.querySelectorAll('#contractsList [data-contract-id]').forEach(card => {
        const c = byId[card.getAttribute('data-contract-id')];
        if (!c) return;
        const left = Math.max(0, Math.round(c.timeLeft));
        const dl = card.querySelector('.deadline');
        if (dl) {
          const txt = `⏱ ${left}s`;
          if (dl.textContent !== txt) dl.textContent = txt;
          dl.classList.toggle('warn', left < 15);
        }
        const bar = card.querySelector('.deadline-bar i');
        if (bar) bar.style.width = `${Math.max(0, Math.min(100, (c.timeLeft / c.deadline) * 100))}%`;
      });
    }

    const vehicles = {};
    this.state.fleet.forEach(v => { vehicles[v.id] = v; });
    document.querySelectorAll('[data-vprogress]').forEach(el => {
      const v = vehicles[el.getAttribute('data-vprogress')];
      if (v) el.style.width = `${this.vehicleProgress(v)}%`;
    });
    document.querySelectorAll('[data-vcond]').forEach(el => {
      const v = vehicles[el.getAttribute('data-vcond')];
      if (!v) return;
      const txt = `${Math.round(v.condition)}%`;
      if (el.textContent !== txt) el.textContent = txt;
    });
    document.querySelectorAll('[data-vcondbar]').forEach(el => {
      const v = vehicles[el.getAttribute('data-vcondbar')];
      if (v) el.style.width = `${v.condition}%`;
    });

    // Сигнатура активних рейсів змінилась — перебудувати смужку
    const sig = this.state.fleet.map(v => v.id + v.status).join('|');
    if (sig !== this._routesSig) this.renderActiveRoutesBar();
  },

  vehicleProgress(v) {
    if (v.status === 'loading' || v.status === 'unloading') return 100;
    if (!v.path || v.path.length < 2) return 0;
    return Math.round(((v.currentLeg + v.legProgress) / (v.path.length - 1)) * 100);
  },

  updateCompanyTier() {
    this.setText('companyTier', this.t(this.getCompanyTierKey()));
  },

  emptyState(icon, text) {
    return `<div class="empty"><div class="empty-icon">${icon}</div><p>${text}</p></div>`;
  },

  // ---- Замовлення ---------------------------------------------------------
  renderContractsUI() {
    const list = document.getElementById('contractsList');
    if (!list) return;

    let items = this.state.contracts.map(c => ({ c, best: this.getBestVehicleFor(c) }));
    if (this.state.selectedCity) items = items.filter(({ c }) => c.origin === this.state.selectedCity);
    const f = this.state.activeFilter;
    if (f === 'express') items = items.filter(({ c }) => c.isUrgent);
    else if (f === 'heavy') items = items.filter(({ c }) => c.isHeavy);
    else if (f === 'doable') items = items.filter(({ best }) => best && best.est.onTime);

    // Спершу вигідні та виконувані
    items.sort((a, b) => (b.best ? b.best.est.profit + (b.best.est.onTime ? 1e6 : 0) : -1e9) - (a.best ? a.best.est.profit + (a.best.est.onTime ? 1e6 : 0) : -1e9));

    if (!items.length) {
      list.innerHTML = this.emptyState('🗂️', this.t('empty_contracts_v4'));
      return;
    }

    list.innerHTML = items.map(({ c, best }) => {
      const cargoName = this.getCargoName(this.getCargoType(c), c.cargoName);
      let fit = `<span class="tag muted">⛔ ${this.t('contract_no_vehicle')}</span>`;
      if (best) {
        const cls = best.est.onTime ? (best.est.profit > 0 ? 'good' : 'warn') : 'bad';
        fit = `<span class="tag ${cls}" title="${best.vehicle.name}">${best.vehicle.icon} ${best.est.onTime ? '✓' : '⚠'} ${this.fmtMoney(best.est.profit)}</span>`;
      }
      const left = Math.max(0, Math.round(c.timeLeft));
      return `
        <article class="card contract-card ${c.isUrgent ? 'urgent' : ''} ${c.isVip ? 'vip' : ''}" data-contract-id="${c.id}">
          <div class="cc-top">
            <div class="cc-route">${this.getCityName(c.origin)} <span class="arrow">→</span> ${this.getCityName(c.destination)}</div>
            <div class="cc-reward mono">${this.fmtMoney(c.reward)}</div>
          </div>
          <div class="cc-meta">
            <span>${c.isVip ? '🎖️ ' : ''}${c.cargoIcon} ${cargoName}</span>
            <span class="mono">${c.weight} ${this.t('tons_short')}</span>
            <span class="mono">${c.distance} km</span>
          </div>
          <div class="cc-foot">
            ${fit}
            <span class="deadline mono ${left < 15 ? 'warn' : ''}">⏱ ${left}s</span>
            <button class="btn btn-sm btn-outline" data-action="accept" data-id="${c.id}">${this.t('contract_btn_accept')}</button>
          </div>
          <div class="deadline-bar"><i style="width:${Math.max(0, Math.min(100, (c.timeLeft / c.deadline) * 100))}%"></i></div>
        </article>`;
    }).join('');
  },

  // ---- Автопарк -----------------------------------------------------------
  renderFleetUI() {
    const list = document.getElementById('fleetList');
    if (!list) return;
    const bases = Object.keys(this.state.garages);

    list.innerHTML = this.state.fleet.map(v => {
      const driver = this.state.drivers.find(d => d.id === v.assignedDriverId);
      const c = v.currentContract;
      let where = `📍 ${this.getCityName(v.location)}`;
      if (v.status === 'moving_to_pickup' && c) where = `➜ ${this.getCityName(c.origin)}`;
      else if ((v.status === 'in_transit' || v.status === 'broken') && c) where = `${this.getCityName(c.origin)} → ${this.getCityName(c.destination)}`;
      else if (v.status === 'relocating') where = `➜ ${this.getCityName(v.path[v.path.length - 1])}`;

      const cond = Math.round(v.condition ?? 100);
      const condCls = cond < WEAR.breakdownBelow ? 'bad' : (cond < WEAR.slowBelow ? 'warn' : 'good');
      const atBase = !!this.state.garages[v.location];
      const serviceCost = Economy.serviceCost(v, this.state.ownerPerk.serviceMod || 0, atBase);

      let actions = '';
      if (v.status === 'idle') {
        const relocateOpts = bases.filter(b => b !== v.location)
          .map(b => `<option value="${b}">${this.getCityName(b)}</option>`).join('');
        actions = `
          <div class="vc-actions">
            ${cond < 100 ? `<button class="btn btn-sm" data-action="service" data-id="${v.id}" title="${atBase ? '' : this.t('service_roadside_hint')}">🔧 ${this.t('btn_service')} ${this.fmtMoney(serviceCost)}</button>` : ''}
            ${relocateOpts ? `<select class="select-sm" data-action="relocate" data-id="${v.id}"><option value="">🚚 ${this.t('btn_relocate')}…</option>${relocateOpts}</select>` : ''}
            <button class="btn btn-sm btn-ghost danger-text" data-action="sell" data-id="${v.id}">💰 ${this.t('btn_sell')} ${this.fmtMoney(Economy.resaleValue(v))}</button>
          </div>`;
      }

      return `
        <article class="card vehicle-card status-${v.status}">
          <div class="vc-head">
            <span class="vc-icon">${v.icon}</span>
            <div class="vc-title">
              <div class="vc-name">${v.name}</div>
              <div class="vc-sub">${this.getVehicleCategory(v)} · ${v.capacity} ${this.t('tons_short')} · ${v.speed} km/h</div>
            </div>
            <span class="status-pill s-${v.status}">${this.plain(STATUS_KEYS[v.status] || 'status_idle')}</span>
          </div>
          <div class="vc-row"><span>${where}</span>
            ${v.status !== 'idle' ? `<span class="progress"><i data-vprogress="${v.id}" style="width:${this.vehicleProgress(v)}%"></i></span>` : ''}
          </div>
          <div class="vc-row">
            <span class="muted">${this.t('vehicle_condition')}</span>
            <span class="meter ${condCls}"><span class="meter-fill" data-vcondbar="${v.id}" style="width:${cond}%"></span></span>
            <span class="mono" data-vcond="${v.id}">${cond}%</span>
          </div>
          <div class="vc-row driver-line ${driver ? '' : 'missing'}">
            ${driver ? `${driver.avatar} ${this.getDriverName(driver.name)} · ${this.t('garage_level_label')} ${driver.level}` : `⚠️ ${this.t('driver_not_assigned')}`}
          </div>
          ${actions}
        </article>`;
    }).join('') || this.emptyState('🚚', this.t('fleet_empty'));
  },

  // ---- Автосалон ----------------------------------------------------------
  renderShopUI() {
    const list = document.getElementById('shopList');
    if (!list) return;
    const totalSlots = this.getTotalGarageSlots();
    const hasSpace = this.state.fleet.length < totalSlots;
    this.setText('shopSlotsHint', `${this.t('garages_slots_label')} ${this.state.fleet.length}/${totalSlots} · ${this.t('shop_spawn_hint')}`);
    const net = this.shopFilter || 'all';

    list.innerHTML = VEHICLE_CATALOG.filter(m => net === 'all' || m.network === net).map(model => {
      const canAfford = this.canAfford(model.price);
      let btnText = this.plain('btn_buy_vehicle');
      if (!hasSpace) btnText = this.t('btn_no_garage_slots');
      else if (!canAfford) btnText = this.t('btn_not_enough_funds');
      const netName = this.plain(model.network === 'air' ? 'net_air' : (model.network === 'rail' ? 'net_rail' : 'net_road'));
      const qualified = this.state.drivers.some(d => Economy.driverCanOperate(d, model));

      return `
        <article class="card shop-card net-${model.network}">
          <div class="vc-head">
            <span class="vc-icon">${model.icon}</span>
            <div class="vc-title">
              <div class="vc-name">${model.name}</div>
              <div class="vc-sub">${this.getVehicleCategory(model.typeId, model.category)} · ${netName}</div>
            </div>
            <div class="price mono">${this.fmtMoney(model.price)}</div>
          </div>
          <div class="specs">
            <div><span>${this.t('spec_capacity_short')}</span><b>${model.capacity} ${this.t('tons_short')}</b></div>
            <div><span>${this.t('spec_speed_short')}</span><b>${model.speed} km/h</b></div>
            <div><span>${this.t('spec_fuel_short')}</span><b>€${model.fuelPerKm}/km</b></div>
            <div><span>${this.t('spec_cost_per_t')}</span><b>€${(model.fuelPerKm / model.capacity * 100).toFixed(1)}</b></div>
          </div>
          <p class="card-desc">${this.getVehicleDesc(model.typeId, model.desc)}</p>
          ${!qualified ? `<p class="card-note warn">⚠️ ${this.tTemplate('shop_need_driver', { q: this.getQualificationName(model.requiredCategory) })}</p>` : ''}
          <button class="btn btn-block ${hasSpace && canAfford ? 'btn-outline' : ''}" data-action="buy-vehicle" data-id="${model.typeId}" ${hasSpace && canAfford ? '' : 'disabled'}>${btnText}</button>
        </article>`;
    }).join('');
  },

  // ---- Бази ---------------------------------------------------------------
  renderGaragesUI() {
    const summaryEl = document.getElementById('garagesSummary');
    const listEl = document.getElementById('garagesList');
    if (!summaryEl || !listEl) return;
    const s = this.state;
    const totalSlots = this.getTotalGarageSlots();
    const used = s.fleet.length;

    summaryEl.innerHTML = `
      <div class="summary-strip">
        <div><span>${this.t('garages_slots_label')}</span><b class="mono">${used}/${totalSlots}</b></div>
        <div><span>${this.t('garages_owned_count')}</span><b class="mono">${Object.keys(s.garages).length}</b></div>
        <div><span>${this.t('garage_upkeep_label')}</span><b class="mono neg">−${this.fmtMoney(Economy.dailyUpkeep(s))}/${this.t('day_unit')}</b></div>
      </div>
      <div class="progress big"><i style="width:${Math.min(100, Math.round(used / Math.max(1, totalSlots) * 100))}%"></i></div>`;

    let html = `<h3 class="section-label">${this.t('garages_owned_section')}</h3>`;
    Object.values(s.garages).forEach(g => {
      const tierName = (typeof GARAGE_TIERS_I18N !== 'undefined' && GARAGE_TIERS_I18N[g.level]?.name[s.lang]) || GARAGE_TIERS[g.level].name;
      const perkDesc = (typeof GARAGE_TIERS_I18N !== 'undefined' && GARAGE_TIERS_I18N[g.level]?.perkDesc[s.lang]) || GARAGE_TIERS[g.level].perkDesc;
      const parked = s.fleet.filter(v => v.location === g.cityId && v.status === 'idle').length;
      const upgradeCost = GARAGE_TIERS[g.level].upgradeCost;
      const isHq = g.cityId === s.homeBase;
      html += `
        <article class="card garage-card ${isHq ? 'hq' : ''}">
          <div class="vc-head">
            <span class="vc-icon">${isHq ? '◆' : '🏠'}</span>
            <div class="vc-title">
              <div class="vc-name">${this.getCityName(g.cityId)} ${isHq ? `<span class="pill brand">HQ</span>` : ''}</div>
              <div class="vc-sub">${this.t('garage_level_label')} ${g.level} · ${tierName}</div>
            </div>
            <div class="mono">${g.slots} ${this.t('vehicles_unit')}</div>
          </div>
          <p class="card-desc">✨ ${perkDesc}</p>
          <div class="vc-row muted"><span>🚚 ${this.t('garage_parked_here')} ${parked}</span><span>🧾 −${this.fmtMoney(Math.round((GARAGE_UPKEEP[g.level] || 0) * s.diff.upkeep))}/${this.t('day_unit')}</span></div>
          ${g.level < 3
            ? `<button class="btn btn-block" data-action="upgrade-garage" data-id="${g.cityId}" ${this.canAfford(upgradeCost) ? '' : 'disabled'}>🏗️ ${this.t('garage_level_label')} ${g.level + 1} · ${this.fmtMoney(upgradeCost)}</button>`
            : `<div class="tag good">${this.plain('garage_max_badge')}</div>`}
        </article>`;
    });

    // Кандидати на нову базу — від найближчих до штабу
    const tier1 = GARAGE_TIERS[1];
    const canAfford = this.canAfford(tier1.cost);
    const candidates = Object.keys(CITIES).filter(id => !s.garages[id])
      .sort((a, b) => this.cityDistance(s.homeBase, a) - this.cityDistance(s.homeBase, b));
    html += `<h3 class="section-label">${this.t('garages_open_new')} · ${this.fmtMoney(tier1.cost)}</h3><div class="city-grid">`;
    candidates.forEach(id => {
      const orders = s.contracts.filter(c => c.origin === id).length;
      html += `
        <button class="city-pick" data-action="buy-garage" data-id="${id}" ${canAfford ? '' : 'disabled'}>
          <b>${this.getCityName(id)}</b>
          <span class="muted">${Math.round(this.cityDistance(s.homeBase, id))} km${orders ? ` · 📦 ${orders}` : ''}</span>
        </button>`;
    });
    html += '</div>';
    listEl.innerHTML = html;
  },

  // ---- Персонал -----------------------------------------------------------
  renderDriversUI() {
    const listEl = document.getElementById('driversList');
    if (!listEl) return;
    const s = this.state;
    this.setText('countMyDrivers', String(s.drivers.length));
    this.setText('countMarketDrivers', String(s.driverMarket.length));
    document.querySelectorAll('.seg-btn[data-subtab]').forEach(b => b.classList.toggle('active', b.getAttribute('data-subtab') === s.driverSubtab));

    const perks = d => `
      <div class="specs">
        <div><span>${this.t('driver_speed_short')}</span><b>+${Math.round(d.speedBonus * 100)}%</b></div>
        <div><span>${this.t('driver_fuel_short')}</span><b>+${Math.round(d.fuelBonus * 100)}%</b></div>
        <div><span>${this.t('driver_salary_short')}</span><b>€${d.salaryPerTrip}+${DRIVER_PAY_PER_KM}/km</b></div>
        <div><span>${d.hireCost ? this.t('driver_cost_short') : 'XP'}</span><b>${d.hireCost ? this.fmtMoney(d.hireCost) : `${d.xp}/${d.xpNeeded}`}</b></div>
      </div>`;

    if (s.driverSubtab === 'market') {
      const filter = this.marketFilter || 'all_q';
      const quals = Object.keys(DRIVER_MARKET_COMPOSITION);
      const unstaffed = s.fleet.filter(v => !v.assignedDriverId);
      const chips = `
        <div class="chips">
          <button class="chip ${filter === 'all_q' ? 'active' : ''}" data-action="market-filter" data-id="all_q">${this.plain('filter_all')} · ${s.driverMarket.length}</button>
          ${quals.map(q => `<button class="chip ${filter === q ? 'active' : ''}" data-action="market-filter" data-id="${q}">${this.getQualificationName(q)} · ${s.driverMarket.filter(d => d.qualification === q).length}</button>`).join('')}
        </div>
        <p class="section-note">🔄 ${this.t('market_refresh_hint')}</p>`;
      const list = s.driverMarket.filter(c => filter === 'all_q' || c.qualification === filter);
      listEl.innerHTML = chips + (list.map(c => `
        <article class="card driver-card">
          <div class="vc-head">
            <span class="avatar">${c.avatar}</span>
            <div class="vc-title"><div class="vc-name">${this.getDriverName(c.name)}</div><div class="vc-sub">${this.getQualificationName(c.qualification)}</div></div>
            <span class="pill">${this.t('garage_level_label')} ${c.level}</span>
          </div>
          ${unstaffed.some(v => Economy.driverCanOperate(c, v)) ? `<span class="tag good">✓ ${this.t('market_fits_vehicle')}</span>` : ''}
          ${perks(c)}
          <button class="btn btn-block btn-outline" data-action="hire" data-id="${c.id}" ${this.canAfford(c.hireCost) ? '' : 'disabled'}>${this.plain('driver_btn_hire')} · ${this.fmtMoney(c.hireCost)}</button>
        </article>`).join('') || this.emptyState('🧑‍💼', this.t('driver_empty_market')));
      return;
    }

    listEl.innerHTML = s.drivers.map(d => {
      const xpPct = Math.min(100, Math.round(d.xp / Math.max(1, d.xpNeeded) * 100));
      const options = s.fleet.filter(v => Economy.driverCanOperate(d, v)).map(v =>
        `<option value="${v.id}" ${v.id === d.assignedVehicleId ? 'selected' : ''}>${v.icon} ${v.name}${v.assignedDriverId && v.assignedDriverId !== d.id ? ' •' : ''}</option>`).join('');
      return `
        <article class="card driver-card">
          <div class="vc-head">
            <span class="avatar">${d.avatar}</span>
            <div class="vc-title"><div class="vc-name">${this.getDriverName(d.name)}</div><div class="vc-sub">${this.getQualificationName(d.qualification)}</div></div>
            <span class="pill">${this.t('garage_level_label')} ${d.level}</span>
          </div>
          ${perks({ ...d, hireCost: 0 })}
          <div class="progress"><i style="width:${xpPct}%"></i></div>
          <div class="vc-actions">
            <select class="select-sm grow" data-action="assign-driver" data-id="${d.id}">
              <option value="">${this.t('driver_unassigned_opt')}</option>${options}
            </select>
            <button class="btn btn-sm btn-ghost danger-text" data-action="fire" data-id="${d.id}">${this.t('driver_btn_fire')}</button>
          </div>
        </article>`;
    }).join('') || this.emptyState('🧑‍✈️', this.t('driver_empty_my'));
  },

  // ---- Технології ---------------------------------------------------------
  renderUpgradesUI() {
    const s = this.state;
    const upgradesEl = document.getElementById('upgradesList');
    if (upgradesEl) {
      upgradesEl.innerHTML = UPGRADES_CONFIG.map(upg => {
        const lvl = s.upgrades[upg.id] || 0;
        const isMax = lvl >= upg.maxLevel;
        const cost = upg.cost * (lvl + 1);
        const data = typeof UPGRADES_I18N !== 'undefined' ? UPGRADES_I18N[upg.id] : null;
        const pips = Array.from({ length: upg.maxLevel }, (_, i) => `<i class="${i < lvl ? 'on' : ''}"></i>`).join('');
        return `
          <article class="card upgrade-card">
            <div class="vc-head">
              <span class="vc-icon">${upg.icon}</span>
              <div class="vc-title"><div class="vc-name">${data ? this.L(data.title) : upg.title}</div><div class="pips">${pips}</div></div>
              ${isMax ? `<span class="tag good">${this.t('upgrade_max_label')}</span>`
                : `<button class="btn btn-sm btn-outline" data-action="upgrade" data-id="${upg.id}" ${this.canAfford(cost) ? '' : 'disabled'}>${this.fmtMoney(cost)}</button>`}
            </div>
            <p class="card-desc">${data ? this.L(data.desc) : upg.desc}</p>
          </article>`;
      }).join('');
    }

    const tradeoffsEl = document.getElementById('tradeoffsList');
    if (tradeoffsEl) {
      tradeoffsEl.innerHTML = TRADEOFFS_CONFIG.map(t => {
        const unlocked = !!s.unlockedTradeoffs[t.id];
        const active = !!s.activeTradeoffs[t.id];
        const data = typeof TRADEOFFS_I18N !== 'undefined' ? TRADEOFFS_I18N[t.id] : null;
        const btn = !unlocked
          ? `<button class="btn btn-sm" data-action="tradeoff" data-id="${t.id}" ${this.canAfford(t.price) ? '' : 'disabled'}>${this.fmtMoney(t.price)}</button>`
          : `<button class="toggle-btn ${active ? 'on' : ''}" data-action="tradeoff" data-id="${t.id}" aria-pressed="${active}"><i></i></button>`;
        return `
          <article class="card tradeoff-card ${active ? 'active' : ''}">
            <div class="vc-head">
              <span class="vc-icon">${t.icon}</span>
              <div class="vc-title"><div class="vc-name">${data ? this.L(data.title) : t.title}</div></div>
              ${btn}
            </div>
            <div class="effects">
              <span class="tag good">▲ ${data ? this.L(data.pro) : t.pro}</span>
              <span class="tag bad">▼ ${data ? this.L(data.con) : t.con}</span>
            </div>
          </article>`;
      }).join('');
    }
  },

  // ---- Фінанси ------------------------------------------------------------
  renderFinanceUI() {
    const el = document.getElementById('financeBody');
    if (!el) return;
    const s = this.state;
    const limit = this.getCreditLimit();
    const rate = Economy.loanRate(s);
    const upkeep = Economy.dailyUpkeep(s);
    const interest = Economy.dailyInterest(s);
    const fee = this.getTradeoffModifiers().dailyFee || 0;
    const fixed = upkeep + interest + fee;
    let fleetValue = 0;
    s.fleet.forEach(v => { fleetValue += Economy.resaleValue(v); });
    const daysLeft = s.diff.bankruptDays - s.debtDays;

    const last = s.history.slice(-7);
    const max = Math.max(1, ...last.map(d => Math.max(d.income, d.expense)));

    el.innerHTML = `
      ${s.money < 0 ? `<div class="alert danger">⚠️ ${this.tTemplate('finance_debt_alert', { days: Math.max(0, daysLeft) })}</div>` : ''}
      <article class="card">
        <div class="kv"><span>${this.t('stat_capital')}</span><b class="mono ${s.money < 0 ? 'neg' : 'pos'}">${this.fmtMoney(s.money)}</b></div>
        <div class="kv"><span>${this.t('finance_loan')}</span><b class="mono">${this.fmtMoney(s.loan)} / ${this.fmtMoney(limit)}</b></div>
        <div class="progress"><i style="width:${limit ? Math.min(100, s.loan / limit * 100) : 0}%"></i></div>
        <div class="kv muted"><span>${this.t('finance_rate')}</span><span class="mono">${(rate * 100).toFixed(1)}% / ${this.t('day_unit')}</span></div>
        <div class="btn-row">
          <button class="btn btn-primary grow" data-action="loan-take" ${s.loan + FINANCE.loanStep > limit ? 'disabled' : ''}>＋ ${this.fmtMoney(FINANCE.loanStep)}</button>
          <button class="btn grow" data-action="loan-repay" ${s.loan <= 0 || !this.canAfford(Math.min(s.loan, FINANCE.loanStep)) ? 'disabled' : ''}>− ${this.fmtMoney(Math.min(s.loan || FINANCE.loanStep, FINANCE.loanStep))}</button>
        </div>
      </article>

      <h3 class="section-label">${this.t('finance_daily_costs')}</h3>
      <article class="card">
        <div class="kv"><span>🧾 ${this.plain('expense_upkeep')}</span><b class="mono neg">−${this.fmtMoney(upkeep)}</b></div>
        ${interest ? `<div class="kv"><span>🏦 ${this.t('expense_interest')}</span><b class="mono neg">−${this.fmtMoney(interest)}</b></div>` : ''}
        ${fee ? `<div class="kv"><span>🤖 ${this.plain('expense_fees')}</span><b class="mono neg">−${this.fmtMoney(fee)}</b></div>` : ''}
        <div class="kv total"><span>${this.t('finance_fixed_total')}</span><b class="mono neg">−${this.fmtMoney(fixed)}</b></div>
      </article>

      <h3 class="section-label">${this.t('hud_company_value')}</h3>
      <article class="card">
        <div class="kv"><span>💶 ${this.t('stat_capital')}</span><b class="mono">${this.fmtMoney(s.money)}</b></div>
        <div class="kv"><span>🚚 ${this.t('finance_fleet_value')}</span><b class="mono">${this.fmtMoney(fleetValue)}</b></div>
        <div class="kv"><span>🏦 ${this.t('finance_loan')}</span><b class="mono neg">−${this.fmtMoney(s.loan)}</b></div>
        <div class="kv total"><span>${this.t('hud_company_value')}</span><b class="mono pos">${this.fmtMoney(this.getCompanyValue())}</b></div>
      </article>

      <h3 class="section-label">${this.t('finance_last_days')}</h3>
      ${last.length ? `<div class="day-chart small">${last.map(d => `
        <div class="day-col" title="${this.t('day_prefix')} ${d.day}: +${this.fmtMoney(d.income)} / −${this.fmtMoney(d.expense)}">
          <div class="day-bars"><span class="day-bar inc" style="height:${Math.round(d.income / max * 100)}%"></span><span class="day-bar exp" style="height:${Math.round(d.expense / max * 100)}%"></span></div>
          <span class="day-num">${d.day}</span>
        </div>`).join('')}</div>` : `<p class="muted">${this.t('finance_no_history')}</p>`}`;
  },

  // ---- Смужка активних рейсів ---------------------------------------------
  renderActiveRoutesBar() {
    const container = document.getElementById('routesScrollContainer');
    if (!container) return;
    const active = this.state.fleet.filter(v => v.status !== 'idle');
    this._routesSig = this.state.fleet.map(v => v.id + v.status).join('|');
    this.setText('activeRoutesCount', String(active.length));

    if (!active.length) {
      container.innerHTML = `<span class="muted">${this.t('empty_routes_hint')}</span>`;
      return;
    }
    container.innerHTML = active.map(v => {
      const c = v.currentContract;
      let label = this.plain(STATUS_KEYS[v.status]);
      if (c && (v.status === 'in_transit' || v.status === 'moving_to_pickup' || v.status === 'broken')) {
        label = `${this.getCityName(c.origin)} → ${this.getCityName(c.destination)}`;
      } else if (v.status === 'relocating') {
        label = `➜ ${this.getCityName(v.path[v.path.length - 1])}`;
      }
      return `
        <div class="route-pill s-${v.status}">
          <span>${v.icon}</span>
          <span class="rp-text"><b>${v.name}</b><span>${label}</span></span>
          <span class="progress tiny"><i data-vprogress="${v.id}" style="width:${this.vehicleProgress(v)}%"></i></span>
        </div>`;
    }).join('');
  },

  // ---- Модалка призначення --------------------------------------------------
  openAssignModal(contractId) {
    const contract = this.state.contracts.find(c => c.id === contractId);
    if (!contract) return;
    this.currentAssignContractId = contractId;

    const cargoName = this.getCargoName(this.getCargoType(contract), contract.cargoName);
    const cargoDesc = this.getCargoDesc(this.getCargoType(contract));
    document.getElementById('modalContractBrief').innerHTML = `
      <div class="brief-route">${this.getCityName(contract.origin)} <span class="arrow">→</span> ${this.getCityName(contract.destination)}</div>
      <div class="brief-meta">
        <span>${contract.cargoIcon} ${cargoName}</span>
        <span class="mono">${contract.weight} ${this.t('tons_short')}</span>
        <span class="mono">${contract.distance} km</span>
        <span class="mono pos">${this.fmtMoney(contract.reward)}</span>
        <span class="mono">⏱ ${Math.round(contract.timeLeft)}s</span>
      </div>
      ${cargoDesc ? `<p class="card-desc">${cargoDesc}</p>` : ''}`;

    const rows = this.state.fleet.map(v => {
      const est = this.estimateTrip(v, contract);
      return { v, est, blocker: this.getAssignBlocker(v, contract, est) };
    }).sort((a, b) => {
      if (!a.blocker !== !b.blocker) return a.blocker ? 1 : -1;
      if (!a.blocker && a.est.onTime !== b.est.onTime) return a.est.onTime ? -1 : 1;
      return (b.est.profit || 0) - (a.est.profit || 0);
    });

    document.getElementById('modalVehiclesList').innerHTML = rows.map(({ v, est, blocker }, i) => {
      const forecast = est.possible && v.status === 'idle' ? `
        <div class="forecast">
          <span class="tag ${est.onTime ? 'good' : 'bad'}">${est.onTime ? '✓ ' + this.t('assign_on_time') : '⚠ ' + this.t('assign_late')} · ${this.formatEta(est.seconds)}</span>
          <span class="tag muted">⛽ −${this.fmtMoney(est.fuel)}</span>
          <span class="tag muted">👔 −${this.fmtMoney(est.salary)}</span>
          <span class="tag ${est.profit >= 0 ? 'good' : 'bad'}">= ${this.fmtMoney(est.profit)}</span>
        </div>` : '';
      return `
        <div class="vehicle-option ${blocker ? 'disabled' : ''} ${!blocker && i === 0 ? 'best' : ''}" ${blocker ? '' : `data-action="assign" data-id="${contract.id}" data-vehicle="${v.id}" tabindex="0"`}>
          <span class="vc-icon">${v.icon}</span>
          <div class="vc-title">
            <div class="vc-name">${v.name} ${blocker ? `<span class="tag bad">${blocker}</span>` : (i === 0 ? `<span class="tag brand">${this.t('assign_best')}</span>` : '')}</div>
            <div class="vc-sub">📍 ${this.getCityName(v.location)} · ${est.perf.capacity} ${this.t('tons_short')} · ${this.t('vehicle_condition')} ${Math.round(v.condition)}%</div>
            ${forecast}
          </div>
        </div>`;
    }).join('');

    document.getElementById('assignModal').classList.remove('hidden');
  },

  closeAssignModal() {
    this.currentAssignContractId = null;
    document.getElementById('assignModal')?.classList.add('hidden');
  },

  // ---- Тости ----------------------------------------------------------------
  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    while (container.children.length > 4) container.firstElementChild.remove();
    setTimeout(() => {
      toast.classList.add('leaving');
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }
});
