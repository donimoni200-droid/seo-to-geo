import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { CountdownBar } from "@/components/site/CountdownBar";
import { HomeFooter } from "@/components/site/HomeFooter";
import { WaitlistForm } from "@/components/site/WaitlistForm";
import {
  getGuide,
  getPublishedGuides,
  getChallengePage,
  getBrand,
  getNav,
  getCountdown,
  getFooter,
} from "@/lib/content";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [guide, brand] = await Promise.all([getGuide(slug), getBrand()]);
  if (!guide) return { title: "Guide not found" };
  return {
    title: guide.title,
    description: guide.desc,
    openGraph: { title: guide.title, description: guide.desc, type: "article" },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const [guide, guides, cp, brand, nav, countdown, footer] = await Promise.all([
    getGuide(slug),
    getPublishedGuides(),
    getChallengePage(),
    getBrand(),
    getNav(),
    getCountdown(),
    getFooter(),
  ]);
  if (!guide) notFound();

  const others = guides.filter((g) => g.slug !== slug).slice(0, 3);

  return (
    <div className="inner-page fade-in">
      <CountdownBar countdown={countdown} />
      <SiteNav nav={nav} brand={brand} />
      <main>
        <article className="guide-article">
          <Link href="/guides" className="guide-article__back">
            ← All guides
          </Link>
          <h1 className="guide-article__title">{guide.title}</h1>
          <p className="guide-article__meta">
            {guide.tag} · {guide.readTime} read
          </p>
          {guide.body.map((section, i) => (
            <section key={i}>
              <h2>{section.heading}</h2>
              {section.paras.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </section>
          ))}
          <div className="cta-box">
            <h3>Want the full system?</h3>
            <p>
              The 30-Day GEO Challenge walks you from invisible in AI answers to a complete
              citation system for your brand — one short build a day.
            </p>
            <Link href="/challenge">{cp.final.cta}</Link>
          </div>
        </article>
        <section style={{ padding: "0 clamp(24px, 5vw, 78px) 90px" }}>
          <div className="section-heading" style={{ marginBottom: 30 }}>
            <h2>
              Keep <em>reading</em>
            </h2>
          </div>
          <div className="guide-list" style={{ paddingBottom: 0 }}>
            {others.map((g) => (
              <Link key={g.slug} href={`/guides/${g.slug}`} className="guide-row">
                <div className="guide-row__body">
                  <span className="guide-row__tag">
                    {g.tag} · {g.readTime}
                  </span>
                  <h2 className="guide-row__title">{g.title}</h2>
                  <p className="guide-row__desc">{g.desc}</p>
                </div>
                <span className="guide-row__arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <HomeFooter footer={footer} brand={brand}>
        <WaitlistForm source={`guide-${slug}`} buttonText={footer.ctaButton} />
      </HomeFooter>
    </div>
  );
}
