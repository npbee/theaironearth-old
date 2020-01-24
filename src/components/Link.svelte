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
    class={`block w-32 p-4 md:p-2`}>
    <span class="visually-hidden">{linkTitle(link)}</span>
    <img src={linkLogoSrc(link)} alt={`${link.type} logo`} />
  </a>
{/if}
