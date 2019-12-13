<script>
  import Cover from "../player/components/Cover.svelte";
  import Links from "../components/Links.svelte";
  import { albums } from "../data";

  let album = albums["good-sport"];
</script>

<svelte:head>
  <title>The Air on Earth</title>
  <meta name="description" content="Home page for the band The Air on Earth." />
</svelte:head>

<div
  class="flex flex-col md:flex-row px-8 ctr mx-auto justify-between items-center
  h-full">
  <div
    class="relative flex-1 w-full flex items-center md:justify-end md:mr-16 mb-8
    md:mb-0">
    <div class="md:max-w-sm w-full">
      <Cover {album} trackId="rest" />
    </div>
  </div>
  <section class="flex-1 w-full mt-16">
    <p class="small-caps text-xs mb-0">New Album</p>
    <h1 class="text-4xl leading-none mb-0 text-grey-700">Good Sport</h1>
    <Links links={album.links} />
  </section>
</div>
