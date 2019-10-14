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
  {:else}
    <span class="source">{source.name}</span>
  {/if}
  {#if idx !== sources.length - 1}
    <span>,&nbsp;</span>
  {/if}
{/each}
