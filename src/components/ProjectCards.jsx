import { useState, useMemo } from 'react';
import info from '../data/info.json';
import { useLanguage } from '../context/LanguageContext';

const PROJECTS = info.projects;

function cleanTags(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  return raw.split('·').map((t) => t.trim()).filter(Boolean);
}

const TAGS = Array.from(new Set(PROJECTS.flatMap((p) => cleanTags(p.tags)))).sort();
const FILTERS = ['Featured', 'All', ...TAGS];

// Organic tilts for scrapbook polaroid effect
const CARD_ROTATIONS = ['-1.8deg', '2.2deg', '-2.4deg', '1.6deg', '-1.5deg', '2deg'];

export default function ProjectCards() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('Featured');

  const list = useMemo(() => {
    if (filter === 'All') return PROJECTS;
    if (filter === 'Featured') return PROJECTS.filter((p) => p.featured);
    return PROJECTS.filter((p) => cleanTags(p.tags).includes(filter));
  }, [filter]);

  return (
    <section id="projects">
      <div className="section-label">{t.section.projects}</div>

      <div className="proj-filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`proj-filter${filter === f ? ' is-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {t.projects.filters[f] ?? f}
          </button>
        ))}
      </div>

      <div className="proj-polaroid-gallery">
        <div className="proj-polaroid-grid">
          {list.map((p, i) => {
            const tags = cleanTags(p.tags);
            const rot = CARD_ROTATIONS[i % CARD_ROTATIONS.length];
            return (
              <div
                key={p.id}
                className="proj-polaroid-wrap"
                style={{ '--proj-rot': rot }}
              >
                <a
                  className="proj-polaroid-card"
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* Frosted Clear Tape Clips (Top-Left & Bottom-Right) */}
                  <div className="proj-tape proj-tape--tl" aria-hidden="true" />
                  <div className="proj-tape proj-tape--br" aria-hidden="true" />

                  {/* Photo Frame with Viewfinder Crop Reticle */}
                  <div className="proj-photo-box">
                    <img
                      src={`/assets/projects/${p.image}`}
                      alt={p.title}
                      loading="lazy"
                      className="proj-photo-img"
                    />

                    {/* Camera Crop / Viewfinder Reticle Accent */}
                    <div className="proj-viewfinder" aria-hidden="true">
                      <span className="proj-vf-corner proj-vf-tl" />
                      <span className="proj-vf-corner proj-vf-tr" />
                      <span className="proj-vf-corner proj-vf-bl" />
                      <span className="proj-vf-corner proj-vf-br" />
                      <div className="proj-vf-crosshair" />
                    </div>

                    {p.featured && (
                      <span className="proj-featured-badge">★ {t.projects.filters.Featured}</span>
                    )}

                    <span className="proj-link-badge" aria-hidden="true">↗</span>
                  </div>

                  {/* Polaroid Bottom Signature & Details */}
                  <div className="proj-card-footer">
                    <div className="proj-head">
                      <h3 className="proj-sharpie-title">{p.title}</h3>
                    </div>

                    <p className="proj-polaroid-desc">{p.description}</p>

                    {tags.length > 0 && (
                      <div className="proj-polaroid-tags">
                        {tags.map((t) => (
                          <span key={t} className="proj-polaroid-tag">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
