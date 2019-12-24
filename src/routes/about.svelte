<script>
  import Links from "../components/Links.svelte";
  import Image from "../components/Image.svelte";
  import { site } from "../data";
  import PromoPhotoGrid from "../components/PromoPhotoGrid.svelte";

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
</script>

<style>
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: center;
    align-items: center;
    grid-gap: 1rem;
  }

  .img-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .img-wrapper > img {
    /* position: absolute; */
    /* top: 0; */
    /* left: 0; */
    height: 200px;
    width: 100%;
    object-fit: cover;
  }
</style>

<svelte:head>
  <title>The Air on Earth | About</title>
  <meta name="description" content="History and bio" />
  <meta name="description" content="History and bio" />
  <meta property="og:description" content="History and bio" />
  <meta property="og:url" content="https://theaironearth.com/about" />
  <meta name="twitter:description" content="History and bio" />
</svelte:head>
<section class="ctr flex flex-col md:flex-row">
  <div class="mb-4 md:mr-8 md:-mx-6 md:w-3/5">
    <figure class="mb-4" style="max-width: none">
      <Image src="about" alt="Picture of Nick Ball from The Air on Earth" />
    </figure>
    <div class="hidden md:block">
      <PromoPhotoGrid />
    </div>
  </div>
  <div class="mb-12">
    <h2 class="small-caps">About</h2>
    <h3 class="mb-4 text-2xl leading-none">The Air on Earth</h3>
    <p class="mb-4 ">
      Recording as The Air on Earth, Nick Ball creates wandering, ambient pop
      music that's patient and immersive. Vocal harmonies, delayed guitars,
      drone-y synths, and found sound are often used to create intimate and
      expanding atmospheres. Long songs are not uncommon.
      <em>Good Sport</em>
      is the second full-length album and builds upon the first self-titled
      release with higher fidelity and an emphasis on vocal melodies.
    </p>
    <p class="mb-4">
      Nick was a member of the band
      <a href="https://scarey.org" class="decorated-link">S. Carey</a>, playing guitar and contributing to albums such as
      <em>All We Grow</em> and <em>Range of Light</em>. Nick has also contributed to albums from artists
      <a href="https://www.luraymusic.com/" class="decorated-link">Luray</a>
      and
      <a href="https://www.aeroflynn.org/" class="decorated-link">Aero Flynn</a>, and was a past touring member of the band
      <a href="https://www.aabondy.co/" class="decorated-link">A.A. Bondy</a>.
    </p>


    <p class="text-xs mt-6 mb-8">
      Audio streaming provided by
      <a class="decorated-link" href="https://soundcloud.com">Soundcloud</a>.
      Source code for this site available on <a class="decorated-link" href="https://github.com/npbee/theaironearth">GitHub</a>.
    </p>

    <h2 class="small-caps">Links</h2>
    <div class="-mx-4 -my-2">
    {#each Object.values(site.links) as link}
      <a class="decorated-link inline-block m-4" target="_blank" rel="noopener noreferrer nofollow" href="{link.url}">{linkTitle(link)}</a>
    {/each}
    </div>

  </div>
  <div class="md:hidden">
    <PromoPhotoGrid />
  </div>
</section>
