// Storage utilities - wraps localStorage with helpers
const Storage = {
  // Initialize with default data if first time
  initializeDefaults() {
    const state = Store.get();

    // Add sample marker history if empty
    if (!state.markerHistory || state.markerHistory.length === 0) {
      Store.set('markerHistory', MockData.sampleMarkerHistory);
    }

    // Add sample flashcard decks if empty
    if (!state.flashcardDecks || state.flashcardDecks.length === 0) {
      Store.set('flashcardDecks', MockData.sampleFlashcardDecks);
    }

    // Add sample friends if empty
    if (!state.friends || state.friends.length === 0) {
      Store.set('friends', MockData.friends);
    }

    // Add sample planner events if empty
    if (!state.studyPlanner || state.studyPlanner.length === 0) {
      Store.set('studyPlanner', MockData.samplePlannerEvents);
    }

    // Add sample resources if empty
    if (!state.resources || state.resources.length === 0) {
      Store.set('resources', MockData.sampleResources);
    }

    // Initialize daily study tracking
    this.updateStudyStreak();
  },

  // Track study time
  addStudyTime(minutes) {
    const today = Helpers.today();
    const dailyMinutes = Store.get('dailyStudyMinutes') || {};
    dailyMinutes[today] = (dailyMinutes[today] || 0) + minutes;
    Store.set('dailyStudyMinutes', dailyMinutes);

    const total = (Store.get('totalStudyMinutes') || 0) + minutes;
    Store.set('totalStudyMinutes', total);

    this.updateStudyStreak();
  },

  // Update study streak
  updateStudyStreak() {
    const today = Helpers.today();
    const lastDate = Store.get('lastStudyDate');
    const dailyMinutes = Store.get('dailyStudyMinutes') || {};

    if (dailyMinutes[today] && dailyMinutes[today] > 0) {
      Store.set('lastStudyDate', today);

      if (!lastDate) {
        Store.set('studyStreak', 1);
      } else {
        const last = new Date(lastDate);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate - last) / 86400000);

        if (diffDays === 0) {
          // Same day, streak unchanged
        } else if (diffDays === 1) {
          Store.set('studyStreak', (Store.get('studyStreak') || 0) + 1);
        } else {
          Store.set('studyStreak', 1);
        }
      }
    }
  },

  // Add a marked response to history
  addMarkerHistory(entry) {
    const history = Store.get('markerHistory') || [];
    history.unshift({ ...entry, id: Helpers.uid() });
    Store.set('markerHistory', history);
  },

  // Add a guide to history
  addGuideHistory(entry) {
    const history = Store.get('guideHistory') || [];
    history.unshift({ ...entry, id: Helpers.uid(), saved: false });
    Store.set('guideHistory', history);
  },

  // Toggle guide saved
  toggleGuideSaved(id) {
    const history = Store.get('guideHistory') || [];
    const item = history.find(h => h.id === id);
    if (item) {
      item.saved = !item.saved;
      Store.set('guideHistory', history);
    }
  },

  // Add practice history
  addPracticeHistory(entry) {
    const history = Store.get('practiceHistory') || [];
    history.unshift({ ...entry, id: Helpers.uid(), timestamp: new Date().toISOString() });
    Store.set('practiceHistory', history);
  },

  // Flashcard deck operations
  addFlashcardDeck(deck) {
    const decks = Store.get('flashcardDecks') || [];
    decks.push({ ...deck, id: Helpers.uid() });
    Store.set('flashcardDecks', decks);
    return decks[decks.length - 1];
  },

  updateFlashcardDeck(deckId, updates) {
    const decks = Store.get('flashcardDecks') || [];
    const idx = decks.findIndex(d => d.id === deckId);
    if (idx !== -1) {
      Object.assign(decks[idx], updates);
      Store.set('flashcardDecks', decks);
    }
  },

  deleteFlashcardDeck(deckId) {
    const decks = Store.get('flashcardDecks') || [];
    Store.set('flashcardDecks', decks.filter(d => d.id !== deckId));
  },

  addCardToDeck(deckId, card) {
    const decks = Store.get('flashcardDecks') || [];
    const deck = decks.find(d => d.id === deckId);
    if (deck) {
      if (!deck.cards) deck.cards = [];
      deck.cards.push({ ...card, id: Helpers.uid() });
      Store.set('flashcardDecks', decks);
    }
  },

  updateCardConfidence(deckId, cardId, confidence) {
    const decks = Store.get('flashcardDecks') || [];
    const deck = decks.find(d => d.id === deckId);
    if (deck) {
      const card = deck.cards.find(c => c.id === cardId);
      if (card) {
        card.confidence = confidence;
        card.lastReviewed = new Date().toISOString();
        card.timesReviewed = (card.timesReviewed || 0) + 1;
        // Simple spaced repetition - higher confidence = longer interval
        const intervals = [1, 3, 7, 14, 30]; // days
        const days = intervals[Math.min(confidence, intervals.length - 1)];
        const next = new Date();
        next.setDate(next.getDate() + days);
        card.nextReview = next.toISOString();
        Store.set('flashcardDecks', decks);
      }
    }
  },

  // Study session operations
  addStudySession(session) {
    const sessions = Store.get('studySessions') || [];
    sessions.unshift({ ...session, id: Helpers.uid() });
    Store.set('studySessions', sessions);
  },

  // Planner operations
  addPlannerEvent(event) {
    const events = Store.get('studyPlanner') || [];
    events.push({ ...event, id: Helpers.uid() });
    Store.set('studyPlanner', events);
  },

  deletePlannerEvent(eventId) {
    const events = Store.get('studyPlanner') || [];
    Store.set('studyPlanner', events.filter(e => e.id !== eventId));
  },

  // Resource operations
  addResource(resource) {
    const resources = Store.get('resources') || [];
    resources.unshift({ ...resource, id: Helpers.uid(), addedDate: new Date().toISOString() });
    Store.set('resources', resources);
  },

  deleteResource(resourceId) {
    const resources = Store.get('resources') || [];
    Store.set('resources', resources.filter(r => r.id !== resourceId));
  },

  // Get today's study minutes
  getTodayStudyMinutes() {
    const daily = Store.get('dailyStudyMinutes') || {};
    return daily[Helpers.today()] || 0;
  },

  // Get weekly study minutes
  getWeeklyStudyMinutes() {
    const daily = Store.get('dailyStudyMinutes') || {};
    const weekDates = Helpers.getWeekDates();
    let total = 0;
    weekDates.forEach(d => {
      const key = d.toISOString().split('T')[0];
      total += daily[key] || 0;
    });
    return total;
  },

  // Get study data for last N days
  getStudyHistory(days = 7) {
    const daily = Store.get('dailyStudyMinutes') || {};
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      result.push({
        date: key,
        minutes: daily[key] || 0,
        day: Helpers.getDayOfWeek(d)
      });
    }
    return result;
  },

  // Check achievements
  checkAchievements() {
    const state = Store.get();
    const unlocked = state.achievements || [];
    const newAchievements = [];

    MockData.achievements.forEach(a => {
      if (!unlocked.includes(a.id) && a.condition(state)) {
        unlocked.push(a.id);
        newAchievements.push(a);
      }
    });

    if (newAchievements.length > 0) {
      Store.set('achievements', unlocked);
      newAchievements.forEach(a => {
        Component.toast(`${a.icon} Achievement unlocked: ${a.name}!`, 'success');
      });
    }

    return unlocked;
  }
};
