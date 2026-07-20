'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { settingsAPI } from '@/lib/settings-api';
import { PublicSettings } from '@/types/settings';

export default function Footer() {
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await settingsAPI.getPublicSettings();
        if (response.success) {
          setSettings(response.data as PublicSettings);
        } else {
          setError(response.message || 'Failed to load settings');
        }
      } catch (err) {
        setError('An error occurred while fetching settings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Calculate logo lines from site name
  const getLogoLines = () => {
    if (!settings?.siteName || settings.siteName.trim() === '') {
      return { first: '', second: '' };
    }
    
    const nameParts = settings.siteName.trim().split(' ');
    if (nameParts.length > 1) {
      return { 
        first: nameParts[0], 
        second: nameParts.slice(1).join(' ') 
      };
    }
    
    return { 
      first: nameParts[0], 
      second: '' 
    };
  };

  const { first: logoFirstLine, second: logoSecondLine } = getLogoLines();

  if (loading) {
    return (
      <footer className="bg-[#1b4d2b] py-10">
        <div className="container mx-auto px-4 text-center text-white text-sm">
          Loading footer...
        </div>
      </footer>
    );
  }

  if (error || !settings) {
    return (
      <footer className="bg-[#1b4d2b] text-white py-10">
        <div className="container mx-auto px-4 text-center text-white text-sm">
          {error || 'Failed to load footer data'}
        </div>
      </footer>
    );
  }

  const defaultCustomerServiceLinks = [
    { name: 'Shipping Info', url: '/shipping' },
    { name: 'Returns', url: '/returns' },
    { name: 'Privacy Policy', url: '/privacy' },
    { name: 'Terms of Service', url: '/terms' }
  ];

  const customerServiceLinks = settings.footerLinks && settings.footerLinks.length > 0 
    ? settings.footerLinks 
    : defaultCustomerServiceLinks;

  return (
    <footer className="bg-[#1b4d2b] text-white border-t border-white/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">

          {/* Company Info */}
          <div>
            <Link href="/" className="flex items-center group cursor-pointer mb-3">
              {/* Logo image with combined styling - FIXED SIZING */}
              <div
                className="
                  relative
                  w-24 h-24 sm:w-20 sm:h-20 md:w-16 md:h-16 lg:w-25 lg:h-25
                  transition-transform duration-200 group-hover:scale-105
                  mr-2 sm:mr-3
                "
              >
                <Image
                  src="/images/logo.png"
                  alt={settings.siteName}
                  fill
                  priority
                  className="object-contain"
                  
                />
              </div>
              
      
            </Link>
            
            <p className="text-white mb-3 text-sm sm:text-base font-normal leading-relaxed">
              {settings.siteDescription}
            </p>
            
            {/* GSTIN Display */}
            {settings.gstinNumber && (
              <div className="">
                <div className="flex items-center">
                  <svg 
                    className="w-4 h-4 mr-2 text-[#FFD166] flex-shrink-0" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                  <div>
                    <p className="text-xs font-bold text-[#FFD166]">GSTIN</p>
                    <p className="text-xs text-white font-mono tracking-wider font-medium">
                      {settings.gstinNumber}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-medium mb-4 text-[#FFF8E7]">Quick Links</h3>
            <ul className="space-y-2 text-white">
              {["Home", "Products", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
                    className="hover:text-[#FFE08A] transition-colors duration-300 flex items-center group text-sm sm:text-base font-medium"
                  >
                    <span className="w-1.5 h-1.5 bg-[#FFD166]/60 rounded-full mr-2 group-hover:bg-[#FFE08A] transition-colors"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-medium mb-4 text-[#FFF8E7]">
              Customer Service
            </h3>
            <ul className="space-y-2 text-white">
              {customerServiceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.url}
                    className="hover:text-[#FFE08A] transition-colors duration-300 flex items-center group text-sm sm:text-base font-medium"
                  >
                    <span className="w-1.5 h-1.5 bg-[#FFD166]/60 rounded-full mr-2 group-hover:bg-[#FFE08A] transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-medium mb-4 text-[#FFF8E7]">
              Contact Us
            </h3>
            <ul className="space-y-2.5 text-white">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#FFD166] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm sm:text-base font-semibold text-white">Email:</span>
    <span className="text-xs font-medium text-white truncate break-all">{settings.contactEmail}</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#FFD166] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm sm:text-base font-semibold text-white">Call:</span>
                <span className="text-sm sm:text-base font-medium text-white">{settings.contactNumber}</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#FFD166] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm sm:text-base font-medium text-white">Mon–Sun · 9AM–7PM</span>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="mt-5 flex space-x-3.5">
              {[
                { 
                  url: settings.twitterUrl, 
                  icon: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z", 
                  label: "Twitter" 
                },
                { 
                  url: settings.linkedinUrl, 
                  icon: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM6 9H2v12h4V9zM4 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z", 
                  label: "LinkedIn" 
                },
                { 
                  url: settings.instagramUrl, 
                  icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z", 
                  label: "Instagram" 
                },
                { 
                  url: settings.facebookUrl, 
                  icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z", 
                  label: "Facebook" 
                },
                { 
                  url: settings.youtubeUrl, 
                  icon: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z", 
                  label: "YouTube" 
                }
              ].map((social, i) => (
                social.url && (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FFD166] hover:text-[#FFE08A] transition-colors duration-300 p-1.5 hover:bg-white/10 rounded-full"
                    aria-label={social.label}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </a>
                )
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-5 pb-4 text-center">
          <p className="text-xs sm:text-sm font-medium text-white">© {new Date().getFullYear()} {settings.siteName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}