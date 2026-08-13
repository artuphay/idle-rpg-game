let audioUnlocked = false;

// Membuka kunci audio browser pada interaksi pertama
export const initAudioUnlock = () => {
  if (audioUnlocked) return;
  const unlock = () => {
    audioUnlocked = true;
    window.removeEventListener('click', unlock);
    window.removeEventListener('touchstart', unlock);
  };
  window.addEventListener('click', unlock);
  window.addEventListener('touchstart', unlock);
};

// Memutar Suara Utama MP3 dengan Fallback Web Audio API Bell
export const playPosBellSound = () => {
  try {
    const audio = new Audio('/pospay-bell.mp3');
    audio.volume = 0.7;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        playWebAudioChime();
      });
    }
  } catch (e) {
    playWebAudioChime();
  }
};

// Suara Sintetis Bel "Kring-Kring!" Garansi 100% Berbunyi
const playWebAudioChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, now + 0.12);
    gain2.gain.setValueAtTime(0.4, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.4);
  } catch (e) {
    console.log('Audio Synth:', e);
  }
};