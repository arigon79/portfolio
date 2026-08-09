// One-time helper: mints a Spotify refresh token for the now-playing endpoint.
//
// Usage (PowerShell):
//   $env:SPOTIFY_CLIENT_ID="..."; $env:SPOTIFY_CLIENT_SECRET="..."; node scripts/spotify-auth.mjs
//
// Your app's Spotify dashboard must list this exact redirect URI:
//   http://127.0.0.1:8888/callback
//
// The token it prints goes into Vercel's env vars. Nothing is written to disk.

import http from 'node:http';
import { randomBytes } from 'node:crypto';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = 'http://127.0.0.1:8888/callback';
const SCOPE = 'user-read-currently-playing user-read-playback-state';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.');
  process.exit(1);
}

const state = randomBytes(16).toString('hex');

const authUrl =
  'https://accounts.spotify.com/authorize?' +
  new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPE,
    redirect_uri: REDIRECT_URI,
    state,
  });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname !== '/callback') return res.writeHead(404).end();

  const code = url.searchParams.get('code');
  const returnedState = url.searchParams.get('state');

  if (returnedState !== state) {
    res.writeHead(400).end('State mismatch — aborted.');
    console.error('State mismatch. Start over.');
    return server.close(() => process.exit(1));
  }

  if (!code) {
    res.writeHead(400).end('No code returned.');
    return server.close(() => process.exit(1));
  }

  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const data = await tokenRes.json();

  if (!data.refresh_token) {
    res.writeHead(500).end('No refresh token. Check the console.');
    console.error(data);
    return server.close(() => process.exit(1));
  }

  res.writeHead(200, { 'Content-Type': 'text/html' })
     .end('<h2>Done — check your terminal, then close this tab.</h2>');

  console.log('\nSPOTIFY_REFRESH_TOKEN=\n' + data.refresh_token + '\n');
  console.log('Paste that into Vercel as an environment variable.');
  server.close(() => process.exit(0));
});

server.listen(8888, '127.0.0.1', () => {
  console.log('Open this URL in your browser to authorize:\n');
  console.log(authUrl + '\n');
  console.log('Waiting on http://127.0.0.1:8888/callback ...');
});
