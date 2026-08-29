import React, { useState } from 'react';
import type { Product } from '../types';
import { 
  X, 
  BookOpen, 
  ExternalLink, 
  Download, 
  Sparkles, 
  Zap, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  MessageCircle,
  ShoppingBag,
  PackageCheck
} from 'lucide-react';
import { 
  calcDiscount, 
  FALLBACK_IMG, 
  WHATSAPP_SUPPORT_URL, 
  AMAZON_LOGO, 
  FLIPKART_LOGO, 
  typeLabel 
} from '../constants';

interface PdfReaderModalProps {
  product: Product | null;
  onClose: () => void;
}

export const PdfReaderModal: React.FC<PdfReaderModalProps> = ({ product, onClose }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalSamplePages = 4;

  if (!product) return null;

  const isEbook = product.type === 'ebooks';
  const isPhysicalBook = product.type !== 'ebooks';
  const isFree = isEbook && product.free !== false;
  const isPaidEbook = isEbook && product.free === false;

  const directLink = isFree
    ? (product.downloadUrl || product.pdf || product.landingPageUrl)
    : isPaidEbook
    ? (product.paymentUrl || product.landingPageUrl || product.downloadUrl || product.pdf)
    : (product.amazon || product.flipkart || product.landingPageUrl);

  const whatsappOrderLink = `${WHATSAPP_SUPPORT_URL}?text=${encodeURIComponent(`Hello Abhishek Sir, I want to purchase "${product.title}" (${product.price ? `₹${product.price}` : 'Book / Note'}) directly via WhatsApp.`)}`;

  const discount = calcDiscount(product.mrp, product.price);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0A1524] border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-[#070D16] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className={`w-8 h-8 rounded-lg p-1 border flex items-center justify-center flex-shrink-0 ${
              isPhysicalBook
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }`}>
              {isPhysicalBook ? <ShoppingBag className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
            </div>
            <div className="truncate">
              <h3 className="text-sm sm:text-base font-bold text-white truncate">
                {product.title}
              </h3>
              <span className={`text-[11px] font-medium ${isPhysicalBook ? 'text-amber-400' : 'text-emerald-400'}`}>
                {isPhysicalBook 
                  ? 'Official Printed Paperback Book (Order via Amazon / Flipkart)' 
                  : isFree 
                  ? '100% Free Aspirant PDF Note' 
                  : 'Verified Digital Study eBook (Instant PDF)'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Sample Pages / Book Specs Viewer */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#070D16]/50">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Sample Content / Specification */}
            <div className="md:col-span-7 bg-[#070D16] border border-slate-800 rounded-xl p-5 shadow-inner">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs text-slate-400">
                <span className="font-mono text-emerald-400">
                  {isPhysicalBook ? `Book Overview Section ${currentPage} of ${totalSamplePages}` : `Sample Page ${currentPage} of ${totalSamplePages}`}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalSamplePages, p + 1))}
                    disabled={currentPage === totalSamplePages}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Physical Book Specifications */}
              {isPhysicalBook ? (
                <>
                  {currentPage === 1 && (
                    <div className="space-y-3 font-sans text-xs text-slate-300 leading-relaxed min-h-[260px]">
                      <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-300 font-bold text-center flex items-center justify-center gap-1.5">
                        <ShoppingBag className="w-4 h-4 text-amber-400" />
                        <span>Official Paperback Edition Details</span>
                      </div>
                      <p className="text-slate-300">
                        {product.desc || 'Complete comprehensive physical book curated for SSC CGL, CHSL, CPO, and other government competitive examinations.'}
                      </p>
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2 text-slate-300">
                        <div className="flex justify-between border-b border-slate-800 pb-1">
                          <span className="text-slate-400">Edition Format:</span>
                          <span className="font-semibold text-white">Authentic Paperback / Hardcopy</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-1">
                          <span className="text-slate-400">Exam Relevance:</span>
                          <span className="font-semibold text-emerald-400">SSC CGL 2026 / CHSL / CPO</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Language:</span>
                          <span className="font-semibold text-amber-300">Bilingual (English & Hindi)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentPage === 2 && (
                    <div className="space-y-3 font-sans text-xs text-slate-300 leading-relaxed min-h-[260px]">
                      <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 font-bold">
                        🎯 TCS Pattern & Question Bank
                      </div>
                      <p className="text-slate-300">
                        Covers all latest question types asked by TCS in SSC CGL Tier 1 & Tier 2 exams with detailed step-by-step solutions and shortcut approaches.
                      </p>
                      <ul className="space-y-2 text-slate-300">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>Topic-wise classification with chapter breakdown</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>Complete solved papers with error-free explanations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>High-speed calculation shortcuts and mnemonic memory aids</span>
                        </li>
                      </ul>
                    </div>
                  )}

                  {currentPage === 3 && (
                    <div className="space-y-3 font-sans text-xs text-slate-300 leading-relaxed min-h-[260px]">
                      <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-cyan-300 font-bold">
                        🏆 Topper Recommended
                      </div>
                      <p className="text-slate-300">
                        This book is widely recommended by top rankers (AIR 1 - 100) for comprehensive concept building and rigorous self-practice.
                      </p>
                      <div className="p-3 rounded-lg bg-[#0A1524] border border-slate-800 text-[11px] text-slate-400">
                        Designed for both self-study aspirants and classroom students aiming for 160+ in Tier 1 and 330+ in Tier 2.
                      </div>
                    </div>
                  )}

                  {currentPage === 4 && (
                    <div className="space-y-3 font-sans text-xs text-slate-300 leading-relaxed min-h-[260px]">
                      <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-500/30 text-purple-300 font-bold flex items-center gap-1.5">
                        <PackageCheck className="w-4 h-4 text-purple-400" />
                        <span>Genuine Delivery & Partner Buying</span>
                      </div>
                      <p className="text-slate-300">
                        Purchase the 100% authentic original edition from official Amazon and Flipkart partner stores for fast doorstep delivery.
                      </p>
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-amber-300">
                        Note: This is a printed physical paperback edition shipped directly to your address.
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Digital PDF eBook simulator */
                <>
                  {currentPage === 1 && (
                    <div className="space-y-3 font-sans text-xs text-slate-300 leading-relaxed min-h-[260px]">
                      <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 font-bold text-center">
                        📖 Table of Contents & Structure
                      </div>
                      <ul className="space-y-1.5 text-slate-300 text-xs">
                        <li className="flex items-center justify-between py-1 border-b border-slate-800/80">
                          <span>• Chapter 01: Core Concepts & Formulas</span>
                          <span className="text-slate-500">Page 01 - 24</span>
                        </li>
                        <li className="flex items-center justify-between py-1 border-b border-slate-800/80">
                          <span>• Chapter 02: 5-Second Shortcut Tricks</span>
                          <span className="text-slate-500">Page 25 - 58</span>
                        </li>
                        <li className="flex items-center justify-between py-1 border-b border-slate-800/80">
                          <span>• Chapter 03: TCS 5-Year Solved PYQs</span>
                          <span className="text-slate-500">Page 59 - 140</span>
                        </li>
                        <li className="flex items-center justify-between py-1 border-b border-slate-800/80">
                          <span>• Chapter 04: Tier 2 Advanced Practice Mock</span>
                          <span className="text-slate-500">Page 141 - 180</span>
                        </li>
                      </ul>
                    </div>
                  )}

                  {currentPage === 2 && (
                    <div className="space-y-3 font-sans text-xs text-slate-300 leading-relaxed min-h-[260px]">
                      <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-amber-300 font-bold">
                        💡 Sample High-Yield Concept & Trick
                      </div>
                      <div className="p-3 rounded-lg bg-[#0A1524] border border-slate-800 font-mono text-[11px] text-emerald-300">
                        Q: If a + 1/a = 3, find the value of a⁴ + 1/a⁴.<br/><br/>
                        Shortcut Formula:<br/>
                        • a² + 1/a² = 3² - 2 = 7<br/>
                        • a⁴ + 1/a⁴ = 7² - 2 = 47 (Direct 3-Second Answer)
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Every concept in this edition includes step-by-step shortcuts and common pitfalls to avoid during Tier 1 & 2 exams.
                      </p>
                    </div>
                  )}

                  {currentPage === 3 && (
                    <div className="space-y-3 font-sans text-xs text-slate-300 leading-relaxed min-h-[260px]">
                      <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/30 text-cyan-300 font-bold">
                        🎯 Practice Question Bank
                      </div>
                      <p className="text-slate-300">
                        Includes 500+ curated Tier 1 & Tier 2 exam-level questions with detailed explanations, multi-lingual Hindi & English notes, and difficulty ratings.
                      </p>
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                        [Preview Summary] — Complete digital eBook delivered instantly.
                      </div>
                    </div>
                  )}

                  {currentPage === 4 && (
                    <div className="space-y-3 font-sans text-xs text-slate-300 leading-relaxed min-h-[260px]">
                      <div className="p-2.5 rounded-lg bg-purple-950/20 border border-purple-500/30 text-purple-300 font-bold">
                        ✨ Study Guide & Revision Schedule
                      </div>
                      <p className="text-slate-300">
                        Recommended 30-day revision blueprint by Abhishek Prajapati to complete and master this entire module before exam day.
                      </p>
                    </div>
                  )}
                </>
              )}

            </div>

            {/* Right Column: Product Overview & Buy / Download Button */}
            <div className="md:col-span-5 space-y-4">
              <div className="cyber-card rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={product.img || FALLBACK_IMG}
                    alt={product.title}
                    className="w-16 h-20 object-contain rounded-lg border border-slate-700 bg-slate-900 flex-shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white leading-snug">
                      {product.title}
                    </h4>
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                      {product.badge || (isPhysicalBook ? 'Paperback Book' : 'Digital PDF')}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-3">
                  {product.desc || 'Comprehensive syllabus-aligned study material for SSC CGL aspirants.'}
                </p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    {isFree ? (
                      <span className="text-base font-black text-emerald-400">100% FREE</span>
                    ) : product.price && parseFloat(product.price) > 0 ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-white">₹{product.price}</span>
                        {product.mrp && <span className="text-xs text-slate-500 line-through">₹{product.mrp}</span>}
                        {discount > 0 && <span className="text-xs text-emerald-400 font-bold">{discount}% OFF</span>}
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-amber-400">Check Price on Partner</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isPhysicalBook ? 'Doorstep Delivery' : 'Instant PDF'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Tailored for Physical Book vs Paid Ebook vs Free Ebook */}
              <div className="flex flex-col gap-2">
                {isPhysicalBook ? (
                  /* Physical Book Amazon & Flipkart buying options */
                  <div className="space-y-2">
                    {product.amazon && (
                      <a
                        href={product.amazon}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#232F3E] hover:bg-[#131A22] text-white border border-slate-700 text-sm font-bold shadow-md transition-all"
                      >
                        <img src={AMAZON_LOGO} alt="Amazon" className="h-4 filter brightness-0 invert" />
                        <span>Order on Amazon</span>
                        <ExternalLink className="w-3.5 h-3.5 text-amber-400 ml-auto" />
                      </a>
                    )}

                    {product.flipkart && (
                      <a
                        href={product.flipkart}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#2874F0] hover:bg-[#1259cb] text-white text-sm font-bold shadow-md transition-all"
                      >
                        <img src={FLIPKART_LOGO} alt="Flipkart" className="h-4 filter brightness-0 invert" />
                        <span>Order on Flipkart</span>
                        <ExternalLink className="w-3.5 h-3.5 text-yellow-300 ml-auto" />
                      </a>
                    )}

                    {!product.amazon && !product.flipkart && (
                      <a
                        href={whatsappOrderLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl btn-neon-amber text-sm font-bold shadow-lg"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Order Authentic Hardcopy</span>
                      </a>
                    )}

                    <a
                      href={whatsappOrderLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#0A1A12] hover:bg-[#102B1E] text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all text-center"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Inquire on WhatsApp</span>
                    </a>
                  </div>
                ) : isPaidEbook ? (
                  /* Paid E-Book Instant Purchase */
                  <div className="space-y-2">
                    {directLink ? (
                      <a
                        href={directLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl btn-neon-amber text-sm font-bold shadow-lg transition-all"
                      >
                        <Zap className="w-4 h-4" />
                        <span>Buy Instant PDF {product.price ? `(₹${product.price})` : ''}</span>
                        <ExternalLink className="w-3.5 h-3.5 ml-1" />
                      </a>
                    ) : (
                      <a
                        href={whatsappOrderLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl btn-neon-amber text-sm font-bold shadow-lg transition-all"
                      >
                        <Zap className="w-4 h-4" />
                        <span>Buy Instant Access {product.price ? `(₹${product.price})` : ''}</span>
                        <ExternalLink className="w-3.5 h-3.5 ml-1" />
                      </a>
                    )}

                    <a
                      href={whatsappOrderLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#0A1A12] hover:bg-[#102B1E] text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all text-center"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Order via WhatsApp / UPI Direct</span>
                    </a>
                  </div>
                ) : (
                  /* Free E-Book Instant Download */
                  <div className="space-y-2">
                    <a
                      href={directLink || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl btn-neon-primary text-sm font-bold shadow-lg transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Free PDF Note</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </a>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
