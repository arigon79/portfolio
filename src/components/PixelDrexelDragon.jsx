import { useState } from 'react';

// Pixel Dragons pinned to specific sections throughout the page document
const DRAGONS = [
  // 1. Hero Zone (Top Right)
  { id: 'd1', top: '3.5%', right: '3vw', size: 56, duration: 7.2, delay: 0, flip: false, opacity: 0.42 },
  // 2. Hero / Intro Sky (Top Left)
  { id: 'd2', top: '8%', left: '3.5vw', size: 34, duration: 10.5, delay: 3.2, flip: true, opacity: 0.32 },
  // 3. About Section (Left Gutter)
  { id: 'd3', top: '19%', left: '2.5vw', size: 70, duration: 8.4, delay: 1.2, flip: true, opacity: 0.45 },
  // 4. Work Experience (Right Gutter)
  { id: 'd4', top: '32%', right: '2.2vw', size: 84, duration: 7.8, delay: 2.5, flip: false, opacity: 0.44 },
  // 5. Research & Publications (Left Gutter)
  { id: 'd5', top: '46%', left: '2.8vw', size: 48, duration: 6.2, delay: 0.8, flip: true, opacity: 0.4 },
  // 6. Projects Section (Right Gutter)
  { id: 'd6', top: '60%', right: '3vw', size: 76, duration: 8.8, delay: 1.9, flip: false, opacity: 0.42 },
  // 7. Awards & Achievements (Left Gutter)
  { id: 'd7', top: '74%', left: '3vw', size: 52, duration: 6.6, delay: 2.8, flip: true, opacity: 0.38 },
  // 8. Lower Page Area (Right Gutter)
  { id: 'd8', top: '86%', right: '2.5vw', size: 62, duration: 7.6, delay: 1.5, flip: false, opacity: 0.4 },
  // 9. Contact / Footer (Left Gutter)
  { id: 'd9', top: '96%', left: '3.2vw', size: 40, duration: 9.0, delay: 3.5, flip: true, opacity: 0.35 },
];

function DragonItem({ d }) {
  const [spinning, setSpinning] = useState(false);

  const handleSpin = () => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 1200);
  };

  return (
    <div
      className={`side-pixel-dragon${spinning ? ' is-spinning' : ''}${d.flip ? ' is-flipped' : ''}`}
      onClick={handleSpin}
      title="🐉 Drexel Dragon · Click to spin!"
      style={{
        top: d.top,
        left: d.left,
        right: d.right,
        width: `${d.size}px`,
        height: `${Math.round(d.size * 0.83)}px`,
        opacity: d.opacity,
        animationDuration: `${d.duration}s`,
        animationDelay: `${d.delay}s`,
      }}
    >
      <svg
        className="side-dragon-svg"
        viewBox="0 0 96 80"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
      >
        <g className="side-dragon-mesh">
          {/* Back Wing (Flapping) */}
          <g className="s-wing s-wing-back">
            <rect x="36" y="8" width="6" height="4" fill="var(--dragon-accent)" />
            <rect x="30" y="12" width="18" height="4" fill="var(--dragon-gold)" />
            <rect x="26" y="16" width="24" height="4" fill="var(--dragon-gold-light)" />
            <rect x="24" y="20" width="24" height="4" fill="var(--dragon-gold)" />
            <rect x="28" y="24" width="16" height="4" fill="var(--dragon-accent)" />
          </g>

          {/* Tail & Spikes */}
          <rect x="18" y="44" width="6" height="4" fill="var(--dragon-body)" />
          <rect x="14" y="40" width="6" height="4" fill="var(--dragon-body)" />
          <rect x="10" y="34" width="6" height="6" fill="var(--dragon-body)" />
          <rect x="6" y="28" width="6" height="6" fill="var(--dragon-body)" />
          {/* Golden Spiky Spade Tip */}
          <rect x="2" y="24" width="6" height="6" fill="var(--dragon-gold)" />
          <rect x="0" y="22" width="4" height="4" fill="var(--dragon-gold-light)" />
          <rect x="0" y="26" width="4" height="4" fill="var(--dragon-accent)" />

          {/* Main Torso & Golden Dorsal Ridge */}
          <rect x="24" y="34" width="28" height="20" fill="var(--dragon-body)" />
          <rect x="28" y="32" width="20" height="4" fill="var(--dragon-body-light)" />
          {/* Golden Dorsal Spikes */}
          <rect x="26" y="28" width="4" height="4" fill="var(--dragon-gold)" />
          <rect x="34" y="28" width="4" height="4" fill="var(--dragon-gold)" />
          <rect x="42" y="28" width="4" height="4" fill="var(--dragon-gold)" />

          {/* Golden Underbelly Plates */}
          <rect x="40" y="38" width="10" height="14" fill="var(--dragon-gold)" />
          <rect x="38" y="40" width="4" height="10" fill="var(--dragon-gold-light)" />
          <rect x="40" y="42" width="8" height="2" fill="var(--dragon-accent)" />
          <rect x="40" y="46" width="8" height="2" fill="var(--dragon-accent)" />

          {/* Claws & Feet */}
          <rect x="24" y="54" width="8" height="6" fill="var(--dragon-body)" />
          <rect x="22" y="60" width="12" height="4" fill="var(--dragon-body-light)" />
          <rect x="20" y="62" width="4" height="2" fill="#ffffff" opacity="0.9" />
          <rect x="26" y="62" width="4" height="2" fill="#ffffff" opacity="0.9" />

          <rect x="42" y="54" width="8" height="6" fill="var(--dragon-body)" />
          <rect x="40" y="60" width="12" height="4" fill="var(--dragon-body-light)" />
          <rect x="38" y="62" width="4" height="2" fill="#ffffff" opacity="0.9" />
          <rect x="44" y="62" width="4" height="2" fill="#ffffff" opacity="0.9" />

          {/* Neck & Head */}
          <rect x="46" y="26" width="12" height="12" fill="var(--dragon-body)" />
          <rect x="48" y="22" width="12" height="8" fill="var(--dragon-body-light)" />

          {/* Dragon Snout & Horns */}
          <rect x="52" y="16" width="18" height="14" fill="var(--dragon-body)" />
          <rect x="68" y="20" width="10" height="6" fill="var(--dragon-body)" />
          <rect x="64" y="28" width="12" height="4" fill="var(--dragon-body)" />

          {/* Sharp Fangs & Glowing Eye */}
          <rect x="70" y="26" width="2" height="2" fill="#ffffff" />
          <rect x="66" y="26" width="2" height="2" fill="#ffffff" />
          <rect x="58" y="18" width="4" height="4" fill="#38bdf8" />
          <rect x="60" y="18" width="2" height="2" fill="#ffffff" />

          {/* Horns */}
          <rect x="50" y="10" width="6" height="6" fill="var(--dragon-gold)" />
          <rect x="46" y="6" width="6" height="6" fill="var(--dragon-gold-light)" />
          <rect x="42" y="2" width="4" height="6" fill="var(--dragon-accent)" />

          {/* Front Wing */}
          <g className="s-wing s-wing-front">
            <rect x="34" y="20" width="6" height="4" fill="var(--dragon-accent)" />
            <rect x="28" y="24" width="16" height="4" fill="var(--dragon-gold)" />
            <rect x="24" y="28" width="22" height="4" fill="var(--dragon-gold-light)" />
            <rect x="22" y="32" width="24" height="4" fill="var(--dragon-gold)" />
            <rect x="26" y="36" width="18" height="4" fill="var(--dragon-accent)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/**
 * PixelDrexelDragon - Ambient pixel-art Drexel Dragon swarm pinned along the page document flow
 * (Does NOT stay fixed during scroll; scrolls naturally with the page).
 */
export default function PixelDrexelDragon() {
  return (
    <aside className="pixel-dragon-constellation" aria-label="Pixel Drexel Dragons">
      {DRAGONS.map((d) => (
        <DragonItem key={d.id} d={d} />
      ))}
    </aside>
  );
}
