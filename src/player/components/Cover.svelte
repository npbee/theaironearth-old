<script>
  import { store, send } from "../store";
  import PlayIcon from "./Play.svelte";
  import PauseIcon from "./Pause.svelte";
  import { canPlay } from "../utils";
  import Image from "../../components/Image.svelte";
  import Loader from "../../components/icons/Loader.svelte";
  import { tracks } from "../../data";

  export let album;
  export let trackId;

  let color = "text-grey-600";

  if (album.shade === "dark") {
    color = "text-white";
  }

  $: activeTrackId = $store.context.trackId;
  $: isBusy =
    ($store.value === "loading" || $store.value === "starting") &&
    activeTrackId === trackId;
  $: isPlaying =
    $store.value === "playing" && activeTrackId === trackId ? true : false;
  $: isPaused =
    $store.value === "paused" && activeTrackId === trackId ? true : false;
  $: handler = () => {
    if (isPlaying) {
      send("pause");
    } else if (isPaused) {
      send("play");
    } else if (isBusy) {
      send("stop");
    } else {
      send({ type: "play-track", trackId });
    }
  };
</script>

<style>
  button {
    max-width: none;
    position: relative;
    cursor: pointer;
    display: flex;
  }

  button > .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    transition: background 200ms, opacity 200ms;
    background: rgba(0, 0, 0, 0);
    opacity: 0.6;
  }

  button:hover > .icon {
    background: rgba(0, 0, 0, 0.2);
    opacity: 1;
  }
</style>

{#if canPlay(tracks[trackId])}
  <button on:click={handler} class={`w-full ${color}`}>
    <Image
      ratio="100%"
      src={album.artwork}
      alt={`Artwork for ${album.title}`} />
    <div class={`icon ${color}`}>
      {#if isBusy}
        <Loader size="20%" />
      {:else if isPlaying}
        <PauseIcon size="20%" />
      {:else}
        <PlayIcon size="20%" />
      {/if}
    </div>
  </button>
{:else}
  <Image ratio="100%" src={album.artwork} alt={`Artwork for ${album.title}`} />
{/if}
