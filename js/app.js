// Main Application
const App = {
  init() {
    // Initialize store
    Store.init();

    // Apply theme
    const theme = Store.get('theme') || 'dark';
    document.body.className = `theme-${theme}`;

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
        this.renderLayout();
        handler();
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
      app.innerHTML = `
        ${Sidebar.render()}
        ${TopBar.render()}
        <div class="mobile-overlay" id="mobileOverlay" onclick="Sidebar.toggleMobile()"></div>
        <main class="main-content ${collapsed ? 'sidebar-collapsed' : ''}" id="mainContent">
          <div id="pageContent"></div>
        </main>
      `;
    } else {
      // Update sidebar and topbar
      const sidebar = document.getElementById('sidebar');
      if (sidebar) sidebar.outerHTML = Sidebar.render();

      const topbar = document.getElementById('topbar');
      if (topbar) topbar.outerHTML = TopBar.render();

      const mainContent = document.getElementById('mainContent');
      if (mainContent) {
        mainContent.className = `main-content ${collapsed ? 'sidebar-collapsed' : ''}`;
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
