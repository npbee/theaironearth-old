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
      <Cover {album} trackId="recur" />
    </div>
  </div>
  <section class="flex-1 w-full">
    <p class="small-caps text-sm mb-0">New Album</p>
    <h1 class="text-4xl leading-none mb-0">Good Sport</h1>
    <h2 class="text-md">January 24, 2020</h2>
    <div class="">
      <Links links={album.links} />
    </div>
  </section>
</div>
