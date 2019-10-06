<script>
  export let album;
  export let className = "";
</script>

<p class={`text-sm ${className}`}>
  from
  <a class="decorated-link" href={`/album/${album.id}`}>
    <em>{album.title}</em>
  </a>
</p>
