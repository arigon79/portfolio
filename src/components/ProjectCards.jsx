import { useState, useEffect, useCallback, useRef } from 'react';
import info from '../data/info.json';

const projects = info.projects;

function cleanTags(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  return raw.split('·').map((t) => t.trim()).filter(Boolean);
}

export default function ProjectCards() {
  const [current, setCurrent] = useState(0);
  const [enterDir, setEnterDir] = useState(null);
  const drag = useRef({ active: false, startX: 0 });

  const goTo = useCallback((idx) => {
    if (idx === current || idx < 0 || idx >= projects.length) return;
    setEnterDir(idx > current ? 'right' : 'left');
    setCurrent(idx);
    setTimeout(() => setEnterDir(null), 420);
  }, [current]);

  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'ArrowRight') goTo(current + 1);
      if (e.key === 'ArrowLeft') goTo(current - 1);
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [current, goTo]);

  const onPointerDown = (e) => {
    if (e.target.closest('a,button')) return;
    drag.current = { active: true, startX: e.clientX };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerUp = (e) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1));
  };

  const proj = projects[current];
  const tags = cleanTags(proj.tags);
  const enterClass = enterDir ? ` mac-enter-${enterDir}` : '';

  return (
    <section id="projects">
      <div className="section-label">Projects</div>

      <div
        className="mac-scene"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { drag.current.active = false; }}
      >
        <div className="mac-outer">
          {/* Screen lid */}
          <div className="mac-lid">
            <div className="mac-camera" aria-hidden="true" />
            <div className="mac-display">

              {/* Browser bar */}
              <div className="mac-browser-bar">
                <div className="mac-traffic-lights" aria-hidden="true">
                  <span className="mac-tl mac-tl--red" />
                  <span className="mac-tl mac-tl--yellow" />
                  <span className="mac-tl mac-tl--green" />
                </div>
                <a
                  className="mac-url-bar"
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {proj.link.replace(/^https?:\/\//, '')}
                </a>
                <a
                  className="mac-open-btn"
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${proj.title}`}
                  onClick={(e) => e.stopPropagation()}
                >↗</a>
              </div>

              {/* Screen content — keyed so animation replays on project change */}
              <div key={current} className={`mac-screen-content${enterClass}`}>
                <img
                  src={`/assets/projects/${proj.image}`}
                  alt={proj.title}
                  loading="lazy"
                  draggable={false}
                />
                <div className="mac-info-overlay">
                  <div className="mac-proj-title">{proj.title}</div>
                  <div className="mac-proj-desc">{proj.description}</div>
                  {tags.length > 0 && (
                    <div className="mac-proj-tags">
                      {tags.map((t, i) => <span key={t}>{i > 0 && ' · '}{t}</span>)}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Hinge */}
          <div className="mac-hinge" aria-hidden="true" />

          {/* Base with keyboard */}
          <div className="mac-base" aria-hidden="true">
            <div className="mac-keyboard">
              {/* fn row */}
              <div className="mac-key-row">
                <span className="mac-key mac-key--w15" />
                {Array.from({length: 12}).map((_, i) => <span key={i} className="mac-key" />)}
                <span className="mac-key mac-key--w15" />
              </div>
              {/* number row */}
              <div className="mac-key-row">
                {Array.from({length: 13}).map((_, i) => <span key={i} className="mac-key" />)}
                <span className="mac-key mac-key--w2" />
              </div>
              {/* tab row */}
              <div className="mac-key-row">
                <span className="mac-key mac-key--w15" />
                {Array.from({length: 12}).map((_, i) => <span key={i} className="mac-key" />)}
                <span className="mac-key mac-key--w15" />
              </div>
              {/* caps row */}
              <div className="mac-key-row">
                <span className="mac-key mac-key--w2" />
                {Array.from({length: 11}).map((_, i) => <span key={i} className="mac-key" />)}
                <span className="mac-key mac-key--w25" />
              </div>
              {/* shift row */}
              <div className="mac-key-row">
                <span className="mac-key mac-key--w25" />
                {Array.from({length: 10}).map((_, i) => <span key={i} className="mac-key" />)}
                <span className="mac-key mac-key--w25" />
              </div>
              {/* bottom row */}
              <div className="mac-key-row">
                <span className="mac-key mac-key--w15" />
                <span className="mac-key mac-key--w15" />
                <span className="mac-key mac-key--w2" />
                <span className="mac-key mac-key--space" />
                <span className="mac-key mac-key--w2" />
                <span className="mac-key mac-key--w15" />
                <span className="mac-key" />
                <span className="mac-key" />
                <span className="mac-key" />
              </div>
            </div>
            <div className="mac-trackpad" />
            <div className="mac-notch" />
          </div>
        </div>

        {/* Navigation */}
        <div className="mac-nav">
          {current > 0 && (
            <button className="pc-arrow" onClick={() => goTo(current - 1)} aria-label="Previous">‹</button>
          )}
          <span className="pc-counter">{current + 1} / {projects.length}</span>
          {current < projects.length - 1 && (
            <button className="pc-arrow" onClick={() => goTo(current + 1)} aria-label="Next">›</button>
          )}
        </div>
      </div>
    </section>
  );
}
