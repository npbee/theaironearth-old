<script>
  import Link from './Link.svelte';
  export let links;
  export let category = "quick";

  const quickLinks = links.filter(link => link.type !== "apple-music");
  const filteredLinks = category === "quick" ? quickLinks : links;
</script>

<style>
  a.apple-music {
    width: 64px;
  }
</style>

<div class="-mx-4 -my-2 md:my-auto md:-mx-2 flex items-center flex-wrap">
  {#each filteredLinks as link, i}
    <Link link={link} />
  {/each}
</div>
