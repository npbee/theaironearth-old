<script>
  import PlayIcon from "./Play.svelte";
  import PauseIcon from "./Pause.svelte";
  import Loader from "../../components/icons/Loader.svelte";
  import { send } from "../store";
  import { canPlay } from "../utils";
  export let store;
  export let trackId;
  export let size = "";

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
    cursor: pointer;
    background: none;
  }
</style>

{#if canPlay()}
  <button
    class={`icon-btn c-grey-700 flex text-${size}`}
    data-testid={isPlaying ? 'pause' : 'play'}
    on:click={handler}>
    {#if isBusy}
      <Loader />
    {:else if isPlaying}
      <PauseIcon />
    {:else}
      <PlayIcon />
    {/if}
  </button>
{/if}
