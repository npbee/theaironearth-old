import { Albums } from "../data";
import { writable } from "svelte/store";
import { machine } from "../player/store";
import { storiesOf } from "@storybook/svelte";
import Footer from "../components/Footer.svelte";
import TrackList from "../components/TrackList.svelte";
import IconButtonView from "./IconButtonView.svelte";
import "./story.css";

storiesOf("Footer", module).add("Playing", () => {
  const store = writable(machine.initialState);

  store.update(state => ({
    ...state,
    value: "playing",
    context: {
      currentTime: "1:00",
      duration: 60 * 3,
      percentPlayed: 0.4,
      trackId: "exit",
    },
  }));

  return {
    Component: Footer,
    props: {
      store,
    },
  };
});

storiesOf("Tracklist", module).add("default", () => {
  const store = writable({
    ...machine.initialState,
  });

  return {
    Component: TrackList,
    props: { store, tracks: Albums["the-air-on-earth"].tracks },
  };
});

storiesOf("Button", module)
  .add("IconButton", () => {
    return {
      Component: IconButtonView,
      props: {},
      on: {
        click: () => {
          console.log("clicked");
        },
      },
    };
  })
  .add("IconButton as a Link", () => {
    return {
      Component: IconButtonView,
      props: {
        component: "a",
        href: "https://google.com",
      },
      on: {
        click: () => {
          console.log("clicked");
        },
      },
    };
  });
