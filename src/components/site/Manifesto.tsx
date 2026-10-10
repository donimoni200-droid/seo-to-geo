"use client";

import { useEffect, useRef, useState } from "react";
import type { Manifesto } from "@/lib/content";

/* Orbiting glass chips around the sticky manifesto section */
export function Manifesto({ manifesto }: { manifesto: Manifesto }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0); // 0..1 through the tall section

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        if (total <= 0) return;
        const p = Math.min(1, Math.max(0, -rect.top / total));
        setProgress(p);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const angle = progress * Math.PI * 1.5;

  const orbitStyle = (index: number) => {
    const offsets = [
      { x: Math.sin(angle) * 26, y: Math.cos(angle) * 14 - 10, r: Math.sin(angle) * 4 },
      { x: -Math.sin(angle) * 24, y: Math.cos(angle + 1.2) * 18 + 6, r: -Math.sin(angle) * 5 },
      { x: Math.sin(angle + 2.2) * 20, y: -Math.cos(angle) * 16 + 12, r: Math.cos(angle) * 5 },
      { x: -Math.sin(angle + 0.6) * 18, y: -Math.cos(angle + 2) * 20 - 4, r: Math.sin(angle + 1) * 4 },
    ];
    const o = offsets[index % offsets.length];
    return {
      ["--orbit-x" as string]: `${o.x}px`,
      ["--orbit-y" as string]: `${o.y}px`,
      ["--orbit-rotate" as string]: `${o.r}deg`,
    };
  };

  const chipClasses = [
    "orbit-object--openai",
    "orbit-object--gemini",
    "orbit-object--claude",
    "orbit-object--meta",
  ];

  return (
    <section className="home-manifesto" id="about" ref={sectionRef}>
      <div className="home-manifesto__sticky">
        <div className="home-manifesto__copy">
          <p className="home-manifesto__eyebrow">{manifesto.kicker}</p>
          <h2 className="home-manifesto__title">
            {manifesto.titleA} <em>{manifesto.titleEm}</em>
          </h2>
          <div className="home-manifesto__body">
            {manifesto.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
      {manifesto.chips.map((chip, i) => (
        <div
          key={chip}
          className={`orbit-object orbit-object--chip ${chipClasses[i % 4]}`}
          data-orbit-object
          aria-hidden="true"
          style={orbitStyle(i)}
        >
          <span>{chip}</span>
        </div>
      ))}
    </section>
  );
}
