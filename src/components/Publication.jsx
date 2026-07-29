import { useState } from 'react';
import info from '../data/info.json';

const publication = info.publication;

export default function Publication() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(publication.bibtex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section id="research">
      <div className="section-label">Research</div>

      <article className="rp-card">
        <div className="rp-side">
          <span className="rp-badge">{publication.archive} {publication.year}</span>
          <span className="rp-status">
            <span className="rp-status-dot" />
            {publication.status}
          </span>

          <div className="rp-tags">
            {publication.tags.map((tag) => (
              <span key={tag} className="rp-tag">{tag}</span>
            ))}
          </div>

          <div className="rp-actions">
            {publication.actions.map((action) => (
              <a
                key={action.href}
                className={`rp-btn${action.primary ? ' rp-btn--primary' : ''}`}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {action.label} ↗
              </a>
            ))}
          </div>
        </div>

        <div className="rp-main">
          <h3 className="rp-title">{publication.title}</h3>

          <p className="rp-authors">
            {publication.authors.map((author, i) => (
              <span key={author.name} className={author.isMe ? 'rp-author is-me' : 'rp-author'}>
                {author.name}{i < publication.authors.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>

          <p className="rp-venue">{publication.venue}</p>

          <p className="rp-abstract">
            <span className="rp-abstract-label">Abstract.</span> {publication.abstract}
          </p>

          <details className="rp-bibtex">
            <summary>
              BibTeX
              <button
                type="button"
                className={`rp-copy${copied ? ' is-copied' : ''}`}
                onClick={(e) => { e.preventDefault(); handleCopy(); }}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </summary>
            <pre>{publication.bibtex}</pre>
          </details>
        </div>
      </article>
    </section>
  );
}
