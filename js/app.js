/**
 * DeutschLernen - Main Application Controller
 * Initializes all modules, manages routing, and renders main screens
 */
window.App = {
  currentScreen: 'dashboard',
  
  // Initialize the app
  init() {
    // Initialize pronunciation engine
    if (window.Pronunciation) {
      window.Pronunciation.init();
    }
    
    // Apply saved settings
    this.applySettings();
    
    // Check and update streak
    if (window.Storage) {
      window.Storage.checkAndUpdateStreak();
    }
    
    // Set up navigation
    this.setupNavigation();
    
    // Set up keyboard shortcuts
    if (window.UI) {
      window.UI.initKeyboardShortcuts();
    }
    
    // Handle initial route
    this.handleRoute();
    
    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // Render dashboard by default
    if (!window.location.hash || window.location.hash === '#') {
      this.renderDashboard();
    }
    
    console.log('🇩🇪 DeutschLernen initialized!');
    console.log(`📚 ${(window.Vocabulary || []).length} words loaded`);
    console.log(`📝 ${(window.Sentences || []).length} sentences loaded`);
    console.log(`📖 ${(window.Grammar || []).length} grammar lessons loaded`);
  },

  // Apply user settings
  applySettings() {
    const settings = window.Storage ? window.Storage.getSettings() : { theme: 'light', interfaceLanguage: 'ar', speechRate: 0.85 };
    
    // Apply theme
    document.documentElement.setAttribute('data-theme', settings.theme);
    
    // Apply speech rate
    if (window.Pronunciation && settings.speechRate) {
      window.Pronunciation.setRate(settings.speechRate);
    }
    
    // Apply animations preference
    if (!settings.enableAnimations) {
      document.body.classList.add('reduce-motion');
    }
  },

  // Set up navigation click handlers
  setupNavigation() {
    document.querySelectorAll('[data-target]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.dataset.target;
        if (window.location.hash === '#' + target) {
          this.handleRoute();
        } else {
          window.location.hash = target;
        }
      });
    });
  },

  // Handle URL hash routing
  handleRoute() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    
    switch (hash) {
      case 'dashboard':
        this.renderDashboard();
        break;
      case 'learn':
        this.renderLearnScreen();
        break;
      case 'review':
        this.startReview();
        break;
      case 'practice':
        if (window.Exercises) window.Exercises.showExerciseMenu();
        break;
      case 'statistics':
        this.renderStatistics();
        break;
      case 'grammar':
        this.renderGrammarList();
        break;
      case 'random':
        if (window.RandomPicker) window.RandomPicker.initScreen();
        break;
      case 'settings':
        this.renderSettings();
        break;
      default:
        // Check for sub-routes
        if (hash.startsWith('category-')) {
          const catId = hash.replace('category-', '');
          this.renderCategoryWords(catId);
        } else if (hash.startsWith('grammar-')) {
          const gramId = hash.replace('grammar-', '');
          this.renderGrammarLesson(gramId);
        } else {
          this.renderDashboard();
        }
    }
  },

  // ===================== DASHBOARD =====================
  renderDashboard() {
    window.UI.navigateTo('dashboard');
    window.UI.setHeaderTitle('DeutschLernen', 'تعلم الألمانية');
    
    const container = document.getElementById('dashboard-content');
    if (!container) return;
    
    const stats = window.Storage ? window.Storage.getStats() : { streak: 0, xp: 0, totalReviews: 0, totalCorrect: 0 };
    const settings = window.Storage ? window.Storage.getSettings() : { dailyNewCards: 20, dailyReviewCards: 50 };
    const allCardStates = window.Storage ? window.Storage.getCardStates() : {};
    const vocab = window.Vocabulary || [];
    
    // Count cards by state
    const stateValues = Object.values(allCardStates);
    const today = new Date().toISOString().split('T')[0];
    const dueForReview = stateValues.filter(c => c.state === 'review' && c.dueDate <= today).length;
    const learningCount = stateValues.filter(c => c.state === 'learning').length;
    const learnedCount = stateValues.filter(c => c.state === 'review').length;
    const newCount = vocab.length - stateValues.length;
    
    // Level info
    const levelInfo = window.Progress ? window.Progress.getLevel(stats.xp) : { level: 1, title: 'Beginner', titleAr: 'مبتدئ', xpForNext: 100, xpProgress: 0 };
    const levelPercent = levelInfo.xpForNext > 0 ? Math.min(100, Math.round((levelInfo.xpProgress / levelInfo.xpForNext) * 100)) : 0;
    
    // Streak emoji
    const streakEmoji = stats.streak >= 7 ? '🔥' : stats.streak >= 3 ? '⚡' : '📅';
    
    container.innerHTML = `
      <!-- Welcome Section -->
      <div class="welcome-section">
        <h2>مرحباً! Willkommen! 👋</h2>
        <p class="welcome-subtitle">Ready to learn German today? / هل أنت مستعد لتعلم الألمانية اليوم؟</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card stat-streak">
          <div class="stat-icon">${streakEmoji}</div>
          <div class="stat-value">${stats.streak}</div>
          <div class="stat-label">Day Streak / أيام متتالية</div>
        </div>
        <div class="stat-card stat-xp">
          <div class="stat-icon">⭐</div>
          <div class="stat-value">${stats.xp}</div>
          <div class="stat-label">XP / نقاط الخبرة</div>
        </div>
        <div class="stat-card stat-words">
          <div class="stat-icon">📚</div>
          <div class="stat-value">${learnedCount}</div>
          <div class="stat-label">Words Learned / كلمات تعلمتها</div>
        </div>
        <div class="stat-card stat-accuracy">
          <div class="stat-icon">🎯</div>
          <div class="stat-value">${stats.totalReviews > 0 ? Math.round((stats.totalCorrect / stats.totalReviews) * 100) : 0}%</div>
          <div class="stat-label">Accuracy / الدقة</div>
        </div>
      </div>

      <!-- Level Progress -->
      <div class="level-section">
        <div class="level-info">
          <span class="level-badge">Lvl ${levelInfo.level}</span>
          <span class="level-title">${levelInfo.title} / ${levelInfo.titleAr}</span>
          <span class="level-xp">${levelInfo.xpProgress} / ${levelInfo.xpForNext} XP</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${levelPercent}%"></div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h3>🚀 Quick Start / ابدأ سريعاً</h3>
        <div class="action-grid">
          <button class="action-btn action-review" onclick="App.startReview()">
            <span class="action-icon">🔄</span>
            <span class="action-title">Review</span>
            <span class="action-title-ar">مراجعة</span>
            ${dueForReview > 0 ? `<span class="action-badge">${dueForReview}</span>` : ''}
          </button>
          <button class="action-btn action-learn" onclick="App.startLearnNew()">
            <span class="action-icon">📖</span>
            <span class="action-title">Learn New</span>
            <span class="action-title-ar">تعلم كلمات جديدة</span>
            <span class="action-badge">${newCount > 0 ? Math.min(newCount, settings.dailyNewCards) : '✓'}</span>
          </button>
          <button class="action-btn action-practice" onclick="window.location.hash='practice'">
            <span class="action-icon">💪</span>
            <span class="action-title">Practice</span>
            <span class="action-title-ar">تدريب</span>
          </button>
          <button class="action-btn action-random" onclick="window.location.hash='random'">
            <span class="action-icon">🎲</span>
            <span class="action-title">Random</span>
            <span class="action-title-ar">منتقي الكلمات</span>
          </button>
          <button class="action-btn action-grammar" onclick="window.location.hash='grammar'">
            <span class="action-icon">📖</span>
            <span class="action-title">Grammar</span>
            <span class="action-title-ar">القواعد</span>
          </button>
        </div>
      </div>

      <!-- Due Cards Summary -->
      ${dueForReview > 0 || learningCount > 0 ? `
      <div class="due-summary">
        <h3>📋 Today's Tasks / مهام اليوم</h3>
        <div class="due-cards-info">
          ${dueForReview > 0 ? `<div class="due-item"><span class="due-count">${dueForReview}</span> cards due for review / بطاقات للمراجعة</div>` : ''}
          ${learningCount > 0 ? `<div class="due-item"><span class="due-count">${learningCount}</span> cards still learning / بطاقات قيد التعلم</div>` : ''}
          ${newCount > 0 ? `<div class="due-item"><span class="due-count">${newCount}</span> new cards available / بطاقات جديدة متاحة</div>` : ''}
        </div>
      </div>
      ` : `
      <div class="due-summary all-done">
        <h3>🎉 All done for today! / انتهيت لليوم!</h3>
        <p>Great job! Come back tomorrow for more. / عمل رائع! عد غداً للمزيد.</p>
      </div>
      `}
    `;
  },

  // ===================== LEARN (Categories) =====================
  renderLearnScreen() {
    window.UI.navigateTo('learn');
    window.UI.setHeaderTitle('Learn / تعلم', 'Choose a category / اختر فئة');
    
    const container = document.getElementById('learn-content');
    if (!container) return;
    
    const categories = window.Categories || [];
    const vocab = window.Vocabulary || [];
    const cardStates = window.Storage ? window.Storage.getCardStates() : {};
    
    container.innerHTML = `
      <div class="category-grid">
        ${categories.map(cat => {
          const catWords = vocab.filter(w => w.category === cat.id);
          const learned = catWords.filter(w => cardStates[w.id] && cardStates[w.id].state === 'review').length;
          const total = catWords.length;
          const pct = total > 0 ? Math.round((learned / total) * 100) : 0;
          
          return `
            <div class="category-card" onclick="window.location.hash='category-${cat.id}'">
              <div class="category-icon">${cat.icon}</div>
              <div class="category-info">
                <h3 class="category-name">${cat.name}</h3>
                <h4 class="category-name-ar arabic-text" dir="rtl">${cat.nameAr}</h4>
                <p class="category-desc">${cat.description}</p>
                <div class="category-progress">
                  <div class="progress-bar progress-bar-sm">
                    <div class="progress-fill" style="width: ${pct}%"></div>
                  </div>
                  <span class="category-count">${learned}/${total}</span>
                </div>
              </div>
              <div class="category-difficulty">
                ${'⭐'.repeat(cat.difficulty)}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  // Render words in a specific category
  renderCategoryWords(categoryId) {
    const category = (window.Categories || []).find(c => c.id === categoryId);
    if (!category) {
      this.renderLearnScreen();
      return;
    }
    
    window.UI.navigateTo('category-detail');
    window.UI.setHeaderTitle(`${category.icon} ${category.name}`, category.nameAr);
    
    const container = document.getElementById('category-detail-content');
    if (!container) return;
    
    const words = (window.Vocabulary || []).filter(w => w.category === categoryId);
    const cardStates = window.Storage ? window.Storage.getCardStates() : {};
    
    container.innerHTML = `
      <div class="category-header">
        <button class="back-btn" onclick="window.location.hash='learn'">← Back / رجوع</button>
        <div class="category-actions">
          <button class="btn btn-primary" onclick="App.startCategoryLearn('${categoryId}')">
            📖 Learn All / تعلم الكل
          </button>
          <button class="btn btn-secondary" onclick="App.startCategoryPractice('${categoryId}')">
            💪 Practice / تدريب
          </button>
        </div>
      </div>
      <div class="word-list">
        ${words.map(word => {
          const state = cardStates[word.id];
          const stateLabel = state ? (state.state === 'review' ? '✅' : '🔄') : '🆕';
          const genderClass = word.gender ? `gender-${word.gender.substring(0, 4)}` : '';
          
          return `
            <div class="word-item ${genderClass}" onclick="App.showWordDetail('${word.id}')">
              <div class="word-status">${stateLabel}</div>
              <div class="word-content">
                <div class="word-german german-text" dir="ltr">
                  ${word.article ? `<span class="article ${genderClass}">${word.article}</span> ` : ''}${word.german}
                </div>
                <div class="word-arabic arabic-text" dir="rtl">${word.arabic}</div>
              </div>
              <div class="word-actions">
                <button class="speak-btn-sm" onclick="event.stopPropagation(); Pronunciation.speak('${word.article ? word.article + ' ' : ''}${word.german.replace(/'/g, "\\'")}')" title="Listen">
                  🔊
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  // Show word detail modal
  showWordDetail(wordId) {
    const word = (window.Vocabulary || []).find(w => w.id === wordId);
    if (!word) return;
    
    const sentences = (window.Sentences || []).filter(s => s.wordIds && s.wordIds.includes(wordId));
    const genderClass = word.gender ? `gender-${word.gender.substring(0, 4)}` : '';
    
    const typeLabels = {
      noun: 'Noun / اسم',
      verb: 'Verb / فعل',
      adjective: 'Adjective / صفة',
      phrase: 'Phrase / عبارة',
      number: 'Number / رقم',
      adverb: 'Adverb / ظرف'
    };
    
    let conjugationHtml = '';
    if (word.conjugation) {
      conjugationHtml = `
        <div class="conjugation-table">
          <h4>Present Tense / المضارع</h4>
          <table>
            <tr><td>ich</td><td>${word.conjugation.ich}</td></tr>
            <tr><td>du</td><td>${word.conjugation.du}</td></tr>
            <tr><td>er/sie/es</td><td>${word.conjugation.er}</td></tr>
            <tr><td>wir</td><td>${word.conjugation.wir}</td></tr>
            <tr><td>ihr</td><td>${word.conjugation.ihr}</td></tr>
            <tr><td>sie/Sie</td><td>${word.conjugation.sie}</td></tr>
          </table>
        </div>
      `;
    }
    
    const content = `
      <div class="word-detail">
        <div class="word-detail-header ${genderClass}">
          <span class="word-type-badge">${typeLabels[word.type] || word.type}</span>
          <div class="word-detail-german german-text" dir="ltr">
            ${word.article ? `<span class="article ${genderClass}">${word.article}</span> ` : ''}
            <span class="word-main">${word.german}</span>
          </div>
          ${word.plural ? `<div class="word-detail-plural german-text" dir="ltr">Plural: die ${word.plural}</div>` : ''}
          <div class="word-detail-arabic arabic-text" dir="rtl">${word.arabic}</div>
          <button class="speak-btn" onclick="Pronunciation.speak('${(word.article ? word.article + ' ' : '') + word.german.replace(/'/g, "\\'")}')">
            🔊 Listen / استمع
          </button>
          <button class="speak-btn" onclick="Pronunciation.speakSlow('${(word.article ? word.article + ' ' : '') + word.german.replace(/'/g, "\\'")}')">
            🐢 Slow / ببطء
          </button>
        </div>
        
        ${conjugationHtml}
        
        ${sentences.length > 0 ? `
          <div class="word-examples">
            <h4>Examples / أمثلة</h4>
            ${sentences.map(s => `
              <div class="example-block">
                <p class="german-text" dir="ltr">${s.german}</p>
                <p class="arabic-text" dir="rtl">${s.arabic}</p>
                <button class="speak-btn-sm" onclick="Pronunciation.speak('${s.german.replace(/'/g, "\\'")}')">🔊</button>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        <div class="word-meta">
          <span class="level-tag">${word.level}</span>
          <span class="category-tag">${word.category}</span>
        </div>
      </div>
    `;
    
    window.UI.showModal(content, { title: word.german });
  },

  // ===================== REVIEW =====================
  startReview() {
    if (window.Flashcards) {
      window.Flashcards.startSession({ mode: 'review' });
    }
  },

  startLearnNew() {
    if (window.Flashcards) {
      window.Flashcards.startSession({ mode: 'learn', maxCards: 20 });
    }
  },

  startCategoryLearn(categoryId) {
    if (window.Flashcards) {
      window.Flashcards.startSession({ mode: 'category', category: categoryId, maxCards: 20 });
    }
  },

  startCategoryPractice(categoryId) {
    if (window.Exercises) {
      window.Exercises.startSession('multiple-choice', { category: categoryId, count: 10 });
    }
  },

  // ===================== GRAMMAR =====================
  renderGrammarList() {
    window.UI.navigateTo('grammar');
    window.UI.setHeaderTitle('Grammar / القواعد', 'German grammar lessons');
    
    const container = document.getElementById('grammar-content');
    if (!container) return;
    
    const lessons = window.Grammar || [];
    
    container.innerHTML = `
      <div class="grammar-list">
        ${lessons.map((lesson, i) => `
          <div class="grammar-card" onclick="window.location.hash='grammar-${lesson.id}'">
            <div class="grammar-number">${i + 1}</div>
            <div class="grammar-info">
              <h3>${lesson.title}</h3>
              <h4 class="arabic-text" dir="rtl">${lesson.titleAr}</h4>
              <span class="level-tag">${lesson.level}</span>
            </div>
            <div class="grammar-arrow">→</div>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderGrammarLesson(lessonId) {
    const lesson = (window.Grammar || []).find(g => g.id === lessonId);
    if (!lesson) {
      this.renderGrammarList();
      return;
    }
    
    window.UI.navigateTo('grammar-detail');
    window.UI.setHeaderTitle(lesson.title, lesson.titleAr);
    
    const container = document.getElementById('grammar-detail-content');
    if (!container) return;
    
    container.innerHTML = `
      <div class="grammar-lesson">
        <button class="back-btn" onclick="window.location.hash='grammar'">← Back / رجوع</button>
        
        <div class="lesson-header">
          <h2>${lesson.title}</h2>
          <h3 class="arabic-text" dir="rtl">${lesson.titleAr}</h3>
          <span class="level-tag">${lesson.level}</span>
        </div>
        
        ${lesson.sections.map(section => `
          <div class="grammar-section">
            <h3>${section.heading}</h3>
            <h4 class="arabic-text" dir="rtl">${section.headingAr}</h4>
            
            <div class="grammar-content">
              <p>${section.content}</p>
              <p class="arabic-text" dir="rtl">${section.contentAr}</p>
            </div>
            
            ${section.table ? `
              <div class="grammar-table-wrapper">
                <table class="grammar-table">
                  <thead>
                    <tr>${section.table.headers.map(h => `<th>${h}</th>`).join('')}</tr>
                  </thead>
                  <tbody>
                    ${section.table.rows.map(row => `
                      <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : ''}
            
            ${section.examples && section.examples.length > 0 ? `
              <div class="grammar-examples">
                <h4>Examples / أمثلة:</h4>
                ${section.examples.map(ex => `
                  <div class="example-block">
                    <span class="german-text" dir="ltr">${ex.german}</span>
                    <span class="arabic-text" dir="rtl">${ex.arabic}</span>
                    ${ex.note ? `<span class="example-note">(${ex.note})</span>` : ''}
                    <button class="speak-btn-sm" onclick="Pronunciation.speak('${ex.german.replace(/'/g, "\\'")}')">🔊</button>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  },

  // ===================== STATISTICS =====================
  renderStatistics() {
    window.UI.navigateTo('statistics');
    window.UI.setHeaderTitle('Statistics / الإحصائيات', 'Your learning progress');
    
    const container = document.getElementById('statistics-content');
    if (!container) return;
    
    const stats = window.Storage ? window.Storage.getStats() : {};
    const levelInfo = window.Progress ? window.Progress.getLevel(stats.xp || 0) : { level: 1, title: 'Beginner', titleAr: 'مبتدئ' };
    const achievements = window.Storage ? window.Storage.getAchievements() : [];
    const allAchievements = window.Storage ? window.Storage.ACHIEVEMENTS_LIST : [];
    const overallStats = window.Progress ? window.Progress.getOverallStats() : {};
    const catProgress = window.Progress ? window.Progress.getCategoryProgress() : {};
    const categories = window.Categories || [];
    
    container.innerHTML = `
      <div class="stats-page">
        <!-- Overview Cards -->
        <div class="stats-overview">
          <h3>📊 Overview / نظرة عامة</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">📚</div>
              <div class="stat-value">${overallStats.totalCards || 0}</div>
              <div class="stat-label">Total Words / إجمالي الكلمات</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-value">${overallStats.masteredCards || 0}</div>
              <div class="stat-label">Mastered / أتقنتها</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🔄</div>
              <div class="stat-value">${overallStats.learningCards || 0}</div>
              <div class="stat-label">Learning / قيد التعلم</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⭐</div>
              <div class="stat-value">${stats.xp || 0}</div>
              <div class="stat-label">Total XP / نقاط الخبرة</div>
            </div>
          </div>
        </div>
        
        <!-- Activity Chart -->
        <div class="stats-chart-section">
          <h3>📈 Activity (Last 7 Days) / النشاط (آخر 7 أيام)</h3>
          <canvas id="activity-chart" width="600" height="200"></canvas>
        </div>
        
        <!-- Category Progress -->
        <div class="stats-categories">
          <h3>📂 Category Progress / تقدم الفئات</h3>
          <div class="category-progress-list">
            ${categories.map(cat => {
              const prog = catProgress[cat.id] || { total: 0, learned: 0, percentage: 0 };
              return `
                <div class="category-progress-item">
                  <div class="cat-prog-header">
                    <span>${cat.icon} ${cat.name} / ${cat.nameAr}</span>
                    <span>${prog.learned}/${prog.total} (${prog.percentage}%)</span>
                  </div>
                  <div class="progress-bar progress-bar-sm">
                    <div class="progress-fill" style="width: ${prog.percentage}%"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <!-- Achievements -->
        <div class="stats-achievements">
          <h3>🏆 Achievements / الإنجازات</h3>
          <div class="achievements-grid">
            ${allAchievements.map(ach => {
              const unlocked = achievements.includes(ach.id);
              return `
                <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
                  <div class="achievement-icon">${unlocked ? '🏆' : '🔒'}</div>
                  <div class="achievement-info">
                    <h4>${ach.title}</h4>
                    <h5 class="arabic-text" dir="rtl">${ach.titleAr}</h5>
                    <p>${ach.desc}</p>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
    
    // Render activity chart
    setTimeout(() => {
      const canvas = document.getElementById('activity-chart');
      if (canvas && window.Progress) {
        const activityData = window.Progress.getActivityData(7);
        window.Progress.renderChart(canvas, activityData, { type: 'bar', label: 'Reviews' });
      }
    }, 100);
  },

  // ===================== SETTINGS =====================
  renderSettings() {
    window.UI.navigateTo('settings');
    window.UI.setHeaderTitle('Settings / الإعدادات', '');
    
    const container = document.getElementById('settings-content');
    if (!container) return;
    
    const settings = window.Storage ? window.Storage.getSettings() : window.Storage.DEFAULT_SETTINGS;
    
    container.innerHTML = `
      <div class="settings-page">
        <!-- Appearance -->
        <div class="settings-group">
          <h3>🎨 Appearance / المظهر</h3>
          <div class="setting-item">
            <label>Theme / السمة</label>
            <div class="toggle-switch-container">
              <span>☀️ Light</span>
              <label class="toggle-switch">
                <input type="checkbox" id="setting-theme" ${settings.theme === 'dark' ? 'checked' : ''} 
                  onchange="App.updateSetting('theme', this.checked ? 'dark' : 'light')">
                <span class="toggle-slider"></span>
              </label>
              <span>🌙 Dark</span>
            </div>
          </div>
          <div class="setting-item">
            <label>Animations / الحركات</label>
            <label class="toggle-switch">
              <input type="checkbox" id="setting-animations" ${settings.enableAnimations ? 'checked' : ''} 
                onchange="App.updateSetting('enableAnimations', this.checked)">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
        
        <!-- Learning -->
        <div class="settings-group">
          <h3>📚 Learning / التعلم</h3>
          <div class="setting-item">
            <label>New Cards per Day / بطاقات جديدة يومياً</label>
            <select id="setting-newcards" onchange="App.updateSetting('dailyNewCards', parseInt(this.value))">
              ${[5, 10, 15, 20, 30, 50].map(n => `<option value="${n}" ${settings.dailyNewCards === n ? 'selected' : ''}>${n}</option>`).join('')}
            </select>
          </div>
          <div class="setting-item">
            <label>Review Cards per Day / بطاقات المراجعة يومياً</label>
            <select id="setting-reviewcards" onchange="App.updateSetting('dailyReviewCards', parseInt(this.value))">
              ${[20, 30, 50, 100, 200].map(n => `<option value="${n}" ${settings.dailyReviewCards === n ? 'selected' : ''}>${n}</option>`).join('')}
            </select>
          </div>
        </div>
        
        <!-- Audio -->
        <div class="settings-group">
          <h3>🔊 Audio / الصوت</h3>
          <div class="setting-item">
            <label>Auto-play Pronunciation / تشغيل النطق تلقائياً</label>
            <label class="toggle-switch">
              <input type="checkbox" id="setting-autoplay" ${settings.autoPlayAudio ? 'checked' : ''} 
                onchange="App.updateSetting('autoPlayAudio', this.checked)">
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <label>Speech Speed / سرعة النطق: <span id="speed-value">${settings.speechRate}</span></label>
            <input type="range" min="0.5" max="1.5" step="0.05" value="${settings.speechRate}" 
              oninput="document.getElementById('speed-value').textContent = this.value"
              onchange="App.updateSetting('speechRate', parseFloat(this.value))">
          </div>
          <div class="setting-item">
            <button class="btn btn-secondary" onclick="Pronunciation.speak('Hallo, ich bin DeutschLernen!')">
              🔊 Test Pronunciation / اختبر النطق
            </button>
          </div>
        </div>
        
        <!-- Data -->
        <div class="settings-group">
          <h3>💾 Data / البيانات</h3>
          <div class="setting-item">
            <button class="btn btn-secondary" onclick="App.exportData()">
              📤 Export Progress / تصدير التقدم
            </button>
          </div>
          <div class="setting-item">
            <button class="btn btn-secondary" onclick="document.getElementById('import-file').click()">
              📥 Import Progress / استيراد التقدم
            </button>
            <input type="file" id="import-file" accept=".json" style="display:none" onchange="App.importData(this)">
          </div>
          <div class="setting-item">
            <button class="btn btn-danger" onclick="App.resetProgress()">
              🗑️ Reset Progress / إعادة تعيين التقدم
            </button>
          </div>
          <div class="setting-item">
            <button class="btn btn-danger" onclick="App.resetAll()">
              ⚠️ Reset Everything / إعادة تعيين كل شيء
            </button>
          </div>
        </div>
        
        <!-- About -->
        <div class="settings-group">
          <h3>ℹ️ About / حول</h3>
          <div class="about-info">
            <p><strong>DeutschLernen</strong> v1.0</p>
            <p>A German language learning app for Arabic speakers</p>
            <p class="arabic-text" dir="rtl">تطبيق لتعلم اللغة الألمانية للناطقين بالعربية</p>
            <p>📚 ${(window.Vocabulary || []).length} words | 📝 ${(window.Sentences || []).length} sentences | 📖 ${(window.Grammar || []).length} grammar lessons</p>
          </div>
        </div>
      </div>
    `;
  },

  // Update a setting
  updateSetting(key, value) {
    if (window.Storage) {
      window.Storage.saveSetting(key, value);
    }
    
    // Apply immediately
    if (key === 'theme') {
      document.documentElement.setAttribute('data-theme', value);
    } else if (key === 'speechRate') {
      if (window.Pronunciation) window.Pronunciation.setRate(value);
    } else if (key === 'enableAnimations') {
      if (value) {
        document.body.classList.remove('reduce-motion');
      } else {
        document.body.classList.add('reduce-motion');
      }
    }
    
    window.UI.showToast('Setting saved! / تم الحفظ!', 'success');
  },

  // Export data
  exportData() {
    if (!window.Storage) return;
    const data = window.Storage.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deutschlernen_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    window.UI.showToast('Progress exported! / تم تصدير التقدم!', 'success');
  },

  // Import data
  importData(input) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (window.Storage) {
          window.Storage.importData(e.target.result);
          window.UI.showToast('Progress imported! / تم استيراد التقدم!', 'success');
          this.renderDashboard();
        }
      } catch (err) {
        window.UI.showToast('Invalid file! / ملف غير صالح!', 'error');
      }
    };
    reader.readAsText(file);
  },

  // Reset progress
  resetProgress() {
    window.UI.confirm('Are you sure? This will reset all learning progress.\nهل أنت متأكد؟ سيؤدي هذا إلى إعادة تعيين كل تقدمك.', () => {
      if (window.Storage) {
        window.Storage.resetProgress();
        window.UI.showToast('Progress reset! / تم إعادة التعيين!', 'info');
        this.renderDashboard();
      }
    });
  },

  // Reset all
  resetAll() {
    window.UI.confirm('⚠️ This will delete ALL data including settings!\n⚠️ سيحذف هذا جميع البيانات بما في ذلك الإعدادات!', () => {
      if (window.Storage) {
        window.Storage.resetAll();
        window.UI.showToast('Everything reset! / تم إعادة تعيين كل شيء!', 'info');
        this.applySettings();
        this.renderDashboard();
      }
    });
  }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});
