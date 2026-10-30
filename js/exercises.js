window.Exercises = {
  currentExercise: null,
  exerciseQueue: [],
  currentIndex: 0,
  sessionStats: { correct: 0, wrong: 0, total: 0, xpEarned: 0 },
  
  // Start exercise session
  startSession(type, options = {}) {
    this.sessionStats = { correct: 0, wrong: 0, total: 0, xpEarned: 0 };
    this.currentIndex = 0;
    
    const count = options.count || 10;
    let vocab = window.Vocabulary || [];
    
    // Filter if category option provided
    if (options.category) {
      vocab = vocab.filter(w => w.category === options.category);
    }
    
    // Exercise-specific filtering
    if (type === 'articles') {
      vocab = vocab.filter(w => w.article && ['der', 'die', 'das'].includes(w.article));
    } else if (type === 'conjugation') {
      vocab = vocab.filter(w => w.type === 'verb' && w.conjugation);
    }
    
    if (vocab.length < 3) {
      if (window.UI) {
        window.UI.showToast('Not enough words available for this exercise type. / لا توجد كلمات كافية لهذا النوع من التمارين.', 'error');
      }
      return;
    }
    
    // Shuffle vocab
    const shuffled = [...vocab].sort(() => 0.5 - Math.random());
    
    if (type === 'matching') {
      // Matching needs 5-6 words in a single round
      this.exerciseQueue = [{
        type: 'matching',
        words: shuffled.slice(0, Math.min(6, shuffled.length))
      }];
    } else {
      this.exerciseQueue = shuffled.slice(0, count).map(word => ({
        type: type,
        word: word
      }));
    }
    
    this.sessionStats.total = this.exerciseQueue.length;
    window.UI.navigateTo('exercise-screen');
    window.UI.setHeaderTitle('Practice / تدريب', this.getExerciseTitle(type));
    this.renderCurrentExercise();
  },

  getExerciseTitle(type) {
    const titles = {
      'multiple-choice': 'Multiple Choice / اختيار من متعدد',
      'fill-blank': 'Fill in the Blank / املأ الفراغ',
      'sentence-builder': 'Sentence Builder / بناء الجملة',
      'listening': 'Listening / استماع ونطق',
      'articles': 'Articles (der/die/das) / أدوات التعريف',
      'conjugation': 'Verb Conjugation / تصريف الأفعال',
      'matching': 'Word Matching / توصيل الكلمات'
    };
    return titles[type] || 'Exercise / تمرين';
  },
  
  // Show exercise selection screen
  showExerciseMenu() {
    window.UI.navigateTo('exercise-menu-screen');
    window.UI.setHeaderTitle('Exercises / التمارين', 'Choose a practice mode / اختر نوع التدريب');
    
    const container = document.getElementById('exercise-menu-content');
    if (!container) return;
    
    const exercises = [
      { id: 'multiple-choice', icon: '📝', nameEN: 'Multiple Choice', nameAR: 'اختيار من متعدد', desc: 'Pick the correct translation between German & Arabic.' },
      { id: 'articles', icon: '🎨', nameEN: 'Articles (der/die/das)', nameAR: 'أدوات التعريف', desc: 'Master German genders: der (blue), die (red), das (green).' },
      { id: 'fill-blank', icon: '✍️', nameEN: 'Fill in the Blank', nameAR: 'املأ الفراغ', desc: 'Type the missing German word in context.' },
      { id: 'sentence-builder', icon: '🧩', nameEN: 'Sentence Builder', nameAR: 'بناء الجملة', desc: 'Arrange words into the correct German sentence order.' },
      { id: 'listening', icon: '🎧', nameEN: 'Listening & Spelling', nameAR: 'الاستماع والكتابة', desc: 'Listen to native German audio and type the word.' },
      { id: 'conjugation', icon: '🔄', nameEN: 'Verb Conjugation', nameAR: 'تصريف الأفعال', desc: 'Practice present tense verb forms with pronouns.' },
      { id: 'matching', icon: '🔗', nameEN: 'Pair Matching', nameAR: 'توصيل الكلمات', desc: 'Connect German words with their Arabic meanings.' }
    ];
    
    container.innerHTML = `
      <div class="exercise-menu-wrapper">
        <div class="exercise-grid">
          ${exercises.map(ex => `
            <div class="exercise-card" onclick="window.Exercises.startSession('${ex.id}')">
              <div class="exercise-card-icon">${ex.icon}</div>
              <div class="exercise-card-body">
                <h3>${ex.nameEN}</h3>
                <h4 class="arabic-text" dir="rtl">${ex.nameAR}</h4>
                <p>${ex.desc}</p>
              </div>
              <button class="btn btn-sm btn-primary">Start / ابدأ ←</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },
  
  renderCurrentExercise() {
    if (this.currentIndex >= this.exerciseQueue.length) {
      this.showExerciseSummary();
      return;
    }
    
    const ex = this.exerciseQueue[this.currentIndex];
    this.currentExercise = ex;
    
    const container = document.getElementById('exercise-screen-content');
    if (!container) return;
    
    // Render progress bar
    const progressPercent = ((this.currentIndex) / this.exerciseQueue.length) * 100;
    
    container.innerHTML = `
      <div class="exercise-header">
        <button class="back-btn-sm" onclick="window.location.hash='dashboard'; App.renderDashboard();">✕ Exit / خروج</button>
        <span class="exercise-step">Question ${this.currentIndex + 1} of ${this.exerciseQueue.length}</span>
      </div>
      <div class="progress-bar mb-4"><div class="progress-fill" style="width: ${progressPercent}%"></div></div>
      <div id="exercise-interactive-area" class="exercise-interactive-area"></div>
    `;
    
    const interactiveArea = document.getElementById('exercise-interactive-area');
    
    switch(ex.type) {
      case 'multiple-choice': this.renderMultipleChoice(ex.word, interactiveArea); break;
      case 'fill-blank': this.renderFillBlank(ex.word, interactiveArea); break;
      case 'sentence-builder': this.renderSentenceBuilder(ex.word, interactiveArea); break;
      case 'listening': this.renderListening(ex.word, interactiveArea); break;
      case 'articles': this.renderArticlePractice(ex.word, interactiveArea); break;
      case 'conjugation': this.renderConjugation(ex.word, interactiveArea); break;
      case 'matching': this.renderMatching(ex.words, interactiveArea); break;
      default: this.renderMultipleChoice(ex.word, interactiveArea);
    }
  },
  
  // ===================== 1. MULTIPLE CHOICE =====================
  renderMultipleChoice(word, container) {
    const distractors = this.getDistractors(word, 3);
    const options = [word, ...distractors].sort(() => 0.5 - Math.random());
    const isGermanPrompt = Math.random() > 0.3; // 70% German to Arabic, 30% Arabic to German
    
    const promptText = isGermanPrompt 
      ? (word.article ? `${word.article} ${word.german}` : word.german)
      : word.arabic;
      
    const promptLang = isGermanPrompt ? 'german-text' : 'arabic-text';
    const promptDir = isGermanPrompt ? 'ltr' : 'rtl';
    
    container.innerHTML = `
      <div class="mcq-container animate-fade-in">
        <div class="exercise-prompt-label">Translate to ${isGermanPrompt ? 'Arabic' : 'German'} / ترجم إلى ${isGermanPrompt ? 'العربية' : 'الألمانية'}</div>
        <div class="mcq-prompt-box">
          <h2 class="question-text ${promptLang}" dir="${promptDir}">${promptText}</h2>
          ${isGermanPrompt ? `
            <button class="speak-btn-card" onclick="window.Pronunciation && window.Pronunciation.speak('${(word.article ? word.article + ' ' : '') + word.german.replace(/'/g, "\\'")}')">
              🔊 Listen
            </button>
          ` : ''}
        </div>
        <div class="options-grid">
          ${options.map(opt => {
            const optText = isGermanPrompt ? opt.arabic : (opt.article ? `${opt.article} ${opt.german}` : opt.german);
            const optDir = isGermanPrompt ? 'rtl' : 'ltr';
            const optLang = isGermanPrompt ? 'arabic-text' : 'german-text';
            return `
              <button class="btn option-btn ${optLang}" dir="${optDir}" onclick="window.Exercises.handleMCQSelection(this, '${opt.id}', '${word.id}')">
                ${optText}
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },
  
  handleMCQSelection(btn, selectedId, correctId) {
    const isCorrect = selectedId === correctId;
    const allBtns = btn.parentElement.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.disabled = true);
    
    if (isCorrect) {
      btn.classList.add('correct');
      this.sessionStats.correct++;
      this.awardXP(10);
    } else {
      btn.classList.add('wrong');
      this.sessionStats.wrong++;
      // Highlight correct answer
      allBtns.forEach(b => {
        if (b.onclick && b.onclick.toString().includes(`'${correctId}', '${correctId}'`) || b.onclick.toString().includes(`'${correctId}'`)) {
          b.classList.add('correct');
        }
      });
    }
    
    setTimeout(() => this.nextExercise(), 1200);
  },
  
  // ===================== 2. FILL IN THE BLANK =====================
  renderFillBlank(word, container) {
    let sentence = null;
    if (window.Sentences) {
      sentence = window.Sentences.find(s => s.wordIds && s.wordIds.includes(word.id));
    }
    
    const fullGerman = sentence ? sentence.german : `Ich sehe ${word.article ? word.article + ' ' : ''}${word.german}.`;
    const fullArabic = sentence ? sentence.arabic : `أنا أرى ${word.arabic}.`;
    
    // Replace the target word with blank
    const regex = new RegExp(`\\b${word.german}\\b`, 'i');
    const blankedGerman = fullGerman.replace(regex, '________');
    
    container.innerHTML = `
      <div class="fill-blank-container animate-fade-in">
        <div class="exercise-prompt-label">Complete the sentence / أكمل الجملة</div>
        <p class="arabic-text sentence-hint-ar" dir="rtl">"${fullArabic}"</p>
        <h2 class="question-text german-text mb-4" dir="ltr">${blankedGerman}</h2>
        
        <div class="input-action-group">
          <input type="text" id="fb-input" class="text-input text-center" placeholder="Type the missing word..." autocomplete="off">
          <button class="btn btn-primary" onclick="window.Exercises.checkFillBlank('${word.german.replace(/'/g, "\\'")}')">Check / تحقق</button>
        </div>
        
        <div class="hint-buttons">
          <button class="btn-hint" onclick="document.getElementById('fb-input').value = '${word.german.charAt(0)}'">💡 Hint (first letter)</button>
          <button class="btn-hint" onclick="window.Pronunciation && window.Pronunciation.speak('${fullGerman.replace(/'/g, "\\'")}')">🔊 Listen to sentence</button>
        </div>
      </div>
    `;
    
    setTimeout(() => {
      const input = document.getElementById('fb-input');
      if (input) {
        input.focus();
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') this.checkFillBlank(word.german);
        });
      }
    }, 150);
  },
  
  checkFillBlank(correctAnswer) {
    const input = document.getElementById('fb-input');
    if (!input) return;
    const userAnswer = input.value.trim();
    const isCorrect = this.checkAnswer(userAnswer, correctAnswer);
    
    if (isCorrect) {
      input.classList.add('input-correct');
      this.sessionStats.correct++;
      this.awardXP(15);
      if (window.UI) window.UI.showToast('Richtig! Gut gemacht! / صحيح! أحسنت!', 'success', 1500);
      setTimeout(() => this.nextExercise(), 1200);
    } else {
      input.classList.add('input-wrong', 'animate-shake');
      this.sessionStats.wrong++;
      if (window.UI) window.UI.showToast(`Correct answer: ${correctAnswer} / الإجابة الصحيحة: ${correctAnswer}`, 'error', 3000);
      setTimeout(() => {
        input.classList.remove('animate-shake');
        this.nextExercise();
      }, 2000);
    }
  },
  
  // ===================== 3. SENTENCE BUILDER =====================
  renderSentenceBuilder(word, container) {
    let sentenceObj = null;
    if (window.Sentences) {
      sentenceObj = window.Sentences.find(s => s.wordIds && s.wordIds.includes(word.id));
    }
    
    const germanSentence = sentenceObj ? sentenceObj.german : `Das ist ${word.article ? word.article + ' ' : ''}${word.german}.`;
    const arabicSentence = sentenceObj ? sentenceObj.arabic : `هذا ${word.arabic}.`;
    
    // Split into clean words without punctuation attached for tiles
    const words = germanSentence.replace(/[.,!?]/g, '').split(/\s+/).sort(() => 0.5 - Math.random());
    
    window.Exercises._sbCorrect = germanSentence.replace(/[.,!?]/g, '').trim().toLowerCase();
    
    container.innerHTML = `
      <div class="sentence-builder-container animate-fade-in">
        <div class="exercise-prompt-label">Build the German sentence / ابنِ الجملة الألمانية</div>
        <p class="arabic-text sentence-hint-ar" dir="rtl">"${arabicSentence}"</p>
        
        <div class="constructed-sentence-box" id="sb-constructed" placeholder="Tap words below to arrange them here..."></div>
        
        <div class="word-tiles-grid" id="sb-tiles">
          ${words.map(w => `
            <button class="word-tile-btn german-text" onclick="window.Exercises.toggleSbWord(this)">${w}</button>
          `).join('')}
        </div>
        
        <div class="action-footer">
          <button class="btn btn-primary" onclick="window.Exercises.checkSentenceBuilder()">Check / تحقق</button>
        </div>
      </div>
    `;
  },
  
  toggleSbWord(btn) {
    const constructed = document.getElementById('sb-constructed');
    const tiles = document.getElementById('sb-tiles');
    
    if (btn.parentElement === tiles) {
      constructed.appendChild(btn);
    } else {
      tiles.appendChild(btn);
    }
  },
  
  checkSentenceBuilder() {
    const constructed = document.getElementById('sb-constructed');
    if (!constructed) return;
    const userWords = Array.from(constructed.children).map(b => b.textContent.trim());
    const userSentence = userWords.join(' ').toLowerCase();
    const isCorrect = userSentence === window.Exercises._sbCorrect;
    
    if (isCorrect) {
      constructed.classList.add('correct');
      this.sessionStats.correct++;
      this.awardXP(15);
      if (window.UI) window.UI.showToast('Perfekt! / ممتاز!', 'success', 1500);
      setTimeout(() => this.nextExercise(), 1200);
    } else {
      constructed.classList.add('animate-shake', 'wrong');
      this.sessionStats.wrong++;
      if (window.UI) window.UI.showToast(`Correct sentence: ${window.Exercises._sbCorrect}`, 'error', 3000);
      setTimeout(() => {
        constructed.classList.remove('animate-shake');
        this.nextExercise();
      }, 2000);
    }
  },
  
  // ===================== 4. LISTENING EXERCISE =====================
  renderListening(word, container) {
    const targetWord = word.german;
    
    container.innerHTML = `
      <div class="listening-container text-center animate-fade-in">
        <div class="exercise-prompt-label">Listen & Type / استمع واكتب</div>
        
        <div class="listening-audio-controls">
          <button class="btn-large-speak" onclick="window.Pronunciation && window.Pronunciation.speak('${targetWord.replace(/'/g, "\\'")}')">
            🔊
          </button>
          <div class="audio-hint-text">Click to listen / اضغط للاستماع</div>
          <button class="btn-hint" onclick="window.Pronunciation && window.Pronunciation.speakSlow('${targetWord.replace(/'/g, "\\'")}')">
            🐢 Play Slow / ببطء
          </button>
        </div>
        
        <p class="arabic-text text-muted mb-4" dir="rtl">Meaning: ${word.arabic}</p>
        
        <div class="input-action-group">
          <input type="text" id="listen-input" class="text-input text-center" placeholder="Type what you hear..." autocomplete="off">
          <button class="btn btn-primary" onclick="window.Exercises.checkListening('${targetWord.replace(/'/g, "\\'")}')">Check / تحقق</button>
        </div>
      </div>
    `;
    
    // Auto-play pronunciation
    setTimeout(() => {
      if (window.Pronunciation) {
        window.Pronunciation.speak(targetWord);
      }
      const input = document.getElementById('listen-input');
      if (input) {
        input.focus();
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') this.checkListening(targetWord);
        });
      }
    }, 400);
  },
  
  checkListening(correctAnswer) {
    const input = document.getElementById('listen-input');
    if (!input) return;
    const userAnswer = input.value.trim();
    const isCorrect = this.checkAnswer(userAnswer, correctAnswer);
    
    if (isCorrect) {
      input.classList.add('input-correct');
      this.sessionStats.correct++;
      this.awardXP(15);
      if (window.UI) window.UI.showToast('Ausgezeichnet! / ممتاز!', 'success', 1500);
      setTimeout(() => this.nextExercise(), 1200);
    } else {
      input.classList.add('input-wrong', 'animate-shake');
      this.sessionStats.wrong++;
      if (window.UI) window.UI.showToast(`It was: ${correctAnswer} / الكلمة كانت: ${correctAnswer}`, 'error', 3000);
      setTimeout(() => {
        input.classList.remove('animate-shake');
        this.nextExercise();
      }, 2000);
    }
  },
  
  // ===================== 5. ARTICLE PRACTICE (der/die/das) =====================
  renderArticlePractice(word, container) {
    container.innerHTML = `
      <div class="articles-container text-center animate-fade-in">
        <div class="exercise-prompt-label">Choose the correct article / اختر أداة التعريف المناسبة</div>
        <p class="arabic-text noun-arabic-hint" dir="rtl">${word.arabic}</p>
        
        <div class="noun-target-card">
          <span class="missing-article">____</span>
          <span class="noun-german-word german-text">${word.german}</span>
        </div>
        
        ${word.plural ? `<div class="plural-hint">Plural: die ${word.plural}</div>` : ''}
        
        <div class="article-buttons-grid">
          <button class="btn article-choice-btn gender-masc" onclick="window.Exercises.checkArticle(this, 'der', '${word.article}')">
            der <small>(مذكر)</small>
          </button>
          <button class="btn article-choice-btn gender-fem" onclick="window.Exercises.checkArticle(this, 'die', '${word.article}')">
            die <small>(مؤنث)</small>
          </button>
          <button class="btn article-choice-btn gender-neut" onclick="window.Exercises.checkArticle(this, 'das', '${word.article}')">
            das <small>(محايد)</small>
          </button>
        </div>
      </div>
    `;
  },
  
  checkArticle(btn, selected, correct) {
    const allBtns = btn.parentElement.querySelectorAll('.article-choice-btn');
    allBtns.forEach(b => b.disabled = true);
    
    if (selected === correct) {
      btn.classList.add('correct');
      this.sessionStats.correct++;
      this.awardXP(10);
      if (window.UI) window.UI.showToast('Richtig! / صحيح!', 'success', 1000);
    } else {
      btn.classList.add('wrong');
      allBtns.forEach(b => {
        if (b.textContent.trim().startsWith(correct)) {
          b.classList.add('correct');
        }
      });
      this.sessionStats.wrong++;
      if (window.UI) window.UI.showToast(`Wrong! It is: ${correct} / خطأ! الأداة هي: ${correct}`, 'error', 1500);
    }
    
    setTimeout(() => this.nextExercise(), 1200);
  },
  
  // ===================== 6. VERB CONJUGATION =====================
  renderConjugation(word, container) {
    const pronouns = [
      { key: 'ich', label: 'ich (أنا)' },
      { key: 'du', label: 'du (أنتَ / أنتِ)' },
      { key: 'er', label: 'er / sie / es (هو / هي)' },
      { key: 'wir', label: 'wir (نحن)' },
      { key: 'ihr', label: 'ihr (أنتم)' },
      { key: 'sie', label: 'sie / Sie (هم / حضرتك)' }
    ];
    
    const randomPronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
    const expectedAnswer = word.conjugation[randomPronoun.key];
    
    container.innerHTML = `
      <div class="conjugation-container text-center animate-fade-in">
        <div class="exercise-prompt-label">Conjugate the verb / صرّف الفعل</div>
        <h2 class="verb-infinitive german-text">${word.german}</h2>
        <p class="arabic-text mb-4" dir="rtl">${word.arabic}</p>
        
        <div class="conjugation-input-row">
          <span class="pronoun-badge">${randomPronoun.label}</span>
          <input type="text" id="conj-input" class="text-input" placeholder="Conjugated form..." autocomplete="off">
          <button class="btn btn-primary" onclick="window.Exercises.checkConjugation('${expectedAnswer.replace(/'/g, "\\'")}', '${word.id}')">Check / تحقق</button>
        </div>
        
        <div id="conjugation-table-reveal" class="conjugation-table-reveal" style="display: none;"></div>
      </div>
    `;
    
    setTimeout(() => {
      const input = document.getElementById('conj-input');
      if (input) {
        input.focus();
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') this.checkConjugation(expectedAnswer, word.id);
        });
      }
    }, 150);
  },
  
  checkConjugation(correctAnswer, wordId) {
    const input = document.getElementById('conj-input');
    if (!input) return;
    const userAnswer = input.value.trim();
    const isCorrect = this.checkAnswer(userAnswer, correctAnswer);
    
    const word = (window.Vocabulary || []).find(w => w.id === wordId);
    const tableReveal = document.getElementById('conjugation-table-reveal');
    
    if (word && word.conjugation && tableReveal) {
      tableReveal.style.display = 'block';
      tableReveal.innerHTML = `
        <table class="conjugation-mini-table">
          <tr><td>ich</td><td><strong>${word.conjugation.ich}</strong></td><td>wir</td><td><strong>${word.conjugation.wir}</strong></td></tr>
          <tr><td>du</td><td><strong>${word.conjugation.du}</strong></td><td>ihr</td><td><strong>${word.conjugation.ihr}</strong></td></tr>
          <tr><td>er/sie/es</td><td><strong>${word.conjugation.er}</strong></td><td>sie/Sie</td><td><strong>${word.conjugation.sie}</strong></td></tr>
        </table>
      `;
    }
    
    if (isCorrect) {
      input.classList.add('input-correct');
      this.sessionStats.correct++;
      this.awardXP(15);
      if (window.UI) window.UI.showToast('Sehr gut! / ممتاز!', 'success', 1500);
      setTimeout(() => this.nextExercise(), 1800);
    } else {
      input.classList.add('input-wrong', 'animate-shake');
      this.sessionStats.wrong++;
      if (window.UI) window.UI.showToast(`Correct: ${correctAnswer} / الإجابة الصحيحة: ${correctAnswer}`, 'error', 3000);
      setTimeout(() => this.nextExercise(), 2500);
    }
  },
  
  // ===================== 7. PAIR MATCHING =====================
  renderMatching(words, container) {
    const leftCol = [...words].sort(() => 0.5 - Math.random());
    const rightCol = [...words].sort(() => 0.5 - Math.random());
    
    window.Exercises._matchSelectedLeft = null;
    window.Exercises._matchSelectedRight = null;
    window.Exercises._matchPairs = words.length;
    
    container.innerHTML = `
      <div class="matching-container animate-fade-in">
        <div class="exercise-prompt-label">Match the German & Arabic pairs / وصّل الكلمات ومعانيها</div>
        <div class="matching-grid">
          <div class="matching-col" id="match-left">
            ${leftCol.map(w => `
              <button class="match-card-btn german-text" data-id="${w.id}" onclick="window.Exercises.selectMatch(this, 'left')">
                ${w.article ? `<span class="article">${w.article}</span> ` : ''}${w.german}
              </button>
            `).join('')}
          </div>
          <div class="matching-col" id="match-right">
            ${rightCol.map(w => `
              <button class="match-card-btn arabic-text" dir="rtl" data-id="${w.id}" onclick="window.Exercises.selectMatch(this, 'right')">
                ${w.arabic}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },
  
  selectMatch(btn, side) {
    if (btn.classList.contains('matched')) return;
    
    const parent = btn.parentElement;
    Array.from(parent.children).forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    
    if (side === 'left') window.Exercises._matchSelectedLeft = btn;
    else window.Exercises._matchSelectedRight = btn;
    
    if (window.Exercises._matchSelectedLeft && window.Exercises._matchSelectedRight) {
      const leftId = window.Exercises._matchSelectedLeft.dataset.id;
      const rightId = window.Exercises._matchSelectedRight.dataset.id;
      
      const leftBtn = window.Exercises._matchSelectedLeft;
      const rightBtn = window.Exercises._matchSelectedRight;
      
      if (leftId === rightId) {
        // Correct match!
        leftBtn.classList.add('matched');
        rightBtn.classList.add('matched');
        leftBtn.classList.remove('selected');
        rightBtn.classList.remove('selected');
        
        window.Exercises._matchSelectedLeft = null;
        window.Exercises._matchSelectedRight = null;
        window.Exercises._matchPairs--;
        
        this.awardXP(5);
        
        if (window.Exercises._matchPairs === 0) {
          this.sessionStats.correct++;
          if (window.UI) window.UI.showToast('All matched! Alles richtig! / تم التوصيل بنجاح!', 'success', 1500);
          setTimeout(() => this.nextExercise(), 1200);
        }
      } else {
        // Wrong match
        leftBtn.classList.add('animate-shake', 'wrong');
        rightBtn.classList.add('animate-shake', 'wrong');
        
        setTimeout(() => {
          leftBtn.classList.remove('animate-shake', 'wrong', 'selected');
          rightBtn.classList.remove('animate-shake', 'wrong', 'selected');
          window.Exercises._matchSelectedLeft = null;
          window.Exercises._matchSelectedRight = null;
        }, 600);
      }
    }
  },
  
  // Generic XP award helper
  awardXP(points) {
    if (window.Progress) {
      window.Progress.addXP(points);
      this.sessionStats.xpEarned += points;
    }
  },
  
  // Normalized answer checker (handles umlauts & capitalization)
  checkAnswer(userAnswer, correctAnswer) {
    if (!userAnswer || !correctAnswer) return false;
    
    const normalize = (str) => {
      return str.toLowerCase()
        .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
        .replace(/[.,!?]/g, '')
        .trim();
    };
    
    return normalize(userAnswer) === normalize(correctAnswer) || userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
  },
  
  nextExercise() {
    this.currentIndex++;
    this.renderCurrentExercise();
  },
  
  // Session summary
  showExerciseSummary() {
    const container = document.getElementById('exercise-screen-content');
    if (!container) return;
    
    const accuracy = this.sessionStats.total > 0 ? Math.round((this.sessionStats.correct / this.sessionStats.total) * 100) : 0;
    
    // Log in storage
    if (window.Storage) {
      window.Storage.logSession({
        cardsReviewed: this.sessionStats.total,
        correct: this.sessionStats.correct,
        wrong: this.sessionStats.wrong,
        xpEarned: this.sessionStats.xpEarned,
        timeSpent: 60
      });
    }
    
    container.innerHTML = `
      <div class="session-summary animate-fade-in">
        <div class="summary-celebration">🎯</div>
        <h2>Practice Complete! / اكتمل التدريب!</h2>
        <p class="summary-subtitle">Practice makes perfect! / التدريب يصنع الإتقان!</p>
        
        <div class="summary-stats-grid">
          <div class="summary-card">
            <div class="summary-icon">📝</div>
            <div class="summary-value">${this.sessionStats.total}</div>
            <div class="summary-label">Exercises / تمارين</div>
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
        </div>
        
        <div class="summary-actions">
          <button class="btn btn-primary" onclick="window.Exercises.showExerciseMenu()">
            💪 More Practice / تمارين أخرى
          </button>
          <button class="btn btn-secondary" onclick="window.location.hash='dashboard'; App.renderDashboard();">
            🏠 Back to Dashboard / الرئيسية
          </button>
        </div>
      </div>
    `;
    
    window.UI.setHeaderTitle('Summary / ملخص التدريب');
  },
  
  // Smart distractor generator
  getDistractors(correctWord, count = 3) {
    const vocab = window.Vocabulary || [];
    let pool = vocab.filter(w => w.id !== correctWord.id);
    
    // Prioritize same category or same type
    const sameCat = pool.filter(w => w.category === correctWord.category);
    if (sameCat.length >= count) {
      pool = sameCat;
    } else {
      const sameType = pool.filter(w => w.type === correctWord.type);
      if (sameType.length >= count) pool = sameType;
    }
    
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
};
