import { useEffect, useState } from 'react';
import info from '../data/info.json';
import { useLanguage } from '../context/LanguageContext';

const spotify = info.spotify;
const POLL_MS = 30000;

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

  // Stay invisible until we know there's something to show — no layout jump,
  // no empty card on a page that's otherwise dense.
  if (!spotify?.endpoint || !loaded || !track?.isPlaying) return null;

  const pct = track.durationMs ? (track.progressMs / track.durationMs) * 100 : 0;

  return (
    <section id="listening">
      <div className="section-label">{t.section.listening}</div>

      <a
        className="sp-card"
        href={track.songUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {track.albumArt && (
          <img className="sp-art" src={track.albumArt} alt={track.album} />
        )}

        <div className="sp-body">
          <span className="sp-live">
            <span className="sp-bars" aria-hidden="true">
              <i /><i /><i />
            </span>
            {t.listening.now}
          </span>

          <h3 className="sp-title">{track.title}</h3>
          <p className="sp-artist">{track.artist}</p>

          <div className="sp-progress" aria-hidden="true">
            <div className="sp-progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </a>
    </section>
  );
}
