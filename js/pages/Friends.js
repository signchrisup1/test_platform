// Friends & Leaderboard
const FriendsPage = {
  _tab: 'leaderboard', // leaderboard, friends

  render() {
    const content = document.getElementById('pageContent');
    if (!content) return;

    const friends = Store.get('friends') || [];

    content.innerHTML = `
      <div class="page-content">
        <div class="flex justify-between items-center mb-lg">
          <div>
            <h1><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--primary-light)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M20 8v6"/><path d="M23 11h-6"/></svg> Friends & Leaderboard</h1>
            <p class="text-muted mt-sm" style="font-size:0.9rem">Compete and study with friends</p>
          </div>
          <button class="btn btn-primary" onclick="FriendsPage.addFriend()">+ Add Friend</button>
        </div>

        <div class="tabs">
          <button class="tab ${this._tab === 'leaderboard' ? 'active' : ''}" onclick="FriendsPage.switchTab('leaderboard')">Weekly Leaderboard</button>
          <button class="tab ${this._tab === 'friends' ? 'active' : ''}" onclick="FriendsPage.switchTab('friends')">Friends (${friends.length})</button>
        </div>

        <div id="friendsContent">
          ${this._tab === 'leaderboard' ? this._renderLeaderboard() : this._renderFriends()}
        </div>
      </div>
    `;
  },

  switchTab(tab) {
    this._tab = tab;
    this.render();
  },

  _renderLeaderboard() {
    const friends = Store.get('friends') || [];
    const user = Store.get('user') || {};
    const totalMins = Store.get('totalStudyMinutes') || 0;

    // Create leaderboard with user included
    const leaderboard = [
      { name: user.name || 'You', studyMinutes: totalMins, questionsAnswered: (Store.get('practiceHistory') || []).length, isUser: true, streak: Store.get('studyStreak') || 0 },
      ...friends,
    ].sort((a, b) => b.studyMinutes - a.studyMinutes);

    return `
      <div class="grid grid-3 gap-lg">
        <div style="grid-column:span 2">
          <div class="card">
            <h3 class="card-title" style="margin-bottom:16px">🏆 Weekly Study Leaderboard</h3>
            <div>
              ${leaderboard.map((f, i) => {
                const rank = i + 1;
                const rankClass = rank <= 3 ? `top-${rank}` : '';
                const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';

                return `
                  <div class="leaderboard-item ${f.isUser ? 'card-gradient' : ''}">
                    <div class="leaderboard-rank ${rankClass}">${medal || rank}</div>
                    <div class="avatar" style="background:${Helpers.avatarColor(f.name)}">
                      ${f.isUser ? Helpers.initials(f.name) : (f.avatar || Helpers.initials(f.name))}
                    </div>
                    <div class="leaderboard-info">
                      <div class="leaderboard-name">${f.name} ${f.isUser ? '(You)' : ''}</div>
                      <div class="leaderboard-stats">
                        ${f.questionsAnswered || 0} questions | 🔥 ${f.streak || 0} day streak
                      </div>
                    </div>
                    <div class="leaderboard-score">${Helpers.formatMinutes(f.studyMinutes || 0)}</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <div>
          <div class="card mb-md">
            <h4 style="margin-bottom:12px">This Week's Challenge</h4>
            <div style="padding:16px;background:var(--bg-input);border-radius:var(--radius-sm);text-align:center">
              <div style="font-size:2rem;margin-bottom:8px">🎯</div>
              <div style="font-weight:600;margin-bottom:4px">Study Sprint</div>
              <div class="text-muted" style="font-size:0.85rem;margin-bottom:12px">Study for 10 hours this week to earn a badge!</div>
              <div class="progress-bar" style="height:8px">
                <div class="progress-bar-fill" style="width:${Math.min(100, ((Store.get('totalStudyMinutes') || 0) / 600) * 100)}%"></div>
              </div>
            </div>
          </div>

          <div class="card">
            <h4 style="margin-bottom:12px">Online Now</h4>
            ${friends.filter(f => f.online).map(f => `
              <div class="flex items-center gap-sm" style="padding:6px 0">
                <div class="participant-status"></div>
                <div class="avatar avatar-sm" style="background:${Helpers.avatarColor(f.name)}">${f.avatar}</div>
                <span style="font-size:0.85rem">${f.name}</span>
              </div>
            `).join('') || '<div class="text-muted" style="font-size:0.85rem">No friends online</div>'}
          </div>
        </div>
      </div>
    `;
  },

  _renderFriends() {
    const friends = Store.get('friends') || [];

    return `
      <div class="grid grid-2 gap-md">
        ${friends.map(f => `
          <div class="card">
            <div class="flex items-center gap-md mb-md">
              <div class="avatar avatar-lg" style="background:${Helpers.avatarColor(f.name)}">${f.avatar}</div>
              <div style="flex:1">
                <div class="flex items-center gap-sm">
                  <div style="font-weight:600;font-size:1.1rem">${f.name}</div>
                  <div class="participant-status ${f.online ? '' : 'offline'}"></div>
                </div>
                <div class="text-muted" style="font-size:0.85rem">${f.online ? 'Online' : 'Offline'}</div>
              </div>
              <div class="dropdown">
                <button class="btn btn-ghost btn-icon btn-sm">⋮</button>
              </div>
            </div>
            <div class="grid grid-3 gap-sm" style="text-align:center;font-size:0.85rem">
              <div>
                <div style="font-weight:600">${Helpers.formatMinutes(f.studyMinutes)}</div>
                <div class="text-muted" style="font-size:0.75rem">Study Time</div>
              </div>
              <div>
                <div style="font-weight:600">${f.questionsAnswered}</div>
                <div class="text-muted" style="font-size:0.75rem">Questions</div>
              </div>
              <div>
                <div style="font-weight:600">🔥 ${f.streak}</div>
                <div class="text-muted" style="font-size:0.75rem">Streak</div>
              </div>
            </div>
            <div class="flex gap-sm mt-md">
              <button class="btn btn-secondary btn-sm" style="flex:1" onclick="Component.toast('Study challenge sent to ${f.name}!', 'success')">Challenge</button>
              <button class="btn btn-ghost btn-sm" onclick="Component.toast('Encouragement sent!', 'success')">👍</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  addFriend() {
    Modal.show({
      title: 'Add Friend',
      content: `
        <div class="form-group">
          <label class="form-label">Friend's Email or Username</label>
          <input type="text" class="form-input" id="friendEmail" placeholder="Enter email or username">
        </div>
        <div class="text-muted" style="font-size:0.85rem">Your friend will receive an invitation to connect.</div>
      `,
      footer: `
        <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
        <button class="btn btn-primary" onclick="FriendsPage.sendInvite()">Send Invite</button>
      `
    });
  },

  sendInvite() {
    const email = document.getElementById('friendEmail')?.value?.trim();
    if (!email) { Component.toast('Please enter an email or username', 'warning'); return; }
    Modal.close();
    Component.toast(`Invitation sent to ${email}!`, 'success');
  }
};
