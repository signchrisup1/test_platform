// Dashboard / Home screen
const DashboardPage = {
  render() {
    var content = document.getElementById('pageContent');
    if (!content) return;

    try {
      var user = Store.get('user') || {};
      var totalMins = Store.get('totalStudyMinutes') || 0;
      var streak = Store.get('studyStreak') || 0;
      var atarGoal = Store.get('atarGoal') || 90;
      var subjects = Store.get('subjects') || [];
      var practiceHistory = Store.get('practiceHistory') || [];
      var settings = Store.get('settings') || {};
      var dailyGoal = settings.dailyGoalMinutes || 120;
      var todayMins = Storage.getTodayStudyMinutes();
      var weekData = Storage.getStudyHistory(7);
      var avgScore = practiceHistory.length ?
        Math.round(practiceHistory.reduce(function(s, h) { return s + (h.score || 0); }, 0) / practiceHistory.length) : 0;
      var greeting = Helpers.getGreeting();

      var quotes = MockData.quotes || [];
      var quoteText = '';
      if (quotes.length > 0) {
        var quoteObj = quotes[Math.floor(Math.random() * quotes.length)];
        quoteText = '"' + quoteObj.text + '" — ' + quoteObj.author;
      }

      var userName = 'there';
      if (user && user.name) {
        var parts = user.name.split(' ');
        userName = parts[0] || 'there';
      }

      var dailyPct = dailyGoal > 0 ? Math.min(100, Math.round(todayMins / dailyGoal * 100)) : 0;

      var progressRingHtml = '';
      try { progressRingHtml = Charts.progressRing(dailyPct, { size: 72, strokeWidth: 5, color: 'var(--primary-light)' }); } catch(e) { progressRingHtml = ''; }

      var sparklineHtml = '';
      try { sparklineHtml = Charts.sparkline(weekData.map(function(d) { return d.minutes; }), { width: 120, height: 24, color: 'var(--primary-light)' }); } catch(e) { sparklineHtml = ''; }

      var barChartHtml = '';
      try {
        barChartHtml = Charts.barChart(weekData.map(function(d) {
          return {
            label: d.day,
            value: d.minutes,
            color: d.date === Helpers.today() ? 'var(--gradient-primary)' : ''
          };
        }), { height: 160 });
      } catch(e) { barChartHtml = '<div class="text-muted">Chart unavailable</div>'; }

      var dailyGoalRingHtml = '';
      try {
        dailyGoalRingHtml = Charts.progressRing(Math.min(100, Math.round(todayMins / dailyGoal * 100)), { size: 140, strokeWidth: 8, color: todayMins >= dailyGoal ? 'var(--success)' : 'var(--primary)' });
      } catch(e) { dailyGoalRingHtml = ''; }

      // Build subjects HTML
      var subjectsHtml = '';
      if (subjects.length === 0) {
        subjectsHtml = '<div style="text-align:center;padding:24px;color:var(--text-muted)"><div style="font-size:0.9rem">No subjects yet</div><button class="btn btn-primary btn-sm mt-md" onclick="Router.navigate(\'/subjects\')">Add Subjects</button></div>';
      } else {
        var subjectItems = [];
        subjects.slice(0, 5).forEach(function(id) {
          var s = MockData.subjects.find(function(sub) { return sub.id === id; });
          if (!s) return;
          var topics = MockData.syllabusTopics[id] || [];
          var practiced = topics.filter(function(t) { return t.status === 'practiced'; }).length;
          var pct = topics.length ? Math.round((practiced / topics.length) * 100) : 0;
          subjectItems.push(
            '<div class="flex items-center gap-md" style="padding:8px 0;cursor:pointer" onclick="Router.navigate(\'/subjects\')">' +
              '<div style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:var(--radius-sm);background:' + s.color + '15;font-size:1.1rem">' + s.emoji + '</div>' +
              '<div style="flex:1;min-width:0">' +
                '<div class="flex justify-between items-center mb-xs">' +
                  '<span style="font-weight:500;font-size:0.9rem">' + s.name + '</span>' +
                  '<span style="font-size:0.75rem;color:var(--text-muted)">' + pct + '%</span>' +
                '</div>' +
                '<div class="progress-bar" style="height:4px">' +
                  '<div class="progress-bar-fill" style="width:' + pct + '%;background:' + s.color + '"></div>' +
                '</div>' +
              '</div>' +
            '</div>'
          );
        });
        subjectsHtml = '<div class="flex flex-col gap-sm">' + subjectItems.join('') + '</div>';
      }

      // Build activity HTML
      var activityHtml = '';
      if (practiceHistory.length === 0) {
        activityHtml = '<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:0.9rem">No activity yet. Start practicing!</div>';
      } else {
        var activityItems = [];
        practiceHistory.slice(0, 5).forEach(function(h) {
          var subjectData = MockData.subjects.find(function(s) { return s.id === h.subjectId; });
          var score = h.score || 0;
          var scoreColor = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--danger)';
          var question = Helpers.truncate(h.question || 'Question', 50);
          var subjectName = subjectData ? subjectData.name : '';
          var dateStr = '';
          try { dateStr = Helpers.formatDate(h.timestamp, 'relative'); } catch(e) { dateStr = ''; }
          activityItems.push(
            '<div class="flex items-center gap-md" style="padding:8px 12px;background:var(--bg-input);border-radius:var(--radius-sm)">' +
              '<div style="width:8px;height:8px;border-radius:50%;background:' + scoreColor + '"></div>' +
              '<div style="flex:1;min-width:0">' +
                '<div class="truncate" style="font-size:0.85rem;font-weight:500">' + question + '</div>' +
                '<div class="text-muted" style="font-size:0.75rem">' + subjectName + ' &middot; ' + dateStr + '</div>' +
              '</div>' +
              '<span style="font-weight:600;font-size:0.85rem;color:' + (score >= 80 ? 'var(--success)' : 'var(--warning)') + '">' + score + '%</span>' +
            '</div>'
          );
        });
        activityHtml = '<div class="flex flex-col gap-sm">' + activityItems.join('') + '</div>';
      }

      var weekTotal = 0;
      weekData.forEach(function(d) { weekTotal += d.minutes; });

      content.innerHTML =
        '<div class="page-content">' +
          '<div class="dashboard-welcome">' +
            '<div class="welcome-content">' +
              '<div>' +
                '<div class="welcome-greeting">' + greeting + ', ' + userName + '</div>' +
                '<div class="welcome-subtitle">' + quoteText + '</div>' +
              '</div>' +
              '<div class="atar-tracker">' +
                progressRingHtml +
                '<div style="position:absolute;display:flex;flex-direction:column;align-items:center;line-height:1.2">' +
                  '<div style="font-size:1.1rem;font-weight:700">' + dailyPct + '%</div>' +
                  '<div style="font-size:0.6rem;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:0.05em">daily</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +

          '<div class="grid grid-4 gap-md mb-lg">' +
            '<div class="card stat-card">' +
              '<div class="flex items-center gap-sm mb-sm">' +
                '<div style="padding:8px;background:rgba(99,102,241,0.1);border-radius:var(--radius-sm)">' +
                  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--primary-light)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
                '</div>' +
                '<span class="stat-label">Study Time</span>' +
              '</div>' +
              '<div class="stat-value text-gradient">' + Helpers.formatMinutes(totalMins) + '</div>' +
              '<div style="margin-top:8px">' + sparklineHtml + '</div>' +
            '</div>' +

            '<div class="card stat-card">' +
              '<div class="flex items-center gap-sm mb-sm">' +
                '<div style="padding:8px;background:rgba(245,158,11,0.1);border-radius:var(--radius-sm)">' +
                  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--warning)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' +
                '</div>' +
                '<span class="stat-label">Streak</span>' +
              '</div>' +
              '<div class="stat-value" style="-webkit-text-fill-color:var(--warning);color:var(--warning)">' + streak + ' days</div>' +
              '<div style="color:var(--text-muted);font-size:0.8rem;margin-top:8px">' + (streak > 0 ? 'Keep it going!' : 'Start studying today') + '</div>' +
            '</div>' +

            '<div class="card stat-card">' +
              '<div class="flex items-center gap-sm mb-sm">' +
                '<div style="padding:8px;background:rgba(6,182,212,0.1);border-radius:var(--radius-sm)">' +
                  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--info)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>' +
                '</div>' +
                '<span class="stat-label">Questions</span>' +
              '</div>' +
              '<div class="stat-value" style="-webkit-text-fill-color:var(--info);color:var(--info)">' + practiceHistory.length + '</div>' +
              '<div style="color:var(--text-muted);font-size:0.8rem;margin-top:8px">' + (avgScore > 0 ? avgScore + '% avg score' : 'No attempts yet') + '</div>' +
            '</div>' +

            '<div class="card stat-card">' +
              '<div class="flex items-center gap-sm mb-sm">' +
                '<div style="padding:8px;background:rgba(139,92,246,0.1);border-radius:var(--radius-sm)">' +
                  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>' +
                '</div>' +
                '<span class="stat-label">ATAR Goal</span>' +
              '</div>' +
              '<div class="stat-value" style="-webkit-text-fill-color:var(--accent);color:var(--accent)">' + atarGoal + '</div>' +
              '<div style="color:var(--text-muted);font-size:0.8rem;margin-top:8px">' + subjects.length + ' subjects</div>' +
            '</div>' +
          '</div>' +

          '<div class="mb-lg">' +
            '<h3 style="margin-bottom:16px">Quick Actions</h3>' +
            '<div class="quick-actions">' +
              '<div class="quick-action" onclick="Router.navigate(\'/marker\')">' +
                '<div class="quick-action-icon" style="background:rgba(99,102,241,0.1)">' +
                  '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--primary-light)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>' +
                '</div>' +
                '<div class="quick-action-label">AI Marker</div>' +
              '</div>' +
              '<div class="quick-action" onclick="Router.navigate(\'/guide\')">' +
                '<div class="quick-action-icon" style="background:rgba(14,165,233,0.1)">' +
                  '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>' +
                '</div>' +
                '<div class="quick-action-label">Guide</div>' +
              '</div>' +
              '<div class="quick-action" onclick="Router.navigate(\'/practice\')">' +
                '<div class="quick-action-icon" style="background:rgba(16,185,129,0.1)">' +
                  '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>' +
                '</div>' +
                '<div class="quick-action-label">Practice</div>' +
              '</div>' +
              '<div class="quick-action" onclick="Router.navigate(\'/flashcards\')">' +
                '<div class="quick-action-icon" style="background:rgba(139,92,246,0.1)">' +
                  '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>' +
                '</div>' +
                '<div class="quick-action-label">Flashcards</div>' +
              '</div>' +
              '<div class="quick-action" onclick="Router.navigate(\'/sessions\')">' +
                '<div class="quick-action-icon" style="background:rgba(245,158,11,0.1)">' +
                  '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--warning)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' +
                '</div>' +
                '<div class="quick-action-label">Study Session</div>' +
              '</div>' +
            '</div>' +
          '</div>' +

          '<div class="grid grid-2 gap-lg">' +
            '<div class="card">' +
              '<div class="flex justify-between items-center mb-md">' +
                '<h3>Weekly Progress</h3>' +
                '<span class="text-muted" style="font-size:0.8rem">' + Helpers.formatMinutes(weekTotal) + ' total</span>' +
              '</div>' +
              barChartHtml +
            '</div>' +

            '<div class="card">' +
              '<div class="flex justify-between items-center mb-md">' +
                '<h3>My Subjects</h3>' +
                '<button class="btn btn-ghost btn-sm" onclick="Router.navigate(\'/subjects\')">' +
                  'View all ' +
                  '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>' +
                '</button>' +
              '</div>' +
              subjectsHtml +
            '</div>' +

            '<div class="card">' +
              '<h3 style="margin-bottom:16px">Recent Activity</h3>' +
              activityHtml +
            '</div>' +

            '<div class="card">' +
              '<h3 style="margin-bottom:16px">Today\'s Goal</h3>' +
              '<div style="text-align:center;padding:16px 0">' +
                '<div style="position:relative;display:inline-flex;align-items:center;justify-content:center">' +
                  dailyGoalRingHtml +
                  '<div style="position:absolute;display:flex;flex-direction:column;align-items:center">' +
                    '<div style="font-size:2rem;font-weight:700">' + todayMins + '</div>' +
                    '<div style="font-size:0.8rem;color:var(--text-muted)">/ ' + dailyGoal + ' min</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<div class="flex justify-center mt-md">' +
                '<button class="btn btn-primary" onclick="Router.navigate(\'/sessions\')">' +
                  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>' +
                  ' Start Study Session' +
                '</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
    } catch (e) {
      console.error('Dashboard render error:', e);
      content.innerHTML =
        '<div class="page-content">' +
          '<div class="card" style="padding:40px;text-align:center">' +
            '<h3 style="margin-bottom:8px">Dashboard Error</h3>' +
            '<p class="text-muted">' + e.message + '</p>' +
            '<button class="btn btn-primary mt-md" onclick="location.reload()">Reload</button>' +
          '</div>' +
        '</div>';
    }
  }
};
