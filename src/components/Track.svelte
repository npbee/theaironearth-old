<script>
  import { store } from "../player/store";
  import PlayPause from "../player/components/PlayPause.svelte";
  import AlbumRef from "./AlbumRef.svelte";
  import Links from "./Links.svelte";
  import Credits from "./Credits.svelte";
  import Image from "./Image.svelte";

  export let track;
  export let album;
  export let albumRef = false;
</script>

<style>
  .title {
    position: relative;
  }

  .artwork {
    display: block;
    opacity: 1;
    z-index: -1;
    right: 0;
    top: calc(var(--width) * 0.3 * -1);
    z-index: 1;
  }

  .title h2 {
    z-index: 2;
  }

  .stanza-0 p:first-of-type:first-letter {
    font-size: 200%;
    letter-spacing: 0.05em;
    line-height: 1;
  }
</style>

<div id={track.id} class="py-24">
  <div class="container mb-12">
    <div class="mb-8 relative">
      {#if track.artwork}
        <div class="artwork shadow mb-4 md:absolute w-full md:w-1/3">
          <Image
            ratio="100%"
            src={track.artwork}
            alt={`Artwork for ${track.title}`} />
        </div>
      {/if}
      <div class="title flex items-baseline">
        <h2 class="leading-none text-4xl mr-2">{track.title}</h2>
        <PlayPause {store} trackId={track.id} size="2xl" />
      </div>
      {#if albumRef === true}
        <AlbumRef {album} />
      {/if}
      <div class="text-grey-500">
        <Links links={track.links} />
      </div>
    </div>

    {#if track.lyrics.length > 0}
      <div class="text-grey-600 serif">
        {#each track.lyrics as stanza, i}
          <div class={`mb-6 stanza-${i}`}>
            {#each stanza as line}
              <p>{line}</p>
            {/each}
          </div>
        {/each}
      </div>
    {/if}

    {#if track.credits.length > 1}
      <div class="text-xs mt-12">
        <hr class="mb-4" />
        <Credits credits={track.credits} />
      </div>
    {/if}
  </div>
</div>
