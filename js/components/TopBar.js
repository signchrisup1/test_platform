// Top bar component
const TopBar = {
  render() {
    const user = Store.get('user') || {};
    const collapsed = Store.get('sidebarCollapsed');
    const streak = Store.get('studyStreak') || 0;

    return `
      <header class="topbar ${collapsed ? 'sidebar-collapsed' : ''}" id="topbar">
        <div class="topbar-left">
          <button class="mobile-nav-toggle" onclick="Sidebar.toggleMobile()">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <button class="btn btn-ghost btn-icon hide-mobile" onclick="Sidebar.toggle()" data-tooltip="Toggle sidebar">
            ${collapsed
              ? '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>'
              : '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>'}
          </button>
          <div class="topbar-search hide-mobile">
            <span class="search-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input type="text" placeholder="Search features, subjects..." id="globalSearch" onkeyup="TopBar.handleSearch(event)">
            <span class="search-shortcut hide-mobile">
              <kbd>/</kbd>
            </span>
          </div>
        </div>
        <div class="topbar-right">
          ${streak > 0 ? `<div class="streak-badge"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> ${streak} day${streak !== 1 ? 's' : ''}</div>` : ''}
          <button class="btn btn-ghost btn-icon" onclick="TopBar.toggleTheme()" data-tooltip="Toggle theme">
            ${Store.get('theme') === 'dark'
              ? '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
              : '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'}
          </button>
          <div class="dropdown" id="profileDropdown">
            <button class="btn btn-ghost btn-icon" onclick="TopBar.toggleProfile()" style="display:flex;align-items:center;gap:8px;">
              <div class="avatar avatar-sm" style="background:${Helpers.avatarColor(user.name)}">${Helpers.initials(user.name)}</div>
            </button>
            <div class="dropdown-menu" id="profileMenu" style="display:none">
              <div style="padding:14px 16px;border-bottom:1px solid var(--border-color)">
                <div style="font-weight:600;font-size:0.9rem">${user.name || 'Student'}</div>
                <div style="font-size:0.8rem;color:var(--text-muted)">Year ${user.yearLevel || 12}</div>
              </div>
              <div class="dropdown-item" onclick="Router.navigate('/settings')">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                Settings
              </div>
              <div class="dropdown-item" onclick="Router.navigate('/analytics')">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                My Progress
              </div>
              <div class="dropdown-item" onclick="App.logout()" style="color:var(--danger)">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Logout
              </div>
            </div>
          </div>
        </div>
      </header>
    `;
  },

  toggleTheme() {
    const current = Store.get('theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    Store.set('theme', newTheme);
    document.body.className = `theme-${newTheme}`;
    App.renderLayout();
  },

  toggleProfile() {
    const menu = document.getElementById('profileMenu');
    if (menu) {
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }
    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', function handler(e) {
        if (!e.target.closest('#profileDropdown')) {
          const m = document.getElementById('profileMenu');
          if (m) m.style.display = 'none';
          document.removeEventListener('click', handler);
        }
      });
    }, 10);
  },

  handleSearch(e) {
    if (e.key === 'Enter') {
      const query = e.target.value.toLowerCase().trim();
      if (!query) return;

      const routes = {
        'mark': '/marker', 'grade': '/marker', 'marker': '/marker',
        'guide': '/guide', 'breakdown': '/guide', 'help': '/guide',
        'practice': '/practice', 'question': '/practice', 'quiz': '/practice',
        'subject': '/subjects', 'syllabus': '/subjects',
        'flash': '/flashcards', 'card': '/flashcards',
        'session': '/sessions', 'study': '/sessions',
        'analytic': '/analytics', 'progress': '/analytics', 'stat': '/analytics',
        'plan': '/planner', 'schedule': '/planner', 'timetable': '/planner',
        'friend': '/friends', 'leader': '/friends',
        'resource': '/resources', 'file': '/resources',
        'setting': '/settings', 'profile': '/settings',
      };

      for (const [key, route] of Object.entries(routes)) {
        if (query.includes(key)) {
          Router.navigate(route);
          e.target.value = '';
          return;
        }
      }

      Component.toast('Try searching for: marker, guide, practice, subjects, flashcards...', 'info');
    }
  }
};
