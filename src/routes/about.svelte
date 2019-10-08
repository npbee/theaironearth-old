<script>
  import PageTransition from "../components/PageTransition.svelte";
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

<PageTransition>
  <section class="ctr flex flex-col md:flex-row">
    <figure class="mb-4 md:mr-8 md:-mx-6 md:w-3/5" style="max-width: none">
      <Image src="me" alt="The Air on Earth promotional picture" />
    </figure>
    <div>
      <h2 class="small-caps">About</h2>
      <h3 class="mb-4 text-2xl leading-none">The Air on Earth</h3>
      <p class="mb-6">
        Consectetur cum placeat quas quo hic Dolore itaque dicta corporis
        officia velit est. Ab minus magni cupiditate sunt accusamus Amet
        provident fugiat inventore dolores consectetur quam, numquam! Illum ab
        odit. Consectetur culpa debitis temporibus reprehenderit sequi Est aut
        officia fuga similique rem? Ipsam rem veritatis maxime reprehenderit
        quia in hic quos. Minima libero mollitia aperiam dolorum architecto
        tempora Numquam perspiciatis Dolor doloribus molestias sunt nemo facilis
        reprehenderit Nam commodi libero labore velit aut voluptates Deserunt
        accusamus deserunt est odio magni? Nostrum repellendus eveniet labore
        distinctio quibusdam exercitationem. Vitae debitis doloribus
      </p>
      <p class="mb-6">
        Consectetur cum placeat quas quo hic Dolore itaque dicta corporis
        officia velit est. Ab minus magni cupiditate sunt accusamus Amet
        provident fugiat inventore dolores consectetur quam, numquam! Illum ab
        odit. Consectetur culpa debitis temporibus reprehenderit sequi Est aut
        officia fuga similique rem? Ipsam rem veritatis maxime reprehenderit
        quia in hic quos. Minima libero mollitia aperiam dolorum architecto
        tempora Numquam perspiciatis Dolor doloribus molestias sunt nemo facilis
        reprehenderit Nam commodi libero labore velit aut voluptates Deserunt
        accusamus deserunt est odio magni? Nostrum repellendus eveniet labore
        distinctio quibusdam exercitationem. Vitae debitis doloribus
      </p>

      <Links links={Object.values(site.links)} />

    </div>
  </section>
</PageTransition>
