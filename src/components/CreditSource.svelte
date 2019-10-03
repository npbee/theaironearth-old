<script>
  export let source;
</script>

{#if source.link}
  <a
    class="decorated-link"
    rel="noreferrer noopener nofollow"
    target="_blank"
    href={source.link}>
    {source.name}
  </a>
{:else}
  <span>{source.name}</span>
{/if}
