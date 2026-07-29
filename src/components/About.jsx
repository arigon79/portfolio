import info from '../data/info.json';
import { useLanguage } from '../context/LanguageContext';

const SPOTIFY_EMBED = info.about.spotifyEmbed;

export default function About() {
  const { t } = useLanguage();

  return (
    <div id="about" className="about-wrap">
      <div className="about-photo-col">
        <div className="about-frame about-frame--static">
          <img src={info.about.photo} alt="Ariji Chakma" className="about-photo" />
        </div>
      </div>

      <div className="about-text-col">
        <div className="section-label">{t.section.about}</div>
        <div className="bio">
          {t.about.bio.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

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
      </div>
    </div>
  );
}
