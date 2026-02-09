// Pomodoro Timer component
const Timer = {
  _interval: null,
  _seconds: 0,
  _isRunning: false,
  _mode: 'work', // work, break, longBreak
  _sessionsCompleted: 0,
  _onTick: null,
  _onComplete: null,

  init(onTick, onComplete) {
    this._onTick = onTick;
    this._onComplete = onComplete;
    this.reset();
  },

  reset() {
    this.stop();
    const settings = Store.get('settings') || {};
    const durations = {
      work: (settings.pomodoroWork || 25) * 60,
      break: (settings.pomodoroBreak || 5) * 60,
      longBreak: (settings.pomodoroLongBreak || 15) * 60,
    };
    this._seconds = durations[this._mode];
    if (this._onTick) this._onTick(this._seconds, this._mode, this._isRunning);
  },

  start() {
    if (this._isRunning) return;
    this._isRunning = true;

    this._interval = setInterval(() => {
      this._seconds--;
      if (this._onTick) this._onTick(this._seconds, this._mode, this._isRunning);

      if (this._seconds <= 0) {
        this._handleComplete();
      }
    }, 1000);
  },

  stop() {
    this._isRunning = false;
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  },

  toggle() {
    if (this._isRunning) this.stop();
    else this.start();
    if (this._onTick) this._onTick(this._seconds, this._mode, this._isRunning);
  },

  setMode(mode) {
    this._mode = mode;
    this.reset();
  },

  getState() {
    return {
      seconds: this._seconds,
      mode: this._mode,
      isRunning: this._isRunning,
      sessionsCompleted: this._sessionsCompleted,
    };
  },

  _handleComplete() {
    this.stop();

    if (this._mode === 'work') {
      this._sessionsCompleted++;
      // Add study time
      const settings = Store.get('settings') || {};
      Storage.addStudyTime(settings.pomodoroWork || 25);
      Storage.checkAchievements();

      // Switch to break
      if (this._sessionsCompleted % 4 === 0) {
        this._mode = 'longBreak';
      } else {
        this._mode = 'break';
      }
    } else {
      this._mode = 'work';
    }

    this.reset();
    if (this._onComplete) this._onComplete(this._mode, this._sessionsCompleted);
    Component.toast(this._mode === 'work' ? 'Break over! Time to study.' : 'Great work! Take a break.', 'info');
  },

  destroy() {
    this.stop();
    this._onTick = null;
    this._onComplete = null;
  }
};
