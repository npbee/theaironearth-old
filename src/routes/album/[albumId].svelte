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
    content={`Album listing, credits, and purchase/streaming links for ${album.title} by The Air on Earth`} />
  <meta
    name="description"
    content={`Album listing, credits, and purchase/streaming links for ${album.title} by The Air on Earth`} />
  <meta
    property="og:description"
    content={`Album listing, credits, and purchase/streaming links for ${album.title} by The Air on Earth`} />
  <meta
    property="og:url"
    content={`https://theaironearth.com/album/${album.id}`} />
  <meta
    name="twitter:description"
    content={`Album listing, credits, and purchase/streaming links for ${album.title} by The Air on Earth`} />
</svelte:head>

<div class="container ctr max-w-6xl">

  <div class="flex flex-wrap mb-16 md:mb-48">
    <div class="md:mr-8 md:max-w-md mb-6 w-full">
      <div class="rounded-sm shadow">
        <Image
          src={album.artwork}
          alt={`Album artwork for ${album.title}`}
          ratio="100%" />
      </div>
      {#if album.extraArtwork}
        <a
          href={album.extraArtwork.src}
          target="_blank"
          rel="noreferrer noopener nofollow"
          class="flex py-4 items-center justify-center underline text-sm
          text-grey-600 hover:text-grey-900 trans">
          <span class="mr-1">
            {album.extraArtwork.name} ({album.extraArtwork.size})
          </span>
          <svg class="fill-current" style="width: 1em; height: 1em;">
            <use xlink:href="#link-icon" />
          </svg>
        </a>
      {/if}
    </div>
    <div class="flex-grow py-2">
      <div class="mb-8">
        <time
          dateTime={album.date}
          class="text-sm text-grey-600 small-caps block">
          {album.date}
        </time>
        <h2 class="text-4xl leading-none text-gray-700">{album.title}</h2>
        <QuickLinks links={album.links} />
      </div>
      <TrackList tracks={album.tracks} {store} />
    </div>
  </div>

  <div class="mb-16 md:mb-48 w-full max-w-4xl mx-auto">
    <h3 class="text-3xl">About</h3>
    <div class="flex flex-col md:flex-row">
      <div class="mb-8 md:mr-32 md:leading-relaxed" style="flex: 3">
        {#each album.description as p}
          <p class="mb-6">
            {@html p}
          </p>
        {/each}
      </div>
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
