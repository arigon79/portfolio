import { useState } from 'react';
import info from '../data/info.json';
import { useLanguage } from '../context/LanguageContext';

function PublicationRow({ publication }) {
  const { t, lang } = useLanguage();
  const [showBibtex, setShowBibtex] = useState(false);
  const [copied, setCopied] = useState(false);
  const citationLabel = [publication.archive, publication.year].filter(Boolean).join(' ');

  const handleCopy = () => {
    navigator.clipboard.writeText(publication.bibtex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <article className="pub-row">
      {publication.image && (
        <div className="pub-thumb">
          <img
            src={publication.image}
            alt={publication.title}
            loading="lazy"
            style={publication.imageFit ? { objectFit: publication.imageFit } : undefined}
          />
          <span className="pub-thumb-badge">{citationLabel}</span>
        </div>
      )}

      <div className="pub-content">
        <h3 className="pub-title">
          {publication.actions?.[0]?.href ? (
            <a
              href={publication.actions[0].href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {publication.title}
            </a>
          ) : (
            publication.title
          )}
        </h3>

        <p className="pub-authors">
          {publication.authors.map((author, i) => (
            <span
              key={author.name}
              className={author.isMe ? 'pub-author is-me' : 'pub-author'}
            >
              {author.name}
              {i < publication.authors.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>

        <p className="pub-venue">
          <em>{publication.venue}</em> ({citationLabel})
          {publication.status && (
            <span className="pub-status-tag">{publication.status}</span>
          )}
        </p>

        {publication.takeaway && (
          <p className="research-paper-takeaway">{publication.takeaway[lang] ?? publication.takeaway.en}</p>
        )}
        <div className="research-paper-tags">
          {publication.tags?.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <details className="research-abstract">
          <summary>{t.researchProfile.abstract}</summary>
          <p className="pub-desc">{publication.abstract}</p>
        </details>

        <div className="pub-links">
          {publication.actions?.map((action) => (
            <a
              key={action.href}
              className="pub-pill"
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {action.label} ↗
            </a>
          ))}

          {publication.bibtex && (
            <button
              type="button"
              className={`pub-pill pub-pill--btn${showBibtex ? ' is-active' : ''}`}
              aria-expanded={showBibtex}
              onClick={() => setShowBibtex((s) => !s)}
            >
              {showBibtex ? 'BibTeX ▴' : 'BibTeX ▾'}
            </button>
          )}
        </div>

        {publication.bibtex && showBibtex && (
          <div className="pub-bibtex-box">
            <div className="pub-bibtex-top">
              <span>BibTeX</span>
              <button
                type="button"
                className={`pub-copy-link${copied ? ' is-copied' : ''}`}
                onClick={handleCopy}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <pre>{publication.bibtex}</pre>
          </div>
        )}
      </div>
    </article>
  );
}

export default function Publication() {
  const { t } = useLanguage();

  return (
    <section id="research">
      <div className="research-section-heading">
        <div>
          <h2 className="section-label">{t.section.research}</h2>
          <p>{t.researchProfile.publicationsNote}</p>
        </div>
        <a href={info.profile.socials.find((social) => social.icon === 'scholar').href}
          target="_blank" rel="noopener noreferrer">{t.researchProfile.scholar} ↗</a>
      </div>
      <div className="pub-list">
        {info.publications.map((publication) => (
          <PublicationRow key={publication.title} publication={publication} />
        ))}
      </div>
    </section>
  );
}
