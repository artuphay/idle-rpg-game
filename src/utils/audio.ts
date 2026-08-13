export const playPosBellSound = () => {
  try {
    const audio = new Audio('/pospay-bell.mp3');
    audio.volume = 0.6;
    audio.play().catch((err) => {
      // Menangani aturan autoplay browser
      console.log('Audio dimainkan setelah interaksi pertama:', err);
    });
  } catch (e) {
    console.error('Error memutar audio:', e);
  }
};