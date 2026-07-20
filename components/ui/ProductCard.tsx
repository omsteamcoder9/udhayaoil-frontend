// src/components/ProductCard.tsx
import { Product } from '@/types/product';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

// Format price with commas
const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// ============= OFFER LOGIC - WORKS FOR BOTH PRODUCT AND VARIANTS =============
const getProductOfferInfo = (product: Product) => {
  
  // 🎯 CASE 1: PRODUCT HAS VARIANTS - Check default variant for offer
  if (product.variants && product.variants.length > 0) {
    // Get default variant or first variant
    const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
    
    // ✅ Check if variant has originalPrice AND it's greater than price
    if (defaultVariant.originalPrice && 
        defaultVariant.price && 
        parseFloat(defaultVariant.originalPrice.toString()) > parseFloat(defaultVariant.price.toString())) {
      
      const original = parseFloat(defaultVariant.originalPrice.toString());
      const discounted = parseFloat(defaultVariant.price.toString());
      const discountPercentage = defaultVariant.discountPercentage || 
        ((original - discounted) / original) * 100;
      
      return {
        hasOffer: true,
        originalPrice: original,
        discountedPrice: discounted,
        discountPercentage: Math.round(discountPercentage * 100) / 100
      };
    }
    
    // No offer on default variant
    return {
      hasOffer: false,
      originalPrice: parseFloat(defaultVariant.price.toString()),
      discountedPrice: parseFloat(defaultVariant.price.toString()),
      discountPercentage: 0
    };
  }
  
  // 🎯 CASE 2: NO VARIANTS - Check product-level offer
  if (product.hasOffer && 
      product.originalPrice && 
      product.basePrice &&
      parseFloat(product.originalPrice.toString()) > parseFloat(product.basePrice.toString())) {
    
    const original = parseFloat(product.originalPrice.toString());
    const discounted = parseFloat(product.basePrice.toString());
    const discountPercentage = product.discountPercentage || 
      ((original - discounted) / original) * 100;
    
    return {
      hasOffer: true,
      originalPrice: original,
      discountedPrice: discounted,
      discountPercentage: Math.round(discountPercentage * 100) / 100
    };
  }
  
  // No offer
  return {
    hasOffer: false,
    originalPrice: parseFloat(product.basePrice?.toString() || '0'),
    discountedPrice: parseFloat(product.basePrice?.toString() || '0'),
    discountPercentage: 0
  };
};

// Get product image - prioritize variant images
const getProductImage = (product: Product) => {
  // Check variants first
  if (product.variants && product.variants.length > 0) {
    const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
    
    if (defaultVariant?.images?.[0]?.image) {
      return `${process.env.NEXT_PUBLIC_BASE_URL}${defaultVariant.images[0].image}`;
    }
  }
  
  // Fallback to main product images
  if (product.images?.[0]?.image) {
    return `${process.env.NEXT_PUBLIC_BASE_URL}${product.images[0].image}`;
  }
  
  return '/placeholder-image.jpg';
};

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const { addToCart, cart } = useCart();
  const router = useRouter();

  // ✅ Get offer info - THIS WILL SHOW OFFER BADGE FOR VARIANTS
  const offerInfo = getProductOfferInfo(product);
  const hasValidOffer = offerInfo.hasOffer && offerInfo.originalPrice > offerInfo.discountedPrice;
  
  const isInCart = cart?.items?.some(item => item.product._id === product._id) || false;
  const isOutOfStock = product.stock <= 0;
  const imageUrl = getProductImage(product);

  const handleCardClick = () => {
    router.push(`/products/${product.slug}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // ✅ Get the default variant if product has variants
      const defaultVariant = product.variants && product.variants.length > 0
        ? product.variants.find(v => v.isDefault) || product.variants[0]
        : undefined;
      
      // ✅ Pass the variant to addToCart
      await addToCart(product, 1, defaultVariant);
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer border border-gray-100/50 hover:border-[#1b4d2b]/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Cart Status Badge */}
      {isInCart && (
        <div className="absolute top-3 right-3 z-20 bg-[#1b4d2b] text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shadow-lg shadow-[#1b4d2b]/30 animate-bounce">
          ✓
        </div>
      )}


      {/* Image Section */}
      <div className="relative p-4 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <div className="relative w-full aspect-square bg-white/50 flex items-center justify-center overflow-hidden rounded-xl">
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain transition-all duration-300"
              onError={() => setImageError(true)}
              priority={false}
              loading="lazy"
            />
          </div>

          {/* Image Error Fallback */}
          {imageError && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <svg className="w-12 h-12 sm:w-14 sm:h-14 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Offer Badge - Floating */}
          {hasValidOffer && (
            <div className="absolute top-2 right-2 bg-[#FFD166] text-[#1b4d2b] px-2.5 py-1 rounded-full text-xs font-bold shadow-lg shadow-[#FFD166]/40 animate-pulse">
              {Math.round(offerInfo.discountPercentage)}% OFF
            </div>
          )}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-4 pt-3">
        {/* Product Name */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm sm:text-base leading-tight hover:text-[#1b4d2b] transition-colors duration-300">
            {product.name}
          </h3>
        </div>
        
        {/* Price Section */}
        <div className="flex items-end justify-between mb-3">
          <div className="flex items-baseline gap-2">
            {/* Discounted Price */}
            <span className="text-lg font-bold text-[#1b4d2b]">
              ₹{formatPrice(offerInfo.discountedPrice)}
            </span>
            
            {/* Original Price with Strikethrough */}
            {hasValidOffer && (
              <span className="text-xs text-gray-400 line-through">
                ₹{formatPrice(offerInfo.originalPrice)}
              </span>
            )}
          </div>
          
          {/* Stock Status */}
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${!isOutOfStock ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className={`text-xs font-medium ${!isOutOfStock ? 'text-green-600' : 'text-red-600'}`}>
              {!isOutOfStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>

        {/* Add to Cart Button - Premium Style */}
        <button 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="w-full py-2.5 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-[#1b4d2b] to-[#2d7a4a] text-white hover:shadow-lg hover:shadow-[#1b4d2b]/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer disabled:hover:scale-100 text-sm"
        >
          <ShoppingBag size={16} className="transition-transform duration-300 group-hover:scale-110" />
          <span>
            {!isOutOfStock ? 'Add to Cart' : 'Out of Stock'}
          </span>
        </button>
      </div>
    </div>
  );
}