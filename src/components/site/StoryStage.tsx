"use client";

import { useEffect, useRef, useState } from "react";
import type { About } from "@/lib/content";

export function StoryStage({ about }: { about: About }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0); // 0 opening, 1..n beats, n+1 close

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
        const stages = about.beats.length + 2;
        setStage(Math.min(stages - 1, Math.floor(p * stages)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [about.beats.length]);

  return (
    <section className="about-story" ref={sectionRef}>
      <div className="about-story__sticky">
        <div className="about-story__layer">
          <div
            className="about-story__opening"
            style={{ opacity: stage === 0 ? 1 : 0, transition: "opacity 0.5s" }}
          >
            <h1>
              {about.titleA}
              <em>{about.titleEm}</em>
            </h1>
          </div>
        </div>
        {about.beats.map((beat, i) => (
          <div key={i} className="about-story__layer" style={{ pointerEvents: "none" }}>
            <div className="about-story__beats">
              <p className={stage === i + 1 ? "is-visible" : ""}>{beat}</p>
            </div>
          </div>
        ))}
        <div className="about-story__layer">
          <div
            className="about-story__close"
            style={{
              opacity: stage === about.beats.length + 1 ? 1 : 0,
              transition: "opacity 0.5s",
            }}
          >
            <p>{about.close[0] ?? ""}</p>
            <p>
              <em>{about.close[1] ?? ""}</em>
            </p>
          </div>
        </div>
        <div className="about-story__hint" data-story-hint>
          <span>{about.hint}</span>
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 9l8 7 8-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
