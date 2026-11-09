// Туторіал-підказка без затемнення
Object.assign(EuroLogisticsGame.prototype, {
  isTutorialOpen() {
    const modal = document.getElementById('tutorialModal');
    return !!modal && !modal.classList.contains('hidden');
  },

  startTutorial() {
    if (this.screen !== 'game') return;
    this.currentTutorialStep = 0;
    const modal = document.getElementById('tutorialModal');
    if (!modal) return;

    // Під час туторіалу ставимо гру на паузу, щоб час і замовлення не спливали
    if (this.state.timeSpeed > 0) {
      this.preTutorialSpeed = this.state.timeSpeed;
    }
    this.setSpeed(0);
    document.getElementById('mapFreezeBanner')?.classList.add('hidden');
    document.getElementById('canvasWrapper')?.classList.remove('is-frozen');

    modal.classList.remove('hidden');
    this.renderTutorialStep(0);
  },

  renderTutorialStep(index) {
    const list = TUTORIAL_I18N;
    if (index < 0 || index >= list.length) return;
    this.currentTutorialStep = index;
    const step = list[index];
    const layout = TUTORIAL_LAYOUT[index] || {};
    const l = this.state.lang || 'uk';

    // Відкриваємо потрібну вкладку, щоб показати, про що йдеться
    if (layout.tab) {
      if (this.activeTab !== layout.tab) this.switchTab(layout.tab);
    }
    this.tutorialMapFocus = layout.map || null;

    const title = typeof step.title === 'object' ? (step.title[l] || step.title.uk) : step.title;
    const desc = typeof step.desc === 'object' ? (step.desc[l] || step.desc.uk) : step.desc;
    const tip = typeof step.tip === 'object' ? (step.tip[l] || step.tip.uk) : step.tip;
    const icons = ['🌐', '🗺️', '📋', '🚛', '🏠', '👔', '⚡', '⏸️', '👤'];

    const set = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    set('tutStepBadge', `${this.t('tut_step_prefix')} ${index + 1} ${this.t('tut_from')} ${list.length}`);
    set('tutTitle', title);
    set('tutIconBox', step.icon || icons[index] || '💡');
    set('tutDesc', desc);
    set('tutTipText', tip);

    const progressEl = document.getElementById('tutProgressFill');
    if (progressEl) progressEl.style.width = `${((index + 1) / list.length) * 100}%`;

    const dotsContainer = document.getElementById('tutDotsContainer');
    if (dotsContainer) {
      dotsContainer.innerHTML = list.map((_, i) => `
        <span class="dot-step ${i === index ? 'active' : ''}" data-tut-step="${i}" title="${this.t('tut_step_prefix')} ${i + 1}"></span>
      `).join('');
    }

    const prevBtn = document.getElementById('btnTutPrev');
    const nextBtn = document.getElementById('btnTutNext');
    if (prevBtn) {
      prevBtn.disabled = index === 0;
      prevBtn.textContent = `⬅ ${this.t('btn_tut_prev')}`;
    }
    if (nextBtn) {
      nextBtn.textContent = index === list.length - 1 ? this.t('btn_tut_finish') : this.t('btn_tut_next');
    }

    // Позиціонуємо після того, як вкладка відмалювалась
    requestAnimationFrame(() => this.positionTutorialCard());
  },

  getTutorialTarget() {
    const layout = TUTORIAL_LAYOUT[this.currentTutorialStep] || {};
    let el = layout.target ? document.querySelector(layout.target) : null;
    if ((!el || !el.getClientRects().length) && layout.fallback) el = document.querySelector(layout.fallback);
    return el;
  },

  // Ставить картку поруч із ціллю та обводить ціль «прожектором»
  positionTutorialCard() {
    const card = document.querySelector('#tutorialModal .tutorial-card');
    const spot = document.getElementById('tutSpotlight');
    if (!card) return;
    const layout = TUTORIAL_LAYOUT[this.currentTutorialStep] || {};
    const target = this.getTutorialTarget();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 14;
    const cw = card.offsetWidth;
    const ch = card.offsetHeight;

    let x = (vw - cw) / 2;
    let y = (vh - ch) / 2;
    let arrow = 'none';

    if (target) {
      target.scrollIntoView({ block: 'nearest' });
      const r = target.getBoundingClientRect();
      if (spot) {
        spot.style.left = `${r.left - 6}px`;
        spot.style.top = `${r.top - 6}px`;
        spot.style.width = `${r.width + 12}px`;
        spot.style.height = `${r.height + 12}px`;
        spot.classList.remove('hidden');
      }

      const place = layout.placement || 'bottom';
      if (place === 'inside') {
        x = r.right - cw - 24;
        y = r.top + 56;
        arrow = 'none';
      } else if (place === 'right') {
        x = r.right + margin + 6;
        y = r.top + Math.min(40, r.height / 2) - 30;
        arrow = 'left';
        if (x + cw > vw - 8) { x = r.left - cw - margin - 6; arrow = 'right'; }
      } else {
        x = r.left + r.width / 2 - cw / 2;
        y = r.bottom + margin + 6;
        arrow = 'top';
        if (y + ch > vh - 8) { y = r.top - ch - margin - 6; arrow = 'bottom'; }
      }

      // Позиція стрілки відносно картки
      const arrowX = Math.min(cw - 24, Math.max(24, r.left + r.width / 2 - Math.max(8, Math.min(x, vw - cw - 8))));
      card.style.setProperty('--arrow-x', `${arrowX}px`);
    } else if (spot) {
      spot.classList.add('hidden');
    }

    x = Math.max(8, Math.min(x, vw - cw - 8));
    y = Math.max(8, Math.min(y, vh - ch - 8));
    card.style.left = `${x}px`;
    card.style.top = `${y}px`;
    card.setAttribute('data-arrow', arrow);
  },

  nextTutorialStep() {
    if (this.currentTutorialStep < TUTORIAL_I18N.length - 1) {
      this.renderTutorialStep(this.currentTutorialStep + 1);
    } else {
      this.closeTutorial();
      this.showToast(this.t('btn_tut_finish'), 'success');
    }
  },

  prevTutorialStep() {
    if (this.currentTutorialStep > 0) {
      this.renderTutorialStep(this.currentTutorialStep - 1);
    }
  },

  closeTutorial(resume = true) {
    const modal = document.getElementById('tutorialModal');
    const wasOpen = this.isTutorialOpen();
    if (modal) modal.classList.add('hidden');
    document.getElementById('tutSpotlight')?.classList.add('hidden');
    this.tutorialMapFocus = null;
    if (!wasOpen) return;
    this.saveSettings({ tutorialDone: true });

    // Відновлюємо швидкість гри після завершення або закриття туторіалу
    if (resume) this.setSpeed(this.preTutorialSpeed || 1);
  }
});
