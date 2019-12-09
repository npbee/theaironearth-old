<script>
  export let album;
  export let className = "text-sm ";
</script>

<p class={className}>
  from
  <a class="decorated-link" href={`/album/${album.id}`}>
    <em>{album.title}</em>
  </a>
</p>
