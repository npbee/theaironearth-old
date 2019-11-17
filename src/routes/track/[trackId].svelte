<script context="module">
  import PageTransition from "../../components/PageTransition.svelte";
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
    content={`See the track listing, credits, and purchase/streaming links for the album ${album.title} by The Air on Earth`} />
</svelte:head>

<PageTransition>
  <div class="container ctr max-w-6xl">
    <Track {track} {album} albumRef={true} />
  </div>
</PageTransition>
