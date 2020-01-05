<script>
  import Links from "./Links.svelte";
  import { site } from "../data";
</script>


<footer class="ctr py-4">
  <Links
      links={[site.links.bandcamp, site.links.soundcloud, site.links.spotify]} />
</footer>
