import React, { useState, useMemo, useEffect } from 'react';
import type { Product, ProductType } from '../types';
import { ProductCard } from './ProductCard';
import { 
  Search, 
  Layers, 
  BookOpen, 
  Sparkles, 
  FileText, 
  PenTool, 
  Filter, 
  X, 
  ArrowUpDown,
  ShoppingBag,
  Gift
} from 'lucide-react';

interface BrowseAllSectionProps {
  products: Product[];
  searchInputRef?: React.RefObject<HTMLInputElement>;
  onPreview?: (product: Product) => void;
  savedIds?: string[];
  onToggleSave?: (product: Product) => void;
  purchasedProductIds?: string[];
  onRecordPurchase?: (product: Product, method: string) => void;
  onOpenPdfReader?: (url: string, title: string) => void;
  defaultType?: ProductType;
  defaultFreeOnly?: boolean;
  title?: string;
  subtitle?: string;
}

export const BrowseAllSection: React.FC<BrowseAllSectionProps> = ({
  products,
  searchInputRef,
  onPreview,
  savedIds = [],
  onToggleSave,
  purchasedProductIds = [],
  onRecordPurchase,
  onOpenPdfReader,
  defaultType = 'all',
  defaultFreeOnly = false,
  title,
  subtitle
}) => {
  const [selectedType, setSelectedType] = useState<ProductType>(defaultType);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'discount'>('default');
  const [freeOnly, setFreeOnly] = useState<boolean>(defaultFreeOnly);

  useEffect(() => {
    setSelectedType(defaultType);
  }, [defaultType]);

  useEffect(() => {
    setFreeOnly(defaultFreeOnly);
  }, [defaultFreeOnly]);

  // Extract all unique categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.cat && p.cat.trim()) {
        set.add(p.cat.trim());
      }
    });
    return Array.from(set).sort();
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Type filter
      if (selectedType !== 'all' && p.type !== selectedType) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && p.cat?.trim().toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Free only filter
      if (freeOnly && (p.type !== 'ebooks' || p.free === false)) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = p.title?.toLowerCase().includes(q);
        const descMatch = p.desc?.toLowerCase().includes(q);
        const catMatch = p.cat?.toLowerCase().includes(q);
        const badgeMatch = p.badge?.toLowerCase().includes(q);
        if (!titleMatch && !descMatch && !catMatch && !badgeMatch) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const priceA = parseFloat(a.price || '0');
      const priceB = parseFloat(b.price || '0');
      const mrpA = parseFloat(a.mrp || '0');
      const mrpB = parseFloat(b.mrp || '0');
      const discA = mrpA > priceA ? ((mrpA - priceA) / mrpA) * 100 : 0;
      const discB = mrpB > priceB ? ((mrpB - priceB) / mrpB) * 100 : 0;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'discount') return discB - discA;
      return 0; // Default order
    });
  }, [products, selectedType, selectedCategory, freeOnly, searchQuery, sortBy]);

  const clearAllFilters = () => {
    setSelectedType('all');
    setSelectedCategory('all');
    setSearchQuery('');
    setFreeOnly(false);
    setSortBy('default');
  };

  const hasActiveFilters = selectedType !== defaultType || selectedCategory !== 'all' || freeOnly !== defaultFreeOnly || searchQuery.trim() !== '' || sortBy !== 'default';

  return (
    <section id="catalog" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3 neon-glow-green">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>Curated Digital & Hardcopy Library</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-['Outfit',sans-serif]">
          {title || (
            <>
              Explore All SSC CGL <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">Books & Resources</span>
            </>
          )}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          {subtitle || 'Filter by format, subject category, or search directly for your target exam topic.'}
        </p>
      </div>

      {/* Main Filter Control Box */}
      <div className="cyber-card rounded-2xl p-4 sm:p-6 mb-8 space-y-4">
        
        {/* Search Bar & Sort Dropdown */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by book title, subject, formula, author..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#070D16] border border-slate-700/80 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 transition-colors"
              id="catalog-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                title="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Option */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:flex-initial">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="w-full md:w-auto appearance-none pl-9 pr-8 py-2.5 rounded-xl bg-[#070D16] border border-slate-700/80 text-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-400 cursor-pointer"
                id="catalog-sort-select"
              >
                <option value="default">Sort: Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount">Highest Discount</option>
              </select>
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-400 pointer-events-none" />
            </div>

            {/* Free Only Toggle Pill */}
            <button
              onClick={() => setFreeOnly(!freeOnly)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                freeOnly 
                  ? 'bg-emerald-500 text-[#070D16] border-emerald-400 shadow-md shadow-emerald-500/20' 
                  : 'bg-[#070D16] text-slate-300 border-slate-700 hover:border-emerald-500/50 hover:text-emerald-300'
              }`}
              id="filter-free-toggle"
            >
              <span>🆓 Free Only</span>
            </button>
          </div>

        </div>

        {/* Primary Type Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedType('all')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedType === 'all'
                ? 'bg-gradient-to-r from-emerald-500 to-lime-500 text-[#070D16] border-emerald-400 shadow-md'
                : 'bg-[#070D16] text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Formats ({products.length})</span>
          </button>

          <button
            onClick={() => setSelectedType('ebooks')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedType === 'ebooks'
                ? 'bg-gradient-to-r from-emerald-500 to-lime-500 text-[#070D16] border-emerald-400 shadow-md'
                : 'bg-[#070D16] text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span>📱 Digital eBooks / PDFs</span>
          </button>

          <button
            onClick={() => setSelectedType('books')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedType === 'books'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-[#070D16] border-amber-400 shadow-md'
                : 'bg-[#070D16] text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>📚 Printed Books</span>
          </button>

          <button
            onClick={() => setSelectedType('stationery')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedType === 'stationery'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-[#070D16] border-emerald-400 shadow-md'
                : 'bg-[#070D16] text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <PenTool className="w-3.5 h-3.5 text-cyan-400" />
            <span>📒 Study Kits & Notes</span>
          </button>
        </div>

        {/* Dynamic Category Pills */}
        {categories.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0 flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3 text-amber-400" />
              Subject:
            </span>

            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              All Subjects
            </button>

            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Result Count & Clear Filters Indicator */}
      <div className="flex items-center justify-between gap-4 mb-6 px-1">
        <span className="text-xs sm:text-sm font-semibold text-slate-400">
          Showing <span className="text-white font-bold">{filteredProducts.length}</span> of {products.length} study items
        </span>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onPreview={onPreview}
              isSaved={savedIds.includes(product.id)}
              onToggleSave={onToggleSave}
              isPurchased={purchasedProductIds.includes(product.id)}
              onRecordPurchase={onRecordPurchase}
              onOpenPdfReader={onOpenPdfReader}
            />
          ))}
        </div>
      ) : (
        /* Clean Empty State */
        <div className="text-center py-16 px-4 rounded-3xl bg-[#0F1D31]/40 border border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
            No Study Resources Found
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
            We couldn't find any resources matching your search criteria or category filter. Try clearing filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-5 py-2.5 rounded-xl btn-neon-amber text-xs font-black shadow-md transition-all"
          >
            Clear Filters & View All
          </button>
        </div>
      )}

    </section>
  );
};
