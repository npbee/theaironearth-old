<script>
  import PlayPause from "../player/components/PlayPause.svelte";
  export let tracks;
  export let store;
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
        <PlayPause trackId={track.id} {store} size="3xl" />
      </div>
      <a
        href={`/track/${track.id}`}
        class="border-dotted border-b-2 border-grey-100">
        <span>{track.title}</span>
        <span>{track.length}</span>
      </a>
    </li>
  {/each}
</ol>
