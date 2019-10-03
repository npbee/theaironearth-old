<script>
  import Header from "../components/Header.svelte";
  import Footer from "../components/Footer.svelte";
  import { store } from "../player/store";

  export let segment;
</script>

<style>
  :global(.root) {
    display: flex;
    flex-direction: column;
  }
  :global(footer),
  :global(header) {
    flex-grow: 0;
  }
  main {
    flex-grow: 1;
  }
</style>

<svelte:head>
  <meta
    name="viewport"
    content="initial-scale=1.0, width=device-width"
    key="viewport" />
</svelte:head>

<Header {segment} />
<main class="mb-16">
  <slot />
</main>

<Footer {store} />
