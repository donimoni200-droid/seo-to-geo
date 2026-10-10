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
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [brand, pp] = await Promise.all([getBrand(), getPlaceholderPages()]);
  return {
    title: "Weekend GEO Bootcamp",
    description: pp.bootcamp.desc,
  };
}

export default async function BootcampPage() {
  const [pp, brand, nav, countdown, footer] = await Promise.all([
    getPlaceholderPages(),
    getBrand(),
    getNav(),
    getCountdown(),
    getFooter(),
  ]);
  const bootcamp = pp.bootcamp;

  return (
    <div className="inner-page fade-in">
      <CountdownBar countdown={countdown} />
      <SiteNav nav={nav} brand={brand} />
      <main>
        <section className="inner-hero">
          <div className="inner-hero__copy">
            <p className="home-section-kicker">{bootcamp.kicker}</p>
            <h1 className="inner-hero__title">
              {bootcamp.titleA}
              <em>{bootcamp.titleEm}</em>
            </h1>
            <p>{bootcamp.desc}</p>
            <a className="btn btn--hero" href="#enroll">
              {bootcamp.cta}
            </a>
          </div>
          <div className="inner-hero__visual">
            { }
            <img src="/assets/sections/challenge-desk.png" alt="The weekend GEO bootcamp setup" />
          </div>
        </section>
        <section style={{ padding: "clamp(70px, 9vw, 130px) clamp(24px, 5vw, 78px)" }}>
          <div className="section-heading">
            <h2>
              {bootcamp.headingA}
              <em>{bootcamp.headingEm}</em>
            </h2>
          </div>
          <div className="blocks-grid" style={{ width: "min(100%, 1180px)", margin: "0 auto" }}>
            {bootcamp.days.map((day) => (
              <div key={day.title} className="block-card">
                <h3>{day.title}</h3>
                <p>{day.desc}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="final-cta" id="enroll">
          <h2>
            Reserve your seat.
            <br />
            Start measuring Monday.
          </h2>
          <WaitlistForm source="bootcamp" buttonText="Join the Bootcamp Waitlist →" />
          <p className="status-line">Doors open a few times a year. The waitlist always hears first.</p>
        </section>
      </main>
      <HomeFooter footer={footer} brand={brand}>
        <WaitlistForm source="bootcamp-footer" buttonText={footer.ctaButton} />
      </HomeFooter>
    </div>
  );
}
