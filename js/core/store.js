// Simple reactive state management
const Store = {
  _state: {},
  _listeners: [],
  _key: 'atar_platform_state',

  init() {
    const saved = localStorage.getItem(this._key);
    if (saved) {
      try {
        this._state = JSON.parse(saved);
      } catch (e) {
        this._state = this._getDefaultState();
      }
    } else {
      this._state = this._getDefaultState();
    }
  },

  _getDefaultState() {
    return {
      user: null,
      isAuthenticated: false,
      onboardingComplete: false,
      theme: 'dark',
      sidebarCollapsed: false,
      subjects: [],
      atarGoal: 90,
      markerHistory: [],
      guideHistory: [],
      practiceHistory: [],
      flashcardDecks: [],
      studySessions: [],
      studyPlanner: [],
      resources: [],
      friends: [],
      achievements: [],
      studyStreak: 0,
      lastStudyDate: null,
      totalStudyMinutes: 0,
      dailyStudyMinutes: {},
      settings: {
        pomodoroWork: 25,
        pomodoroBreak: 5,
        pomodoroLongBreak: 15,
        dailyGoalMinutes: 120,
        weeklyGoalHours: 15,
        notifications: true,
        soundEnabled: true,
      }
    };
  },

  get(key) {
    if (key) {
      return key.split('.').reduce((obj, k) => obj?.[k], this._state);
    }
    return this._state;
  },

  set(key, value) {
    const keys = key.split('.');
    let obj = this._state;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    this._save();
    this._notify();
  },

  update(updater) {
    if (typeof updater === 'function') {
      updater(this._state);
    } else {
      Object.assign(this._state, updater);
    }
    this._save();
    this._notify();
  },

  subscribe(listener) {
    this._listeners.push(listener);
    return () => {
      this._listeners = this._listeners.filter(l => l !== listener);
    };
  },

  _save() {
    try {
      localStorage.setItem(this._key, JSON.stringify(this._state));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  },

  _notify() {
    this._listeners.forEach(l => l(this._state));
  },

  reset() {
    this._state = this._getDefaultState();
    this._save();
    this._notify();
  }
};
