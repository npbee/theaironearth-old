export function canPlay() {
  return typeof window !== "undefined" && window.Modernizr.audio;
}

export function injectTrackTheme(track) {
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

    setCustomProp("--accent-gradient", styles);
    setCustomProp("--accent-color", hsla(color));
    setCustomProp("--accent-bg", hsla(background));
  }
}

export function ejectTrackTheme() {
  removeCustomProp("--accent-gradient");
  removeCustomProp("--accent-color");
  removeCustomProp("--accent-bg");
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

function hsla(config, alpha = 1) {
  return `hsla(${config.h}, ${config.s}%, ${config.l}%, ${alpha})`;
}
