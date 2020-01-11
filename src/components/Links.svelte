<script>
  import Link from "./Link.svelte";
  export let links;
  export let display;
  export let category = "quick";
  export let presentation = "row";

  const quickLinks = links.filter(link => link.type !== "apple-music");
  const filteredLinks = category === "quick" ? quickLinks : links;

  const cls = ["-mx-4", "-my-2", "md:my-auto", "md:-mx-2", "flex", "flex-wrap"]
    .concat(presentation === "stacked" ? ["flex-col"] : ["items-center"])
    .join(" ");
</script>

<div class={cls}>
  {#each filteredLinks as link, i}
    <Link {link} {display} />
  {/each}
</div>
