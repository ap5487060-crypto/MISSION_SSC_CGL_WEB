import React from 'react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';

interface FeaturedSectionProps {
  products: Product[];
  onExploreAll: () => void;
  onPreview?: (product: Product) => void;
  purchasedProductIds?: string[];
  onRecordPurchase?: (product: Product, method: string) => void;
  onOpenPdfReader?: (url: string, title: string) => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  products,
  onExploreAll,
  onPreview,
  purchasedProductIds = [],
  onRecordPurchase,
  onOpenPdfReader
}) => {
  if (products.length === 0) return null;

  return (
    <section id="featured" className="py-10 sm:py-14 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Handpicked Highlights</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Featured <span className="text-amber-400">Study Resources</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Highest-rated eBooks, must-have formula sheets and topper-recommended books for SSC CGL.
          </p>
        </div>

        <button
          onClick={onExploreAll}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors group self-start sm:self-auto"
        >
          <span>View all {products.length} featured</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Featured Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onPreview={onPreview}
            isPurchased={purchasedProductIds.includes(product.id)}
            onRecordPurchase={onRecordPurchase}
            onOpenPdfReader={onOpenPdfReader}
          />
        ))}
      </div>
    </section>
  );
};
