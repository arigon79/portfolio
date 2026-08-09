// Vercel serverless function: returns what I'm currently playing on Spotify.
//
// Requires three environment variables, set in the Vercel dashboard (never in git):
//   SPOTIFY_CLIENT_ID
//   SPOTIFY_CLIENT_SECRET
//   SPOTIFY_REFRESH_TOKEN
//
// Run `node scripts/spotify-auth.mjs` locally once to mint the refresh token.

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing';

const ALLOWED_ORIGINS = [
  'https://www.arijichakma.com',
  'https://arijichakma.com',
  'http://localhost:5173',
];

async function requestAccessToken() {
  const basic = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
    }),
  });

  return res;
}

async function getAccessToken() {
  const res = await requestAccessToken();
  if (!res.ok) throw new Error(`token exchange failed: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

// Temporary: `?debug=1` reports which step fails without exposing any
// credential values — presence booleans and upstream status codes only.
async function debugReport() {
  const report = {
    hasClientId: Boolean(process.env.SPOTIFY_CLIENT_ID),
    hasClientSecret: Boolean(process.env.SPOTIFY_CLIENT_SECRET),
    hasRefreshToken: Boolean(process.env.SPOTIFY_REFRESH_TOKEN),
  };

  try {
    const tokenRes = await requestAccessToken();
    report.tokenStatus = tokenRes.status;

    const tokenBody = await tokenRes.json();
    report.tokenError = tokenBody.error ?? null;
    report.tokenErrorDescription = tokenBody.error_description ?? null;
    report.gotAccessToken = Boolean(tokenBody.access_token);
    report.grantedScopes = tokenBody.scope ?? null;

    if (tokenBody.access_token) {
      const np = await fetch(NOW_PLAYING_URL, {
        headers: { Authorization: `Bearer ${tokenBody.access_token}` },
      });
      report.nowPlayingStatus = np.status;
      report.currentlyPlayingType =
        np.status === 200 ? (await np.json()).currently_playing_type : null;
    }
  } catch (err) {
    report.threw = String(err.message);
  }

  return report;
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.query?.debug === '1') {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(await debugReport());
  }

  // Let the CDN absorb repeat visitors; 30s keeps it feeling live without
  // burning through Spotify's rate limit.
  res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');

  try {
    const token = await getAccessToken();

    const nowPlaying = await fetch(NOW_PLAYING_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // 204 = nothing playing. 202 shows up occasionally for the same reason.
    if (nowPlaying.status === 204 || nowPlaying.status === 202) {
      return res.status(200).json({ isPlaying: false });
    }

    if (!nowPlaying.ok) throw new Error(`now-playing failed: ${nowPlaying.status}`);

    const song = await nowPlaying.json();

    // Podcast episodes come back with a null `item` shape we can't map.
    if (!song.item || song.currently_playing_type !== 'track') {
      return res.status(200).json({ isPlaying: false });
    }

    return res.status(200).json({
      isPlaying: song.is_playing,
      title: song.item.name,
      artist: song.item.artists.map((a) => a.name).join(', '),
      album: song.item.album.name,
      albumArt: song.item.album.images[0]?.url ?? null,
      songUrl: song.item.external_urls.spotify,
      progressMs: song.progress_ms,
      durationMs: song.item.duration_ms,
    });
  } catch (err) {
    console.error(err);
    return res.status(200).json({ isPlaying: false });
  }
}
