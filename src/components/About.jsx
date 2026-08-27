import info from '../data/info.json';
import Spotify from './Spotify';
import { useLanguage } from '../context/LanguageContext';

const SPOTIFY_EMBED = info.about.spotifyEmbed;

export default function About() {
  const { t } = useLanguage();
  const nowItems = t.about.now?.items ?? [];

  return (
    <section id="about">
      <div className="about-main">
        <div className="about-photo-col">
          <div className="about-photo-wrap">
            <div className="about-frame about-frame--static">
              <img src={info.about.photo} alt="Ariji Chakma" className="about-photo" />
            </div>
          </div>

          <Spotify />
        </div>

        <div className="about-text-col">
          <div className="section-label">{t.section.about}</div>
          <div className="bio">
            {t.about.bio.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </div>

      {nowItems.length > 0 && (
        <div className="about-ticker-wrap">
          <div className="about-ticker-label">
            <span className="about-now-dot" aria-hidden="true" />
            <span>{t.about.now.label}</span>
          </div>

          <div className="about-ticker-track">
            <div className="about-ticker-content">
              {nowItems.concat(nowItems).map((item, idx) => (
                <div key={`${item}-${idx}`} className="about-ticker-pill">
                  <span className="about-ticker-pill-dot" aria-hidden="true" />
                  <span className="about-ticker-pill-text">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {SPOTIFY_EMBED && (
        <div className="about-spotify">
          <iframe
            style={{ borderRadius: '12px' }}
            src={SPOTIFY_EMBED}
            width="100%"
            height="152"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify playlist"
          />
        </div>
      )}
    </section>
  );
}
