import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * PixelCritters - ambient pixel-art cats, dogs and pandas floating in the page
 * gutters. Each one can be petted (click / Enter / Space): it squints, wiggles
 * and pops a heart. Pet one five times and it keeps a little heart above it.
 *
 * Sprites are 16x16 char grids:
 *   .  transparent   K  outline / dark fur   B  base fur   S  shade fur
 *   W  light (muzzle, paws)   P  pink (nose, inner ear)    E  eye
 */

const CAT = [
  '................',
  '..KK........KK..',
  '..KPK......KPK..',
  '..KBPK....KBPK..',
  '..KBBBKKKKBBBK..',
  '..KBBBBBBBBBBK..',
  '..KBEEBBBBEEBK..',
  '..KBEEBBBBEEBK..',
  '..KBBBWPPWBBBK..',
  '...KBBWWWWBBK...',
  '....KBBBBBBK..KK',
  '...KBBBBBBBBK.KB',
  '..KBBBBBBBBBBKKB',
  '..KBBBBBBBBBBKB.',
  '..KBWWBBBBWWBK..',
  '...KKKKKKKKKK...',
];

const DOG = [
  '................',
  '....KKKKKKKK....',
  '.KKKBBBBBBBBKKK.',
  '.KSSBBBBBBBBSSK.',
  '.KSSBBBBBBBBSSK.',
  '.KSSBEEBBEEBSSK.',
  '.KSSBBBBBBBBSSK.',
  '.KSSBBWWWWBBSSK.',
  '.KSSBBWKKWBBSSK.',
  '..KKBBWWWWBBKK..',
  '...KBBBBBBBBK...',
  '...KBBBBBBBBK.KK',
  '..KBBBBBBBBBBKKB',
  '..KBBBBBBBBBBKB.',
  '..KBWWBBBBWWBK..',
  '...KKKKKKKKKK...',
];

const PANDA = [
  '..KK........KK..',
  '.KKKK......KKKK.',
  '.KKKK......KKKK.',
  '..KKWWWWWWWWKK..',
  '.KWWWWWWWWWWWWK.',
  '.KWWKKWWWWKKWWK.',
  '.KWWKEWWWWEKWWK.',
  '.KWWKKWWWWKKWWK.',
  '.KWWWWKKKKWWWWK.',
  '..KWWWKKKKWWWK..',
  '...KWWWWWWWWK...',
  '..KKWWWWWWWWKK..',
  '.KKKWWWWWWWWKKK.',
  '.KKKWWWWWWWWKKK.',
  '..KWWWWWWWWWWK..',
  '...KKKKKKKKKK...',
];

const PALETTES = {
  ginger: { K: '#3b2a20', B: '#f0a355', S: '#d97b33', W: '#fff3e2', P: '#f2a2b8', E: '#241812' },
  smoke: { K: '#2e3540', B: '#9aa5b1', S: '#6b7784', W: '#f1f5f9', P: '#eda3b6', E: '#1b2029' },
  cream: { K: '#463527', B: '#f6ddb8', S: '#dcbb8c', W: '#fffaf0', P: '#f0a0b4', E: '#2c211a' },
  shiba: { K: '#3a2b1e', B: '#e0a768', S: '#c98b4b', W: '#fff8ec', P: '#f2a2b8', E: '#241a12' },
  husky: { K: '#2b2f38', B: '#e8edf3', S: '#b7c2cf', W: '#ffffff', P: '#eaa0b3', E: '#1a1d24' },
  panda: { K: '#2b2b33', B: '#f7f7f5', S: '#d8d8d4', W: '#f7f7f5', P: '#f0a0b4', E: '#ffffff' },
};

const SPRITES = { cat: CAT, dog: DOG, panda: PANDA };
const EMOJI = { cat: '🐱', dog: '🐶', panda: '🐼' };

// Merge horizontal runs of identical pixels into single rects.
function rowsToRects(rows) {
  const out = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === '.') {
        x += 1;
        continue;
      }
      let w = 1;
      while (x + w < row.length && row[x + w] === ch) w += 1;
      out.push({ x, y, w, ch });
      x += w;
    }
  });
  return out;
}

const RECTS = {
  cat: rowsToRects(CAT),
  dog: rowsToRects(DOG),
  panda: rowsToRects(PANDA),
};

// Tucked into the gutters, interleaved with the dragon positions so they
// never sit on top of each other.
const CRITTERS = [
  { id: 'c1',  kind: 'cat',   skin: 'ginger', top: '7%',  left: '2.4vw',  size: 46, anim: 'float',  duration: 6.4, delay: 0.4, flip: false },
  { id: 'c2',  kind: 'panda', skin: 'panda',  top: '11%', right: '3.6vw', size: 54, anim: 'hop',    duration: 3.1, delay: 1.6, flip: true },
  { id: 'c3',  kind: 'dog',   skin: 'shiba',  top: '16%', left: '7vw',    size: 38, anim: 'sway',   duration: 5.2, delay: 0.9, flip: false },
  { id: 'c4',  kind: 'cat',   skin: 'smoke',  top: '22%', right: '2.2vw', size: 58, anim: 'drift',  duration: 9.4, delay: 2.3, flip: true },
  { id: 'c5',  kind: 'panda', skin: 'panda',  top: '28%', left: '3.2vw',  size: 44, anim: 'wobble', duration: 4.6, delay: 1.1, flip: false },
  { id: 'c6',  kind: 'dog',   skin: 'husky',  top: '34%', right: '6.4vw', size: 40, anim: 'bob',    duration: 4.2, delay: 2.8, flip: true },
  { id: 'c7',  kind: 'cat',   skin: 'cream',  top: '40%', left: '2.6vw',  size: 56, anim: 'hop',    duration: 3.6, delay: 0.6, flip: false },
  { id: 'c8',  kind: 'panda', skin: 'panda',  top: '46%', right: '3vw',   size: 48, anim: 'float',  duration: 8.2, delay: 1.4, flip: true },
  { id: 'c9',  kind: 'dog',   skin: 'shiba',  top: '52%', left: '6.2vw',  size: 42, anim: 'wobble', duration: 5.0, delay: 2.1, flip: false },
  { id: 'c10', kind: 'cat',   skin: 'smoke',  top: '58%', right: '2.6vw', size: 50, anim: 'sway',   duration: 6.0, delay: 0.3, flip: true },
  { id: 'c11', kind: 'panda', skin: 'panda',  top: '64%', left: '3.6vw',  size: 60, anim: 'drift',  duration: 10.2, delay: 1.8, flip: false },
  { id: 'c12', kind: 'dog',   skin: 'husky',  top: '70%', right: '6.8vw', size: 36, anim: 'hop',    duration: 3.4, delay: 2.6, flip: true },
  { id: 'c13', kind: 'cat',   skin: 'ginger', top: '76%', left: '2.2vw',  size: 52, anim: 'bob',    duration: 4.8, delay: 1.2, flip: false },
  { id: 'c14', kind: 'panda', skin: 'panda',  top: '82%', right: '3.4vw', size: 42, anim: 'wobble', duration: 4.4, delay: 0.7, flip: true },
  { id: 'c15', kind: 'dog',   skin: 'shiba',  top: '88%', left: '6.6vw',  size: 46, anim: 'float',  duration: 7.4, delay: 2.4, flip: false },
  { id: 'c16', kind: 'cat',   skin: 'cream',  top: '94%', right: '2.4vw', size: 54, anim: 'sway',   duration: 5.6, delay: 1.5, flip: true },
  { id: 'c17', kind: 'panda', skin: 'panda',  top: '97%', left: '3vw',    size: 38, anim: 'hop',    duration: 3.8, delay: 0.5, flip: false },
];

// Phone-sized screens have no gutters, so a few critters walk a strip
// pinned to the bottom of the viewport instead.
const STRIP_CRITTERS = [
  { id: 's1', kind: 'cat',   skin: 'ginger', size: 34, anim: 'hop',    duration: 3.2, delay: 0.2, flip: false },
  { id: 's2', kind: 'dog',   skin: 'shiba',  size: 32, anim: 'bob',    duration: 4.0, delay: 1.1, flip: true },
  { id: 's3', kind: 'panda', skin: 'panda',  size: 34, anim: 'wobble', duration: 4.6, delay: 0.6, flip: false },
  { id: 's4', kind: 'cat',   skin: 'smoke',  size: 30, anim: 'sway',   duration: 5.2, delay: 1.8, flip: true },
];

const BOND_AT = 5;

function CritterItem({ c, variant = 'gutter' }) {
  const [pets, setPets] = useState(0);
  const [happy, setHappy] = useState(false);
  const [hearts, setHearts] = useState([]);
  const happyTimer = useRef(null);
  const heartTimers = useRef([]);
  const nextHeart = useRef(0);

  useEffect(() => () => {
    clearTimeout(happyTimer.current);
    heartTimers.current.forEach(clearTimeout);
  }, []);

  const pet = useCallback(() => {
    setPets((p) => p + 1);
    setHappy(true);
    clearTimeout(happyTimer.current);
    happyTimer.current = setTimeout(() => setHappy(false), 900);

    const id = nextHeart.current++;
    const drift = Math.round(-16 + Math.random() * 32);
    setHearts((h) => [...h, { id, drift }]);
    const t = setTimeout(() => {
      setHearts((h) => h.filter((x) => x.id !== id));
      heartTimers.current = heartTimers.current.filter((x) => x !== t);
    }, 1100);
    heartTimers.current.push(t);
  }, []);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      pet();
    }
  };

  const palette = PALETTES[c.skin];
  const bonded = pets >= BOND_AT;
  // Critters parked further from the edge need a wider gutter to stay off the text.
  const strip = variant === 'strip';
  const lane = !strip && parseFloat(c.left ?? c.right) >= 6 ? 'inner' : 'outer';

  return (
    <div
      className={
        'pixel-critter' +
        (strip ? ' pixel-critter--strip' : '') +
        ` critter-anim-${c.anim}` +
        (happy ? ' is-happy' : '') +
        (bonded ? ' is-bonded' : '') +
        (c.flip ? ' is-flipped' : '')
      }
      style={{
        top: strip ? undefined : c.top,
        left: strip ? undefined : c.left,
        right: strip ? undefined : c.right,
        width: `${c.size}px`,
        height: `${c.size}px`,
        animationDuration: `${c.duration}s`,
        animationDelay: `${c.delay}s`,
      }}
      data-lane={lane}
      role="button"
      tabIndex={0}
      aria-label={`Pet the pixel ${c.kind}`}
      title={pets ? `${EMOJI[c.kind]} petted ${pets}×` : `${EMOJI[c.kind]} Click to pet!`}
      onClick={pet}
      onKeyDown={onKeyDown}
    >
      <svg className="critter-svg" viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
        {RECTS[c.kind].map((r) => (
          <rect
            key={`${r.y}-${r.x}`}
            x={r.x}
            y={r.y}
            width={r.w}
            height={1}
            fill={palette[r.ch]}
            className={r.ch === 'E' ? 'critter-eye' : undefined}
          />
        ))}
      </svg>

      {hearts.map((h) => (
        <span key={h.id} className="critter-heart" style={{ '--drift': `${h.drift}px` }} aria-hidden="true">
          ♥
        </span>
      ))}

      {bonded && <span className="critter-bond" aria-hidden="true">♥</span>}
    </div>
  );
}

export default function PixelCritters() {
  return (
    <>
      <aside className="pixel-critter-layer" aria-label="Pixel cats, dogs and pandas — click to pet">
        {CRITTERS.map((c) => (
          <CritterItem key={c.id} c={c} />
        ))}
      </aside>

      <aside className="critter-strip" aria-label="Pixel cats, dogs and pandas — tap to pet">
        {STRIP_CRITTERS.map((c) => (
          <CritterItem key={c.id} c={c} variant="strip" />
        ))}
      </aside>
    </>
  );
}
