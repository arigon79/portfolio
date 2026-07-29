import { useState, useMemo } from 'react';
import info from '../data/info.json';

const PROJECTS = info.projects;

function cleanTags(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  return raw.split('·').map((t) => t.trim()).filter(Boolean);
}

const TAGS = Array.from(new Set(PROJECTS.flatMap((p) => cleanTags(p.tags)))).sort();
const FILTERS = ['Featured', 'All', ...TAGS];

export default function ProjectCards() {
  const [filter, setFilter] = useState('Featured');

  const list = useMemo(() => {
    if (filter === 'All') return PROJECTS;
    if (filter === 'Featured') return PROJECTS.filter((p) => p.featured);
    return PROJECTS.filter((p) => cleanTags(p.tags).includes(filter));
  }, [filter]);

  return (
    <section id="projects">
      <div className="section-label">Projects</div>

      <div className="proj-filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`proj-filter${filter === f ? ' is-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="proj-grid">
        {list.map((p, i) => {
          const tags = cleanTags(p.tags);
          const wide = p.featured && i % 3 === 0;
          return (
            <a
              key={p.id}
              className={`proj-card${wide ? ' proj-card--wide' : ''}`}
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="proj-thumb">
                <img src={`/assets/projects/${p.image}`} alt={p.title} loading="lazy" />
                {p.featured && <span className="proj-star">★ Featured</span>}
              </div>
              <div className="proj-body">
                <div className="proj-head">
                  <h3 className="proj-title">{p.title}</h3>
                  <span className="proj-arrow" aria-hidden="true">↗</span>
                </div>
                <p className="proj-desc">{p.description}</p>
                {tags.length > 0 && (
                  <div className="proj-tags">
                    {tags.map((t) => <span key={t} className="proj-tag">{t}</span>)}
                  </div>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
