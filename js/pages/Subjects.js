// Subject Dashboard with Syllabus Map
const SubjectsPage = {
  _selectedSubject: null,

  render() {
    const content = document.getElementById('pageContent');
    if (!content) return;

    const subjects = Store.get('subjects') || [];

    content.innerHTML = `
      <div class="page-content">
        <div class="flex justify-between items-center mb-lg">
          <div>
            <h1><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--primary-light)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> Subjects</h1>
            <p class="text-muted mt-sm" style="font-size:0.9rem">Track progress across your subjects</p>
          </div>
          <button class="btn btn-primary" onclick="SubjectsPage.manageSubjects()">
            Manage Subjects
          </button>
        </div>

        ${subjects.length === 0 ? `
          <div class="card"><div class="empty-state"><div class="empty-state-icon">📚</div><div class="empty-state-title">No subjects added</div><div class="empty-state-text">Add subjects to track your study progress.</div><button class="btn btn-primary" onclick="SubjectsPage.manageSubjects()">Add Subjects</button></div></div>
        ` : `
          <!-- Subject Cards -->
          <div class="grid grid-3 gap-md mb-lg">
            ${subjects.map((id, i) => {
              const s = MockData.subjects.find(sub => sub.id === id);
              if (!s) return '';
              const topics = MockData.syllabusTopics[id] || [];
              const practiced = topics.filter(t => t.status === 'practiced').length;
              const inProgress = topics.filter(t => t.status === 'in-progress').length;
              const pct = topics.length ? Math.round(((practiced + inProgress * 0.5) / topics.length) * 100) : 0;
              const practiceHistory = (Store.get('practiceHistory') || []).filter(h => h.subjectId === id);
              const avgScore = practiceHistory.length ?
                Math.round(practiceHistory.reduce((sum, h) => sum + (h.score || 0), 0) / practiceHistory.length) : 0;

              return `
                <div class="card card-hover" style="cursor:pointer;border-left:4px solid ${s.color}" onclick="SubjectsPage.selectSubject('${id}')">
                  <div class="flex items-center gap-sm mb-md">
                    <span style="font-size:1.5rem">${s.emoji}</span>
                    <div>
                      <div style="font-weight:600">${s.name}</div>
                      <div class="text-muted" style="font-size:0.8rem">${topics.length} topics</div>
                    </div>
                  </div>
                  <div class="progress-bar mb-sm" style="height:6px">
                    <div class="progress-bar-fill" style="width:${pct}%;background:${s.color}"></div>
                  </div>
                  <div class="grid grid-3 gap-sm" style="text-align:center;font-size:0.8rem">
                    <div>
                      <div style="font-weight:600">${practiceHistory.length}</div>
                      <div class="text-muted">Practiced</div>
                    </div>
                    <div>
                      <div style="font-weight:600">${avgScore}%</div>
                      <div class="text-muted">Avg Score</div>
                    </div>
                    <div>
                      <div style="font-weight:600">${pct}%</div>
                      <div class="text-muted">Progress</div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Selected Subject Detail -->
          <div id="subjectDetail">
            ${this._selectedSubject ? this._renderDetail(this._selectedSubject) : `
              <div class="card"><div class="empty-state"><div class="empty-state-icon">👆</div><div class="empty-state-title">Select a subject</div><div class="empty-state-text">Click on a subject card to view its syllabus map and detailed progress.</div></div></div>
            `}
          </div>
        `}
      </div>
    `;
  },

  selectSubject(id) {
    this._selectedSubject = id;
    const detail = document.getElementById('subjectDetail');
    if (detail) {
      detail.innerHTML = this._renderDetail(id);
    }
  },

  _renderDetail(subjectId) {
    const s = MockData.subjects.find(sub => sub.id === subjectId);
    if (!s) return '';

    const topics = MockData.syllabusTopics[subjectId] || [];
    const focusAreas = MockAI.getSuggestedFocusAreas(subjectId);
    const practiceHistory = (Store.get('practiceHistory') || []).filter(h => h.subjectId === subjectId);

    return `
      <div class="card" style="animation:slideInUp 0.3s ease">
        <div class="flex justify-between items-center mb-lg">
          <div class="flex items-center gap-md">
            <span style="font-size:2rem">${s.emoji}</span>
            <div>
              <h2>${s.name}</h2>
              <div class="text-muted" style="font-size:0.9rem">${topics.length} topics in syllabus</div>
            </div>
          </div>
          <button class="btn btn-primary" onclick="SubjectsPage.practiceSubject('${subjectId}')">
            Practice This Subject
          </button>
        </div>

        <!-- Syllabus Map -->
        <h3 style="margin-bottom:12px">Syllabus Map</h3>
        <div class="syllabus-map mb-lg">
          ${topics.map(t => `
            <div class="topic-bubble ${t.status === 'practiced' ? 'practiced' : t.status === 'in-progress' ? 'in-progress' : 'not-started'}"
                 onclick="SubjectsPage.practiceTopic('${subjectId}', '${t.name}')">
              <span>${t.status === 'practiced' ? '✓' : t.status === 'in-progress' ? '◑' : '○'}</span>
              ${t.name}
            </div>
          `).join('')}
        </div>

        <div class="grid grid-2 gap-lg">
          <!-- Legend -->
          <div>
            <h4 style="margin-bottom:8px">Legend</h4>
            <div class="flex flex-col gap-sm" style="font-size:0.85rem">
              <div class="flex items-center gap-sm"><span style="color:var(--success)">✓</span> Well Practiced</div>
              <div class="flex items-center gap-sm"><span style="color:var(--warning)">◑</span> In Progress</div>
              <div class="flex items-center gap-sm"><span style="color:var(--text-muted)">○</span> Not Started</div>
            </div>

            <h4 style="margin-top:16px;margin-bottom:8px">AI Suggested Focus Areas</h4>
            <div class="flex flex-col gap-sm">
              ${focusAreas.map(f => `
                <div style="padding:8px 12px;background:var(--bg-input);border-radius:var(--radius-sm);font-size:0.85rem;border-left:3px solid var(--primary)">
                  ${f}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Recent Practice -->
          <div>
            <h4 style="margin-bottom:8px">Recent Practice</h4>
            ${practiceHistory.length === 0 ? '<div class="text-muted" style="font-size:0.85rem">No practice yet for this subject</div>' :
              practiceHistory.slice(0, 5).map(h => `
                <div class="flex justify-between items-center" style="padding:8px 0;border-bottom:1px solid var(--border-color);font-size:0.85rem">
                  <span>${Helpers.truncate(h.question, 40)}</span>
                  <span style="font-weight:600;color:${(h.score || 0) >= 80 ? 'var(--success)' : 'var(--warning)'}">${h.score || 0}%</span>
                </div>
              `).join('')
            }
          </div>
        </div>
      </div>
    `;
  },

  practiceSubject(subjectId) {
    Router.navigate('/practice');
    setTimeout(() => {
      const sel = document.getElementById('practiceSubject');
      if (sel) sel.value = subjectId;
      PracticePage.updateTopics();
    }, 100);
  },

  practiceTopic(subjectId, topicName) {
    Router.navigate('/practice');
    setTimeout(() => {
      const sel = document.getElementById('practiceSubject');
      if (sel) {
        sel.value = subjectId;
        PracticePage.updateTopics();
        setTimeout(() => {
          const topicSel = document.getElementById('practiceTopic');
          if (topicSel) topicSel.value = topicName;
        }, 50);
      }
    }, 100);
  },

  manageSubjects() {
    const allSubjects = MockData.subjects;
    const current = Store.get('subjects') || [];

    Modal.show({
      title: 'Manage Subjects',
      content: `
        <p class="text-muted mb-md" style="font-size:0.9rem">Select up to 6 subjects (${current.length}/6 selected)</p>
        <div class="subject-grid">
          ${allSubjects.map(s => `
            <div class="subject-option ${current.includes(s.id) ? 'selected' : ''}"
                 onclick="SubjectsPage._toggleSubject('${s.id}')">
              <span class="subject-emoji">${s.emoji}</span>
              <span>${s.name}</span>
            </div>
          `).join('')}
        </div>
      `,
      footer: `<button class="btn btn-primary" onclick="Modal.close(); SubjectsPage.render()">Done</button>`
    });
  },

  _toggleSubject(id) {
    const current = Store.get('subjects') || [];
    const idx = current.indexOf(id);
    if (idx !== -1) {
      current.splice(idx, 1);
    } else if (current.length < 6) {
      current.push(id);
    } else {
      Component.toast('Maximum 6 subjects', 'warning');
      return;
    }
    Store.set('subjects', current);

    // Re-render modal content
    document.querySelectorAll('.subject-option').forEach(el => {
      const subId = el.getAttribute('onclick').match(/'([^']+)'/)?.[1];
      if (subId) {
        el.classList.toggle('selected', current.includes(subId));
      }
    });
  }
};
