// Modal component
const Modal = {
  _stack: [],

  show(options) {
    const { title, content, footer, large, onClose } = options;
    const id = 'modal-' + Helpers.uid();

    const html = `
      <div class="modal-overlay" id="${id}" onclick="Modal._overlayClick(event, '${id}')">
        <div class="modal ${large ? 'modal-lg' : ''}" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">${title || ''}</h3>
            <button class="modal-close" onclick="Modal.close('${id}')">&times;</button>
          </div>
          <div class="modal-body" id="${id}-body">
            ${content || ''}
          </div>
          ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    this._stack.push({ id, onClose });
    return id;
  },

  close(id) {
    if (!id && this._stack.length > 0) {
      id = this._stack[this._stack.length - 1].id;
    }
    const el = document.getElementById(id);
    if (el) {
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 200);
    }
    const idx = this._stack.findIndex(m => m.id === id);
    if (idx !== -1) {
      const modal = this._stack[idx];
      if (modal.onClose) modal.onClose();
      this._stack.splice(idx, 1);
    }
  },

  closeAll() {
    [...this._stack].forEach(m => this.close(m.id));
  },

  _overlayClick(event, id) {
    if (event.target.classList.contains('modal-overlay')) {
      this.close(id);
    }
  },

  // Confirmation dialog
  confirm(message, onConfirm) {
    const id = this.show({
      title: 'Confirm',
      content: `<p style="font-size:0.95rem;color:var(--text-secondary)">${message}</p>`,
      footer: `
        <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
        <button class="btn btn-primary" onclick="Modal._confirmAction('${Helpers.uid()}')">Confirm</button>
      `
    });
    this._pendingConfirm = { id, onConfirm };
    return id;
  },

  _confirmAction(key) {
    if (this._pendingConfirm) {
      const { id, onConfirm } = this._pendingConfirm;
      this.close(id);
      if (onConfirm) onConfirm();
      this._pendingConfirm = null;
    }
  }
};

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') Modal.close();
});
