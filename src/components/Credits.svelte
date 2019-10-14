<script>
  import CreditSource from "./CreditSource.svelte";

  export let credits;
</script>

{#each credits as credit}
  <section class="mb-4">
    <strong>
      {@html credit.credit}
    </strong>
    <div class="flex flex-wrap">
      <CreditSource source={credit.source} />
    </div>
  </section>
{/each}
