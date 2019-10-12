export function canPlay() {
  return typeof window !== "undefined" && window.Modernizr.audio;
}

export function injectTrackTheme(track) {
  const theme = generateTheme(track);

  setCustomProp(`--accent-bg`, theme.background);
  setCustomProp(`--accent-high-contrast`, theme.highContrast);
}

export function ejectTrackTheme() {
  removeCustomProp("--accent-bg");
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
  const { background, color } = theme;

  if (background && color) {
    let alphaStops = [[0, 0], [0.2, 15], [0.3, 50], [0, 100]];
    let styles = "linear-gradient(to bottom,";

    for (let [alpha, stop] of alphaStops) {
      styles += `${hsla(background, alpha)} ${stop}%,`;
    }

    if (styles.endsWith(",")) {
      styles = styles.slice(0, -1);
    }
    styles += ")";

    return {
      gradient: styles,
      color: hsla(color),
      background: hsla(background),
      highContrast: hsla(toHighContrast(background)),
    };
  }

  return {};
}

function hsla(config, alpha = 1) {
  return `hsla(${config.h}, ${config.s}%, ${config.l}%, ${alpha})`;
}

function toHighContrast(config) {
  return {
    ...config,
    l: config.l * 0.5,
  };
}
