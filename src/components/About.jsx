import info from '../data/info.json';
import Spotify from './Spotify';
import TypingGreeting from './TypingGreeting';
import { useLanguage } from '../context/LanguageContext';

const SPOTIFY_EMBED = info.about.spotifyEmbed;
const LINKED_TEXT_RE = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;

function renderLinkedText(text) {
  const nodes = [];
  let lastIndex = 0;

  for (const match of text.matchAll(LINKED_TEXT_RE)) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    nodes.push(
      <a key={`${match[1]}-${match.index}`} href={match[2]} target="_blank" rel="noopener noreferrer">
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export default function About({ children }) {
  const { t } = useLanguage();

  return (
    <section id="about" className="research-profile" aria-labelledby="profile-name">
      <div className="research-profile-main">
        <div className="research-profile-copy">
          <h1 id="profile-name" className="sr-only">{info.profile.name}</h1>
          <p className="research-eyebrow">{t.researchProfile.eyebrow}</p>
          <TypingGreeting />
          <div className="research-bio">
            {t.about.bio.slice(0, 2).map((line, idx) => (
              <p key={idx}>{renderLinkedText(line)}</p>
            ))}
          </div>
          <div className="research-focus" aria-label={t.researchProfile.focusLabel}>
            <span className="research-focus-label">{t.researchProfile.focusLabel}</span>
            <ul>
              {t.researchProfile.focusAreas.map((area) => <li key={area}>{area}</li>)}
            </ul>
          </div>
          {children}
          <details className="research-personal">
            <summary>{t.researchProfile.beyond}</summary>
            {t.about.bio.slice(2).map((line, idx) => <p key={idx}>{renderLinkedText(line)}</p>)}
            <ul>{t.about.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
          </details>
        </div>
        <div className="research-portrait-col">
          <div className="research-portrait-frame">
            <img src={info.about.photo} alt="Ariji Chakma" className="research-portrait" />
            <span className="research-portrait-mark" aria-hidden="true">FIG. 00</span>
          </div>
          <p className="research-portrait-caption">{t.researchProfile.portraitCaption}</p>
          <Spotify />
        </div>
      </div>
      <a href="#research" className="research-scroll-cue">
        {t.researchProfile.seePublications}
        <span className="research-scroll-cue-arrow" aria-hidden="true">↓</span>
      </a>
      {SPOTIFY_EMBED && (
        <div className="about-spotify">
          <iframe src={SPOTIFY_EMBED} width="100%" height="152" frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy" title="Spotify playlist" />
        </div>
      )}
    </section>
  );
}
