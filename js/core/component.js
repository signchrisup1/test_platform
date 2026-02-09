// Simple component rendering helpers
const Component = {
  render(containerId, html) {
    const el = document.getElementById(containerId);
    if (el) el.innerHTML = html;
    return el;
  },

  renderTo(element, html) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) element.innerHTML = html;
    return element;
  },

  // Mount html to #app
  mount(html) {
    const app = document.getElementById('app');
    if (app) app.innerHTML = html;
  },

  // Create element from html string
  create(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html.trim();
    return temp.firstChild;
  },

  // Attach event listeners after render
  on(selector, event, handler) {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener(event, handler);
    });
  },

  // Delegate event (good for dynamic content)
  delegate(parentSelector, childSelector, event, handler) {
    const parent = document.querySelector(parentSelector);
    if (!parent) return;
    parent.addEventListener(event, (e) => {
      const target = e.target.closest(childSelector);
      if (target && parent.contains(target)) {
        handler(e, target);
      }
    });
  },

  // Simple toast notification
  toast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: '&#10003;', error: '&#10007;', info: 'i', warning: '!' };
    toast.innerHTML = `<span>${icons[type] || ''}</span> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  // Show a simple loading state
  showLoading(containerId) {
    const el = document.getElementById(containerId);
    if (el) {
      el.innerHTML = `<div style="display:flex;justify-content:center;padding:40px;"><div class="spinner"></div></div>`;
    }
  }
};
