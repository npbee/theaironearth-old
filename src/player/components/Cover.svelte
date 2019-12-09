<script>
  import { store, send } from "../store";
  import PlayIcon from "./Play.svelte";
  import PauseIcon from "./Pause.svelte";
  import { canPlay } from "../utils";
  import Image from "../../components/Image.svelte";

  export let album;
  export let trackId;

  $: activeTrackId = $store.context.trackId;
  $: isPlaying =
    $store.value === "playing" && activeTrackId === trackId ? true : false;
  $: isPaused =
    $store.value === "paused" && activeTrackId === trackId ? true : false;
  $: handler = () => {
    if (isPlaying) {
      send("pause");
    } else if (isPaused) {
      send("play");
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
    opacity: 0.3;
  }

  button:hover > .icon {
    background: rgba(0, 0, 0, 0.2);
    opacity: 1;
  }
</style>

{#if canPlay()}
  <button on:click={handler} class="w-24 text-grey-100">
    <Image
      ratio="100%"
      src={album.artwork}
      alt={`Artwork for ${album.title}`} />
    <div class="icon text-2xl">
      {#if isPlaying}
        <PauseIcon />
      {:else}
        <PlayIcon />
      {/if}
    </div>
  </button>
{:else}
  <Image ratio="100%" src={album.artwork} alt={`Artwork for ${album.title}`} />
{/if}
