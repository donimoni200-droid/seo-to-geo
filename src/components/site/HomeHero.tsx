import type { Hero } from "@/lib/content";

/* Hand-drawn arrow paths for hero callouts */
function ArrowOne() {
  return (
    <svg viewBox="0 0 110 70" aria-hidden="true">
      <path d="M8 14c25-10 39 0 39 18 0 16 25 23 50 8"></path>
      <path d="m84 32 15 8-11 13"></path>
    </svg>
  );
}
function ArrowTwo() {
  return (
    <svg viewBox="0 0 110 70" aria-hidden="true">
      <path d="M102 14c-24-10-39 1-37 19 2 16-24 23-49 8"></path>
      <path d="m30 33-15 8 11 13"></path>
    </svg>
  );
}
function ArrowThree() {
  return (
    <svg viewBox="0 0 110 70" aria-hidden="true">
      <path d="M7 57c25 9 40-2 39-20-1-16 25-23 52-9"></path>
      <path d="M86 15 100 28l-17 4"></path>
    </svg>
  );
}

export function HomeHero({ hero }: { hero: Hero }) {
  const arrows = [<ArrowOne key="1" />, <ArrowTwo key="2" />, <ArrowThree key="3" />];
  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <picture className="home-hero__media">
        <source media="(max-width: 760px)" srcSet="/assets/hero/hero-mobile.png" />
        { }
        <img src="/assets/hero/hero-desktop.png" alt={`${hero.titleB} — the SEO to GEO HQ studio desk`} />
      </picture>
      <h1 className="home-hero__title" id="home-hero-title">
        {hero.titleA} <em>{hero.titleEm}</em> {hero.titleB}
      </h1>
      {hero.callouts.map((c, i) => (
        <div className={`home-hero__callout home-hero__callout--${["one", "two", "three"][i]}`} key={i}>
          <p>
            {c.text[0] ?? ""}
            <br />
            {c.text[1] ?? ""}
          </p>
          {arrows[i]}
        </div>
      ))}
    </section>
  );
}
