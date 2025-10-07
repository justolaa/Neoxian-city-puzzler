// src/audioManager.js

let isMuted = false;

export const toggleMute = () => {
  isMuted = !isMuted;
  backgroundMusic.muted = isMuted;
  // We can't globally mute one-shot sounds, so we'll check this flag before playing.
  return isMuted;
};

// Update playSound to respect the mute status
const playSound = (src) => {
  if (isMuted) return; // Don't play if muted
  try {
    const sound = new Audio(src);
    sound.play();
  } catch (e) {
    console.error("Could not play sound:", e);
  }
};

// --- Exported functions for our game to use ---

export const playHighlightSound = () => {
  playSound('/audio/tick.mp3');
};

export const playCorrectSound = () => {
  playSound('/audio/correct.mp3');
};

export const playErrorSound = () => {
  playSound('/audio/error.mp3');
};

// --- Music Player Logic ---
// We create a single audio object for music so we can control it (play/pause/loop)
export const backgroundMusic = new Audio('/audio/music.mp3');
backgroundMusic.loop = true; // Make the music loop forever
backgroundMusic.volume = 0.3; // Set a reasonable volume

export const playMusic = () => {
  // Browsers often block autoplay until the user interacts with the page.
  // We'll try to play, and catch the error if it fails silently.
  backgroundMusic.play().catch(error => console.error("Music autoplay was blocked by the browser. User must interact first.", error));
};

export const stopMusic = () => {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0; // Reset to the beginning
};

