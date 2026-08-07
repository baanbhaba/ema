import React, { useEffect, useRef, useCallback } from "react";
import { parseGIF, decompressFrames } from "gifuct-js";

interface AnimatedLogoProps {
  /** Tailwind/CSS className applied to the <canvas> */
  className?: string;
  /** Full loops to play before freezing on the last frame (default: 3) */
  loopsBeforeStop?: number;
}

/**
 * AnimatedLogo
 *  • Decodes cloud-network.gif frame-by-frame with gifuct-js
 *  • Auto-plays `loopsBeforeStop` loops then freezes on the last frame
 *  • On mouse-enter, plays exactly 1 more full loop then freezes again
 *  • Amber CSS filter applied so it matches ALCHEMI's colour scheme
 */
export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  className = "w-7 h-7",
  loopsBeforeStop = 3,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // All mutable animation state lives in a ref — no stale-closure issues
  const s = useRef({
    frames: [] as ReturnType<typeof decompressFrames>,
    offscreen: null as HTMLCanvasElement | null,
    frameIdx: 0,
    loopCount: 0,
    rafId: 0,
    lastTs: 0,
    running: false,
  });

  /** Paint one GIF frame onto the canvas */
  const drawFrame = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    const state = s.current;
    if (!canvas || !state.frames.length) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frame = state.frames[idx];
    const { width: fw, height: fh, left, top } = frame.dims;

    if (!state.offscreen) {
      state.offscreen = document.createElement("canvas");
      state.offscreen.width = canvas.width;
      state.offscreen.height = canvas.height;
    }
    const off = state.offscreen.getContext("2d")!;

    // Clear on first frame or when disposal says so
    if (idx === 0 || (frame.disposalType ?? 0) === 2) {
      off.clearRect(0, 0, canvas.width, canvas.height);
    }

    const img = off.createImageData(fw, fh);
    img.data.set(frame.patch);
    off.putImageData(img, left, top);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(state.offscreen, 0, 0);
  }, []);

  /**
   * Start the RAF loop for exactly `targetLoops` full cycles.
   * Cancels any currently running loop first.
   */
  const play = useCallback(
    (targetLoops: number) => {
      const state = s.current;
      cancelAnimationFrame(state.rafId);
      state.frameIdx = 0;
      state.loopCount = 0;
      state.lastTs = 0;
      state.running = true;

      const loop = (ts: number) => {
        if (!state.running || !state.frames.length) return;

        const frame = state.frames[state.frameIdx];
        const delay = (frame.delay ?? 10) * 10; // centiseconds → ms

        if (ts - state.lastTs >= delay) {
          drawFrame(state.frameIdx);
          state.lastTs = ts;
          state.frameIdx++;

          if (state.frameIdx >= state.frames.length) {
            state.frameIdx = 0;
            state.loopCount++;
            if (state.loopCount >= targetLoops) {
              state.running = false;
              return; // frozen on last painted frame
            }
          }
        }

        state.rafId = requestAnimationFrame(loop);
      };

      state.rafId = requestAnimationFrame(loop);
    },
    [drawFrame]
  );

  // Fetch + decode GIF once, then auto-play
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/cloud-network.gif");
        const buf = await res.arrayBuffer();
        if (cancelled) return;

        const gif = parseGIF(buf);
        const frames = decompressFrames(gif, true);
        if (cancelled || !frames.length) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = frames[0].dims.width;
        canvas.height = frames[0].dims.height;
        s.current.frames = frames;

        play(loopsBeforeStop);
      } catch (e) {
        console.warn("[AnimatedLogo] GIF load failed:", e);
      }
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(s.current.rafId);
      s.current.running = false;
    };
  }, [loopsBeforeStop, play]);

  const handleMouseEnter = useCallback(() => {
    if (s.current.frames.length) play(1);
  }, [play]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      onMouseEnter={handleMouseEnter}
      style={{
        filter:
          "sepia(1) saturate(4) hue-rotate(-15deg) brightness(1.15) contrast(1.05)",
        display: "block",
        borderRadius: "inherit",
      }}
    />
  );
};
