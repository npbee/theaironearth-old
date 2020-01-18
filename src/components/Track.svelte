<script>
  import { store } from "../player/store";
  import PlayPause from "../player/components/PlayPause.svelte";
  import AlbumRef from "./AlbumRef.svelte";
  import Links from "./Links.svelte";
  import Credits from "./Credits.svelte";
  import Image from "./Image.svelte";
  import { generateTheme } from "../player/utils";

  export let track;
  export let album;
  export let albumRef = false;
  const theme = generateTheme(track);
</script>

<style>
  .title {
    position: relative;
  }

  .artwork {
    right: 0;
    top: -80px;
  }

  @media screen and (min-width: 1000px) {
    .artwork {
      transform: scale(2) translateY(25%);
    }

    .header-container {
      box-shadow: -12px 0 0 0 var(--alpha-2);
    }
  }

  .stanza-0 p:first-of-type:first-letter {
    font-size: 200%;
    letter-spacing: 0.05em;
    line-height: 1;
  }
</style>

<div id={track.id} class="py-8 md:py-32 mb-12">
  <div class="container" style={`--alpha-2: ${theme.mainAlpha2}`}>
    <div
      class="mb-8 py-4 md:px-8 md:border-l-4 xmd:-mx-4 relative md:flex
      justify-between items-center rounded-sm header-container"
      style={`border-color: ${theme.mainAlpha};`}>
      {#if track.artwork}
        <div
          class="artwork shadow mb-8 md:mb-0 w-full md:w-48 md:order-2 md:mr-16"
          style={`box-shadow: 0px 0px 100px 4px ${theme.mainAlpha};`}>
          <Image
            ratio="100%"
            src={track.artwork}
            alt={`Artwork for ${track.title}`} />
        </div>
      {/if}
      <div class="flex flex-col justify-between">
        <div>
          <div class="title flex items-baseline">
            <h2 class="leading-none text-3xl mr-2">
              <a class="hover:underline" href={`/track/${track.id}`}>
                {track.title}
              </a>
            </h2>
            <PlayPause {store} trackId={track.id} size="2xl" />
          </div>
          {#if albumRef === true}
            <div class="mb-2 text-grey-500">
              <AlbumRef {album} />
            </div>
          {/if}
        </div>
        <div class="text-grey-500 -mb-4">
          <Links links={track.links} />
        </div>
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

    <div class="text-xs mt-4">
      <Credits credits={track.credits} />
    </div>
  </div>
</div>
