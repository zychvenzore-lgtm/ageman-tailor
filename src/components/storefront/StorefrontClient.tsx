"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Filter, Eye, ChevronRight } from "lucide-react";
import { BatikBackground } from "../batik/BatikBackground";
import { ThemeConfig } from "@/lib/schema";

interface Product {
  id: string;
  name: string;
  description: string;
  philosophy: string;
  price: number;
  image: string;
  category: string;
}

interface StorefrontClientProps {
  theme: ThemeConfig;
  products: Product[];
}

const CATEGORIES = [
  { id: "ALL", label: "ALL COLLECTIONS" },
  { id: "SUITS", label: "JAS BATIK (SUITS)" },
  { id: "SHIRTS", label: "BATIK SHIRTS" },
  { id: "ACCESSORIES", label: "ACCESSORIES" },
];

export const StorefrontClient: React.FC<StorefrontClientProps> = ({ theme, products }) => {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const filteredProducts = activeCategory === "ALL" 
    ? products 
    : products.filter(p => p.category.toUpperCase() === activeCategory);

  // Philosophy database details (with default fallbacks)
  const defaultMotifs = [
    {
      id: "PARANG",
      title: "Parang Rusak Gendreh",
      meaning: "The Wave of Resilience",
      description: "Originating from the royal courts of Mataram, the diagonal S-curves represent ocean waves crashing against rocks. It symbolizes the relentless spirit of leadership, moral resilience, and the power to overcome self-obstacles.",
      image: ""
    },
    {
      id: "KAWUNG",
      title: "Kawung Picis",
      meaning: "The Circle of Cosmic Balance",
      description: "A geometric motif representing four palm fruit lobes arranged around a central axis. It stands for purity of mind, justice, self-control, and the perfect harmony between humans, nature, and the universe.",
      image: ""
    },
    {
      id: "MEGAMENDUNG",
      title: "Megamendung Cirebon",
      meaning: "The Calm Cloud of Patience",
      description: "Represented by layered, dynamic cloud contours in warm or cool gradients. It symbolises the necessity of maintaining patience, emotional stability, and keeping a cool mind in times of distress.",
      image: ""
    }
  ];

  const getMotifs = () => {
    let result = defaultMotifs;
    try {
      if (theme.customStylesJson) {
        const parsed = JSON.parse(theme.customStylesJson);
        if (parsed.motifs && Array.isArray(parsed.motifs) && parsed.motifs.length > 0) {
          result = parsed.motifs;
        }
      }
    } catch (e) {
      console.error("Failed to parse custom motifs:", e);
    }
    return result;
  };

  const motifs = getMotifs();
  const [selectedPhilosophy, setSelectedPhilosophy] = useState(motifs[0]?.id || "PARANG");
  const activeMotif = motifs.find(m => m.id === selectedPhilosophy) || motifs[0];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Dynamic Background Motif Layer */}
      {theme.activeBatikPattern !== "NONE" && (
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] text-[#0C0A09] transition-opacity duration-1000">
          <BatikBackground pattern={theme.activeBatikPattern} />
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 md:px-8 py-20">
        {/* Rotating Circular Javanese Seal (Mandala) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
          <svg
            viewBox="0 0 200 200"
            className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] text-[#0C0A09]/[0.12] animate-[spin_120s_linear_infinite]"
          >
            <path
              id="circlePath"
              d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
              fill="none"
            />
            <text className="font-javanese text-[7.5px] fill-current tracking-[3.5px]">
              <textPath href="#circlePath">
                ꦲꦒꦼꦩꦤ꧀ꦧꦠꦶꦏ꧀ꦭꦸꦲꦸꦂꦗꦮꦲꦗꦶꦤꦶꦁꦫꦒꦲꦤꦲꦶꦁꦧꦸꦱꦤ꧀ꦲꦒꦼꦩꦤ꧀ꦧꦠꦶꦏ꧀ꦭꦸꦲꦸꦂꦗꦮꦲꦗꦶꦤꦶꦁꦫꦒꦲꦤꦲꦶꦁꦧꦸꦱꦤ꧀
              </textPath>
            </text>
            <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.25" fill="none" />
            <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="10 2" />
          </svg>
        </div>

        {/* Left vertical Javanese script */}
        <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-10 pointer-events-none select-none opacity-[0.03] text-[#0C0A09] font-javanese text-2xl tracking-[1em] leading-none z-0 writing-mode-vertical uppercase">
          <span>ꦲꦗꦶꦤꦶꦁꦫꦒꦲꦤꦲꦶꦁꦧꦸꦱꦤ꧀</span>
        </div>

        {/* Right vertical Javanese script */}
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-10 pointer-events-none select-none opacity-[0.03] text-[#0C0A09] font-javanese text-2xl tracking-[1em] leading-none z-0 writing-mode-vertical uppercase">
          <span>ꦱꦸꦫꦢꦶꦫꦗꦪꦤꦶꦁꦫ꧀ꦭꦼꦧꦸꦫ꧀ꦢꦼꦤꦶꦁꦥꦔꦱ꧀ꦠꦸꦠꦶ</span>
        </div>

        {/* Soft floating glow blurs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-[var(--color-accent)]/10 blur-3xl pointer-events-none"
          animate={theme.enableAnimations ? {
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          } : {}}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[var(--color-primary)]/5 blur-3xl pointer-events-none"
          animate={theme.enableAnimations ? {
            x: [0, -40, 30, 0],
            y: [0, 30, -30, 0],
            scale: [1, 0.9, 1.1, 1],
          } : {}}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="max-w-5xl mx-auto text-center z-10">
          {theme.enableAnimations ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[#CA8A04] text-xs font-semibold tracking-widest uppercase">
                <Sparkles size={12} /> JAVANESE ROYAL HERITAGE
              </div>
              <div className="flex justify-center py-4">
                <motion.img
                  src="/logo.png"
                  alt="Ageman Logo"
                  className="h-28 w-auto mix-blend-multiply opacity-90 cursor-pointer"
                  whileHover={theme.enableAnimations ? { scale: 1.12, rotate: 4 } : {}}
                  transition={{ type: "spring", stiffness: 350, damping: 15 }}
                />
              </div>
              <h1 className="font-cormorant text-6xl md:text-8xl font-bold tracking-tight text-[#0C0A09] leading-none">
                {theme.heroTitle}
              </h1>
              <p className="font-cormorant text-xl md:text-3xl font-light italic text-[#44403C] max-w-3xl mx-auto">
                {theme.heroSubtitle}
              </p>
              <div className="h-[1px] w-24 bg-[#CA8A04] mx-auto my-8"></div>
              <p className="text-sm md:text-base font-light text-[#0C0A09]/70 max-w-xl mx-auto tracking-wide leading-relaxed">
                Step into a world where premium threads meet Javanese philosophy. Every piece is hand-waxed and printed with the spirit of ancient craftsmanship.
              </p>
              <div className="pt-6">
                <a
                  href="#collections"
                  className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#CA8A04] text-white font-medium py-3 px-8 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 tracking-wider text-xs"
                >
                  EXPLORE COLLECTIONS <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[#CA8A04] text-xs font-semibold tracking-widest uppercase">
                <Sparkles size={12} /> JAVANESE ROYAL HERITAGE
              </div>
              <div className="flex justify-center py-4">
                <motion.img
                  src="/logo.png"
                  alt="Ageman Logo"
                  className="h-28 w-auto mix-blend-multiply opacity-90 cursor-pointer"
                  whileHover={theme.enableAnimations ? { scale: 1.12, rotate: 4 } : {}}
                  transition={{ type: "spring", stiffness: 350, damping: 15 }}
                />
              </div>
              <h1 className="font-cormorant text-6xl md:text-8xl font-bold tracking-tight text-[#0C0A09] leading-none">
                {theme.heroTitle}
              </h1>
              <p className="font-cormorant text-xl md:text-3xl font-light italic text-[#44403C] max-w-3xl mx-auto">
                {theme.heroSubtitle}
              </p>
              <div className="h-[1px] w-24 bg-[#CA8A04] mx-auto my-8"></div>
              <p className="text-sm md:text-base font-light text-[#0C0A09]/70 max-w-xl mx-auto tracking-wide leading-relaxed">
                Step into a world where premium threads meet Javanese philosophy. Every piece is hand-waxed and printed with the spirit of ancient craftsmanship.
              </p>
              <div className="pt-6">
                <a
                  href="#collections"
                  className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#CA8A04] text-white font-medium py-3 px-8 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 tracking-wider text-xs"
                >
                  EXPLORE COLLECTIONS <ArrowRight size={14} />
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="py-24 bg-[#1C1917] text-[#FAFAF9] relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.015] text-[#FAFAF9]">
          <BatikBackground pattern="MEGAMENDUNG" />
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-cormorant text-4xl md:text-5xl font-bold tracking-wider">
              The Threads of Philosophy
            </h2>
            <div className="h-[1px] w-16 bg-[#CA8A04]"></div>
            <p className="text-sm font-light leading-relaxed text-[#FAFAF9]/75">
              In Javanese culture, clothing is more than style; it is *Ageman* — a medium for wisdom, status, and prayers. Each stroke of natural wax (*malam*) written onto silk fabric is a slow, meditative process carrying ancient philosophies.
            </p>
            <p className="text-sm font-light leading-relaxed text-[#FAFAF9]/75">
              Our master artisans in Yogyakarta paint narratives onto fabrics, creating dynamic textures that shift in light, embodying the soft contours of Javanese art. Ageman keeps this timeless wisdom alive in modern, premium streetwear and formal blazers.
            </p>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden border border-[#FAFAF9]/10 glass-panel flex items-center justify-center bg-[#FAFAF9]/5 group">
            <img
              src="/workshop.png"
              alt="Ageman Tailor Atelier"
              className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-40 transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/85 to-[#1C1917]/50"></div>
            <div className="z-10 text-center px-8">
              <p className="font-javanese text-2xl text-[#CA8A04]/90 tracking-wide mb-3">ꦲꦗꦶꦁꦫꦒꦲꦤꦲꦶꦁꦧꦸꦱꦤ꧀</p>
              <p className="font-cormorant text-3xl font-light italic mb-4">"Ajining raga ana ing busana."</p>
              <p className="text-xs tracking-widest text-[#CA8A04] font-semibold">THE DIGNITY OF THE BODY LIES IN ITS ATTIRE</p>
            </div>
          </div>
        </div>
      </section>

      {/* E-Commerce Bento Section */}
      <section id="collections" className="py-24 px-6 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-cormorant text-4xl md:text-5xl font-bold tracking-wide">
            Curated Collections
          </h2>
          <p className="text-sm font-light text-[#0C0A09]/60 max-w-md mx-auto">
            Choose your armor of Javanese heritage. Filter by collection to view details.
          </p>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 pt-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`py-2 px-5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-[#1C1917] text-white shadow-sm"
                    : "bg-[#FAFAF9] border border-[#0C0A09]/10 text-[#0C0A09]/75 hover:border-[#1C1917]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                key={product.id}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                className="group relative bg-[#FAFAF9] border border-[#0C0A09]/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-[520px] cursor-pointer"
              >
                {/* Product Image Frame */}
                <div className="relative w-full h-[320px] bg-[#FAFAF9] overflow-hidden flex items-center justify-center">
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    animate={(theme.enableAnimations && hoveredProduct === product.id) ? { scale: 1.08 } : { scale: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                  {/* Philosophy Hover Overlay - Slide Up */}
                  <motion.div 
                    className="absolute inset-0 bg-[#1C1917]/90 flex flex-col justify-center px-8"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={hoveredProduct === product.id ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 180, damping: 18 }}
                  >
                    <span className="text-[#CA8A04] text-[10px] font-bold tracking-widest mb-2 flex items-center gap-1">
                      <Sparkles size={10} /> BATIK PHILOSOPHY
                    </span>
                    <h4 className="font-cormorant text-2xl font-bold text-white mb-3">
                      {product.name}
                    </h4>
                    <p className="text-xs font-light leading-relaxed text-white/80">
                      {product.philosophy}
                    </p>
                  </motion.div>
                </div>

                {/* Product Info */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[#CA8A04] uppercase">
                      {product.category}
                    </span>
                    <h3 className="font-cormorant text-2xl font-bold text-[#0C0A09] mt-1">
                      {product.name}
                    </h3>
                    <p className="text-xs font-light text-[#0C0A09]/60 mt-2 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#0C0A09]/5">
                    <span className="font-mono text-sm font-semibold text-[#0C0A09]">
                      IDR {product.price.toLocaleString("id-ID")}
                    </span>
                    <button className="flex items-center gap-1 text-[11px] font-bold tracking-wider text-[#0C0A09] group-hover:text-[#CA8A04] transition-colors duration-200">
                      VIEW PRODUCT <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Atelier Banner Section */}
      <section className="relative h-[480px] flex items-center justify-center overflow-hidden border-y border-[#0C0A09]/5 bg-stone-900">
        <img 
          src="/workshop.png" 
          alt="Ageman Atelier" 
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-[#1C1917]/70 backdrop-blur-[0.5px]"></div>
        
        {/* Subtle repeating watermark inside the banner */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none text-white">
          <BatikBackground pattern="PARANG" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6 text-white">
          <span className="text-[#CA8A04] text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-1.5">
            <Sparkles size={12} /> THE BESPOKE ATELIER
          </span>
          <h2 className="font-cormorant text-4xl md:text-5xl font-bold tracking-wide leading-tight">
            Where Javanese Heritage Meets Modern Tailoring
          </h2>
          <div className="h-[1px] w-20 bg-[#CA8A04] mx-auto"></div>
          <p className="text-sm font-light leading-relaxed text-white/80 max-w-xl mx-auto font-sans">
            Step into our private tailoring studio. Surrounded by traditional Javanese hand-carvings and our collection of hand-waxed silks, our master tailors will craft your perfect armor.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <a 
              href="/customize" 
              className="bg-[#CA8A04] hover:bg-[#CA8A04]/90 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 tracking-wider text-xs"
            >
              DESIGN YOUR SUIT
            </a>
            <a 
              href="/book" 
              className="bg-transparent border border-white/30 hover:border-white text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 tracking-wider text-xs"
            >
              BOOK A FITTING
            </a>
          </div>
        </div>
      </section>

      {/* Philosophy Spotlight Section */}
      <section id="philosophy" className="py-24 bg-[#FAFAF9] border-t border-[#0C0A09]/5 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-cormorant text-4xl md:text-5xl font-bold tracking-wide">
              The Meaning in the Motifs
            </h2>
            <p className="text-sm font-light text-[#0C0A09]/60 max-w-md mx-auto">
              Every batik print holds a prayer. Click a motif to explore its history and Javanese roots.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Tabs Selector */}
            <div className="space-y-4 flex flex-col justify-start">
              {motifs.map((item) => {
                const isActive = selectedPhilosophy === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedPhilosophy(item.id)}
                    className={`text-left p-6 rounded-2xl border transition-all duration-300 flex flex-col gap-2 ${
                      isActive
                        ? "bg-[#1C1917] border-[#1C1917] text-white shadow-md"
                        : "bg-white border-[#0C0A09]/5 hover:border-[#1C1917]/20 text-[#0C0A09]"
                    }`}
                  >
                    <span className={`text-[10px] font-bold tracking-widest ${isActive ? "text-[#CA8A04]" : "text-[#0C0A09]/40"}`}>
                      MOTIF {item.id.length > 15 ? "CUSTOM" : item.id}
                    </span>
                    <h3 className="font-cormorant text-2xl font-bold">
                      {item.title}
                    </h3>
                  </button>
                );
              })}
            </div>

            {/* Philosophy Display */}
            {activeMotif && (
              <div className="lg:col-span-2 bg-[#1C1917] text-[#FAFAF9] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center border border-[#FAFAF9]/10 relative overflow-hidden">
                {/* Soft background watermark */}
                <div className="absolute inset-0 opacity-[0.02] text-white pointer-events-none">
                  {activeMotif.image ? (
                    <img src={activeMotif.image} alt="" className="w-full h-full object-cover opacity-10" />
                  ) : (
                    <BatikBackground pattern={activeMotif.id} />
                  )}
                </div>

                <motion.div
                  key={activeMotif.id + "_content"}
                  initial={theme.enableAnimations ? { x: -20, opacity: 0 } : {}}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6 flex-grow md:w-3/5 z-10"
                >
                  <span className="text-[#CA8A04] text-[10px] font-bold tracking-widest uppercase">
                    PHILOSOPHY DEFINED
                  </span>
                  <div className="space-y-2">
                    <h3 className="font-cormorant text-3xl md:text-4xl font-bold text-white">
                      {activeMotif.title}
                    </h3>
                    <p className="font-cormorant text-lg md:text-xl font-light italic text-[#CA8A04]">
                      "{activeMotif.meaning}"
                    </p>
                  </div>
                  <div className="h-[1px] w-12 bg-white/20"></div>
                  <p className="text-sm font-light leading-relaxed text-[#FAFAF9]/75">
                    {activeMotif.description}
                  </p>
                </motion.div>

                <motion.div
                  key={activeMotif.id + "_visual"}
                  initial={theme.enableAnimations ? { scale: 0.8, rotate: -15, opacity: 0 } : {}}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 120, damping: 14 }}
                  className="w-full md:w-2/5 aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-4 text-[#CA8A04] relative overflow-hidden"
                >
                  {activeMotif.image ? (
                    <img src={activeMotif.image} alt={activeMotif.title} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <BatikBackground pattern={activeMotif.id} className="w-full h-full text-[#CA8A04]" />
                  )}
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
