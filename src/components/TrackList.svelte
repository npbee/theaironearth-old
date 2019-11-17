<script>
  import PlayPause from "../player/components/PlayPause.svelte";
  import { onMount } from "svelte";

  export let tracks;
  export let store;

  // Workaround to support relative links in Sapper
  // I prefer linking to the relative location in the page, but sapper will
  // parse relative links and turn them into absolute links. So instead we
  // start by linking to the individual track page and then use JS to link
  // relatively. If JS is not available, we'll link to the standalone track
  // page
  onMount(async () => {
    [...document.querySelectorAll('a[href^="/track/"]')].map(x => {
      const trackId = x.href.replace(/.*\/track\//g, "");
      x.href = document.location.pathname + `#${trackId}`;
    });
  });
</script>

<style>
  a {
    display: flex;
    flex: 1;
    position: relative;
    justify-content: space-between;
    white-space: nowrap;
    text-decoration: none;
    align-items: center;
    position: relative;
  }
  li {
    display: flex;
  }
</style>

<ol>
  {#each tracks as track}
    <li class="mb-2">
      <div class="mr-1 flex mr-2">
        <PlayPause trackId={track.id} {store} size="xl" />
      </div>
      <a
        href={`/track/${track.id}`}
        class="border-dotted border-b-2 border-grey-600 hover:border-grey-700
        active:border-blue-600 trans">
        <span>{track.title}</span>
        <span>{track.length}</span>
      </a>
    </li>
  {/each}
</ol>
