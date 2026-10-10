"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/* ============================================================
   PAGE TRANSITION — the SEO to GEO HQ logo covers the screen
   during route changes: it pops in while the next page loads,
   then the curtain lifts to reveal it. Also plays a short
   branded intro on the very first load.
   ============================================================ */

type Phase = "idle" | "intro" | "cover" | "reveal";

const COVER_MS = 520; // logo visible over the old page
const REVEAL_MS = 480; // curtain lifting away

export function PageTransition() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const first = useRef(true);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const clearTimers = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      clearTimers();
      const raf = requestAnimationFrame(() => setPhase("idle"));
      return () => cancelAnimationFrame(raf);
    }

    // requestAnimationFrame keeps setState out of the effect body and
    // lets the overlay cover the screen before the new page is painted.
    const raf = requestAnimationFrame(() => {
      if (first.current) {
        first.current = false;
        // Branded intro on first load
        setPhase("intro");
        timers.current.push(setTimeout(() => setPhase("idle"), 1100));
        return;
      }
      // Client-side navigation: cover, then reveal
      setPhase("cover");
      timers.current.push(
        setTimeout(() => {
          setPhase("reveal");
          timers.current.push(setTimeout(() => setPhase("idle"), REVEAL_MS));
        }, COVER_MS)
      );
    });

    return () => {
      cancelAnimationFrame(raf);
      clearTimers();
    };
  }, [pathname]);

  if (phase === "idle") return null;

  return (
    <div className={`page-transition page-transition--${phase}`} aria-hidden="true">
      <div className="page-transition__curtain">
        <div className="page-transition__logo">
          <img src="/assets/brand/logo.png" alt="" width={140} height={140} draggable={false} />
        </div>
        <div className="page-transition__brand">
          <span className="page-transition__word">SEO to GEO</span>
          <span className="page-transition__bar" />
        </div>
      </div>
    </div>
  );
}
