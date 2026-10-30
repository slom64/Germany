window.SRS = {
  // Create initial card state
  createCardState(wordId) {
    return {
      wordId: wordId,
      state: 'new', // 'new', 'learning', 'review'
      repetition: 0,
      interval: 0,
      easeFactor: 2.5,
      dueDate: new Date().toISOString().split('T')[0],
      lapses: 0
    };
  },

  // Process a review: rating 1=Again, 2=Hard, 3=Good, 4=Easy
  // Returns updated card state with new interval, easeFactor, dueDate
  processReview(cardState, rating) {
    let { state, repetition, interval, easeFactor, lapses } = cardState;
    const now = new Date();
    let nextInterval = 0;

    if (rating === 1) { // Again
      repetition = 0;
      nextInterval = 1;
      easeFactor = Math.max(1.3, easeFactor - 0.20);
      lapses += 1;
      state = 'learning';
    } else if (rating === 2) { // Hard
      if (repetition === 0) {
        nextInterval = 1;
      } else {
        nextInterval = Math.max(1, Math.round(interval * 1.2));
      }
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      state = 'learning';
    } else if (rating === 3) { // Good
      if (repetition === 0) {
        nextInterval = 1;
      } else if (repetition === 1) {
        nextInterval = 6;
      } else {
        nextInterval = Math.round(interval * easeFactor);
      }
      repetition += 1;
      state = 'review';
    } else if (rating === 4) { // Easy
      if (repetition === 0) {
        nextInterval = 4;
      } else if (repetition === 1) {
        nextInterval = 10;
      } else {
        nextInterval = Math.round(interval * easeFactor * 1.3);
      }
      easeFactor += 0.15;
      repetition += 1;
      state = 'review';
    }

    // Apply Fuzz: ±5% for intervals >= 4 days
    if (nextInterval >= 4) {
      const fuzzRange = nextInterval * 0.05;
      const fuzz = (Math.random() * (fuzzRange * 2)) - fuzzRange;
      nextInterval = Math.max(4, Math.round(nextInterval + fuzz));
    }

    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + nextInterval);

    return {
      ...cardState,
      state,
      repetition,
      interval: nextInterval,
      easeFactor,
      dueDate: dueDate.toISOString().split('T')[0],
      lapses
    };
  },

  // Get cards due for review today
  // Returns { newCards: [], reviewCards: [], learningCards: [] }
  getDueCards(allCardStates, options = { maxNew: 20, maxReview: 50 }) {
    const today = new Date().toISOString().split('T')[0];
    
    let newCards = [];
    let learningCards = [];
    let reviewCards = [];

    for (const card of allCardStates) {
      if (card.state === 'new') {
        newCards.push(card);
      } else if (card.state === 'learning' && card.dueDate <= today) {
        learningCards.push(card);
      } else if (card.state === 'review' && card.dueDate <= today) {
        reviewCards.push(card);
      }
    }

    // Shuffle cards
    newCards = newCards.sort(() => Math.random() - 0.5).slice(0, options.maxNew);
    reviewCards = reviewCards.sort(() => Math.random() - 0.5).slice(0, options.maxReview);
    learningCards = learningCards.sort(() => Math.random() - 0.5); // learning cards always due

    return { newCards, reviewCards, learningCards };
  },

  // Get next review intervals for preview (shown on buttons)
  getNextIntervals(cardState) {
    const again = this.processReview({ ...cardState }, 1).interval;
    const hard = this.processReview({ ...cardState }, 2).interval;
    const good = this.processReview({ ...cardState }, 3).interval;
    const easy = this.processReview({ ...cardState }, 4).interval;

    return {
      again: this.formatInterval(again),
      hard: this.formatInterval(hard),
      good: this.formatInterval(good),
      easy: this.formatInterval(easy)
    };
  },

  // Format interval for display
  formatInterval(days) {
    if (days < 1) return '< 1d';
    if (days === 1) return '1d';
    if (days < 7) return `${days}d`;
    if (days < 30) return `${Math.round(days / 7)}w`;
    if (days < 365) return `${Math.round(days / 30)}mo`;
    return `${(days / 365).toFixed(1)}y`;
  }
};
