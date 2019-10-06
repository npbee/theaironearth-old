<script>
  import { slide } from "svelte/transition";
  import { tracks, albums } from "../data";
  import { send, nextTrack, prevTrack } from "../player/store";
  import NextIcon from "../player/components/Next.svelte";
  import PrevIcon from "../player/components/Prev.svelte";
  import PlayPause from "../player/components/PlayPause.svelte";
  export let store;

  $: activeTrack = tracks[$store.context.trackId];
  $: activeAlbum = albums[activeTrack && activeTrack.albumId];
  $: percentPlayed = $store.context.percentPlayed;
  $: currentTime = $store.context.currentTime;
  $: duration = $store.context.duration;
  $: formattedDuration = formatTimeCode($store.context.duration);
  $: isErrored = $store.value === "error-playing";
  $: scLink = activeTrack.links.find(link => link.type === "soundcloud");

  function formatTimeCode(num) {
    if (!num) return "-";

    const min = Math.floor(num / 60);
    const sec = `${Math.floor(num % 60)}`.padStart(2, "0");

    return `${min}:${sec}`;
  }

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

  function hintSeek(evt) {
    const offset = evt.offsetX;
    const width = scrubber.offsetWidth;
    const percent = offset / width;
    nextSeek = percent;
  }

  function onMouseMove(evt) {
    raf = requestAnimationFrame(() => hintSeek(evt));
  }

  function trackSeek() {
    window.addEventListener("mousemove", onMouseMove);
  }

  function untrackSeek() {
    nextSeek = 0;
    window.removeEventListener("mousemove", onMouseMove);
    cancelAnimationFrame(raf);
  }
</script>

<style>
  footer {
    display: flex;
    justify-content: space-between;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    max-width: none;
    background-color: white;
  }
  .player {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .player img {
    width: 32px;
    align-self: center;
  }

  .track-title {
    font-weight: 600;
  }
  .album-link {
    display: flex;
  }
  .album-title {
    line-height: 1;
  }

  .info {
    display: flex;
    flex-direction: column;
  }

  .controls {
    display: flex;
    align-items: center;
  }
  .controls button {
    display: flex;
  }

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
    background-color: var(--accent-bg);
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
  <footer
    class="text-xs border-t border-grey-100 border-solid h-16"
    transition:slide={{}}>
    <div class="ctr flex items-center">
      <div class="player">
        <div class="flex items-center">
          <a href={`/album/${activeAlbum.id}`} class="album-link mr-2">
            <img
              src={activeAlbum.artwork}
              alt={`Album artwork for ${activeAlbum.title}`} />
          </a>
          <div class="info mr-8">
            <a
              href={`/track/${activeTrack.id}`}
              class="track-title hover:underline">
              {activeTrack.title}
            </a>
            <a
              href={`/album/${activeAlbum.id}`}
              class="album-title text-grey-600 hover:underline">
              {activeAlbum.title}
            </a>
          </div>
        </div>
        {#if isErrored}
          <div class="flex-1 text-red-700">
            Could not play this track! Try playing again or listening directly
            from
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
            on:mouseover={trackSeek}
            on:mouseleave={untrackSeek}
            on:click={seek}
            bind:this={scrubber}>
            <span
              class="seek bg-grey-200"
              style={`width: ${nextSeek * 100}%`} />
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
        <div class="controls">
          <button
            class="mr-3"
            on:click={() => send({
                type: 'play-track',
                trackId: prevTrack(activeTrack.id),
              })}>
            <PrevIcon />
          </button>
          <div class="mr-3">
            <PlayPause trackId={activeTrack.id} {store} />
          </div>
          <button
            on:click={() => send({
                type: 'play-track',
                trackId: nextTrack(activeTrack.id),
              })}>
            <NextIcon />
          </button>
        </div>
      </div>
    </div>
  </footer>
{/if}
