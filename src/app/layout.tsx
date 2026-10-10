import type { Metadata } from "next";
import { Anton, Oswald, Open_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import "./site.css";
import { Toaster } from "@/components/ui/toaster";
import { getBrand } from "@/lib/content";

const anton = Anton({
  variable: "--font-anton-load",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald-load",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-opensans-load",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair-load",
  weight: ["500"],
  style: ["italic", "normal"],
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  let brand;
  try {
    brand = await getBrand();
  } catch {
    brand = { name: "SEO to GEO With Layla", footerTagline: "From rankings to AI citations." };
  }
  return {
    title: {
      default: `${brand.name} — Get Cited By AI Engines`,
      template: `%s — ${brand.name}`,
    },
    description:
      "Free GEO guides, the 30-Day GEO Challenge, and the agent suite. Get your brand cited by ChatGPT, Perplexity, Gemini, and Google AI Overviews.",
    openGraph: {
      title: brand.name,
      description: brand.footerTagline,
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${anton.variable} ${oswald.variable} ${openSans.variable} ${playfair.variable} site-body antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
