// Flashcard System
const FlashcardsPage = {
  _selectedDeck: null,
  _cardIndex: 0,
  _flipped: false,
  _mode: 'browse', // browse, study, quiz
  _tab: 'decks', // decks, study, create

  render() {
    const content = document.getElementById('pageContent');
    if (!content) return;

    content.innerHTML = `
      <div class="page-content">
        <div class="flex justify-between items-center mb-lg">
          <div>
            <h1>🃏 Flashcards</h1>
            <p class="text-muted mt-sm" style="font-size:0.9rem">Create, study, and master your flashcards</p>
          </div>
          <div class="flex gap-sm">
            <button class="btn btn-secondary" onclick="FlashcardsPage.showAIGenerate()">AI Generate</button>
            <button class="btn btn-primary" onclick="FlashcardsPage.showCreateDeck()">+ New Deck</button>
          </div>
        </div>

        <div class="tabs">
          <button class="tab ${this._tab === 'decks' ? 'active' : ''}" onclick="FlashcardsPage.switchTab('decks')">My Decks</button>
          <button class="tab ${this._tab === 'study' ? 'active' : ''}" onclick="FlashcardsPage.switchTab('study')">Study Mode</button>
        </div>

        <div id="flashcardsContent">
          ${this._tab === 'decks' ? this._renderDecks() : this._renderStudy()}
        </div>
      </div>
    `;
  },

  switchTab(tab) {
    this._tab = tab;
    if (tab === 'decks') {
      this._selectedDeck = null;
    }
    this.render();
  },

  _renderDecks() {
    const decks = Store.get('flashcardDecks') || [];

    if (decks.length === 0) {
      return `<div class="card"><div class="empty-state"><div class="empty-state-icon">🃏</div><div class="empty-state-title">No flashcard decks</div><div class="empty-state-text">Create your first deck or generate one with AI.</div><button class="btn btn-primary" onclick="FlashcardsPage.showCreateDeck()">Create Deck</button></div></div>`;
    }

    return `
      <div class="grid grid-3 gap-md">
        ${decks.map(deck => {
          const cards = deck.cards || [];
          const mastered = cards.filter(c => c.confidence >= 3).length;
          const learning = cards.filter(c => c.confidence > 0 && c.confidence < 3).length;
          const newCards = cards.filter(c => !c.confidence).length;
          const subjectData = MockData.subjects.find(s => s.id === deck.subject);

          return `
            <div class="card card-hover" style="cursor:pointer">
              <div onclick="FlashcardsPage.openDeck('${deck.id}')">
                <div class="flex justify-between items-start mb-md">
                  <div>
                    <h4>${Helpers.escapeHtml(deck.name)}</h4>
                    ${subjectData ? `<span class="badge badge-primary" style="margin-top:4px">${subjectData.emoji} ${subjectData.name}</span>` : ''}
                  </div>
                  <button class="btn btn-ghost btn-icon btn-sm" onclick="event.stopPropagation(); FlashcardsPage.deleteDeck('${deck.id}')" data-tooltip="Delete">🗑️</button>
                </div>
                <div class="flex justify-between" style="font-size:0.8rem;color:var(--text-muted)">
                  <span>${cards.length} cards</span>
                </div>
                <div class="progress-bar mt-sm" style="height:6px">
                  <div class="progress-bar-fill success" style="width:${cards.length ? (mastered / cards.length * 100) : 0}%"></div>
                </div>
                <div class="flex gap-md mt-sm" style="font-size:0.75rem">
                  <span style="color:var(--success)">✓ ${mastered} mastered</span>
                  <span style="color:var(--warning)">◑ ${learning} learning</span>
                  <span style="color:var(--text-muted)">○ ${newCards} new</span>
                </div>
              </div>
              <div class="flex gap-sm mt-md">
                <button class="btn btn-primary btn-sm" style="flex:1" onclick="event.stopPropagation(); FlashcardsPage.studyDeck('${deck.id}')">Study</button>
                <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); FlashcardsPage.addCardModal('${deck.id}')">+ Card</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  _renderStudy() {
    const deck = this._selectedDeck;
    if (!deck) {
      return `<div class="card"><div class="empty-state"><div class="empty-state-icon">📖</div><div class="empty-state-title">Select a deck to study</div><div class="empty-state-text">Go to "My Decks" and click Study on a deck.</div></div></div>`;
    }

    const cards = deck.cards || [];
    if (cards.length === 0) {
      return `<div class="card"><div class="empty-state"><div class="empty-state-icon">📭</div><div class="empty-state-title">This deck is empty</div><button class="btn btn-primary mt-md" onclick="FlashcardsPage.addCardModal('${deck.id}')">Add Cards</button></div></div>`;
    }

    const card = cards[this._cardIndex];
    if (!card) { this._cardIndex = 0; return this._renderStudy(); }

    return `
      <div style="max-width:640px;margin:0 auto">
        <div class="flex justify-between items-center mb-md">
          <h3>${Helpers.escapeHtml(deck.name)}</h3>
          <span class="text-muted">${this._cardIndex + 1} / ${cards.length}</span>
        </div>

        <div class="progress-bar mb-lg" style="height:4px">
          <div class="progress-bar-fill" style="width:${((this._cardIndex + 1) / cards.length) * 100}%"></div>
        </div>

        <div class="flashcard-container" onclick="FlashcardsPage.flipCard()">
          <div class="flashcard ${this._flipped ? 'flipped' : ''}" style="min-height:280px">
            <div class="flashcard-face flashcard-front">
              <div class="flashcard-label">Question</div>
              <div class="flashcard-text">${Helpers.escapeHtml(card.front)}</div>
              <div style="margin-top:16px;font-size:0.8rem;color:var(--text-muted)">Click to flip</div>
            </div>
            <div class="flashcard-face flashcard-back">
              <div class="flashcard-label">Answer</div>
              <div class="flashcard-text">${Helpers.escapeHtml(card.back)}</div>
            </div>
          </div>
        </div>

        ${this._flipped ? `
          <div style="text-align:center;margin-top:24px">
            <p class="text-muted mb-md" style="font-size:0.85rem">How well did you know this?</p>
            <div class="flashcard-controls">
              <button class="confidence-btn hard" onclick="FlashcardsPage.rateCard(0)">😕 Again</button>
              <button class="confidence-btn medium" onclick="FlashcardsPage.rateCard(1)">🤔 Hard</button>
              <button class="confidence-btn" onclick="FlashcardsPage.rateCard(2)">😊 Good</button>
              <button class="confidence-btn easy" onclick="FlashcardsPage.rateCard(3)">😎 Easy</button>
            </div>
          </div>
        ` : ''}

        <div class="flex justify-center gap-md mt-lg">
          <button class="btn btn-secondary" onclick="FlashcardsPage.prevCard()" ${this._cardIndex === 0 ? 'disabled' : ''}>← Previous</button>
          <button class="btn btn-secondary" onclick="FlashcardsPage.nextCard()" ${this._cardIndex >= cards.length - 1 ? 'disabled' : ''}>Next →</button>
        </div>
      </div>
    `;
  },

  flipCard() {
    this._flipped = !this._flipped;
    const fc = document.querySelector('.flashcard');
    if (fc) fc.classList.toggle('flipped', this._flipped);

    if (this._flipped) {
      const container = document.querySelector('.flashcard-container');
      if (container) {
        container.insertAdjacentHTML('afterend', `
          <div style="text-align:center;margin-top:24px" id="confidenceControls">
            <p class="text-muted mb-md" style="font-size:0.85rem">How well did you know this?</p>
            <div class="flashcard-controls">
              <button class="confidence-btn hard" onclick="FlashcardsPage.rateCard(0)">😕 Again</button>
              <button class="confidence-btn medium" onclick="FlashcardsPage.rateCard(1)">🤔 Hard</button>
              <button class="confidence-btn" onclick="FlashcardsPage.rateCard(2)">😊 Good</button>
              <button class="confidence-btn easy" onclick="FlashcardsPage.rateCard(3)">😎 Easy</button>
            </div>
          </div>
        `);
      }
    } else {
      const controls = document.getElementById('confidenceControls');
      if (controls) controls.remove();
    }
  },

  rateCard(confidence) {
    if (!this._selectedDeck) return;
    const cards = this._selectedDeck.cards || [];
    const card = cards[this._cardIndex];
    if (card) {
      Storage.updateCardConfidence(this._selectedDeck.id, card.id, confidence);
      // Refresh deck data
      const decks = Store.get('flashcardDecks') || [];
      this._selectedDeck = decks.find(d => d.id === this._selectedDeck.id);
    }
    this.nextCard();
  },

  nextCard() {
    const cards = this._selectedDeck?.cards || [];
    if (this._cardIndex < cards.length - 1) {
      this._cardIndex++;
      this._flipped = false;
      const contentDiv = document.getElementById('flashcardsContent');
      if (contentDiv) contentDiv.innerHTML = this._renderStudy();
    } else {
      Component.toast('You\'ve finished this deck!', 'success');
      Storage.addStudyTime(5);
      Storage.checkAchievements();
    }
  },

  prevCard() {
    if (this._cardIndex > 0) {
      this._cardIndex--;
      this._flipped = false;
      const contentDiv = document.getElementById('flashcardsContent');
      if (contentDiv) contentDiv.innerHTML = this._renderStudy();
    }
  },

  studyDeck(deckId) {
    const decks = Store.get('flashcardDecks') || [];
    this._selectedDeck = decks.find(d => d.id === deckId);
    this._cardIndex = 0;
    this._flipped = false;
    this._tab = 'study';
    this.render();
  },

  openDeck(deckId) {
    const decks = Store.get('flashcardDecks') || [];
    const deck = decks.find(d => d.id === deckId);
    if (!deck) return;

    const cards = deck.cards || [];
    Modal.show({
      title: deck.name,
      large: true,
      content: `
        <div class="flex justify-between items-center mb-md">
          <span class="text-muted">${cards.length} cards</span>
          <button class="btn btn-sm btn-primary" onclick="Modal.close(); FlashcardsPage.addCardModal('${deckId}')">+ Add Card</button>
        </div>
        ${cards.length === 0 ? '<div class="text-muted" style="text-align:center;padding:20px">No cards yet</div>' :
          `<div class="flex flex-col gap-sm">
            ${cards.map((c, i) => `
              <div style="padding:12px;background:var(--bg-input);border-radius:var(--radius-sm);font-size:0.9rem">
                <div class="flex justify-between items-start">
                  <div style="flex:1">
                    <div style="font-weight:500;margin-bottom:4px">Q: ${Helpers.escapeHtml(c.front)}</div>
                    <div class="text-muted">A: ${Helpers.escapeHtml(c.back)}</div>
                  </div>
                  <span class="badge badge-${c.confidence >= 3 ? 'success' : c.confidence > 0 ? 'warning' : 'info'}">
                    ${c.confidence >= 3 ? 'Mastered' : c.confidence > 0 ? 'Learning' : 'New'}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>`
        }
      `,
      footer: `<button class="btn btn-primary" onclick="Modal.close(); FlashcardsPage.studyDeck('${deckId}')">Study Deck</button>`
    });
  },

  showCreateDeck() {
    const subjects = Store.get('subjects') || [];
    Modal.show({
      title: 'Create New Deck',
      content: `
        <div class="form-group">
          <label class="form-label">Deck Name</label>
          <input type="text" class="form-input" id="newDeckName" placeholder="e.g., Biology Key Terms">
        </div>
        <div class="form-group">
          <label class="form-label">Subject</label>
          <select class="form-select" id="newDeckSubject">
            <option value="">None</option>
            ${subjects.map(id => {
              const s = MockData.subjects.find(sub => sub.id === id);
              return s ? `<option value="${id}">${s.emoji} ${s.name}</option>` : '';
            }).join('')}
          </select>
        </div>
      `,
      footer: `
        <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
        <button class="btn btn-primary" onclick="FlashcardsPage.createDeck()">Create</button>
      `
    });
  },

  createDeck() {
    const name = document.getElementById('newDeckName')?.value?.trim();
    if (!name) { Component.toast('Please enter a deck name', 'warning'); return; }
    const subject = document.getElementById('newDeckSubject')?.value || null;

    Storage.addFlashcardDeck({ name, subject, cards: [] });
    Modal.close();
    this.render();
    Component.toast('Deck created!', 'success');
  },

  deleteDeck(deckId) {
    Modal.confirm('Are you sure you want to delete this deck?', () => {
      Storage.deleteFlashcardDeck(deckId);
      this.render();
      Component.toast('Deck deleted', 'info');
    });
  },

  addCardModal(deckId) {
    Modal.show({
      title: 'Add Flashcard',
      content: `
        <div class="form-group">
          <label class="form-label">Front (Question)</label>
          <textarea class="form-textarea" id="cardFront" placeholder="Enter the question or prompt" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Back (Answer)</label>
          <textarea class="form-textarea" id="cardBack" placeholder="Enter the answer" rows="3"></textarea>
        </div>
      `,
      footer: `
        <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
        <button class="btn btn-primary" onclick="FlashcardsPage.addCard('${deckId}')">Add Card</button>
      `
    });
  },

  addCard(deckId) {
    const front = document.getElementById('cardFront')?.value?.trim();
    const back = document.getElementById('cardBack')?.value?.trim();
    if (!front || !back) { Component.toast('Please fill in both sides', 'warning'); return; }

    Storage.addCardToDeck(deckId, {
      front, back, confidence: 0, lastReviewed: null,
      nextReview: new Date().toISOString(), timesReviewed: 0
    });

    Modal.close();
    this.render();
    Component.toast('Card added!', 'success');
  },

  async showAIGenerate() {
    const subjects = Store.get('subjects') || [];
    Modal.show({
      title: 'AI Flashcard Generator',
      large: true,
      content: `
        <div class="form-group">
          <label class="form-label">Deck Name</label>
          <input type="text" class="form-input" id="aiDeckName" placeholder="e.g., Chapter 5 Key Terms">
        </div>
        <div class="form-group">
          <label class="form-label">Subject</label>
          <select class="form-select" id="aiDeckSubject">
            <option value="">None</option>
            ${subjects.map(id => {
              const s = MockData.subjects.find(sub => sub.id === id);
              return s ? `<option value="${id}">${s.emoji} ${s.name}</option>` : '';
            }).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Paste your study notes</label>
          <textarea class="form-textarea" id="aiNotes" placeholder="Paste your study notes here and AI will generate flashcards from them..." rows="8"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Number of cards to generate</label>
          <select class="form-select" id="aiCardCount">
            <option value="3">3 cards</option>
            <option value="5" selected>5 cards</option>
            <option value="10">10 cards</option>
          </select>
        </div>
      `,
      footer: `
        <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
        <button class="btn btn-primary" id="aiGenBtn" onclick="FlashcardsPage.generateAI()">Generate Cards</button>
      `
    });
  },

  async generateAI() {
    const name = document.getElementById('aiDeckName')?.value?.trim() || 'AI Generated Deck';
    const subject = document.getElementById('aiDeckSubject')?.value || null;
    const notes = document.getElementById('aiNotes')?.value?.trim();
    const count = parseInt(document.getElementById('aiCardCount')?.value) || 5;

    if (!notes || notes.length < 30) {
      Component.toast('Please paste more study notes (at least a paragraph)', 'warning');
      return;
    }

    const btn = document.getElementById('aiGenBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;display:inline-block"></div> Generating...'; }

    try {
      const cards = await MockAI.generateFlashcards(notes, count);
      Storage.addFlashcardDeck({ name, subject, cards });
      Modal.close();
      this.render();
      Component.toast(`${cards.length} flashcards generated!`, 'success');
    } catch (e) {
      Component.toast('Failed to generate flashcards', 'error');
    }

    if (btn) { btn.disabled = false; btn.innerHTML = 'Generate Cards'; }
  }
};
