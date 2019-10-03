const cache = {};

const isDev = process.env.NODE_ENV === "development";

export async function streamUrlFor(trackId) {
  if (cache[trackId]) {
    return cache[trackId];
  }

  const url = await fetchStreamUrl(trackId);

  // eslint-disable-next-line
  cache[trackId] = url;

  return url;
}

async function fetchStreamUrl(trackId) {
  if (isDev) return `/audio/the-air-on-earth/${trackId}.mp3`;

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
