export function canPlay() {
  return typeof window !== "undefined" && window.Modernizr.audio;
}

export function injectTrackTheme(track) {
  const theme = generateTheme(track);

  setCustomProp(`--accent-main`, theme.main);
  setCustomProp(`--accent-high-contrast`, theme.highContrast);
}

export function ejectTrackTheme() {
  removeCustomProp("--accent-main");
  removeCustomProp("--accent-high-contrast");
}

export function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = `${Math.floor(seconds % 60)}`.padStart(2, "0");

  return `${min}:${sec}`;
}

function setCustomProp(prop, value) {
  document.documentElement.style.setProperty(prop, value);
}

function removeCustomProp(prop) {
  document.documentElement.style.removeProperty(prop);
}

function generateTheme(track) {
  const { theme = {} } = track;
  const { main, highContrast } = theme;
  const generatedTheme = {};

  if (main) {
    generatedTheme.main = hsla(main);
  }

  if (highContrast) {
    generatedTheme.highContrast = hsla(highContrast);
  } else {
    generatedTheme.highContrast = hsla(main);
  }

  return generatedTheme;
}

function hsla(config, alpha = 1) {
  return `hsla(${config.h}, ${config.s}%, ${config.l}%, ${alpha})`;
}
