import "../static/global.css";
import { configure } from "@storybook/svelte";

function loadStories() {
  require("../src/stories/index.js");
  // You can require as many stories as you need.
}

window.Modernizr = {
  audio: true,
};

configure(loadStories, module);
