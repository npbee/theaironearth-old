<script>
  export let links;
  export let category = "quick";

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

  function iconPath(type) {
    return `#${type}`;
  }

  const quickLinks = links.filter(link => link.type !== "apple-music");
  const filteredLinks = category === "quick" ? quickLinks : links;
</script>

<style>
  a.apple-music {
    width: 64px;
  }
</style>

<div class="-mx-4 -my-2 md:my-auto md:-mx-2 flex items-center flex-wrap">
  {#each filteredLinks as link, i}
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer noopener nofollow"
      class={`icon-btn p-4 md:p-2 text-3xl md:text-2xl icon-btn--${link.type}`}
      title={linkTitle(link)}>
      <span class="visually-hidden">{linkTitle(link)}</span>
      <svg>
        <use xlink:href={iconPath(link.type)} />
      </svg>
    </a>
  {/each}
</div>
