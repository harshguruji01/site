class SoundService {
    constructor() {
        this.ctx = null;
        this.enabled = window.storageService ? window.storageService.data.settings.sound : true;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
    }

    playTone(frequency, type, duration) {
        if (!this.enabled || !this.ctx) return;
        
        // Resume context if suspended (browser policy)
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
        
        gainNode.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        
        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playCorrect() {
        if (!this.enabled) return;
        this.init();
        this.playTone(523.25, 'sine', 0.1); // C5
        setTimeout(() => this.playTone(659.25, 'sine', 0.2), 100); // E5
    }

    playWrong() {
        if (!this.enabled) return;
        this.init();
        this.playTone(300, 'sawtooth', 0.15);
        setTimeout(() => this.playTone(250, 'sawtooth', 0.3), 150);
    }
    
    playClick() {
        if (!this.enabled) return;
        this.init();
        this.playTone(800, 'sine', 0.05);
    }

    playLevelUp() {
        if (!this.enabled) return;
        this.init();
        this.playTone(440, 'square', 0.1);
        setTimeout(() => this.playTone(554, 'square', 0.1), 100);
        setTimeout(() => this.playTone(659, 'square', 0.1), 200);
        setTimeout(() => this.playTone(880, 'square', 0.4), 300);
    }
}

window.soundService = new SoundService();
