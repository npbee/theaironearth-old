<script>
  import PlayPause from "../player/components/PlayPause.svelte";
  import Cover from "../player/components/Cover.svelte";
  import Links from "../components/Links.svelte";
  import { albums } from "../data";
  import { cloudinaryUrl } from "../utils";

  let album = albums["good-sport"];
</script>

<svelte:head>
  <title>The Air on Earth</title>
  <meta
    name="description"
    content="Ambient/pop/electronic music project based in San Francisco" />
  <meta
    property="og:description"
    content="Ambient/pop/electronic music project based in San Francisco" />
  <meta property="og:url" content="https://theaironearth.com" />
  <meta
    name="twitter:description"
    content="Ambient/pop/electronic music project based in San Francisco" />
</svelte:head>
<div
  class="flex flex-col md:flex-row justify-between items-center ctr md:flex-1">
  <section
    class="justify-center mb-16 mt-12 md:mt-24 md:ml-24 flex flex-col md:flex-1
    relative">
    <div
      class=" absolute -ml-24 -mt-12 md:-mt-24 opacity-50"
      style="width: 200px; top: 0; left: 0; z-index: 0;">
      <img
        src={cloudinaryUrl('w_200', 'artwork/good-sport-white-overlay')}
        alt="Album artwork for 'Good Sport'" />
    </div>
    <p class="small-caps text-sm md:text-base mb-1 text-grey-400">
      The Air on Earth
    </p>
    <h2
      class="text-5xl md:text-6xl mb-8 text-grey-500 leading-none font-normal">
      Good Sport
    </h2>
    <p class="text-sm text-grey-500 leading-loose md:ml-8 mb-4">
      <em>Good Sport</em>
      is the second full-length album under The Air on Earth. It was recorded
      over a year-long period both at home and at Tiny Telephone studios in San
      Francisco. Primarily constrained to headphones, the album explores
      synthesizers, electronic percussion, and finely detailed ambient noise in
      combination with pianos, layered vocals, and found sound.
    </p>

    <a
      href={`/album/${album.id}`}
      class="font-semibold md:ml-8 text-sm text-grey-500 mb-8 flex
      items-baseline">
      <span>Read More</span>
      <span class="flex">
        <svg
          class="ml-1"
          xmlns="http://www.w3.org/2000/svg"
          width="8"
          height="8"
          viewBox="0 0 12 12">
          <title>arrow-right</title>
          <g fill="currentColor">
            <path
              d="M11.707,5.293,7,.586,5.586,2l3,3H0V7H8.586l-3,3L7,11.414l4.707-4.707A1,1,0,0,0,11.707,5.293Z"
              fill="currentColor" />
          </g>
        </svg>
      </span>
    </a>
    <p class="md:ml-8">
      <Links links={album.links} display="official" presentation="stacked" />
    </p>
  </section>
  <div class="md:flex-1 flex flex-col justify-center items-center">
    <!--<div class="w-1/2">
      <Cover {album} trackId="recur" />
    </div>-->
    <div
      class="md:flex-1 flex justify-center items-center text-6xl md:text-6xl">
      <PlayPause trackId="recur" />
      <p class="text-lg ml-8 small-caps">Play 'Recur'</p>
    </div>
  </div>
</div>
