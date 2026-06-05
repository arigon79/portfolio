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
    <section>
      <div className="section-label">Publication</div>

      <article className="pub-paper">
        <div className="pub-header">
          <div className="pub-header-left">
            <span className="pub-archive">{publication.archive}</span>
            <span className="pub-id">{publication.year}</span>
            <span className="pub-venue-name">{publication.venue}</span>
          </div>
          <div className="pub-header-right">
            <span className="pub-status">
              <span className="pub-status-dot" />
              {publication.status}
            </span>
          </div>
        </div>

        <div className="pub-body">
          <div className="pub-meta-top">
            {publication.tags.map((tag) => (
              <span key={tag} className="pub-meta-pill">{tag}</span>
            ))}
          </div>

          <h3 className="pub-paper-title">{publication.title}</h3>

          <div className="pub-authors">
            {publication.authors.map((author, i) => (
              <span key={author.name} className="pub-author-entry">
                <span className={`pub-author${author.isMe ? ' pub-author--me' : ''}`}>
                  {author.name}
                </span>
                {i < publication.authors.length - 1 && (
                  <span className="pub-author-sep">,</span>
                )}
              </span>
            ))}
          </div>

          <div className="pub-abstract">
            {publication.abstract}
          </div>

          <div className="pub-cite">
            <div className="pub-cite-head">
              <div className="pub-cite-head-left">
                <span className="pub-cite-label">BibTeX</span>
                <span className="pub-cite-lang">.bib</span>
              </div>
              <button
                className={`pub-cite-copy${copied ? ' is-copied' : ''}`}
                onClick={handleCopy}
                type="button"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <pre className="pub-cite-body">{publication.bibtex}</pre>
          </div>

          <div className="pub-actions">
            {publication.actions.map((action) => (
              <a
                key={action.href}
                className={`pub-action${action.primary ? ' pub-action--primary' : ''}`}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{action.label}</span>
                <span className="pub-action-arrow">↗</span>
              </a>
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}
