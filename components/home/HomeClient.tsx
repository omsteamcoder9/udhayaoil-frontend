// components/home/HomeClient.tsx
'use client';

import { Truck, Shield, Minus, Plus, Clock, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import { Category } from '@/types/category';
import ProductGrid from '@/components/products/ProductGrid';
import Image from "next/image";
import { settingsAPI } from '@/lib/settings-api';
import { getAllProducts } from '@/lib/productService';
import Link from 'next/link';
import Carousel from '@/components/home/Carousal';
import AdSection from '@/components/AdSection';
import HeroSection from '@/components/herosection';
import IntegrityShowcase from '@/components/whychooseus';
import TestimonialSection from '@/components/TestimonialSection'; // Adjust path as needed

interface HomeClientProps {
  categories: Category[];  // All categories - will show only those with products
}

// Define slide data with individual image handling
const heroSlides = [
   {
    id: 2,
    topBadge: "PURE. NATURAL. HEALTHY.",
    mainTitle: "Pure Oil for a Healthy Life",
    tagline: "",
    description: "Our premium coconut oil, groundnut oil, and gingelly oil are cold-pressed for maximum nutrition, naturally pure, and perfect for everyday cooking and wellness.",
    features: [
      { title: "COLD-PRESSED", sub: "Maximum Nutrition" },
      { title: "100% PURE", sub: "No Additives" },
      { title: "NATURALLY HEALTHY", sub: "Rich in Nutrients" }
    ],
    ctaText: "SHOP NOW",
    bgImage: "/images/hero1.png",
    imageSize: { width: 1920, height: 1080 },
    objectPosition: "center center",
    objectFit: "contain",
  },
  {
    id: 1,
    topBadge: "TRADITIONAL. PURE. TRUSTED.",
    mainTitle: "PREMIUM COOKING OILS",
    tagline: "NATURAL. PURE. HEALTHY.",
    description: "Udhaya Prime Oil Industry brings you the finest cold-pressed oils - Coconut Oil, Groundnut Oil, and Gingelly Oil - crafted for health-conscious families.",
    features: [
      { title: "COLD-PRESSED", sub: "PURE OIL" },
      { title: "NATURAL & PURE", sub: "CHEMICAL FREE" },
      { title: "HEALTHY COOKING", sub: "FOR FAMILY" },
      { title: "PREMIUM", sub: "QUALITY" }
    ],
    ctaText: "SHOP NOW",
    bgImage: "/images/hero.png",
    imageSize: { width: 1920, height: 1060 },
    objectPosition: "center top",
    objectFit: "contain",
  },
 
];

export default function HomeClient({ categories }: HomeClientProps) {
  const router = useRouter();
  const heroRef = useRef(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [contactNumber, setContactNumber] = useState('7200074221');
  
  // State for tracking categories with products
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<string[]>([]);
  const [checkingProducts, setCheckingProducts] = useState(true);

  // Fetch contact info on component mount
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const contactInfo = await settingsAPI.getContactInfo();
        setContactNumber(contactInfo.whatsappNumber || contactInfo.contactNumber || '7200074221');
      } catch (error) {
        console.error('Error fetching contact info:', error);
        setContactNumber('7200074221');
      }
    };

    fetchContactInfo();
  }, []);

  // Check which categories have products
  useEffect(() => {
    const checkCategoriesForProducts = async () => {
      try {
        setCheckingProducts(true);
        const categoriesWithProductsList: string[] = [];
        
        for (const category of categories) {
          const response = await getAllProducts({ category: category._id });
          if (response.data && response.data.length > 0) {
            categoriesWithProductsList.push(category._id);
          }
        }
        
        setCategoriesWithProducts(categoriesWithProductsList);
      } catch (error) {
        console.error('Error checking categories for products:', error);
      } finally {
        setCheckingProducts(false);
      }
    };

    if (categories.length > 0) {
      checkCategoriesForProducts();
    }
  }, [categories]);

  // Auto slide change
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const navigateToProducts = () => {
    router.push('/products');
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    
    setIsTransitioning(true);
    setCurrentSlide(index);
    
    setTimeout(() => setIsTransitioning(false), 500);
  };

const faqItems = [
  {
    question: "What makes your cooking oils different from regular oils?",
    answer: "Our oils are cold-pressed to preserve natural nutrients, antioxidants, and essential fatty acids. Unlike refined oils, we use no chemicals or heat processing, ensuring you get pure, natural oil with maximum health benefits."
  },
  {
    question: "Which oil is best for daily cooking?",
    answer: "Groundnut oil is excellent for daily cooking due to its high smoke point and neutral flavor. Coconut oil is perfect for baking and sautéeing, while gingelly oil (sesame oil) adds a rich, nutty flavor to Asian and South Indian dishes."
  },
  {
    question: "How should I store your oils?",
    answer: "Store our oils in a cool, dark place away from direct sunlight. Keep them in airtight containers to maintain freshness. Our cold-pressed oils have a natural shelf life and retain their quality when stored properly."
  },
  {
    question: "What are the health benefits of cold-pressed oils?",
    answer: "Cold-pressed oils retain natural antioxidants, vitamins E and K, and healthy fatty acids. They support heart health, improve skin and hair, boost immunity, and provide essential nutrients for overall well-being. Each oil - coconut, groundnut, and gingelly - offers unique health benefits."
  },

];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Filter categories to only show those with products
  const visibleCategories = categories.filter(
    category => categoriesWithProducts.includes(category._id)
  );

  // Primary color constant - changed to match footer
  const primaryColor = '#FFD166';

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Slider Section */}
      <HeroSection />


      {/* Explore Products Section - Shows ALL categories that have products */}
      {!checkingProducts && visibleCategories.length > 0 && (
        <section className="py-6 xs:py-8 sm:py-12 bg-white" aria-label="Explore Our Products">
          <div className="container mx-auto px-1">
            <div className="text-center mb-4 xs:mb-6 sm:mb-8">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-[#1b4d2b] mb-2 xs:mb-3">
                Explore Our Pure Oil Collection
              </h2>
              <p className="text-black/60 text-xs xs:text-sm sm:text-base max-w-2xl mx-auto px-2">
                Discover premium Coconut Oil, Groundnut Oil, Gingelly Oil and more - cold-pressed for your family's health
              </p>
            </div>

            <div className="space-y-8 xs:space-y-10 sm:space-y-12">
              {visibleCategories.map((category, index) => (
                <div 
                  key={category._id} 
                  className="animate-fade-in-up" 
                  style={{ 
                    animationDelay: `${index * 300}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <div className="mb-4 xs:mb-5 sm:mb-6 px-2 xs:px-3 sm:px-4">
                    <div className="flex flex-col items-center justify-center text-center mb-3 xs:mb-4">
                      <div>
                        <h3 className="text-xl xs:text-2xl sm:text-3xl font-bold text-[#1b4d2b]">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="h-0.5 xs:h-1 w-16 xs:w-20 bg-gradient-to-r from-[#1b4d2b] via-[#1b4d2b] to-[#1b4d2b] rounded-full"></div>
                    </div>
                  </div>

                  <ProductGrid 
                    category={category._id} 
                    limit={8} 
                    hideFilters={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Show a message if no categories have products */}
      {!checkingProducts && visibleCategories.length === 0 && (
        <section className="py-6 xs:py-8 sm:py-12 bg-white">
          <div className="container mx-auto px-1 text-center">
            <p className="text-black/50 text-xs xs:text-sm">No products available at the moment. Please check back later.</p>
          </div>
        </section>
      )}
      
      <Carousel displayCategories={categories} />







<section className="relative py-16 sm:py-20 bg-[#faf9f6] text-[#1c241e] overflow-hidden" aria-label="Our Mission & Vision">
  {/* Soft Organic Ambient Background Glows */}
  <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#1b4d2b]/5 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute bottom-0 left-10 w-[30rem] h-[30rem] bg-[#1b4d2b]/10 rounded-full blur-3xl pointer-events-none" />

  <div className="container mx-auto px-4 xs:px-6 sm:px-8 max-w-7xl relative z-10">
    <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      
      {/* Content Side */}
      <div className="lg:col-span-7 space-y-6 sm:space-y-8 order-2 lg:order-1">
        
        {/* Header Tag & Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#1b4d2b]/10 text-[#1b4d2b] text-xs font-semibold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-[#1b4d2b] animate-ping" />
            Our Core Vision
          </div>

          <h2 className="text-3xl xs:text-4xl sm:text-5xl font-serif font-bold text-[#111a13] leading-[1.15]">
            Crafting Purity for <br className="hidden sm:inline" />
            <span className="text-[#1b4d2b] italic font-normal">Healthier Generations</span>
          </h2>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-[#1b4d2b]/10 flex items-center justify-center text-[#1b4d2b] mb-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-semibold text-base text-[#111a13] mb-1">Traditional Extraction</h3>
            <p className="text-xs sm:text-sm text-black/70 leading-relaxed">
              Coconut, Groundnut, and Gingelly oils pressed slowly using heritage cold-pressing techniques.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-[#1b4d2b]/10 flex items-center justify-center text-[#1b4d2b] mb-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-base text-[#111a13] mb-1">Nutrient Rich</h3>
            <p className="text-xs sm:text-sm text-black/70 leading-relaxed">
              Unrefined purity that preserves natural aroma, essential lipids, and authentic taste.
            </p>
          </div>
        </div>

        {/* Highlighted Quote Bar */}
        <div className="relative p-6 rounded-2xl bg-[#1b4d2b] text-white overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 -translate-y-6 translate-x-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="relative z-10 flex items-start gap-4">
            <span className="text-4xl leading-none font-serif text-[#a3d9b1] select-none">&ldquo;</span>
            <div>
              <p className="text-base sm:text-lg font-serif italic text-white/95 leading-relaxed">
                Pure, cold-pressed oils make every meal healthier and every family stronger.
              </p>
              <p className="text-xs font-semibold tracking-wider uppercase text-[#a3d9b1] mt-2">
                Udhaya Prime Promise
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Visual Canvas Side */}
      <div className="lg:col-span-5 order-1 lg:order-2">
        <div className="relative mx-auto max-w-md lg:max-w-none">
          
          {/* Main Visual Frame - Fixed 500px Height & No Borders */}
          <div className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl group">
            <Image
              src="/images/home1.jpg"
              alt="Udhaya Prime Oil Industry - Premium Cold-Pressed Coconut Oil, Groundnut Oil, and Gingelly Oil"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              quality={90}
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

            {/* Overlay Badge inside Image */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/90 backdrop-blur-md shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#1b4d2b]">100% Unrefined</p>
                  <p className="text-sm font-semibold text-[#111a13]">Cold-Pressed Goodness</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#1b4d2b] flex items-center justify-center text-white text-xs font-bold">
                  ✓
                </div>
              </div>
            </div>
          </div>

          {/* Floating Decorative Accent Badge */}
          <div className="hidden xs:block absolute -top-5 -right-5 bg-white p-4 rounded-2xl shadow-xl text-center">
            <p className="text-2xl font-bold font-serif text-[#1b4d2b]">100%</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-black/60">Natural & Pure</p>
          </div>

        </div>
      </div>

    </div>
  </div>
</section>
      
   <IntegrityShowcase />

   <section 
  className="relative py-24 sm:py-32 bg-white text-zinc-900 overflow-hidden" 
  aria-label="How to Use Our Premium Oils"
>
  {/* Ambient Background Accents */}
  <div className="absolute top-1/2 -left-32 -translate-y-1/2 w-96 h-96 bg-[#1b4d2b]/5 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute top-1/3 -right-32 w-96 h-96 bg-[#1b4d2b]/5 rounded-full blur-3xl pointer-events-none" />

  <div className="relative container mx-auto px-4 sm:px-6 max-w-7xl z-10">
    
    {/* Section Header */}
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 gap-8">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b4d2b]/10 text-[#1b4d2b] text-xs font-bold uppercase tracking-widest mb-4">
          <span className="w-2 h-2 rounded-full bg-[#1b4d2b]" />
          Oil Application Guide
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
          Elevate Your <span className="text-[#1b4d2b]">Daily Cooking</span>
        </h2>
      </div>
      <p className="text-zinc-600 text-sm sm:text-base max-w-md leading-relaxed">
        Discover the perfect oil for every cooking need. From high-heat frying to delicate dressings, our cold-pressed oils deliver unmatched flavor and nutrition.
      </p>
    </div>

    {/* 3-Step Oil Guide Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* Step 1: Coconut Oil */}
      <div className="group relative p-8 sm:p-10 rounded-[2.5rem] bg-[#faf9f6] border border-zinc-200/80 hover:bg-white hover:border-[#1b4d2b]/30 hover:shadow-2xl hover:shadow-[#1b4d2b]/10 transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-8">
            <span className="text-xs font-bold font-mono tracking-widest text-[#1b4d2b] uppercase bg-[#1b4d2b]/10 px-3 py-1 rounded-full">
              Coconut Oil
            </span>
            <span className="text-zinc-400 font-mono text-xs">Medium Heat</span>
          </div>

          <h3 className="text-2xl font-extrabold text-zinc-950 mb-3 tracking-tight group-hover:text-[#1b4d2b] transition-colors">
            Baking & Sautéing
          </h3>

          <p className="text-zinc-600 text-sm leading-relaxed mb-6">
            Perfect for baking, sautéing, and stir-frying. Adds a subtle tropical aroma to dishes. Excellent for curries, roasted vegetables, and healthy desserts. Also great for skincare and hair care.
          </p>
        </div>

        <div className="pt-6 border-t border-zinc-200/60 flex items-center justify-between text-xs font-bold text-zinc-500">
          <span>Best For: Baking & Curries</span>
          <span className="text-[#1b4d2b]">Smoke Point: 177°C</span>
        </div>
      </div>

      {/* Step 2: Groundnut Oil */}
      <div className="group relative p-8 sm:p-10 rounded-[2.5rem] bg-[#faf9f6] border border-zinc-200/80 hover:bg-white hover:border-[#1b4d2b]/30 hover:shadow-2xl hover:shadow-[#1b4d2b]/10 transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-8">
            <span className="text-xs font-bold font-mono tracking-widest text-[#1b4d2b] uppercase bg-[#1b4d2b]/10 px-3 py-1 rounded-full">
              Groundnut Oil
            </span>
            <span className="text-zinc-400 font-mono text-xs">High Heat</span>
          </div>

          <h3 className="text-2xl font-extrabold text-zinc-950 mb-3 tracking-tight group-hover:text-[#1b4d2b] transition-colors">
            Frying & Deep-Frying
          </h3>

          <p className="text-zinc-600 text-sm leading-relaxed mb-6">
            Ideal for deep-frying, pan-frying, and high-heat cooking. With a high smoke point and neutral flavor, it's perfect for Indian snacks, pakoras, and everyday tempering.
          </p>
        </div>

        <div className="pt-6 border-t border-zinc-200/60 flex items-center justify-between text-xs font-bold text-zinc-500">
          <span>Best For: Frying & Tempering</span>
          <span className="text-[#1b4d2b]">Smoke Point: 232°C</span>
        </div>
      </div>

      {/* Step 3: Gingelly Oil */}
      <div className="group relative p-8 sm:p-10 rounded-[2.5rem] bg-[#1b4d2b] text-white shadow-xl shadow-[#1b4d2b]/20 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-8">
            <span className="text-xs font-bold font-mono tracking-widest text-emerald-200 uppercase bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
              Gingelly Oil
            </span>
            <span className="text-emerald-200/60 font-mono text-xs">Medium-High Heat</span>
          </div>

          <h3 className="text-2xl font-extrabold mb-3 tracking-tight text-white">
            Traditional & Ayurvedic
          </h3>

          <p className="text-emerald-100/80 text-sm leading-relaxed mb-6">
            Essential for South Indian and Asian cuisine. Adds rich, nutty flavor to dosas, sambar, and pickles. Also used in Ayurvedic massages for joint health and overall wellness.
          </p>
        </div>

        <div className="pt-6 border-t border-white/15 flex items-center justify-between text-xs font-bold text-emerald-200">
          <span>Best For: Traditional Cooking</span>
          <span className="text-white">Smoke Point: 210°C</span>
        </div>
      </div>

    </div>


  </div>
</section>

<section className="w-full min-h-[400px] sm:h-[400px] bg-gray-50 border-y border-gray-200/80 overflow-hidden relative">
  
  {/* Subtle Background Mesh Accents */}
  <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute -bottom-24 right-1/3 w-96 h-96 bg-emerald-50 rounded-full blur-3xl pointer-events-none" />

  <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-12 h-full items-center gap-8">
      
      {/* Content Column */}
      <div className="lg:col-span-7 z-10 flex flex-col justify-center py-6 lg:py-0 order-2 lg:order-1">
        
        {/* Label */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Cold-Pressed Excellence
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Purity in Every Drop, <br />
          <span className="text-emerald-700">Wellness in Every Meal.</span>
        </h2>

        {/* Description */}
        <p className="mt-3 text-sm sm:text-base text-gray-600 line-clamp-2 max-w-xl">
          100% natural, chemical-free cold-pressed oils crafted using time-honored traditional extraction methods to keep all essential nutrients intact.
        </p>

        {/* Compact Badges & CTA */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-emerald-800 transition-colors duration-200 shadow-sm cursor-pointer">
            Discover Oils
          </button>
          
          <div className="hidden sm:flex items-center gap-4 border-l border-gray-200 pl-4 text-xs text-gray-500 font-medium">
            <span>✓ Zero Additives</span>
            <span>✓ 100% Organic</span>
          </div>
        </div>

      </div>

      {/* Desktop Image Column - Edge-to-Edge Right Pane */}
      <div className="hidden lg:block lg:col-span-5 h-full relative overflow-hidden order-2">
        {/* Left Fade Overlay */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        
        <img 
          src="/images/hi.jpg"
          alt="Golden pure oil drop close up" 
          className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
        />
      </div>

      {/* Mobile Full Width Image */}
      <div className="lg:hidden w-full h-64 sm:h-80 relative overflow-hidden order-1">
        <img 
          src="/images/hi.jpg"
          alt="Golden pure oil drop close up" 
          className="w-full h-full object-cover object-center"
        />
      </div>

    </div>
  </div>

</section>
    {/* Integrity Showcase Section */}

            <TestimonialSection />


<section 
  className="relative py-20 sm:py-28 bg-[#faf9f6] text-zinc-900 overflow-hidden" 
  aria-label="Frequently Asked Questions"
>
  {/* Modern Architectural Grid Lines (Subtle Overlay) */}
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

  <div className="relative container mx-auto px-4 sm:px-6 max-w-7xl z-10">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
      
      {/* LEFT COLUMN: Modern Sticky Floating Hero Card */}
      <div className="lg:col-span-5 lg:sticky lg:top-12">
        <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white border border-zinc-200/80 shadow-xl shadow-zinc-200/50 backdrop-blur-xl relative overflow-hidden">
          {/* Subtle Color Accent Blur */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#1b4d2b]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Micro-badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b4d2b]/10 text-[#1b4d2b] text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-[#1b4d2b] animate-pulse" />
            Knowledge Base
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight leading-[1.1] mb-6">
            Everything you need to <span className="text-[#1b4d2b]">know.</span>
          </h2>

          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed mb-8">
            Have questions about our extraction methods, organic standards, or application guides? We've assembled all the answers right here.
          </p>

          {/* Quick Stats / Info Widget */}
          <div className="pt-6 border-t border-zinc-100 grid grid-cols-2 gap-4">
            <div>
              <span className="block text-2xl font-extrabold text-[#1b4d2b]">100%</span>
              <span className="text-xs font-medium text-zinc-500">Pure Extraction</span>
            </div>
            <div>
              <span className="block text-2xl font-extrabold text-[#1b4d2b]">24/7</span>
              <span className="text-xs font-medium text-zinc-500">Expert Support</span>
            </div>
          </div>

          {/* Direct Link Footer */}
          <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-medium">Need custom advice?</span>
            <a 
              href="contact" 
              className="text-xs font-bold text-[#1b4d2b] hover:underline inline-flex items-center gap-1"
            >
              Ask an Expert &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Glass-Pill Accordion Stack */}
      <div 
        className="lg:col-span-7 space-y-4"
        itemScope 
        itemType="https://schema.org/FAQPage"
      >
        {faqItems.map((faq, index) => {
          const isOpen = openFaqIndex === index;

          return (
            <div
              key={index}
              className={`rounded-3xl transition-all duration-300 overflow-hidden border ${
                isOpen
                  ? 'bg-white border-[#1b4d2b]/40 shadow-xl shadow-[#1b4d2b]/5'
                  : 'bg-white/60 border-zinc-200/80 hover:bg-white hover:border-zinc-300'
              }`}
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 focus:outline-none"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Number Badge */}
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                    isOpen ? 'bg-[#1b4d2b] text-white' : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <h3 
                    className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight"
                    itemProp="name"
                  >
                    {faq.question}
                  </h3>
                </div>

                {/* Animated Pill Toggle Indicator */}
                <div className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                  isOpen 
                    ? 'bg-[#1b4d2b]/10 text-[#1b4d2b]' 
                    : 'bg-zinc-100 text-zinc-400'
                }`}>
                  {isOpen ? 'Close' : 'Read'}
                </div>
              </button>

              {/* Animated Expansion */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <div className="overflow-hidden">
                  <div className="px-6 sm:px-7 pb-7 pt-2 border-t border-zinc-100/80 ml-12 sm:ml-14">
                    <p 
                      className="text-zinc-600 text-sm sm:text-base leading-relaxed"
                      itemProp="text"
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>

    {/* SEO Schema Script */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqItems.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        })
      }}
    />
  </div>
</section>
      
 
    </div>
  );
}