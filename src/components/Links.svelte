<script>
  import Soundcloud from "./icons/Soundcloud.svelte";
  import Spotify from "./icons/Spotify.svelte";
  import Bandcamp from "./icons/Bandcamp.svelte";
  import AppleMusic from "./icons/AppleMusic.svelte";

  export let links;
  export let category = "quick";
  export let dimmed = false;

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

  const quickLinks = links.filter(link => link.type !== "apple-music");
  const filteredLinks = category === "quick" ? quickLinks : links;
</script>

<style>
  a.apple-music {
    width: 64px;
  }
</style>

<div class="-mx-2 flex items-center flex-wrap">
  {#each filteredLinks as link, i}
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer noopener nofollow"
      class={`icon-btn m-2 icon-btn--${link.type}`}
      style={`${dimmed ? 'color: var(--bg-contrast);' : ''}`}
      title={linkTitle(link)}>
      <span class="visually-hidden">{linkTitle(link)}</span>
      <svelte:component this={icon(link.type)} />
    </a>
  {/each}
</div>
