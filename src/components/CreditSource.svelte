<script>
  export let source;

  const sources = Array.isArray(source) ? source : [source];
</script>

{#each sources as source, idx}
  {#if source.link}
    <a
      class="source decorated-link"
      rel="noreferrer noopener nofollow"
      target="_blank"
      href={source.link}>
      {source.name}
    </a>
    <span class="mr-1">
      {#if idx < sources.length - 1},{/if}
    </span>
  {:else}
    <span class="source">{source.name}</span>
    <span class="mr-1">
      {#if idx < sources.length - 1},{/if}
    </span>
  {/if}
{/each}
