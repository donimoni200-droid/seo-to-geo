import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { CountdownBar } from "@/components/site/CountdownBar";
import { Reveal } from "@/components/site/Reveal";
import { FaqList } from "@/components/site/FaqList";
import { HomeFooter } from "@/components/site/HomeFooter";
import { WaitlistForm } from "@/components/site/WaitlistForm";
import {
  getChallengePage,
  getBrand,
  getNav,
  getCountdown,
  getFooter,
} from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [brand, cp] = await Promise.all([getBrand(), getChallengePage()]);
  return {
    title: `${cp.heroKicker} | Join the Waitlist`,
    description:
      "Brands and marketers have gone from invisible in AI answers to cited by ChatGPT, Perplexity, and Gemini in 30 guided days. Doors are closed — join the waitlist.",
  };
}

export default async function ChallengePage() {
  const [cp, brand, nav, countdown, footer] = await Promise.all([
    getChallengePage(),
    getBrand(),
    getNav(),
    getCountdown(),
    getFooter(),
  ]);

  return (
    <div className="inner-page fade-in">
      <CountdownBar countdown={countdown} />
      <SiteNav nav={nav} brand={brand} />
      <main>
        {/* HERO */}
        <section className="inner-hero">
          <div className="inner-hero__copy">
            <p className="home-section-kicker">{cp.heroKicker}</p>
            <h1 className="inner-hero__title">
              {cp.heroTitle.map((line, i) => (
                <span key={i} style={{ display: "block" }}>
                  {line}
                </span>
              ))}
            </h1>
            <p className="status-line">{cp.statusLine}</p>
            <a href="#waitlist" className="btn btn--hero">
              {cp.heroCta}
            </a>
          </div>
          <div className="inner-hero__visual">
            { }
            <img src="/assets/sections/challenge-desk.png" alt="Working through the daily GEO Challenge builds" />
          </div>
        </section>

        {/* WHY NOW */}
        <section className="split-section">
          <div className="split-section__copy">
            <h2 className="split-section__title">{cp.sectionOne.title}</h2>
            <div className="split-section__body">
              <p>{cp.sectionOne.body}</p>
              <ul className="benefit-list">
                {cp.sectionOne.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
          <Reveal className="split-section__media">
            { }
            <img src="/assets/about/journey-2025.png" alt="AI engines citing the brand in generated answers" />
          </Reveal>
        </section>

        {/* NOT AN ENGINEER */}
        <section className="split-section split-section--flip">
          <div className="split-section__copy">
            <h2 className="split-section__title">{cp.sectionTwo.title}</h2>
            <div className="split-section__body">
              <p>{cp.sectionTwo.body}</p>
            </div>
          </div>
          <Reveal className="split-section__media">
            { }
            <img src="/assets/about/journey-now.png" alt="Teaching practical GEO workflows" />
          </Reveal>
        </section>

        {/* INTRO + SOCIAL PROOF */}
        <section className="red-band">
          <div className="red-band__inner">
            <h2 className="split-section__title">{cp.intro.title}</h2>
            <div className="red-band__body">
              <p>{cp.intro.body}</p>
            </div>
            <h2 className="split-section__title" style={{ marginTop: "clamp(50px, 7vw, 90px)" }}>
              {cp.socialProof.title}
            </h2>
            <div className="stats-grid">
              {cp.socialProof.stats.map((s) => (
                <div key={s.label} className="stat-card">
                  <div className="stat-card__value">{s.value}</div>
                  <div className="stat-card__label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* THE PACKAGE */}
        <section style={{ padding: "clamp(70px, 9vw, 130px) clamp(24px, 5vw, 78px) 0" }}>
          <div className="section-heading">
            <h2>{cp.packageSection.title}</h2>
          </div>
          <div className="blocks-grid" style={{ width: "min(100%, 1180px)", margin: "0 auto" }}>
            {cp.packageSection.blocks.map((b) => (
              <div key={b.title} className="block-card">
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="red-band" style={{ marginTop: "clamp(70px, 9vw, 130px)" }}>
          <div className="red-band__inner">
            <h2 className="split-section__title">{cp.howItWorks.title}</h2>
            <div className="how-grid">
              {cp.howItWorks.items.map((item, i) => (
                <div key={item.title} className="how-card">
                  <div className="how-card__num">{String(i + 1).padStart(2, "0")}</div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BONUSES */}
        <section style={{ padding: "clamp(70px, 9vw, 130px) clamp(24px, 5vw, 78px) 0" }}>
          <div className="section-heading">
            <h2>{cp.bonuses.title}</h2>
          </div>
          <div className="bonus-grid" style={{ width: "min(100%, 1180px)", margin: "0 auto" }}>
            {cp.bonuses.items.map((b) => (
              <div key={b.title} className="bonus-item">
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HONEST + READ BEFORE */}
        <section className="split-section">
          <div className="split-section__copy">
            <h2 className="split-section__title">{cp.honest.title}</h2>
            <div className="split-section__body">
              <p>{cp.honest.body}</p>
            </div>
          </div>
          <div className="split-section__copy">
            <h2 className="split-section__title">{cp.readBefore.title}</h2>
            <ul className="check-list">
              {cp.readBefore.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* CERTIFICATE */}
        <section className="split-section split-section--flip">
          <Reveal className="split-section__media">
            { }
            <img src="/assets/sections/paths-portrait.png" alt="GEO Challenge graduate" />
          </Reveal>
          <div className="split-section__copy">
            <h2 className="split-section__title">{cp.certificate.title}</h2>
            <div className="split-section__body">
              <p>{cp.certificate.body}</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "clamp(70px, 9vw, 130px) clamp(24px, 5vw, 78px) 0" }}>
          <div className="section-heading">
            <h2>{cp.faq.title}</h2>
          </div>
          <FaqList items={cp.faq.items} />
        </section>

        {/* FINAL CTA */}
        <section className="final-cta" id="waitlist">
          <h2>
            {cp.final.titleA}
            <br />
            {cp.final.titleB}
          </h2>
          <WaitlistForm source="challenge" buttonText={cp.final.cta} />
          <p className="status-line">{cp.final.sub}</p>
        </section>
      </main>
      <HomeFooter footer={footer} brand={brand}>
        <WaitlistForm source="challenge-footer" buttonText={footer.ctaButton} />
      </HomeFooter>
    </div>
  );
}
