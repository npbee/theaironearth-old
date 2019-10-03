<script>
  export let album;
</script>

<p class="text-sm">
  from
  <a class="decorated-link" href={`/album/${album.id}`}>
    <em>{album.title}</em>
  </a>
</p>
