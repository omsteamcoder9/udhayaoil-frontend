'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useState, useEffect, useRef } from 'react';
import { quickSearchProducts } from '@/lib/productService';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { settingsAPI } from '@/lib/settings-api';
import CartDrawer from '@/components/CartDrawer';
import { ShoppingCart, Phone, Mail } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
}

interface SearchProduct {
  _id: string;
  name: string;
  slug: string;
  basePrice: number;
  image: string | null;
  category: string;
  featured: boolean;
}

interface HeaderClientProps {
  initialCategories: Category[];
}

export default function HeaderClient({ initialCategories }: HeaderClientProps) {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [siteNameMain, setSiteNameMain] = useState('');
  const [siteNameTagline, setSiteNameTagline] = useState('');
  
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Dynamic contact information state
  const [contactEmail, setContactEmail] = useState('info@company.com');
  const [contactNumber, setContactNumber] = useState('+91 98765 43210');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isLoadingContact, setIsLoadingContact] = useState(true);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const shopDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null); // Add ref for profile dropdown

  const [isMobile, setIsMobile] = useState(false);
 
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1280);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Load site settings and contact info
  useEffect(() => {
    const loadSiteSettings = async () => {
      try {
        const response = await settingsAPI.getPublicSettings();
        if (response.success && response.data) {
          const settings = response.data;
          
          // Site name setup
          if (settings.siteName && settings.siteName.trim() !== '') {
            const nameParts = settings.siteName.trim().split(' ');
            
            setSiteNameMain(nameParts[0]);
            
            if (nameParts.length > 1) {
              setSiteNameTagline(nameParts.slice(1).join(' '));
            } else {
              setSiteNameTagline('');
            }
          }
          
          // Set contact info from settings
          if (settings.contactEmail && settings.contactEmail.trim() !== '') {
            setContactEmail(settings.contactEmail);
          }
          
          if (settings.contactNumber && settings.contactNumber.trim() !== '') {
            setContactNumber(settings.contactNumber);
          }
          
          // Set social media URLs
          if (settings.facebookUrl) setFacebookUrl(settings.facebookUrl);
          if (settings.twitterUrl) setTwitterUrl(settings.twitterUrl);
          if (settings.instagramUrl) setInstagramUrl(settings.instagramUrl);
          if (settings.youtubeUrl) setYoutubeUrl(settings.youtubeUrl);
          if (settings.linkedinUrl) setLinkedinUrl(settings.linkedinUrl);
        }
      } catch (error) {
        console.error('Error loading site settings:', error);
      } finally {
        setIsLoadingContact(false);
      }
    };

    loadSiteSettings();
  }, []);

  const getLogoLines = () => {
    if (!siteNameMain || siteNameMain.trim() === '') {
      return { first: '', second: '' };
    }
    
    if (siteNameMain && siteNameTagline) {
      return { 
        first: siteNameMain, 
        second: siteNameTagline 
      };
    }
    
    const nameParts = siteNameMain.trim().split(' ');
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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsFooterVisible(true);
      } else {
        setIsFooterVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await quickSearchProducts(searchQuery, 5);
        if (response.success) {
          setSearchResults(response.data);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleSearchClick = () => {
    setShowSearch(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleProductClick = (product: SearchProduct) => {
    router.push(`/products/${product.slug}`);
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleViewAllResults = () => {
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  const firstTwoCategories = initialCategories.slice(0, 2);
  const remainingCategories = initialCategories.slice(2);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close search when clicking outside
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
      }
      
      // Close shop dropdown when clicking outside
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(event.target as Node)) {
        setShowShopDropdown(false);
      }
      
      // Close profile dropdown when clicking outside
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      
      // Close mobile menu when clicking outside
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showSearch) {
          setShowSearch(false);
          setSearchQuery('');
          setSearchResults([]);
        }
        if (showShopDropdown) {
          setShowShopDropdown(false);
        }
        if (showDropdown) {
          setShowDropdown(false);
        }
        if (isCartOpen) {
          setIsCartOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showSearch, showShopDropdown, showDropdown, isMobileMenuOpen, isCartOpen]);

  const getCartItemCount = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const cartItemsCount = getCartItemCount();

  return (
    <>
      <div className="xl:sticky xl:top-0 z-40">
        {/* Top Header - White Background */}
        <div className="bg-white border-b border-gray-200 py-1.5 sm:py-2 hidden md:block">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              {/* Left Side - Contact Info */}
              <div className="flex items-center space-x-4 lg:space-x-6">
                {contactNumber && (
                  <a 
                    href={`tel:${contactNumber.replace(/\s/g, '')}`} 
                    className="flex items-center space-x-2 text-xs text-gray-600 hover:text-[#1b4d2b] transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{contactNumber}</span>
                  </a>
                )}
                {contactEmail && (
                  <a 
                    href={`mailto:${contactEmail}`} 
                    className="flex items-center space-x-2 text-xs text-gray-600 hover:text-[#1b4d2b] transition-colors"
                  >
                    <Mail className="w-3 h-3" />
                    <span>{contactEmail}</span>
                  </a>
                )}
              </div>

              {/* Right Side - Social Links */}
              <div className="flex items-center space-x-4">
                <span className="text-xs text-gray-500">Follow us:</span>
              {facebookUrl && (
  <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1b4d2b] transition-colors">
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  </a>
)}
                {twitterUrl && (
                  <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1b4d2b] transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                )}
                {instagramUrl && (
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1b4d2b] transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </a>
                )}
                {youtubeUrl && (
                  <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1b4d2b] transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                )}
                {linkedinUrl && (
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1b4d2b] transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <header className="bg-[#1b4d2b] text-white border-b border-white/20">
          <div className="container mx-auto px-2 sm:px-4 lg:px-6">
            <div className="flex items-center justify-between h-16 sm:h-20 md:h-24 lg:h-20">
              {/* Logo Section - Responsive */}
              <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="xl:hidden p-1.5 sm:p-2 text-white hover:text-[#FFD166] transition-all duration-300 hover:bg-white/10 rounded-xl cursor-pointer"
                  aria-label="Toggle mobile menu"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <Link href="/" className="flex items-center group cursor-pointer">
                  <div className="relative w-15 h-15 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-22 lg:h-20 mt-1 transition-transform duration-200 scale-105">
                    <Image
                      src="/images/logo.png"
                      alt={siteNameMain || 'Logo'}
                      fill
                      priority
                      className="object-contain"
                    />
                  </div>
                  
                  {/* {logoFirstLine && (
                    <div className="flex flex-col justify-center ml-1 sm:ml-2">
                      <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold tracking-tighter leading-none text-white drop-shadow-md">
                        {logoFirstLine}
                      </span>
                      
                      {logoSecondLine && (
                        <div className="flex items-center mt-0.5 ml-3">
                          <span className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-xs font-bold uppercase tracking-wider text-[#FFD166]">
                            {logoSecondLine}
                          </span>
                        </div>
                      )}
                    </div>
                  )} */}
                </Link>
              </div>

              {/* Desktop Navigation - Hidden on mobile */}
              <nav className="hidden xl:flex items-center space-x-4 2xl:space-x-6">
                <Link 
                  href="/" 
                  className="text-white hover:text-[#FFD166] transition-all duration-300 font-medium px-3 py-2 rounded-xl hover:bg-white/10 border-b-2 border-transparent hover:border-[#FFD166]/50 text-sm cursor-pointer"
                >
                  Home
                </Link>
                
                {firstTwoCategories.map((category) => (
                  <Link 
                    key={category._id}
                    href={`/products?category=${category.slug}`}
                    className="text-white hover:text-[#FFD166] transition-all duration-300 font-medium px-3 py-2 rounded-xl hover:bg-white/10 border-b-2 border-transparent hover:border-[#FFD166]/50 text-sm cursor-pointer"
                  >
                    {category.name}
                  </Link>
                ))}
                
                {remainingCategories.length > 0 && (
                  <div ref={shopDropdownRef} className="relative">
                    <button
                      onClick={() => setShowShopDropdown(!showShopDropdown)}
                      className="flex items-center space-x-1 text-white hover:text-[#FFD166] transition-all duration-300 font-medium px-3 py-2 rounded-xl hover:bg-white/10 border-b-2 border-transparent hover:border-[#FFD166]/50 text-sm cursor-pointer"
                    >
                      <span>Products</span>
                      <svg
                        className={`w-3 h-3 transition-transform duration-300 ${showShopDropdown ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {showShopDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-[#1b4d2b] rounded-xl shadow-2xl py-2 z-50 border border-[#FFD166]/30">
                        <div className="px-4 py-2 border-b border-[#FFD166]/30">
                          <p className="text-[#FFD166] font-bold text-xs tracking-wide">Shop Categories</p>
                        </div>
                        
                        {remainingCategories.map((category) => (
                          <Link
                            key={category._id}
                            href={`/products?category=${category.slug}`}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-white hover:bg-white/10 hover:text-[#FFD166] transition-all duration-300 cursor-pointer"
                            onClick={() => setShowShopDropdown(false)}
                          >
                            <svg className="w-3.5 h-3.5 text-[#FFD166]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <span className="text-xs">{category.name}</span>
                          </Link>
                        ))}
                        
                        <Link
                          href="/products"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-white hover:bg-white/10 hover:text-[#FFD166] transition-all duration-300 cursor-pointer border-t border-[#FFD166]/30 mt-1"
                          onClick={() => setShowShopDropdown(false)}
                        >
                          <svg className="w-3.5 h-3.5 text-[#FFD166]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <span className="font-medium text-xs">View All Products</span>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
                
                <Link 
                  href="/about" 
                  className="text-white hover:text-[#FFD166] transition-all duration-300 font-medium px-3 py-2 rounded-xl hover:bg-white/10 border-b-2 border-transparent hover:border-[#FFD166]/50 text-sm cursor-pointer"
                >
                  About
                </Link>
                
                <Link 
                  href="/contact" 
                  className="text-white hover:text-[#FFD166] transition-all duration-300 font-medium px-3 py-2 rounded-xl hover:bg-white/10 border-b-2 border-transparent hover:border-[#FFD166]/50 text-sm cursor-pointer"
                >
                  Contact
                </Link>
              </nav>

              {/* Right Section - Search, Cart, Profile */}
              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
                {/* Search - Desktop & Mobile */}
                <div ref={searchContainerRef} className="relative flex items-center">
                  {showSearch ? (
                    <div className="fixed inset-0 xl:relative xl:inset-auto z-50 flex items-center justify-center xl:block">
                      {/* Mobile Search Overlay */}
                      <div className="xl:hidden fixed inset-0 bg-[#1b4d2b]/95 backdrop-blur-sm pt-16 px-4">
                        <div className="container mx-auto max-w-md">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex-1 flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-[#FFD166]/30">
                              <svg className="w-5 h-5 text-white mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="flex-1 bg-transparent text-white focus:outline-none text-base placeholder-white/60 w-full"
                                autoFocus
                              />
                              {searchQuery && (
                                <button
                                  type="button"
                                  onClick={() => setSearchQuery('')}
                                  className="ml-2 p-1 text-white/70 hover:text-white rounded-full hover:bg-white/10"
                                  aria-label="Clear search"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              )}
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => {
                                setShowSearch(false);
                                setSearchQuery('');
                                setSearchResults([]);
                              }}
                              className="p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 border border-[#FFD166]/30"
                              aria-label="Close search"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>

                          {(searchResults.length > 0 || isSearching) && (
                            <div className="bg-[#1b4d2b] border border-[#FFD166]/30 rounded-xl shadow-2xl max-h-[60vh] overflow-y-auto">
                              {isSearching ? (
                                <div className="p-4 text-center text-white">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FFD166] mx-auto"></div>
                                  <p className="mt-2 text-sm">Searching...</p>
                                </div>
                              ) : (
                                <>
                                  <div className="p-2">
                                    <p className="text-xs text-white/70 font-medium px-2 py-1 border-b border-[#FFD166]/30">Search Results</p>
                                    {searchResults.map((product) => (
                                      <div
                                        key={product._id}
                                        className="flex items-center p-2 hover:bg-white/10 rounded-xl cursor-pointer transition-colors"
                                        onClick={() => handleProductClick(product)}
                                      >
                                        <div className="w-12 h-12 bg-white/10 rounded-xl flex-shrink-0 overflow-hidden border border-[#FFD166]/30 relative">
                                          {product.image ? (
                                            <Image
                                              src={`${process.env.NEXT_PUBLIC_BASE_URL}${product.image}`}
                                              className="w-full h-full object-cover"
                                              alt={product.name}
                                              fill
                                              sizes="48px"
                                            />
                                          ) : (
                                            <div className="w-full h-full bg-white/10 flex items-center justify-center">
                                              <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                              </svg>
                                            </div>
                                          )}
                                        </div>
                                        <div className="ml-3 flex-1 min-w-0">
                                          <p className="text-sm font-medium text-white truncate">{product.name}</p>
                                          <div className="flex items-center justify-between">
                                            <p className="text-xs text-[#FFD166]">{product.category}</p>
                                            <p className="text-white font-medium text-sm">₹{product.basePrice}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div
                                    className="border-t border-[#FFD166]/30 p-3 bg-white/5 hover:bg-white/10 cursor-pointer text-center rounded-b-xl transition-all duration-300"
                                    onClick={handleViewAllResults}
                                  >
                                    <p className="text-sm font-medium text-white hover:text-[#FFD166]">
                                      View all results for &quot;{searchQuery}&quot;
                                    </p>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Desktop Search */}
                      <div className="hidden xl:block absolute top-0 xl:relative w-full max-w-[90vw] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:w-72 2xl:w-80 mx-auto xl:mx-0">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-xl border border-[#FFD166]/30 p-2">
                          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                            <div className="flex-1 flex items-center bg-white/5 rounded-lg px-3 py-1.5 border border-[#FFD166]/30">
                              <svg className="w-4 h-4 text-white/70 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              <input                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="flex-1 bg-transparent text-white focus:outline-none text-sm placeholder-white/60 w-full min-w-0"
                                autoFocus
                              />
                              {searchQuery && (
                                <button
                                  type="button"
                                  onClick={() => setSearchQuery('')}
                                  className="ml-1 p-0.5 text-white/70 hover:text-white rounded-full hover:bg-white/10"
                                  aria-label="Clear search"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          
                            <button
                              type="submit"
                              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 flex items-center justify-center border border-[#FFD166]/30 hover:scale-105 hover:shadow-lg"
                              aria-label="Search"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </button>
                          </form>

                          {(searchResults.length > 0 || isSearching) && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1b4d2b] border border-[#FFD166]/30 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
                              {isSearching ? (
                                <div className="p-4 text-center text-white">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FFD166] mx-auto"></div>
                                  <p className="mt-2 text-sm">Searching...</p>
                                </div>
                              ) : (
                                <>
                                  <div className="p-2">
                                    <p className="text-xs text-white/70 font-medium px-2 py-1 border-b border-[#FFD166]/30">Search Results</p>
                                    {searchResults.map((product) => (
                                      <div
                                        key={product._id}
                                        className="flex items-center p-2 hover:bg-white/10 rounded-xl cursor-pointer transition-colors"
                                        onClick={() => handleProductClick(product)}
                                      >
                                        <div className="w-10 h-10 bg-white/10 rounded-lg flex-shrink-0 overflow-hidden border border-[#FFD166]/30 relative">
                                          {product.image ? (
                                            <Image
                                              src={`${process.env.NEXT_PUBLIC_BASE_URL}${product.image}`}
                                              className="w-full h-full object-cover"
                                              alt={product.name}
                                              fill
                                              sizes="40px"
                                            />
                                          ) : (
                                            <div className="w-full h-full bg-white/10 flex items-center justify-center">
                                              <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                              </svg>
                                            </div>
                                          )}
                                        </div>
                                        <div className="ml-3 flex-1 min-w-0">
                                          <p className="text-sm font-medium text-white truncate">{product.name}</p>
                                          <div className="flex items-center justify-between">
                                            <p className="text-xs text-[#FFD166]">{product.category}</p>
                                            <p className="text-white font-medium text-sm">₹{product.basePrice}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div
                                    className="border-t border-[#FFD166]/30 p-3 bg-white/5 hover:bg-white/10 cursor-pointer text-center rounded-b-xl transition-all duration-300"
                                    onClick={handleViewAllResults}
                                  >
                                    <p className="text-sm font-medium text-white hover:text-[#FFD166]">
                                      View all results for &quot;{searchQuery}&quot;
                                    </p>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={handleSearchClick}
                      className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer"
                      aria-label="Open search"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* Cart Button - Responsive */}
                {!showSearch && (
                  <button
                    onClick={handleOpenCart}
                    className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/15 hover:border-white/30 hover:shadow-xl hover:scale-105 transition-all duration-300 group cursor-pointer"
                    aria-label="Open cart"
                  >
                    <ShoppingCart
                      size={18}
                      strokeWidth={2}
                      className="text-white transition-transform duration-300 group-hover:scale-110 sm:w-5 sm:h-5"
                    />

                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-[#FFD166] text-[#1b4d2b] text-[8px] sm:text-[9px] font-bold shadow-md border border-[#1b4d2b] rounded-full">
                        {cartItemsCount > 9 ? "9+" : cartItemsCount}
                      </span>
                    )}
                  </button>
                )}
                
                {/* Profile Section - Responsive */}
                {!showSearch && (
                  <div className="flex items-center">
                    {user ? (
                      <div ref={profileDropdownRef} className="relative">
                        <button
                          onClick={() => setShowDropdown(!showDropdown)}
                          className="flex items-center space-x-1 sm:space-x-2 text-white hover:text-[#FFD166] transition-all duration-300 hover:bg-white/10 rounded-xl p-1.5 sm:p-2 cursor-pointer"
                        >
                          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-gradient-to-br from-[#FFD166] to-[#FFD166] rounded-full flex items-center justify-center text-[#1b4d2b] font-bold text-xs shadow-lg border border-[#FFD166]/30">
                            {user.email?.charAt(0).toUpperCase()}
                          </div>
                          <span className="hidden lg:block text-white font-medium text-sm">
                            {user.name || user.email?.split('@')[0]}
                          </span>
                          <svg
                            className={`hidden lg:block w-3 h-3 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {showDropdown && (
                          <div className="absolute right-0 mt-2 w-48 bg-[#1b4d2b] rounded-xl shadow-2xl py-2 z-50 border border-[#FFD166]/30">
                            <div className="px-4 py-2 border-b border-[#FFD166]/30">
                              <p className="text-[#FFD166] font-bold text-sm truncate tracking-wide">{user.name || user.email}</p>
                              <p className="text-white/70 text-xs">Welcome back!</p>
                            </div>
                            <Link
                              href="/profile"
                              className="flex items-center space-x-2 px-4 py-2 text-sm text-white hover:bg-white/10 hover:text-[#FFD166] cursor-pointer transition-all duration-300"
                              onClick={() => setShowDropdown(false)}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 0118 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span>My Profile</span>
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 hover:text-[#FFD166] transition-all duration-300 rounded-b-xl cursor-pointer"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              <span>Sign Out</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <Link
                          href="/signup"
                          className="bg-white/10 backdrop-blur-sm text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-white/20 transition-all duration-300 font-medium shadow hover:shadow-lg hover:scale-105 hover:shadow-[#FFD166]/20 text-xs sm:text-sm whitespace-nowrap cursor-pointer min-w-[50px] sm:min-w-[60px] text-center border border-[#FFD166]/30"
                        >
                          Sign Up
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div ref={mobileMenuRef} className="xl:hidden fixed inset-0 z-50">
                <div 
                  className="absolute inset-0 bg-[#1b4d2b]/40 backdrop-blur-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                
                <div className="absolute top-0 left-0 h-full w-72 bg-[#1b4d2b] border-r border-[#FFD166]/30 shadow-2xl">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-[#FFD166]/30">
                      <Link 
                        href="/" 
                        className="flex items-center space-x-2 group cursor-pointer"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="relative w-18 h-18 sm:w-14 sm:h-14">
                          <Image
                            src="/images/logo.png"
                            alt={siteNameMain || 'Logo'}
                            fill
                            className="object-contain "
                          />
                        </div>
{/*                         
                        {logoFirstLine && (
                          <div className="flex flex-col justify-center">
                            <span className="text-sm font-bold tracking-tighter leading-none text-white">
                              {logoFirstLine}
                            </span>
                            {logoSecondLine && (
                              <div className="flex items-center mt-0.5">
                                <span className="text-[8px] font-bold uppercase tracking-wider text-[#FFD166]">
                                  {logoSecondLine}
                                </span>
                              </div>
                            )}
                          </div>
                        )} */}
                      </Link>
                      
                      <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 text-white hover:text-[#FFD166] hover:bg-white/10 transition-all duration-300 rounded-xl cursor-pointer"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <nav className="flex-1 p-4 overflow-y-auto">
                      <div className="space-y-1">
                        <Link 
                          href="/" 
                          className="flex items-center space-x-3 text-white hover:text-[#FFD166] hover:bg-white/10 transition-all duration-300 font-medium p-3 rounded-xl border border-transparent hover:border-[#FFD166]/30 text-sm cursor-pointer"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <span>Home</span>
                        </Link>
                        
                        {initialCategories.map((category) => (
                          <Link
                            key={category._id}
                            href={`/products?category=${category.slug}`}
                            className="flex items-center space-x-3 text-white hover:text-[#FFD166] hover:bg-white/10 transition-all duration-300 font-medium p-3 rounded-xl border border-transparent hover:border-[#FFD166]/30 text-sm cursor-pointer ml-3"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <span>{category.name}</span>
                          </Link>
                        ))}
                        
                        <Link 
                          href="/about" 
                          className="flex items-center space-x-3 text-white hover:text-[#FFD166] hover:bg-white/10 transition-all duration-300 font-medium p-3 rounded-xl border border-transparent hover:border-[#FFD166]/30 text-sm cursor-pointer"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>About</span>
                        </Link>
                        
                        <Link 
                          href="/contact" 
                          className="flex items-center space-x-3 text-white hover:text-[#FFD166] hover:bg-white/10 transition-all duration-300 font-medium p-3 rounded-xl border border-transparent hover:border-[#FFD166]/30 text-sm cursor-pointer"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>Contact</span>
                        </Link>
                      </div>
                    </nav>

                    <div className="p-4 border-t border-[#FFD166]/30">
                      {user ? (
                        <div className="flex items-center space-x-3 p-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-[#FFD166] to-[#FFD166] rounded-full flex items-center justify-center text-[#1b4d2b] font-bold text-sm border border-[#FFD166]/30">
                            {user.email?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium text-sm truncate">{user.name || user.email}</p>
                            <p className="text-[#FFD166] text-xs">View Profile</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <Link
                            href="/login"
                            className="flex-1 text-center bg-white/10 text-white py-2 rounded-xl hover:bg-white/20 transition-all duration-300 text-sm font-medium border border-[#FFD166]/30"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Login
                          </Link>
                          <Link
                            href="/signup"
                            className="flex-1 text-center bg-white/10 text-white py-2 rounded-xl hover:bg-white/20 transition-all duration-300 text-sm font-medium border border-[#FFD166]/30"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Sign Up
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className={`
        fixed bottom-0 left-0 right-0 bg-[#1b4d2b] border-t border-[#FFD166]/30 shadow-2xl z-40
        transition-transform duration-300 ease-in-out
        ${isFooterVisible ? 'translate-y-0' : 'translate-y-full'}
        xl:hidden
      `}>
        <div className="container mx-auto px-2">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link 
              href="/" 
              className="flex flex-col items-center justify-center flex-1 p-1.5 text-white hover:text-[#FFD166] transition-all duration-300 cursor-pointer min-w-0 rounded-xl hover:bg-white/10"
              onClick={() => setIsFooterVisible(false)}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-[10px] sm:text-[11px] font-medium truncate w-full text-center">Home</span>
            </Link>

            <button 
              onClick={handleSearchClick}
              className="flex flex-col items-center justify-center flex-1 p-1.5 text-white hover:text-[#FFD166] transition-all duration-300 cursor-pointer min-w-0 rounded-xl hover:bg-white/10"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-[10px] sm:text-[11px] font-medium truncate w-full text-center">Search</span>
            </button>

            <Link 
              href="/products" 
              className="flex flex-col items-center justify-center flex-1 p-1.5 text-white hover:text-[#FFD166] transition-all duration-300 cursor-pointer min-w-0 rounded-xl hover:bg-white/10"
              onClick={() => setIsFooterVisible(false)}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="text-[10px] sm:text-[11px] font-medium truncate w-full text-center">Products</span>
            </Link>

            <button
              onClick={handleOpenCart}
              className="flex flex-col items-center justify-center flex-1 p-1.5 text-white hover:text-[#FFD166] transition-all duration-300 relative cursor-pointer min-w-0 rounded-xl hover:bg-white/10"
              aria-label="Open cart"
            >
              <div className="relative">
                <ShoppingCart 
                  size={18} 
                  strokeWidth={2}
                  className="mb-0.5 transition-transform duration-300 group-hover:scale-110" 
                />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full bg-[#FFD166] text-[#1b4d2b] text-[8px] font-bold shadow-lg border border-[#1b4d2b]">
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium truncate w-full text-center">Cart</span>
            </button>

            {user ? (
              <Link 
                href="/profile" 
                className="flex flex-col items-center justify-center flex-1 p-1.5 text-white hover:text-[#FFD166] transition-all duration-300 cursor-pointer min-w-0 rounded-xl hover:bg-white/10"
                onClick={() => setIsFooterVisible(false)}
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-[#FFD166] to-[#FFD166] rounded-full flex items-center justify-center text-[#1b4d2b] font-bold text-[8px] sm:text-[9px] mb-0.5 shadow-lg border border-[#FFD166]/30">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium truncate w-full text-center">Account</span>
              </Link>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 p-1.5 min-w-0">
                <div className="flex flex-col items-center">
                  <div className="flex space-x-1">
                    <Link
                      href="/signup"
                      className="px-2 py-1 bg-white/10 text-white text-[9px] sm:text-[10px] font-medium rounded-xl hover:bg-white/20 transition-all duration-300 text-center cursor-pointer border border-[#FFD166]/30"
                      onClick={() => setIsFooterVisible(false)}
                    >
                      Signup
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={handleCloseCart} 
      />
    </>
  );
}