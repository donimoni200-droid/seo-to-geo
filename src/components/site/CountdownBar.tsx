"use client";

import { useEffect, useState } from "react";
import type { Countdown } from "@/lib/content";

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, "0");
}

export function CountdownBar({ countdown }: { countdown: Countdown }) {
  const [t, setT] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    if (!countdown.enabled) return;
    const target = new Date(countdown.target).getTime();
    if (isNaN(target)) return;
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setT(null);
        return;
      }
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [countdown.enabled, countdown.target]);

  if (!countdown.enabled || !t) return null;

  return (
    <a className="cd-bar" href={countdown.href} aria-label={countdown.label}>
      <span>{countdown.label}</span>
      <span className="cd-timer" aria-hidden="true">
        <span>
          {pad(t.d)}
          <b>DAYS</b>
        </span>
        <span>
          {pad(t.h)}
          <b>HRS</b>
        </span>
        <span>
          {pad(t.m)}
          <b>MIN</b>
        </span>
        <span>
          {pad(t.s)}
          <b>SEC</b>
        </span>
      </span>
    </a>
  );
}
