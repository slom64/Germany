window.Storage = {
  // Key names
  KEYS: {
    CARD_STATES: 'dl_card_states',
    SETTINGS: 'dl_settings',
    HISTORY: 'dl_session_history',
    STATS: 'dl_stats',
    ACHIEVEMENTS: 'dl_achievements',
    LEARNED_WORDS: 'dl_learned_words'
  },

  DEFAULT_SETTINGS: {
    theme: 'light',
    dailyNewCards: 20,
    dailyReviewCards: 50,
    autoPlayAudio: false,
    speechRate: 0.85,
    showPhonetics: false,
    interfaceLanguage: 'ar',  // 'ar' or 'en'
    enableAnimations: true
  },

  DEFAULT_STATS: {
    totalReviews: 0,
    totalCorrect: 0,
    streak: 0,
    lastActiveDate: null,
    xp: 0,
    level: 1
  },

  ACHIEVEMENTS_LIST: [
    { id: 'first_card', title: 'First Steps', titleAr: 'الخطوة الأولى', desc: 'Review your first card' },
    { id: 'ten_cards', title: 'Getting Started', titleAr: 'البداية', desc: 'Review 10 cards' },
    { id: 'fifty_cards', title: 'Word Collector', titleAr: 'جامع الكلمات', desc: 'Review 50 cards' },
    { id: 'hundred_cards', title: 'Century', titleAr: 'المئوية', desc: 'Review 100 cards' },
    { id: 'five_hundred_cards', title: 'Vocabulary Master', titleAr: 'سيد المفردات', desc: 'Review 500 cards' },
    { id: 'streak_3', title: 'On Fire', titleAr: 'على نار', desc: '3 day streak' },
    { id: 'streak_7', title: 'Week Warrior', titleAr: 'محارب الأسبوع', desc: '7 day streak' },
    { id: 'streak_30', title: 'Monthly Master', titleAr: 'سيد الشهر', desc: '30 day streak' },
    { id: 'perfect_session', title: 'Perfect!', titleAr: 'ممتاز!', desc: '100% accuracy in a session' },
    { id: 'speed_demon', title: 'Speed Demon', titleAr: 'سريع البرق', desc: 'Review 20 cards in under 2 minutes' },
    { id: 'all_categories', title: 'Explorer', titleAr: 'المستكشف', desc: 'Study from all categories' },
    { id: 'grammar_student', title: 'Grammar Student', titleAr: 'طالب القواعد', desc: 'Complete all grammar lessons' }
  ],

  // Storage helper
  _getItem(key, defaultValue) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Error reading ${key} from localStorage`, e);
      return defaultValue;
    }
  },

  _setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key} to localStorage`, e);
    }
  },

  // Card progress
  getCardStates() {
    return this._getItem(this.KEYS.CARD_STATES, {});
  },
  
  saveCardState(cardState) {
    const states = this.getCardStates();
    states[cardState.wordId] = cardState;
    this._setItem(this.KEYS.CARD_STATES, states);
  },

  // Progression Learning / Learned Words
  getLearnedWords() {
    return this._getItem(this.KEYS.LEARNED_WORDS, {});
  },

  getLearnedWordIds() {
    return Object.keys(this.getLearnedWords());
  },

  isWordLearned(wordId) {
    if (!wordId) return false;
    const learned = this.getLearnedWords();
    return Boolean(learned[wordId]);
  },

  addLearnedWord(wordId, notes = '') {
    if (!wordId) return false;
    const learned = this.getLearnedWords();
    const isNew = !learned[wordId];
    learned[wordId] = {
      id: wordId,
      learnedAt: learned[wordId]?.learnedAt || new Date().toISOString(),
      notes: notes || learned[wordId]?.notes || ''
    };
    this._setItem(this.KEYS.LEARNED_WORDS, learned);
    return isNew;
  },

  removeLearnedWord(wordId) {
    if (!wordId) return false;
    const learned = this.getLearnedWords();
    if (learned[wordId]) {
      delete learned[wordId];
      this._setItem(this.KEYS.LEARNED_WORDS, learned);
      return true;
    }
    return false;
  },

  toggleLearnedWord(wordId, notes = '') {
    if (!wordId) return false;
    if (this.isWordLearned(wordId)) {
      this.removeLearnedWord(wordId);
      return false;
    } else {
      this.addLearnedWord(wordId, notes);
      return true;
    }
  },

  addMultipleLearnedWords(wordIds) {
    if (!Array.isArray(wordIds)) return 0;
    const learned = this.getLearnedWords();
    let addedCount = 0;
    const now = new Date().toISOString();
    wordIds.forEach(id => {
      if (id && !learned[id]) {
        learned[id] = { id, learnedAt: now, notes: '' };
        addedCount++;
      }
    });
    if (addedCount > 0) {
      this._setItem(this.KEYS.LEARNED_WORDS, learned);
    }
    return addedCount;
  },

  clearLearnedWords() {
    this._setItem(this.KEYS.LEARNED_WORDS, {});
  },

  // User settings
  getSettings() {
    return { ...this.DEFAULT_SETTINGS, ...this._getItem(this.KEYS.SETTINGS, {}) };
  },
  
  saveSetting(key, value) {
    const settings = this.getSettings();
    settings[key] = value;
    this._setItem(this.KEYS.SETTINGS, settings);
  },

  // Session history
  logSession(sessionData) {
    const history = this.getSessionHistory();
    history.push({
      ...sessionData,
      date: new Date().toISOString()
    });
    this._setItem(this.KEYS.HISTORY, history);
  },
  
  getSessionHistory() {
    return this._getItem(this.KEYS.HISTORY, []);
  },

  // Statistics
  getStats() {
    return { ...this.DEFAULT_STATS, ...this._getItem(this.KEYS.STATS, {}) };
  },
  
  updateStats(updates) {
    const stats = this.getStats();
    this._setItem(this.KEYS.STATS, { ...stats, ...updates });
  },

  // Streak management
  checkAndUpdateStreak() {
    const stats = this.getStats();
    const today = new Date().toISOString().split('T')[0];
    
    if (stats.lastActiveDate === today) {
      return stats.streak; // Already active today
    }
    
    let newStreak = stats.streak;
    if (stats.lastActiveDate) {
      const lastActive = new Date(stats.lastActiveDate);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastActive.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
        newStreak += 1;
      } else {
        newStreak = 1; // Streak broken
      }
    } else {
      newStreak = 1; // First day
    }
    
    this.updateStats({ streak: newStreak, lastActiveDate: today });
    return newStreak;
  },

  // Achievements
  getAchievements() {
    return this._getItem(this.KEYS.ACHIEVEMENTS, []);
  },
  
  unlockAchievement(achievementId) {
    const unlocked = this.getAchievements();
    if (!unlocked.includes(achievementId)) {
      unlocked.push(achievementId);
      this._setItem(this.KEYS.ACHIEVEMENTS, unlocked);
      return true; // Newly unlocked
    }
    return false; // Already unlocked
  },

  // Export/Import
  exportData() {
    const data = {
      cardStates: this.getCardStates(),
      settings: this.getSettings(),
      history: this.getSessionHistory(),
      stats: this.getStats(),
      achievements: this.getAchievements(),
      learnedWords: this.getLearnedWords()
    };
    return JSON.stringify(data);
  },
  
  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.cardStates) this._setItem(this.KEYS.CARD_STATES, data.cardStates);
      if (data.settings) this._setItem(this.KEYS.SETTINGS, data.settings);
      if (data.history) this._setItem(this.KEYS.HISTORY, data.history);
      if (data.stats) this._setItem(this.KEYS.STATS, data.stats);
      if (data.achievements) this._setItem(this.KEYS.ACHIEVEMENTS, data.achievements);
      if (data.learnedWords) this._setItem(this.KEYS.LEARNED_WORDS, data.learnedWords);
      return true;
    } catch (e) {
      console.error("Failed to import data", e);
      return false;
    }
  },

  // Reset
  resetProgress() {
    localStorage.removeItem(this.KEYS.CARD_STATES);
    localStorage.removeItem(this.KEYS.HISTORY);
    localStorage.removeItem(this.KEYS.STATS);
    localStorage.removeItem(this.KEYS.ACHIEVEMENTS);
    localStorage.removeItem(this.KEYS.LEARNED_WORDS);
  },
  
  resetAll() {
    localStorage.clear();
  }
};
