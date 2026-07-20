'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const heroSlides = [
  {
    id: "01",
    tagline: "Pure Cold-Pressed Coconut Oil",
    title: "Coconut Oil",
    desc: "Nature's versatile superfood. Rich in MCTs and lauric acid that support heart health, boost immunity, and nourish skin and hair. Perfect for cooking, baking, skincare, and daily wellness rituals. Experience the purest form of coconut goodness.",
    ctaText: "Shop Coconut Oil",
    img: "/images/hero.jpg",
    badge: "100% Pure Coconut"
  },
  {
    id: "02",
    tagline: "Premium Groundnut Oil",
    title: "Groundnut Oil",
    desc: "The heart-healthy cooking essential. Packed with Vitamin E, monounsaturated fats, and powerful antioxidants. With a high smoke point, it's ideal for deep-frying, sautéing, tempering, and everyday Indian cooking. Pure, unrefined, and full of natural goodness.",
    ctaText: "Shop Groundnut Oil",
    img: "/images/hero1.jpg",
    badge: "Rich in Vitamin E"
  },
  {
    id: "03",
    tagline: "Authentic Gingelly Oil",
    title: "Gingelly Oil",
    desc: "The ancient wellness elixir. Loaded with calcium, iron, zinc, and essential fatty acids that promote bone health, improve digestion, and boost immunity. Perfect for traditional South Indian cooking, Ayurvedic massages, and holistic well-being.",
    ctaText: "Shop Gingelly Oil",
    img: "/images/hero2.jpg",
    badge: "Nutrient Rich"
  }
];

const tickerItems = [
  "COLD PRESSED",
  "NO CHEMICALS",
  "100% NATURAL",
  "ZERO ADDITIVES",
  "TRADITIONAL METHOD",
  "SUSTAINABLY SOURCED"
];

export default function LuxuryHeroRedesign() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIndex((prev) => (prev + 1) % heroSlides.length);
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const active = heroSlides[index];

  return (
    <section className="relative w-full min-h-[45vh] bg-[#315f42] text-white overflow-hidden flex flex-col justify-between pt-8 pb-4">
      
      {/* 1. BACKGROUND AMBIENT GLOWS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#1b4d2b]/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#1b4d2b]/5 rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1b4d2b_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03]" />
      </div>

      {/* 2. MAIN HERO GRID CONTENT */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-12 my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6 items-center">
        
        {/* LEFT COLUMN: EDITORIAL CONTENT */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-2 sm:space-y-4">
          
          {/* TOP TAGLINE & INDEX BADGE */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="px-2 sm:px-3 py-0.5 sm:py-1 text-[8px] sm:text-[11px] font-mono tracking-widest uppercase bg-white/10 border border-white/20 rounded-full text-white">
              {active.id} / 0{heroSlides.length}
            </span>
            <span className="h-[1px] w-4 sm:w-8 bg-white/20" />
            <AnimatePresence mode="wait">
              <motion.span
                key={active.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="text-[7px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase font-medium text-white/60"
              >
                {active.tagline}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* MAIN HEADLINE */}
          <div className="min-h-[60px] sm:min-h-[120px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.h1
                key={active.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-7xl lg:text-8xl font-light tracking-tight leading-[1.05] text-white"
              >
                {active.title}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* DESCRIPTION - 6 words per row on mobile */}
          <AnimatePresence mode="wait">
            <motion.p
              key={active.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-white/70 text-[11px] sm:text-base max-w-[150px] sm:max-w-xl w-full font-light leading-relaxed break-words"
            >
              {active.desc}
            </motion.p>
          </AnimatePresence>

          {/* ACTION SECTION */}
          <div className="pt-0 sm:pt-1 flex flex-wrap items-center gap-2 sm:gap-4">
            <button
              onClick={() => router.push('/products')}
              className="relative group overflow-hidden px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white text-[#1b4d2b] font-semibold text-[9px] sm:text-xs tracking-widest uppercase transition-all duration-300 hover:bg-white/90"
            >
              <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                {active.ctaText}
                <span className="text-[10px] sm:text-sm font-bold transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </button>

            {/* SLIDE SWITCHER PILLS */}
            <div className="flex items-center gap-1 p-0.5 sm:p-1 bg-white/10 border border-white/20 rounded-full backdrop-blur-md">
              {heroSlides.map((slide, i) => (
                <button
                  key={slide.id}
                  onClick={() => { if (!isAnimating) setIndex(i); }}
                  className={`relative px-2 sm:px-3 py-1 sm:py-1.5 text-[7px] sm:text-[10px] font-mono rounded-full transition-all duration-300 cursor-pointer ${
                    index === i ? 'text-[#1b4d2b] font-bold' : 'text-white/50 hover:text-white'
                  }`}
                >
                  {index === i && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 bg-white rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{slide.id}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: KINETIC VISUAL CANVAS */}
        <div className="lg:col-span-5 relative flex justify-center items-center">
          
          {/* DECORATIVE OUTER RING - Hidden on mobile */}
          <div className="hidden sm:block absolute w-[180px] sm:w-[380px] aspect-square rounded-full border border-dashed border-white/15 animate-[spin_60s_linear_infinite] pointer-events-none" />

          {/* MAIN CARD CONTAINER */}
          <div className="relative w-full sm:max-w-[750px] lg:max-w-[850px] sm:aspect-[50/42] rounded-2xl overflow-hidden bg-black shadow-2xl border border-emerald-500/20 group">
            {/* Subtle Ambient Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-20 blur-xl group-hover:opacity-40 transition duration-500" />

            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, filter: "blur(8px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(8px)" }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-full"
              >
                <Image
                  src={active.img}
                  alt={active.title}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
              </motion.div>
            </AnimatePresence>

            {/* TOP RIGHT PINNED BADGE */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute top-2 sm:top-4 right-2 sm:right-4"
              >
                <div className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-md bg-black/60 backdrop-blur-md border border-emerald-500/30 flex items-center gap-1.5 sm:gap-2">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[6px] sm:text-[9px] font-mono text-emerald-300 uppercase tracking-wider">
                    {active.badge}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* BOTTOM METADATA BAR */}
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 flex justify-between items-center text-[6px] sm:text-[9px] font-mono text-zinc-400">
              <span>[ 01 ]</span>
              <span className="hidden xs:block">PURE & UNREFINED</span>
            </div>
          </div>

          {/* Mobile small image - increased size on mobile only */}
          <div className="lg:hidden absolute -top-64 right-0 w-52 h-[190px] rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 bg-black z-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                className="relative w-full h-full"
              >
                <Image
                  src={active.img}
                  alt={active.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>

      {/* 3. INFINITE TICKER MARQUEE FOOTER */}
      <div className="relative z-10 w-full bg-[#1b4d2b] py-3 sm:py-4 overflow-hidden">
        <div className="flex whitespace-nowrap gap-4 sm:gap-6 select-none">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, ease: 'linear', duration: 20 }}
            className="flex items-center gap-4 sm:gap-6 text-[7px] sm:text-[10px] font-mono tracking-widest text-white font-semibold uppercase"
          >
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 sm:gap-6">
                <span className="text-white">{item}</span>
                <span className="text-white/50 font-bold">•</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

    </section>
  );
}