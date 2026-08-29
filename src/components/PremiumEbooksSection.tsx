import React from 'react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';
import { BookOpen, Sparkles } from 'lucide-react';

interface PremiumEbooksSectionProps {
  products: Product[];
  onPreview?: (product: Product) => void;
  purchasedProductIds?: string[];
  onRecordPurchase?: (product: Product, method: string) => void;
  onOpenPdfReader?: (url: string, title: string) => void;
}

export const PremiumEbooksSection: React.FC<PremiumEbooksSectionProps> = ({
  products,
  onPreview,
  purchasedProductIds = [],
  onRecordPurchase,
  onOpenPdfReader
}) => {
  if (products.length === 0) return null;

  return (
    <section id="ebooks" className="py-16 sm:py-20 bg-[#0A1624]/60 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Digital Library</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Premium eBooks & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">Exam Notes</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            Structured, exam-focused digital notes with instant PDF download access directly to your phone or computer.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

      </div>
    </section>
  );
};
