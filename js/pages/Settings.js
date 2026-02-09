// Settings & Profile page
const SettingsPage = {
  render() {
    const content = document.getElementById('pageContent');
    if (!content) return;

    const user = Store.get('user') || {};
    const settings = Store.get('settings') || {};
    const theme = Store.get('theme') || 'dark';
    const atarGoal = Store.get('atarGoal') || 90;

    content.innerHTML = `
      <div class="page-content" style="max-width:800px">
        <div class="mb-lg">
          <h1><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--primary-light)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> Settings</h1>
          <p class="text-muted mt-sm" style="font-size:0.9rem">Manage your profile and preferences</p>
        </div>

        <!-- Profile Section -->
        <div class="card mb-lg">
          <div class="settings-title">Profile</div>
          <div class="flex items-center gap-lg mb-lg">
            <div class="avatar avatar-xl" style="background:${Helpers.avatarColor(user.name)}">
              ${Helpers.initials(user.name)}
            </div>
            <div>
              <h3>${user.name || 'Student'}</h3>
              <div class="text-muted">${user.email || 'student@atar.edu.au'}</div>
              <div class="text-muted">Year ${user.yearLevel || 12}</div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Display Name</label>
            <input type="text" class="form-input" id="settingsName" value="${user.name || ''}" onchange="SettingsPage.updateProfile('name', this.value)">
          </div>
          <div class="form-group">
            <label class="form-label">Year Level</label>
            <select class="form-select" id="settingsYear" onchange="SettingsPage.updateProfile('yearLevel', parseInt(this.value))">
              <option value="11" ${user.yearLevel === 11 ? 'selected' : ''}>Year 11</option>
              <option value="12" ${user.yearLevel === 12 ? 'selected' : ''}>Year 12</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">ATAR Goal</label>
            <div class="flex items-center gap-md">
              <input type="range" class="form-range" min="50" max="99.95" step="0.05" value="${atarGoal}"
                     oninput="SettingsPage.updateAtarGoal(this.value)" style="flex:1">
              <span style="font-weight:600;min-width:50px;text-align:right" id="atarGoalDisplay">${atarGoal}</span>
            </div>
          </div>
        </div>

        <!-- Subjects -->
        <div class="card mb-lg">
          <div class="settings-title">Subjects</div>
          <div class="flex flex-wrap gap-sm mb-md">
            ${(Store.get('subjects') || []).map(id => {
              const s = MockData.subjects.find(sub => sub.id === id);
              return s ? `<span class="tag active">${s.emoji} ${s.name}</span>` : '';
            }).join('')}
          </div>
          <button class="btn btn-secondary" onclick="SubjectsPage.manageSubjects()">Manage Subjects</button>
        </div>

        <!-- Appearance -->
        <div class="card mb-lg">
          <div class="settings-title">Appearance</div>
          <div class="settings-row">
            <div class="settings-label">
              <span>Theme</span>
              <span>Switch between light and dark mode</span>
            </div>
            <label class="toggle">
              <input type="checkbox" ${theme === 'dark' ? 'checked' : ''} onchange="TopBar.toggleTheme()">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <!-- Study Preferences -->
        <div class="card mb-lg">
          <div class="settings-title">Study Preferences</div>
          <div class="settings-row">
            <div class="settings-label">
              <span>Focus Duration</span>
              <span>Pomodoro work session length</span>
            </div>
            <select class="form-select" style="width:auto" onchange="SettingsPage.updateSetting('pomodoroWork', parseInt(this.value))">
              <option value="15" ${settings.pomodoroWork === 15 ? 'selected' : ''}>15 min</option>
              <option value="25" ${settings.pomodoroWork === 25 || !settings.pomodoroWork ? 'selected' : ''}>25 min</option>
              <option value="30" ${settings.pomodoroWork === 30 ? 'selected' : ''}>30 min</option>
              <option value="45" ${settings.pomodoroWork === 45 ? 'selected' : ''}>45 min</option>
              <option value="60" ${settings.pomodoroWork === 60 ? 'selected' : ''}>60 min</option>
            </select>
          </div>
          <div class="settings-row">
            <div class="settings-label">
              <span>Short Break</span>
              <span>Break between focus sessions</span>
            </div>
            <select class="form-select" style="width:auto" onchange="SettingsPage.updateSetting('pomodoroBreak', parseInt(this.value))">
              <option value="3" ${settings.pomodoroBreak === 3 ? 'selected' : ''}>3 min</option>
              <option value="5" ${settings.pomodoroBreak === 5 || !settings.pomodoroBreak ? 'selected' : ''}>5 min</option>
              <option value="10" ${settings.pomodoroBreak === 10 ? 'selected' : ''}>10 min</option>
            </select>
          </div>
          <div class="settings-row">
            <div class="settings-label">
              <span>Long Break</span>
              <span>Break after 4 focus sessions</span>
            </div>
            <select class="form-select" style="width:auto" onchange="SettingsPage.updateSetting('pomodoroLongBreak', parseInt(this.value))">
              <option value="10" ${settings.pomodoroLongBreak === 10 ? 'selected' : ''}>10 min</option>
              <option value="15" ${settings.pomodoroLongBreak === 15 || !settings.pomodoroLongBreak ? 'selected' : ''}>15 min</option>
              <option value="20" ${settings.pomodoroLongBreak === 20 ? 'selected' : ''}>20 min</option>
              <option value="30" ${settings.pomodoroLongBreak === 30 ? 'selected' : ''}>30 min</option>
            </select>
          </div>
          <div class="settings-row">
            <div class="settings-label">
              <span>Daily Study Goal</span>
              <span>Target study time per day</span>
            </div>
            <select class="form-select" style="width:auto" onchange="SettingsPage.updateSetting('dailyGoalMinutes', parseInt(this.value))">
              <option value="30" ${settings.dailyGoalMinutes === 30 ? 'selected' : ''}>30 min</option>
              <option value="60" ${settings.dailyGoalMinutes === 60 ? 'selected' : ''}>1 hour</option>
              <option value="90" ${settings.dailyGoalMinutes === 90 ? 'selected' : ''}>1.5 hours</option>
              <option value="120" ${settings.dailyGoalMinutes === 120 || !settings.dailyGoalMinutes ? 'selected' : ''}>2 hours</option>
              <option value="180" ${settings.dailyGoalMinutes === 180 ? 'selected' : ''}>3 hours</option>
              <option value="240" ${settings.dailyGoalMinutes === 240 ? 'selected' : ''}>4 hours</option>
            </select>
          </div>
          <div class="settings-row">
            <div class="settings-label">
              <span>Weekly Study Goal</span>
              <span>Target study time per week</span>
            </div>
            <select class="form-select" style="width:auto" onchange="SettingsPage.updateSetting('weeklyGoalHours', parseInt(this.value))">
              <option value="5" ${settings.weeklyGoalHours === 5 ? 'selected' : ''}>5 hours</option>
              <option value="10" ${settings.weeklyGoalHours === 10 ? 'selected' : ''}>10 hours</option>
              <option value="15" ${settings.weeklyGoalHours === 15 || !settings.weeklyGoalHours ? 'selected' : ''}>15 hours</option>
              <option value="20" ${settings.weeklyGoalHours === 20 ? 'selected' : ''}>20 hours</option>
              <option value="25" ${settings.weeklyGoalHours === 25 ? 'selected' : ''}>25 hours</option>
            </select>
          </div>
        </div>

        <!-- Notifications -->
        <div class="card mb-lg">
          <div class="settings-title">Notifications</div>
          <div class="settings-row">
            <div class="settings-label">
              <span>Push Notifications</span>
              <span>Get reminders to study</span>
            </div>
            <label class="toggle">
              <input type="checkbox" ${settings.notifications !== false ? 'checked' : ''} onchange="SettingsPage.updateSetting('notifications', this.checked)">
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="settings-row">
            <div class="settings-label">
              <span>Sound Effects</span>
              <span>Timer and notification sounds</span>
            </div>
            <label class="toggle">
              <input type="checkbox" ${settings.soundEnabled !== false ? 'checked' : ''} onchange="SettingsPage.updateSetting('soundEnabled', this.checked)">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <!-- Data -->
        <div class="card mb-lg">
          <div class="settings-title">Data Management</div>
          <div class="flex gap-md">
            <button class="btn btn-secondary" onclick="SettingsPage.exportData()">Export Data</button>
            <button class="btn btn-danger" onclick="SettingsPage.resetData()">Reset All Data</button>
          </div>
          <div class="text-muted mt-sm" style="font-size:0.8rem">
            All data is stored locally in your browser. Clearing browser data will remove all progress.
          </div>
        </div>
      </div>
    `;
  },

  updateProfile(field, value) {
    const user = Store.get('user') || {};
    user[field] = value;
    Store.set('user', user);
    Component.toast('Profile updated', 'success');
  },

  updateAtarGoal(value) {
    Store.set('atarGoal', parseFloat(value));
    const display = document.getElementById('atarGoalDisplay');
    if (display) display.textContent = value;
  },

  updateSetting(key, value) {
    const settings = Store.get('settings') || {};
    settings[key] = value;
    Store.set('settings', settings);
    Component.toast('Setting updated', 'success');
  },

  exportData() {
    const data = JSON.stringify(Store.get(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'atar-study-data.json';
    a.click();
    URL.revokeObjectURL(url);
    Component.toast('Data exported!', 'success');
  },

  resetData() {
    Modal.confirm('Are you sure? This will delete ALL your data including study progress, flashcards, and history. This cannot be undone.', () => {
      Store.reset();
      Router.navigate('/');
      Component.toast('All data has been reset', 'info');
    });
  }
};
