import React from 'react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Gift, Sparkles, DownloadCloud } from 'lucide-react';

interface FreeResourcesSectionProps {
  products: Product[];
  onPreview?: (product: Product) => void;
  purchasedProductIds?: string[];
  onRecordPurchase?: (product: Product, method: string) => void;
  onOpenPdfReader?: (url: string, title: string) => void;
}

export const FreeResourcesSection: React.FC<FreeResourcesSectionProps> = ({
  products,
  onPreview,
  purchasedProductIds = [],
  onRecordPurchase,
  onOpenPdfReader
}) => {
  if (products.length === 0) return null;

  return (
    <section id="free-resources" className="py-10 sm:py-14 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      
      {/* Banner Box */}
      <div className="relative rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-900/20 to-slate-900/40 border border-emerald-500/30 p-5 sm:p-7 mb-6 sm:mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Gift className="w-3.5 h-3.5" />
              <span>100% Free For Aspirants</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              Free Study Material & <span className="text-emerald-400">Formula PDFs</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Start your preparation right now without paying a single rupee. Instant one-click PDF downloads.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-emerald-950/60 border border-emerald-500/30 px-4 py-2.5 rounded-xl">
            <DownloadCloud className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-[11px] text-emerald-300 font-medium">Available Free</span>
              <span className="text-base font-black text-white">{products.length} Digital Files</span>
            </div>
          </div>
        </div>
      </div>

      {/* Free Products Grid */}
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
