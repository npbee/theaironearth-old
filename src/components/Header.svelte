<script>
  import Logo from "./Logo.svelte";
  import Links from "./Links.svelte";
  import { site } from "../data";
  export let segment;

  function currentClass(segment, path, cls) {
    if (segment && segment.includes(path)) return `nav-link--current ${cls}`;
    return cls;
  }
</script>

<style>
  .grid > :global(*) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
</style>

<header class="ctr py-4 mb-4 md:mb-10">
  <div class="flex items-center justify-between flex-wrap">
    <nav class="links">
      <a href="/" class="logo block">
        <h1 class="inline-block w-24">
          <span class="visually-hidden">The Air on Earth</span>
          <Logo />
        </h1>
      </a>
    </nav>
    <nav class="grid">
      <Links
        links={[site.links.bandcamp, site.links.soundcloud, site.links.spotify]} />
    </nav>
  </div>
  <div class="flex md:block justify-between">
    <a
      rel="prefetch"
      class={currentClass(segment, 'album', 'nav-link inline-flex md:inline py-2 px-3 md:p-0 md:ml-2')}
      href="/albums">
      Albums
    </a>
    <a
      rel="prefetch"
      class={currentClass(segment, 'track', 'nav-link inline-flex md:inline py-2 px-3 md:p-0 md:ml-2')}
      href="/tracks">
      Tracks
    </a>
    <a
      rel="prefetch"
      class={currentClass(segment, 'about', 'nav-link inline-flex md:inline py-2 px-3 md:p-0 md:ml-2')}
      href="/about">
      About
    </a>
  </div>
</header>
