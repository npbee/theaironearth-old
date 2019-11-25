<script context="module">
  import { store } from "../../player/store";
  import QuickLinks from "../../components/Links.svelte";
  import Credits from "../../components/Credits.svelte";
  import TrackList from "../../components/TrackList.svelte";
  import Image from "../../components/Image.svelte";
  import CreditSource from "../../components/CreditSource.svelte";
  import Track from "../../components/Track.svelte";

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

<div class="container ctr max-w-6xl">

  <div class="flex flex-wrap mb-48">
    <div class="md:mr-8 md:max-w-md mb-6 w-full rounded-sm shadow w-full">
      <Image
        src={album.artwork}
        alt={`Album artwork for ${album.title}`}
        ratio="100%" />
    </div>
    <div class="flex-grow my-auto">
      <div class="mb-8">
        <time
          dateTime={album.date}
          class="text-sm text-grey-600 small-caps block">
          {album.date}
        </time>
        <h2 class="text-3xl leading-none">{album.title}</h2>
        <QuickLinks links={album.links} />
      </div>
      <TrackList tracks={album.tracks} {store} />
    </div>
  </div>

  <div class="mb-48 w-full max-w-4xl mx-auto">
    <h3 class="text-3xl">About</h3>
    <div class="flex flex-col md:flex-row">
      <p class="mb-8 md:mr-32 md:leading-relaxed" style="flex: 3">
        {@html album.description}
      </p>
      <div class="text-sm" style="flex: 2">
        <Credits credits={album.credits} />
      </div>
    </div>
  </div>

  {#each album.imgs.slice(0, 1) as img}
    <div class="mb-16 md:mb-32">
      {#if img.size === 'full'}
        <div class="breakout">
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

  {#each album.tracks as track}
    <Track {track} {album} />
  {/each}

  {#each album.imgs.slice(1) as img}
    <div class="mb-16 md:mb-32">
      {#if img.size === 'full'}
        <div class="breakout">
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
