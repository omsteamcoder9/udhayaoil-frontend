'use client';

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Category } from '@/types/category';

interface CategoryCarouselProps {
  displayCategories?: Category[];
}

export default function CategoryCarousel({ displayCategories = [] }: CategoryCarouselProps) {
  const router = useRouter();
  const [position, setPosition] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const speed = 0.08; // Smooth, relaxed speed

  const imageBaseUrl = typeof window !== 'undefined' 
    ? process.env.NEXT_PUBLIC_IMG_URL || 'http://localhost:5002/uploads'
    : '';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        if (displayCategories.length > 0) {
          setCategories(displayCategories);
        } else {
          const { fetchActiveCategories } = await import('@/lib/categoryService');
          const data = await fetchActiveCategories();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [displayCategories]);

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath || !mounted) return null;
    const cleanPath = imagePath.replace('/uploads/', '');
    return `${imageBaseUrl}/${cleanPath}`;
  };

  const getDuplicatedArray = () => {
    if (!categories.length) return [];
    const duplicateCount = categories.length <= 3 ? 6 : 3;
    return Array(duplicateCount).fill(categories).flat();
  };

  const carouselCategories = getDuplicatedArray();

  const animate = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;

    setPosition(prev => {
      if (!containerRef.current) return prev;
      const containerWidth = containerRef.current.scrollWidth;
      const singleSetWidth = containerWidth / (carouselCategories.length / categories.length);
      const newPosition = prev + speed * delta;
      return newPosition >= singleSetWidth ? 0 : newPosition;
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [categories.length, carouselCategories.length]);

  useEffect(() => {
    if (!loading && categories.length > 0 && mounted) {
      setPosition(0);
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate, loading, categories.length, mounted]);

  if (loading || !mounted) {
    return (
      <section className="w-full py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="h-6 w-48 bg-gray-200 rounded-full mx-auto animate-pulse mb-8" />
          <div className="flex justify-center gap-4 overflow-hidden">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-44 h-52 bg-gray-200 rounded-2xl animate-pulse flex-shrink-0" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories.length) return null;

  return (
    <section className="w-full py-12 md:py-16 bg-[#fafaf9]">
<div className="max-w-7xl mx-auto px-4 mb-8 text-center">
  <div>
    <span className="text-xs font-semibold uppercase tracking-widest text-[#1b4d2b] mb-1 block">Categories</span>
    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1b4d2b]">Explore Our Oils</h2>
  </div>
  <p className="text-sm text-[#1b4d2b]/60 mt-1">Discover our premium cold-pressed oils</p>
</div>

      <div className="relative w-full overflow-hidden">
        {/* Soft Side Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#fafaf9] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#fafaf9] to-transparent z-10 pointer-events-none" />

        <div
          ref={containerRef}
          className="flex gap-4 py-2"
          style={{ transform: `translateX(-${position}px)` }}
        >
          {carouselCategories.map((category, index) => {
            const imageUrl = getImageUrl(category.image);
            return (
              <button
                key={`${category._id}-${index}`}
                onClick={() => router.push(`/products?category=${category.slug || category._id}`)}
                className="flex-shrink-0 group w-40 sm:w-48 bg-white border border-[#1b4d2b]/10 rounded-2xl p-3 text-left transition-all duration-300 hover:shadow-lg hover:shadow-[#1b4d2b]/10 hover:-translate-y-1 focus:outline-none cursor-pointer"
              >
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#1b4d2b]/5 mb-3">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.parentElement?.querySelector('.fallback');
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center font-bold text-[#1b4d2b]/30 text-3xl ${imageUrl ? 'hidden' : ''} fallback`}>
                    {category.name.charAt(0)}
                  </div>
                </div>
                <div className="px-1">
                  <h3 className="font-semibold text-[#1b4d2b] text-sm truncate group-hover:text-[#1b4d2b] transition-colors">
                    {category.name}
                  </h3>
                  <span className="text-xs text-[#1b4d2b]/50 font-normal group-hover:text-[#1b4d2b] transition-colors">Shop Now →</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}