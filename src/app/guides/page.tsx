import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { CountdownBar } from "@/components/site/CountdownBar";
import { GuidesList } from "@/components/site/GuidesList";
import { HomeFooter } from "@/components/site/HomeFooter";
import { WaitlistForm } from "@/components/site/WaitlistForm";
import {
  getGuidesSection,
  getPublishedGuides,
  guideTags,
  getBrand,
  getNav,
  getCountdown,
  getFooter,
} from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [brand, section] = await Promise.all([getBrand(), getGuidesSection()]);
  return {
    title: "Free GEO Guides",
    description: section.desc,
  };
}

export default async function GuidesPage() {
  const [section, guides, brand, nav, countdown, footer] = await Promise.all([
    getGuidesSection(),
    getPublishedGuides(),
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
        <section className="inner-hero" style={{ minHeight: 380 }}>
          <div className="inner-hero__copy">
            <p className="home-section-kicker">{section.kicker}</p>
            <h1 className="inner-hero__title">
              {section.titleA}
              <em>{section.titleEm}</em>
              {section.titleB}
            </h1>
            <p>{section.desc} New guides every week.</p>
          </div>
          <div className="inner-hero__visual">
            { }
            <img src="/assets/sections/social-studio.png" alt="The GEO guides library" />
          </div>
        </section>

        <GuidesList guides={guides} filters={guideTags(guides)} />
      </main>
      <HomeFooter footer={footer} brand={brand}>
        <WaitlistForm source="guides" buttonText={footer.ctaButton} />
      </HomeFooter>
    </div>
  );
}
