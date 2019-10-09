const purgecss = require("@fullhuman/postcss-purgecss")({
  content: ["./src/**/*.svelte", "./src/**/*.html"],
  defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
  whitelist: [
    "icon-btn",
    "icon-btn--bandcamp",
    "icon-btn--soundcloud",
    "icon-btn--spotify",
  ],
});

const cssnano = require("cssnano")({
  preset: "default",
});

module.exports = {
  plugins: [
    require("tailwindcss"),
    require("postcss-custom-properties"),
    require("autoprefixer"),
    ...(process.env.NODE_ENV === "production" ? [purgecss, cssnano] : []),
  ],
};
