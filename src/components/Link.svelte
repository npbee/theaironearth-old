<script>
  export let link;
  export let display = "icon-only";

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

  function linkLogoSrc(link) {
    switch (link.type) {
      case "soundcloud":
        return "/logos/soundcloud.svg";
      case "bandcamp":
        return "/logos/bandcamp.png";
      case "spotify":
        return "/logos/spotify.png";
      case "apple-music":
        return "/logos/apple-music.svg";
      default:
        throw new Error(`Unknown link type ${link.type}`);
    }
  }

  function iconPath(type) {
    return `#${type}`;
  }
</script>

<style>
  :global(.logo-spotify) {
    width: 75%;
    max-width: 80px;
  }

  :global(.logo-soundcloud) {
    width: 75%;
    max-width: 110px;
  }

  :global(.logo-bandcamp) {
    width: 85%;
    max-width: 110px;
    transform: translateX(-8px);
  }

  :global(.logo-apple-music) {
    width: 80%;
    max-width: 110px;
  }
</style>

{#if display === 'icon-only'}
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
{:else if display === 'icon-and-text'}
  <a
    href={link.url}
    target="_blank"
    rel="noreferrer noopener nofollow"
    class={`decorated-link`}>
    {linkTitle(link)}
  </a>
{:else if display === 'official'}
  <a
    href={link.url}
    target="_blank"
    rel="noreferrer noopener nofollow"
    class={`h-16 flex items-center justify-center p-4 md:p-2`}>
    <span class="visually-hidden">{linkTitle(link)}</span>
    <img
      class={`logo-${link.type}`}
      src={linkLogoSrc(link)}
      alt={`${link.type} logo`} />
  </a>
{/if}
