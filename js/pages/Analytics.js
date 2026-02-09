// Progress & Analytics page
const AnalyticsPage = {
  render() {
    const content = document.getElementById('pageContent');
    if (!content) return;

    const totalMins = Store.get('totalStudyMinutes') || 0;
    const streak = Store.get('studyStreak') || 0;
    const practiceHistory = Store.get('practiceHistory') || [];
    const markerHistory = Store.get('markerHistory') || [];
    const subjects = Store.get('subjects') || [];
    const dailyMinutes = Store.get('dailyStudyMinutes') || {};
    const achievements = Store.get('achievements') || [];

    // Calculate stats
    const totalQuestions = practiceHistory.length + markerHistory.length;
    const avgScore = practiceHistory.length ?
      Math.round(practiceHistory.reduce((s, h) => s + (h.score || 0), 0) / practiceHistory.length) : 0;

    // Weekly data
    const weekData = Storage.getStudyHistory(7);

    // Subject breakdown
    const subjectStats = subjects.map(id => {
      const s = MockData.subjects.find(sub => sub.id === id);
      if (!s) return null;
      const practice = practiceHistory.filter(h => h.subjectId === id);
      const scored = practice.filter(h => h.score != null);
      return {
        name: s.name,
        emoji: s.emoji,
        color: s.color,
        questions: practice.length,
        avgScore: scored.length ? Math.round(scored.reduce((sum, h) => sum + h.score, 0) / scored.length) : 0,
      };
    }).filter(Boolean);

    content.innerHTML = `
      <div class="page-content">
        <div class="mb-lg">
          <h1><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--primary-light)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Analytics</h1>
          <p class="text-muted mt-sm" style="font-size:0.9rem">Track your study progress and performance</p>
        </div>

        <!-- Stats Overview -->
        <div class="grid grid-4 gap-md mb-lg">
          <div class="card stat-card">
            <div class="stat-label">Total Study Time</div>
            <div class="stat-value text-gradient">${Helpers.formatMinutes(totalMins)}</div>
          </div>
          <div class="card stat-card">
            <div class="stat-label">Study Streak</div>
            <div class="stat-value" style="color:var(--warning)">🔥 ${streak}</div>
          </div>
          <div class="card stat-card">
            <div class="stat-label">Questions Completed</div>
            <div class="stat-value" style="color:var(--info)">${totalQuestions}</div>
          </div>
          <div class="card stat-card">
            <div class="stat-label">Average Score</div>
            <div class="stat-value" style="color:${avgScore >= 80 ? 'var(--success)' : avgScore >= 60 ? 'var(--warning)' : 'var(--danger)'}">${avgScore}%</div>
          </div>
        </div>

        <div class="grid grid-2 gap-lg">
          <!-- Weekly Study Time -->
          <div class="card">
            <h3 class="card-title" style="margin-bottom:16px">Weekly Study Time</h3>
            ${Charts.barChart(weekData.map(d => ({
              label: d.day,
              value: d.minutes,
              color: d.date === Helpers.today() ? 'var(--primary)' : ''
            })), { height: 180 })}
          </div>

          <!-- Subject Breakdown -->
          <div class="card">
            <h3 class="card-title" style="margin-bottom:16px">Subject Performance</h3>
            ${subjectStats.length === 0 ? '<div class="text-muted" style="font-size:0.9rem">No practice data yet</div>' :
              subjectStats.map(s => `
                <div class="flex items-center gap-md" style="padding:10px 0;border-bottom:1px solid var(--border-color)">
                  <span>${s.emoji}</span>
                  <div style="flex:1;min-width:0">
                    <div class="flex justify-between mb-sm" style="font-size:0.85rem">
                      <span style="font-weight:500">${s.name}</span>
                      <span class="text-muted">${s.questions} Qs | ${s.avgScore}%</span>
                    </div>
                    <div class="progress-bar" style="height:6px">
                      <div class="progress-bar-fill" style="width:${s.avgScore}%;background:${s.color}"></div>
                    </div>
                  </div>
                </div>
              `).join('')
            }
          </div>

          <!-- Study Heatmap -->
          <div class="card" style="grid-column:span 2">
            <h3 class="card-title" style="margin-bottom:16px">Study Activity (Last 12 Weeks)</h3>
            <div style="overflow-x:auto">
              ${Charts.heatmap(dailyMinutes, { weeks: 12 })}
            </div>
          </div>

          <!-- Strengths & Weaknesses -->
          <div class="card">
            <h3 class="card-title" style="margin-bottom:16px">Strengths & Weaknesses</h3>
            ${this._renderStrengths(subjectStats)}
          </div>

          <!-- Achievements -->
          <div class="card">
            <h3 class="card-title" style="margin-bottom:16px">Achievements (${achievements.length}/${MockData.achievements.length})</h3>
            <div class="flex flex-col gap-sm" style="max-height:300px;overflow-y:auto">
              ${MockData.achievements.map(a => {
                const unlocked = achievements.includes(a.id);
                return `
                  <div class="achievement ${unlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">${a.icon}</div>
                    <div class="achievement-info">
                      <div class="achievement-name">${a.name}</div>
                      <div class="achievement-desc">${a.desc}</div>
                    </div>
                    ${unlocked ? '<span class="badge badge-success">Unlocked</span>' : '<span class="badge badge-info">Locked</span>'}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  _renderStrengths(subjectStats) {
    if (subjectStats.length === 0) {
      return '<div class="text-muted" style="font-size:0.9rem">Complete more practice to see analysis</div>';
    }

    const sorted = [...subjectStats].sort((a, b) => b.avgScore - a.avgScore);
    const strengths = sorted.filter(s => s.avgScore >= 70).slice(0, 3);
    const weaknesses = sorted.filter(s => s.avgScore < 70 || s.questions < 3).slice(-3);

    return `
      <div class="mb-md">
        <h4 style="color:var(--success);margin-bottom:8px">💪 Strengths</h4>
        ${strengths.length === 0 ? '<div class="text-muted" style="font-size:0.85rem">Keep practicing to discover strengths</div>' :
          strengths.map(s => `
            <div class="flex items-center gap-sm" style="padding:6px 0;font-size:0.85rem">
              <span>${s.emoji}</span>
              <span>${s.name}</span>
              <span class="badge badge-success">${s.avgScore}%</span>
            </div>
          `).join('')
        }
      </div>
      <div>
        <h4 style="color:var(--warning);margin-bottom:8px">📈 Areas to Improve</h4>
        ${weaknesses.length === 0 ? '<div class="text-muted" style="font-size:0.85rem">Great work across all subjects!</div>' :
          weaknesses.map(s => `
            <div class="flex items-center gap-sm" style="padding:6px 0;font-size:0.85rem">
              <span>${s.emoji}</span>
              <span>${s.name}</span>
              <span class="badge badge-warning">${s.questions < 3 ? 'Needs more practice' : s.avgScore + '%'}</span>
            </div>
          `).join('')
        }
      </div>
    `;
  }
};
