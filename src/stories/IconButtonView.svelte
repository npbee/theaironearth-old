<script>
  import IconButton from "../components/IconButton.svelte";
  import Soundcloud from "../components/icons/Soundcloud.svelte";
  export let children;
</script>

<IconButton on:click {...$$props}>
  <Soundcloud />
</IconButton>
