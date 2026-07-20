"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const reviews = [
    {
      name: "Lakshmi Narayanan",
      role: "Home Chef & Mother",
      location: "Chennai, TN",
      review:
        "The aroma of Udhaya Prime Coconut Oil brings back memories of traditional home cooking. You can immediately tell it's 100% pure cold-pressed without any chemical refining.",
      rating: 5,
      product: "Pure Coconut Oil",
      avatar: "/images/avatars/lakshmi.jpg",
    },
    {
      name: "Dr. Ananthakrishnan",
      role: "Wellness Consultant",
      location: "Bengaluru, KA",
      review:
        "I consistently recommend unrefined cold-pressed oils to my clients. Udhaya Prime Groundnut Oil preserves natural nutrients and essential lipids that health-conscious families need.",
      rating: 5,
      product: "Cold-Pressed Groundnut Oil",
      avatar: "/images/avatars/ananth.jpg",
    },
    {
      name: "Priya Sundaram",
      role: "Regular Customer",
      location: "Coimbatore, TN",
      review:
        "Switching to their cold-pressed Gingelly Oil made a noticeable difference in flavor and quality. The delivery is reliable and the product quality is unmatched.",
      rating: 5,
      product: "Gingelly (Sesame) Oil",
      avatar: "/images/avatars/priya.jpg",
    },
  ];

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  return (
    <section
      className="relative py-20 sm:py-28 bg-gradient-to-b from-[#f4f7f4] via-[#f8faf8] to-white text-[#1a2e22] overflow-hidden"
      aria-label="Customer Testimonials"
    >
      {/* Decorative Subtle Grid & Glow Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1b4d2b08_1px,transparent_1px),linear-gradient(to_bottom,#1b4d2b08_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#1b4d2b]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 xs:px-6 sm:px-8 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b4d2b]/10 text-[#1b4d2b] text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#1b4d2b] animate-pulse" />
              Real Stories, Real Trust
            </div>

            <h2 className="text-3xl xs:text-4xl sm:text-5xl font-serif font-bold text-[#0f1f15] tracking-tight">
              Loved by Families, <br />
              <span className="text-[#1b4d2b] italic font-normal">
                Backed by Quality.
              </span>
            </h2>
          </div>

          {/* Social Proof Metric Box */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-[#1b4d2b]/10 shadow-sm self-start md:self-auto">
            
            <div className="text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                ★ 4.9 / 5.0
              </div>
              <p className="text-slate-600 font-medium">From 500+ Verified Buyers</p>
            </div>
          </div>
        </div>

        {/* Feature Spotlight Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Active Highlight Card (Left Column) */}
          <div className="lg:col-span-7 flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-white border border-[#1b4d2b]/10 shadow-xl shadow-[#1b4d2b]/5 relative overflow-hidden transition-all duration-500">
            {/* Background Accent Watermark */}
            <span className="absolute -right-6 -bottom-10 text-[180px] font-serif text-[#1b4d2b]/5 select-none pointer-events-none leading-none">
              “
            </span>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#1b4d2b]/10 text-[#1b4d2b] text-xs font-semibold">
                  Verified Purchase: {reviews[activeIndex].product}
                </span>
                <div className="flex gap-1 text-amber-400">
                  {[...Array(reviews[activeIndex].rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              <blockquote className="text-xl sm:text-2xl font-serif text-[#0f1f15] leading-relaxed italic">
                &ldquo;{reviews[activeIndex].review}&rdquo;
              </blockquote>
            </div>

            <div className="pt-8 mt-8 border-t border-slate-100 flex items-center justify-between relative z-10">
              <div>
                <h3 className="text-lg font-bold text-[#0f1f15]">
                  {reviews[activeIndex].name}
                </h3>
                <p className="text-xs text-[#1b4d2b] font-medium">
                  {reviews[activeIndex].role} &bull; {reviews[activeIndex].location}
                </p>
              </div>

              {/* Navigation Controls */}
              <div className="flex gap-2">
                {reviews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Go to review ${idx + 1}`}
                    className={`h-2.5 transition-all duration-300 rounded-full ${
                      activeIndex === idx
                        ? "w-8 bg-[#1b4d2b]"
                        : "w-2.5 bg-[#1b4d2b]/20 hover:bg-[#1b4d2b]/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Interactive Selection Column (Right Column) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {reviews.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    isActive
                      ? "bg-white border-[#1b4d2b] shadow-lg translate-x-1"
                      : "bg-white/60 border-transparent hover:bg-white hover:border-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-[#0f1f15]">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#1b4d2b] font-medium">
                        {item.role}
                      </p>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {item.product}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 italic">
                    &ldquo;{item.review}&rdquo;
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}