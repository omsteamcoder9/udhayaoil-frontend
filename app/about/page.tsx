// app/about/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf, Droplet, Award, Users, Sparkles, Heart, Sun, Wind, CheckCircle } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
}

const AboutPage: React.FC = () => {
  const storeName = process.env.NEXT_PUBLIC_SITE_NAME || 'Udhaya Prime Oil Industry';

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Udhaya Prime Team',
      role: 'Founders',
      bio: `Our team has over 15 years of experience in the premium cooking oil industry and founded ${storeName} with a vision to provide pure, cold-pressed coconut oil, groundnut oil, gingelly oil, and other healthy cooking oils for health-conscious families.`,
      image: '/images/m1.png'
    },
    {
      id: 2,
      name: 'Sourcing Experts',
      role: 'Sourcing Specialists',
      bio: `Our sourcing experts work directly with the finest seed and nut farmers to ensure we get the highest quality raw materials for our cold-pressed oils - premium coconuts, groundnuts, and sesame seeds for authentic taste and maximum nutrition.`,
      image: '/images/m1.png'
    },
    {
      id: 3,
      name: 'Quality Team',
      role: 'Product Excellence',
      bio: 'Our quality team ensures every batch of coconut oil, groundnut oil, and gingelly oil meets the highest standards of purity, nutritional value, and taste through rigorous testing and careful cold-press processing.',
      image: '/images/m1.png'
    }
  ];

  const stats = [
    { number: '15+', label: 'Years Experience' },
    { number: '20+', label: 'Oil Varieties' },
    { number: '25k+', label: 'Happy Customers' },
    { number: '100%', label: 'Pure & Natural' }
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1b4d2b]/5 via-[#1b4d2b]/10 to-[#1b4d2b]/5 pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <span className="inline-block px-4 py-1.5 bg-[#1b4d2b] text-white text-xs font-semibold rounded-full uppercase tracking-wider mb-6">
            Since 2026
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            Pure. Natural.
            <br />
            <span className="text-[#1b4d2b]">Healthy Cooking Oils</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed">
            Dedicated to providing premium quality cold-pressed coconut oil, groundnut oil, 
            gingelly oil, and healthy cooking oils for modern families.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#1b4d2b] text-white rounded-lg font-semibold hover:bg-[#1b4d2b]/90 transition-colors"
            >
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="#story" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-700 rounded-lg font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#1b4d2b] mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1 bg-[#1b4d2b]/10 text-[#1b4d2b] text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                A Legacy of <span className="text-[#1b4d2b]">Pure Nutrition</span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  For over a decade, we've been dedicated to bringing the purest, most nutritious 
                  cooking oils to families across the country.
                </p>
                <p>
                  We carefully source our seeds and nuts from trusted farmers, ensuring every batch 
                  of coconut oil, groundnut oil, and gingelly oil meets the highest standards of 
                  purity and nutritional value.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-[#1b4d2b]" />
                  <span>100% Pure</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-[#1b4d2b]" />
                  <span>Cold Pressed</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-[#1b4d2b]" />
                  <span>No Additives</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-[#1b4d2b]" />
                  <span>Premium Quality</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <div className="aspect-[4/3] relative bg-gray-100">
                  <Image
                    src="/images/about1.jpg"
                    alt="About Us"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1 bg-[#1b4d2b]/10 text-[#1b4d2b] text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Makes Us Different
            </h2>
            <p className="text-gray-600">
              Every drop of our oil reflects our commitment to purity, health, and sustainability
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Sun className="w-6 h-6" />, title: 'Natural Purity', desc: '100% pure, cold-pressed oils' },
              { icon: <Heart className="w-6 h-6" />, title: 'Health First', desc: 'Nutrient-rich for wellness' },
              { icon: <Droplet className="w-6 h-6" />, title: 'Premium Quality', desc: 'Finest seeds and nuts' },
              { icon: <Wind className="w-6 h-6" />, title: 'Sustainable', desc: 'Eco-friendly methods' }
            ].map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#1b4d2b]/10 rounded-lg flex items-center justify-center text-[#1b4d2b] mb-4">
                  {value.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-32 bg-[#fafaf9]" aria-label="Our Team">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-24 space-y-3 md:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-[#1b4d2b]">Meet The Team</h2>
            <div className="w-10 md:w-12 h-1 bg-gradient-to-r from-[#1b4d2b] via-[#1b4d2b] to-[#1b4d2b]/30 mx-auto" />
            <p className="text-stone-500 text-base md:text-lg font-light tracking-wide">
              The passionate experts behind {storeName}
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="group relative bg-white p-6 md:p-8 lg:p-10 rounded-2xl md:rounded-[2rem] border border-stone-200 transition-all duration-500 hover:-translate-y-2 md:hover:-translate-y-4 shadow-sm hover:shadow-xl md:hover:shadow-2xl overflow-hidden"
              >
                <div className="absolute -top-8 -right-8 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-[#1b4d2b]/5 via-[#1b4d2b]/5 to-[#1b4d2b]/5 rounded-full transition-transform group-hover:scale-[2] md:group-hover:scale-[3] duration-700" />
                
                <div className="relative z-10">
                  <div className="w-20 h-20 md:w-28 md:h-28 mb-6 md:mb-8 relative rounded-xl md:rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 ring-2 md:ring-4 ring-stone-50 rotate-3 group-hover:rotate-0 shadow-md md:shadow-lg">
                      <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 80px, 112px"
                      />
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-serif text-[#1b4d2b] mb-1">{member.name}</h3>
                  <p className="text-[10px] md:text-xs font-bold text-[#1b4d2b] uppercase tracking-[0.15em] md:tracking-[0.2em] mb-4 md:mb-6">{member.role}</p>
                  <p className="text-sm md:text-base text-stone-600 leading-relaxed font-light">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1b4d2b]">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Experience the Purity
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of health-conscious families who trust our premium cold-pressed oils
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-[#1b4d2b] rounded-lg font-bold hover:bg-gray-50 transition-colors"
          >
            Shop Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;