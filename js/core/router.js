// Simple hash-based router
const Router = {
  _routes: {},
  _currentRoute: null,
  _beforeEach: null,

  register(path, handler) {
    this._routes[path] = handler;
  },

  beforeEach(guard) {
    this._beforeEach = guard;
  },

  navigate(path) {
    window.location.hash = path;
  },

  getCurrentRoute() {
    return this._currentRoute || window.location.hash.slice(1) || '/';
  },

  init() {
    window.addEventListener('hashchange', () => this._handleRoute());
    this._handleRoute();
  },

  _handleRoute() {
    const path = window.location.hash.slice(1) || '/';

    if (this._beforeEach) {
      const redirect = this._beforeEach(path);
      if (redirect && redirect !== path) {
        this.navigate(redirect);
        return;
      }
    }

    this._currentRoute = path;
    const handler = this._routes[path];
    if (handler) {
      handler();
    } else {
      // Try to find a matching route
      const route = Object.keys(this._routes).find(r => path.startsWith(r));
      if (route) {
        this._routes[route]();
      } else if (this._routes['/']) {
        this._routes['/']();
      }
    }
  }
};
