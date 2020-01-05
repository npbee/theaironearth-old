<script>
  import { fade } from "svelte/transition";
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
  $: duration = $store.context.duration || 0;
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

{#if $store.value !== 'init'}
  <div class="flex items-center justify-between text-xs" transition:fade={{}}>
    <div class="flex items-center">
      <a
        class="attribution text-lg text-grey-300 flex hover:text-grey-800 trans
        mr-3"
        target="_blank"
        rel="noopener noreferrer nofollow"
        href={scLink.url}>
        <span class="visually-hidden">
          Soundcloud link for {activeTrack.title}
        </span>
        <svg style="width: 1em; height: 1em;">
          <use xlink:href="#soundcloud" />
        </svg>
      </a>
      <div class="mr-4 flex flex-col">
        <span class="tracking-wide small-caps">Now Playing</span>
        <a
          href={`/album/${activeAlbum.id}#${activeTrack.id}`}
          class="font-semibold hover:underline text-sm leading-none">
          {activeTrack.title}
        </a>
      </div>
    </div>
    <div class="flex items-center mr-4">
      <div class="text-2xl md:text-2xl">
        <PlayPause trackId={activeTrack.id} {store} size="" />
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
    {/if}
  </div>
{/if}
