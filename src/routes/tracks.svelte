<script>
  import PageTransition from "../components/PageTransition.svelte";
  import AlbumRef from "../components/AlbumRef.svelte";
  import { tracks as _tracks, albums } from "../data";
  import Cover from "../player/components/Cover.svelte";

  let tracks = Object.values(_tracks).map(track => ({
    ...track,
    album: albums[track.albumId],
  }));
</script>

<svelte:head>
  <title>The Air on Earth | Tracks</title>
  <meta
    name="description"
    content="All of the tracks created by the band with their corresponding
    purchase and streaming links." />
</svelte:head>

<!-- TODO: Make this more clickable -->
<PageTransition>
  <div class="ctr">
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
</PageTransition>
