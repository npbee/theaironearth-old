<script>
  import Header from "../components/Header.svelte";
  import Footer from "../components/Footer.svelte";
  import LoadingBar from "../components/LoadingBar.svelte";
  import { store } from "../player/store";
  import { fade } from "svelte/transition";
  import { stores } from "@sapper/app";
  import SvgSprite from "../components/Icons.svelte";

  const { preloading } = stores();

  export let segment;
</script>

<svelte:head>
  <meta
    name="viewport"
    content="initial-scale=1.0, width=device-width"
    key="viewport" />
</svelte:head>

<SvgSprite />

<LoadingBar {preloading} />

<div class="background-attachment" />

<Header {segment} />

<main class="mb-16" transition:fade={{ duration: 150 }}>
  <slot />
</main>

<Footer {store} />
