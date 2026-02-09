// Sidebar navigation component
const Sidebar = {
  render() {
    const collapsed = Store.get('sidebarCollapsed');
    const currentRoute = Router.getCurrentRoute();

    const navItems = [
      { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
      { path: '/marker', icon: '✏️', label: 'Marker' },
      { path: '/guide', icon: '📋', label: 'Guide' },
      { path: '/practice', icon: '🎯', label: 'Practice' },
      { section: 'Study Tools' },
      { path: '/subjects', icon: '📚', label: 'Subjects' },
      { path: '/flashcards', icon: '🃏', label: 'Flashcards' },
      { path: '/sessions', icon: '👥', label: 'Study Sessions' },
      { section: 'Progress' },
      { path: '/analytics', icon: '📊', label: 'Analytics' },
      { path: '/planner', icon: '📅', label: 'Planner' },
      { section: 'Social' },
      { path: '/friends', icon: '👋', label: 'Friends' },
      { path: '/resources', icon: '📁', label: 'Resources' },
    ];

    const navHtml = navItems.map(item => {
      if (item.section) {
        return collapsed ? '' : `<div class="sidebar-section"><div class="sidebar-section-title">${item.section}</div></div>`;
      }
      const active = currentRoute === item.path ? 'active' : '';
      return `
        <button class="nav-item ${active}" onclick="Router.navigate('${item.path}')" data-tooltip="${collapsed ? item.label : ''}">
          <span class="nav-icon">${item.icon}</span>
          ${collapsed ? '' : `<span>${item.label}</span>`}
        </button>
      `;
    }).join('');

    return `
      <aside class="sidebar ${collapsed ? 'collapsed' : ''}" id="sidebar">
        <div class="sidebar-header">
          <span style="font-size:1.5rem">📚</span>
          ${collapsed ? '' : '<span class="sidebar-logo text-gradient">ATAR Study</span>'}
        </div>
        <nav class="sidebar-nav">
          ${navHtml}
        </nav>
        <div class="sidebar-footer">
          <button class="nav-item" onclick="Router.navigate('/settings')">
            <span class="nav-icon">⚙️</span>
            ${collapsed ? '' : '<span>Settings</span>'}
          </button>
        </div>
      </aside>
    `;
  },

  toggle() {
    Store.set('sidebarCollapsed', !Store.get('sidebarCollapsed'));
    App.renderLayout();
  },

  toggleMobile() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobileOverlay');
    if (sidebar) {
      sidebar.classList.toggle('mobile-open');
      if (overlay) overlay.classList.toggle('active');
    }
  },

  closeMobile() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobileOverlay');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (overlay) overlay.classList.remove('active');
  }
};
