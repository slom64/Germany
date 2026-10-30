window.Progress = {
  // XP System
  calculateXP(rating, isNew) {
    // Again=0, Hard=5, Good=10, Easy=15. New card bonus: +5
    let xp = 0;
    if (rating === 2) xp = 5;
    else if (rating === 3) xp = 10;
    else if (rating === 4) xp = 15;
    
    if (isNew && rating > 1) xp += 5;
    
    return xp;
  },

  // Helper to add XP directly and check achievements
  addXP(amount) {
    if (!window.Storage || !amount) return;
    const stats = window.Storage.getStats();
    const newXP = (stats.xp || 0) + amount;
    window.Storage.updateStats({ xp: newXP });
    
    // Check achievements
    this.checkAchievements(null, { ...stats, xp: newXP });
  },

  // Level System (based on total XP)
  getLevel(xp) {
    let level = 1;
    let requiredXP = 0;
    let nextRequiredXP = 100;
    
    while (xp >= nextRequiredXP) {
      level++;
      requiredXP = nextRequiredXP;
      nextRequiredXP += level * 100;
    }
    
    let title = 'Beginner';
    let titleAr = 'مبتدئ';
    
    if (level >= 31) {
      title = 'Advanced';
      titleAr = 'متقدم';
    } else if (level >= 16) {
      title = 'Intermediate';
      titleAr = 'متوسط';
    } else if (level >= 6) {
      title = 'Elementary';
      titleAr = 'أساسي';
    }
    
    const currentLevelXP = xp - requiredXP;
    const xpForNextLevel = nextRequiredXP - requiredXP;
    const xpProgress = Math.round((currentLevelXP / xpForNextLevel) * 100);

    return {
      level: Math.min(level, 50),
      title,
      titleAr,
      xpForNext: nextRequiredXP,
      xpProgress,
      currentLevelXP,
      xpForNextLevel
    };
  },

  // Check achievements after each session
  checkAchievements(sessionData, currentStats) {
    if (!window.Storage) return [];
    
    const stats = currentStats || window.Storage.getStats();
    const unlockedNow = [];
    const unlock = (id) => {
      if (window.Storage.unlockAchievement(id)) {
        unlockedNow.push(id);
        const ach = (window.Storage.ACHIEVEMENTS_LIST || []).find(a => a.id === id);
        if (ach && window.UI && window.UI.showToast) {
          window.UI.showToast(`🏆 Achievement: ${ach.title} / ${ach.titleAr}!`, 'success', 4000);
        }
      }
    };

    if (stats.totalReviews >= 1) unlock('first_card');
    if (stats.totalReviews >= 10) unlock('ten_cards');
    if (stats.totalReviews >= 50) unlock('fifty_cards');
    if (stats.totalReviews >= 100) unlock('hundred_cards');
    if (stats.totalReviews >= 500) unlock('five_hundred_cards');
    
    if (stats.streak >= 3) unlock('streak_3');
    if (stats.streak >= 7) unlock('streak_7');
    if (stats.streak >= 30) unlock('streak_30');
    
    if (sessionData && sessionData.cardsReviewed > 0) {
      const accuracy = sessionData.correct / sessionData.cardsReviewed;
      if (accuracy === 1 && sessionData.cardsReviewed >= 10) unlock('perfect_session');
      
      if (sessionData.cardsReviewed >= 20 && sessionData.timeSpent <= 120) unlock('speed_demon');
    }
    
    return unlockedNow;
  },

  // Calculate daily stats
  getDailyStats() {
    if (!window.Storage) return {};
    
    const today = new Date().toISOString().split('T')[0];
    const history = window.Storage.getSessionHistory();
    const stats = window.Storage.getStats();
    
    const todaySessions = history.filter(s => s.date && s.date.startsWith(today));
    
    let cardsToday = 0;
    let newToday = 0;
    let correctToday = 0;
    let xpToday = 0;
    
    todaySessions.forEach(s => {
      cardsToday += (s.cardsReviewed || 0);
      newToday += (s.newCards || 0);
      correctToday += (s.correct || 0);
      xpToday += (s.xpEarned || 0);
    });
    
    const accuracyToday = cardsToday > 0 ? Math.round((correctToday / cardsToday) * 100) : 0;
    
    return {
      cardsToday,
      newToday,
      reviewedToday: cardsToday - newToday,
      accuracyToday,
      xpToday,
      streakDays: stats.streak || 0
    };
  },

  // Calculate overall stats for statistics page
  getOverallStats() {
    if (!window.Storage) return {};
    
    const stats = window.Storage.getStats();
    const history = window.Storage.getSessionHistory();
    const cardStates = Object.values(window.Storage.getCardStates() || {});
    const totalVocab = (window.Vocabulary || []).length;
    
    let totalTimeSpent = 0;
    history.forEach(s => {
      totalTimeSpent += (s.timeSpent || 0);
    });
    
    const avgAccuracy = stats.totalReviews > 0 ? Math.round((stats.totalCorrect / stats.totalReviews) * 100) : 0;
    
    let newCards = 0, learningCards = 0, masteredCards = 0;
    cardStates.forEach(c => {
      if (c.state === 'new') newCards++;
      else if (c.state === 'learning') learningCards++;
      else if (c.state === 'review' && c.interval >= 21) masteredCards++;
      else if (c.state === 'review') learningCards++;
    });

    return {
      totalCards: totalVocab,
      masteredCards,
      learningCards,
      newCards: totalVocab - cardStates.length,
      avgAccuracy,
      totalXP: stats.xp || 0,
      totalSessions: history.length,
      totalTimeSpent,
      levelInfo: this.getLevel(stats.xp || 0)
    };
  },

  // Get words learned per category
  getCategoryProgress() {
    const vocab = window.Vocabulary || [];
    const categories = window.Categories || [];
    const cardStates = window.Storage ? window.Storage.getCardStates() : {};
    const result = {};

    categories.forEach(cat => {
      const catWords = vocab.filter(w => w.category === cat.id);
      const total = catWords.length;
      let learned = 0;
      let mastered = 0;

      catWords.forEach(w => {
        const state = cardStates[w.id];
        if (state) {
          if (state.state === 'review') {
            learned++;
            if (state.interval >= 21) mastered++;
          } else if (state.state === 'learning') {
            learned += 0.5; // partial
          }
        }
      });

      result[cat.id] = {
        total,
        learned: Math.floor(learned),
        mastered,
        percentage: total > 0 ? Math.round((Math.floor(learned) / total) * 100) : 0
      };
    });

    return result;
  },

  // Generate chart data (last N days)
  getActivityData(days = 7) {
    if (!window.Storage) return [];
    
    const history = window.Storage.getSessionHistory();
    const result = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const daySessions = history.filter(s => s.date && s.date.startsWith(dateStr));
      let reviews = 0;
      let correct = 0;
      let xp = 0;
      
      daySessions.forEach(s => {
        reviews += (s.cardsReviewed || 0);
        correct += (s.correct || 0);
        xp += (s.xpEarned || 0);
      });
      
      const accuracy = reviews > 0 ? Math.round((correct / reviews) * 100) : 0;
      
      result.push({
        date: dateStr,
        displayDate: d.toLocaleDateString(undefined, { weekday: 'short' }),
        reviews,
        accuracy,
        xp
      });
    }
    
    return result;
  },

  // Render simple bar chart to canvas
  renderChart(canvasElement, data, options = {}) {
    if (!canvasElement) return;
    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;
    
    const width = canvasElement.width;
    const height = canvasElement.height;
    const padding = 25;
    const availableWidth = width - (padding * 2);
    const availableHeight = height - (padding * 2);
    
    const maxVal = Math.max(...data.map(d => d.reviews), 10);
    const barWidth = availableWidth / data.length;
    
    ctx.clearRect(0, 0, width, height);
    
    data.forEach((item, index) => {
      const barHeight = Math.max(4, (item.reviews / maxVal) * availableHeight);
      const x = padding + (index * barWidth) + (barWidth * 0.15);
      const y = height - padding - barHeight;
      const w = barWidth * 0.7;
      
      // Draw bar with gradient
      const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
      gradient.addColorStop(0, '#F59E0B'); // Gold
      gradient.addColorStop(1, '#3B82F6'); // Blue
      ctx.fillStyle = gradient;
      
      // Rounded bar
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(x, y, w, barHeight, [4, 4, 0, 0]) : ctx.fillRect(x, y, w, barHeight);
      ctx.fill();
      
      // Draw label
      ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'dark' ? '#9CA3AF' : '#6B7280';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.displayDate, x + (w / 2), height - 8);
      
      // Draw value
      if (item.reviews > 0) {
        ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'dark' ? '#F3F4F6' : '#111827';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(item.reviews.toString(), x + (w / 2), y - 6);
      }
    });
  }
};
