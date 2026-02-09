// Dashboard / Home screen
const DashboardPage = {
  render() {
    const content = document.getElementById('pageContent');
    if (!content) return;

    const user = Store.get('user') || {};
    const totalMins = Store.get('totalStudyMinutes') || 0;
    const streak = Store.get('studyStreak') || 0;
    const atarGoal = Store.get('atarGoal') || 90;
    const subjects = Store.get('subjects') || [];
    const practiceHistory = Store.get('practiceHistory') || [];
    const settings = Store.get('settings') || {};
    const dailyGoal = settings.dailyGoalMinutes || 120;
    const todayMins = Storage.getTodayStudyMinutes();
    const weekData = Storage.getStudyHistory(7);
    const avgScore = practiceHistory.length ?
      Math.round(practiceHistory.reduce((s, h) => s + (h.score || 0), 0) / practiceHistory.length) : 0;
    const greeting = Helpers.getGreeting();
    const quoteObj = MockData.quotes[Math.floor(Math.random() * MockData.quotes.length)];
    const quote = `"${quoteObj.text}" — ${quoteObj.author}`;

    content.innerHTML = `
      <div class="page-content">
        <!-- Welcome Banner -->
        <div class="dashboard-welcome">
          <div class="welcome-content">
            <div>
              <div class="welcome-greeting">${greeting}, ${user.name?.split(' ')[0] || 'there'}</div>
              <div class="welcome-subtitle">${quote}</div>
            </div>
            <div class="atar-tracker">
              ${Charts.progressRing(Math.min(100, Math.round(todayMins / dailyGoal * 100)), { size: 72, strokeWidth: 5, color: 'var(--primary-light)' })}
              <div style="position:absolute;display:flex;flex-direction:column;align-items:center;line-height:1.2">
                <div style="font-size:1.1rem;font-weight:700">${Math.round(todayMins / dailyGoal * 100)}%</div>
                <div style="font-size:0.6rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em">daily</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-4 gap-md mb-lg">
          <div class="card stat-card">
            <div class="flex items-center gap-sm mb-sm">
              <div style="padding:8px;background:rgba(99,102,241,0.1);border-radius:var(--radius-sm)">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--primary-light)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <span class="stat-label">Study Time</span>
            </div>
            <div class="stat-value text-gradient">${Helpers.formatMinutes(totalMins)}</div>
            <div style="margin-top:8px">${Charts.sparkline(weekData.map(d => d.minutes), { width: 120, height: 24, color: 'var(--primary-light)' })}</div>
          </div>

          <div class="card stat-card">
            <div class="flex items-center gap-sm mb-sm">
              <div style="padding:8px;background:rgba(245,158,11,0.1);border-radius:var(--radius-sm)">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--warning)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
              <span class="stat-label">Streak</span>
            </div>
            <div class="stat-value" style="color:var(--warning)">${streak} days</div>
            <div style="color:var(--text-muted);font-size:0.8rem;margin-top:8px">${streak > 0 ? 'Keep it going!' : 'Start studying today'}</div>
          </div>

          <div class="card stat-card">
            <div class="flex items-center gap-sm mb-sm">
              <div style="padding:8px;background:rgba(6,182,212,0.1);border-radius:var(--radius-sm)">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--info)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              </div>
              <span class="stat-label">Questions</span>
            </div>
            <div class="stat-value" style="color:var(--info)">${practiceHistory.length}</div>
            <div style="color:var(--text-muted);font-size:0.8rem;margin-top:8px">${avgScore > 0 ? avgScore + '% avg score' : 'No attempts yet'}</div>
          </div>

          <div class="card stat-card">
            <div class="flex items-center gap-sm mb-sm">
              <div style="padding:8px;background:rgba(139,92,246,0.1);border-radius:var(--radius-sm)">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <span class="stat-label">ATAR Goal</span>
            </div>
            <div class="stat-value" style="color:var(--accent)">${atarGoal}</div>
            <div style="color:var(--text-muted);font-size:0.8rem;margin-top:8px">${subjects.length} subjects</div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="mb-lg">
          <h3 style="margin-bottom:16px">Quick Actions</h3>
          <div class="quick-actions">
            <div class="quick-action" onclick="Router.navigate('/marker')">
              <div class="quick-action-icon" style="background:rgba(99,102,241,0.1)">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--primary-light)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
              </div>
              <div class="quick-action-label">AI Marker</div>
            </div>
            <div class="quick-action" onclick="Router.navigate('/guide')">
              <div class="quick-action-icon" style="background:rgba(14,165,233,0.1)">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
              </div>
              <div class="quick-action-label">Guide</div>
            </div>
            <div class="quick-action" onclick="Router.navigate('/practice')">
              <div class="quick-action-icon" style="background:rgba(16,185,129,0.1)">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              </div>
              <div class="quick-action-label">Practice</div>
            </div>
            <div class="quick-action" onclick="Router.navigate('/flashcards')">
              <div class="quick-action-icon" style="background:rgba(139,92,246,0.1)">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
              </div>
              <div class="quick-action-label">Flashcards</div>
            </div>
            <div class="quick-action" onclick="Router.navigate('/sessions')">
              <div class="quick-action-icon" style="background:rgba(245,158,11,0.1)">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--warning)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div class="quick-action-label">Study Session</div>
            </div>
          </div>
        </div>

        <div class="grid grid-2 gap-lg">
          <!-- Weekly Progress -->
          <div class="card">
            <div class="flex justify-between items-center mb-md">
              <h3>Weekly Progress</h3>
              <span class="text-muted" style="font-size:0.8rem">${Helpers.formatMinutes(weekData.reduce((s, d) => s + d.minutes, 0))} total</span>
            </div>
            ${Charts.barChart(weekData.map(d => ({
              label: d.day,
              value: d.minutes,
              color: d.date === Helpers.today() ? 'var(--gradient-primary)' : ''
            })), { height: 160 })}
          </div>

          <!-- Subject Overview -->
          <div class="card">
            <div class="flex justify-between items-center mb-md">
              <h3>My Subjects</h3>
              <button class="btn btn-ghost btn-sm" onclick="Router.navigate('/subjects')">
                View all
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
            ${subjects.length === 0 ?
              '<div style="text-align:center;padding:24px;color:var(--text-muted)"><div style="font-size:0.9rem">No subjects yet</div><button class="btn btn-primary btn-sm mt-md" onclick="Router.navigate(\'/subjects\')">Add Subjects</button></div>' :
              `<div class="flex flex-col gap-sm">
                ${subjects.slice(0, 5).map(id => {
                  const s = MockData.subjects.find(sub => sub.id === id);
                  if (!s) return '';
                  const topics = MockData.syllabusTopics[id] || [];
                  const practiced = topics.filter(t => t.status === 'practiced').length;
                  const pct = topics.length ? Math.round((practiced / topics.length) * 100) : 0;
                  return `
                    <div class="flex items-center gap-md" style="padding:8px 0;cursor:pointer" onclick="Router.navigate('/subjects')">
                      <div style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:var(--radius-sm);background:${s.color}15;font-size:1.1rem">${s.emoji}</div>
                      <div style="flex:1;min-width:0">
                        <div class="flex justify-between items-center mb-xs">
                          <span style="font-weight:500;font-size:0.9rem">${s.name}</span>
                          <span style="font-size:0.75rem;color:var(--text-muted)">${pct}%</span>
                        </div>
                        <div class="progress-bar" style="height:4px">
                          <div class="progress-bar-fill" style="width:${pct}%;background:${s.color}"></div>
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>`
            }
          </div>

          <!-- Recent Activity -->
          <div class="card">
            <h3 style="margin-bottom:16px">Recent Activity</h3>
            ${practiceHistory.length === 0 ?
              '<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:0.9rem">No activity yet. Start practicing!</div>' :
              `<div class="flex flex-col gap-sm">
                ${practiceHistory.slice(0, 5).map(h => {
                  const subjectData = MockData.subjects.find(s => s.id === h.subjectId);
                  return `
                    <div class="flex items-center gap-md" style="padding:8px 12px;background:var(--bg-input);border-radius:var(--radius-sm)">
                      <div style="width:8px;height:8px;border-radius:50%;background:${(h.score || 0) >= 80 ? 'var(--success)' : (h.score || 0) >= 60 ? 'var(--warning)' : 'var(--danger)'}"></div>
                      <div style="flex:1;min-width:0">
                        <div class="truncate" style="font-size:0.85rem;font-weight:500">${Helpers.truncate(h.question, 50)}</div>
                        <div class="text-muted" style="font-size:0.75rem">${subjectData ? subjectData.name : ''} &middot; ${Helpers.formatDate(h.timestamp, 'relative')}</div>
                      </div>
                      <span style="font-weight:600;font-size:0.85rem;color:${(h.score || 0) >= 80 ? 'var(--success)' : 'var(--warning)'}">${h.score || 0}%</span>
                    </div>
                  `;
                }).join('')}
              </div>`
            }
          </div>

          <!-- Daily Goal Progress -->
          <div class="card">
            <h3 style="margin-bottom:16px">Today's Goal</h3>
            <div style="text-align:center;padding:16px 0">
              <div style="position:relative;display:inline-flex;align-items:center;justify-content:center">
                ${Charts.progressRing(Math.min(100, Math.round(todayMins / dailyGoal * 100)), { size: 140, strokeWidth: 8, color: todayMins >= dailyGoal ? 'var(--success)' : 'var(--primary)' })}
                <div style="position:absolute;display:flex;flex-direction:column;align-items:center">
                  <div style="font-size:2rem;font-weight:700">${todayMins}</div>
                  <div style="font-size:0.8rem;color:var(--text-muted)">/ ${dailyGoal} min</div>
                </div>
              </div>
            </div>
            <div class="flex justify-center mt-md">
              <button class="btn btn-primary" onclick="Router.navigate('/sessions')">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Start Study Session
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
