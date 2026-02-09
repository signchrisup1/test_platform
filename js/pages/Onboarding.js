// Onboarding flow
const OnboardingPage = {
  _step: 0,
  _selectedSubjects: [],
  _atarGoal: 90,

  render() {
    const steps = ['Subjects', 'ATAR Goal', 'Ready!'];

    Component.mount(`
      <div class="onboarding-page">
        <div class="onboarding-container">
          <div style="text-align:center;margin-bottom:24px">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="url(#onboardGrad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><defs><linearGradient id="onboardGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#6366f1"/><stop offset="100%" style="stop-color:#0ea5e9"/></linearGradient></defs><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <h2 style="margin-top:8px" class="text-gradient">Let's get you set up</h2>
          </div>
          <div class="onboarding-progress">
            ${steps.map((s, i) => `
              <div class="onboarding-step ${i < this._step ? 'completed' : ''} ${i === this._step ? 'active' : ''}"></div>
            `).join('')}
          </div>
          <div class="card" id="onboardingContent">
            ${this._renderStep()}
          </div>
        </div>
      </div>
    `);
  },

  _renderStep() {
    switch (this._step) {
      case 0: return this._stepSubjects();
      case 1: return this._stepAtarGoal();
      case 2: return this._stepComplete();
      default: return '';
    }
  },

  _stepSubjects() {
    return `
      <h3 style="margin-bottom:4px">Choose your subjects</h3>
      <p class="text-muted" style="margin-bottom:16px;font-size:0.9rem">Select up to 6 subjects you're studying (you can change these later)</p>
      <div class="subject-grid" id="subjectGrid">
        ${MockData.subjects.map(s => `
          <div class="subject-option ${this._selectedSubjects.includes(s.id) ? 'selected' : ''}"
               onclick="OnboardingPage.toggleSubject('${s.id}')">
            <span class="subject-emoji">${s.emoji}</span>
            <span>${s.name}</span>
          </div>
        `).join('')}
      </div>
      <div style="margin-top:16px;display:flex;justify-content:space-between;align-items:center">
        <span class="text-muted" style="font-size:0.85rem">${this._selectedSubjects.length}/6 selected</span>
        <button class="btn btn-primary" onclick="OnboardingPage.nextStep()" ${this._selectedSubjects.length === 0 ? 'disabled' : ''}>
          Continue
        </button>
      </div>
    `;
  },

  _stepAtarGoal() {
    return `
      <h3 style="margin-bottom:4px">Set your ATAR goal</h3>
      <p class="text-muted" style="margin-bottom:24px;font-size:0.9rem">This helps us track your progress and keep you motivated</p>
      <div style="text-align:center;margin-bottom:24px">
        <div class="atar-circle" style="margin:0 auto 16px">
          <div class="atar-value" id="atarDisplay">${this._atarGoal}</div>
          <div class="atar-goal-label">ATAR Goal</div>
        </div>
        <input type="range" class="form-range" min="50" max="99.95" step="0.05" value="${this._atarGoal}"
               oninput="OnboardingPage.updateAtarGoal(this.value)" style="max-width:300px;margin:0 auto">
        <div style="display:flex;justify-content:space-between;max-width:300px;margin:8px auto 0;font-size:0.8rem;color:var(--text-muted)">
          <span>50</span>
          <span>99.95</span>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between">
        <button class="btn btn-secondary" onclick="OnboardingPage.prevStep()">Back</button>
        <button class="btn btn-primary" onclick="OnboardingPage.nextStep()">Continue</button>
      </div>
    `;
  },

  _stepComplete() {
    const user = Store.get('user') || {};
    return `
      <div style="text-align:center;padding:20px 0">
        <div style="font-size:3rem;margin-bottom:16px">🎉</div>
        <h3 style="margin-bottom:8px">You're all set, ${(user.name || 'Student').split(' ')[0]}!</h3>
        <p class="text-muted" style="margin-bottom:24px;font-size:0.9rem">
          ${this._selectedSubjects.length} subjects selected | ATAR goal: ${this._atarGoal}
        </p>
        <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:24px">
          ${this._selectedSubjects.map(id => {
            const s = MockData.subjects.find(sub => sub.id === id);
            return s ? `<span class="tag active">${s.emoji} ${s.name}</span>` : '';
          }).join('')}
        </div>
        <button class="btn btn-primary btn-lg" onclick="OnboardingPage.complete()">
          Go to Dashboard
        </button>
      </div>
    `;
  },

  toggleSubject(id) {
    const idx = this._selectedSubjects.indexOf(id);
    if (idx !== -1) {
      this._selectedSubjects.splice(idx, 1);
    } else if (this._selectedSubjects.length < 6) {
      this._selectedSubjects.push(id);
    } else {
      Component.toast('Maximum 6 subjects', 'warning');
      return;
    }
    const content = document.getElementById('onboardingContent');
    if (content) content.innerHTML = this._renderStep();
  },

  updateAtarGoal(value) {
    this._atarGoal = parseFloat(value);
    const display = document.getElementById('atarDisplay');
    if (display) display.textContent = this._atarGoal;
  },

  nextStep() {
    if (this._step === 0 && this._selectedSubjects.length === 0) {
      Component.toast('Please select at least one subject', 'warning');
      return;
    }
    this._step++;
    this.render();
  },

  prevStep() {
    if (this._step > 0) {
      this._step--;
      this.render();
    }
  },

  complete() {
    Store.set('subjects', this._selectedSubjects);
    Store.set('atarGoal', this._atarGoal);
    Store.set('onboardingComplete', true);
    Router.navigate('/dashboard');
  }
};
