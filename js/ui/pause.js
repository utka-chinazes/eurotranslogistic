// =============================================================================
// Меню паузи: профіль власника, статистика за весь час, досягнення, налаштування
// =============================================================================
Object.assign(EuroLogisticsGame.prototype, {
  isPauseOpen() {
    return !document.getElementById('pauseModal')?.classList.contains('hidden');
  },

  togglePauseMenu() {
    if (this.isPauseOpen()) this.closePauseMenu();
    else this.openPauseMenu();
  },

  openPauseMenu(tab) {
    if (this.screen !== 'game' || this.state.bankrupt) return;
    if (this.isTutorialOpen()) this.closeTutorial();
    if (!this.isPauseOpen()) {
      this.prePauseSpeed = this.state.timeSpeed > 0 ? this.state.timeSpeed : (this.preFreezeSpeed || 1);
    }
    document.getElementById('pauseModal').classList.remove('hidden');
    this.setSpeed(0);

    const vol = Math.round(this.sound.volume * 100);
    document.getElementById('volumeSlider').value = vol;
    this.setText('volumePercent', `${vol}%`);
    document.getElementById('toggleSoundEffects').checked = this.sound.enabled;

    this.saveGame();
    this.setPauseTab(tab || this.profileTab || 'profile');
  },

  closePauseMenu() {
    document.getElementById('pauseModal')?.classList.add('hidden');
    this.setSpeed(this.prePauseSpeed || 1);
  },

  setPauseTab(tab) {
    this.profileTab = tab;
    document.querySelectorAll('.tab[data-ptab]').forEach(b => b.classList.toggle('active', b.getAttribute('data-ptab') === tab));
    document.querySelectorAll('.pane').forEach(p => p.classList.toggle('active', p.id === `ppane-${tab}`));
    if (tab === 'profile') this.renderProfile();
    if (tab === 'stats') this.renderStats();
    if (tab === 'achievements') this.renderAchievements();
    if (tab === 'settings') this.renderSettingsInfo();
  },

  renderSettingsInfo() {
    const peek = SaveStore.peek();
    const info = document.getElementById('saveInfo');
    if (!info) return;
    info.textContent = !SaveStore.available()
      ? this.t('save_failed')
      : `${this.t('save_info_auto')} ${peek?.savedAt ? `${this.t('title_saved_at')} ${this.formatAgo(peek.savedAt)}.` : ''}`;
  },

  renderProfile() {
    const s = this.state;
    const st = s.stats;
    const base = this.getBase();
    const bg = this.getOwnerBackground();
    const diff = s.diff;
    const delivered = st.onTime + st.late;
    const onTimePct = delivered ? Math.round(st.onTime / delivered * 100) : 100;

    const ownerInput = document.getElementById('profileOwnerInput');
    const companyInput = document.getElementById('profileCompanyInput');
    if (document.activeElement !== ownerInput) ownerInput.value = s.ownerName;
    if (document.activeElement !== companyInput) companyInput.value = s.companyName;

    document.getElementById('profileAvatars').innerHTML = OWNER_AVATARS.map(a =>
      `<button type="button" class="avatar-pick ${a === s.ownerAvatar ? 'active' : ''}" data-avatar="${a}">${a}</button>`).join('');
    document.getElementById('profileColors').innerHTML = BRAND_COLORS.map(c =>
      `<button type="button" class="swatch ${c === s.brandColor ? 'active' : ''}" data-color="${c}" style="--sw:${c}" aria-label="${c}"></button>`).join('');

    const fact = (label, value) => `<div><span>${label}</span><b>${value}</b></div>`;
    document.getElementById('profileCard').innerHTML = `
      <div class="owner-hero">
        <div class="owner-avatar">${s.ownerAvatar}</div>
        <div class="owner-meta">
          <div class="owner-name">${this.esc(s.ownerName)}</div>
          <div class="owner-company"><span class="cc-badge sm" style="--brand:${s.brandColor}">${this.esc(this.monogram(s.companyName))}</span> ${this.esc(s.companyName)}</div>
          <div class="owner-tier">${this.t(this.getCompanyTierKey())}</div>
        </div>
      </div>
      <div class="owner-facts">
        ${fact(this.t('wiz_background_label'), `${bg.icon} ${this.L(bg.title)}`)}
        ${fact(this.t('profile_base'), `◆ ${this.getCityName(s.homeBase)}`)}
        ${fact(this.t('profile_perk'), base ? `${base.icon} ${this.L(base.title)}` : '—')}
        ${fact(this.t('wiz_difficulty_label'), `${diff.icon} ${this.L(diff.title)}`)}
        ${fact(this.t('profile_days'), s.day)}
        ${fact(this.t('stat_on_time'), `${onTimePct}%`)}
        ${fact(this.t('stat_total_earned'), `<span class="pos">${this.fmtMoney(st.totalEarned)}</span>`)}
        ${fact(this.t('hud_company_value'), this.fmtMoney(this.getCompanyValue()))}
        ${fact(this.t('achievements_tab'), `🏆 ${Object.keys(s.achievements).length}/${ACHIEVEMENTS.length}`)}
      </div>
      <p class="owner-perk-desc">${this.L(bg.desc)} ${base ? this.L(base.desc) : ''}</p>`;

    const archive = SaveStore.loadArchive();
    document.getElementById('archiveBox').innerHTML = `
      <div class="box-title">${this.t('archive_title')}</div>
      ${archive.length ? archive.map(a => `
        <div class="archive-row">
          <span class="cc-badge sm" style="--brand:${this.esc(a.brandColor || '#ffa53d')}">${this.esc(this.monogram(a.company))}</span>
          <span class="grow">${this.esc(a.company)} <span class="muted">· ${this.getCityName(a.homeBase)} · ${this.t('day_prefix')} ${a.day} · ${a.deliveries} 📦</span></span>
          <span class="mono ${a.reason === 'bankrupt' ? 'neg' : ''}">${a.reason === 'bankrupt' ? '📉' : '🏁'} ${this.fmtMoney(a.value)}</span>
        </div>`).join('') : `<p class="muted">${this.t('archive_empty')}</p>`}`;
  },

  saveProfileFromForm() {
    const owner = document.getElementById('profileOwnerInput').value.trim();
    const company = document.getElementById('profileCompanyInput').value.trim();
    if (owner.length >= 2) this.state.ownerName = owner.slice(0, 32);
    if (company.length >= 2) this.state.companyName = company.slice(0, 32);
    this.updateBrand();
    this.renderProfile();
    this.saveGame();
    this.showToast(`✅ ${this.t('toast_profile_saved')}`, 'success');
  },

  renderStats() {
    const s = this.state;
    const st = s.stats;
    const totalExpenses = Object.values(st.expenses).reduce((a, b) => a + b, 0);
    const net = st.totalEarned - totalExpenses;
    const delivered = st.onTime + st.late;
    const onTimePct = delivered ? Math.round(st.onTime / delivered * 100) : 100;
    const career = this.getCareer();

    let bestRoute = '—';
    if (st.bestPayoutRoute) {
      const [a, b] = st.bestPayoutRoute.split('>');
      bestRoute = `${this.getCityName(a)} → ${this.getCityName(b)}`;
    }
    const kpi = (label, value, cls = '') => `<div class="kpi ${cls}"><span class="kpi-label">${label}</span><span class="kpi-value">${value}</span></div>`;

    document.getElementById('statsKpis').innerHTML = [
      kpi(this.t('stat_total_earned'), this.fmtMoney(st.totalEarned), 'pos'),
      kpi(this.t('stat_total_expenses'), this.fmtMoney(totalExpenses), 'neg'),
      kpi(this.t('stat_net_profit'), this.fmtMoney(net), net >= 0 ? 'pos' : 'neg'),
      kpi(this.t('stat_orders_done'), delivered.toLocaleString()),
      kpi(this.t('stat_on_time'), `${onTimePct}%`),
      kpi(this.t('stat_late'), st.late.toLocaleString()),
      kpi(this.t('stat_expired'), st.expired.toLocaleString()),
      kpi(this.t('stat_km'), `${Math.round(st.kmDriven).toLocaleString()} km`),
      kpi(this.t('stat_best_payout'), `${this.fmtMoney(st.bestPayout)}<small>${bestRoute}</small>`),
      kpi(this.t('stat_longest'), `${Math.round(st.longestRoute).toLocaleString()} km`),
      kpi(this.t('stat_peak_money'), this.fmtMoney(st.peakMoney)),
      kpi(this.t('stat_best_streak'), `🔥 ${st.bestStreak}<small>${this.t('stat_streak_now')} ${st.streak}</small>`),
      kpi(this.t('stat_breakdowns'), `🔧 ${st.breakdowns || 0}`),
      kpi(this.t('stat_vehicles_traded'), `${st.vehiclesBought} / ${st.vehiclesSold || 0}`),
      kpi(this.t('hud_company_value'), this.fmtMoney(this.getCompanyValue()))
    ].join('');

    const rows = Object.entries(st.expenses).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
    document.getElementById('statsBreakdown').innerHTML = rows.length ? rows.map(([k, v]) => {
      const pct = totalExpenses ? Math.round(v / totalExpenses * 100) : 0;
      return `
        <div class="bar-row">
          <span class="bar-label">${this.t('expense_' + k)}</span>
          <span class="bar-track"><span class="bar-fill" style="width:${Math.max(2, pct)}%"></span></span>
          <span class="bar-value mono">${this.fmtMoney(v)}</span>
        </div>`;
    }).join('') : `<p class="muted">${this.t('stats_no_expenses')}</p>`;

    const days = [...s.history.slice(-14), { day: s.day, income: Math.round(s.today.income), expense: Math.round(s.today.expense), current: true }];
    const max = Math.max(1, ...days.map(d => Math.max(d.income, d.expense)));
    document.getElementById('statsChart').innerHTML = days.map(d => `
      <div class="day-col ${d.current ? 'current' : ''}" title="${this.t('day_prefix')} ${d.day}: +${this.fmtMoney(d.income)} / −${this.fmtMoney(d.expense)}">
        <div class="day-bars">
          <span class="day-bar inc" style="height:${Math.round(d.income / max * 100)}%"></span>
          <span class="day-bar exp" style="height:${Math.round(d.expense / max * 100)}%"></span>
        </div>
        <span class="day-num">${d.day}</span>
      </div>`).join('');

    document.getElementById('statsCareer').innerHTML = [
      kpi(this.t('career_companies'), (career.companies || 1).toLocaleString()),
      kpi(this.t('career_earned'), this.fmtMoney(career.earned || 0), 'pos'),
      kpi(this.t('career_deliveries'), (career.deliveries || 0).toLocaleString()),
      kpi(this.t('career_km'), `${Math.round(career.km || 0).toLocaleString()} km`)
    ].join('');
  },

  renderAchievements() {
    const unlocked = Object.keys(this.state.achievements).length;
    this.setText('achievementsCounter', `${unlocked} / ${ACHIEVEMENTS.length}`);
    document.getElementById('achievementsList').innerHTML = ACHIEVEMENTS.map(a => {
      const day = this.state.achievements[a.id];
      return `
        <div class="ach-card ${day ? 'done' : ''}">
          <div class="ach-icon">${day ? a.icon : '🔒'}</div>
          <div class="ach-body"><div class="ach-title">${this.L(a.title)}</div><div class="ach-desc">${this.L(a.desc)}</div></div>
          <div class="ach-reward mono">${day ? `${this.t('day_prefix')} ${day}` : `+${this.fmtMoney(a.reward)}`}</div>
        </div>`;
    }).join('');
  }
});
