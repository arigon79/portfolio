import { useMemo } from 'react';

// Generates smooth C1 continuous closed bezier curve around a circle with harmonic smoke undulations
function createSmokeWavePath(radius, numPoints, freq1, freq2, amp1, amp2, phase) {
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const theta = (i * 2 * Math.PI) / numPoints;
    const r =
      radius +
      Math.sin(theta * freq1 + phase) * amp1 +
      Math.cos(theta * freq2 + phase * 1.4) * amp2;
    points.push({
      x: 170 + r * Math.cos(theta),
      y: 170 + r * Math.sin(theta),
    });
  }

  const n = points.length;
  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)} `;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += `C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} `;
  }
  d += 'Z';
  return d;
}

export default function AudioWaveRing() {
  const smokeLayers = useMemo(() => {
    return [
      {
        id: 'smoke-inner',
        d: createSmokeWavePath(146, 24, 3, 5, 7, 5, 0.4),
        className: 'smoke-ribbon smoke-ribbon--1',
        stroke: 'url(#smoke-grad-1)',
        strokeWidth: 2.2,
      },
      {
        id: 'smoke-mid-1',
        d: createSmokeWavePath(154, 28, 4, 3, 10, 6, 1.8),
        className: 'smoke-ribbon smoke-ribbon--2',
        stroke: 'url(#smoke-grad-2)',
        strokeWidth: 2.6,
      },
      {
        id: 'smoke-mid-2',
        d: createSmokeWavePath(162, 32, 5, 4, 12, 8, 3.2),
        className: 'smoke-ribbon smoke-ribbon--3',
        stroke: 'url(#smoke-grad-3)',
        strokeWidth: 2,
      },
      {
        id: 'smoke-outer',
        d: createSmokeWavePath(170, 36, 6, 3, 14, 9, 4.6),
        className: 'smoke-ribbon smoke-ribbon--4',
        stroke: 'url(#smoke-grad-4)',
        strokeWidth: 1.6,
      },
    ];
  }, []);

  const smokeWisps = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const angle = (i * 360) / 8 + 15;
      const dist = 148 + (i % 3) * 12;
      const size = 3.5 + (i % 4) * 1.5;
      const duration = 4.5 + (i % 5) * 1.2;
      const delay = -(i * 0.85);
      return { id: i, angle, dist, size, duration, delay };
    });
  }, []);

  return (
    <div className="audio-wave-wrap smoke-wave-wrap" aria-hidden="true">
      {/* Morphing Smoky Aura Vapor Blobs (Diffused Glow & Fluid Dispersion) */}
      <div className="smoke-aura smoke-aura--1" />
      <div className="smoke-aura smoke-aura--2" />
      <div className="smoke-aura smoke-aura--3" />
      <div className="smoke-aura smoke-aura--4" />

      {/* SVG Smoke Wave Contours & Ribbons */}
      <svg className="smoke-wave-svg" viewBox="0 0 340 340">
        <defs>
          {/* Subtle Dynamic Smoke Turbulence Displacement */}
          <filter id="smoke-displace" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.02"
              numOctaves="3"
              result="smokeNoise"
              seed="7"
            >
              <animate
                attributeName="baseFrequency"
                dur="14s"
                values="0.015 0.02; 0.025 0.035; 0.018 0.024; 0.015 0.02"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="smokeNoise"
              scale="12"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          <linearGradient id="smoke-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--lime)" stopOpacity="0.85" />
            <stop offset="50%" stopColor="var(--teal)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.6" />
          </linearGradient>

          <linearGradient id="smoke-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.8" />
            <stop offset="60%" stopColor="var(--lime)" stopOpacity="0.65" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="smoke-grad-3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.7" />
            <stop offset="50%" stopColor="var(--lime)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--teal)" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="smoke-grad-4" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="var(--lime)" stopOpacity="0.5" />
            <stop offset="50%" stopColor="var(--teal)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Filtered Smoky Ribbons */}
        <g filter="url(#smoke-displace)">
          {smokeLayers.map((layer) => (
            <path
              key={layer.id}
              d={layer.d}
              className={layer.className}
              fill="none"
              stroke={layer.stroke}
              strokeWidth={layer.strokeWidth}
            />
          ))}
        </g>

        {/* Swirling Smoke Tendrils / Vapor Particles */}
        <g transform="translate(170, 170)">
          {smokeWisps.map((w) => (
            <g
              key={w.id}
              className="smoke-wisp-rotator"
              style={{
                animationDuration: `${w.duration}s`,
                animationDelay: `${w.delay}s`,
              }}
            >
              <circle
                className="smoke-wisp-particle"
                cx={w.dist * Math.cos((w.angle * Math.PI) / 180)}
                cy={w.dist * Math.sin((w.angle * Math.PI) / 180)}
                r={w.size}
                style={{
                  animationDuration: `${w.duration * 0.75}s`,
                  animationDelay: `${w.delay}s`,
                }}
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
