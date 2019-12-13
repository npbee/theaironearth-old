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
    <Image src="about" alt="Picture of Nick Ball from The Air on Earth" />
  </figure>
  <div>
    <h2 class="small-caps">About</h2>
    <h3 class="mb-4 text-2xl leading-none">The Air on Earth</h3>
    <p class="mb-4 ">
      The Air on Earth is a musical project by Nick Ball. Influences include
      <a class="decorated-link" href="https://www.talktalk.co.uk/">Talk Talk</a>,
      <a href="https://www.radiohead.com/deadairspace" class="decorated-link">Radiohead</a>,
      <a href="http://www.explosionsinthesky.com/" class="decorated-link">Explosions in the Sky</a>,
      <a href="https://sigurros.com/" class="decorated-link">Sigur Rós</a>,
      <a href="http://www.halloweenalaska.com/" class="decorated-link">Halloween, Alaska</a>,
      <a href="http://www.americanfootballmusic.com/" class="decorated-link">American Football</a>,
      <a href="http://www.jonhopkins.co.uk/" class="decorated-link">Jon Hopkins</a>,
      and <a href="https://boniver.org/" class="decorated-link">Bon Iver</a>.
      You'll hear vocal harmonies, delayed guitars, drone-y synths, pianos,
      electronic drums, found percussion, and sometimes even trombones. Long
      songs are not uncommon.
    </p>
    <p class="mb-4">
      Nick was a member of the band
      <a href="https://scarey.org" class="decorated-link">S. Carey</a>,
      playing guitar and contributing to albums such as
      <em>All We Grow</em> and <em>Range of Light</em>.
      Nick has also contributed to albums from artists
      <a href="https://www.luraymusic.com/" class="decorated-link">Luray</a>
      and
      <a href="https://www.aeroflynn.org/" class="decorated-link">Aero Flynn</a>,
      and was a past touring member of the band
      <a href="https://www.aabondy.co/" class="decorated-link">A.A. Bondy</a>.
    </p>

    <Links links={Object.values(site.links)} />

    <p class="text-xs mt-6">
    Audio streaming provided by <a class="decorated-link" href="https://soundcloud.com">Soundcloud</a>.
      Source code for this site available on <a class="decorated-link" href="https://github.com/npbee/theaironearth">GitHub</a>.
    </p>

  </div>
</section>
