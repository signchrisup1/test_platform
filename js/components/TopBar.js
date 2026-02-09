// Top bar component
const TopBar = {
  render() {
    const user = Store.get('user') || {};
    const collapsed = Store.get('sidebarCollapsed');
    const streak = Store.get('studyStreak') || 0;

    return `
      <header class="topbar ${collapsed ? 'sidebar-collapsed' : ''}" id="topbar">
        <div class="topbar-left">
          <button class="mobile-nav-toggle" onclick="Sidebar.toggleMobile()">☰</button>
          <button class="btn btn-ghost btn-icon hide-mobile" onclick="Sidebar.toggle()" data-tooltip="Toggle sidebar">
            ${collapsed ? '→' : '←'}
          </button>
          <div class="topbar-search hide-mobile">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="Search features, subjects..." id="globalSearch" onkeyup="TopBar.handleSearch(event)">
          </div>
        </div>
        <div class="topbar-right">
          ${streak > 0 ? `<div class="streak-badge">🔥 ${streak} day${streak !== 1 ? 's' : ''}</div>` : ''}
          <button class="btn btn-ghost btn-icon" onclick="TopBar.toggleTheme()" data-tooltip="Toggle theme">
            ${Store.get('theme') === 'dark' ? '☀️' : '🌙'}
          </button>
          <div class="dropdown" id="profileDropdown">
            <button class="btn btn-ghost btn-icon" onclick="TopBar.toggleProfile()" style="display:flex;align-items:center;gap:8px;">
              <div class="avatar avatar-sm" style="background:${Helpers.avatarColor(user.name)}">${Helpers.initials(user.name)}</div>
            </button>
            <div class="dropdown-menu" id="profileMenu" style="display:none">
              <div style="padding:12px 14px;border-bottom:1px solid var(--border-color)">
                <div style="font-weight:600;font-size:0.9rem">${user.name || 'Student'}</div>
                <div style="font-size:0.8rem;color:var(--text-muted)">Year ${user.yearLevel || 12}</div>
              </div>
              <div class="dropdown-item" onclick="Router.navigate('/settings')">⚙️ Settings</div>
              <div class="dropdown-item" onclick="Router.navigate('/analytics')">📊 My Progress</div>
              <div class="dropdown-item" onclick="App.logout()" style="color:var(--danger)">🚪 Logout</div>
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

      // Simple search routing
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
