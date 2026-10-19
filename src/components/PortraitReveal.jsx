import { useCallback, useEffect, useRef } from 'react';
import { getCoverCrop } from '../utils/portraitReveal';

const PIXEL_GRID_SIZE = 30;

export default function PortraitReveal({ src, alt }) {
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  const drawPixelPortrait = useCallback(() => {
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
  }, []);

  useEffect(() => {
    drawPixelPortrait();
  }, [drawPixelPortrait, src]);

  return (
    <button
      type="button"
      className="portrait-reveal"
      aria-label={`Show original portrait of ${alt}`}
    >
      <img
        ref={imageRef}
        src={src}
        alt=""
        className="research-portrait portrait-reveal-original"
        onLoad={drawPixelPortrait}
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
