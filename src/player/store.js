import { FSM } from "@xstate/fsm";
import { writable } from "svelte/store";
import log from "loglevel";
import * as Data from "../data";
import { streamUrlFor } from "./sc";
import { injectTrackTheme } from "./utils";

export const machine = FSM({
  id: "player",
  initial: "init",
  context: {
    currentTime: null,
    duration: null,
    percentPlayed: 0,
    trackId: Data.playlistOrder[0],
  },
  states: {
    init: {
      on: {
        "play-track": "loading",
      },
    },
    paused: {
      entry: [pause],
      on: {
        play: "starting",
        "play-track": "loading",
      },
    },
    loading: {
      entry: [
        assign({
          trackId: (_context, evt) => evt.trackId,
        }),
        load,
      ],
      on: {
        loaded: "starting",
        "play-track": "loading",
      },
    },
    starting: {
      entry: [play],
      on: {
        started: "playing",
        "play-track": "loading",
        failed: "error-playing",
      },
    },
    "error-playing": {
      on: {},
    },
    playing: {
      on: {
        seek: {
          target: "playing",
          actions: seek,
        },
        pause: "paused",
        "play-track": "loading",
        "time-update": {
          target: "playing",
          actions: assign({
            currentTime: updateCurrentTime,
            percentPlayed: updatePercentPlayed,
            duration: updateDuration,
          }),
        },
      },
    },
  },
});

let currentState = machine.initialState;
let audio;
let onTimeUpdate;
let onEnd;

if (typeof window !== "undefined") {
  audio = new Audio();
  audio.setAttribute("preload", "auto");
}

export const store = writable(currentState);

export function send(event) {
  log.debug("Event received", event);
  currentState = machine.transition(currentState, event);

  const { actions } = currentState;

  actions.forEach(action => {
    if (action.type === "ASSIGN") {
      currentState.context = runAssignment(
        action.assignment,
        currentState.context,
        event
      );
    } else if (action.exec) {
      action.exec(currentState.context, event);
    }
  });

  store.set(currentState);
}

export function nextTrack(currentTrackId) {
  if (currentTrackId) {
    const currentTrackIndex = Data.playlistOrder.indexOf(currentTrackId);
    const nextTrackIndex = (currentTrackIndex + 1) % Data.playlistOrder.length;
    const nextTrackId = Data.playlistOrder[nextTrackIndex];
    return nextTrackId;
    //
  } else {
    const nextTrackId = Data.playlistOrder[0];
    return nextTrackId;
  }
}

export function prevTrack(currentTrackId) {
  if (currentTrackId) {
    const currentTrackIndex = Data.playlistOrder.indexOf(currentTrackId);
    const count = Data.playlistOrder.length;
    const nextTrackIndex = (currentTrackIndex - 1 + count) % count;
    const nextTrackId = Data.playlistOrder[nextTrackIndex];
    return nextTrackId;
  } else {
    const nextTrackId = Data.playlistOrder[0];
    const nextTrack = Data.tracks[nextTrackId];
    return nextTrack;
  }
}

async function play(context) {
  const { trackId } = context;

  try {
    audio.removeEventListener("ended", onEnd);
    audio.removeEventListener("timeupdate", onTimeUpdate);

    await audio.play();

    const track = Data.tracks[trackId];
    injectTrackTheme(track);

    send("started");

    onTimeUpdate = _evt => {
      const currentTime = audio.currentTime;
      const duration = audio.duration;
      send({ type: "time-update", currentTime, duration, trackId });
    };
    audio.addEventListener("timeupdate", onTimeUpdate);

    onEnd = _evt => {
      const nextTrackId = nextTrack(trackId);
      send({ type: "play-track", trackId: nextTrackId });
    };
    audio.addEventListener("ended", onEnd);
  } catch (err) {
    log.error(err);
    send("failed");
  }
}

function pause() {
  audio.pause();
}

function seek(_context, evt) {
  audio.currentTime = evt.to;
}

async function load(context) {
  const { trackId } = context;
  const url = await streamUrlFor(trackId);

  audio.src = url;

  audio.load();

  send("loaded");
}

function updateCurrentTime(_context, evt) {
  return evt.currentTime;
}

function updateDuration(_context, evt) {
  const { duration } = evt;

  return duration;
}

function updatePercentPlayed(_context, evt) {
  const { currentTime, duration } = evt;

  return currentTime / duration;
}

function assign(assignment) {
  return {
    type: "ASSIGN",
    assignment,
  };
}

function runAssignment(assignment, context, event) {
  let nextContext = { ...context };

  Object.keys(assignment).forEach(key => {
    nextContext[key] = assignment[key](context, event);
  });

  return nextContext;
}
