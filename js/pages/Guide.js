// GUIDE - Question Breakdown Assistant
const GuidePage = {
  _result: null,
  _tab: 'new', // new, saved, history

  render() {
    const content = document.getElementById('pageContent');
    if (!content) return;

    const history = Store.get('guideHistory') || [];
    const savedCount = history.filter(h => h.saved).length;

    content.innerHTML = `
      <div class="page-content">
        <div class="flex justify-between items-center mb-lg">
          <div>
            <h1>📋 Guide</h1>
            <p class="text-muted mt-sm" style="font-size:0.9rem">Break down complex questions into manageable steps</p>
          </div>
        </div>

        <div class="tabs">
          <button class="tab ${this._tab === 'new' ? 'active' : ''}" onclick="GuidePage.switchTab('new')">New Breakdown</button>
          <button class="tab ${this._tab === 'saved' ? 'active' : ''}" onclick="GuidePage.switchTab('saved')">Saved (${savedCount})</button>
          <button class="tab ${this._tab === 'history' ? 'active' : ''}" onclick="GuidePage.switchTab('history')">History (${history.length})</button>
        </div>

        <div id="guideContent">
          ${this._tab === 'new' ? this._renderNew() : this._tab === 'saved' ? this._renderSaved() : this._renderHistoryList()}
        </div>
      </div>
    `;
  },

  switchTab(tab) {
    this._tab = tab;
    this._result = null;
    this.render();
  },

  _renderNew() {
    return `
      <div class="grid grid-2 gap-lg">
        <div>
          <div class="card">
            <h3 class="card-title" style="margin-bottom:16px">Enter Your Question</h3>
            <div class="form-group">
              <label class="form-label">Paste or type the question you're struggling with</label>
              <textarea class="form-textarea" id="guideQuestion" placeholder="e.g., 'Evaluate the extent to which World War I transformed Australian national identity. Support your response with relevant evidence.'" rows="6"></textarea>
            </div>
            <button class="btn btn-primary w-full" onclick="GuidePage.submit()" id="guideSubmitBtn">
              Break Down Question
            </button>
          </div>
        </div>
        <div id="guideResults">
          ${this._result ? this._renderResult(this._result) : this._renderPlaceholder()}
        </div>
      </div>
    `;
  },

  _renderPlaceholder() {
    return `
      <div class="card" style="min-height:400px;display:flex;align-items:center;justify-content:center">
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <div class="empty-state-title">Paste a question</div>
          <div class="empty-state-text">Enter any exam question and get a detailed breakdown including command words, content points, structure guide, and common pitfalls.</div>
        </div>
      </div>
    `;
  },

  _renderResult(result, showSaveBtn = true) {
    return `
      <div class="guide-result flex flex-col gap-md">
        ${showSaveBtn && result._id ? `
          <div class="flex justify-end">
            <button class="btn btn-sm ${result._saved ? 'btn-success' : 'btn-secondary'}" onclick="GuidePage.toggleSave('${result._id}')">
              ${result._saved ? '★ Saved' : '☆ Save Guide'}
            </button>
          </div>
        ` : ''}

        <!-- Command Words -->
        <div class="card">
          <div class="guide-section">
            <h4>🔑 Command Words</h4>
            ${result.commandWords.map(cw => `
              <div style="padding:10px;background:var(--bg-input);border-radius:var(--radius-sm);margin-bottom:8px">
                <div style="font-weight:600;color:var(--primary-light);margin-bottom:4px">${cw.word}</div>
                <div style="font-size:0.85rem;color:var(--text-secondary)">${cw.meaning}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Content Points -->
        <div class="card">
          <div class="guide-section">
            <h4>📝 Key Content Points</h4>
            <ul>${result.contentPoints.map(p => `<li>${p}</li>`).join('')}</ul>
          </div>
        </div>

        <!-- Recommended Length -->
        <div class="card">
          <div class="guide-section">
            <h4>📏 Recommended Length</h4>
            <div class="badge badge-primary" style="font-size:0.9rem;padding:6px 16px">${result.recommendedLength}</div>
          </div>
        </div>

        <!-- Structure Framework -->
        <div class="card">
          <div class="guide-section">
            <h4>🏗️ Suggested Structure</h4>
            <div class="guide-framework">
              ${result.structure.map(s => `
                <div class="framework-item">
                  <div class="framework-label">${s.section}</div>
                  <div style="font-size:0.9rem;color:var(--text-secondary)">${s.detail}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Key Concepts -->
        <div class="card">
          <div class="guide-section">
            <h4>💡 Key Concepts to Address</h4>
            <ul>${result.keyConcepts.map(c => `<li>${c}</li>`).join('')}</ul>
          </div>
        </div>

        <!-- Common Pitfalls -->
        <div class="card">
          <div class="guide-section">
            <h4>⚠️ Common Pitfalls to Avoid</h4>
            <ul>${result.pitfalls.map(p => `<li>${p}</li>`).join('')}</ul>
          </div>
        </div>
      </div>
    `;
  },

  _renderSaved() {
    const history = (Store.get('guideHistory') || []).filter(h => h.saved);
    if (history.length === 0) {
      return `<div class="card"><div class="empty-state"><div class="empty-state-icon">☆</div><div class="empty-state-title">No saved guides</div><div class="empty-state-text">Save useful question breakdowns for quick reference.</div></div></div>`;
    }
    return this._renderList(history);
  },

  _renderHistoryList() {
    const history = Store.get('guideHistory') || [];
    if (history.length === 0) {
      return `<div class="card"><div class="empty-state"><div class="empty-state-icon">📭</div><div class="empty-state-title">No history yet</div><div class="empty-state-text">Break down a question to start.</div><button class="btn btn-primary" onclick="GuidePage.switchTab('new')">Get Started</button></div></div>`;
    }
    return this._renderList(history);
  },

  _renderList(items) {
    return `
      <div class="flex flex-col gap-md">
        ${items.map(h => `
          <div class="card card-hover" style="cursor:pointer" onclick="GuidePage.viewItem('${h.id}')">
            <div class="flex justify-between items-start">
              <div style="flex:1">
                <div class="flex items-center gap-sm mb-sm">
                  ${h.saved ? '<span style="color:var(--warning)">★</span>' : ''}
                  <span class="text-muted" style="font-size:0.8rem">${Helpers.formatDate(h.timestamp, 'relative')}</span>
                </div>
                <div style="font-weight:500">${Helpers.truncate(h.question, 100)}</div>
                <div class="flex gap-sm mt-sm">
                  ${(h.result?.commandWords || []).map(cw => `<span class="badge badge-primary">${cw.word}</span>`).join('')}
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  async submit() {
    const question = document.getElementById('guideQuestion')?.value?.trim();
    if (!question) { Component.toast('Please enter a question', 'warning'); return; }

    const btn = document.getElementById('guideSubmitBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px"></div> Analysing...'; }

    const resultsDiv = document.getElementById('guideResults');
    if (resultsDiv) resultsDiv.innerHTML = `<div class="card" style="min-height:300px;display:flex;align-items:center;justify-content:center"><div class="spinner"></div></div>`;

    try {
      const result = await MockAI.breakdownQuestion(question);

      // Save to history
      const entry = { question, result, timestamp: result.timestamp };
      Storage.addGuideHistory(entry);
      const history = Store.get('guideHistory') || [];
      result._id = history[0]?.id;
      result._saved = false;

      this._result = result;
      Storage.addStudyTime(3);

      if (resultsDiv) resultsDiv.innerHTML = this._renderResult(result);
      Component.toast('Question breakdown complete!', 'success');
    } catch (e) {
      Component.toast('Failed to break down question', 'error');
    }

    if (btn) { btn.disabled = false; btn.innerHTML = 'Break Down Question'; }
  },

  toggleSave(id) {
    Storage.toggleGuideSaved(id);
    const history = Store.get('guideHistory') || [];
    const item = history.find(h => h.id === id);
    if (item) {
      Component.toast(item.saved ? 'Guide saved!' : 'Guide unsaved', 'success');
    }
    if (this._tab !== 'new') this.render();
    else {
      if (this._result) {
        this._result._saved = item?.saved;
        const resultsDiv = document.getElementById('guideResults');
        if (resultsDiv) resultsDiv.innerHTML = this._renderResult(this._result);
      }
    }
  },

  viewItem(id) {
    const history = Store.get('guideHistory') || [];
    const item = history.find(h => h.id === id);
    if (!item || !item.result) return;

    item.result._id = item.id;
    item.result._saved = item.saved;

    Modal.show({
      title: 'Question Breakdown',
      large: true,
      content: `
        <div style="padding:12px;background:var(--bg-input);border-radius:var(--radius-sm);margin-bottom:16px;font-size:0.9rem">
          <strong>Question:</strong> ${Helpers.escapeHtml(item.question)}
        </div>
        ${this._renderResult(item.result, true)}
      `
    });
  }
};
