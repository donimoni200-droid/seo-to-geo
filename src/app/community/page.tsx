import Link from "next/link";
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
    title: "Community",
    description: pp.community.desc,
  };
}

export default async function CommunityPage() {
  const [pp, brand, nav, countdown, footer] = await Promise.all([
    getPlaceholderPages(),
    getBrand(),
    getNav(),
    getCountdown(),
    getFooter(),
  ]);
  const community = pp.community;

  return (
    <div className="inner-page fade-in">
      <CountdownBar countdown={countdown} />
      <SiteNav nav={nav} brand={brand} />
      <main>
        <section className="inner-hero">
          <div className="inner-hero__copy">
            <p className="home-section-kicker">{community.kicker}</p>
            <h1 className="inner-hero__title">{community.title}</h1>
            <p>{community.desc}</p>
            <Link href="/challenge" className="btn btn--hero">
              {community.cta}
            </Link>
          </div>
          <div className="inner-hero__visual">
            { }
            <img src="/assets/about/journey-now.png" alt="The community tracking AI search shifts together" />
          </div>
        </section>
      </main>
      <HomeFooter footer={footer} brand={brand}>
        <WaitlistForm source="community" buttonText={footer.ctaButton} />
      </HomeFooter>
    </div>
  );
}
