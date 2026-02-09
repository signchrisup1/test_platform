// Dashboard / Home screen
const DashboardPage = {
  render() {
    const user = Store.get('user') || {};
    const streak = Store.get('studyStreak') || 0;
    const todayMins = Storage.getTodayStudyMinutes();
    const weeklyMins = Storage.getWeeklyStudyMinutes();
    const atarGoal = Store.get('atarGoal') || 90;
    const subjects = Store.get('subjects') || [];
    const practiceCount = (Store.get('practiceHistory') || []).length;
    const quote = MockData.getDailyQuote();
    const settings = Store.get('settings') || {};
    const dailyGoal = settings.dailyGoalMinutes || 120;
    const dailyProgress = Math.min(100, Math.round((todayMins / dailyGoal) * 100));

    const studyData = Storage.getStudyHistory(7);

    const content = document.getElementById('pageContent');
    if (!content) return;

    content.innerHTML = `
      <div class="page-content">
        <!-- Welcome Banner -->
        <div class="dashboard-welcome">
          <div class="welcome-greeting">${Helpers.getGreeting()}, ${(user.name || 'Student').split(' ')[0]}! 👋</div>
          <div class="welcome-subtitle">
            ${streak > 0 ? `🔥 ${streak} day streak! Keep it going!` : 'Start your study streak today!'}
            ${todayMins > 0 ? ` | ${Helpers.formatMinutes(todayMins)} studied today` : ''}
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <div class="quick-action" onclick="Router.navigate('/marker')">
            <span class="quick-action-icon">✏️</span>
            <span class="quick-action-label">Mark Response</span>
          </div>
          <div class="quick-action" onclick="Router.navigate('/guide')">
            <span class="quick-action-icon">📋</span>
            <span class="quick-action-label">Get Guidance</span>
          </div>
          <div class="quick-action" onclick="Router.navigate('/practice')">
            <span class="quick-action-icon">🎯</span>
            <span class="quick-action-label">Practice</span>
          </div>
          <div class="quick-action" onclick="Router.navigate('/flashcards')">
            <span class="quick-action-icon">🃏</span>
            <span class="quick-action-label">Flashcards</span>
          </div>
          <div class="quick-action" onclick="Router.navigate('/sessions')">
            <span class="quick-action-icon">👥</span>
            <span class="quick-action-label">Study Session</span>
          </div>
          <div class="quick-action" onclick="Router.navigate('/planner')">
            <span class="quick-action-icon">📅</span>
            <span class="quick-action-label">Planner</span>
          </div>
        </div>

        <div class="grid grid-3 gap-lg">
          <!-- Left Column -->
          <div style="grid-column: span 2" class="flex flex-col gap-lg">
            <!-- Daily Progress -->
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Today's Progress</h3>
                <span class="badge badge-${dailyProgress >= 100 ? 'success' : dailyProgress >= 50 ? 'warning' : 'primary'}">${dailyProgress}%</span>
              </div>
              <div class="progress-bar" style="height:12px;margin-bottom:12px">
                <div class="progress-bar-fill ${dailyProgress >= 100 ? 'success' : dailyProgress >= 50 ? 'warning' : ''}" style="width:${dailyProgress}%"></div>
              </div>
              <div class="flex justify-between text-muted" style="font-size:0.85rem">
                <span>${Helpers.formatMinutes(todayMins)} studied</span>
                <span>Goal: ${Helpers.formatMinutes(dailyGoal)}</span>
              </div>
            </div>

            <!-- Weekly Study Chart -->
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">This Week</h3>
                <span class="text-muted" style="font-size:0.85rem">${Helpers.formatMinutes(weeklyMins)} total</span>
              </div>
              ${Charts.barChart(studyData.map(d => ({
                label: d.day,
                value: d.minutes,
                color: d.date === Helpers.today() ? 'var(--primary)' : ''
              })), { height: 150 })}
            </div>

            <!-- Recent Activity -->
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Recent Activity</h3>
                <button class="btn btn-ghost btn-sm" onclick="Router.navigate('/analytics')">View all</button>
              </div>
              ${this._renderRecentActivity()}
            </div>
          </div>

          <!-- Right Column -->
          <div class="flex flex-col gap-lg">
            <!-- ATAR Goal -->
            <div class="card">
              <h3 class="card-title" style="margin-bottom:16px;text-align:center">ATAR Goal</h3>
              <div class="atar-tracker">
                <div class="atar-circle">
                  <div class="atar-value">${atarGoal}</div>
                  <div class="atar-goal-label">TARGET</div>
                </div>
              </div>
              <div class="flex justify-center gap-md mt-md" style="font-size:0.85rem;color:var(--text-muted)">
                <div style="text-align:center">
                  <div style="font-weight:600;font-size:1.1rem;color:var(--text-primary)">${practiceCount}</div>
                  <div>Questions</div>
                </div>
                <div style="text-align:center">
                  <div style="font-weight:600;font-size:1.1rem;color:var(--text-primary)">${subjects.length}</div>
                  <div>Subjects</div>
                </div>
              </div>
            </div>

            <!-- Study Stats -->
            <div class="card">
              <h3 class="card-title" style="margin-bottom:12px">Quick Stats</h3>
              <div class="flex flex-col gap-sm">
                <div class="flex justify-between items-center" style="padding:8px 0;border-bottom:1px solid var(--border-color)">
                  <span class="text-secondary" style="font-size:0.85rem">🔥 Study Streak</span>
                  <span style="font-weight:600">${streak} days</span>
                </div>
                <div class="flex justify-between items-center" style="padding:8px 0;border-bottom:1px solid var(--border-color)">
                  <span class="text-secondary" style="font-size:0.85rem">⏱️ Total Study Time</span>
                  <span style="font-weight:600">${Helpers.formatMinutes(Store.get('totalStudyMinutes') || 0)}</span>
                </div>
                <div class="flex justify-between items-center" style="padding:8px 0;border-bottom:1px solid var(--border-color)">
                  <span class="text-secondary" style="font-size:0.85rem">📝 Questions Done</span>
                  <span style="font-weight:600">${practiceCount}</span>
                </div>
                <div class="flex justify-between items-center" style="padding:8px 0">
                  <span class="text-secondary" style="font-size:0.85rem">🃏 Flashcard Decks</span>
                  <span style="font-weight:600">${(Store.get('flashcardDecks') || []).length}</span>
                </div>
              </div>
            </div>

            <!-- Quote of the Day -->
            <div class="card card-gradient">
              <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px">💡 Quote of the Day</div>
              <p style="font-style:italic;font-size:0.95rem;line-height:1.6;margin-bottom:8px">"${quote.text}"</p>
              <p class="text-muted" style="font-size:0.8rem;text-align:right">— ${quote.author}</p>
            </div>

            <!-- My Subjects -->
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">My Subjects</h3>
                <button class="btn btn-ghost btn-sm" onclick="Router.navigate('/subjects')">Manage</button>
              </div>
              <div class="flex flex-col gap-sm">
                ${subjects.length === 0 ? '<div class="text-muted" style="font-size:0.9rem">No subjects added yet</div>' :
                  subjects.slice(0, 6).map((id, i) => {
                    const s = MockData.subjects.find(sub => sub.id === id);
                    if (!s) return '';
                    return `
                      <div class="flex items-center gap-sm" style="padding:6px 0;cursor:pointer" onclick="Router.navigate('/subjects')">
                        <span>${s.emoji}</span>
                        <span style="font-size:0.9rem;flex:1">${s.name}</span>
                        <div style="width:60px">
                          <div class="progress-bar" style="height:4px">
                            <div class="progress-bar-fill" style="width:${Helpers.randomInt(20, 80)}%"></div>
                          </div>
                        </div>
                      </div>
                    `;
                  }).join('')
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  _renderRecentActivity() {
    const markers = (Store.get('markerHistory') || []).slice(0, 3);
    const practice = (Store.get('practiceHistory') || []).slice(0, 3);

    const activities = [
      ...markers.map(m => ({
        icon: '✏️',
        bg: 'rgba(124,58,237,0.15)',
        title: `Marked: ${Helpers.truncate(m.question, 50)}`,
        meta: `${m.grade}/${m.maxMarks} | ${Helpers.formatDate(m.timestamp, 'relative')}`,
        time: new Date(m.timestamp)
      })),
      ...practice.map(p => ({
        icon: '🎯',
        bg: 'rgba(16,185,129,0.15)',
        title: `Practice: ${p.subject || 'General'}`,
        meta: `${p.score || 'N/A'}% | ${Helpers.formatDate(p.timestamp, 'relative')}`,
        time: new Date(p.timestamp)
      }))
    ].sort((a, b) => b.time - a.time).slice(0, 5);

    if (activities.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <div class="empty-state-title">No activity yet</div>
          <div class="empty-state-text">Start studying to see your activity here!</div>
        </div>
      `;
    }

    return activities.map(a => `
      <div class="history-item">
        <div class="history-icon" style="background:${a.bg}">${a.icon}</div>
        <div class="history-info">
          <div class="history-title">${a.title}</div>
          <div class="history-meta">${a.meta}</div>
        </div>
      </div>
    `).join('');
  }
};
