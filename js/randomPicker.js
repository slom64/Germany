/**
 * Random Word Picker - Quick Drill & Spontaneous Testing
 * Allows practicing German <-> Arabic in MCQ or Typing mode
 */
window.RandomPicker = {
  currentWord: null,
  activeDirection: 'de-to-ar', // 'de-to-ar', 'ar-to-de', 'mixed'
  activeMode: 'mcq',          // 'mcq', 'text'
  selectedCategory: 'all',    // 'all' or category ID
  selectedLevel: 'all',       // 'all', 'A1', 'A2'
  
  sessionStats: {
    correct: 0,
    wrong: 0,
    streak: 0,
    bestStreak: 0,
    total: 0
  },
  
  isAnswered: false,
  currentPromptDirection: 'de-to-ar', // actual direction for current card
  currentOptions: [],                 // MCQ options
  correctAnswerText: '',

  // Initialize and render screen
  initScreen() {
    window.UI.navigateTo('random');
    window.UI.setHeaderTitle('Random Word Picker / منتقي الكلمات', 'Speed Drill & Vocabulary Quiz');
    
    const container = document.getElementById('random-content');
    if (!container) return;
    
    // Setup keyboard listener for random picker
    this.setupKeyboard();
    
    // Pick first word and render
    this.pickNextWord();
  },

  // Pick next random word according to filters
  pickNextWord() {
    this.isAnswered = false;
    let pool = window.Vocabulary || [];
    
    // Apply category filter
    if (this.selectedCategory !== 'all') {
      pool = pool.filter(w => w.category === this.selectedCategory);
    }
    
    // Apply level filter
    if (this.selectedLevel !== 'all') {
      if (this.selectedLevel === 'A1') {
        pool = pool.filter(w => w.level === 'A1' || w.level === 'A2');
      } else {
        pool = pool.filter(w => w.level === this.selectedLevel);
      }
    }
    
    if (pool.length === 0) {
      if (window.UI) {
        window.UI.showToast('No words found matching filters. / لا توجد كلمات مطابقة للفلاتر.', 'error');
      }
      pool = window.Vocabulary || [];
    }
    
    // Pick random word (different from current if pool > 1)
    let nextWord;
    do {
      nextWord = pool[Math.floor(Math.random() * pool.length)];
    } while (pool.length > 1 && this.currentWord && nextWord.id === this.currentWord.id);
    
    this.currentWord = nextWord;
    
    // Determine direction for this card
    if (this.activeDirection === 'mixed') {
      this.currentPromptDirection = Math.random() > 0.5 ? 'de-to-ar' : 'ar-to-de';
    } else {
      this.currentPromptDirection = this.activeDirection;
    }
    
    // Prepare correct answer string
    if (this.currentPromptDirection === 'de-to-ar') {
      this.correctAnswerText = this.currentWord.arabic;
    } else {
      this.correctAnswerText = this.currentWord.german;
    }
    
    // Prepare MCQ options if in MCQ mode
    if (this.activeMode === 'mcq') {
      this.prepareMCQOptions();
    }
    
    this.render();
  },

  // Prepare 4 smart options for MCQ
  prepareMCQOptions() {
    const vocab = window.Vocabulary || [];
    const correct = this.currentWord;
    let pool = vocab.filter(w => w.id !== correct.id);
    
    // Prefer words in the same category
    const sameCategory = pool.filter(w => w.category === correct.category);
    const candidatePool = sameCategory.length >= 3 ? sameCategory : pool;
    
    const shuffled = [...candidatePool].sort(() => 0.5 - Math.random());
    const distractors = shuffled.slice(0, 3);
    
    this.currentOptions = [correct, ...distractors].sort(() => 0.5 - Math.random());
  },

  // Render main UI
  render() {
    const container = document.getElementById('random-content');
    if (!container || !this.currentWord) return;
    
    const word = this.currentWord;
    const isGermanPrompt = this.currentPromptDirection === 'de-to-ar';
    const categories = window.Categories || [];
    
    // Gender class
    let genderClass = '';
    if (word.gender === 'masculine' || word.article === 'der') genderClass = 'gender-masc';
    else if (word.gender === 'feminine' || word.article === 'die') genderClass = 'gender-fem';
    else if (word.gender === 'neuter' || word.article === 'das') genderClass = 'gender-neut';
    
    const accuracy = this.sessionStats.total > 0 
      ? Math.round((this.sessionStats.correct / this.sessionStats.total) * 100) 
      : 100;
      
    const wordToSpeak = (word.article ? `${word.article} ` : '') + word.german;
    
    // Build screen HTML
    container.innerHTML = `
      <div class="random-picker-wrapper animate-fade-in">
        
        <!-- Controls & Filter Toolbar -->
        <div class="picker-toolbar">
          
          <!-- Direction Selector -->
          <div class="picker-control-group">
            <span class="control-label">Direction / الاتجاه:</span>
            <div class="pill-group">
              <button class="pill-btn ${this.activeDirection === 'de-to-ar' ? 'active' : ''}" onclick="RandomPicker.setDirection('de-to-ar')">
                🇩🇪 ➔ 🇸🇦
              </button>
              <button class="pill-btn ${this.activeDirection === 'ar-to-de' ? 'active' : ''}" onclick="RandomPicker.setDirection('ar-to-de')">
                🇸🇦 ➔ 🇩🇪
              </button>
              <button class="pill-btn ${this.activeDirection === 'mixed' ? 'active' : ''}" onclick="RandomPicker.setDirection('mixed')">
                🔀 Mixed
              </button>
            </div>
          </div>

          <!-- Answer Mode Selector -->
          <div class="picker-control-group">
            <span class="control-label">Mode / النوع:</span>
            <div class="pill-group">
              <button class="pill-btn ${this.activeMode === 'mcq' ? 'active' : ''}" onclick="RandomPicker.setMode('mcq')">
                🔘 MCQ / خيارات
              </button>
              <button class="pill-btn ${this.activeMode === 'text' ? 'active' : ''}" onclick="RandomPicker.setMode('text')">
                ✍️ Type / كتابة
              </button>
            </div>
          </div>

          <!-- Category Filter -->
          <div class="picker-control-group">
            <span class="control-label">Category / الفئة:</span>
            <select class="picker-select" onchange="RandomPicker.setCategory(this.value)">
              <option value="all" ${this.selectedCategory === 'all' ? 'selected' : ''}>All Categories (${(window.Vocabulary || []).length} words)</option>
              ${categories.map(c => `
                <option value="${c.id}" ${this.selectedCategory === c.id ? 'selected' : ''}>
                  ${c.icon} ${c.name} (${c.nameAr})
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Level Filter -->
          <div class="picker-control-group">
            <span class="control-label">Level / المستوى:</span>
            <select class="picker-select" onchange="RandomPicker.setLevel(this.value)">
              <option value="all" ${this.selectedLevel === 'all' ? 'selected' : ''}>All Levels (${(window.Vocabulary || []).length} words)</option>
              <option value="B2" ${this.selectedLevel === 'B2' ? 'selected' : ''}>⭐ B2 Advanced (${(window.Vocabulary || []).filter(w => w.level === 'B2').length} words)</option>
              <option value="B1" ${this.selectedLevel === 'B1' ? 'selected' : ''}>🔷 B1 Intermediate (${(window.Vocabulary || []).filter(w => w.level === 'B1').length} words)</option>
              <option value="A1" ${this.selectedLevel === 'A1' ? 'selected' : ''}>🟢 A1-A2 Foundation (${(window.Vocabulary || []).filter(w => w.level === 'A1' || w.level === 'A2').length} words)</option>
            </select>
          </div>
        </div>

        <!-- Live Score & Streak Bar -->
        <div class="picker-score-bar">
          <div class="score-pill">
            <span class="score-icon">🔥</span>
            <span>Streak: <strong>${this.sessionStats.streak}</strong></span>
          </div>
          <div class="score-pill">
            <span class="score-icon">🎯</span>
            <span>Accuracy: <strong>${accuracy}%</strong></span>
          </div>
          <div class="score-pill">
            <span class="score-icon">📊</span>
            <span>Score: <strong>${this.sessionStats.correct}</strong> / ${this.sessionStats.total}</span>
          </div>
        </div>

        <!-- Word Prompt Card -->
        <div class="picker-card animate-slide-up">
          <div class="picker-card-header">
            <span class="word-type-badge">${word.type || 'Word'}</span>
            <span class="level-tag">${word.level || 'A1'}</span>
            <span class="category-tag-subtle">${word.category}</span>
          </div>

          <!-- Prompt Word -->
          <div class="picker-prompt-area">
            ${isGermanPrompt ? `
              <div class="prompt-text german-text ${genderClass}" dir="ltr">
                ${word.article ? `<span class="article ${genderClass}">${word.article}</span> ` : ''}
                <span class="main-term">${word.german}</span>
              </div>
              <div class="prompt-audio-actions">
                <button class="speak-btn-card" onclick="window.Pronunciation && window.Pronunciation.speak('${wordToSpeak.replace(/'/g, "\\'")}')">
                  🔊 Listen / استمع
                </button>
                <button class="speak-btn-card btn-slow" onclick="window.Pronunciation && window.Pronunciation.speakSlow('${wordToSpeak.replace(/'/g, "\\'")}')">
                  🐢 Slow
                </button>
              </div>
            ` : `
              <div class="prompt-text arabic-text" dir="rtl">
                <span class="main-term">${word.arabic}</span>
              </div>
              <div class="prompt-instruction-subtle">
                Translate to German / ترجم إلى الألمانية
              </div>
            `}
          </div>

          <!-- Interactive Answer Area -->
          <div class="picker-answer-area">
            ${this.activeMode === 'mcq' ? this.renderMCQSection() : this.renderTextInputSection()}
          </div>

          <!-- Word Details & Examples (Revealed after answering) -->
          <div id="picker-reveal-box" class="picker-reveal-box" style="display: ${this.isAnswered ? 'block' : 'none'};">
            ${this.renderRevealedDetails()}
          </div>
        </div>

        <!-- Next Word Footer Action -->
        <div class="picker-footer-actions">
          <button class="btn btn-primary btn-next-picker" id="picker-next-btn" onclick="RandomPicker.pickNextWord()">
            🎲 Next Random Word / كلمة عشوائية أخرى ➔
          </button>
        </div>

      </div>
    `;
    
    // Auto-focus input if in text mode and not answered
    if (this.activeMode === 'text' && !this.isAnswered) {
      setTimeout(() => {
        const input = document.getElementById('picker-text-input');
        if (input) input.focus();
      }, 100);
    }
  },

  // Render Multiple Choice Options
  renderMCQSection() {
    const isGermanPrompt = this.currentPromptDirection === 'de-to-ar';
    
    return `
      <div class="picker-mcq-grid">
        ${this.currentOptions.map((opt, idx) => {
          let optText = '';
          let optDir = 'ltr';
          let optLang = 'german-text';
          
          if (isGermanPrompt) {
            optText = opt.arabic;
            optDir = 'rtl';
            optLang = 'arabic-text';
          } else {
            optText = (opt.article ? `${opt.article} ` : '') + opt.german;
            optDir = 'ltr';
            optLang = 'german-text';
          }
          
          return `
            <button class="picker-option-btn ${optLang}" dir="${optDir}" 
                    data-id="${opt.id}" 
                    ${this.isAnswered ? 'disabled' : ''}
                    onclick="RandomPicker.handleMCQClick(this, '${opt.id}')">
              <span class="opt-key-badge">${idx + 1}</span>
              <span class="opt-text">${optText}</span>
            </button>
          `;
        }).join('')}
      </div>
    `;
  },

  // Render Text Input Section
  renderTextInputSection() {
    const isGermanPrompt = this.currentPromptDirection === 'de-to-ar';
    const placeholder = isGermanPrompt 
      ? 'اكتب المعنى بالعربية...' 
      : 'Type German translation (e.g. Apfel)...';
    const inputDir = isGermanPrompt ? 'rtl' : 'ltr';
    const inputLang = isGermanPrompt ? 'arabic-text' : 'german-text';
    
    return `
      <div class="picker-text-container">
        <div class="input-action-group">
          <input type="text" id="picker-text-input" 
                 class="text-input ${inputLang}" 
                 dir="${inputDir}"
                 placeholder="${placeholder}" 
                 autocomplete="off" 
                 ${this.isAnswered ? 'disabled' : ''}
                 onkeypress="if(event.key === 'Enter') RandomPicker.checkTextInput()">
          <button class="btn btn-primary" onclick="RandomPicker.checkTextInput()" ${this.isAnswered ? 'disabled' : ''}>
            Check / تحقق
          </button>
        </div>
        
        <div class="picker-hints-row">
          <button class="btn-hint" onclick="RandomPicker.showHint()">
            💡 Hint / تلميح
          </button>
          ${!isGermanPrompt ? `
            <button class="btn-hint" onclick="RandomPicker.fillArticleHint()">
              🎨 Article Hint
            </button>
          ` : ''}
        </div>
      </div>
    `;
  },

  // Render Full Word Details after answer
  renderRevealedDetails() {
    const word = this.currentWord;
    if (!word) return '';
    
    // Find matching sentence
    let exampleGerman = '';
    let exampleArabic = '';
    if (window.Sentences) {
      const sent = window.Sentences.find(s => s.wordIds && s.wordIds.includes(word.id));
      if (sent) {
        exampleGerman = sent.german;
        exampleArabic = sent.arabic;
      }
    }
    
    return `
      <div class="reveal-content animate-fade-in">
        <div class="reveal-header">
          <div class="reveal-title">
            <span class="reveal-badge">Answer Details / تفاصيل الكلمة</span>
          </div>
        </div>
        
        <div class="reveal-words-row">
          <div class="reveal-de german-text" dir="ltr">
            <strong>${word.article ? word.article + ' ' : ''}${word.german}</strong>
            ${word.plural ? `<span class="plural-tag">(Plural: die ${word.plural})</span>` : ''}
          </div>
          <div class="reveal-ar arabic-text" dir="rtl">
            <strong>${word.arabic}</strong>
          </div>
        </div>

        ${word.conjugation ? `
          <div class="conjugation-mini">
            <span>ich <strong>${word.conjugation.ich}</strong></span>
            <span>du <strong>${word.conjugation.du}</strong></span>
            <span>er <strong>${word.conjugation.er}</strong></span>
            <span>wir <strong>${word.conjugation.wir}</strong></span>
          </div>
        ` : ''}

        ${exampleGerman ? `
          <div class="example-box">
            <p class="german-text" dir="ltr">"${exampleGerman}"</p>
            <p class="arabic-text" dir="rtl">"${exampleArabic}"</p>
            <button class="speak-btn-sm" onclick="window.Pronunciation && window.Pronunciation.speak('${exampleGerman.replace(/'/g, "\\'")}')">🔊</button>
          </div>
        ` : ''}
      </div>
    `;
  },

  // Handle MCQ Option Selection
  handleMCQClick(btn, selectedId) {
    if (this.isAnswered) return;
    this.isAnswered = true;
    
    const isCorrect = selectedId === this.currentWord.id;
    const allBtns = document.querySelectorAll('.picker-option-btn');
    allBtns.forEach(b => b.disabled = true);
    
    if (isCorrect) {
      btn.classList.add('correct');
      this.handleSuccess();
    } else {
      btn.classList.add('wrong', 'animate-shake');
      // Highlight the correct one
      allBtns.forEach(b => {
        if (b.dataset.id === this.currentWord.id) {
          b.classList.add('correct');
        }
      });
      this.handleFailure();
    }
    
    this.showRevealSection();
  },

  // Check Text Input Answer
  checkTextInput() {
    if (this.isAnswered) {
      this.pickNextWord();
      return;
    }
    
    const input = document.getElementById('picker-text-input');
    if (!input) return;
    
    const userVal = input.value.trim();
    if (!userVal) return;
    
    this.isAnswered = true;
    input.disabled = true;
    
    let isCorrect = false;
    
    if (this.currentPromptDirection === 'de-to-ar') {
      // Check Arabic translation match
      isCorrect = this.checkArabicMatch(userVal, this.currentWord.arabic);
    } else {
      // Check German translation match (can be with or without article)
      const targetGerman = this.currentWord.german;
      const targetWithArticle = (this.currentWord.article ? `${this.currentWord.article} ` : '') + targetGerman;
      isCorrect = this.checkGermanMatch(userVal, targetGerman) || this.checkGermanMatch(userVal, targetWithArticle);
    }
    
    if (isCorrect) {
      input.classList.add('input-correct');
      this.handleSuccess();
    } else {
      input.classList.add('input-wrong', 'animate-shake');
      this.handleFailure();
      if (window.UI) {
        window.UI.showToast(`Correct: ${this.correctAnswerText}`, 'error', 3000);
      }
    }
    
    this.showRevealSection();
  },

  // Reveal details box
  showRevealSection() {
    const revealBox = document.getElementById('picker-reveal-box');
    if (revealBox) {
      revealBox.innerHTML = this.renderRevealedDetails();
      revealBox.style.display = 'block';
    }
    
    // Focus Next Button
    const nextBtn = document.getElementById('picker-next-btn');
    if (nextBtn) {
      nextBtn.classList.add('animate-pulse');
      nextBtn.focus();
    }
  },

  // Success handler
  handleSuccess() {
    this.sessionStats.correct++;
    this.sessionStats.total++;
    this.sessionStats.streak++;
    if (this.sessionStats.streak > this.sessionStats.bestStreak) {
      this.sessionStats.bestStreak = this.sessionStats.streak;
    }
    
    // Award XP
    if (window.Progress) {
      window.Progress.addXP(10);
    }
    
    // Pronounce German word on correct answer
    if (window.Pronunciation) {
      const textToSpeak = (this.currentWord.article ? `${this.currentWord.article} ` : '') + this.currentWord.german;
      window.Pronunciation.speak(textToSpeak);
    }
    
    if (window.UI) {
      window.UI.showToast('Richtig! / صحيح! +10 XP', 'success', 1500);
    }
    
    this.updateScoreBar();
  },

  // Failure handler
  handleFailure() {
    this.sessionStats.wrong++;
    this.sessionStats.total++;
    this.sessionStats.streak = 0;
    
    this.updateScoreBar();
  },

  // Update live score bar without full re-render
  updateScoreBar() {
    const accuracy = this.sessionStats.total > 0 
      ? Math.round((this.sessionStats.correct / this.sessionStats.total) * 100) 
      : 100;
      
    const scoreBar = document.querySelector('.picker-score-bar');
    if (scoreBar) {
      scoreBar.innerHTML = `
        <div class="score-pill">
          <span class="score-icon">🔥</span>
          <span>Streak: <strong>${this.sessionStats.streak}</strong></span>
        </div>
        <div class="score-pill">
          <span class="score-icon">🎯</span>
          <span>Accuracy: <strong>${accuracy}%</strong></span>
        </div>
        <div class="score-pill">
          <span class="score-icon">📊</span>
          <span>Score: <strong>${this.sessionStats.correct}</strong> / ${this.sessionStats.total}</span>
        </div>
      `;
    }
  },

  // Show Hint
  showHint() {
    const input = document.getElementById('picker-text-input');
    if (!input || this.isAnswered) return;
    
    if (this.currentPromptDirection === 'de-to-ar') {
      input.value = this.currentWord.arabic.charAt(0);
    } else {
      if (this.currentWord.article) {
        input.value = `${this.currentWord.article} ${this.currentWord.german.charAt(0)}`;
      } else {
        input.value = this.currentWord.german.charAt(0);
      }
    }
    input.focus();
  },

  // Fill Article Hint
  fillArticleHint() {
    const input = document.getElementById('picker-text-input');
    if (!input || this.isAnswered || !this.currentWord.article) return;
    input.value = `${this.currentWord.article} `;
    input.focus();
  },

  // Set Direction
  setDirection(dir) {
    this.activeDirection = dir;
    this.pickNextWord();
  },

  // Set Mode
  setMode(mode) {
    this.activeMode = mode;
    this.pickNextWord();
  },

  // Set Category
  setCategory(catId) {
    this.selectedCategory = catId;
    this.pickNextWord();
  },

  // Set Level
  setLevel(lvl) {
    this.selectedLevel = lvl;
    this.pickNextWord();
  },

  // Flexible German string comparator (umlauts & punctuation)
  checkGermanMatch(user, target) {
    const clean = s => s.toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .replace(/[.,!?]/g, '').trim();
    return clean(user) === clean(target) || user.trim().toLowerCase() === target.trim().toLowerCase();
  },

  // Flexible Arabic string comparator (tashkeel, hamza & alef variations)
  checkArabicMatch(user, target) {
    const clean = s => s
      .replace(/[\u064B-\u065F\u0670]/g, '') // remove diacritics
      .replace(/[أإآء]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[.,!?]/g, '').trim();
    return clean(user) === clean(target) || target.includes(user.trim());
  },

  // Keyboard Shortcuts handler
  setupKeyboard() {
    if (this._kbdInitialized) return;
    this._kbdInitialized = true;
    
    document.addEventListener('keydown', (e) => {
      const randomScreen = document.getElementById('random');
      if (!randomScreen || !randomScreen.classList.contains('active')) return;
      
      // If typing in input, don't trigger number keys
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
        return;
      }
      
      // Numbers 1-4 for MCQ options
      if (['1', '2', '3', '4'].includes(e.key) && this.activeMode === 'mcq' && !this.isAnswered) {
        const idx = parseInt(e.key) - 1;
        const btns = document.querySelectorAll('.picker-option-btn');
        if (btns[idx]) {
          btns[idx].click();
        }
      }
      
      // Space or Enter for Next Word when answered
      if ((e.code === 'Space' || e.code === 'Enter') && this.isAnswered) {
        e.preventDefault();
        this.pickNextWord();
      }
    });
  }
};
