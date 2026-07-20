import React, { useState } from 'react';

export default function IntegrityShowcase() {
  const [activeTab, setActiveTab] = useState(0);

  const pillars = [
    {
      id: "01",
      title: "Pure Coconut Oil",
      subtitle: "The Wellness Oil",
      desc: "Our premium cold-pressed coconut oil is extracted from hand-picked mature coconuts. Rich in MCTs, lauric acid, and antioxidants - perfect for healthy cooking, skincare, and holistic wellness.",
      highlight: "Cold-Pressed",
      metrics: "100% Pure · MCT Rich",
      image:  "/images/h1.jpg",
      alt: "Pure Coconut Oil bottle"
    },
    {
      id: "02",
      title: "Pure Groundnut Oil",
      subtitle: "The Everyday Oil",
      desc: "Made from premium quality groundnuts using traditional cold-press methods. Naturally rich in Vitamin E, healthy fats, and antioxidants - ideal for daily cooking with a high smoke point.",
      highlight: "Heart Healthy",
      metrics: "High Smoke Point · Vitamin E",
      image:  "/images/h2.jpg",
      alt: "Pure Groundnut Oil bottle"
    },
    {
      id: "03",
      title: "Pure Gingelly Oil",
      subtitle: "The Traditional Oil",
      desc: "Extracted from premium sesame seeds through age-old cold-press techniques. Packed with essential fatty acids, calcium, and antioxidants - perfect for cooking, massage, and Ayurvedic practices.",
      highlight: "Nutrient Rich",
      metrics: "Cold-Pressed · Ayurvedic",
      image: "/images/h3.jpg",
      alt: "Pure Gingelly Oil bottle"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl lg:max-w-full lg:px-12 xl:px-16 mx-auto bg-gradient-to-b from-amber-50/50 to-white" aria-label="Product Showcase">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <span className="text-xs font-semibold tracking-widest text-[#1b4d2b] uppercase bg-[#1b4d2b]/10 px-3 py-1 rounded-full border border-[#1b4d2b]/20">
          Our Collection
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1b4d2b] mt-4 tracking-tight">
          Crafted for Purity & Wellness
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mt-2">
          Discover traditional cold-pressed oils made for everyday health.
        </p>
      </div>

      {/* Navigation Pills - Single Row on Mobile */}
      <div className="flex flex-nowrap justify-center gap-1.5 sm:gap-3 mb-8 sm:mb-10 overflow-x-auto px-1 pb-2 sm:pb-0 scrollbar-hide">
        {pillars.map((pillar, idx) => {
          const isActive = activeTab === idx;
          return (
            <button
              key={pillar.id}
              onClick={() => setActiveTab(idx)}
              className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-sm font-medium transition-all duration-200 border whitespace-nowrap flex-shrink-0 ${
                isActive
                  ? 'bg-[#1b4d2b] text-white border-[#1b4d2b] shadow-lg shadow-[#1b4d2b]/25'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#1b4d2b]/40 hover:bg-[#1b4d2b]/5'
              }`}
            >
              {pillar.title}
            </button>
          );
        })}
      </div>

      {/* Active Item Card */}
      <div className="bg-white border border-[#1b4d2b]/10 rounded-2xl p-5 sm:p-10 shadow-lg shadow-[#1b4d2b]/5 transition-all duration-300 hover:shadow-xl hover:shadow-[#1b4d2b]/10">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Image Section */}
          <div className="w-full md:w-1/3 flex-shrink-0">
            <div className="relative rounded-xl overflow-hidden bg-[#1b4d2b]/5 border-2 border-[#1b4d2b]/10 aspect-[4/3]">
              <img
                src={pillars[activeTab].image}
                alt={pillars[activeTab].alt}
                className="w-full h-full object-cover md:object-cover sm:object-contain transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-5 sm:pb-6 border-b border-[#1b4d2b]/10">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-semibold text-[#1b4d2b] bg-[#1b4d2b]/10 px-2 py-0.5 rounded">
                    {pillars[activeTab].id}
                  </span>
                  <span className="text-[10px] sm:text-xs font-medium text-[#1b4d2b]/70 uppercase tracking-wider">
                    {pillars[activeTab].subtitle}
                  </span>
                </div>
                <h3 className="text-xl sm:text-3xl font-bold text-[#1b4d2b] mt-1.5 sm:mt-2">
                  {pillars[activeTab].title}
                </h3>
              </div>

              <span className="self-start md:self-auto px-3 py-1 text-[10px] sm:text-xs font-semibold text-[#1b4d2b] bg-[#1b4d2b]/10 border border-[#1b4d2b]/20 rounded-full">
                {pillars[activeTab].highlight}
              </span>
            </div>

            <div className="mt-5 sm:mt-6 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-start">
              <p className="md:col-span-2 text-sm sm:text-base text-gray-700 leading-relaxed">
                {pillars[activeTab].desc}
              </p>

              <div className="bg-[#1b4d2b]/5 border border-[#1b4d2b]/10 p-3.5 sm:p-4 rounded-xl flex flex-col justify-center">
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase text-[#1b4d2b]/60 tracking-wider">Key Attributes</span>
                <span className="text-xs sm:text-sm font-medium text-[#1b4d2b] mt-1">
                  {pillars[activeTab].metrics}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hide scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}