import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { CountdownBar } from "@/components/site/CountdownBar";
import { ContactForm } from "@/components/site/ContactForm";
import { HomeFooter } from "@/components/site/HomeFooter";
import { WaitlistForm } from "@/components/site/WaitlistForm";
import { getContact, getBrand, getNav, getCountdown, getFooter } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [brand, contact] = await Promise.all([getBrand(), getContact()]);
  return {
    title: "Contact",
    description: contact.intro,
  };
}

export default async function ContactPage() {
  const [contact, brand, nav, countdown, footer] = await Promise.all([
    getContact(),
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
        <section className="inner-hero" aria-labelledby="contact-title">
          <div className="inner-hero__copy">
            <p className="home-section-kicker">{contact.kicker}</p>
            <h1 className="inner-hero__title" id="contact-title">
              {contact.titleA}
              <em>{contact.titleEm}</em>
            </h1>
            <p>{contact.intro}</p>
          </div>
          <div className="inner-hero__visual">
            { }
            <img src="/assets/sections/social-studio.png" alt="Working at a desk, ready to chat" />
          </div>
        </section>

        <section className="contact-grid" aria-label="Contact options">
          {contact.cards.map((card) => (
            <article key={card.label} className="contact-card">
              <p className="contact-card__label">{card.label}</p>
              <h2>{card.title}</h2>
              <p>{card.desc}</p>
              <a className="contact-mail" href={`mailto:${card.email}`}>
                {card.email}
              </a>
              <div className="contact-social-row">
                <a href={card.linkLabel ? card.linkHref : "#"} target="_blank" rel="noopener">
                  {card.linkLabel}
                </a>
              </div>
            </article>
          ))}
        </section>

        <section
          style={{
            padding: "clamp(20px, 4vw, 50px) clamp(24px, 5vw, 78px) clamp(80px, 10vw, 140px)",
          }}
        >
          <ContactForm />
        </section>
      </main>
      <HomeFooter footer={footer} brand={brand}>
        <WaitlistForm source="contact" buttonText={footer.ctaButton} />
      </HomeFooter>
    </div>
  );
}
