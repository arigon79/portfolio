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
            <svg className="portrait-orbit" viewBox="0 0 220 220" aria-hidden="true">
              <defs>
                <path
                  id="portrait-orbit-path"
                  d="M 110,110 m -92,0 a 92,92 0 1,1 184,0 a 92,92 0 1,1 -184,0"
                />
              </defs>
              <text>
                <textPath href="#portrait-orbit-path" startOffset="2%">
                  RESEARCH • ENGINEERING • MAKING • RESEARCH • ENGINEERING • MAKING •
                </textPath>
              </text>
            </svg>
            <img src={info.about.photo} alt="Ariji Chakma" className="research-portrait" />
          </div>
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
