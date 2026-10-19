import { useEffect, useState } from 'react';
import { revealFromKey, revealFromPointer } from '../utils/portraitReveal';

const PIXELS = [
  [18, 20, 0, 7],
  [66, 14, -1.1, 6],
  [80, 35, -.5, 8],
  [31, 43, -1.8, 6],
  [58, 50, -.2, 7],
  [12, 62, -1.3, 5],
  [75, 70, -.7, 6],
  [40, 79, -2, 8],
  [62, 88, -1.5, 5],
];

export default function PortraitReveal({ src, alt }) {
  const [reveal, setReveal] = useState(58);
  const [dragging, setDragging] = useState(false);
  const [intro, setIntro] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIntro(false);
      return undefined;
    }

    const timer = window.setTimeout(() => setIntro(false), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  const updateFromPointer = (event) => {
    setIntro(false);
    setReveal(revealFromPointer(event.clientY, event.currentTarget.getBoundingClientRect()));
  };

  const stopDragging = (event) => {
    setDragging(false);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event) => {
    const nextReveal = revealFromKey(event.key, reveal);
    if (nextReveal === null) return;
    event.preventDefault();
    setIntro(false);
    setReveal(nextReveal);
  };

  return (
    <div
      className={`portrait-reveal${intro ? ' is-intro' : ''}${dragging ? ' is-dragging' : ''}`}
      style={{ '--portrait-reveal': `${reveal}%` }}
      role="slider"
      tabIndex={0}
      aria-label="Reveal portrait color"
      aria-orientation="vertical"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={Math.round(reveal)}
      aria-valuetext={`${Math.round(reveal)}% color revealed`}
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        setDragging(true);
        updateFromPointer(event);
      }}
      onPointerMove={(event) => {
        if (dragging) updateFromPointer(event);
      }}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
    >
      <img src={src} alt={alt} className="research-portrait portrait-reveal-base" />
      <div className="portrait-reveal-filter" aria-hidden="true">
        <img src={src} alt="" className="portrait-reveal-muted" />
        <div className="portrait-reveal-pixels">
          {PIXELS.map(([x, y, delay, size]) => (
            <span
              key={`${x}-${y}`}
              style={{ '--pixel-x': `${x}%`, '--pixel-y': `${y}%`, '--pixel-delay': `${delay}s`, '--pixel-size': `${size}px` }}
            />
          ))}
        </div>
      </div>
      <div className="portrait-reveal-divider" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}
