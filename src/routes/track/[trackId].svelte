<script context="module">
  import PageTransition from "../../components/PageTransition.svelte";
  import Credits from "../../components/Credits.svelte";
  import Links from "../../components/Links.svelte";
  import AlbumRef from "../../components/AlbumRef.svelte";
  import PlayPause from "../../player/components/PlayPause.svelte";
  import FixedAccentImage from "../../components/FixedAccentImage.svelte";
  import { injectTrackTheme } from "../../player/utils";

  export async function preload({ params }) {
    return {
      trackId: params.trackId,
    };
  }
</script>

<script>
  import { onMount, onDestroy } from "svelte";
  import { store } from "../../player/store";
  import { albums, tracks } from "../../data";
  export let trackId;

  const track = tracks[trackId];
  const album = albums[track.albumId];

  let trackThemed = false;
  let timer;

  onMount(() => {
    injectTrackTheme(track);

    timer = setTimeout(() => {
      trackThemed = true;
    }, 0);
  });

  onDestroy(() => {
    if (typeof document !== "undefined") {
      clearTimeout(timer);
    }
  });
</script>

<style>
  .title {
    position: relative;
  }

  .title img {
    --width: 100px;
    position: absolute;
    width: var(--width);
    opacity: 0.4;
    z-index: -1;
    left: calc(var(--width) * 0.6 * -1);
    top: calc(var(--width) * 0.6 * -1);
  }

  .stanza-0 p:first-of-type:first-letter {
    font-size: 200%;
    letter-spacing: 0.05em;
    line-height: 1;
  }

  .track {
    transition-property: color;
    transition-duration: 1000ms;
    transition-delay: 300ms;
    color: var(--accent-color);
  }

  .track-bg {
    position: absolute;
    top: 0%;
    left: 0%;
    height: 100%;
    width: 100%;
    z-index: -1;
    opacity: 0;
    transition-delay: 300ms;
    transition-property: opacity;
    transition-duration: 1000ms;
    background: var(--accent-gradient);
  }

  .track-bg--ready {
    opacity: 1;
  }
</style>

<svelte:head>
  <title>The Air on Earth&thinsp;|&thinsp;{track.title}</title>
  <meta
    name="description"
    content={`See the lyrics, credits, and purchase/streaming links for the track ${track.title} by The Air on Earth`} />
</svelte:head>

<PageTransition>
  <div class={`breakout relative track track:${track.id}`}>
    <div class={`track-bg ${trackThemed ? 'track-bg--ready' : ''}`} />
    <div class="container ctr max-w-3xl py-12 mb-8">
      {#if album.accentImg}
        <FixedAccentImage alt={album.accentImg.alt} src={album.accentImg.src} />
      {/if}

      <div class="flex md:items-center flex-col md:flex-row">
        <div class="mb-12 md:mb-0" style="flex: 3">
          <div class="title flex items-baseline">
            <img src={album.artwork} alt={`Album artwork for ${album.title}`} />
            <h2 class="leading-none text-4xl mr-2">{track.title}</h2>
            <PlayPause {store} trackId={track.id} size="2xl" />
          </div>
          <AlbumRef {album} className="mb-4" />
          <Links links={track.links} />
        </div>

        <div class="text-xs">
          <Credits credits={track.credits} className="text-xs" />
        </div>
      </div>
    </div>
  </div>

  <div class="text-grey-600 serif mb-12 container ctr max-w-3xl">
    {#each track.lyrics as stanza, i}
      <div class={`mb-6 stanza-${i}`}>
        {#each stanza as line}
          <p>{line}</p>
        {/each}
      </div>
    {/each}
  </div>
</PageTransition>
