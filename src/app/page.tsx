import { HomeHeader } from "@/components/site/HomeHeader";
import { CountdownBar } from "@/components/site/CountdownBar";
import { HomeHero } from "@/components/site/HomeHero";
import { Manifesto } from "@/components/site/Manifesto";
import {
  HomeChallenge,
  HomePaths,
  HomeGuides,
  HomeSocial,
} from "@/components/site/HomeSections";
import { HomeFooter } from "@/components/site/HomeFooter";
import { WaitlistForm } from "@/components/site/WaitlistForm";
import {
  getBrand,
  getSocials,
  getCountdown,
  getNav,
  getHero,
  getManifesto,
  getChallengeSection,
  getMarquee,
  getPaths,
  getGuidesSection,
  getSocialSection,
  getFooter,
  getPublishedGuides,
} from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [brand, socials, countdown, nav, hero, manifesto, challenge, marquee, paths, guidesSection, socialSection, footer, guides] =
    await Promise.all([
      getBrand(),
      getSocials(),
      getCountdown(),
      getNav(),
      getHero(),
      getManifesto(),
      getChallengeSection(),
      getMarquee(),
      getPaths(),
      getGuidesSection(),
      getSocialSection(),
      getFooter(),
      getPublishedGuides(),
    ]);

  return (
    <>
      <CountdownBar countdown={countdown} />
      <HomeHeader nav={nav} socials={socials} brand={brand} />
      <main>
        <HomeHero hero={hero} />
        <Manifesto manifesto={manifesto} />
        <HomeChallenge challenge={challenge} />
        <HomePaths paths={paths} marquee={marquee} />
        <HomeGuides guides={guides} section={guidesSection} />
        <HomeSocial socialSection={socialSection} socials={socials} />
      </main>
      <HomeFooter footer={footer} brand={brand}>
        <WaitlistForm source="footer" buttonText={footer.ctaButton} />
      </HomeFooter>
    </>
  );
}
