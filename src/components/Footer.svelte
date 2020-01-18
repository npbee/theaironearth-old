<script>
  import Links from "./Links.svelte";
  import { site } from "../data";
</script>

<footer class="ctr py-4 flex justify-between items-center opacity-75">
  <Links
    links={[site.links.bandcamp, site.links.soundcloud, site.links.spotify]} />
  <a href="/" class="text-xs">&copy; The Air on Earth</a>
</footer>
