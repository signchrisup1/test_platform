// Study Planner
const PlannerPage = {
  render() {
    const content = document.getElementById('pageContent');
    if (!content) return;

    const events = Store.get('studyPlanner') || [];
    const subjects = Store.get('subjects') || [];
    const weekDates = Helpers.getWeekDates();
    const settings = Store.get('settings') || {};
    const dailyGoal = settings.dailyGoalMinutes || 120;
    const weeklyGoal = settings.weeklyGoalHours || 15;
    const weeklyMins = Storage.getWeeklyStudyMinutes();

    content.innerHTML = `
      <div class="page-content">
        <div class="flex justify-between items-center mb-lg">
          <div>
            <h1><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--primary-light)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> Study Planner</h1>
            <p class="text-muted mt-sm" style="font-size:0.9rem">Plan and organize your study schedule</p>
          </div>
          <button class="btn btn-primary" onclick="PlannerPage.addEvent()">+ Add Event</button>
        </div>

        <!-- Goals & Countdowns -->
        <div class="grid grid-3 gap-md mb-lg">
          <div class="card stat-card">
            <div class="stat-label">Weekly Goal</div>
            <div class="stat-value">${Math.round(weeklyMins / 60)}/${weeklyGoal}h</div>
            <div class="progress-bar mt-sm" style="height:6px">
              <div class="progress-bar-fill" style="width:${Math.min(100, (weeklyMins / 60 / weeklyGoal) * 100)}%"></div>
            </div>
          </div>
          <div class="card stat-card">
            <div class="stat-label">Daily Goal</div>
            <div class="stat-value">${Storage.getTodayStudyMinutes()}/${dailyGoal}m</div>
            <div class="progress-bar mt-sm" style="height:6px">
              <div class="progress-bar-fill" style="width:${Math.min(100, (Storage.getTodayStudyMinutes() / dailyGoal) * 100)}%"></div>
            </div>
          </div>
          <div class="card">
            <div class="stat-label" style="margin-bottom:12px">Exam Countdown</div>
            ${this._renderCountdown()}
          </div>
        </div>

        <!-- Weekly Timetable -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Weekly Schedule</h3>
            <span class="text-muted" style="font-size:0.85rem">
              ${Helpers.formatDate(weekDates[0], 'short')} - ${Helpers.formatDate(weekDates[6], 'short')}
            </span>
          </div>

          <div class="planner-grid">
            <!-- Header row -->
            <div class="planner-header"></div>
            ${weekDates.map((d, i) => {
              const dayName = d.toLocaleDateString('en-AU', { weekday: 'short' });
              const isToday = d.toISOString().split('T')[0] === Helpers.today();
              return `<div class="planner-header" style="${isToday ? 'color:var(--primary);font-weight:700' : ''}">${dayName}<br><span style="font-size:0.7rem">${d.getDate()}</span></div>`;
            }).join('')}

            <!-- Time slots -->
            ${[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map(hour => {
              const timeLabel = hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour - 12}pm`;
              return `
                <div class="planner-time">${timeLabel}</div>
                ${[1, 2, 3, 4, 5, 6, 7].map(day => {
                  const dayEvents = events.filter(e => e.day === day && e.hour === hour);
                  return `
                    <div class="planner-cell" onclick="PlannerPage.addEvent(${day}, ${hour})">
                      ${dayEvents.map(e => {
                        const subjectData = MockData.subjects.find(s => s.id === e.subject);
                        const color = subjectData ? subjectData.color : 'var(--primary)';
                        return `<div class="planner-event" style="background:${color}20;color:${color};border-left:3px solid ${color}" onclick="event.stopPropagation(); PlannerPage.editEvent('${e.id}')">${e.title}</div>`;
                      }).join('')}
                    </div>
                  `;
                }).join('')}
              `;
            }).join('')}
          </div>
        </div>

        <!-- Upcoming Tasks -->
        <div class="card mt-lg">
          <h3 class="card-title" style="margin-bottom:16px">Planned Study Sessions</h3>
          ${events.length === 0 ? '<div class="text-muted" style="font-size:0.9rem">No events planned. Click on the timetable or use "+ Add Event" to plan your studies.</div>' :
            `<div class="flex flex-col gap-sm">
              ${events.sort((a, b) => (a.day * 100 + a.hour) - (b.day * 100 + b.hour)).map(e => {
                const subjectData = MockData.subjects.find(s => s.id === e.subject);
                const days = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                const timeStr = e.hour < 12 ? `${e.hour}:00 AM` : e.hour === 12 ? '12:00 PM' : `${e.hour - 12}:00 PM`;
                return `
                  <div class="flex items-center gap-md" style="padding:8px 12px;background:var(--bg-input);border-radius:var(--radius-sm)">
                    ${subjectData ? `<span>${subjectData.emoji}</span>` : '<span>📖</span>'}
                    <div style="flex:1">
                      <div style="font-weight:500;font-size:0.9rem">${e.title}</div>
                      <div class="text-muted" style="font-size:0.8rem">${days[e.day] || ''} ${timeStr} | ${e.duration || 1}h</div>
                    </div>
                    <button class="btn btn-ghost btn-icon btn-sm" onclick="PlannerPage.deleteEvent('${e.id}')">🗑️</button>
                  </div>
                `;
              }).join('')}
            </div>`
          }
        </div>
      </div>
    `;
  },

  _renderCountdown() {
    // Mock exam date - 3 months from now
    const examDate = new Date();
    examDate.setMonth(examDate.getMonth() + 3);
    const diff = examDate - new Date();
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);

    return `
      <div class="countdown">
        <div class="countdown-item">
          <div class="countdown-value">${days}</div>
          <div class="countdown-unit">Days</div>
        </div>
        <div class="countdown-item">
          <div class="countdown-value">${hours}</div>
          <div class="countdown-unit">Hours</div>
        </div>
      </div>
      <div class="text-muted" style="text-align:center;font-size:0.8rem;margin-top:8px">Until final exams</div>
    `;
  },

  addEvent(day, hour) {
    const subjects = Store.get('subjects') || [];
    Modal.show({
      title: 'Add Study Event',
      content: `
        <div class="form-group">
          <label class="form-label">Title</label>
          <input type="text" class="form-input" id="eventTitle" placeholder="e.g., Maths Practice">
        </div>
        <div class="form-group">
          <label class="form-label">Subject</label>
          <select class="form-select" id="eventSubject">
            <option value="">General</option>
            ${subjects.map(id => {
              const s = MockData.subjects.find(sub => sub.id === id);
              return s ? `<option value="${id}">${s.emoji} ${s.name}</option>` : '';
            }).join('')}
          </select>
        </div>
        <div class="grid grid-2 gap-md">
          <div class="form-group">
            <label class="form-label">Day</label>
            <select class="form-select" id="eventDay">
              ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d, i) =>
                `<option value="${i + 1}" ${day === i + 1 ? 'selected' : ''}>${d}</option>`
              ).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Time</label>
            <select class="form-select" id="eventHour">
              ${Array.from({length: 14}, (_, i) => i + 6).map(h => {
                const label = h < 12 ? `${h}:00 AM` : h === 12 ? '12:00 PM' : `${h-12}:00 PM`;
                return `<option value="${h}" ${hour === h ? 'selected' : ''}>${label}</option>`;
              }).join('')}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Duration (hours)</label>
          <select class="form-select" id="eventDuration">
            <option value="0.5">30 min</option>
            <option value="1" selected>1 hour</option>
            <option value="1.5">1.5 hours</option>
            <option value="2">2 hours</option>
            <option value="3">3 hours</option>
          </select>
        </div>
      `,
      footer: `
        <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
        <button class="btn btn-primary" onclick="PlannerPage.saveEvent()">Add Event</button>
      `
    });
  },

  saveEvent() {
    const title = document.getElementById('eventTitle')?.value?.trim();
    if (!title) { Component.toast('Please enter a title', 'warning'); return; }

    Storage.addPlannerEvent({
      title,
      subject: document.getElementById('eventSubject')?.value || '',
      day: parseInt(document.getElementById('eventDay')?.value) || 1,
      hour: parseInt(document.getElementById('eventHour')?.value) || 9,
      duration: parseFloat(document.getElementById('eventDuration')?.value) || 1,
    });

    Modal.close();
    this.render();
    Component.toast('Event added!', 'success');
  },

  editEvent(id) {
    Modal.confirm('Delete this event?', () => {
      this.deleteEvent(id);
    });
  },

  deleteEvent(id) {
    Storage.deletePlannerEvent(id);
    this.render();
    Component.toast('Event removed', 'info');
  }
};
