<script>
  import AlbumRef from "../components/AlbumRef.svelte";
  import { tracks as _tracks, preloadAlbums } from "../data";
  import Cover from "../player/components/Cover.svelte";

  let tracks = preloadAlbums(_tracks).filter(track => track.album);
</script>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 16px;
  }
</style>

<svelte:head>
  <title>The Air on Earth | Tracks</title>
  <meta
    name="description"
    content="All of the tracks created by the band with their corresponding
    purchase and streaming links." />
</svelte:head>
<!-- TODO: Make this more clickable -->
<div class="ctr grid">
  {#each tracks as track}
    <div class="mb-8 flex items-center">
      <div class="w-24 mr-4">
        <Cover trackId={track.id} album={track.album} />
      </div>
      <div>
        <div class="flex items-center">
          <a href={`/track/${track.id}`} class="mr-2">
            <h3 class="text-xl">{track.title}</h3>
          </a>
        </div>
        <AlbumRef album={track.album} />
      </div>
    </div>
  {/each}
</div>
