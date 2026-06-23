import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, Noto_Sans_Javanese } from "next/font/google";
import { getThemeConfig } from "@/lib/theme";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/storefront/Navbar";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const javanese = Noto_Sans_Javanese({
  variable: "--font-javanese",
  subsets: ["javanese"],
  weight: ["400", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getThemeConfig();
  return {
    title: `${config.heroTitle} - Luxury Javanese Cultured Fashion`,
    description: `${config.heroSubtitle}. Handcrafted batik fashion blending traditional motifs with modern luxury silhouettes.`,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getThemeConfig();

  // Create style object for dynamic CSS variables
  const themeStyles = {
    "--color-primary": config.primaryColor,
    "--color-secondary": config.secondaryColor,
    "--color-accent": config.accentColor,
  } as React.CSSProperties;

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable} ${javanese.variable} h-full antialiased`}
      style={themeStyles}
    >
      <body className="font-montserrat bg-[#FAFAF9] text-[#0C0A09] min-h-full flex flex-col transition-colors duration-500">
        {/* Floating Navbar */}
        <header className="fixed top-4 left-4 right-4 z-50 bg-[#FAFAF9]/80 backdrop-blur-md border border-[#0C0A09]/5 rounded-full py-3 px-6 md:px-8 shadow-sm max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-cormorant text-2xl font-bold tracking-widest text-[#0C0A09] hover:text-[#CA8A04] transition-colors duration-300">
            <img src="/logo.png" alt="Ageman Logo" className="h-8 w-auto mix-blend-multiply" />
            <span>{config.heroTitle.toUpperCase()}</span>
          </Link>

          <Navbar />

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-[#0C0A09]/5 text-[#0C0A09]/80 hover:text-[#CA8A04] transition-colors duration-200 relative" title="Shopping Bag">
              <ShoppingBag size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#CA8A04] rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Content Padding for fixed header */}
        <main className="flex-grow pt-24">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-[#1C1917] text-[#FAFAF9]/80 py-12 border-t border-[#FAFAF9]/5 mt-auto">
          <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="Ageman Logo" className="h-10 w-auto invert brightness-200" />
                <h3 className="font-cormorant text-3xl font-bold tracking-widest text-[#FAFAF9]">
                  {config.heroTitle.toUpperCase()}
                </h3>
              </div>
              <p className="text-sm font-light text-[#FAFAF9]/60 max-w-sm">
                Ageman fuses the quiet dignity of Javanese heritage with contemporary haute couture, preserving the ancient craft of hand-drawn Batik.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold tracking-widest text-[#FAFAF9] mb-4">NAVIGATE</h4>
              <ul className="space-y-2 text-sm font-light">
                <li><Link href="/#collections" className="hover:text-[#CA8A04] transition-colors duration-200">Collections</Link></li>
                <li><Link href="/#story" className="hover:text-[#CA8A04] transition-colors duration-200">Our Story</Link></li>
                <li><Link href="/#philosophy" className="hover:text-[#CA8A04] transition-colors duration-200">Batik Philosophy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold tracking-widest text-[#FAFAF9] mb-4">CRAFTED IN</h4>
              <p className="text-sm font-light text-[#FAFAF9]/60">
                Yogyakarta & Surakarta, Indonesia.<br />
                Using 100% natural wax and organic dyes.
              </p>
              <p className="mt-4 text-xs font-light text-[#FAFAF9]/40">
                © {new Date().getFullYear()} {config.heroTitle}. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
