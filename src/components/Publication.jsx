import { useState } from 'react';
import info from '../data/info.json';
import { useLanguage } from '../context/LanguageContext';

const publication = info.publication;

export default function Publication() {
  const { t } = useLanguage();
  const [showBibtex, setShowBibtex] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(publication.bibtex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section id="research">
      <div className="section-label">{t.section.research}</div>

      <div className="pub-list">
        <article className="pub-row">
          {publication.image && (
            <div className="pub-thumb">
              <img
                src={publication.image}
                alt={publication.title}
                loading="lazy"
              />
              <span className="pub-thumb-badge">{publication.archive} {publication.year}</span>
            </div>
          )}

          <div className="pub-content">
            <h3 className="pub-title">
              <a
                href={publication.actions?.[0]?.href || '#'}
                target="_blank"
                rel="noopener noreferrer"
              >
                {publication.title}
              </a>
            </h3>

            <p className="pub-authors">
              {publication.authors.map((author, i) => (
                <span
                  key={author.name}
                  className={author.isMe ? 'pub-author is-me' : 'pub-author'}
                >
                  {author.name}{author.isMe ? '*' : ''}
                  {i < publication.authors.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>

            <p className="pub-venue">
              <em>{publication.venue}</em> ({publication.archive} {publication.year})
              {publication.status && (
                <span className="pub-status-tag">{publication.status}</span>
              )}
            </p>

            <p className="pub-desc">{publication.abstract}</p>

            <div className="pub-links">
              {publication.actions.map((action) => (
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

              <button
                type="button"
                className={`pub-pill pub-pill--btn${showBibtex ? ' is-active' : ''}`}
                onClick={() => setShowBibtex((s) => !s)}
              >
                {showBibtex ? 'BibTeX ▴' : 'BibTeX ▾'}
              </button>
            </div>

            {showBibtex && (
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
      </div>
    </section>
  );
}


