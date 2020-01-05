<script>
  import Links from "./Links.svelte";
  import { site } from "../data";
</script>


<footer class="ctr py-4 flex justify-center opacity-75">
  <Links
      links={[site.links.bandcamp, site.links.soundcloud, site.links.spotify]} />
</footer>
