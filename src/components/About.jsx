import { useState } from 'react';
import info from '../data/info.json';
import Spotify from './Spotify';
import { useLanguage } from '../context/LanguageContext';

const SPOTIFY_EMBED = info.about.spotifyEmbed;

export default function About() {
  const { t } = useLanguage();
  const facts = t.about.facts ?? [];
  const [factsVisible, setFactsVisible] = useState(false);
  const [factRun, setFactRun] = useState(0);

  const revealFacts = () => {
    setFactsVisible(false);
    window.setTimeout(() => {
      setFactRun((run) => run + 1);
      setFactsVisible(true);
    }, 20);
  };

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

          {facts.length > 0 && (
            <div className={`about-facts${factsVisible ? ' is-open' : ''}`}>
              <button
                type="button"
                className="about-facts-trigger"
                onClick={revealFacts}
                aria-expanded={factsVisible}
              >
                {t.about.factTrigger}
              </button>

              <ul className="about-facts-list" aria-label="Interesting facts">
                {facts.map((fact, idx) => (
                  <li
                    key={`${fact}-${factRun}`}
                    className="about-facts-item"
                    style={{ '--fact-index': idx }}
                  >
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
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
    </section>
  );
}
