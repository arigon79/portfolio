import { useEffect, useState } from 'react';
import info from '../data/info.json';
import { useLanguage } from '../context/LanguageContext';

const spotify = info.spotify;
const POLL_MS = 30000;

function formatTime(ms) {
  if (typeof ms !== 'number') return '0:00';
  const total = Math.floor(ms / 1000);
  const min = Math.floor(total / 60);
  const sec = String(total % 60).padStart(2, '0');
  return `${min}:${sec}`;
}

export default function Spotify() {
  const { t } = useLanguage();
  const [track, setTrack] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!spotify?.endpoint) return;

    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(spotify.endpoint);
        const data = await res.json();
        if (!cancelled) setTrack(data);
      } catch {
        if (!cancelled) setTrack({ isPlaying: false });
      } finally {
        if (!cancelled) setLoaded(true);
      }
    };

    load();
    const id = setInterval(load, POLL_MS);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  // Nothing playing means nothing to show — the photo column just ends at the
  // portrait, same as before this existed.
  if (!spotify?.endpoint || !loaded || !track?.isPlaying) return null;

  const pct = track.durationMs ? (track.progressMs / track.durationMs) * 100 : 0;

  return (
    <a
      className="sp-card"
      href={track.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={`${track.title} — ${track.artist}`}
      // The artwork doubles as the card's ambient wash, so each track tints it.
      style={track.albumArt ? { '--sp-art': `url(${track.albumArt})` } : undefined}
    >
      <span className="sp-wash" aria-hidden="true" />

      <span className="sp-head">
        <span className="sp-live">
          <span className="sp-bars" aria-hidden="true">
            <i /><i /><i />
          </span>
          {t.listening.now}
        </span>

        <svg className="sp-logo" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.586 14.424a.623.623 0 0 1-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.623.623 0 1 1-.277-1.215c3.809-.871 7.077-.496 9.712 1.115a.623.623 0 0 1 .207.857zm1.223-2.722a.78.78 0 0 1-1.072.257c-2.688-1.652-6.786-2.131-9.965-1.166a.78.78 0 1 1-.452-1.492c3.632-1.102 8.147-.568 11.232 1.329a.78.78 0 0 1 .257 1.072zm.105-2.835c-3.223-1.914-8.54-2.09-11.617-1.156a.935.935 0 1 1-.543-1.79c3.532-1.072 9.404-.865 13.115 1.338a.936.936 0 0 1-.955 1.608z" />
        </svg>
      </span>

      <span className="sp-row">
        {track.albumArt && (
          <span className="sp-art-wrap">
            <img className="sp-art" src={track.albumArt} alt={track.album} />
          </span>
        )}

        <span className="sp-body">
          <span className="sp-title">{track.title}</span>
          <span className="sp-artist">{track.artist}</span>
        </span>
      </span>

      <span className="sp-foot">
        <span className="sp-progress" aria-hidden="true">
          <span className="sp-progress-fill" style={{ width: `${pct}%` }} />
        </span>
        <span className="sp-times">
          <span>{formatTime(track.progressMs)}</span>
          <span>{formatTime(track.durationMs)}</span>
        </span>
      </span>
    </a>
  );
}
