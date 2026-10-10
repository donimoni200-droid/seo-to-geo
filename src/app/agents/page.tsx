import { SiteNav } from "@/components/site/SiteNav";
import { CountdownBar } from "@/components/site/CountdownBar";
import { HomeFooter } from "@/components/site/HomeFooter";
import { WaitlistForm } from "@/components/site/WaitlistForm";
import {
  getPlaceholderPages,
  getBrand,
  getNav,
  getCountdown,
  getFooter,
} from "@/lib/content";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [brand, pp] = await Promise.all([getBrand(), getPlaceholderPages()]);
  return {
    title: "The GEO Agent Suite",
    description: pp.agents.desc,
  };
}

export default async function AgentsPage() {
  const [pp, brand, nav, countdown, footer] = await Promise.all([
    getPlaceholderPages(),
    getBrand(),
    getNav(),
    getCountdown(),
    getFooter(),
  ]);
  const agents = pp.agents;

  return (
    <div className="inner-page fade-in">
      <CountdownBar countdown={countdown} />
      <SiteNav nav={nav} brand={brand} />
      <main>
        <section className="inner-hero">
          <div className="inner-hero__copy">
            <p className="home-section-kicker">{agents.kicker}</p>
            <h1 className="inner-hero__title">
              {agents.titleA}
              <em>{agents.titleEm}</em>
              {agents.titleB}
            </h1>
            <p>{agents.desc}</p>
            <a className="btn btn--hero" href="#suite">
              {agents.cta}
            </a>
          </div>
          <div className="inner-hero__visual">
            { }
            <img src="/assets/about/journey-2025.png" alt="The GEO agent suite running weekly visibility checks" />
          </div>
        </section>
        <section id="suite" style={{ padding: "clamp(70px, 9vw, 130px) clamp(24px, 5vw, 78px)" }}>
          <div className="section-heading">
            <h2>
              {agents.suiteHeadingA}
              <em>{agents.suiteHeadingEm}</em>
            </h2>
          </div>
          <div className="bonus-grid" style={{ width: "min(100%, 1180px)", margin: "0 auto" }}>
            {agents.items.map((agent) => (
              <div key={agent.label} className="bonus-item">
                <h3>{agent.label}</h3>
                <p>{agent.desc}</p>
                <Link
                  href={agent.href}
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    letterSpacing: "0.11em",
                    textTransform: "uppercase",
                  }}
                >
                  Explore →
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
      <HomeFooter footer={footer} brand={brand}>
        <WaitlistForm source="agents" buttonText={footer.ctaButton} />
      </HomeFooter>
    </div>
  );
}
