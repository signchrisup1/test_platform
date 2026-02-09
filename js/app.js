// Main Application
const App = {
  init() {
    // Initialize store
    Store.init();

    // Apply theme
    const theme = Store.get('theme') || 'dark';
    document.body.className = `theme-${theme}`;

    // Global error handler to catch rendering errors
    window.onerror = function(msg, url, line, col, error) {
      console.error('App Error:', msg, 'at', url, line, col, error);
      var pageContent = document.getElementById('pageContent');
      if (pageContent && !pageContent.innerHTML.trim()) {
        pageContent.innerHTML = '<div class="page-content"><div class="card" style="padding:40px;text-align:center"><h3 style="margin-bottom:8px">Something went wrong</h3><p class="text-muted">' + msg + '</p><button class="btn btn-primary mt-md" onclick="location.reload()">Reload</button></div></div>';
      }
    };

    // Set up router guards
    Router.beforeEach((path) => {
      const isAuth = Store.get('isAuthenticated');
      const onboardingDone = Store.get('onboardingComplete');

      if (!isAuth && path !== '/' && path !== '/login') {
        return '/';
      }

      if (isAuth && !onboardingDone && path !== '/onboarding') {
        return '/onboarding';
      }

      if (isAuth && onboardingDone && (path === '/' || path === '/login')) {
        return '/dashboard';
      }

      return path;
    });

    // Register routes
    Router.register('/', () => AuthPage.render());
    Router.register('/login', () => AuthPage.render());
    Router.register('/onboarding', () => OnboardingPage.render());

    // All main routes use the layout
    const mainPages = {
      '/dashboard': () => DashboardPage.render(),
      '/marker': () => MarkerPage.render(),
      '/guide': () => GuidePage.render(),
      '/practice': () => PracticePage.render(),
      '/subjects': () => SubjectsPage.render(),
      '/flashcards': () => FlashcardsPage.render(),
      '/sessions': () => StudySessionsPage.render(),
      '/analytics': () => AnalyticsPage.render(),
      '/planner': () => PlannerPage.render(),
      '/friends': () => FriendsPage.render(),
      '/resources': () => ResourcesPage.render(),
      '/settings': () => SettingsPage.render(),
    };

    Object.entries(mainPages).forEach(([path, handler]) => {
      Router.register(path, () => {
        try {
          this.renderLayout();
        } catch (e) {
          console.error('Layout render error:', e);
        }
        try {
          handler();
        } catch (e) {
          console.error('Page render error for ' + path + ':', e);
          var pc = document.getElementById('pageContent');
          if (pc) {
            pc.innerHTML = '<div class="page-content"><div class="card" style="padding:40px;text-align:center"><h3 style="margin-bottom:8px">Error loading page</h3><p class="text-muted">' + e.message + '</p><button class="btn btn-primary mt-md" onclick="Router.navigate(\'/dashboard\')">Go to Dashboard</button></div></div>';
          }
        }
      });
    });

    // Start router
    Router.init();

    // Subscribe to state changes for achievements
    Store.subscribe(() => {
      // Periodically check achievements
    });
  },

  renderLayout() {
    const collapsed = Store.get('sidebarCollapsed');
    const app = document.getElementById('app');
    if (!app) return;

    // Only re-render layout if needed
    if (!document.getElementById('sidebar')) {
      var sidebarHtml = '';
      var topbarHtml = '';
      try { sidebarHtml = Sidebar.render(); } catch(e) { console.error('Sidebar render error:', e); sidebarHtml = '<aside class="sidebar" id="sidebar"></aside>'; }
      try { topbarHtml = TopBar.render(); } catch(e) { console.error('TopBar render error:', e); topbarHtml = '<header class="topbar" id="topbar"></header>'; }

      app.innerHTML =
        sidebarHtml +
        topbarHtml +
        '<div class="mobile-overlay" id="mobileOverlay" onclick="Sidebar.toggleMobile()"></div>' +
        '<main class="main-content ' + (collapsed ? 'sidebar-collapsed' : '') + '" id="mainContent">' +
          '<div id="pageContent"></div>' +
        '</main>';
    } else {
      // Update sidebar and topbar
      var sidebar = document.getElementById('sidebar');
      if (sidebar) {
        try { sidebar.outerHTML = Sidebar.render(); } catch(e) { console.error('Sidebar update error:', e); }
      }

      var topbar = document.getElementById('topbar');
      if (topbar) {
        try { topbar.outerHTML = TopBar.render(); } catch(e) { console.error('TopBar update error:', e); }
      }

      var mainContent = document.getElementById('mainContent');
      if (mainContent) {
        mainContent.className = 'main-content ' + (collapsed ? 'sidebar-collapsed' : '');
      }

      // Ensure pageContent exists
      if (!document.getElementById('pageContent')) {
        var mc = document.getElementById('mainContent');
        if (mc) {
          mc.innerHTML = '<div id="pageContent"></div>';
        }
      }
    }
  },

  logout() {
    Timer.destroy();
    Store.update({ isAuthenticated: false });
    Router.navigate('/');
  }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
