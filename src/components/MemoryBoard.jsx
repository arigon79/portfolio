import { useState, useRef } from 'react';
import info from '../data/info.json';
import { useLanguage } from '../context/LanguageContext';

const MEMORIES = info.memories || [];

// Initial organic collage coordinates across the scenic landscape canvas
const DEFAULT_OFFSETS = [
  { x: -16, y: 14 },   // 0: HackMIT (offset down-left)
  { x: 14, y: 48 },    // 1: Stanford (staggered down-right)
  { x: -10, y: -20 },  // 2: Columbia (lifted up-left)
  { x: 18, y: 36 },    // 3: HackPrinceton (offset down-right)
  { x: -22, y: -8 },   // 4: First Hackathon Robot (offset left)
  { x: 12, y: 52 },    // 5: First Day Drexel (staggered down-right)
  { x: -14, y: 22 },   // 6: BMS SWE Co-op (offset down-left)
  { x: 18, y: -24 },   // 7: KPOT (lifted up-right)
  { x: -12, y: 38 },   // 8: Park with Dogs (offset down-left)
  { x: 16, y: -16 },   // 9: Childhood (lifted up-right)
];


export default function MemoryBoard() {
  const { t } = useLanguage();
  const [customPositions, setCustomPositions] = useState({});
  const [draggingId, setDraggingId] = useState(null);
  const [zIndices, setZIndices] = useState({});
  const maxZRef = useRef(30);

  // Pointer drag handler for mouse & touch freeform repositioning
  const handlePointerDown = (id, e) => {
    if (e.button !== undefined && e.button !== 0) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const currentPos = customPositions[id] || { x: 0, y: 0 };
    let hasMoved = false;

    // Bring this photo to top
    maxZRef.current += 1;
    setZIndices((prev) => ({ ...prev, [id]: maxZRef.current }));

    const onPointerMove = (moveEvt) => {
      const dx = moveEvt.clientX - startX;
      const dy = moveEvt.clientY - startY;

      if (!hasMoved && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
        hasMoved = true;
        setDraggingId(id);
      }

      if (hasMoved) {
        setCustomPositions((prev) => ({
          ...prev,
          [id]: {
            x: currentPos.x + dx,
            y: currentPos.y + dy,
          },
        }));
      }
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      setDraggingId(null);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  const handleResetPositions = () => {
    setCustomPositions({});
  };

  const hasCustomPositions = Object.keys(customPositions).length > 0;

  return (
    <section id="memories" className="mem-section-wrap">
      <div className="section-label">{t.section.memories}</div>
      <div className="mem-header-bar">
        <div className="mem-header-left">
          <p className="mem-lead">{t.memories.lead}</p>
          <span className="mem-drag-hint" aria-hidden="true">
            🖐️ Drag to arrange
          </span>
        </div>
        <div className="mem-header-right">
          {hasCustomPositions && (
            <button
              type="button"
              className="mem-reset-btn"
              onClick={handleResetPositions}
              title="Reset all photographs to original positions"
            >
              ↺ Reset Pins
            </button>
          )}
          <span className="mem-counter">
            🌄 {MEMORIES.length} Moments
          </span>
        </div>
      </div>

      {/* Panoramic Scenic Landscape Board (Theme-Adaptive) */}
      <div className="mem-map-board mem-scenic-board">
        {/* Scenic Landscape Vector Background */}
        <div className="mem-map-bg mem-scenic-bg" aria-hidden="true">
          <svg
            className="mem-map-svg mem-scenic-svg"
            viewBox="0 0 1400 800"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Light Mode Gradients */}
              <linearGradient id="sky-light" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fafafa" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#f1f5f9" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.9" />
              </linearGradient>
              <radialGradient id="sun-light" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fde047" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="mount-dist-light" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="mount-mid-light" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="mount-fore-light" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#64748b" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="river-light" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.95" />
              </linearGradient>

              {/* Dark Mode Gradients */}
              <linearGradient id="sky-dark" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#090a0f" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#0f172a" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.85" />
              </linearGradient>
              <radialGradient id="sun-dark" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.95" />
                <stop offset="40%" stopColor="#93c5fd" stopOpacity="0.75" />
                <stop offset="85%" stopColor="#3b82f6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="mount-dist-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#312e81" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="mount-mid-dark" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="mount-fore-dark" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0f172a" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="river-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.95" />
              </linearGradient>

              {/* Minimal Dot Grid Pattern */}
              <pattern id="scenic-dots" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.2" fill="currentColor" opacity="0.18" />
              </pattern>
            </defs>

            {/* Sky Background & Minimal Grid */}
            <rect className="scenic-sky-rect" width="1400" height="800" />
            <rect width="1400" height="440" fill="url(#scenic-dots)" />

            {/* Glowing Celestial Sun / Moon & Concentric Orbital Rings */}
            <circle className="scenic-sun-circle" cx="1080" cy="160" r="85" />
            <circle className="scenic-sun-ring-1" cx="1080" cy="160" r="125" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="6,8" opacity="0.3" />
            <circle className="scenic-sun-ring-2" cx="1080" cy="160" r="165" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,6" opacity="0.2" />

            {/* Cool Minimalist Geometric Accents */}
            <g className="scenic-accents" opacity="0.5">
              <circle cx="140" cy="90" r="32" fill="none" stroke="currentColor" strokeWidth="1.6" opacity="0.4" />
              <circle cx="140" cy="90" r="18" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
              <path d="M 220,60 L 250,110 L 190,110 Z" fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.4" />
              <rect x="290" y="70" width="28" height="28" transform="rotate(45 304 84)" fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.4" />

              {/* Sparkle Stars */}
              <path d="M 460,70 Q 460,90 480,90 Q 460,90 460,110 Q 460,90 440,90 Q 460,90 460,70 Z" fill="currentColor" opacity="0.6" />
              <path d="M 820,80 Q 820,95 835,95 Q 820,95 820,110 Q 820,95 805,95 Q 820,95 820,80 Z" fill="currentColor" opacity="0.5" />
              <path d="M 1280,120 Q 1280,135 1295,135 Q 1280,135 1280,150 Q 1280,135 1265,135 Q 1280,135 1280,120 Z" fill="currentColor" opacity="0.55" />
            </g>

            {/* Stylized Floating Clouds */}
            <g className="scenic-clouds" fill="currentColor" opacity="0.12">
              <path d="M 60,160 Q 90,130 130,140 Q 160,120 190,140 Q 230,140 240,170 Q 240,190 210,195 L 80,195 Q 50,190 60,160 Z" />
              <path d="M 520,130 Q 550,105 590,115 Q 620,95 650,115 Q 690,115 700,145 Q 700,165 670,170 L 540,170 Q 510,165 520,130 Z" />
            </g>

            {/* Layer 1: Distant Majestic Alpine Mountains */}
            <polygon
              className="scenic-mount-distant"
              points="-50,420 120,240 280,380 440,210 620,390 790,190 980,370 1140,230 1320,380 1450,260 1450,800 -50,800"
              strokeWidth="1.2"
            />
            {/* Distant Mountain Peak Highlights */}
            <polyline points="440,210 470,250 430,290" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
            <polyline points="790,190 820,230 780,270" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
            <polyline points="1140,230 1170,270 1130,310" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />

            {/* Layer 2: Mid-range Mountain Ridges */}
            <polygon
              className="scenic-mount-mid"
              points="-40,490 180,310 390,460 560,290 740,450 920,280 1110,440 1280,320 1460,470 1460,800 -40,800"
              strokeWidth="1.5"
            />

            {/* Layer 3: Foreground Hills & Ridge Line */}
            <path
              className="scenic-mount-fore"
              d="M -30,560 Q 180,440 380,530 T 800,480 T 1200,520 T 1450,470 L 1450,800 L -30,800 Z"
              strokeWidth="1.8"
            />

            {/* Flowing Organic Winding River */}
            <path
              className="scenic-river-path"
              d="M 680,460 C 730,530 620,580 690,650 C 760,720 640,770 580,800 L 820,800 C 890,760 1000,700 930,620 C 860,550 900,500 830,460 Z"
              strokeWidth="2"
            />

            {/* River Ripples & Water Current Lines */}
            <path d="M 720,530 Q 750,540 780,530" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
            <path d="M 660,610 Q 700,620 740,605" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
            <path d="M 720,690 Q 770,705 820,685" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <path d="M 640,750 Q 700,765 760,745" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.65" />
          </svg>

          {/* Scenic Horizon Badges */}
          <div className="mem-map-badge mem-map-badge--br">
            <span className="mem-map-compass">🧭 39°57&apos;N · 75°11&apos;W // HORIZON</span>
          </div>
        </div>

        {/* Pinned Photographs Grid (Interactive Draggable Collage) */}
        <div className="mem-photos-grid">
          {MEMORIES.map((m, idx) => {
            const rot = m.rotation || (idx % 2 === 0 ? '-3deg' : '3.5deg');
            const format = m.format || 'square';
            const pinStyle = m.pinStyle || 'pin-top';
            const defaultOffset = DEFAULT_OFFSETS[idx % DEFAULT_OFFSETS.length] || { x: 0, y: 0 };
            const customOffset = customPositions[m.id] || { x: 0, y: 0 };
            const totalX = defaultOffset.x + customOffset.x;
            const totalY = defaultOffset.y + customOffset.y;
            const isDragging = draggingId === m.id;
            const zIndex = zIndices[m.id] || 1;

            return (
              <div
                key={m.id || idx}
                className={`mem-photo-item mem-photo-item--${format}${isDragging ? ' is-dragging' : ''}`}
                style={{
                  '--photo-rot': rot,
                  '--offset-x': `${totalX}px`,
                  '--offset-y': `${totalY}px`,
                  zIndex: isDragging ? 100 : zIndex,
                }}
                onPointerDown={(e) => handlePointerDown(m.id, e)}
              >
                <article className={`mem-photo-card mem-photo-card--${format}`}>
                  {/* Pushpin Marker */}
                  {pinStyle === 'pin-top' && (
                    <div className="mem-pin" aria-hidden="true">
                      <span className="mem-pin-head" />
                      <span className="mem-pin-shadow" />
                    </div>
                  )}

                  {/* Dual Diagonal Tape Clips */}
                  {pinStyle === 'tape-diagonal' && (
                    <>
                      <div className="mem-corner-tape mem-corner-tape--tl" aria-hidden="true" />
                      <div className="mem-corner-tape mem-corner-tape--br" aria-hidden="true" />
                    </>
                  )}

                  {/* Single Top Tape Strip */}
                  {pinStyle === 'tape-top' && (
                    <div className="mem-tape-top" aria-hidden="true" />
                  )}

                  {/* Vintage Corner Mounting Clips */}
                  {pinStyle === 'corner-clips' && (
                    <div className="mem-corner-brackets" aria-hidden="true">
                      <span className="mem-cb mem-cb--tl" />
                      <span className="mem-cb mem-cb--tr" />
                      <span className="mem-cb mem-cb--bl" />
                      <span className="mem-cb mem-cb--br" />
                    </div>
                  )}

                  {/* Photograph Frame */}
                  <div className={`mem-img-frame mem-img-frame--${format}`}>
                    {m.stamp && (
                      <span className="mem-travel-stamp" aria-hidden="true">
                        {m.stamp}
                      </span>
                    )}
                    <img
                      src={m.image}
                      alt={m.title}
                      loading="lazy"
                      className="mem-photo-img"
                      draggable="false"
                    />

                    {/* Camera Crop / Viewfinder Reticle */}
                    <div className="mem-viewfinder" aria-hidden="true">
                      <span className="mem-vf-corner mem-vf-tl" />
                      <span className="mem-vf-corner mem-vf-tr" />
                      <span className="mem-vf-corner mem-vf-bl" />
                      <span className="mem-vf-corner mem-vf-br" />
                      <div className="mem-vf-cross" />
                    </div>
                  </div>

                  {/* Clean Square Polaroid Signature (Title + Year & Location) */}
                  <div className="mem-card-body">
                    {m.title && (
                      <p className="mem-card-desc-line" title={m.title}>
                        {m.title}
                      </p>
                    )}

                    <div className="mem-card-meta-row">
                      {m.location && (
                        <span className="mem-photo-loc">
                          <span className="mem-loc-pin" aria-hidden="true">📍</span>
                          {m.location}
                        </span>
                      )}
                      {m.date && (
                        <span className="mem-card-date">{m.date}</span>
                      )}
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
