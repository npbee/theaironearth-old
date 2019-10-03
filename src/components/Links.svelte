<script>
  import Soundcloud from "./icons/Soundcloud.svelte";
  import Spotify from "./icons/Spotify.svelte";
  import Bandcamp from "./icons/Bandcamp.svelte";
  import AppleMusic from "./icons/AppleMusic.svelte";

  export let links;

  function linkTitle(link) {
    switch (link.type) {
      case "soundcloud":
        return "Soundcloud";
      case "bandcamp":
        return "Bandcamp";
      case "spotify":
        return "Spotify";
      case "apple-music":
        return "Apple Music";
      default:
        throw new Error(`Unknown link type ${link.type}`);
    }
  }

  function icon(type) {
    switch (type) {
      case "soundcloud":
        return Soundcloud;
      case "spotify":
        return Spotify;
      case "bandcamp":
        return Bandcamp;
      case "apple-music":
        return AppleMusic;
      default:
        throw new Error(`No icon defined for link type ${type}`);
    }
  }
</script>

<style>
  a.apple-music {
    width: 64px;
  }
</style>

<div class="-mx-1 flex items-center flex-wrap">
  {#each links as link, i}
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer noopener nofollow"
      class={`icon-btn mx-1 icon-btn--${link.type}`}
      title={linkTitle(link)}>
      <span class="visually-hidden">{linkTitle(link)}</span>
      <svelte:component this={icon(link.type)} />
    </a>
  {/each}
</div>
