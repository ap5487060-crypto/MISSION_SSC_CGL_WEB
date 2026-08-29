import React, { useState } from 'react';
import type { Product } from '../types';
import { 
  calcDiscount, 
  FALLBACK_IMG, 
  AMAZON_LOGO, 
  FLIPKART_LOGO,
  typeLabel,
  WHATSAPP_SUPPORT_URL
} from '../constants';
import { 
  Download, 
  Sparkles, 
  BookOpen, 
  Eye, 
  Gift, 
  Bookmark, 
  Share2, 
  Check,
  Zap,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProductCardProps {
  product: Product;
  onPreview?: (product: Product) => void;
  isSaved?: boolean;
  onToggleSave?: (product: Product) => void;
  isPurchased?: boolean;
  onRecordPurchase?: (product: Product, method: string) => void;
  onOpenPdfReader?: (url: string, title: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onPreview,
  isSaved = false,
  onToggleSave,
  isPurchased = false,
  onRecordPurchase,
  onOpenPdfReader
}) => {
  const [imgError, setImgError] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const discount = calcDiscount(product.mrp, product.price);
  const isEbook = product.type === 'ebooks';
  const isFreeEbook = isEbook && product.free !== false;
  const isPaidEbook = isEbook && product.free === false;
  const hasPrice = product.price && parseFloat(product.price) > 0;
  const hasMrp = product.mrp && parseFloat(product.mrp) > 0;

  // Resolving URLs with backward compatibility
  const paymentLink = product.paymentUrl || (!isFreeEbook ? product.pdf : undefined);
  const downloadLink = product.downloadUrl || (isFreeEbook ? product.pdf : undefined);
  const detailLink = product.landingPageUrl;

  const handleFreeDownload = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#22C55E', '#F59E0B', '#38BDF8', '#FCD34D']
      });
    } catch {
      // Ignored if confetti fails
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = window.location.origin + window.location.pathname + `#product-${product.id}`;
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} on MISSION_SSC_CGL DIGI BOOKS!`,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      className="cyber-card group relative flex flex-col rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/40 bg-[#0B1524] border border-slate-800/90 shadow-md"
    >
      {/* Top Badges / Highlight Strip */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between gap-1.5 pointer-events-none">
        <div className="flex flex-wrap gap-1 pointer-events-auto">
          {product.badge && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-sm flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              {product.badge}
            </span>
          )}
          {product.featured && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40 backdrop-blur-md">
              ⭐ Featured
            </span>
          )}
          {isFreeEbook && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 backdrop-blur-md flex items-center gap-0.5">
              <Gift className="w-2.5 h-2.5 text-emerald-400" />
              Free
            </span>
          )}
        </div>

        {/* Action icons: Save Bookmark & Share */}
        <div className="flex items-center gap-1 pointer-events-auto">
          {onToggleSave && (
            <button
              onClick={() => onToggleSave(product)}
              className={`p-1.5 rounded-lg backdrop-blur-md border transition-all ${
                isSaved
                  ? 'bg-amber-500 text-[#070D16] border-amber-400 shadow-sm'
                  : 'bg-black/60 text-slate-300 hover:text-amber-400 border-white/10 hover:border-amber-400/40'
              }`}
              title={isSaved ? "Remove Bookmark" : "Save Bookmark"}
            >
              <Bookmark className={`w-3 h-3 ${isSaved ? 'fill-[#070D16]' : ''}`} />
            </button>
          )}

          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg bg-black/60 text-slate-300 hover:text-white border border-white/10 hover:border-white/30 backdrop-blur-md transition-all"
            title="Share Material"
          >
            {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Product Image Cover Container - Sleek Portrait Fit */}
      <div 
        onClick={() => onPreview && onPreview(product)}
        className="relative w-full h-48 sm:h-52 bg-gradient-to-b from-[#09121F] to-[#0D1B2D] overflow-hidden flex items-center justify-center p-2.5 cursor-pointer"
      >
        <img
          src={imgError || !product.img ? FALLBACK_IMG : product.img}
          alt={product.title}
          onError={() => setImgError(true)}
          className="h-full max-w-full object-contain rounded drop-shadow-md group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Quick Sample Preview Floating Button */}
        {onPreview && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview(product);
            }}
            className="absolute bottom-2 right-2 z-10 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-emerald-500 text-slate-200 hover:text-[#070D16] border border-slate-700 hover:border-emerald-400 text-[11px] font-bold backdrop-blur-md shadow transition-all opacity-0 group-hover:opacity-100"
            title={isEbook ? "Quick Sample Preview" : "Book Overview & Details"}
          >
            {isEbook ? <Eye className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
            <span>{isEbook ? "Preview" : "Details"}</span>
          </button>
        )}
      </div>

      {/* Product Content Details */}
      <div className="flex-1 flex flex-col p-3 sm:p-3.5">
        
        {/* Category & Type Tag */}
        <div className="flex items-center justify-between gap-1.5 mb-1.5">
          <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-500/20 truncate max-w-[140px]">
            {product.cat || typeLabel(product.type)}
          </span>
          <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
            {typeLabel(product.type)}
          </span>
        </div>

        {/* Product Title */}
        <h3 
          onClick={() => onPreview && onPreview(product)}
          className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug mb-1 cursor-pointer"
          title={product.title}
        >
          {product.title}
        </h3>

        {/* Short Description */}
        {product.desc && (
          <p className="text-[11px] text-slate-400 line-clamp-1 leading-normal mb-2.5">
            {product.desc}
          </p>
        )}

        {/* Price Box */}
        <div className="mt-auto pt-2 pb-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
          {isFreeEbook ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-emerald-400">
                FREE
              </span>
              {hasMrp && (
                <span className="text-[10px] line-through text-slate-500">
                  ₹{product.mrp}
                </span>
              )}
            </div>
          ) : isPaidEbook ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-amber-400">
                ₹{product.price}
              </span>
              {hasMrp && (
                <span className="text-[11px] line-through text-slate-500">
                  ₹{product.mrp}
                </span>
              )}
              {discount > 0 && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-1 py-0.2 rounded border border-emerald-800/40">
                  {discount}% OFF
                </span>
              )}
            </div>
          ) : hasPrice ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-amber-400">
                ₹{product.price}
              </span>
              {hasMrp && (
                <span className="text-[11px] line-through text-slate-500">
                  ₹{product.mrp}
                </span>
              )}
              {discount > 0 && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-1 py-0.2 rounded border border-emerald-800/40">
                  {discount}% OFF
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs font-bold text-amber-300">
              Check Price
            </span>
          )}

          <span className="text-[10px] text-slate-400 font-medium">
            {isFreeEbook ? 'Direct PDF' : isPaidEbook ? 'Instant PDF' : 'Printed Book'}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-1.5">
          
          {/* Detailed Landing Page link if specified */}
          {detailLink && (
            <a
              href={detailLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700/60 transition-all"
            >
              <BookOpen className="w-3 h-3 text-amber-400" />
              <span>Full Details</span>
            </a>
          )}

          {/* If already purchased / unlocked in student library */}
          {isPurchased ? (
            <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold text-emerald-300">
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  UNLOCKED
                </span>
                <span className="text-[9px] text-teal-400 bg-teal-500/20 px-1 rounded">
                  Lifetime
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {(product.downloadUrl || product.pdf) && (
                  <a
                    href={product.downloadUrl || product.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </a>
                )}

                {onOpenPdfReader && (product.downloadUrl || product.pdf) && (
                  <button
                    onClick={() => onOpenPdfReader(product.downloadUrl || product.pdf || '', product.title)}
                    className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                    title="Read Online in Browser"
                  >
                    <BookOpen className="w-3 h-3 text-amber-400" />
                    <span>Read</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Paid eBook Instant Purchase Button */}
              {isPaidEbook && (
                <div className="flex flex-col gap-1">
                  {paymentLink ? (
                    <a
                      href={paymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onRecordPurchase?.(product, 'Online Instant Payment')}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg btn-neon-amber text-xs font-black transition-all"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Buy PDF {hasPrice ? `— ₹${product.price}` : ''}</span>
                    </a>
                  ) : (
                    <a
                      href={`${WHATSAPP_SUPPORT_URL}?text=${encodeURIComponent(`Hello Abhishek Sir, I want to purchase "${product.title}" (${hasPrice ? `₹${product.price}` : 'PDF Note'}).`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onRecordPurchase?.(product, 'WhatsApp Direct Order')}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg btn-neon-amber text-xs font-black transition-all"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Buy Instant Access {hasPrice ? `— ₹${product.price}` : ''}</span>
                    </a>
                  )}

                  <a
                    href={`${WHATSAPP_SUPPORT_URL}?text=${encodeURIComponent(`Hello Abhishek Sir, I want to purchase "${product.title}" (${hasPrice ? `₹${product.price}` : 'PDF'}) directly via WhatsApp / UPI.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onRecordPurchase?.(product, 'WhatsApp Direct Order')}
                    className="w-full flex items-center justify-center gap-1 py-1 px-2 rounded-md bg-[#0A1A12] hover:bg-[#102B1E] text-emerald-300 border border-emerald-500/30 text-[10px] font-medium transition-all"
                    title="UPI Issue / Manual WhatsApp Order"
                  >
                    <MessageCircle className="w-3 h-3 text-emerald-400" />
                    <span>WhatsApp / UPI Order</span>
                  </a>
                </div>
              )}

              {/* Free eBook Instant Download Button */}
              {isFreeEbook && downloadLink && (
                <a
                  href={downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    handleFreeDownload();
                    onRecordPurchase?.(product, 'Free Vault Download');
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg btn-neon-primary text-xs font-black transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Free PDF</span>
                </a>
              )}
            </>
          )}

          {/* Amazon & Flipkart Action Buttons (Physical Books / Stationery ONLY) */}
          {product.type !== 'ebooks' && (product.amazon || product.flipkart) && (
            <div className="grid grid-cols-2 gap-1.5 pt-0.5">
              {product.amazon && (
                <a
                  href={product.amazon}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-[#232F3E] hover:bg-[#131A22] text-white border border-slate-700 text-[11px] font-semibold transition-all"
                  title="Buy Original on Amazon"
                >
                  <img src={AMAZON_LOGO} alt="Amazon" className="h-3 w-auto object-contain filter brightness-0 invert" />
                  <span>Amazon</span>
                  <ExternalLink className="w-2.5 h-2.5 text-amber-400" />
                </a>
              )}

              {product.flipkart && (
                <a
                  href={product.flipkart}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-[#2874F0] hover:bg-[#1259cb] text-white text-[11px] font-semibold transition-all"
                  title="Buy Original on Flipkart"
                >
                  <img src={FLIPKART_LOGO} alt="Flipkart" className="h-3 w-auto object-contain filter brightness-0 invert" />
                  <span>Flipkart</span>
                  <ExternalLink className="w-2.5 h-2.5 text-yellow-300" />
                </a>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
