// src/audioManager.js (Music-Only Mute Version)

// --- State Management ---
let isMusicMuted = false;

// --- Background Music Logic ---
export const backgroundMusic = new Audio('/audio/music.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;

export const playMusic = () => {
  backgroundMusic.muted = isMusicMuted;
  backgroundMusic.play().catch(error => console.error("Music autoplay was blocked.", error));
};

export const stopMusic = () => {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
};

// --- Sound Effects (SFX) Logic - ALWAYS ON ---
const playSound = (src) => {
  try {
    const sound = new Audio(src);
    sound.volume = 0.7;
    sound.play();
  } catch (e) {
    console.error("Could not play sound:", e);
  }
};

export const playHighlightSound = () => playSound('/audio/tick.mp3');
export const playCorrectSound = () => playSound('/audio/correct.mp3');
export const playErrorSound = () => playSound('/audio/error.mp3');

// --- Control Functions for the UI ---
export const toggleMusicMute = () => {
  isMusicMuted = !isMusicMuted;
  backgroundMusic.muted = isMusicMuted;
  return isMusicMuted;
};

export const getMusicMutedState = () => isMusicMuted;