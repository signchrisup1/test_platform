// MARKER - AI Response Grading page
const MarkerPage = {
  _result: null,
  _loading: false,
  _tab: 'new', // new, history

  render() {
    const content = document.getElementById('pageContent');
    if (!content) return;

    content.innerHTML = `
      <div class="page-content">
        <div class="flex justify-between items-center mb-lg">
          <div>
            <h1>✏️ Marker</h1>
            <p class="text-muted mt-sm" style="font-size:0.9rem">Get AI-powered feedback on your exam responses</p>
          </div>
        </div>

        <div class="tabs">
          <button class="tab ${this._tab === 'new' ? 'active' : ''}" onclick="MarkerPage.switchTab('new')">New Submission</button>
          <button class="tab ${this._tab === 'history' ? 'active' : ''}" onclick="MarkerPage.switchTab('history')">History (${(Store.get('markerHistory') || []).length})</button>
        </div>

        <div id="markerContent">
          ${this._tab === 'new' ? this._renderNew() : this._renderHistory()}
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
        <div class="flex flex-col gap-md">
          <div class="card">
            <h3 class="card-title" style="margin-bottom:16px">Submit Your Response</h3>
            <div class="form-group">
              <label class="form-label">Subject</label>
              <select class="form-select" id="markerSubject">
                <option value="">Select subject...</option>
                ${(Store.get('subjects') || []).map(id => {
                  const s = MockData.subjects.find(sub => sub.id === id);
                  return s ? `<option value="${id}">${s.emoji} ${s.name}</option>` : '';
                }).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Question</label>
              <textarea class="form-textarea" id="markerQuestion" placeholder="Paste or type the exam question here..." rows="3"></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Maximum Marks</label>
              <input type="number" class="form-input" id="markerMaxMarks" placeholder="e.g., 10" min="1" max="50" value="10">
            </div>
            <div class="form-group">
              <label class="form-label">Your Response</label>
              <textarea class="form-textarea" id="markerResponse" placeholder="Paste or type your exam response here..." rows="8"></textarea>
            </div>
            <button class="btn btn-primary w-full" onclick="MarkerPage.submit()" id="markerSubmitBtn">
              Grade My Response
            </button>
          </div>
        </div>

        <div id="markerResults">
          ${this._result ? this._renderResult(this._result) : this._renderPlaceholder()}
        </div>
      </div>
    `;
  },

  _renderPlaceholder() {
    return `
      <div class="card" style="min-height:400px;display:flex;align-items:center;justify-content:center">
        <div class="empty-state">
          <div class="empty-state-icon">📝</div>
          <div class="empty-state-title">Submit your response</div>
          <div class="empty-state-text">Paste your exam question and response to get detailed AI feedback with a grade, what went well, and areas for improvement.</div>
        </div>
      </div>
    `;
  },

  _renderResult(result) {
    const gradeColor = result.percentage >= 80 ? 'var(--success)' : result.percentage >= 60 ? 'var(--warning)' : 'var(--danger)';

    return `
      <div class="marker-results">
        <div class="card mb-md">
          <div class="grade-display">
            <div class="grade-circle" style="background:${gradeColor}">
              <div class="grade-number">${result.grade}</div>
              <div class="grade-total">/ ${result.maxMarks}</div>
            </div>
            <div style="font-size:1.1rem;font-weight:600;margin-top:8px">${result.percentage}%</div>
            <div class="text-muted" style="font-size:0.85rem">
              ${result.percentage >= 80 ? 'Excellent work!' : result.percentage >= 60 ? 'Good effort, room to improve' : 'Keep practicing!'}
            </div>
          </div>
        </div>

        <div class="card mb-md">
          <div class="feedback-section positive">
            <div class="feedback-title" style="color:var(--success)">✓ What Went Well</div>
            <div class="feedback-content">
              <ul>${result.wellDone.map(w => `<li>${w}</li>`).join('')}</ul>
            </div>
          </div>
        </div>

        <div class="card mb-md">
          <div class="feedback-section improvement">
            <div class="feedback-title" style="color:var(--warning)">△ Areas for Improvement</div>
            <div class="feedback-content">
              <ul>${result.improvements.map(i => `<li>${i}</li>`).join('')}</ul>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="feedback-section example">
            <div class="feedback-title" style="color:var(--info)">★ Example Ideal Response</div>
            <div class="feedback-content">${result.exampleResponse}</div>
          </div>
        </div>
      </div>
    `;
  },

  _renderHistory() {
    const history = Store.get('markerHistory') || [];

    if (history.length === 0) {
      return `
        <div class="card">
          <div class="empty-state">
            <div class="empty-state-icon">📭</div>
            <div class="empty-state-title">No grading history</div>
            <div class="empty-state-text">Submit a response to start building your grading history.</div>
            <button class="btn btn-primary" onclick="MarkerPage.switchTab('new')">Grade a Response</button>
          </div>
        </div>
      `;
    }

    return `
      <div class="flex flex-col gap-md">
        ${history.map(h => {
          const subjectData = MockData.subjects.find(s => s.id === h.subject);
          const gradeColor = h.percentage >= 80 ? 'var(--success)' : h.percentage >= 60 ? 'var(--warning)' : 'var(--danger)';
          return `
            <div class="card card-hover" style="cursor:pointer" onclick="MarkerPage.viewHistoryItem('${h.id}')">
              <div class="flex justify-between items-start">
                <div style="flex:1;min-width:0">
                  <div class="flex items-center gap-sm mb-sm">
                    ${subjectData ? `<span class="badge badge-primary">${subjectData.emoji} ${subjectData.name}</span>` : ''}
                    <span class="text-muted" style="font-size:0.8rem">${Helpers.formatDate(h.timestamp, 'relative')}</span>
                  </div>
                  <div style="font-weight:500;font-size:0.95rem;margin-bottom:4px">${Helpers.truncate(h.question, 80)}</div>
                  <div class="text-muted" style="font-size:0.85rem">${Helpers.truncate(h.response, 100)}</div>
                </div>
                <div style="text-align:center;margin-left:16px">
                  <div style="font-size:1.5rem;font-weight:700;color:${gradeColor}">${h.grade}/${h.maxMarks}</div>
                  <div style="font-size:0.8rem;color:${gradeColor}">${h.percentage}%</div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  async submit() {
    const question = document.getElementById('markerQuestion')?.value?.trim();
    const response = document.getElementById('markerResponse')?.value?.trim();
    const maxMarks = parseInt(document.getElementById('markerMaxMarks')?.value) || 10;
    const subject = document.getElementById('markerSubject')?.value;

    if (!question) { Component.toast('Please enter the question', 'warning'); return; }
    if (!response) { Component.toast('Please enter your response', 'warning'); return; }

    const btn = document.getElementById('markerSubmitBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px"></div> Analysing...'; }

    const resultsDiv = document.getElementById('markerResults');
    if (resultsDiv) resultsDiv.innerHTML = `<div class="card" style="min-height:300px;display:flex;align-items:center;justify-content:center"><div class="spinner"></div></div>`;

    try {
      const result = await MockAI.gradeResponse(question, response, maxMarks);
      this._result = result;

      // Save to history
      Storage.addMarkerHistory({
        question, response, subject,
        grade: result.grade,
        maxMarks: result.maxMarks,
        percentage: result.percentage,
        wellDone: result.wellDone,
        improvements: result.improvements,
        exampleResponse: result.exampleResponse,
        timestamp: result.timestamp
      });

      // Add study time
      Storage.addStudyTime(5);
      Storage.checkAchievements();

      if (resultsDiv) resultsDiv.innerHTML = this._renderResult(result);
      Component.toast('Response graded!', 'success');
    } catch (e) {
      Component.toast('Failed to grade response', 'error');
    }

    if (btn) { btn.disabled = false; btn.innerHTML = 'Grade My Response'; }
  },

  viewHistoryItem(id) {
    const history = Store.get('markerHistory') || [];
    const item = history.find(h => h.id === id);
    if (!item) return;

    Modal.show({
      title: 'Grading Details',
      large: true,
      content: `
        <div style="margin-bottom:16px">
          <div class="form-label" style="margin-bottom:4px">Question</div>
          <div style="padding:12px;background:var(--bg-input);border-radius:var(--radius-sm);font-size:0.9rem">${Helpers.escapeHtml(item.question)}</div>
        </div>
        <div style="margin-bottom:16px">
          <div class="form-label" style="margin-bottom:4px">Your Response</div>
          <div style="padding:12px;background:var(--bg-input);border-radius:var(--radius-sm);font-size:0.9rem;max-height:150px;overflow-y:auto">${Helpers.escapeHtml(item.response || '')}</div>
        </div>
        ${this._renderResult(item)}
      `
    });
  }
};
