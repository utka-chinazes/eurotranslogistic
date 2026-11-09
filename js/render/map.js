// =============================================================================
// Мапа на Canvas.
//  • Статичний шар (фон, сітка, суходіл, дороги, залізниця) малюється один раз
//    в offscreen-canvas і перемальовується лише при зміні розміру.
//  • Розмір відстежує ResizeObserver — жодних читань layout у кожному кадрі.
//  • Canvas масштабується під devicePixelRatio, тож на HiDPI мапа чітка.
// =============================================================================

const MAP_COLORS = {
  seaInner: '#0e1030',
  seaOuter: '#06071a',
  grid: 'rgba(140, 120, 255, 0.045)',
  land: '#151938',
  landEdge: '#2c3170',
  road: 'rgba(54, 201, 245, 0.28)',
  rail: 'rgba(255, 210, 63, 0.40)',
  air: 'rgba(192, 132, 252, 0.55)',
  city: '#8f93c4',
  cityHot: '#3ee6a0',
  citySel: '#ffa53d',
  cityStroke: '#07081a',
  label: '#a9acd6',
  labelHot: '#ffffff',
  accent: '#ffa53d',
  hq: '#ff5c7a'
};

Object.assign(EuroLogisticsGame.prototype, {
  // Геокоординати → CSS-пікселі canvas. Ліворуч може бути відступ під панель.
  project(lon, lat) {
    const inset = this.mapInsetLeft || 0;
    const padX = 40;
    const padY = 40;
    const w = (this.viewW || 900) - padX * 2 - inset;
    const h = (this.viewH || 600) - padY * 2;
    const b = this.geoBounds;
    return {
      x: inset + padX + ((lon - b.minLon) / (b.maxLon - b.minLon)) * w,
      y: padY + (1 - (lat - b.minLat) / (b.maxLat - b.minLat)) * h
    };
  },

  resizeCanvas() {
    const wrapper = document.getElementById('canvasWrapper');
    if (!wrapper) return;
    if (!this._resizeObserver && 'ResizeObserver' in window) {
      this._resizeObserver = new ResizeObserver(() => this.resizeCanvas());
      this._resizeObserver.observe(wrapper);
    }
    const w = wrapper.clientWidth || 900;
    const h = wrapper.clientHeight || 600;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (w === this.viewW && h === this.viewH && dpr === this.dpr) return;

    this.viewW = w;
    this.viewH = h;
    this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.cityPoints = null;
    this.staticLayer = null;
  },

  // Відступ ліворуч (екран заснування закриває частину мапи панеллю)
  setMapInset(px) {
    if (this.mapInsetLeft === px) return;
    this.mapInsetLeft = px;
    this.cityPoints = null;
    this.staticLayer = null;
  },

  // Кеш екранних координат міст
  getCityPoints() {
    if (!this.cityPoints) {
      this.cityPoints = {};
      Object.values(CITIES).forEach(c => { this.cityPoints[c.id] = this.project(c.lon, c.lat); });
    }
    return this.cityPoints;
  },

  buildStaticLayer() {
    const layer = document.createElement('canvas');
    layer.width = this.canvas.width;
    layer.height = this.canvas.height;
    const ctx = layer.getContext('2d');
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const w = this.viewW;
    const h = this.viewH;

    const bg = ctx.createRadialGradient(w * 0.58, h * 0.45, 0, w * 0.58, h * 0.45, Math.max(w, h) * 0.75);
    bg.addColorStop(0, MAP_COLORS.seaInner);
    bg.addColorStop(1, MAP_COLORS.seaOuter);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = MAP_COLORS.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0.5; x < w; x += 48) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
    for (let y = 0.5; y < h; y += 48) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
    ctx.stroke();

    ctx.fillStyle = MAP_COLORS.land;
    ctx.strokeStyle = MAP_COLORS.landEdge;
    ctx.lineWidth = 1.4;
    ctx.lineJoin = 'round';
    EUROPE_COASTLINES.forEach(poly => {
      ctx.beginPath();
      poly.forEach((pt, i) => {
        const p = this.project(pt.lon, pt.lat);
        if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });

    const pts = this.getCityPoints();
    ['road', 'rail'].forEach(type => {
      ctx.beginPath();
      CONNECTIONS.forEach(conn => {
        if (conn.type !== type || !pts[conn.from] || !pts[conn.to]) return;
        ctx.moveTo(pts[conn.from].x, pts[conn.from].y);
        ctx.lineTo(pts[conn.to].x, pts[conn.to].y);
      });
      ctx.strokeStyle = type === 'rail' ? MAP_COLORS.rail : MAP_COLORS.road;
      ctx.lineWidth = type === 'rail' ? 2.2 : 2;
      ctx.setLineDash(type === 'rail' ? [5, 5] : []);
      ctx.stroke();
    });
    ctx.setLineDash([]);
    this.staticLayer = layer;
  },

  draw() {
    if (!this.viewW) this.resizeCanvas();
    if (!this.staticLayer) this.buildStaticLayer();

    const ctx = this.ctx;
    const now = performance.now();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(this.staticLayer, 0, 0);
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    const pts = this.getCityPoints();
    const focus = this.tutorialMapFocus;
    const inGame = this.screen === 'game';
    const brand = this.state.brandColor || MAP_COLORS.accent;

    // Підсвічування мережі в туторіалі
    if (focus === 'network') {
      ctx.lineDashOffset = -now / 60;
      CONNECTIONS.forEach(conn => {
        const a = pts[conn.from], b = pts[conn.to];
        if (!a || !b) return;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = conn.type === 'rail' ? 'rgba(255, 210, 63, 0.9)' : 'rgba(54, 201, 245, 0.8)';
        ctx.lineWidth = 2.6;
        ctx.setLineDash(conn.type === 'rail' ? [5, 5] : []);
        ctx.stroke();
      });
      ctx.setLineDash([]);
      ctx.lineDashOffset = 0;
    }

    if (inGame) {
      // Авіамаршрути та шляхи активних рейсів
      this.state.fleet.forEach(v => {
        if (v.status === 'idle' || !v.path || v.path.length < 2) return;
        if (v.network === 'air') {
          const a = pts[v.path[0]], b = pts[v.path[v.path.length - 1]];
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = MAP_COLORS.air;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([8, 6]);
          ctx.stroke();
          ctx.setLineDash([]);
        } else {
          this.drawPathLine(v.path, v.currentLeg, this.withAlpha(brand, 0.55), 2, [3, 5], now);
        }
      });
    }

    this.drawFocusUnderlay(focus, now);

    // Міста
    const pending = {};
    if (inGame) this.state.contracts.forEach(c => { pending[c.origin] = (pending[c.origin] || 0) + 1; });
    const pulse = (Math.sin(now / 250) + 1) * 4;

    ctx.textAlign = 'center';
    Object.values(CITIES).forEach(city => {
      const p = pts[city.id];
      const isSelected = this.state.selectedCity === city.id;
      const isHovered = this.state.hoveredCity === city.id;
      const orders = pending[city.id] || 0;
      const isHq = inGame && city.id === this.state.homeBase;
      const garage = inGame ? this.state.garages[city.id] : null;

      if (orders > 0) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(62, 230, 160, 0.13)';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, isSelected ? 7 : (isHovered ? 6 : 4.5), 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? MAP_COLORS.citySel : (orders > 0 ? MAP_COLORS.cityHot : MAP_COLORS.city);
      ctx.fill();
      ctx.strokeStyle = MAP_COLORS.cityStroke;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = (isSelected || isHq || isHovered) ? '700 11px Inter, sans-serif' : '500 10px Inter, sans-serif';
      ctx.fillStyle = isSelected ? MAP_COLORS.citySel : (isHovered ? MAP_COLORS.labelHot : MAP_COLORS.label);
      ctx.fillText(this.getCityName(city.id), p.x, p.y - 11);

      if (garage) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, isSelected ? 12 : 9.5, 0, Math.PI * 2);
        ctx.strokeStyle = isHq ? brand : (garage.level === 3 ? MAP_COLORS.cityHot : this.withAlpha(brand, 0.75));
        ctx.lineWidth = isHq ? 2.6 : 1.6;
        ctx.stroke();
        if (isHq) {
          // Ромбик штабу
          ctx.save();
          ctx.translate(p.x, p.y + 15);
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = brand;
          ctx.fillRect(-3.5, -3.5, 7, 7);
          ctx.restore();
        }
      }

      if (orders > 0) {
        ctx.beginPath();
        ctx.arc(p.x + 10, p.y - 3, 6, 0, Math.PI * 2);
        ctx.fillStyle = MAP_COLORS.accent;
        ctx.fill();
        ctx.font = '800 8px Inter, sans-serif';
        ctx.fillStyle = '#1a0f05';
        ctx.fillText(orders, p.x + 10, p.y);
      }
    });

    // Транспорт
    if (inGame) {
      ctx.textBaseline = 'middle';
      this.state.fleet.forEach(v => {
        if (v.status === 'idle') return;
        const pos = this.getVehicleCanvasPos(v);
        if (!pos) return;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 11, 0, Math.PI * 2);
        ctx.fillStyle = v.status === 'broken' ? 'rgba(255, 92, 122, 0.45)' : this.withAlpha(brand, 0.32);
        ctx.fill();
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText(v.icon, pos.x, pos.y);
        if (v.status === 'loading' || v.status === 'unloading' || v.status === 'broken') {
          ctx.font = '10px Inter, sans-serif';
          ctx.fillText(v.status === 'broken' ? '🔧' : '⏳', pos.x + 10, pos.y - 10);
        }
      });
      ctx.textBaseline = 'alphabetic';
    }

    this.drawFocusOverlay(focus, now);
  },

  // '#rrggbb' + альфа → rgba()
  withAlpha(hex, a) {
    const n = parseInt(String(hex).slice(1), 16);
    if (Number.isNaN(n)) return `rgba(255, 165, 61, ${a})`;
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  },

  drawPathLine(path, fromLeg, color, width, dash, now) {
    const ctx = this.ctx;
    const pts = this.getCityPoints();
    const start = Math.max(0, fromLeg);
    ctx.beginPath();
    for (let i = start; i < path.length; i++) {
      const p = pts[path[i]];
      if (i === start) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.lineDashOffset = -now / 40;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;
  },

  // Пульсуюче кільце з підписом — «вказівник» на мапі
  drawBeacon(cityId, label, color, now) {
    const p = this.getCityPoints()[cityId];
    if (!p) return;
    const ctx = this.ctx;
    const t = (now % 1600) / 1600;

    ctx.beginPath();
    ctx.arc(p.x, p.y, 10 + t * 22, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.globalAlpha = 1 - t;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, 13, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    if (label) {
      ctx.font = '700 11px Inter, sans-serif';
      const tw = ctx.measureText(label).width;
      const by = p.y + 18;
      ctx.fillStyle = color;
      this.roundRect(p.x - tw / 2 - 8, by, tw + 16, 20, 10);
      ctx.fill();
      ctx.fillStyle = '#12091f';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, p.x, by + 10);
      ctx.textBaseline = 'alphabetic';
    }
  },

  roundRect(x, y, w, h, r) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  },

  drawFocusUnderlay(focus, now) {
    if (focus !== 'contract') return;
    const c = this.getTutorialContract();
    if (!c) return;
    const path = this.findPath(c.origin, c.destination, 'road') || [c.origin, c.destination];
    this.drawPathLine(path, 0, 'rgba(255, 165, 61, 0.95)', 3.5, [10, 7], now);
  },

  drawFocusOverlay(focus, now) {
    if (this.screen === 'setup') {
      const sel = this.setupDraft?.homeBase;
      STARTING_BASES.forEach(b => {
        const isSel = b.cityId === sel;
        this.drawBeacon(b.cityId, isSel ? `${b.icon} ${this.L(b.title)}` : '', isSel ? (this.setupDraft.brandColor || '#ffa53d') : 'rgba(192, 132, 252, 0.75)', now);
      });
      return;
    }
    if (!focus || this.screen !== 'game') return;

    const hqLabel = `◆ ${this.t('map_label_hq')}`;
    const brand = this.state.brandColor || '#ff5c7a';
    if (focus === 'base' || focus === 'network') {
      this.drawBeacon(this.state.homeBase, hqLabel, brand, now);
    } else if (focus === 'contract') {
      const c = this.getTutorialContract();
      if (c) {
        this.drawBeacon(c.origin, `📦 ${this.t('map_label_pickup')}`, '#ffa53d', now);
        this.drawBeacon(c.destination, `🏁 ${this.t('map_label_dropoff')}`, '#3ee6a0', now);
      }
    } else if (focus === 'garages') {
      Object.keys(this.state.garages).forEach(id => this.drawBeacon(id, id === this.state.homeBase ? hqLabel : '🏠', brand, now));
      Object.keys(CITIES)
        .filter(id => !this.state.garages[id])
        .sort((a, b) => this.cityDistance(this.state.homeBase, a) - this.cityDistance(this.state.homeBase, b))
        .slice(0, 2)
        .forEach(id => this.drawBeacon(id, `＋ ${this.t('map_label_expand')}`, 'rgba(192, 132, 252, 0.9)', now));
    } else if (focus === 'fleet' || focus === 'vehicles') {
      const seen = new Set();
      this.state.fleet.forEach(v => {
        if (v.status !== 'idle' || seen.has(v.location)) return;
        seen.add(v.location);
        this.drawBeacon(v.location, `${v.icon} ${this.t('map_label_your_fleet')}`, '#36c9f5', now);
      });
    }
  },

  getTutorialContract() {
    const firstCard = document.querySelector('#contractsList .contract-card[data-contract-id]');
    const id = firstCard?.getAttribute('data-contract-id');
    return this.state.contracts.find(c => c.id === id) || this.state.contracts[0] || null;
  },

  getVehicleCanvasPos(v) {
    const pts = this.getCityPoints();
    if (v.status === 'idle' || !v.path || v.path.length < 2) return pts[v.location] || null;
    const a = pts[v.path[v.currentLeg]];
    const b = pts[v.path[v.currentLeg + 1]];
    if (!a || !b) return pts[v.location] || null;
    return { x: a.x + (b.x - a.x) * v.legProgress, y: a.y + (b.y - a.y) * v.legProgress };
  },

  cityAt(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const pts = this.getCityPoints();
    let best = null;
    let bestD = 14;
    for (const id in pts) {
      const d = Math.hypot(mx - pts[id].x, my - pts[id].y);
      if (d < bestD) { bestD = d; best = id; }
    }
    return { cityId: best, mx, my };
  },

  handleCanvasHover(e) {
    const { cityId, mx, my } = this.cityAt(e);
    this.state.hoveredCity = cityId;
    this.canvas.style.cursor = cityId ? 'pointer' : 'default';
    if (!cityId) {
      this.tooltip.classList.add('hidden');
      return;
    }

    const city = CITIES[cityId];
    const country = (typeof COUNTRIES_I18N !== 'undefined' && COUNTRIES_I18N[city.country]?.[this.state.lang]) || city.country;
    const title = `<strong>${this.getCityName(cityId)}</strong> <span class="tt-muted">${country}</span>`;

    if (this.screen === 'setup') {
      const base = this.getBase(cityId);
      this.tooltip.innerHTML = base
        ? `${title}<div class="tt-accent">${base.icon} ${this.L(base.title)}</div><div>${this.L(base.desc)}</div>`
        : `${title}<div class="tt-muted">${this.t('setup_not_a_base')}</div>`;
    } else {
      const garage = this.state.garages[cityId];
      const orders = this.state.contracts.filter(c => c.origin === cityId).length;
      const idle = this.state.fleet.filter(v => v.location === cityId && v.status === 'idle').length;
      this.tooltip.innerHTML = `${title}
        ${garage ? `<div class="tt-accent">${cityId === this.state.homeBase ? '◆ HQ' : '🏠'} · ${this.t('garage_level_label')} ${garage.level}</div>` : ''}
        <div>📦 ${this.t('nav_contracts')}: <b>${orders}</b> · 🚛 ${this.t('status_idle')}: <b>${idle}</b></div>`;
    }
    const wrapW = this.viewW || 900;
    this.tooltip.style.left = `${Math.min(mx + 14, wrapW - 240)}px`;
    this.tooltip.style.top = `${my + 14}px`;
    this.tooltip.classList.remove('hidden');
  },

  handleCanvasClick(e) {
    const { cityId } = this.cityAt(e);
    if (this.screen === 'setup') {
      if (cityId) this.selectSetupBase(cityId);
      return;
    }
    this.selectCity(cityId && cityId !== this.state.selectedCity ? cityId : null);
  },

  selectCity(cityId) {
    this.state.selectedCity = cityId;
    this.updateMapCityIndicator();
    this.markDirty('contracts');
    this.uiTick();
  }
});
