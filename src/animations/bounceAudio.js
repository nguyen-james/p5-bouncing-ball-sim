const BOUNCE_SOUND_PATHS = ["/bounce-1.wav", "/bounce-2.wav", "/bounce-3.wav"];
const DEFAULT_VOLUME = 0.35;
let isMuted = false;

let clipCache = null;
const activeSounds = new Set();

function getClips() {
  if (clipCache) return clipCache;
  if (typeof Audio === "undefined") return [];

  clipCache = BOUNCE_SOUND_PATHS.map((path) => {
    const clip = new Audio(path);
    clip.preload = "auto";
    return clip;
  });

  return clipCache;
}

export function initBounceAudio() {
  getClips();
}

export function playBounceSound() {
  if (isMuted) return;
  const clips = getClips();
  if (!clips.length) return;

  const template = clips[Math.floor(Math.random() * clips.length)];
  const sound = template.cloneNode();
  sound.volume = DEFAULT_VOLUME;
  sound.currentTime = 0;

  activeSounds.add(sound);

  const cleanup = () => {
    activeSounds.delete(sound);
  };

  sound.addEventListener("ended", cleanup, { once: true });
  sound.addEventListener("error", cleanup, { once: true });

  const playResult = sound.play();
  if (playResult && typeof playResult.catch === "function") {
    playResult.catch(cleanup);
  }
}

export function setBounceAudioMuted(nextMuted) {
  isMuted = Boolean(nextMuted);
}
