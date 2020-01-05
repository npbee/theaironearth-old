<script>
  import Logo from "./Logo.svelte";
  import Links from "./Links.svelte";
  import MiniPlayer from "../player/components/Mini.svelte";
  import { site } from "../data";
  import { onMount } from "svelte";
  export let segment;

  function currentClass(segment, path, cls) {
    if (segment && segment.includes(path)) return `nav-link--current ${cls}`;
    return cls;
  }

  let stickySentinel;
  let scrolled = false;
  let header;

  function observeSticky(el) {
    const observer = new IntersectionObserver(records => {
      for (const record of records) {
        const rect = record.boundingClientRect;
        if (rect.y < 0) {
          scrolled = true;
        } else {
          scrolled = false;
        }
      }
    });

    observer.observe(el);
  }

  onMount(() => {
    observeSticky(stickySentinel);
  });
</script>

<style>
  header {
    transition: background-color 200ms, box-shadow 200ms;
    z-index: 10;
  }

  .scrolled {
    background: white;
  }
  .grid > :global(*) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  .sticky-sentinel {
    left: 0;
    right: 0;
    visibility: hidden;
  }
</style>

<span bind:this={stickySentinel} class="sticky-sentinel" />
<header
  class={`top-0 sticky py-3 mb-6 md:mb-10 ${scrolled ? 'bg-white-trans shadow' : ''}`}
  bind:this={header}>
  <div class="ctr">
    <div class="flex items-center justify-between flex-wrap">
      <nav class="links">
        <a href="/" class="logo block">
          <h1 class="inline-block w-24">
            <span class="visually-hidden">The Air on Earth</span>
            <Logo />
          </h1>
        </a>
      </nav>
      <MiniPlayer />
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
  </div>
</header>
