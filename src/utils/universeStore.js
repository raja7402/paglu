const KEYS = {
  UNLOCKED: 'paglu_gate_unlocked_v1',
  VISITED_PLANETS: 'paglu_visited_planets_v1',
  MYSTERY_PROGRESS: 'paglu_mystery_progress_v1',
  FINAL_UNLOCKED: 'paglu_final_unlocked_v1',
  OPENED_LETTERS: 'paglu_opened_letters_v1',
  CUSTOM_WISHES: 'paglu_custom_wishes_v1',
  QUIZ_BEST: 'paglu_quiz_best_v1',
  STARS_HIGH_SCORE: 'paglu_stars_high_v1'
};

function safeGet(storage, key, fallback) {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota / privacy mode errors gracefully
  }
}

export function loadSessionState() {
  if (typeof window === 'undefined') {
    return {
      isUnlocked: false,
      visitedPlanets: [],
      mysteryCompletedLevels: [],
      isFinalUnlocked: false,
      openedLetters: [],
      customWishes: [],
      quizBestScore: 0,
      starsHighScore: 0
    };
  }

  return {
    isUnlocked: safeGet(window.sessionStorage, KEYS.UNLOCKED, false),
    visitedPlanets: safeGet(window.sessionStorage, KEYS.VISITED_PLANETS, []),
    mysteryCompletedLevels: safeGet(window.sessionStorage, KEYS.MYSTERY_PROGRESS, []),
    isFinalUnlocked: safeGet(window.sessionStorage, KEYS.FINAL_UNLOCKED, false),
    openedLetters: safeGet(window.sessionStorage, KEYS.OPENED_LETTERS, []),
    customWishes: safeGet(window.sessionStorage, KEYS.CUSTOM_WISHES, []),
    quizBestScore: safeGet(window.sessionStorage, KEYS.QUIZ_BEST, 0),
    starsHighScore: safeGet(window.sessionStorage, KEYS.STARS_HIGH_SCORE, 0)
  };
}

export function persistUnlocked(flag) {
  if (typeof window !== 'undefined') {
    safeSet(window.sessionStorage, KEYS.UNLOCKED, Boolean(flag));
  }
}

export function persistVisitedPlanets(list) {
  if (typeof window !== 'undefined') {
    safeSet(window.sessionStorage, KEYS.VISITED_PLANETS, list);
  }
}

export function persistMysteryProgress(levels, finalUnlocked) {
  if (typeof window !== 'undefined') {
    safeSet(window.sessionStorage, KEYS.MYSTERY_PROGRESS, levels);
    safeSet(window.sessionStorage, KEYS.FINAL_UNLOCKED, Boolean(finalUnlocked));
  }
}

export function persistOpenedLetters(list) {
  if (typeof window !== 'undefined') {
    safeSet(window.sessionStorage, KEYS.OPENED_LETTERS, list);
  }
}

export function persistCustomWishes(list) {
  if (typeof window !== 'undefined') {
    safeSet(window.sessionStorage, KEYS.CUSTOM_WISHES, list);
  }
}

export function persistQuizBest(score) {
  if (typeof window !== 'undefined') {
    safeSet(window.sessionStorage, KEYS.QUIZ_BEST, score);
  }
}

export function persistStarsHighScore(score) {
  if (typeof window !== 'undefined') {
    safeSet(window.sessionStorage, KEYS.STARS_HIGH_SCORE, score);
  }
}

export function detectWebGLSupport() {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

export function isMobileViewport() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}
