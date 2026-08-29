import React from 'react';
import type { Product } from '../types';
import { 
  X, 
  Bookmark, 
  Trash2, 
  ExternalLink, 
  Download, 
  Zap, 
  ShoppingBag,
  Sparkles 
} from 'lucide-react';
import { FALLBACK_IMG, calcDiscount } from '../constants';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedProducts: Product[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onPreview: (p: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  savedProducts,
  onRemove,
  onClear,
  onPreview
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#0A1524] border-l border-emerald-500/30 h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-[#070D16] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Saved Study Notes ({savedProducts.length})
              </h3>
              <span className="text-[11px] text-slate-400">Quick Access Bookmarks</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-3">
              <Bookmark className="w-12 h-12 text-slate-700 stroke-[1.5]" />
              <p className="text-sm font-medium text-slate-400">No saved materials yet.</p>
              <p className="text-xs text-slate-500 max-w-xs">
                Click the bookmark icon on any eBook or book card to save it for quick revision.
              </p>
            </div>
          ) : (
            savedProducts.map((p) => {
              const isFree = p.free !== false;
              const directLink = isFree
                ? (p.downloadUrl || p.pdf || p.paymentUrl)
                : (p.paymentUrl || p.landingPageUrl || (p.type !== 'ebooks' ? (p.amazon || p.flipkart) : '') || p.downloadUrl || p.pdf);

              return (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl bg-[#070D16] border border-slate-800 hover:border-slate-700 flex items-center gap-3 group"
                >
                  <img
                    src={p.img || FALLBACK_IMG}
                    alt={p.title}
                    className="w-14 h-16 object-cover rounded-lg bg-slate-900 border border-slate-700 flex-shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                  />

                  <div className="flex-1 min-w-0">
                    <h4 
                      onClick={() => { onPreview(p); onClose(); }}
                      className="text-xs font-bold text-white truncate cursor-pointer hover:text-amber-400"
                    >
                      {p.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {isFree ? (
                        <span className="text-xs font-black text-emerald-400">FREE</span>
                      ) : (
                        <span className="text-xs font-black text-white">₹{p.price}</span>
                      )}
                      <span className="text-[10px] text-slate-500 uppercase">{p.type}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      {directLink && (
                        <a
                          href={directLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold hover:bg-emerald-500/30 flex items-center gap-1"
                        >
                          {isFree ? <Download className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                          <span>{isFree ? 'Download' : 'Access'}</span>
                        </a>
                      )}
                      <button
                        onClick={() => onRemove(p.id)}
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {savedProducts.length > 0 && (
          <div className="p-4 bg-[#070D16] border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={onClear}
              className="text-xs text-red-400 hover:text-red-300 font-medium"
            >
              Clear All Bookmarks
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
