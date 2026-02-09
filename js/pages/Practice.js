// PRACTICE - Question Generator & Marker
const PracticePage = {
  _questions: [],
  _currentAnswer: '',
  _currentQuestion: null,
  _result: null,
  _tab: 'generate', // generate, answer, results, history

  render() {
    const content = document.getElementById('pageContent');
    if (!content) return;

    content.innerHTML = `
      <div class="page-content">
        <div class="flex justify-between items-center mb-lg">
          <div>
            <h1>🎯 Practice</h1>
            <p class="text-muted mt-sm" style="font-size:0.9rem">Generate questions and test your knowledge</p>
          </div>
          <div class="flex gap-sm">
            <button class="btn ${this._tab === 'generate' || this._tab === 'answer' || this._tab === 'results' ? 'btn-primary' : 'btn-secondary'}" onclick="PracticePage.switchTab('generate')">
              New Practice
            </button>
            <button class="btn ${this._tab === 'history' ? 'btn-primary' : 'btn-secondary'}" onclick="PracticePage.switchTab('history')">
              History (${(Store.get('practiceHistory') || []).length})
            </button>
          </div>
        </div>

        <div id="practiceContent">
          ${this._renderTab()}
        </div>
      </div>
    `;
  },

  switchTab(tab) {
    this._tab = tab;
    if (tab === 'generate') {
      this._questions = [];
      this._currentQuestion = null;
      this._result = null;
    }
    this.render();
  },

  _renderTab() {
    switch (this._tab) {
      case 'generate': return this._renderGenerate();
      case 'answer': return this._renderAnswer();
      case 'results': return this._renderResults();
      case 'history': return this._renderHistory();
      default: return '';
    }
  },

  _renderGenerate() {
    const subjects = Store.get('subjects') || [];

    return `
      <div class="grid grid-2 gap-lg">
        <div class="card">
          <h3 class="card-title" style="margin-bottom:16px">Generate Questions</h3>

          <div class="form-group">
            <label class="form-label">Subject</label>
            <select class="form-select" id="practiceSubject" onchange="PracticePage.updateTopics()">
              <option value="">Select subject...</option>
              ${subjects.map(id => {
                const s = MockData.subjects.find(sub => sub.id === id);
                return s ? `<option value="${id}">${s.emoji} ${s.name}</option>` : '';
              }).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Topic</label>
            <select class="form-select" id="practiceTopic">
              <option value="">All topics</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Difficulty</label>
            <select class="form-select" id="practiceDifficulty">
              <option value="All">All Levels</option>
              <option value="Foundation">Foundation</option>
              <option value="Standard" selected>Standard</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Question Type</label>
            <select class="form-select" id="practiceType">
              <option value="All">All Types</option>
              <option value="short">Short Answer</option>
              <option value="extended">Extended Response</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Number of Questions</label>
            <select class="form-select" id="practiceCount">
              <option value="1">1 question</option>
              <option value="3" selected>3 questions</option>
              <option value="5">5 questions</option>
            </select>
          </div>

          <button class="btn btn-primary w-full" onclick="PracticePage.generate()" id="practiceGenBtn">
            Generate Questions
          </button>
        </div>

        <div>
          ${this._questions.length > 0 ? `
            <div class="flex flex-col gap-md">
              <h3>Generated Questions</h3>
              ${this._questions.map((q, i) => `
                <div class="question-card card-hover" onclick="PracticePage.selectQuestion(${i})">
                  <div class="question-meta">
                    <span class="badge badge-${q.difficulty === 'Advanced' ? 'danger' : q.difficulty === 'Standard' ? 'warning' : 'success'}">${q.difficulty}</span>
                    <span class="badge badge-primary">${q.type === 'extended' ? 'Extended' : 'Short'}</span>
                    <span class="badge badge-info">${q.marks} marks</span>
                  </div>
                  <div class="question-text">${q.q}</div>
                  <button class="btn btn-primary btn-sm">Answer This</button>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="card" style="min-height:400px;display:flex;align-items:center;justify-content:center">
              <div class="empty-state">
                <div class="empty-state-icon">❓</div>
                <div class="empty-state-title">Generate practice questions</div>
                <div class="empty-state-text">Select your subject and topic, then generate questions to practice with.</div>
              </div>
            </div>
          `}
        </div>
      </div>
    `;
  },

  _renderAnswer() {
    const q = this._currentQuestion;
    if (!q) return '';

    return `
      <div style="max-width:800px;margin:0 auto">
        <button class="btn btn-ghost mb-md" onclick="PracticePage.switchTab('generate')">← Back to questions</button>

        <div class="question-card">
          <div class="question-meta">
            <span class="badge badge-${q.difficulty === 'Advanced' ? 'danger' : q.difficulty === 'Standard' ? 'warning' : 'success'}">${q.difficulty}</span>
            <span class="badge badge-primary">${q.type === 'extended' ? 'Extended Response' : 'Short Answer'}</span>
            <span class="badge badge-info">${q.marks} marks</span>
          </div>
          <div class="question-text" style="font-size:1.1rem">${q.q}</div>
        </div>

        <div class="card mt-md">
          <h3 class="card-title" style="margin-bottom:12px">Your Answer</h3>
          <textarea class="form-textarea" id="practiceAnswer" rows="10" placeholder="Type your answer here...">${this._currentAnswer}</textarea>
          <div class="flex justify-between items-center mt-md">
            <span class="text-muted" style="font-size:0.85rem" id="wordCount">0 words</span>
            <button class="btn btn-primary" onclick="PracticePage.submitAnswer()" id="practiceSubmitBtn">
              Submit & Grade
            </button>
          </div>
        </div>
      </div>
    `;
  },

  _renderResults() {
    if (!this._result || !this._currentQuestion) return '';
    const q = this._currentQuestion;
    const r = this._result;

    return `
      <div style="max-width:800px;margin:0 auto">
        <button class="btn btn-ghost mb-md" onclick="PracticePage.switchTab('generate')">← Generate More</button>

        <div class="question-card">
          <div class="question-meta">
            <span class="badge badge-${q.difficulty === 'Advanced' ? 'danger' : q.difficulty === 'Standard' ? 'warning' : 'success'}">${q.difficulty}</span>
            <span class="badge badge-primary">${q.marks} marks</span>
          </div>
          <div class="question-text">${q.q}</div>
        </div>

        <div class="card mt-md">
          <div class="grade-display">
            <div class="grade-circle" style="background:${r.percentage >= 80 ? 'var(--success)' : r.percentage >= 60 ? 'var(--warning)' : 'var(--danger)'}">
              <div class="grade-number">${r.grade}</div>
              <div class="grade-total">/ ${r.maxMarks}</div>
            </div>
            <div style="font-size:1.1rem;font-weight:600;margin-top:8px">${r.percentage}%</div>
          </div>
        </div>

        <div class="card mt-md">
          <div class="feedback-section positive">
            <div class="feedback-title" style="color:var(--success)">✓ What Went Well</div>
            <div class="feedback-content"><ul>${r.wellDone.map(w => `<li>${w}</li>`).join('')}</ul></div>
          </div>
        </div>

        <div class="card mt-md">
          <div class="feedback-section improvement">
            <div class="feedback-title" style="color:var(--warning)">△ Areas for Improvement</div>
            <div class="feedback-content"><ul>${r.improvements.map(i => `<li>${i}</li>`).join('')}</ul></div>
          </div>
        </div>

        <div class="card mt-md">
          <div class="feedback-section example">
            <div class="feedback-title" style="color:var(--info)">★ Example Response</div>
            <div class="feedback-content">${r.exampleResponse}</div>
          </div>
        </div>

        <div class="flex gap-md mt-lg justify-center">
          <button class="btn btn-secondary" onclick="PracticePage.switchTab('generate')">Practice More</button>
          <button class="btn btn-primary" onclick="Router.navigate('/analytics')">View Progress</button>
        </div>
      </div>
    `;
  },

  _renderHistory() {
    const history = Store.get('practiceHistory') || [];
    if (history.length === 0) {
      return `<div class="card"><div class="empty-state"><div class="empty-state-icon">📭</div><div class="empty-state-title">No practice history</div><div class="empty-state-text">Complete practice questions to track your progress.</div></div></div>`;
    }

    return `
      <div class="flex flex-col gap-md">
        ${history.map(h => {
          const subjectData = MockData.subjects.find(s => s.id === h.subjectId);
          return `
            <div class="card">
              <div class="flex justify-between items-center">
                <div style="flex:1">
                  <div class="flex items-center gap-sm mb-sm">
                    ${subjectData ? `<span class="badge badge-primary">${subjectData.emoji} ${subjectData.name}</span>` : ''}
                    <span class="badge badge-info">${h.difficulty || 'Standard'}</span>
                    <span class="text-muted" style="font-size:0.8rem">${Helpers.formatDate(h.timestamp, 'relative')}</span>
                  </div>
                  <div style="font-weight:500">${Helpers.truncate(h.question, 80)}</div>
                </div>
                <div style="text-align:center;margin-left:16px">
                  <div style="font-size:1.3rem;font-weight:700;color:${(h.score || 0) >= 80 ? 'var(--success)' : 'var(--warning)'}">${h.score || 0}%</div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  updateTopics() {
    const subject = document.getElementById('practiceSubject')?.value;
    const topicSelect = document.getElementById('practiceTopic');
    if (!topicSelect) return;

    const topics = MockData.syllabusTopics[subject] || [];
    topicSelect.innerHTML = '<option value="">All topics</option>' +
      topics.map(t => `<option value="${t.name}">${t.name}</option>`).join('');
  },

  async generate() {
    const subject = document.getElementById('practiceSubject')?.value;
    if (!subject) { Component.toast('Please select a subject', 'warning'); return; }

    const topic = document.getElementById('practiceTopic')?.value;
    const difficulty = document.getElementById('practiceDifficulty')?.value;
    const type = document.getElementById('practiceType')?.value;
    const count = parseInt(document.getElementById('practiceCount')?.value) || 3;

    const btn = document.getElementById('practiceGenBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px"></div> Generating...'; }

    try {
      this._questions = await MockAI.generateQuestions(subject, topic, difficulty, type, count);
      this.render();
      Component.toast(`${this._questions.length} questions generated!`, 'success');
    } catch (e) {
      Component.toast('Failed to generate questions', 'error');
    }

    if (btn) { btn.disabled = false; btn.innerHTML = 'Generate Questions'; }
  },

  selectQuestion(index) {
    this._currentQuestion = this._questions[index];
    this._currentAnswer = '';
    this._result = null;
    this._tab = 'answer';
    this.render();

    // Word counter
    const textarea = document.getElementById('practiceAnswer');
    if (textarea) {
      textarea.addEventListener('input', () => {
        const words = textarea.value.trim().split(/\s+/).filter(w => w).length;
        const counter = document.getElementById('wordCount');
        if (counter) counter.textContent = `${words} words`;
      });
      textarea.focus();
    }
  },

  async submitAnswer() {
    const answer = document.getElementById('practiceAnswer')?.value?.trim();
    if (!answer) { Component.toast('Please write an answer', 'warning'); return; }

    const btn = document.getElementById('practiceSubmitBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px"></div> Grading...'; }

    try {
      const result = await MockAI.gradeResponse(this._currentQuestion.q, answer, this._currentQuestion.marks);
      this._result = result;

      // Save to practice history
      Storage.addPracticeHistory({
        question: this._currentQuestion.q,
        answer: answer,
        subjectId: this._currentQuestion.subject,
        difficulty: this._currentQuestion.difficulty,
        score: result.percentage,
        grade: result.grade,
        maxMarks: result.maxMarks,
      });

      Storage.addStudyTime(10);
      Storage.checkAchievements();

      this._tab = 'results';
      this.render();
      Component.toast('Answer graded!', 'success');
    } catch (e) {
      Component.toast('Failed to grade answer', 'error');
    }
  }
};
