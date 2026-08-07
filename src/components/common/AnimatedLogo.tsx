import React, { useEffect, useRef, useCallback } from "react";
import { parseGIF, decompressFrames, type ParsedFrame } from "gifuct-js";

interface AnimatedLogoProps {
  /** Tailwind/CSS className applied to the <canvas> */
  className?: string;
  /** Full loops to play before freezing on the last frame (default: 3) */
  loopsBeforeStop?: number;
}

/**
 * AnimatedLogo
 *  • Decodes cloud-network.gif frame-by-frame via gifuct-js
 *  • Plays `loopsBeforeStop` full cycles then freezes on the last frame
 *  • On mouse-enter plays exactly 1 more full loop then freezes again
 *  • CSS filter tints the GIF amber to match ALCHEMI's colour scheme
 */
export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  className = "w-7 h-7",
  loopsBeforeStop = 3,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // All mutable animation state in a ref — zero stale-closure issues
  const s = useRef<{
    frames: ParsedFrame[];
    offscreen: HTMLCanvasElement | null;
    frameIdx: number;
    loopCount: number;
    rafId: number;
    lastTs: number;
    running: boolean;
  }>({
    frames: [],
    offscreen: null,
    frameIdx: 0,
    loopCount: 0,
    rafId: 0,
    lastTs: 0,
    running: false,
  });

  /** Composite one GIF frame onto the visible canvas */
  const drawFrame = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    const st = s.current;
    if (!canvas || !st.frames.length) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frame = st.frames[idx];
    const { width: fw, height: fh, left, top } = frame.dims;

    if (!st.offscreen) {
      st.offscreen = document.createElement("canvas");
      st.offscreen.width = canvas.width;
      st.offscreen.height = canvas.height;
    }
    const off = st.offscreen.getContext("2d")!;

    // Clear accumulated pixels on first frame or explicit clear disposal
    if (idx === 0 || frame.disposalType === 2) {
      off.clearRect(0, 0, canvas.width, canvas.height);
    }

    const imgData = off.createImageData(fw, fh);
    imgData.data.set(frame.patch);
    off.putImageData(imgData, left, top);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(st.offscreen, 0, 0);
  }, []);

  /**
   * Kick off RAF loop for exactly `targetLoops` full cycles.
   * Cancels any existing loop first.
   */
  const play = useCallback(
    (targetLoops: number) => {
      const st = s.current;
      cancelAnimationFrame(st.rafId);
      st.frameIdx = 0;
      st.loopCount = 0;
      st.lastTs = 0;
      st.running = true;

      const loop = (ts: number) => {
        if (!st.running || !st.frames.length) return;

        const frame = st.frames[st.frameIdx];
        // GIF delay is in centiseconds (1/100 s) → convert to ms
        const delay = (frame.delay ?? 10) * 10;

        if (ts - st.lastTs >= delay) {
          drawFrame(st.frameIdx);
          st.lastTs = ts;
          st.frameIdx++;

          if (st.frameIdx >= st.frames.length) {
            st.frameIdx = 0;
            st.loopCount++;
            if (st.loopCount >= targetLoops) {
              st.running = false;
              return; // stays frozen on last painted frame
            }
          }
        }

        st.rafId = requestAnimationFrame(loop);
      };

      st.rafId = requestAnimationFrame(loop);
    },
    [drawFrame]
  );

  // Fetch + decode the GIF exactly once on mount, then auto-play
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/cloud-network.gif");
        const buf = await res.arrayBuffer();
        if (cancelled) return;

        const gif = parseGIF(buf);
        // Pass literal `true` so TS resolves the overload to ParsedFrame[]
        const frames: ParsedFrame[] = decompressFrames(gif, true);
        if (cancelled || !frames.length) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = frames[0].dims.width;
        canvas.height = frames[0].dims.height;
        s.current.frames = frames;

        play(loopsBeforeStop);
      } catch (err) {
        console.warn("[AnimatedLogo] GIF load failed:", err);
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
        // Amber tint: sepia base → saturate warmth → nudge hue to ~38° amber
        filter:
          "sepia(1) saturate(4) hue-rotate(-15deg) brightness(1.15) contrast(1.05)",
        display: "block",
        borderRadius: "inherit",
      }}
    />
  );
};
