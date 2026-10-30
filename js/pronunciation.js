window.Pronunciation = {
  synth: typeof window !== 'undefined' ? window.speechSynthesis : null,
  voice: null,
  currentUtterance: null,

  init() {
    if (!this.synth) return;

    const setVoice = () => {
      try {
        const voices = this.synth.getVoices();
        if (!voices || voices.length === 0) return;
        
        // Prefer 'de-DE' high quality voices
        this.voice = voices.find(v => v.lang === 'de-DE' && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Hedda') || v.name.includes('Anna') || v.name.includes('Stefan'))) ||
                     voices.find(v => v.lang === 'de-DE') || 
                     voices.find(v => v.lang.startsWith('de')) || null;
      } catch (e) {
        console.warn('Error loading TTS voices', e);
      }
    };

    setVoice();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = setVoice;
    }
  },

  speak(text, options = {}) {
    if (!this.synth) return;

    this.stop();

    if (!text || !text.trim()) return;

    // Handle number rate passed directly as options
    if (typeof options === 'number') {
      options = { rate: options };
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.voice) {
      utterance.voice = this.voice;
      utterance.lang = this.voice.lang || 'de-DE';
    } else {
      utterance.lang = options.lang || 'de-DE';
    }

    utterance.rate = options.rate || this.getRate();
    utterance.pitch = 1.0;

    if (options.onEnd) {
      utterance.onend = () => {
        this.currentUtterance = null;
        options.onEnd();
      };
    } else {
      utterance.onend = () => {
        this.currentUtterance = null;
      };
    }

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error', e);
      this.currentUtterance = null;
    };

    // Keep reference in active window variable to prevent Chromium GC bug
    this.currentUtterance = utterance;

    try {
      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Failed to speak text', e);
    }
  },

  speakSlow(text) {
    this.speak(text, { rate: 0.65 });
  },

  stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
    this.currentUtterance = null;
  },

  isAvailable() {
    return !!this.synth;
  },

  setRate(rate) {
    if (window.Storage) {
      window.Storage.saveSetting('speechRate', Math.max(0.5, Math.min(1.5, rate)));
    }
  },

  getRate() {
    if (window.Storage) {
      return window.Storage.getSettings().speechRate || 0.85;
    }
    return 0.85;
  }
};

// Initialize on script load
if (typeof window !== 'undefined') {
  window.Pronunciation.init();
}
