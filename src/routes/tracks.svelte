<script>
  import AlbumRef from "../components/AlbumRef.svelte";
  import { tracks as _tracks, preloadAlbums } from "../data";
  import Cover from "../player/components/Cover.svelte";
  import Links from "../components/Links.svelte";

  let tracks = preloadAlbums(_tracks).filter(track => track.album);
</script>

<style>
  /**
   * Only do the grid styles if there's room for the column and the padding
    */
  @media screen and (min-width: 382px) {
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      grid-gap: 16px;
    }
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
      <div class="w-32 mr-4">
        <Cover trackId={track.id} album={track.album} />
      </div>
      <div class="flex-1">
        <a
          href={`/track/${track.id}`}
          class="mr-2 flex items-center hover:underline trans w-full pt-2 pb-1
          md:py-0">
          <h3 class="text-2xl leading-none">{track.title}</h3>
        </a>
        <div class="mb-1">
          <AlbumRef album={track.album} className="text-grey-600 text-xs" />
        </div>
        <div class="-mb-4">
          <Links links={track.links} />
        </div>
      </div>
    </div>
  {/each}
</div>
