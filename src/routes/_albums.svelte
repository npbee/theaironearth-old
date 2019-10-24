<script>
  import PageTransition from "../components/PageTransition.svelte";
  import Links from "../components/Links.svelte";
  import { albums } from "../data";
</script>

<svelte:head>
  <title>The Air on Earth | Albums</title>
  <meta
    name="description"
    content="See all of the albums by The Air on Earth." />
</svelte:head>
<PageTransition>
  <section class="container flex flex-wrap justify-around">
    {#each Object.values(albums) as album}
      <div class="flex flex-col max-w-sm m-6">
        <a href={`/album/${album.id}`} class="mb-4">
          <img src={album.artwork} alt={`Album artwork for ${album.title}`} />
        </a>
        <time
          dateTime={album.date}
          class="text-xs text-grey-700 small-caps block">
          {album.date}
        </time>
        <div class="flex justify-between">
          <div>
            <a href={`/album/${album.id}`} class="hover:underline inline-block">
              <h2 class="headline text-3xl leading-tight text-grey-800">
                {album.title}
              </h2>
            </a>
          </div>
          <Links links={album.links} category="quick" />
        </div>
      </div>
    {/each}
  </section>
</PageTransition>
