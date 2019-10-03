<script>
  import { onMount } from "svelte";

  // Only do transitions if we have client-side JS running
  let show = typeof window !== "undefined" ? false : true;

  onMount(() => {
    show = true;
  });

  function trans(node, params) {
    return {
      delay: params.delay || 0,
      duration: params.duration || 400,
      css: (t, u) => {
        const x = 20 * u * -1;
        return `transform: translateX(${x}px); opacity: ${t}`;
      },
    };
  }
</script>

{#if show}
  <div in:trans={{ duration: 200, delay: 200 }} out:trans={{ duration: 200 }}>
    <slot />
  </div>
{/if}
