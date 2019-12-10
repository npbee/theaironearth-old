const cache = {};

export async function streamUrlFor(trackId) {
  if (cache[trackId]) {
    return cache[trackId];
  }

  const url = await fetchStreamUrl(trackId);

  // eslint-disable-next-line
  cache[trackId] = url;

  return url;
}

export async function cloudinaryStreamUrlFor(trackId) {
  return `https://res.cloudinary.com/dhhjogfy6/video/upload/q_auto/v1575833694/audio/${trackId}.mp3`;
}

async function fetchStreamUrl(trackId) {
  const url = buildScUrl(
    `https://api.soundcloud.com/resolve?url=https://soundcloud.com/theaironearth/${trackId}`
  );

  const data = await fetch(url).then(res => res.json());

  return buildScUrl(data.stream_url);
}

const SC_CLIENT_ID = "287e0a470aceec7d505ab41e1892fddc";

function buildScUrl(baseUrl) {
  const url = new URL(baseUrl);

  url.searchParams.append("client_id", SC_CLIENT_ID);

  return url.href;
}
