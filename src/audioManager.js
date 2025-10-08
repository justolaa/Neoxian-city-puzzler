// src/audioManager.js (With Hardcoded Volume Controls)

// --- 1. Preload all sound effects and set their individual volumes ---
const sfx = {
  tick: new Audio('/audio/tick.mp3'),
  correct: new Audio('/audio/correct.mp3'),
  error: new Audio('/audio/error.mp3')
};

// --- SET SFX VOLUMES HERE ---
// (0.0 = silent, 1.0 = full volume)
sfx.tick.volume = 0.5;      // A quiet, subtle tick (50%)
sfx.correct.volume = 0.7;   // A satisfying, noticeable success sound (70%)
sfx.error.volume = 0.7;     // An equally noticeable error sound (70%)


// --- State Management for Music ---
let isMusicMuted = false;

// --- Background Music Logic ---
export const backgroundMusic = new Audio('/audio/music.mp3');
backgroundMusic.loop = true;

// --- SET MUSIC VOLUME HERE ---
backgroundMusic.volume = 0.2; // Keep background music quiet (20%)


export const playMusic = () => {
  backgroundMusic.muted = isMusicMuted;
  backgroundMusic.play().catch(error => console.error("Music autoplay was blocked.", error));
};

export const stopMusic = () => {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
};


// --- Sound Effects (SFX) Logic (no changes needed here) ---
const playSound = (soundObject) => {
  soundObject.currentTime = 0;
  soundObject.play();
};

export const playHighlightSound = () => playSound(sfx.tick);
export const playCorrectSound = () => playSound(sfx.correct);
export const playErrorSound = () => playSound(sfx.error);


// --- Control Functions for the UI (no changes needed here) ---
export const toggleMusicMute = () => {
  isMusicMuted = !isMusicMuted;
  backgroundMusic.muted = isMusicMuted;
  return isMusicMuted;
};

export const getMusicMutedState = () => isMusicMuted;