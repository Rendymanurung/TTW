/* Audio Module - TTW Retro Arcade
   Web Audio API Chiptune Synth + HTML5 Background Music Playlist
*/

export const PLAYLIST = [
  { id: 1, title: 'Lagu 1', src: '/audio/track1.mp3' },
  { id: 2, title: 'Lagu 2', src: '/audio/track2.mp3' },
  { id: 3, title: 'Lagu 3', src: '/audio/track3.mp3' },
  { id: 4, title: 'Lagu 4', src: '/audio/track4.mp3' },
  { id: 5, title: 'Lagu 5', src: '/audio/track5.mp3' }
];

class RetroAudio {
  constructor() {
    this.ctx = null;
    // Default selalu tidak muted saat masuk web agar lagu langsung berputar otomatis
    this.muted = false;
    try {
      localStorage.removeItem('ttw_audio_muted');
    } catch {
      // ignore
    }

    // Playlist state
    this.currentIndex = Math.floor(Math.random() * PLAYLIST.length);
    this.bgm = typeof Audio !== 'undefined' ? new Audio() : null;
    this.bgmStarted = false;
    this.failedAttempts = 0;

    if (this.bgm) {
      this.bgm.volume = 0.4;
      this.bgm.preload = 'auto';
      this.bgm.addEventListener('ended', () => {
        this.playNextTrack();
      });
      this.bgm.addEventListener('error', () => {
        this.failedAttempts = (this.failedAttempts || 0) + 1;
        if (this.failedAttempts < PLAYLIST.length) {
          this.playNextTrack();
        }
      });
      this.bgm.addEventListener('playing', () => {
        this.failedAttempts = 0;
      });
    }

    // Coba langsung mulai saat instansiasi
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        this.startBgm();
      }, 100);
    }
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  isMuted() {
    return this.muted;
  }

  getCurrentTrack() {
    return PLAYLIST[this.currentIndex];
  }

  startBgm() {
    if (this.muted || !this.bgm) return;
    this.initContext();
    this.bgmStarted = true;
    this.loadAndPlayCurrent();
  }

  loadAndPlayCurrent() {
    if (this.muted || !this.bgm) return;
    const track = PLAYLIST[this.currentIndex];
    if (!track) return;

    if (!this.bgm.src || !this.bgm.src.endsWith(track.src)) {
      this.bgm.src = track.src;
      this.bgm.load();
    }

    const playPromise = this.bgm.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay dicegah browser sebelum user berinteraksi
      });
    }
  }

  playNextTrack() {
    this.currentIndex = (this.currentIndex + 1) % PLAYLIST.length;
    if (this.bgm) {
      const track = PLAYLIST[this.currentIndex];
      if (track) {
        this.bgm.src = track.src;
        this.bgm.load();
        const playPromise = this.bgm.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      }
    }
  }

  toggleMute() {
    this.muted = !this.muted;

    if (this.muted) {
      if (this.bgm) this.bgm.pause();
    } else {
      this.startBgm();
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ttw-audio-mute-changed', { detail: this.muted }));
    }

    return this.muted;
  }

  playTone(freq, type = 'square', duration = 0.1, gainVal = 0.1) {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio fallback jika diblokir browser
    }
  }

  // Efek tombol retro
  playClick() {
    this.playTone(440, 'triangle', 0.05, 0.08);
  }

  // Efek masukkan koin (arcade coin insert chime)
  playCoin() {
    if (this.muted) return;
    this.playTone(987.77, 'square', 0.08, 0.12);
    setTimeout(() => {
      this.playTone(1318.51, 'square', 0.25, 0.15);
    }, 80);
  }

  // Efek putaran reel slot
  playSpinTick() {
    this.playTone(220, 'square', 0.03, 0.05);
  }

  // Efek menang (Stage Clear fanfare)
  playWin() {
    if (this.muted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'square', 0.18, 0.15);
      }, idx * 100);
    });
  }

  // Efek bagi kartu blackjack
  playCard() {
    this.playTone(330, 'triangle', 0.05, 0.08);
  }

  // Efek kekalahan / error
  playBuzzer() {
    if (this.muted) return;
    this.playTone(150, 'sawtooth', 0.25, 0.12);
  }
}

export const sound = new RetroAudio();
if (typeof window !== 'undefined') {
  window.__sound = sound;
}
