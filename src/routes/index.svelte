<script>
  import Cover from "../player/components/Cover.svelte";
  import Links from "../components/Links.svelte";
  import { albums } from "../data";
  import { cloudinaryUrl } from "../utils";

  let album = albums["good-sport"];
</script>

<style>
  .link-grid > :global(*):not(p) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 8px;
    align-items: center;
    border-color: inherit;
  }

  .link-grid > :global(*) > :global(*) {
    border: 1px solid;
    border-radius: 4px;
    border-right: 1px solid;
    border-bottom: 1px solid;
    border-color: inherit;
    background: linear-gradient(
        0deg,
        rgba(243, 233, 233, 0.4),
        rgba(255, 251, 251, 0.4)
      ),
      #fff;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transition-property: transform;
    transition-duration: 200ms;
  }

  .link-grid > :global(*) > :global(*):hover {
    transform: translateY(-1px);
  }
</style>

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
    class="justify-center mb-16 mt-12 md:mt-24 md:ml-24 md:mr-8 flex flex-col
    md:flex-1 relative">
    <div
      class=" absolute -ml-24 -mt-12 md:-mt-24 opacity-50"
      style="width: 150px; top: 0; left: 0; z-index: 0;">
      <img
        src={cloudinaryUrl('w_150', 'artwork/good-sport-white-overlay')}
        alt="Album artwork for 'Good Sport'" />
    </div>
    <p
      class="small-caps text-sm md:text-base mb-1 text-grey-400"
      style="z-index: 1">
      The Air on Earth
    </p>
    <h2
      class="text-4xl mb-4 text-grey-500 leading-none font-normal"
      style="z-index: 1">
      Good Sport
    </h2>
    <p
      class="text-sm text-grey-500 leading-loose md:ml-8 mb-4"
      style="z-index: 1">
      <em>Good Sport</em>
      is the second full-length album under The Air on Earth. Recorded over a
      year-long period both at home and at Tiny Telephone studios in San
      Francisco, the album explores synthesizers, electronic percussion, and
      finely detailed ambient noise in combination with pianos, layered vocals,
      and found sound.
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
    <div class="link-grid border-pink-200 mt-4 max-w-md">
      <Links
        links={album.links}
        display="official"
        presentation="stacked"
        category="all" />
    </div>
  </section>
  <div
    class="md:flex-1 w-full flex flex-col justify-center items-center md:ml-8">
    <div class="w-full max-w-md md:max-w-xs">
      <Cover {album} trackId="recur" />
    </div>
  </div>
</div>
