<script>
  import Links from "../components/Links.svelte";
  import Image from "../components/Image.svelte";
  import { site } from "../data";
</script>

<svelte:head>
  <title>The Air on Earth | About</title>
  <meta
    name="description"
    content="History and motivations about the band and project The Air on Earth" />
</svelte:head>

<section class="ctr flex flex-col md:flex-row">
  <figure class="mb-4 md:mr-8 md:-mx-6 md:w-3/5" style="max-width: none">
    <Image src="me" alt="The Air on Earth promotional picture" />
  </figure>
  <div>
    <h2 class="small-caps">About</h2>
    <h3 class="mb-4 text-2xl leading-none">The Air on Earth</h3>
    <p class="mb-6 " style="xbackground-color: rgba(255, 255, 255, 0.5)">
      <em>The Air on Earth</em>
      is a musical project by Nick Ball. The project attempts a wide range of
      genres with influences from artists like Explosions and the Sky, Sigur
      Rós, Radiohead, Jon Hopkins, Bon Iver, and many more. Within minimal
      arrangments, ambience, and long songs you'll hear delayed guitars, drone-y
      synths, electronic drums, pianos, and found percussion sounds. The music
      will age with the person but the project will stay the same.
    </p>
    <p class="mb-6">
      Nick was a member of the band
      <a href="https://scarey.org" class="decorated-link">S. Carey</a>
      , playing guitar and contributing to albums including
      <em>All We Grow</em>
      and
      <em>Range of Light</em>
      . Nick has also contributed to music from artists
      <a href="https://www.luraymusic.com/" class="decorated-link">Luray</a>
      and
      <a href="https://www.aeroflynn.org/" class="decorated-link">Aero Flynn</a>
      , and was a past touring member of the band
      <a href="https://www.aabondy.co/" class="decorated-link">A.A. Bondy</a>
      <span>.</span>
    </p>

    <Links links={Object.values(site.links)} />

  </div>
</section>
