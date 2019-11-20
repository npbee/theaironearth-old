<script>
  import { slide } from "svelte/transition";
  import { tracks, albums } from "../../data";
  import { store, send, nextTrack, prevTrack } from "../store";
  import { formatTime } from "../utils";
  import NextIcon from "./Next.svelte";
  import PrevIcon from "./Prev.svelte";
  import PlayPause from "./PlayPause.svelte";

  $: activeTrack = tracks[$store.context.trackId];
  $: activeAlbum = albums[activeTrack && activeTrack.albumId];
  $: percentPlayed = $store.context.percentPlayed;
  $: currentTime = formatTime($store.context.currentTime);
  $: duration = $store.context.duration;
  $: formattedDuration = formatTime($store.context.duration);
  $: isErrored = $store.value === "error-playing";
  $: scLink = activeTrack.links.find(link => link.type === "soundcloud");

  let scrubber;
  let nextSeek = 0;
  let raf;

  function seek(evt) {
    const offset = evt.offsetX;
    const width = scrubber.offsetWidth;
    const percent = offset / width;
    const nextTime = percent * (duration || 0);
    send({ type: "seek", to: nextTime });
  }

  function previewSeek(evt) {
    const offset = evt.offsetX;
    const width = scrubber.offsetWidth;
    const percent = offset / width;
    nextSeek = percent;
  }

  function onMouseMove(evt) {
    raf = requestAnimationFrame(() => previewSeek(evt));
  }

  function trackMouseSeek() {
    window.addEventListener("mousemove", onMouseMove);
  }

  function untrackMouseSeek() {
    nextSeek = 0;
    window.removeEventListener("mousemove", onMouseMove);
    cancelAnimationFrame(raf);
  }
</script>

<style>
  .progress {
    height: 4px;
    position: relative;
    cursor: pointer;

    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .progress span {
    display: block;
    position: absolute;
    height: 4px;
    max-width: none;
    width: 100%;
    z-index: -1;
    border-radius: 3px;
    transition: width 200ms;
  }
  .progress .played {
    /* Svelte doesn't like fallback custom props? */
    background-color: var(--accent-main);
    z-index: 1;
  }
  .progress .seek {
    /* Svelte doesn't like fallback custom props? */
    z-index: 1;
    transition-duration: 0ms;
  }

  .time {
    display: flex;
    justify-content: space-between;
    position: absolute;
    bottom: -8px;
    width: 100%;
  }
</style>

{#if $store.value !== 'init'}
  <div
    class="ctr flex items-center fixed bottom-0 left-0 bg-white-trans text-xs
    h-16"
    transition:slide={{}}>
    <div class="flex items-center">
      <a href={`/album/${activeAlbum.id}`} class="album-link mr-2">
        <img
          class="w-12"
          src={`img/${activeAlbum.artwork}.jpg`}
          alt={`Album artwork for ${activeAlbum.title}`} />
      </a>
      <div class="mr-8 flex flex-col">
        <a
          href={`/album/${activeAlbum.id}#${activeTrack.id}`}
          class="font-semibold hover:underline">
          {activeTrack.title}
        </a>
        <a
          href={`/album/${activeAlbum.id}`}
          class="leading-none text-grey-600 hover:underline">
          {activeAlbum.title}
        </a>
      </div>
    </div>
    {#if isErrored}
      <div class="flex-1 text-red-700">
        Could not play this track! Try playing again or listening directly from
        <a
          target="_blank"
          rel="noopener noreferrer nofollow"
          class="decorated-link"
          href={scLink.url}>
          Soundcloud
        </a>
        .
      </div>
    {:else}
      <div
        class="progress flex-1 mr-8"
        on:mouseover={trackMouseSeek}
        on:mouseleave={untrackMouseSeek}
        on:click={seek}
        bind:this={scrubber}>
        <span class="seek bg-grey-200" style={`width: ${nextSeek * 100}%`} />
        <span
          class="played bg-grey-700"
          style={`width: ${percentPlayed * 100}%`} />
        <span class="bg-grey-100" />
        <div class="time">
          <p>{currentTime || '-'}</p>
          <p>{formattedDuration || '-'}</p>
        </div>
      </div>
    {/if}
    <div class="flex items-center">
      <button
        class="mr-3 icon-btn text-sm"
        on:click={() => send({
            type: 'play-track',
            trackId: prevTrack(activeTrack.id),
          })}>
        <PrevIcon />
      </button>
      <div class="mr-3">
        <PlayPause trackId={activeTrack.id} {store} size="2xl" />
      </div>
      <button
        class="icon-btn text-sm"
        on:click={() => send({
            type: 'play-track',
            trackId: nextTrack(activeTrack.id),
          })}>
        <NextIcon />
      </button>
    </div>
  </div>
{/if}
