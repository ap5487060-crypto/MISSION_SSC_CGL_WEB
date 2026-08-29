import React from 'react';
import { 
  BRAND_NAME, 
  BRAND_TAGLINE, 
  BRAND_MOTTO_TOP,
  BRAND_MOTTO_BOTTOM,
  AUTHOR_NAME, 
  INSTAGRAM_HANDLE,
  TELEGRAM_HANDLE,
  CONTACT_EMAIL,
  AFFILIATE_DISCLOSURE_EN,
  AMAZON_LOGO,
  FLIPKART_LOGO
} from '../constants';
import { 
  ArrowUp, 
  ShieldCheck, 
  Sparkles, 
  Heart,
  Lock,
  ExternalLink,
  BookOpen,
  Instagram,
  Send,
  Mail,
  Zap,
  Target,
  MessageCircle,
  FileText,
  RefreshCcw,
  Truck,
  AlertCircle
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import type { User } from 'firebase/auth';
import { WHATSAPP_SUPPORT_URL, WHATSAPP_SUPPORT_NUMBER } from '../constants';
import type { PolicyTab } from './LegalPoliciesModal';

interface FooterProps {
  user: User | null;
  onOpenAdminLogin: () => void;
  onOpenAdminPanel: () => void;
  onNavigateTab?: (tab: string) => void;
  onOpenLegalPolicy?: (tab: PolicyTab) => void;
}

export const Footer: React.FC<FooterProps> = ({
  user,
  onOpenAdminLogin,
  onOpenAdminPanel,
  onNavigateTab,
  onOpenLegalPolicy
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabClick = (tabId: string) => {
    if (onNavigateTab) {
      onNavigateTab(tabId);
    }
    scrollToTop();
  };

  const handlePolicyClick = (policyTab: PolicyTab) => {
    if (onOpenLegalPolicy) {
      onOpenLegalPolicy(policyTab);
    }
  };

  return (
    <footer className="bg-[#050A12] border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand Info & Motto */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo size="md" showText={true} />

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your premier digital education store for SSC CGL Tier 1 & Tier 2 exam study notes, formula handbooks, PYQs, and authentic publisher-recommended books.
            </p>

            <div className="p-3 rounded-xl bg-[#08111D] border border-slate-800/80 text-[11px] text-slate-300 space-y-1">
              <div className="text-emerald-400 font-bold">★ {BRAND_MOTTO_TOP} ★</div>
              <div className="text-amber-400 font-semibold">{BRAND_MOTTO_BOTTOM}</div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 text-slate-200 border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800 text-xs transition-colors"
                title="Email Support"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-emerald-300">{CONTACT_EMAIL}</span>
              </a>

              <a
                href={`${WHATSAPP_SUPPORT_URL}?text=${encodeURIComponent('Hello Abhishek Sir, I need assistance regarding MISSION_SSC_CGL study materials.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#092B1D] text-emerald-300 border border-emerald-500/40 hover:bg-[#0E3D29] text-xs font-bold transition-colors"
                title="WhatsApp Direct Support"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp: {WHATSAPP_SUPPORT_NUMBER}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Tabs Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-['Outfit',sans-serif]">
              Study Material Store
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleTabClick('home')} className="hover:text-emerald-400 transition-colors text-left">
                  🏠 Home & Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleTabClick('ebooks')} className="hover:text-emerald-400 transition-colors text-left">
                  📱 Digital eBooks & Notes Store
                </button>
              </li>
              <li>
                <button onClick={() => handleTabClick('free-vault')} className="hover:text-emerald-400 transition-colors text-left">
                  🆓 Free Aspirant Vault (PYQs & Sheets)
                </button>
              </li>
              <li>
                <button onClick={() => handleTabClick('store')} className="hover:text-emerald-400 transition-colors text-left">
                  📚 Printed Books & Stationery
                </button>
              </li>
              <li>
                <button onClick={() => handleTabClick('syllabus-planner')} className="hover:text-emerald-400 transition-colors text-left">
                  🎯 SSC CGL Syllabus Tracker
                </button>
              </li>
              <li>
                <button onClick={() => handleTabClick('formula-hub')} className="hover:text-emerald-400 transition-colors text-left">
                  ⚡ Formula & Shortcut Cheatsheets
                </button>
              </li>
              <li>
                <button onClick={() => handleTabClick('flashcards')} className="hover:text-emerald-400 transition-colors text-left">
                  🃏 Flashcards Revision Deck (Maths & English)
                </button>
              </li>
              <li>
                <button onClick={() => handleTabClick('about')} className="hover:text-emerald-400 transition-colors text-left">
                  📖 About MISSION_SSC_CGL
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Aspirant Protection Policies */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-['Outfit',sans-serif]">
              Legal & Student Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => handlePolicyClick('privacy')}
                  className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors text-left"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Privacy Policy (गोपनीयता नीति)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePolicyClick('terms')}
                  className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors text-left"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Terms & Conditions (नियम व शर्तें)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePolicyClick('refund')}
                  className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors text-left"
                >
                  <RefreshCcw className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Refund & Cancellation Policy</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePolicyClick('delivery')}
                  className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors text-left"
                >
                  <Truck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Shipping & Delivery Policy</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePolicyClick('disclaimer')}
                  className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors text-left"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Disclaimer & Copyright Notice</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePolicyClick('contact')}
                  className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors text-left"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Contact Us & Grievance Officer</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Portal Management & Security */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-['Outfit',sans-serif]">
              Security & Portal
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Authorized admin portal for inventory & digital study notes.
            </p>

            <div className="pt-1">
              {user ? (
                <button
                  onClick={onOpenAdminPanel}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-bold transition-all shadow-md shadow-amber-500/10 w-full justify-center"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </button>
              ) : (
                <button
                  onClick={onOpenAdminLogin}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#08111D] hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700 transition-all w-full justify-center"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Sign In</span>
                </button>
              )}
            </div>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>256-bit SSL Encrypted & Razorpay Verified</span>
            </div>
          </div>

        </div>

        {/* Affiliate Disclosure Section in Pristine English */}
        <div className="py-8 border-b border-slate-800/80">
          <div className="rounded-2xl bg-[#08111D] border border-slate-800 p-5 sm:p-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider font-['Outfit',sans-serif]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Amazon & Flipkart Affiliate Disclosure</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              {AFFILIATE_DISCLOSURE_EN}
            </p>
          </div>
        </div>

        {/* Bottom Bar with Policy Links */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} <strong className="text-slate-200 font-semibold">{BRAND_NAME}</strong>. All Rights Reserved.
          </div>

          {/* Quick Legal Pill Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400">
            <button onClick={() => handlePolicyClick('privacy')} className="hover:text-emerald-400 underline decoration-slate-700">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => handlePolicyClick('terms')} className="hover:text-emerald-400 underline decoration-slate-700">Terms & Conditions</button>
            <span>•</span>
            <button onClick={() => handlePolicyClick('refund')} className="hover:text-emerald-400 underline decoration-slate-700">Refund Policy</button>
            <span>•</span>
            <button onClick={() => handlePolicyClick('delivery')} className="hover:text-emerald-400 underline decoration-slate-700">Delivery Policy</button>
            <span>•</span>
            <button onClick={() => handlePolicyClick('contact')} className="hover:text-emerald-400 underline decoration-slate-700">Grievance</button>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            title="Scroll to Top"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};

