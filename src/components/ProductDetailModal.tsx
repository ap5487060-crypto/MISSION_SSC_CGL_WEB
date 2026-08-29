import React, { useState } from 'react';
import type { Product } from '../types';
import { 
  calcDiscount, 
  FALLBACK_IMG, 
  AMAZON_LOGO, 
  FLIPKART_LOGO,
  typeLabel 
} from '../constants';
import { 
  X, 
  Sparkles, 
  Gift, 
  ShoppingCart, 
  Download, 
  ExternalLink, 
  BookOpen, 
  CheckCircle2, 
  ShieldCheck,
  MessageCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WHATSAPP_SUPPORT_URL, WHATSAPP_SUPPORT_NUMBER } from '../constants';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  isPurchased?: boolean;
  onRecordPurchase?: (product: Product, method: string) => void;
  onOpenPdfReader?: (url: string, title: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  isPurchased = false,
  onRecordPurchase,
  onOpenPdfReader
}) => {
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

  const discount = calcDiscount(product.mrp, product.price);
  const isEbook = product.type === 'ebooks';
  const isFreeEbook = isEbook && product.free !== false;
  const isPaidEbook = isEbook && product.free === false;
  const hasPrice = product.price && parseFloat(product.price) > 0;
  const hasMrp = product.mrp && parseFloat(product.mrp) > 0;

  const paymentLink = product.paymentUrl || (!isFreeEbook ? product.pdf : undefined);
  const downloadLink = product.downloadUrl || (isFreeEbook ? product.pdf : undefined);
  const detailLink = product.landingPageUrl;

  const handleFreeDownload = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 }
      });
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0F2439] border border-amber-500/30 p-6 sm:p-8 shadow-2xl shadow-black">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Cover Image */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-full aspect-[3/4] rounded-2xl bg-[#0A1624] border border-slate-800 p-4 flex items-center justify-center overflow-hidden">
              <img
                src={imgError || !product.img ? FALLBACK_IMG : product.img}
                alt={product.title}
                onError={() => setImgError(true)}
                className="max-h-full max-w-full object-contain rounded-lg drop-shadow-xl"
              />
            </div>
            
            {product.badge && (
              <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                {product.badge}
              </div>
            )}
          </div>

          {/* Details & Actions */}
          <div className="md:col-span-7 flex flex-col">
            
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-md border border-amber-400/20">
                {product.cat || typeLabel(product.type)}
              </span>
              <span className="text-xs text-slate-400">
                {typeLabel(product.type)}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white leading-snug mb-3">
              {product.title}
            </h2>

            {/* Price section */}
            <div className="flex flex-col gap-1 mb-4 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              {isFreeEbook ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-400">FREE</span>
                  <span className="text-xs text-emerald-300">100% Free Study Material</span>
                </div>
              ) : isPaidEbook ? (
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-2xl font-black text-amber-400">₹{product.price}</span>
                    {hasMrp && <span className="text-sm line-through text-slate-400">₹{product.mrp}</span>}
                    {discount > 0 && (
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-red-500/80 text-white">
                        {discount}% OFF
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-teal-300 font-medium">Instant Digital PDF Access</p>
                </div>
              ) : hasPrice ? (
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-2xl font-black text-amber-400">₹{product.price}</span>
                    {hasMrp && <span className="text-sm line-through text-slate-400">₹{product.mrp}</span>}
                    {discount > 0 && (
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-red-500/80 text-white">
                        {discount}% OFF
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-amber-400/80 italic">*price site par thodi vary ho sakti hai</p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  <span className="text-base font-bold text-amber-300">Check Price on Website</span>
                  <p className="text-xs text-slate-400">*Live Deals & Discounts available on Amazon / Flipkart</p>
                </div>
              )}
            </div>

            {/* Description */}
            {product.desc && (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  About this resource
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {product.desc}
                </p>
              </div>
            )}

            {/* CTAs */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800">
              
              {isPurchased ? (
                <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/60 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-black text-emerald-300">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      UNLOCKED IN YOUR STUDENT LIBRARY
                    </span>
                    <span className="text-[10px] text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded font-mono">
                      Verified Access
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(product.downloadUrl || product.pdf) && (
                      <a
                        href={product.downloadUrl || product.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download High-Speed PDF</span>
                      </a>
                    )}

                    {onOpenPdfReader && (product.downloadUrl || product.pdf) && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenPdfReader(product.downloadUrl || product.pdf || '', product.title);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-amber-400" />
                        <span>Read Online Reader</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {detailLink && (
                    <a
                      href={detailLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-600 transition-all"
                    >
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      <span>Open Dedicated Course Page</span>
                    </a>
                  )}

                  {isPaidEbook && paymentLink && (
                    <a
                      href={paymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onRecordPurchase?.(product, 'Online Instant Purchase')}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Instant Purchase {hasPrice ? `— ₹${product.price}` : ''}</span>
                    </a>
                  )}

                  {/* Direct WhatsApp Order / UPI Issue Button for paid or special materials */}
                  {isPaidEbook && (
                    <a
                      href={`${WHATSAPP_SUPPORT_URL}?text=${encodeURIComponent(`Hello Abhishek Sir, I want to purchase "${product.title}" (${hasPrice ? `₹${product.price}` : 'PDF Note'}) directly via WhatsApp / UPI.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onRecordPurchase?.(product, 'WhatsApp Direct Order')}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0F2D1F] hover:bg-[#153D2A] text-emerald-300 hover:text-emerald-200 font-bold text-xs border border-emerald-500/40 transition-all"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>Order on WhatsApp (UPI / Manual Support)</span>
                    </a>
                  )}

                  {isFreeEbook && downloadLink && (
                    <a
                      href={downloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        handleFreeDownload();
                        onRecordPurchase?.(product, 'Free Vault Download');
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Free PDF Now</span>
                    </a>
                  )}
                </>
              )}

              {product.type !== 'ebooks' && (
                <div className="space-y-2 pt-1">
                  {(product.amazon || product.flipkart) ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {product.amazon && (
                        <a
                          href={product.amazon}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#232F3E] hover:bg-[#131A22] text-white border border-slate-700 text-xs font-semibold transition-all"
                        >
                          <img src={AMAZON_LOGO} alt="Amazon" className="h-3.5 filter brightness-0 invert" />
                          <span>Buy on Amazon</span>
                          <ExternalLink className="w-3.5 h-3.5 text-amber-400 ml-auto" />
                        </a>
                      )}
                      {product.flipkart && (
                        <a
                          href={product.flipkart}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#2874F0] hover:bg-[#1259cb] text-white text-xs font-semibold transition-all"
                        >
                          <img src={FLIPKART_LOGO} alt="Flipkart" className="h-3.5 filter brightness-0 invert" />
                          <span>Buy on Flipkart</span>
                          <ExternalLink className="w-3.5 h-3.5 text-yellow-300 ml-auto" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <a
                      href={`${WHATSAPP_SUPPORT_URL}?text=${encodeURIComponent(`Hello Abhishek Sir, I want to purchase "${product.title}" (${hasPrice ? `₹${product.price}` : 'Book'}) directly via WhatsApp.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl btn-neon-amber text-sm font-bold shadow-lg"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Order Paperback Book via WhatsApp</span>
                    </a>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
