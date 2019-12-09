<script>
  import Links from "../components/Links.svelte";
  import Image from "../components/Image.svelte";
  import { albums } from "../data";
</script>

<svelte:head>
  <title>The Air on Earth | Albums</title>
  <meta
    name="description"
    content="See all of the albums by The Air on Earth." />
</svelte:head>

<section class="ctr flex flex-col md:flex-row md:justify-around">
  {#each Object.values(albums) as album}
    <div
      class="flex flex-col md:flex-row md:items-center mb-16 md:mb-12 md:mr-8
      flex-1">
      <a
        href={`/album/${album.id}`}
        class="block w-full md:w-1/2 mb-6 mr-6 rounded-sm shadow ">
        <Image
          ratio="100%"
          src={album.artwork}
          alt={`Album artwork for ${album.title}`} />
      </a>
      <div>
        <time
          dateTime={album.date}
          class="text-sm text-grey-700 small-caps block">
          {album.date}
        </time>
        <a href={`/album/${album.id}`} class="hover:underline inline-block">
          <h2 class="headline text-3xl leading-none text-grey-800">
            {album.title}
          </h2>
        </a>
        <Links links={album.links} category="quick" />
      </div>
    </div>
  {/each}
</section>
