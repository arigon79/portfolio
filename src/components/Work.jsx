import { useId, useState } from 'react';
import info from '../data/info.json';
import { useLanguage } from '../context/LanguageContext';

const WORK = info.work.items;

function JobDetails({ description, courses, company, dates, labels }) {
  const [expanded, setExpanded] = useState(false);
  const descriptionId = useId();

  return (
    <div className="job-details">
      <button
        className="job-link job-toggle"
        type="button"
        aria-expanded={expanded}
        aria-controls={descriptionId}
        aria-label={`${expanded ? labels.showLess : labels.showMore}: ${company}, ${dates}`}
        onClick={() => setExpanded((value) => !value)}
      >
        {expanded ? labels.showLess : labels.showMore}
        <span aria-hidden="true">{expanded ? '−' : '+'}</span>
      </button>
      <div className="job-description" id={descriptionId} hidden={!expanded}>
        {Array.isArray(description) ? description.map((section) => (
          <p key={section.label}>
            <strong>{section.label}:</strong> {section.text}{' '}
            <a href={section.advisor.href} target="_blank" rel="noopener noreferrer">
              {section.advisor.name}
            </a>.
          </p>
        )) : <p>{description}</p>}
        {courses && (
          <ul className="job-courses">
            {courses.map((course) => <li key={course}>{course}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}

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
  const { t } = useLanguage();
  const STATUS = t.work.status;

  return (
    <section id="experience">
      <div className="section-label">{t.section.work}</div>

      <div className="job-timeline">
        {WORK.map((w) => {
          return (
            <div className="job-row" key={`${w.company}-${w.dates}`} style={{ '--job-color': w.color }}>
              <div className="job-rail" aria-hidden="true">
                <span className="job-dot" />
                <span className="job-line" />
              </div>

              <article className="job">
                <JobLogo w={w} />

                <div className="job-info">
                  <div className="job-top">
                    <h3 className="job-company">
                      {w.href ? (
                        <a className="job-company-link" href={w.href} target="_blank" rel="noopener noreferrer">
                          {w.company} <span className="job-arrow" aria-hidden="true">↗</span>
                        </a>
                      ) : w.company}
                    </h3>
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
                  {w.description && (
                    <JobDetails
                      description={w.description}
                      courses={w.courses}
                      company={w.company}
                      dates={w.dates}
                      labels={t.work}
                    />
                  )}
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
