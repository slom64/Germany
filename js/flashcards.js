window.Flashcards = {
  currentQueue: [],
  currentIndex: 0,
  isFlipped: false,
  sessionStats: { correct: 0, wrong: 0, total: 0, startTime: null, xpEarned: 0 },
  
  // Start a review session
  startSession(options = {}) {
    this.sessionStats = { 
      correct: 0, 
      wrong: 0, 
      total: 0, 
      startTime: Date.now(),
      xpEarned: 0
    };
    this.currentIndex = 0;
    this.isFlipped = false;
    
    const vocab = window.Vocabulary || [];
    const allCardStates = window.Storage ? window.Storage.getCardStates() : {};
    const settings = window.Storage ? window.Storage.getSettings() : { dailyNewCards: 20, dailyReviewCards: 50 };
    const maxCards = options.maxCards || (options.mode === 'learn' ? settings.dailyNewCards : settings.dailyReviewCards);
    
    let selectedWords = [];

    if (options.mode === 'category' && options.category) {
      // Category mode: filter by category
      selectedWords = vocab.filter(w => w.category === options.category);
      if (options.maxCards) selectedWords = selectedWords.slice(0, options.maxCards);
    } else if (options.mode === 'learn') {
      // Learn mode: pick words not yet studied or in 'new' state
      const unstudied = vocab.filter(w => !allCardStates[w.id] || allCardStates[w.id].state === 'new');
      selectedWords = unstudied.slice(0, maxCards);
    } else {
      // Review mode (SRS)
      const statesArray = Object.values(allCardStates);
      if (window.SRS && statesArray.length > 0) {
        const { reviewCards, learningCards } = window.SRS.getDueCards(statesArray, { 
          maxNew: settings.dailyNewCards, 
          maxReview: settings.dailyReviewCards 
        });
        
        const dueStates = [...learningCards, ...reviewCards];
        const stateWordMap = new Map();
        vocab.forEach(w => stateWordMap.set(w.id, w));
        
        selectedWords = dueStates
          .map(s => stateWordMap.get(s.wordId))
          .filter(Boolean);
      }
      
      // If no cards are due for review, pull new unstudied cards
      if (selectedWords.length === 0) {
        const unstudied = vocab.filter(w => !allCardStates[w.id]);
        selectedWords = unstudied.slice(0, Math.min(15, settings.dailyNewCards));
      }
    }
    
    if (selectedWords.length === 0) {
      if (window.UI) {
        window.UI.showToast('No cards to review right now! Try learning new cards. / لا توجد بطاقات للمراجعة حالياً! جرب تعلم كلمات جديدة.', 'info', 4000);
      }
      return;
    }
    
    // Attach card state to each word in queue
    this.currentQueue = selectedWords.map(word => {
      const state = allCardStates[word.id] || (window.SRS ? window.SRS.createCardState(word.id) : { state: 'new' });
      return {
        ...word,
        srsState: state
      };
    });
    
    this.sessionStats.total = this.currentQueue.length;
    window.UI.navigateTo('flashcard-screen');
    window.UI.setHeaderTitle('Flashcards / بطاقات الاستذكار', `${this.currentQueue.length} cards in queue`);
    this.renderCard();
  },
  
  // Render current flashcard
  renderCard() {
    if (this.currentIndex >= this.currentQueue.length) {
      this.showSessionSummary();
      return;
    }
    
    this.isFlipped = false;
    const card = this.currentQueue[this.currentIndex];
    const container = document.getElementById('flashcard-screen-content');
    if (!container) return;
    
    // Progress
    const progressPercent = ((this.currentIndex) / this.currentQueue.length) * 100;
    
    // Gender color coding class
    let genderClass = '';
    if (card.gender === 'masculine' || card.article === 'der') genderClass = 'gender-masc';
    else if (card.gender === 'feminine' || card.article === 'die') genderClass = 'gender-fem';
    else if (card.gender === 'neuter' || card.article === 'das') genderClass = 'gender-neut';
    
    // Find example sentence from window.Sentences
    let exampleGerman = card.exampleGerman || '';
    let exampleArabic = card.exampleArabic || '';
    if (!exampleGerman && window.Sentences) {
      const sent = window.Sentences.find(s => s.wordIds && s.wordIds.includes(card.id));
      if (sent) {
        exampleGerman = sent.german;
        exampleArabic = sent.arabic;
      }
    }
    
    // Verb conjugation preview if applicable
    let conjugationPreview = '';
    if (card.conjugation) {
      conjugationPreview = `
        <div class="conjugation-mini">
          <span>ich <strong>${card.conjugation.ich}</strong></span>
          <span>du <strong>${card.conjugation.du}</strong></span>
          <span>er/sie <strong>${card.conjugation.er}</strong></span>
        </div>
      `;
    }

    const wordToSpeak = (card.article ? `${card.article} ` : '') + card.german;
    
    let html = `
      <div class="flashcard-wrapper">
        <div class="flashcard-header">
          <button class="back-btn-sm" onclick="window.location.hash='dashboard'; App.renderDashboard();">✕ Exit / خروج</button>
          <div class="flashcard-progress-text">Card ${this.currentIndex + 1} of ${this.currentQueue.length} | بطاقة ${this.currentIndex + 1} من ${this.currentQueue.length}</div>
        </div>
        <div class="progress-bar mb-4"><div class="progress-fill" style="width: ${progressPercent}%"></div></div>
        
        <div class="flashcard-container">
          <div class="flashcard" id="active-flashcard" onclick="window.Flashcards.flipCard()">
            <div class="flashcard-inner" id="current-flashcard-inner">
              
              <!-- Front of Card -->
              <div class="flashcard-front">
                <div class="card-top-meta">
                  <span class="word-type-badge">${card.type || 'Word'}</span>
                  <span class="level-tag">${card.level || 'A1'}</span>
                </div>
                
                <div class="card-main-word ${genderClass}">
                  ${card.article ? `<span class="article ${genderClass}">${card.article}</span> ` : ''}
                  <span class="word-text german-text" dir="ltr">${card.german}</span>
                </div>
                
                <div class="card-audio-action" onclick="event.stopPropagation()">
                  <button class="speak-btn-card" onclick="window.Pronunciation && window.Pronunciation.speak('${wordToSpeak.replace(/'/g, "\\'")}')" title="Pronounce">
                    🔊 Listen / استمع
                  </button>
                  <button class="speak-btn-card btn-slow" onclick="window.Pronunciation && window.Pronunciation.speakSlow('${wordToSpeak.replace(/'/g, "\\'")}')" title="Slow">
                    🐢 Slow / ببطء
                  </button>
                </div>
                
                <div class="flip-hint">
                  <span class="flip-icon">🔄</span> Tap or press <kbd>Space</kbd> to reveal answer / اضغط للكشف
                </div>
              </div>
              
              <!-- Back of Card -->
              <div class="flashcard-back">
                <div class="arabic-translation arabic-text" dir="rtl">${card.arabic}</div>
                
                ${card.plural ? `<div class="word-details german-text" dir="ltr"><strong>Plural:</strong> die ${card.plural}</div>` : ''}
                
                ${conjugationPreview}
                
                ${exampleGerman ? `
                  <div class="example-box">
                    <p class="german-text" dir="ltr">"${exampleGerman}"</p>
                    <p class="arabic-text" dir="rtl">"${exampleArabic}"</p>
                    <button class="speak-btn-sm" onclick="event.stopPropagation(); window.Pronunciation && window.Pronunciation.speak('${exampleGerman.replace(/'/g, "\\'")}')">🔊</button>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Rating Buttons (Shown when flipped) -->
        <div class="rating-actions-panel" id="rating-buttons" style="visibility: hidden;">
          ${this.renderRatingButtons(card.srsState)}
        </div>
      </div>
    `;
    
    container.innerHTML = html;
  },
  
  // Flip card
  flipCard() {
    if (this.isFlipped) return;
    this.isFlipped = true;
    
    const cardEl = document.getElementById('active-flashcard');
    const ratingBtns = document.getElementById('rating-buttons');
    
    if (cardEl) cardEl.classList.add('flipped');
    if (ratingBtns) {
      ratingBtns.style.visibility = 'visible';
      ratingBtns.classList.add('animate-fade-in');
    }
  },
  
  // Rate card
  rateCard(rating) {
    if (!this.isFlipped) return;
    
    const card = this.currentQueue[this.currentIndex];
    const isNew = !card.srsState || card.srsState.state === 'new';
    
    // Process SRS
    let updatedState = card.srsState;
    if (window.SRS) {
      updatedState = window.SRS.processReview(card.srsState || window.SRS.createCardState(card.id), rating);
      if (window.Storage) {
        window.Storage.saveCardState(updatedState);
      }
    }
    
    // Calculate stats
    const isSuccess = rating > 1;
    if (isSuccess) {
      this.sessionStats.correct++;
    } else {
      this.sessionStats.wrong++;
    }
    
    // Calculate and award XP
    let xp = 0;
    if (window.Progress) {
      xp = window.Progress.calculateXP(rating, isNew);
      window.Progress.addXP(xp);
      this.sessionStats.xpEarned += xp;
    }
    
    // Update global review counters
    if (window.Storage) {
      const stats = window.Storage.getStats();
      window.Storage.updateStats({
        totalReviews: (stats.totalReviews || 0) + 1,
        totalCorrect: (stats.totalCorrect || 0) + (isSuccess ? 1 : 0)
      });
    }
    
    // Visual animation feedback
    const flashcardEl = document.getElementById('active-flashcard');
    if (flashcardEl) {
      flashcardEl.classList.add(rating === 1 ? 'animate-shake' : 'animate-bounce');
      setTimeout(() => {
        this.nextCard();
      }, 350);
    } else {
      this.nextCard();
    }
  },
  
  // Show next card
  nextCard() {
    this.currentIndex++;
    this.renderCard();
  },
  
  // Session summary screen
  showSessionSummary() {
    const container = document.getElementById('flashcard-screen-content');
    if (!container) return;
    
    const timeSpent = Math.max(1, Math.floor((Date.now() - this.sessionStats.startTime) / 1000));
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    
    const accuracy = this.sessionStats.total > 0 ? Math.round((this.sessionStats.correct / this.sessionStats.total) * 100) : 0;
    
    // Save session in Storage
    if (window.Storage) {
      const sessionData = {
        cardsReviewed: this.sessionStats.total,
        correct: this.sessionStats.correct,
        wrong: this.sessionStats.wrong,
        timeSpent: timeSpent,
        xpEarned: this.sessionStats.xpEarned
      };
      window.Storage.logSession(sessionData);
      
      // Check achievements
      if (window.Progress) {
        window.Progress.checkAchievements(sessionData);
      }
    }
    
    container.innerHTML = `
      <div class="session-summary animate-fade-in">
        <div class="summary-celebration">🎉</div>
        <h2>Session Complete! / اكتملت الجلسة!</h2>
        <p class="summary-subtitle">Great work! You made progress today. / عمل رائع! لقد أحرزت تقدماً اليوم.</p>
        
        <div class="summary-stats-grid">
          <div class="summary-card">
            <div class="summary-icon">📚</div>
            <div class="summary-value">${this.sessionStats.total}</div>
            <div class="summary-label">Reviewed / مراجعة</div>
          </div>
          <div class="summary-card">
            <div class="summary-icon">🎯</div>
            <div class="summary-value">${accuracy}%</div>
            <div class="summary-label">Accuracy / الدقة</div>
          </div>
          <div class="summary-card">
            <div class="summary-icon">⭐</div>
            <div class="summary-value">+${this.sessionStats.xpEarned}</div>
            <div class="summary-label">XP Earned / نقاط الخبرة</div>
          </div>
          <div class="summary-card">
            <div class="summary-icon">⏱️</div>
            <div class="summary-value">${timeStr}</div>
            <div class="summary-label">Time / الوقت</div>
          </div>
        </div>
        
        <div class="summary-actions">
          <button class="btn btn-primary" onclick="window.location.hash='dashboard'; App.renderDashboard();">
            🏠 Back to Dashboard / العودة للرئيسية
          </button>
          <button class="btn btn-secondary" onclick="Flashcards.startSession({ mode: 'review' })">
            🔄 Review More / مراجعة المزيد
          </button>
        </div>
      </div>
    `;
    
    window.UI.setHeaderTitle('Summary / ملخص الجلسة');
  },
  
  // Render rating buttons with preview intervals
  renderRatingButtons(cardState) {
    let intervals = { again: '< 1d', hard: '1d', good: '3d', easy: '7d' };
    if (window.SRS && cardState) {
      intervals = window.SRS.getNextIntervals(cardState);
    }
    
    return `
      <div class="rating-buttons-group">
        <button class="rating-btn again" onclick="event.stopPropagation(); window.Flashcards.rateCard(1)">
          <span class="btn-rate-title">Again / مجدداً</span>
          <span class="btn-rate-interval">${intervals.again}</span>
          <span class="btn-rate-key"><kbd>1</kbd></span>
        </button>
        <button class="rating-btn hard" onclick="event.stopPropagation(); window.Flashcards.rateCard(2)">
          <span class="btn-rate-title">Hard / صعب</span>
          <span class="btn-rate-interval">${intervals.hard}</span>
          <span class="btn-rate-key"><kbd>2</kbd></span>
        </button>
        <button class="rating-btn good" onclick="event.stopPropagation(); window.Flashcards.rateCard(3)">
          <span class="btn-rate-title">Good / جيد</span>
          <span class="btn-rate-interval">${intervals.good}</span>
          <span class="btn-rate-key"><kbd>3</kbd></span>
        </button>
        <button class="rating-btn easy" onclick="event.stopPropagation(); window.Flashcards.rateCard(4)">
          <span class="btn-rate-title">Easy / سهل</span>
          <span class="btn-rate-interval">${intervals.easy}</span>
          <span class="btn-rate-key"><kbd>4</kbd></span>
        </button>
      </div>
    `;
  }
};
