<script>
  import QuickLinks from "../components/Links.svelte";
  import Image from "../components/Image.svelte";
  import { albums } from "../data";

  const album = albums["the-air-on-earth"];
</script>

<svelte:head>
  <title>The Air on Earth</title>
  <meta name="description" content="Home page for the band The Air on Earth." />
</svelte:head>

<section class="">
  <div style="width: 75%;" class="mb-6">
    <Image src="me" alt="Image of me" />
  </div>
  <div class="ctr">
    <p dateTime={album.date} class="text-sm text-grey-400 small-caps">
      New Album
    </p>
    <h2 class="leading-none text-4xl">{album.title}</h2>
    <QuickLinks links={album.links} />
  </div>
</section>
