// Utility functions
const Helpers = {
  // Generate unique ID
  uid() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  },

  // Format date
  formatDate(date, format = 'short') {
    const d = new Date(date);
    if (format === 'short') return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
    if (format === 'long') return d.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    if (format === 'time') return d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
    if (format === 'datetime') return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    if (format === 'relative') return this.timeAgo(d);
    return d.toLocaleDateString('en-AU');
  },

  // Time ago
  timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
    ];
    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
    return 'just now';
  },

  // Format minutes to hours/minutes
  formatMinutes(mins) {
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  },

  // Format timer display (seconds to MM:SS)
  formatTimer(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  },

  // Truncate text
  truncate(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  // Get today's date string (YYYY-MM-DD)
  today() {
    return new Date().toISOString().split('T')[0];
  },

  // Random item from array
  randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  // Shuffle array
  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  // Random integer between min and max (inclusive)
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Debounce function
  debounce(fn, ms = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  },

  // Escape HTML
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // Get color for subject
  subjectColor(index) {
    const colors = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#8b5cf6'];
    return colors[index % colors.length];
  },

  // Get avatar color from name
  avatarColor(name) {
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#f97316'];
    return colors[Math.abs(hash) % colors.length];
  },

  // Get initials from name
  initials(name) {
    return (name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  },

  // Calculate percentage
  percentage(value, total) {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  },

  // Clamp number
  clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  },

  // Get greeting based on time
  getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  },

  // Get day of week
  getDayOfWeek(date) {
    return new Date(date).toLocaleDateString('en-AU', { weekday: 'short' });
  },

  // Get week dates (Mon-Sun)
  getWeekDates(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const dd = new Date(monday);
      dd.setDate(monday.getDate() + i);
      dates.push(dd);
    }
    return dates;
  }
};
