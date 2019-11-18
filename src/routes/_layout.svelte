<script>
  import Header from "../components/Header.svelte";
  import Footer from "../components/Footer.svelte";
  import LoadingBar from "../components/LoadingBar.svelte";
  import { store } from "../player/store";
  import { fade } from "svelte/transition";
  import { stores } from "@sapper/app";

  const { preloading } = stores();

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

<LoadingBar {preloading} />

<div class="background-attachment" />

<Header {segment} />

{#if !$preloading}
  <main class="mb-16" transition:fade={{ duration: 150 }}>
    <slot />
  </main>
{/if}

<Footer {store} />
