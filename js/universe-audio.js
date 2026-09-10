/**
 * universe-audio.js - Futuristic Spatial Audio Synthesizer
 * Uses native Web Audio API for zero-dependency, ultra-lightweight sci-fi sound design.
 */

(function () {
  'use strict';

  let audioCtx = null;
  let isMuted = localStorage.getItem('hg_universe_audio') === 'true' ? false : true; // Default subtle mute for polite UX
  let ambientOsc = null;
  let ambientGain = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  const SoundEngine = {
    isMuted: () => isMuted,

    toggleMute: function () {
      isMuted = !isMuted;
      localStorage.setItem('hg_universe_audio', isMuted ? 'false' : 'true');
      if (!isMuted) {
        initAudio();
        this.playBeep(880, 0.08);
        this.startAmbient();
      } else {
        this.stopAmbient();
      }
      return !isMuted;
    },

    setMute: function (mute) {
      isMuted = !!mute;
      localStorage.setItem('hg_universe_audio', isMuted ? 'false' : 'true');
      if (isMuted) {
        this.stopAmbient();
      } else {
        initAudio();
        this.startAmbient();
      }
    },

    // Subtle holographic click/hover chirp
    playBeep: function (freq = 900, duration = 0.05, type = 'sine') {
      if (isMuted) return;
      initAudio();
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + duration);

        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) { }
    },

    // Spatial warp / portal camera fly whoosh
    playWhoosh: function () {
      if (isMuted) return;
      initAudio();
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(540, audioCtx.currentTime + 0.35);
        osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.7);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, audioCtx.currentTime);
        filter.frequency.linearRampToValueAtTime(1200, audioCtx.currentTime + 0.35);
        filter.frequency.linearRampToValueAtTime(300, audioCtx.currentTime + 0.7);

        gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.75);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.8);
      } catch (e) { }
    },

    // AI Core energy pulse / reaction
    playPulse: function () {
      if (isMuted) return;
      initAudio();
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.15);
        osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.4);

        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.45);
      } catch (e) { }
    },

    // Success chime / AI message received
    playChime: function () {
      if (isMuted) return;
      initAudio();
      if (!audioCtx) return;
      try {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const startTime = audioCtx.currentTime + idx * 0.08;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.035, startTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start(startTime);
          osc.stop(startTime + 0.4);
        });
      } catch (e) { }
    },

    // Cinematic Intro startup swell
    playIntroSwell: function () {
      if (isMuted) return;
      initAudio();
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(55, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 2.0);

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(150, audioCtx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(2000, audioCtx.currentTime + 2.0);

        gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.07, audioCtx.currentTime + 1.6);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 2.5);
      } catch (e) { }
    },

    // Ambient deep-space sub-bass drone
    startAmbient: function () {
      if (isMuted || ambientOsc || !audioCtx) return;
      try {
        ambientOsc = audioCtx.createOscillator();
        ambientGain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        ambientOsc.type = 'sine';
        ambientOsc.frequency.setValueAtTime(55, audioCtx.currentTime); // A1 note

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(120, audioCtx.currentTime);

        ambientGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        ambientGain.gain.linearRampToValueAtTime(0.012, audioCtx.currentTime + 2);

        ambientOsc.connect(filter);
        filter.connect(ambientGain);
        ambientGain.connect(audioCtx.destination);

        ambientOsc.start();
      } catch (e) { }
    },

    stopAmbient: function () {
      if (ambientOsc && ambientGain && audioCtx) {
        try {
          ambientGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
          setTimeout(() => {
            if (ambientOsc) {
              try { ambientOsc.stop(); } catch (e) { }
              ambientOsc = null;
              ambientGain = null;
            }
          }, 600);
        } catch (e) {
          ambientOsc = null;
          ambientGain = null;
        }
      }
    }
  };

  window.UniverseSound = SoundEngine;
})();
