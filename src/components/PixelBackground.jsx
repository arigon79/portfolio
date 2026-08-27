import { useEffect, useRef } from 'react';

const CELL_SIZE = 14; // Size of each pixel cell in px
const TICK_RATE = 100; // Time in ms between automaton steps (~10 generations/sec)
const DENSITY = 0.08; // Initial random cell probability

export default function PixelBackground({ dark }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId;
    let lastTick = performance.now();
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;

    // Grid states:
    // grid: Uint8Array (0 or 1)
    // nextGrid: Uint8Array (0 or 1)
    // cellAlpha: Float32Array (smoothly fades from 1.0 to 0.0 on death)
    let grid;
    let nextGrid;
    let cellAlpha;

    const initGrid = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      cols = Math.ceil(width / CELL_SIZE) + 1;
      rows = Math.ceil(height / CELL_SIZE) + 1;

      const size = cols * rows;
      grid = new Uint8Array(size);
      nextGrid = new Uint8Array(size);
      cellAlpha = new Float32Array(size);

      // Seed initial random cells
      for (let i = 0; i < size; i++) {
        if (Math.random() < DENSITY) {
          grid[i] = 1;
          cellAlpha[i] = 0.4 + Math.random() * 0.6;
        }
      }

      // Add initial gliders
      spawnGlider(Math.floor(cols * 0.2), Math.floor(rows * 0.3), 1, 1);
      spawnGlider(Math.floor(cols * 0.7), Math.floor(rows * 0.5), -1, 1);
    };

    const getIndex = (x, y) => {
      const wrappedX = (x + cols) % cols;
      const wrappedY = (y + rows) % rows;
      return wrappedY * cols + wrappedX;
    };

    const spawnGlider = (x, y, dx = 1, dy = 1) => {
      const pattern = [
        [0, 1 * dy],
        [1 * dx, 2 * dy],
        [2 * dx, 0],
        [2 * dx, 1 * dy],
        [2 * dx, 2 * dy],
      ];
      pattern.forEach(([px, py]) => {
        const idx = getIndex(x + px, y + py);
        grid[idx] = 1;
        cellAlpha[idx] = 1.0;
      });
    };

    const countNeighbors = (x, y) => {
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          count += grid[getIndex(x + dx, y + dy)];
        }
      }
      return count;
    };

    const stepAutomaton = () => {
      let liveCount = 0;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const idx = y * cols + x;
          const neighbors = countNeighbors(x, y);
          const isAlive = grid[idx] === 1;

          if (isAlive) {
            if (neighbors === 2 || neighbors === 3) {
              nextGrid[idx] = 1;
              liveCount++;
            } else {
              nextGrid[idx] = 0;
            }
          } else {
            if (neighbors === 3) {
              nextGrid[idx] = 1;
              liveCount++;
            } else {
              nextGrid[idx] = 0;
            }
          }
        }
      }

      // Swap grids
      const temp = grid;
      grid = nextGrid;
      nextGrid = temp;

      // Spontaneously seed gliders if population drops
      if (liveCount < (cols * rows * DENSITY * 0.2)) {
        spawnGlider(
          Math.floor(Math.random() * (cols - 4)),
          Math.floor(Math.random() * (rows - 4)),
          Math.random() > 0.5 ? 1 : -1,
          Math.random() > 0.5 ? 1 : -1
        );
      }
    };

    // Color configuration based on theme
    const cellColor = dark
      ? { r: 74, g: 222, b: 128, baseAlpha: 0.22 } // Emerald green terminal glow
      : { r: 120, g: 140, b: 130, baseAlpha: 0.18 }; // Subtle slate / sage

    const render = (now) => {
      if (now - lastTick >= TICK_RATE) {
        stepAutomaton();
        lastTick = now;
      }

      ctx.clearRect(0, 0, width, height);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const idx = y * cols + x;
          const isAlive = grid[idx] === 1;

          if (isAlive) {
            cellAlpha[idx] = Math.min(1.0, cellAlpha[idx] + 0.15);
          } else {
            cellAlpha[idx] = Math.max(0.0, cellAlpha[idx] - 0.04);
          }

          const a = cellAlpha[idx];
          if (a > 0.01) {
            const finalAlpha = a * cellColor.baseAlpha;
            ctx.fillStyle = `rgba(${cellColor.r}, ${cellColor.g}, ${cellColor.b}, ${finalAlpha})`;
            ctx.fillRect(
              x * CELL_SIZE + 1,
              y * CELL_SIZE + 1,
              CELL_SIZE - 2,
              CELL_SIZE - 2
            );
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    let lastPointerCell = { x: -1, y: -1 };
    const handlePointerMove = (e) => {
      const cx = Math.floor(e.clientX / CELL_SIZE);
      const cy = Math.floor(e.clientY / CELL_SIZE);

      if (cx !== lastPointerCell.x || cy !== lastPointerCell.y) {
        lastPointerCell = { x: cx, y: cy };
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (Math.random() < 0.6) {
              const idx = getIndex(cx + dx, cy + dy);
              grid[idx] = 1;
              cellAlpha[idx] = 1.0;
            }
          }
        }
      }
    };

    const handleClick = (e) => {
      const cx = Math.floor(e.clientX / CELL_SIZE);
      const cy = Math.floor(e.clientY / CELL_SIZE);
      spawnGlider(cx, cy, Math.random() > 0.5 ? 1 : -1, Math.random() > 0.5 ? 1 : -1);
    };

    initGrid();
    animId = requestAnimationFrame(render);

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initGrid, 150);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('click', handleClick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('click', handleClick);
    };
  }, [dark]);

  return (
    <canvas
      ref={canvasRef}
      className="pixel-bg-canvas"
      aria-hidden="true"
    />
  );
}
