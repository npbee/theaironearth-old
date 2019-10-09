import * as sapper from "@sapper/app";
import log from "loglevel";

const mode = process.env.NODE_ENV;
const dev = mode === "development";

sapper.start({
  target: document.querySelector("#sapper"),
});

if (typeof window !== "undefined") {
  window.log = log;

  log.setDefaultLevel(dev ? "debug" : "error");

  if ("serviceWorker" in navigator) {
    window.setSwLogLevel = level => {
      navigator.serviceWorker.controller.postMessage({
        command: "set-log-level",
        level,
      });
    };
  }
}
