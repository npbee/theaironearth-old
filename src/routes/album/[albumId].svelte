<script context="module">
  import { store } from "../../player/store";
  import QuickLinks from "../../components/Links.svelte";
  import Credits from "../../components/Credits.svelte";
  import PageTransition from "../../components/PageTransition.svelte";
  import TrackList from "../../components/TrackList.svelte";
  import Image from "../../components/Image.svelte";
  import CreditSource from "../../components/CreditSource.svelte";

  export async function preload({ params }) {
    return {
      albumId: params.albumId,
    };
  }
</script>

<script>
  import { albums } from "../../data";
  export let albumId;
  const album = albums[albumId];
</script>

<svelte:head>
  <title>The Air on Earth&thinsp;|&thinsp;{album.title}</title>
  <meta
    name="description"
    content={`See the track listing, credits, and purchase/streaming links for the album ${album.title} by The Air on Earth`} />
</svelte:head>
<PageTransition>
  <div class="container ctr max-w-6xl">
    {#if album.accentImg}
      <img
        class="accent-img fixed right-0 bottom-0 opacity-25 -z-1"
        alt={album.accentImg.alt}
        src={album.accentImg.src} />
    {/if}
    <div class="mb-20 max-w-4xl mx-auto">
      <time
        dateTime={album.date}
        class="text-sm text-grey-400 small-caps block">
        {album.date}
      </time>
      <h2 class="text-3xl leading-none">{album.title}</h2>
      <QuickLinks links={album.links} />
    </div>
    <div class="flex flex-wrap -mx-2 mb-48">
      <div class="md:mr-16 md:max-w-md mb-6">
        <img src={album.artwork} alt="album art" class="rounded-sm shadow" />
      </div>
      <div class="flex-grow my-auto">
        <h3 class="text-3xl mb-2">Tracks</h3>
        <TrackList tracks={album.tracks} {store} />
      </div>
    </div>
    <div class="mb-48 w-full max-w-4xl mx-auto">
      <h3 class="text-3xl">About</h3>
      <div class="flex flex-col md:flex-row">
        <p class="mb-8 md:mr-32 md:leading-relaxed">
          {@html album.description}
        </p>
        <div class="text-sm">
          <Credits credits={album.credits} />
        </div>
      </div>
    </div>

    {#each album.imgs as img}
      <div class="mb-16 md:mb-32">
        {#if img.size === 'full'}
          <div
            style="margin-left: calc(50% - 50vw); margin-right: calc(50% -
            50vw);">
            <Image src={img.src} alt={img.alt} ratio={img.ratio} />
          </div>
        {:else}
          <Image src={img.src} alt={img.alt} ratio={img.ratio} />
        {/if}
        {#if img.credit}
          <p class="text-sm mt-2 text-grey-400">
            Photo by:
            <CreditSource source={img.credit} />
          </p>
        {/if}
      </div>
    {/each}
  </div>
</PageTransition>
