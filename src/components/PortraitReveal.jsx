import { useCallback, useEffect, useRef } from 'react';
import {
  getCoverCrop,
  getPixelOpacity,
  stylizePixel,
} from '../utils/portraitReveal';

const PIXEL_GRID_SIZE = 30;
const REVEAL_DURATION = 900;
const SHIMMER_INTERVAL = 320;

export default function PortraitReveal({ src, alt }) {
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const sourcePixelsRef = useRef(null);
  const revealTargetRef = useRef(0);
  const revealProgressRef = useRef(0);
  const pointerInsideRef = useRef(false);
  const focusInsideRef = useRef(false);

  const paintPixels = useCallback((phase = 0, revealProgress = 0) => {
    const canvas = canvasRef.current;
    const sourcePixels = sourcePixelsRef.current;
    if (!canvas || !sourcePixels) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const frame = context.createImageData(PIXEL_GRID_SIZE, PIXEL_GRID_SIZE);

    for (let y = 0; y < PIXEL_GRID_SIZE; y += 1) {
      for (let x = 0; x < PIXEL_GRID_SIZE; x += 1) {
        const offset = ((y * PIXEL_GRID_SIZE) + x) * 4;
        const [red, green, blue] = stylizePixel(
          sourcePixels.data[offset],
          sourcePixels.data[offset + 1],
          sourcePixels.data[offset + 2],
          x,
          y,
          phase,
        );

        frame.data[offset] = red;
        frame.data[offset + 1] = green;
        frame.data[offset + 2] = blue;
        frame.data[offset + 3] = Math.round(
          sourcePixels.data[offset + 3]
          * getPixelOpacity(x, y, PIXEL_GRID_SIZE, revealProgress),
        );
      }
    }

    context.putImageData(frame, 0, 0);
  }, []);

  const preparePixelPortrait = useCallback(() => {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    if (!image?.complete || !image.naturalWidth || !canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const crop = getCoverCrop(image.naturalWidth, image.naturalHeight, 1, 1, 0.5, 0.2);
    context.clearRect(0, 0, PIXEL_GRID_SIZE, PIXEL_GRID_SIZE);
    context.drawImage(
      image,
      crop.sx,
      crop.sy,
      crop.sw,
      crop.sh,
      0,
      0,
      PIXEL_GRID_SIZE,
      PIXEL_GRID_SIZE,
    );
    sourcePixelsRef.current = context.getImageData(0, 0, PIXEL_GRID_SIZE, PIXEL_GRID_SIZE);
    paintPixels(0, revealProgressRef.current);
  }, [paintPixels]);

  useEffect(() => {
    preparePixelPortrait();
  }, [preparePixelPortrait, src]);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animationFrame;
    let previousTime = performance.now();
    let previousPhase = -1;

    const animate = (time) => {
      const elapsed = Math.min(time - previousTime, 64);
      previousTime = time;
      const target = revealTargetRef.current;
      const current = revealProgressRef.current;
      const step = reducedMotion.matches ? 1 : elapsed / REVEAL_DURATION;
      const next = target > current
        ? Math.min(target, current + step)
        : Math.max(target, current - step);
      const phase = reducedMotion.matches ? 0 : Math.floor(time / SHIMMER_INTERVAL) % 3;

      if (next !== current || (next < 1 && phase !== previousPhase)) {
        revealProgressRef.current = next;
        paintPixels(phase, next);
      }

      previousPhase = phase;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [paintPixels]);

  const updateRevealTarget = () => {
    revealTargetRef.current = pointerInsideRef.current || focusInsideRef.current ? 1 : 0;
  };

  return (
    <button
      type="button"
      className="portrait-reveal"
      aria-label={`Show original portrait of ${alt}`}
      onPointerEnter={() => {
        pointerInsideRef.current = true;
        updateRevealTarget();
      }}
      onPointerLeave={() => {
        pointerInsideRef.current = false;
        updateRevealTarget();
      }}
      onFocus={() => {
        focusInsideRef.current = true;
        updateRevealTarget();
      }}
      onBlur={() => {
        focusInsideRef.current = false;
        updateRevealTarget();
      }}
    >
      <img
        ref={imageRef}
        src={src}
        alt=""
        className="research-portrait portrait-reveal-original"
        onLoad={preparePixelPortrait}
      />
      <canvas
        ref={canvasRef}
        width={PIXEL_GRID_SIZE}
        height={PIXEL_GRID_SIZE}
        className="portrait-pixel-canvas"
        aria-hidden="true"
      />
    </button>
  );
}
