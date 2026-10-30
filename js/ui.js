window.UI = {
  // Navigation
  navigateTo(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
      if (screen.id === screenId) {
        screen.classList.add('active');
        screen.style.display = 'block';
      } else {
        screen.classList.remove('active');
        screen.style.display = 'none';
      }
    });
    
    // Update nav active state
    const navLinks = document.querySelectorAll('.nav-link, .nav-item');
    navLinks.forEach(link => {
      const target = link.dataset.target;
      const href = link.getAttribute('href');
      if (
        target === screenId || href === `#${screenId}` ||
        (screenId === 'flashcard-screen' && target === 'review') ||
        (screenId === 'category-detail' && target === 'learn') ||
        (screenId === 'grammar-detail' && target === 'grammar') ||
        ((screenId === 'exercise-menu-screen' || screenId === 'exercise-screen') && target === 'practice')
      ) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Scroll container to top
    const mainContent = document.querySelector('.main-content');
    if (mainContent) mainContent.scrollTop = 0;
  },
  
  // Toast notifications
  showToast(message, type = 'info', duration = 3000) {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = this.createElement('div', 'toast-container', '');
      toastContainer.id = 'toast-container';
      document.body.appendChild(toastContainer);
    }
    
    const toast = this.createElement('div', `toast toast-${type}`, message);
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        if (toastContainer.contains(toast)) {
          toastContainer.removeChild(toast);
        }
      }, 300);
    }, duration);
  },
  
  // Modal
  showModal(content, options = {}) {
    this.closeModal(); // Close any existing modal
    
    const { title = '', onConfirm = null, onCancel = null, confirmText = 'OK', cancelText = 'Cancel' } = options;
    
    const modalOverlay = this.createElement('div', 'modal-overlay', '');
    modalOverlay.id = 'active-modal';
    
    const modalContent = this.createElement('div', 'modal-content', '');
    
    if (title) {
      const modalHeader = this.createElement('div', 'modal-header', `<h3>${title}</h3>`);
      modalContent.appendChild(modalHeader);
    }
    
    const modalBody = this.createElement('div', 'modal-body', '');
    if (typeof content === 'string') {
      modalBody.innerHTML = content;
    } else {
      modalBody.appendChild(content);
    }
    modalContent.appendChild(modalBody);
    
    const modalFooter = this.createElement('div', 'modal-footer', '');
    
    if (onCancel) {
      const cancelBtn = this.createElement('button', 'btn btn-secondary', cancelText);
      cancelBtn.onclick = () => {
        onCancel();
        this.closeModal();
      };
      modalFooter.appendChild(cancelBtn);
    } else {
      // Default close button
      const closeBtn = this.createElement('button', 'btn btn-secondary', 'Close');
      closeBtn.onclick = () => this.closeModal();
      modalFooter.appendChild(closeBtn);
    }
    
    if (onConfirm) {
      const confirmBtn = this.createElement('button', 'btn btn-primary', confirmText);
      confirmBtn.onclick = () => {
        onConfirm();
        this.closeModal();
      };
      modalFooter.appendChild(confirmBtn);
    }
    
    modalContent.appendChild(modalFooter);
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // Close on overlay click
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        if (onCancel) onCancel();
        this.closeModal();
      }
    });
  },
  
  closeModal() {
    const modal = document.getElementById('active-modal');
    if (modal) {
      document.body.removeChild(modal);
    }
  },
  
  // Confirmation dialog
  confirm(message, onConfirm) {
    this.showModal(message, {
      title: 'Confirm / تأكيد',
      onConfirm: onConfirm,
      onCancel: () => {},
      confirmText: 'Yes / نعم',
      cancelText: 'No / لا'
    });
  },
  
  // Create element helper
  createElement(tag, className = '', innerHTML = '') {
    const el = document.createElement(tag);
    if (className) {
      el.className = className;
    }
    if (innerHTML) {
      el.innerHTML = innerHTML;
    }
    return el;
  },
  
  // Format numbers with locale
  formatNumber(num) {
    return new Intl.NumberFormat('ar-EG').format(num);
  },
  
  // Relative time
  timeAgo(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now / الآن';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago / منذ ${diffInMinutes} دقائق`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago / منذ ${diffInHours} ساعات`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday / أمس';
    if (diffInDays < 30) return `${diffInDays} days ago / منذ ${diffInDays} أيام`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} months ago / منذ ${diffInMonths} أشهر`;
    
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} years ago / منذ ${diffInYears} سنوات`;
  },
  
  // Keyboard shortcuts
  initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ignore if user is typing in an input or textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }
      
      if (e.code === 'Space') {
        e.preventDefault();
        if (window.Flashcards && document.querySelector('#flashcard-screen.active')) {
          if (!window.Flashcards.isFlipped) {
            window.Flashcards.flipCard();
          }
        }
      } else if (e.code === 'Digit1' || e.code === 'Numpad1') {
        if (window.Flashcards && document.querySelector('#flashcard-screen.active') && window.Flashcards.isFlipped) {
          window.Flashcards.rateCard(1);
        }
      } else if (e.code === 'Digit2' || e.code === 'Numpad2') {
        if (window.Flashcards && document.querySelector('#flashcard-screen.active') && window.Flashcards.isFlipped) {
          window.Flashcards.rateCard(2);
        }
      } else if (e.code === 'Digit3' || e.code === 'Numpad3') {
        if (window.Flashcards && document.querySelector('#flashcard-screen.active') && window.Flashcards.isFlipped) {
          window.Flashcards.rateCard(3);
        }
      } else if (e.code === 'Digit4' || e.code === 'Numpad4') {
        if (window.Flashcards && document.querySelector('#flashcard-screen.active') && window.Flashcards.isFlipped) {
          window.Flashcards.rateCard(4);
        }
      } else if (e.code === 'ArrowRight') {
        // Next
        if (window.Exercises && document.querySelector('#exercises-screen.active')) {
           // custom logic for next exercise if applicable
        }
      } else if (e.code === 'Escape') {
        this.closeModal();
      }
    });
  },
  
  // Update the header bar title
  setHeaderTitle(title, subtitle = '') {
    const titleEl = document.getElementById('header-title');
    const subtitleEl = document.getElementById('header-subtitle');
    if (titleEl) titleEl.textContent = title;
    if (subtitleEl) {
      subtitleEl.textContent = subtitle;
      subtitleEl.style.display = subtitle ? 'block' : 'none';
    }
  },
  
  // Loading state
  showLoading(container) {
    if (!container) return;
    const loader = this.createElement('div', 'loading-spinner', '<div class="spinner"></div>');
    loader.id = 'loading-indicator';
    container.style.position = 'relative';
    container.appendChild(loader);
  },
  
  hideLoading(container) {
    if (!container) return;
    const loader = container.querySelector('#loading-indicator');
    if (loader) {
      container.removeChild(loader);
    }
  }
};
