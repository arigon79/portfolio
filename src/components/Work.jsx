import { useState } from 'react';
import info from '../data/info.json';

const WORK = info.work.items;

const STATUS = {
  upcoming: 'Upcoming',
  active: 'Current',
  completed: 'Past',
};

function JobLogo({ w }) {
  const [failed, setFailed] = useState(false);

  if (!w.logo || failed) {
    return <span className="job-code" aria-hidden="true">{w.code}</span>;
  }

  return (
    <span className="job-code job-code--logo" aria-hidden="true">
      <img
        src={w.logo}
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </span>
  );
}

export default function Work() {
  return (
    <section id="experience">
      <div className="section-label">Work</div>

      <div className="job-timeline">
        {WORK.map((w) => {
          const Tag = w.href ? 'a' : 'div';
          return (
            <div className="job-row" key={w.company} style={{ '--job-color': w.color }}>
              <div className="job-rail" aria-hidden="true">
                <span className="job-dot" />
                <span className="job-line" />
              </div>

              <Tag
                className="job"
                href={w.href}
                target={w.href ? '_blank' : undefined}
                rel={w.href ? 'noopener noreferrer' : undefined}
              >
                <JobLogo w={w} />

                <div className="job-info">
                  <div className="job-top">
                    <h3 className="job-company">{w.company}</h3>
                    <span className={`job-badge job-badge--${w.status}`}>
                      {w.status === 'active' && <span className="job-badge-dot" />}
                      {STATUS[w.status] ?? 'Past'}
                    </span>
                  </div>
                  <p className="job-role">{w.role}</p>
                  <p className="job-meta">{w.dates} · {w.location}</p>

                  {w.links && (
                    <div className="job-links">
                      {w.links.map((l) => (
                        <a
                          key={l.href}
                          className="job-link"
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {l.label} ↗
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {w.href && <span className="job-arrow" aria-hidden="true">↗</span>}
              </Tag>
            </div>
          );
        })}
      </div>
    </section>
  );
}
