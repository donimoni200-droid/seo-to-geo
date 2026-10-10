import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { CountdownBar } from "@/components/site/CountdownBar";
import { StoryStage } from "@/components/site/StoryStage";
import { HomeFooter } from "@/components/site/HomeFooter";
import { WaitlistForm } from "@/components/site/WaitlistForm";
import { getAbout, getBrand, getNav, getCountdown, getFooter } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [brand, about] = await Promise.all([getBrand(), getAbout()]);
  return {
    title: "About",
    description: `Meet the strategist behind ${brand.name}: former search agency lead, two-time founder, and your guide to getting cited by AI engines.`,
    openGraph: {
      title: "About",
      description: about.beats[0] || "The story behind the GEO playbook.",
      type: "website",
    },
  };
}

export default async function AboutPage() {
  const [about, brand, nav, countdown, footer] = await Promise.all([
    getAbout(),
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
        <StoryStage about={about} />
        <section className="journey" id="journey" aria-labelledby="journey-title">
          <div className="journey__intro">
            <h2 id="journey-title">
              {about.journeyTitle}
              <em>{about.journeyTitleEm}</em>
            </h2>
          </div>
          <div className="journey__timeline" aria-label="Founder journey timeline">
            <div className="journey__line" aria-hidden="true" />
            {about.timeline.map((card, idx) => (
              <article
                key={card.step}
                className={`journey-card ${
                  idx % 2 === 0 ? "journey-card--top" : "journey-card--bottom"
                } reveal-up is-visible`}
              >
                <div className="journey-card__marker" aria-hidden="true" />
                <p className="journey-card__step">{card.step}</p>
                { }
                <img src={card.img} alt={card.title} loading="lazy" />
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <HomeFooter footer={footer} brand={brand}>
        <WaitlistForm source="about" buttonText={footer.ctaButton} />
      </HomeFooter>
    </div>
  );
}
