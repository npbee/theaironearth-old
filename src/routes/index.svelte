<script>
  import Cover from "../player/components/Cover.svelte";
  import Links from "../components/Links.svelte";
  import { albums } from "../data";

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

<div class="flex flex-col px-8 ctr mx-auto justify-between items-center h-full">
  <section
    class="w-full mb-8 w-full md:max-w-sm flex items-end justify-between">
    <div>
      <p class="small-caps text-xs mb-0">New Album</p>
      <h1 class="text-4xl leading-none mb-0 text-grey-700">Good Sport</h1>
    </div>
    <Links links={album.links} />
  </section>
  <div class="md:max-w-sm w-full">
    <Cover {album} trackId="recur" />
  </div>
</div>
