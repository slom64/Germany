/**
 * Progression Learning of Vocabulary (المفردات المتقنة)
 * Allows entering and managing words the student has mastered,
 * for future study and integration with the Random Word Picker.
 */
window.Progression = {
  searchQuery: '',
  dropdownActiveIndex: -1,
  currentMatches: [],
  librarySearch: '',
  selectedLevelFilter: 'all',
  selectedCategoryFilter: 'all',
  sortBy: 'date-desc', // 'date-desc', 'date-asc', 'alpha-asc', 'level'
  browseCategory: 'greetings',
  browseLevel: 'all',
  showBrowseSection: false,

  // Initialize and render screen
  initScreen() {
    window.UI.navigateTo('progression');
    window.UI.setHeaderTitle('Progression Learning / الكلمات المتقنة', 'Track & Review Mastered Vocabulary');
    this.render();
  },

  // Main Render Method
  render() {
    const container = document.getElementById('progression-content');
    if (!container) return;

    const allVocab = window.Vocabulary || [];
    const learnedMap = window.Storage ? window.Storage.getLearnedWords() : {};
    const learnedIds = Object.keys(learnedMap);
    const learnedCount = learnedIds.length;
    const totalVocabCount = allVocab.length;
    const pctTotal = totalVocabCount > 0 ? Math.round((learnedCount / totalVocabCount) * 100) : 0;

    // Calculate level breakdown for learned words
    const learnedWordsList = allVocab.filter(w => learnedMap[w.id]);
    const b2Count = learnedWordsList.filter(w => w.level === 'B2').length;
    const b1Count = learnedWordsList.filter(w => w.level === 'B1').length;
    const a1Count = learnedWordsList.filter(w => w.level === 'A1' || w.level === 'A2').length;

    // Filter and sort the learned words for the library view
    let filteredLearned = [...learnedWordsList];

    if (this.selectedLevelFilter !== 'all') {
      if (this.selectedLevelFilter === 'A1') {
        filteredLearned = filteredLearned.filter(w => w.level === 'A1' || w.level === 'A2');
      } else {
        filteredLearned = filteredLearned.filter(w => w.level === this.selectedLevelFilter);
      }
    }

    if (this.selectedCategoryFilter !== 'all') {
      filteredLearned = filteredLearned.filter(w => w.category === this.selectedCategoryFilter);
    }

    if (this.librarySearch.trim()) {
      const q = this.cleanStr(this.librarySearch);
      filteredLearned = filteredLearned.filter(w => {
        return this.cleanStr(w.german).includes(q) || 
               this.cleanStr(w.arabic).includes(q) ||
               (w.plural && this.cleanStr(w.plural).includes(q));
      });
    }

    // Sort
    filteredLearned.sort((a, b) => {
      if (this.sortBy === 'date-desc') {
        const da = learnedMap[a.id]?.learnedAt || '';
        const db = learnedMap[b.id]?.learnedAt || '';
        return db.localeCompare(da);
      } else if (this.sortBy === 'date-asc') {
        const da = learnedMap[a.id]?.learnedAt || '';
        const db = learnedMap[b.id]?.learnedAt || '';
        return da.localeCompare(db);
      } else if (this.sortBy === 'alpha-asc') {
        return a.german.localeCompare(b.german);
      } else if (this.sortBy === 'level') {
        const order = { 'B2': 1, 'B1': 2, 'A1': 3, 'A2': 3 };
        return (order[a.level] || 9) - (order[b.level] || 9);
      }
      return 0;
    });

    const categories = window.Categories || [];

    container.innerHTML = `
      <div class="progression-wrapper animate-fade-in">
        
        <!-- Top Stats Banner -->
        <div class="progression-hero">
          <div class="hero-left">
            <div class="hero-badge">🎯 Progression Learning / مسار الكلمات المتقنة</div>
            <h2 class="hero-title">Words You Have Mastered / الكلمات التي أتقنتها</h2>
            <p class="hero-desc">
              Enter and track words you know for future retention and random drilling.
              <span class="arabic-text" dir="rtl">سجّل المفردات التي أتقنتها لتثبيتها في ذاكرتك ومراجعتها أو اختبارها عشوائياً في أي وقت.</span>
            </p>
          </div>
          
          <div class="hero-cta">
            <button class="btn btn-primary btn-drill" onclick="Progression.drillInRandomPicker()">
              <span class="btn-icon">🎲</span>
              <span>Drill in Random Picker / تدريب عشوائي</span>
            </button>
          </div>
        </div>

        <!-- Metric Stat Cards -->
        <div class="progression-metrics-grid">
          <div class="metric-card total-metric">
            <div class="metric-icon">📚</div>
            <div class="metric-data">
              <span class="metric-number">${learnedCount} <small>/ ${totalVocabCount}</small></span>
              <span class="metric-label">Mastered Words / كلمات متقنة (${pctTotal}%)</span>
            </div>
            <div class="metric-progress-bar">
              <div class="metric-progress-fill" style="width: ${pctTotal}%"></div>
            </div>
          </div>

          <div class="metric-card b2-metric">
            <div class="metric-icon">⭐</div>
            <div class="metric-data">
              <span class="metric-number">${b2Count}</span>
              <span class="metric-label">B2 Advanced / متقدم</span>
            </div>
            <span class="metric-sublabel">${(allVocab.filter(w => w.level === 'B2').length)} total B2</span>
          </div>

          <div class="metric-card b1-metric">
            <div class="metric-icon">🔷</div>
            <div class="metric-data">
              <span class="metric-number">${b1Count}</span>
              <span class="metric-label">B1 Intermediate / متوسط</span>
            </div>
            <span class="metric-sublabel">${(allVocab.filter(w => w.level === 'B1').length)} total B1</span>
          </div>

          <div class="metric-card a1-metric">
            <div class="metric-icon">🟢</div>
            <div class="metric-data">
              <span class="metric-number">${a1Count}</span>
              <span class="metric-label">A1-A2 Foundation / تأسيسي</span>
            </div>
            <span class="metric-sublabel">${(allVocab.filter(w => w.level === 'A1' || w.level === 'A2').length)} total A1/A2</span>
          </div>
        </div>

        <!-- Word Entry Section: Search & Dropdown Combobox -->
        <div class="progression-card word-input-card">
          <div class="card-header-row">
            <div>
              <h3 class="card-title">➕ Add Learned Words / إضافة كلمات أتقنتها</h3>
              <p class="card-subtitle">
                Search and choose any word from the 1,090+ vocabulary list to mark it as learned.
                <span class="arabic-text" dir="rtl">ابحث عن أي كلمة ألمانية أو عربية واخترها من القائمة لحفظها ككلمة متقنة:</span>
              </p>
            </div>
            
            <button class="btn btn-outline btn-sm" onclick="Progression.toggleBrowseSection()">
              ${this.showBrowseSection ? '▲ Hide Topic Browser' : '▼ Browse by Topic / استعراض بالفئات'}
            </button>
          </div>

          <!-- Searchable Combobox Input -->
          <div class="combobox-wrapper">
            <div class="combobox-input-box">
              <span class="search-icon">🔍</span>
              <input 
                type="text" 
                id="progression-combobox-input" 
                class="combobox-input"
                placeholder="Type German or Arabic word... e.g. Herausforderung, قرار, Wasser, Umwelt" 
                value="${this.searchQuery}"
                autocomplete="off"
                oninput="Progression.handleSearchInput(this.value)"
                onfocus="Progression.handleSearchInput(this.value)"
                onkeydown="Progression.handleComboboxKeydown(event)"
              />
              ${this.searchQuery ? `
                <button class="clear-search-btn" onclick="Progression.clearSearch()" title="Clear">✕</button>
              ` : ''}
            </div>

            <!-- Autocomplete Dropdown List -->
            <div id="combobox-dropdown" class="combobox-dropdown ${this.searchQuery ? 'show' : ''}">
              ${this.renderDropdownResults()}
            </div>
          </div>

          <!-- Quick Topic Browser Drawer (Expandable) -->
          ${this.showBrowseSection ? this.renderBrowseSection(categories, allVocab, learnedMap) : ''}
        </div>

        <!-- Learned Words Library -->
        <div class="progression-card library-card">
          <div class="library-header">
            <div class="library-title-area">
              <h3 class="card-title">📖 My Mastered Vocabulary Library (${filteredLearned.length})</h3>
              <span class="card-subtitle arabic-text" dir="rtl">مكتبة مفرداتي المتقنة — قابلة للبحث والفلترة والمراجعة</span>
            </div>

            <!-- Library Search & Filter Bar -->
            <div class="library-toolbar">
              <!-- Filter by Level -->
              <div class="filter-group">
                <span class="filter-label">Level:</span>
                <select class="picker-select" onchange="Progression.setLevelFilter(this.value)">
                  <option value="all" ${this.selectedLevelFilter === 'all' ? 'selected' : ''}>All Levels</option>
                  <option value="B2" ${this.selectedLevelFilter === 'B2' ? 'selected' : ''}>⭐ B2</option>
                  <option value="B1" ${this.selectedLevelFilter === 'B1' ? 'selected' : ''}>🔷 B1</option>
                  <option value="A1" ${this.selectedLevelFilter === 'A1' ? 'selected' : ''}>🟢 A1-A2</option>
                </select>
              </div>

              <!-- Filter by Category -->
              <div class="filter-group">
                <span class="filter-label">Category:</span>
                <select class="picker-select" onchange="Progression.setCategoryFilter(this.value)">
                  <option value="all" ${this.selectedCategoryFilter === 'all' ? 'selected' : ''}>All Categories</option>
                  ${categories.map(c => `
                    <option value="${c.id}" ${this.selectedCategoryFilter === c.id ? 'selected' : ''}>
                      ${c.icon} ${c.name}
                    </option>
                  `).join('')}
                </select>
              </div>

              <!-- Sort By -->
              <div class="filter-group">
                <span class="filter-label">Sort:</span>
                <select class="picker-select" onchange="Progression.setSortBy(this.value)">
                  <option value="date-desc" ${this.sortBy === 'date-desc' ? 'selected' : ''}>Newest Added</option>
                  <option value="date-asc" ${this.sortBy === 'date-asc' ? 'selected' : ''}>Oldest</option>
                  <option value="alpha-asc" ${this.sortBy === 'alpha-asc' ? 'selected' : ''}>Alphabetical (A-Z)</option>
                  <option value="level" ${this.sortBy === 'level' ? 'selected' : ''}>By Level (B2➔A1)</option>
                </select>
              </div>

              <!-- Search inside library -->
              <div class="library-search-box">
                <input 
                  type="text" 
                  class="library-search-input" 
                  placeholder="Filter learned list..." 
                  value="${this.librarySearch}"
                  oninput="Progression.handleLibrarySearch(this.value)"
                />
              </div>
            </div>
          </div>

          <!-- Words Grid / Empty State -->
          ${filteredLearned.length > 0 ? `
            <div class="learned-words-grid">
              ${filteredLearned.map(w => this.renderLearnedWordCard(w, learnedMap[w.id])).join('')}
            </div>
          ` : `
            <div class="progression-empty-state">
              ${learnedCount === 0 ? `
                <div class="empty-icon-lg">🌱</div>
                <h3>Your Learned List is Empty / قائمتك فارغة حالياً</h3>
                <p>Start building your mastered vocabulary library! Use the search box above to find and add words you know, or browse topics.</p>
                <p class="arabic-text" dir="rtl">ابدأ ببناء مكتبتك للكلمات الألمانية المتقنة. استخدم مربع البحث بالأعلى لإيجاد أي كلمة وحفظها، أو تصفح الأقسام.</p>
                <div class="quick-add-suggestions">
                  <span class="suggestion-label">Quick Suggestions:</span>
                  <button class="pill-btn active" onclick="Progression.quickAddCommonA1()">+ Add Common A1 Words (10 words)</button>
                  <button class="pill-btn active" onclick="Progression.quickAddCollocations()">+ Add Key B2 Collocations (10 words)</button>
                </div>
              ` : `
                <div class="empty-icon-lg">🔍</div>
                <h3>No words match your filters</h3>
                <p class="arabic-text" dir="rtl">لا توجد كلمات مطابقة للبحث أو الفلتر المختار.</p>
                <button class="btn btn-secondary btn-sm" onclick="Progression.resetFilters()">Reset Filters / إعادة ضبط الفلاتر</button>
              `}
            </div>
          `}
        </div>
      </div>
    `;

    // Re-attach outside click listener to close dropdown
    this.attachOutsideClickListener();
  },

  // Render Combobox Dropdown Results
  renderDropdownResults() {
    if (!this.searchQuery || this.searchQuery.trim().length === 0) {
      // Show top recommended or popular words
      const allVocab = window.Vocabulary || [];
      const sample = allVocab.slice(0, 10);
      return `
        <div class="dropdown-header">
          <span>Type to search all 1,090+ words, or select from examples:</span>
        </div>
        <div class="dropdown-items-list">
          ${sample.map((w, idx) => this.renderDropdownItem(w, idx)).join('')}
        </div>
      `;
    }

    const q = this.cleanStr(this.searchQuery);
    const allVocab = window.Vocabulary || [];
    
    // Filter matches
    const matches = allVocab.filter(w => {
      return this.cleanStr(w.german).includes(q) ||
             this.cleanStr(w.arabic).includes(q) ||
             (w.plural && this.cleanStr(w.plural).includes(q)) ||
             (w.tags && w.tags.some(t => this.cleanStr(t).includes(q)));
    }).slice(0, 20); // Top 20 matches

    this.currentMatches = matches;

    if (matches.length === 0) {
      return `
        <div class="dropdown-empty">
          <span>No words found matching "<strong>${this.escapeHtml(this.searchQuery)}</strong>"</span>
          <span class="arabic-text" dir="rtl">لم يتم العثور على نتائج مطابقة</span>
        </div>
      `;
    }

    return `
      <div class="dropdown-header">
        <span>Found ${matches.length} matching words (click to add/toggle):</span>
      </div>
      <div class="dropdown-items-list">
        ${matches.map((w, idx) => this.renderDropdownItem(w, idx)).join('')}
      </div>
    `;
  },

  // Single Dropdown Item Row
  renderDropdownItem(word, index) {
    const isLearned = window.Storage ? window.Storage.isWordLearned(word.id) : false;
    let genderClass = '';
    if (word.gender === 'masculine' || word.article === 'der') genderClass = 'gender-masc';
    else if (word.gender === 'feminine' || word.article === 'die') genderClass = 'gender-fem';
    else if (word.gender === 'neuter' || word.article === 'das') genderClass = 'gender-neut';

    const levelBadgeClass = word.level === 'B2' ? 'badge-b2' : word.level === 'B1' ? 'badge-b1' : 'badge-a1';
    const isSelected = index === this.dropdownActiveIndex;

    return `
      <div 
        class="dropdown-item ${isSelected ? 'selected' : ''} ${isLearned ? 'is-learned' : ''}"
        onclick="Progression.toggleWordFromSearch('${word.id}')"
        data-index="${index}"
      >
        <div class="item-main">
          <div class="item-german-row">
            ${word.article ? `<span class="word-article ${genderClass}">${word.article}</span>` : ''}
            <span class="word-german ${genderClass}">${word.german}</span>
            ${word.plural ? `<span class="word-plural">, die ${word.plural}</span>` : ''}
          </div>
          <div class="item-arabic-row arabic-text" dir="rtl">
            ${word.arabic}
          </div>
        </div>

        <div class="item-meta">
          <span class="badge ${levelBadgeClass}">${word.level || 'A1'}</span>
          <span class="item-category-tag">${word.category}</span>
          <button class="item-action-btn ${isLearned ? 'btn-remove' : 'btn-add'}" onclick="event.stopPropagation(); Progression.toggleWordFromSearch('${word.id}')">
            ${isLearned ? '✓ Learned' : '+ Add'}
          </button>
        </div>
      </div>
    `;
  },

  // Render Topic Browser Drawer
  renderBrowseSection(categories, allVocab, learnedMap) {
    const selectedCat = categories.find(c => c.id === this.browseCategory) || categories[0];
    let catWords = allVocab.filter(w => w.category === selectedCat.id);

    if (this.browseLevel !== 'all') {
      if (this.browseLevel === 'A1') {
        catWords = catWords.filter(w => w.level === 'A1' || w.level === 'A2');
      } else {
        catWords = catWords.filter(w => w.level === this.browseLevel);
      }
    }

    const learnedInCat = catWords.filter(w => learnedMap[w.id]).length;

    return `
      <div class="browse-drawer animate-fade-in">
        <div class="browse-toolbar">
          <div class="filter-group">
            <span class="filter-label">Select Topic / الفئة:</span>
            <select class="picker-select" onchange="Progression.setBrowseCategory(this.value)">
              ${categories.map(c => `
                <option value="${c.id}" ${this.browseCategory === c.id ? 'selected' : ''}>
                  ${c.icon} ${c.name} (${c.nameAr})
                </option>
              `).join('')}
            </select>
          </div>

          <div class="filter-group">
            <span class="filter-label">Level / المستوى:</span>
            <select class="picker-select" onchange="Progression.setBrowseLevel(this.value)">
              <option value="all" ${this.browseLevel === 'all' ? 'selected' : ''}>All Levels</option>
              <option value="B2" ${this.browseLevel === 'B2' ? 'selected' : ''}>⭐ B2</option>
              <option value="B1" ${this.browseLevel === 'B1' ? 'selected' : ''}>🔷 B1</option>
              <option value="A1" ${this.browseLevel === 'A1' ? 'selected' : ''}>🟢 A1-A2</option>
            </select>
          </div>

          <button class="btn btn-secondary btn-sm" onclick="Progression.addAllInCurrentBrowseCategory()">
            ✓ Add All in this Category (${catWords.length} words)
          </button>
        </div>

        <div class="browse-stats-row">
          <span>Showing <strong>${catWords.length}</strong> words in <em>${selectedCat.name}</em> (Learned: <strong>${learnedInCat}/${catWords.length}</strong>)</span>
        </div>

        <div class="browse-chips-grid">
          ${catWords.map(w => {
            const isLearned = Boolean(learnedMap[w.id]);
            let genderClass = '';
            if (w.gender === 'masculine' || w.article === 'der') genderClass = 'gender-masc';
            else if (w.gender === 'feminine' || w.article === 'die') genderClass = 'gender-fem';
            else if (w.gender === 'neuter' || w.article === 'das') genderClass = 'gender-neut';

            return `
              <div 
                class="word-chip ${isLearned ? 'chip-learned' : ''}" 
                onclick="Progression.toggleWordChip('${w.id}')"
                title="${w.arabic}"
              >
                <span class="chip-status">${isLearned ? '✓' : '+'}</span>
                <span class="chip-text ${genderClass}">
                  ${w.article ? `${w.article} ` : ''}${w.german}
                </span>
                <span class="chip-arabic arabic-text" dir="rtl">${w.arabic}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  // Render Single Learned Word Card in Library
  renderLearnedWordCard(word, meta) {
    let genderClass = '';
    if (word.gender === 'masculine' || word.article === 'der') genderClass = 'gender-masc';
    else if (word.gender === 'feminine' || word.article === 'die') genderClass = 'gender-fem';
    else if (word.gender === 'neuter' || word.article === 'das') genderClass = 'gender-neut';

    const levelBadgeClass = word.level === 'B2' ? 'badge-b2' : word.level === 'B1' ? 'badge-b1' : 'badge-a1';
    const wordToSpeak = (word.article ? `${word.article} ` : '') + word.german;
    const addedTimeStr = meta?.learnedAt ? this.formatDate(meta.learnedAt) : 'Saved';

    return `
      <div class="learned-card animate-fade-in" id="card-${word.id}">
        <div class="card-top-row">
          <div class="badge-row">
            <span class="badge ${levelBadgeClass}">${word.level || 'A1'}</span>
            <span class="category-pill">${word.category}</span>
          </div>

          <div class="card-actions">
            <button class="tts-btn-icon" onclick="window.Pronunciation && window.Pronunciation.speak('${this.escapeHtml(wordToSpeak)}')" title="Listen / استمع">
              🔊
            </button>
            <button class="remove-btn-icon" onclick="Progression.removeWord('${word.id}')" title="Remove from learned list / إزالة من المتقنة">
              🗑️
            </button>
          </div>
        </div>

        <div class="card-german-block">
          ${word.article ? `<span class="article-tag ${genderClass}">${word.article}</span>` : ''}
          <h4 class="card-german-text ${genderClass}">${word.german}</h4>
          ${word.plural ? `<span class="card-plural">Pl: die ${word.plural}</span>` : ''}
        </div>

        <div class="card-arabic-block arabic-text" dir="rtl">
          ${word.arabic}
        </div>

        ${word.tags && word.tags.length > 0 ? `
          <div class="card-tags-row">
            ${word.tags.slice(0, 3).map(t => `<span class="mini-tag">${t}</span>`).join('')}
          </div>
        ` : ''}

        <div class="card-footer-info">
          <span class="added-date">🕒 ${addedTimeStr}</span>
          <span class="status-indicator">✓ Mastered</span>
        </div>
      </div>
    `;
  },

  // Handlers & Actions
  handleSearchInput(val) {
    this.searchQuery = val;
    this.dropdownActiveIndex = -1;
    const dropdown = document.getElementById('combobox-dropdown');
    if (!dropdown) return;

    dropdown.innerHTML = this.renderDropdownResults();
    dropdown.classList.add('show');
  },

  clearSearch() {
    this.searchQuery = '';
    const input = document.getElementById('progression-combobox-input');
    if (input) {
      input.value = '';
      input.focus();
    }
    const dropdown = document.getElementById('combobox-dropdown');
    if (dropdown) dropdown.classList.remove('show');
  },

  handleComboboxKeydown(e) {
    const dropdown = document.getElementById('combobox-dropdown');
    if (!dropdown || !dropdown.classList.contains('show')) return;

    const items = dropdown.querySelectorAll('.dropdown-item');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.dropdownActiveIndex = (this.dropdownActiveIndex + 1) % items.length;
      this.updateDropdownActive(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.dropdownActiveIndex = (this.dropdownActiveIndex - 1 + items.length) % items.length;
      this.updateDropdownActive(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (this.dropdownActiveIndex >= 0 && items[this.dropdownActiveIndex]) {
        items[this.dropdownActiveIndex].click();
      } else if (this.currentMatches && this.currentMatches.length > 0) {
        this.toggleWordFromSearch(this.currentMatches[0].id);
      }
    } else if (e.key === 'Escape') {
      dropdown.classList.remove('show');
    }
  },

  updateDropdownActive(items) {
    items.forEach((item, idx) => {
      if (idx === this.dropdownActiveIndex) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('selected');
      }
    });
  },

  toggleWordFromSearch(wordId) {
    if (!wordId || !window.Storage) return;
    const word = (window.Vocabulary || []).find(w => w.id === wordId);
    const isNowLearned = window.Storage.toggleLearnedWord(wordId);

    if (window.UI) {
      if (isNowLearned) {
        window.UI.showToast(`✓ Added "${word ? word.german : ''}" to Mastered Words! / تمت الإضافة بنجاح!`, 'success');
      } else {
        window.UI.showToast(`Removed "${word ? word.german : ''}" from Mastered Words. / تمت الإزالة من القائمة.`, 'info');
      }
    }

    // Re-render dropdown item state & library
    this.render();

    // Re-focus input for next word
    setTimeout(() => {
      const input = document.getElementById('progression-combobox-input');
      if (input) {
        input.focus();
        input.select();
      }
    }, 50);
  },

  toggleWordChip(wordId) {
    if (!wordId || !window.Storage) return;
    window.Storage.toggleLearnedWord(wordId);
    this.render();
  },

  removeWord(wordId) {
    if (!wordId || !window.Storage) return;
    const word = (window.Vocabulary || []).find(w => w.id === wordId);
    window.Storage.removeLearnedWord(wordId);
    
    if (window.UI) {
      window.UI.showToast(`Removed "${word ? word.german : ''}" / تمت الإزالة`, 'info');
    }
    this.render();
  },

  toggleBrowseSection() {
    this.showBrowseSection = !this.showBrowseSection;
    this.render();
  },

  setBrowseCategory(catId) {
    this.browseCategory = catId;
    this.render();
  },

  setBrowseLevel(lvl) {
    this.browseLevel = lvl;
    this.render();
  },

  addAllInCurrentBrowseCategory() {
    const allVocab = window.Vocabulary || [];
    let catWords = allVocab.filter(w => w.category === this.browseCategory);
    if (this.browseLevel !== 'all') {
      if (this.browseLevel === 'A1') {
        catWords = catWords.filter(w => w.level === 'A1' || w.level === 'A2');
      } else {
        catWords = catWords.filter(w => w.level === this.browseLevel);
      }
    }

    if (!catWords.length) return;

    const ids = catWords.map(w => w.id);
    const added = window.Storage ? window.Storage.addMultipleLearnedWords(ids) : 0;
    if (window.UI) {
      window.UI.showToast(`Added ${added} words to your Mastered list! / تمت إضافة ${added} كلمة!`, 'success');
    }
    this.render();
  },

  quickAddCommonA1() {
    const allVocab = window.Vocabulary || [];
    const a1Words = allVocab.filter(w => w.level === 'A1').slice(0, 10);
    const ids = a1Words.map(w => w.id);
    const added = window.Storage ? window.Storage.addMultipleLearnedWords(ids) : 0;
    if (window.UI) {
      window.UI.showToast(`Added ${added} common A1 words! / تمت إضافة 10 كلمات أساسية!`, 'success');
    }
    this.render();
  },

  quickAddCollocations() {
    const allVocab = window.Vocabulary || [];
    const b2Collocs = allVocab.filter(w => w.tags && w.tags.includes('nomen-verb-verbindung')).slice(0, 10);
    const ids = b2Collocs.map(w => w.id);
    const added = window.Storage ? window.Storage.addMultipleLearnedWords(ids) : 0;
    if (window.UI) {
      window.UI.showToast(`Added ${added} key B2 collocations! / تمت إضافة 10 متلازمات B2!`, 'success');
    }
    this.render();
  },

  drillInRandomPicker() {
    const learnedIds = window.Storage ? window.Storage.getLearnedWordIds() : [];
    if (learnedIds.length === 0) {
      if (window.UI) {
        window.UI.showToast('Please add some words first! / يرجى إضافة بعض الكلمات أولاً!', 'warning');
      }
      return;
    }

    // Set RandomPicker to learned mode and navigate
    if (window.RandomPicker) {
      window.RandomPicker.onlyLearned = true;
    }
    window.location.hash = 'random';
  },

  setLevelFilter(lvl) {
    this.selectedLevelFilter = lvl;
    this.render();
  },

  setCategoryFilter(catId) {
    this.selectedCategoryFilter = catId;
    this.render();
  },

  setSortBy(sort) {
    this.sortBy = sort;
    this.render();
  },

  handleLibrarySearch(val) {
    this.librarySearch = val;
    this.render();
  },

  resetFilters() {
    this.selectedLevelFilter = 'all';
    this.selectedCategoryFilter = 'all';
    this.librarySearch = '';
    this.render();
  },

  attachOutsideClickListener() {
    if (typeof setTimeout === 'undefined') return;
    setTimeout(() => {
      if (typeof document === 'undefined') return;
      document.removeEventListener('click', this._onDocClick);
      this._onDocClick = (e) => {
        const combobox = document.querySelector('.combobox-wrapper');
        const dropdown = document.getElementById('combobox-dropdown');
        if (combobox && !combobox.contains(e.target) && dropdown) {
          dropdown.classList.remove('show');
        }
      };
      document.addEventListener('click', this._onDocClick);
    }, 100);
  },

  cleanStr(s) {
    if (!s) return '';
    return String(s).toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .replace(/[\u064B-\u065F\u0670]/g, '') // remove arabic tashkeel
      .replace(/[أإآء]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .trim();
  },

  formatDate(isoStr) {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return 'Recent';
    }
  },

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};
