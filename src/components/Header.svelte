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

<header class="ctr py-4 mb-10">
  <div class="flex items-center justify-between flex-wrap">
    <nav class="links">
      <a href="/" class="logo">
        <h1 class="inline-block w-24">
          <span class="visually-hidden">The Air on Earth</span>
          <Logo />
        </h1>
      </a>
    </nav>
    <nav class="social">
      <Links
        links={[site.links.bandcamp, site.links.soundcloud, site.links.spotify]} />
    </nav>
  </div>
  <div>
    <a
      rel="prefetch"
      class={currentClass(segment, 'album', 'nav-link ml-2')}
      href="/albums">
      Albums
    </a>
    <a
      rel="prefetch"
      class={currentClass(segment, 'track', 'nav-link ml-2')}
      href="/tracks">
      Tracks
    </a>
    <a
      rel="prefetch"
      class={currentClass(segment, 'about', 'nav-link ml-2')}
      href="/about">
      About
    </a>
  </div>
</header>
