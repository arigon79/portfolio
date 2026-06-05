import { useState, useEffect, useCallback, useRef } from 'react';
import info from '../data/info.json';

const projects = info.projects;

function cleanTags(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  return raw.split('·').map((t) => t.trim()).filter(Boolean);
}

const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const SUITS = ['♠', '♥', '♦', '♣'];
const RED = new Set(['♥', '♦']);

const FAN = {
  '-2': { angle: -22, ty: 22, scale: 0.87, z: 1 },
  '-1': { angle: -11, ty: 10, scale: 0.93, z: 2 },
  '0': { angle: 0, ty: 0, scale: 1.00, z: 5 },
  '1': { angle: 11, ty: 10, scale: 0.93, z: 2 },
  '2': { angle: 22, ty: 22, scale: 0.87, z: 1 },
};

export default function ProjectCards() {
  const [current, setCurrent] = useState(0);
  const [enterDir, setEnterDir] = useState(null);
  const [dragDelta, setDragDelta] = useState(0);
  const drag = useRef({ active: false, startX: 0 });

  const goTo = useCallback((idx) => {
    if (idx === current || idx < 0 || idx >= projects.length) return;
    setEnterDir(idx > current ? 'right' : 'left');
    setCurrent(idx);
    setTimeout(() => setEnterDir(null), 520);
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
    if (e.target.closest('button')) return;
    drag.current = { active: true, startX: e.clientX };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!drag.current.active) return;
    setDragDelta(e.clientX - drag.current.startX);
  };
  const onPointerUp = (e) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const dx = e.clientX - drag.current.startX;
    setDragDelta(0);
    if (Math.abs(dx) > 55) goTo(current + (dx < 0 ? 1 : -1));
  };

  const isDragging = drag.current.active;

  return (
    <section id="projects">
      <div className="section-label">Projects</div>

      <div
        className="pc-scene"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { drag.current.active = false; setDragDelta(0); }}
      >
        <div className="pc-hand">
          {[-2, -1, 0, 1, 2].map((off) => {
            const idx = current + off;
            if (idx < 0 || idx >= projects.length) return null;

            const proj = projects[idx];
            const fan = FAN[String(off)];
            const val = VALUES[idx % VALUES.length];
            const suit = SUITS[idx % SUITS.length];
            const isRed = RED.has(suit);
            const isActive = off === 0;
            const tags = cleanTags(proj.tags);

            const dragAngle = isActive && isDragging
              ? dragDelta * 0.03
              : 0;
            const dragTY = isActive && isDragging
              ? Math.abs(dragDelta) * 0.04
              : 0;

            const enterClass = isActive && enterDir
              ? ` is-entering-${enterDir}`
              : '';

            return (
              <div
                key={proj.id}
                className={`pc-card${isActive ? ' is-active' : ''}${enterClass}`}
                style={{
                  '--angle': `${fan.angle + dragAngle}deg`,
                  '--ty': `${fan.ty + dragTY}px`,
                  '--scale': fan.scale,
                  '--dist': Math.abs(off),
                  zIndex: fan.z,
                  transition: isDragging
                    ? 'filter 0.2s, box-shadow 0.2s'
                    : undefined,
                }}
                onClick={() => {
                  if (Math.abs(dragDelta) > 8) return;
                  isActive
                    ? window.open(proj.link, '_blank', 'noopener')
                    : goTo(idx);
                }}
                role="button"
                tabIndex={isActive ? 0 : -1}
                aria-label={isActive ? `Open ${proj.title}` : `Show ${proj.title}`}
              >
                <div className={`pc-face${isRed ? ' is-red' : ''}`}>
                  <div className="pc-corner pc-corner--tl">
                    <span className="pc-val">{val}</span>
                    <span className="pc-suit-sm">{suit}</span>
                  </div>

                  <div className="pc-img-area">
                    <img src={`/assets/projects/${proj.image}`} alt={proj.title} loading="lazy" />
                    {isActive && (
                      <div className="pc-img-overlay">
                        <div className="pc-overlay-cta">Open project ↗</div>
                      </div>
                    )}
                  </div>

                  <div className="pc-center-suit">{suit}</div>

                  <div className="pc-info">
                    <div className="pc-proj-name">{proj.title}</div>
                    {tags.length > 0 && (
                      <div className="pc-proj-tags">
                        {tags.map((t, i) => <span key={t}>{i > 0 && '· '}{t}</span>)}
                      </div>
                    )}
                  </div>

                  <div className="pc-corner pc-corner--br">
                    <span className="pc-val">{val}</span>
                    <span className="pc-suit-sm">{suit}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {isDragging && (
          <div
            className="pc-drag-bar"
            style={{ width: `${Math.min(Math.abs(dragDelta) / 2, 80)}px`, transform: `translateX(${dragDelta > 0 ? '-' : ''}${Math.min(Math.abs(dragDelta) / 4, 20)}px)` }}
          />
        )}

        <div className="pc-hint">
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
