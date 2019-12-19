<script context="module">
  import Track from "../../components/Track.svelte";

  export async function preload({ params }) {
    return {
      trackId: params.trackId,
    };
  }
</script>

<script>
  import { albums, tracks } from "../../data";
  export let trackId;
  const track = tracks[trackId];
  const album = albums[track.albumId];
</script>

<svelte:head>
  <title>The Air on Earth&thinsp;|&thinsp;{album.title}</title>
  <meta
    name="description"
    content={`Track listing, credits, and purchase/streaming links for ${track.title} by The Air on Earth`} />
  <meta
    name="description"
    content={`Track listing, credits, and purchase/streaming links for ${track.title} by The Air on Earth`} />
  <meta
    property="og:description"
    content={`Track listing, credits, and purchase/streaming links for ${track.title} by The Air on Earth`} />
  <meta
    property="og:url"
    content={`https://theaironearth.com/track/${track.id}`} />
  <meta
    name="twitter:description"
    content={`Track listing, credits, and purchase/streaming links for ${track.title} by The Air on Earth`} />
</svelte:head>

<div class="container ctr max-w-6xl">
  <Track {track} {album} albumRef={true} />
</div>
