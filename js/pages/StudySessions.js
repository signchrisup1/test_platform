// Study Sessions - Collaborative Study
const StudySessionsPage = {
  _activeSession: null,
  _tab: 'active', // active, create, history

  render() {
    const content = document.getElementById('pageContent');
    if (!content) return;

    content.innerHTML = `
      <div class="page-content">
        <div class="flex justify-between items-center mb-lg">
          <div>
            <h1><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--primary-light)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Study Sessions</h1>
            <p class="text-muted mt-sm" style="font-size:0.9rem">Study together with friends</p>
          </div>
          <button class="btn btn-primary" onclick="StudySessionsPage.showCreate()">+ Create Session</button>
        </div>

        <div class="tabs">
          <button class="tab ${this._tab === 'active' ? 'active' : ''}" onclick="StudySessionsPage.switchTab('active')">
            ${this._activeSession ? 'Current Session' : 'Join Session'}
          </button>
          <button class="tab ${this._tab === 'history' ? 'active' : ''}" onclick="StudySessionsPage.switchTab('history')">
            History
          </button>
        </div>

        <div id="sessionsContent">
          ${this._activeSession ? this._renderActive() : this._tab === 'history' ? this._renderHistory() : this._renderJoin()}
        </div>
      </div>
    `;
  },

  switchTab(tab) {
    this._tab = tab;
    this.render();
  },

  _renderJoin() {
    const friends = Store.get('friends') || [];
    const onlineFriends = friends.filter(f => f.online);

    return `
      <div class="grid grid-2 gap-lg">
        <div>
          <div class="card mb-md">
            <h3 class="card-title" style="margin-bottom:16px">Available Sessions</h3>
            <div class="flex flex-col gap-sm">
              <div class="card card-hover" style="cursor:pointer" onclick="StudySessionsPage.joinSession('Sarah\\'s Study Group')">
                <div class="flex items-center gap-md">
                  <div class="avatar" style="background:${Helpers.avatarColor('Sarah Chen')}">SC</div>
                  <div style="flex:1">
                    <div style="font-weight:600">Sarah's Study Group</div>
                    <div class="text-muted" style="font-size:0.8rem">English & History | 3 participants</div>
                  </div>
                  <button class="btn btn-primary btn-sm">Join</button>
                </div>
              </div>
              <div class="card card-hover" style="cursor:pointer" onclick="StudySessionsPage.joinSession('Maths Marathon')">
                <div class="flex items-center gap-md">
                  <div class="avatar" style="background:${Helpers.avatarColor('James Wilson')}">JW</div>
                  <div style="flex:1">
                    <div style="font-weight:600">Maths Marathon</div>
                    <div class="text-muted" style="font-size:0.8rem">Mathematics | 2 participants</div>
                  </div>
                  <button class="btn btn-primary btn-sm">Join</button>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <h3 class="card-title" style="margin-bottom:12px">Online Friends</h3>
            ${onlineFriends.length === 0 ? '<div class="text-muted" style="font-size:0.9rem">No friends online</div>' :
              onlineFriends.map(f => `
                <div class="flex items-center gap-md" style="padding:8px 0;border-bottom:1px solid var(--border-color)">
                  <div class="participant-status"></div>
                  <div class="avatar avatar-sm" style="background:${Helpers.avatarColor(f.name)}">${f.avatar}</div>
                  <div style="flex:1">
                    <div style="font-weight:500;font-size:0.9rem">${f.name}</div>
                  </div>
                  <button class="btn btn-ghost btn-sm" onclick="Component.toast('Invitation sent to ${f.name}!', 'success')">Invite</button>
                </div>
              `).join('')
            }
          </div>
        </div>

        <div>
          <div class="card">
            <h3 class="card-title" style="margin-bottom:16px">Quick Solo Session</h3>
            <p class="text-muted mb-md" style="font-size:0.9rem">Start a focused study timer with the Pomodoro technique.</p>
            <button class="btn btn-primary w-full" onclick="StudySessionsPage.startSolo()">Start Solo Session</button>
          </div>
        </div>
      </div>
    `;
  },

  _renderActive() {
    const session = this._activeSession;
    if (!session) return '';

    const participants = session.participants || [];
    const playlist = session.playlist || MockData.playlists[0];
    const currentTrack = MockData.tracks[0];

    return `
      <div class="grid grid-3 gap-lg">
        <!-- Timer -->
        <div style="grid-column:span 2">
          <div class="card">
            <div class="session-timer">
              <div class="text-muted mb-sm" style="font-size:0.9rem">${session.name}</div>
              <div class="timer-display" id="timerDisplay">25:00</div>
              <div class="timer-label" id="timerMode">Focus Time</div>
              <div class="timer-controls">
                <button class="btn btn-secondary" onclick="StudySessionsPage.setTimerMode('work')">Focus</button>
                <button class="btn btn-primary btn-lg" onclick="StudySessionsPage.toggleTimer()" id="timerToggleBtn">
                  ▶ Start
                </button>
                <button class="btn btn-secondary" onclick="StudySessionsPage.setTimerMode('break')">Break</button>
              </div>
              <div class="flex justify-center gap-lg mt-lg" style="font-size:0.85rem">
                <div style="text-align:center">
                  <div style="font-weight:600" id="sessionsCount">0</div>
                  <div class="text-muted">Sessions</div>
                </div>
                <div style="text-align:center">
                  <div style="font-weight:600" id="totalTimeDisplay">0m</div>
                  <div class="text-muted">Total</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Music Player -->
          <div class="card mt-md">
            <h4 style="margin-bottom:12px">🎵 Study Music</h4>
            <div class="music-player">
              <div class="music-art">🎵</div>
              <div class="music-info">
                <div class="music-title">${currentTrack.title}</div>
                <div class="music-artist">${currentTrack.artist} - ${currentTrack.duration}</div>
              </div>
              <div class="music-controls">
                <button class="btn btn-ghost btn-icon btn-sm">⏮</button>
                <button class="btn btn-ghost btn-icon btn-sm" onclick="Component.toast('Playing music...', 'info')">▶</button>
                <button class="btn btn-ghost btn-icon btn-sm">⏭</button>
              </div>
            </div>
            <div class="flex gap-sm mt-md" style="overflow-x:auto">
              ${MockData.playlists.map(p => `
                <div class="tag ${p.id === playlist.id ? 'active' : ''}" onclick="Component.toast('Switched to ${p.name}', 'info')">
                  ${p.emoji} ${p.name}
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div>
          <div class="card mb-md">
            <h4 style="margin-bottom:12px">Participants (${participants.length})</h4>
            <div class="participants-list">
              ${participants.map(p => `
                <div class="participant-item">
                  <div class="participant-status ${p.status || ''}"></div>
                  <div class="avatar avatar-sm" style="background:${Helpers.avatarColor(p.name)}">${Helpers.initials(p.name)}</div>
                  <div style="flex:1">
                    <div style="font-weight:500;font-size:0.85rem">${p.name}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted)">${p.status === 'away' ? 'On break' : 'Studying'}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="card mb-md">
            <h4 style="margin-bottom:12px">Invite Friends</h4>
            <div class="flex flex-col gap-sm">
              ${(Store.get('friends') || []).filter(f => f.online).slice(0, 3).map(f => `
                <div class="flex items-center gap-sm">
                  <div class="avatar avatar-sm" style="background:${Helpers.avatarColor(f.name)}">${f.avatar}</div>
                  <span style="flex:1;font-size:0.85rem">${f.name}</span>
                  <button class="btn btn-ghost btn-sm" onclick="Component.toast('Invited ${f.name}!', 'success')">Invite</button>
                </div>
              `).join('')}
            </div>
          </div>

          <button class="btn btn-danger w-full" onclick="StudySessionsPage.endSession()">
            End Session
          </button>
        </div>
      </div>
    `;
  },

  _renderHistory() {
    const sessions = Store.get('studySessions') || [];
    if (sessions.length === 0) {
      return `<div class="card"><div class="empty-state"><div class="empty-state-icon">📭</div><div class="empty-state-title">No session history</div><div class="empty-state-text">Start your first study session!</div></div></div>`;
    }

    return `
      <div class="flex flex-col gap-md">
        ${sessions.map(s => `
          <div class="card">
            <div class="flex justify-between items-center">
              <div>
                <div style="font-weight:600">${s.name}</div>
                <div class="text-muted" style="font-size:0.85rem">${Helpers.formatDate(s.date, 'long')} | ${s.duration || 0} min | ${s.participants || 1} participants</div>
              </div>
              <span class="badge badge-success">${Helpers.formatMinutes(s.duration || 0)}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  showCreate() {
    Modal.show({
      title: 'Create Study Session',
      content: `
        <div class="form-group">
          <label class="form-label">Session Name</label>
          <input type="text" class="form-input" id="sessionName" placeholder="e.g., English Essay Practice">
        </div>
        <div class="form-group">
          <label class="form-label">Focus Duration (minutes)</label>
          <select class="form-select" id="sessionDuration">
            <option value="25" selected>25 min (Pomodoro)</option>
            <option value="45">45 min</option>
            <option value="60">60 min</option>
          </select>
        </div>
      `,
      footer: `
        <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
        <button class="btn btn-primary" onclick="StudySessionsPage.createSession()">Create & Start</button>
      `
    });
  },

  createSession() {
    const name = document.getElementById('sessionName')?.value?.trim() || 'Study Session';
    Modal.close();
    this._startSession(name, [
      { name: Store.get('user')?.name || 'You', status: '' },
      { name: 'Sarah Chen', status: '' },
      { name: 'James Wilson', status: 'away' },
    ]);
  },

  joinSession(name) {
    this._startSession(name, [
      { name: Store.get('user')?.name || 'You', status: '' },
      { name: 'Sarah Chen', status: '' },
      { name: 'James Wilson', status: '' },
    ]);
    Component.toast(`Joined "${name}"!`, 'success');
  },

  startSolo() {
    this._startSession('Solo Focus Session', [
      { name: Store.get('user')?.name || 'You', status: '' },
    ]);
  },

  _startSession(name, participants) {
    this._activeSession = {
      name,
      participants,
      playlist: MockData.playlists[0],
      startTime: new Date(),
    };

    this._tab = 'active';
    this.render();

    // Initialize timer
    Timer.init(
      (seconds, mode, running) => {
        const display = document.getElementById('timerDisplay');
        const modeLabel = document.getElementById('timerMode');
        const toggleBtn = document.getElementById('timerToggleBtn');
        if (display) display.textContent = Helpers.formatTimer(seconds);
        if (modeLabel) modeLabel.textContent = mode === 'work' ? 'Focus Time' : mode === 'break' ? 'Short Break' : 'Long Break';
        if (toggleBtn) toggleBtn.innerHTML = running ? '⏸ Pause' : '▶ Start';
      },
      (mode, sessions) => {
        const countEl = document.getElementById('sessionsCount');
        if (countEl) countEl.textContent = sessions;
      }
    );

    Storage.addStudySession({
      name,
      date: new Date().toISOString(),
      duration: 0,
      participants: participants.length,
    });
    Storage.checkAchievements();
  },

  toggleTimer() {
    Timer.toggle();
  },

  setTimerMode(mode) {
    Timer.setMode(mode);
  },

  endSession() {
    Timer.destroy();
    const session = this._activeSession;
    if (session) {
      const mins = Math.round((new Date() - new Date(session.startTime)) / 60000);
      Storage.addStudyTime(mins);

      // Update session history
      const sessions = Store.get('studySessions') || [];
      if (sessions.length > 0) {
        sessions[0].duration = mins;
        Store.set('studySessions', sessions);
      }
    }
    this._activeSession = null;
    this._tab = 'active';
    this.render();
    Component.toast('Session ended!', 'info');
  }
};
