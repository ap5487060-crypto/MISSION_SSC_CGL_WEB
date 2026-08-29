import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  RefreshCcw, 
  Truck, 
  AlertCircle, 
  Mail, 
  Phone, 
  MessageCircle, 
  ExternalLink,
  Lock,
  UserCheck,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { 
  BRAND_NAME, 
  BRAND_SHORT_NAME,
  AUTHOR_NAME, 
  CONTACT_EMAIL, 
  WHATSAPP_SUPPORT_NUMBER, 
  WHATSAPP_SUPPORT_URL,
  AFFILIATE_DISCLOSURE_EN
} from '../constants';

export type PolicyTab = 'privacy' | 'terms' | 'refund' | 'delivery' | 'disclaimer' | 'contact';

interface LegalPoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: PolicyTab;
}

export const LegalPoliciesModal: React.FC<LegalPoliciesModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy'
}) => {
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);

  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const tabs: { id: PolicyTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'refund', label: 'Refund Policy', icon: RefreshCcw },
    { id: 'delivery', label: 'Shipping & Delivery', icon: Truck },
    { id: 'disclaimer', label: 'Disclaimer & Copyright', icon: AlertCircle },
    { id: 'contact', label: 'Contact & Grievance', icon: Mail },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#070D16] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-[#0A1322] border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Legal & Compliance Portal</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                  Verified
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {BRAND_NAME} • Official Policies & Aspirant Protection
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#050A12] border-b border-slate-800/80 overflow-x-auto scrollbar-none flex-shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed max-h-[calc(90vh-140px)]">
          
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Privacy Policy (गोपनीयता नीति)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Last Updated: August 2026 • Compliant with Information Technology Act, 2000 & Digital Personal Data Protection Norms.
                </p>
              </div>

              <div className="space-y-4">
                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-white">1. Introduction & Overview</h4>
                  <p>
                    Welcome to <strong>{BRAND_NAME}</strong> (accessible via our portal). We deeply respect your privacy and are committed to protecting any personal information you share while downloading study notes, purchasing digital eBooks, or accessing the Free Aspirant Vault.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-white">2. Information We Collect</h4>
                  <p>We only collect minimal, necessary information required to deliver your digital purchases and provide cross-device access:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    <li><strong>Personal Contact Information:</strong> Name, Email Address, and optional Mobile/WhatsApp Number provided during checkout or account sync.</li>
                    <li><strong>Transaction Details:</strong> Payment confirmation ID, order reference ID, purchase timestamp, and product IDs (We <em>never</em> store your Card Numbers, CVV, UPI PIN, or Netbanking credentials; all payments are processed through RBI-authorized payment gateways like Razorpay).</li>
                    <li><strong>Device & Authentication Data:</strong> Secure Firebase authentication UID and tokens if you choose to sign in with Google to sync your purchases across devices.</li>
                  </ul>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-white">3. How We Use Your Information</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>To generate instantaneous PDF download links and digital access on your screen.</li>
                    <li>To sync your purchase history across your mobile, tablet, and laptop when logged into your account.</li>
                    <li>To send order confirmation receipts, payment invoices, and critical study material syllabus updates.</li>
                    <li>To provide direct one-on-one customer support on WhatsApp and Email for any download issues.</li>
                  </ul>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-white">4. No Data Selling or Unsolicited Marketing</h4>
                  <p>
                    <strong>We strictly do NOT sell, trade, rent, or lease your personal contact information to third-party telemarketers or advertisers.</strong> Your email and phone numbers are exclusively used for your study material delivery and portal support.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-white">5. Cookies and Security</h4>
                  <p>
                    Our platform uses standard client-side browser storage (LocalStorage) and secure SSL/TLS 256-bit encryption to protect your sessions and preserve your dark mode preferences and active purchase keys.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* TAB 2: TERMS & CONDITIONS */}
          {activeTab === 'terms' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  <span>Terms & Conditions (नियम और शर्तें)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Please read these Terms of Service carefully before utilizing our website or purchasing digital study materials.
                </p>
              </div>

              <div className="space-y-4">
                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-white">1. Acceptance of Terms</h4>
                  <p>
                    By accessing, browsing, or purchasing any material from <strong>{BRAND_NAME}</strong>, you agree to be bound by these terms. If you disagree with any part of these terms, you should discontinue using the platform.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-white">2. Intellectual Property & Copyright Protection</h4>
                  <p>
                    All curated digital notes, formula sheets, revision cards, question compilations, and graphic layouts available on this portal are the intellectual property of <strong>{BRAND_NAME} ({AUTHOR_NAME})</strong> and protected under Indian Copyright laws:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    <li>Purchased eBooks and free sheets are granted under a <strong>Single-User Personal Educational License</strong>.</li>
                    <li><strong>Strictly Prohibited:</strong> Reselling, redistributing on unauthorized Telegram channels, mass photocopying for commercial gains, modifying, or uploading to pirate file-sharing repositories.</li>
                    <li>Violations may lead to permanent revocation of portal access and legal civil remedies.</li>
                  </ul>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-white">3. Digital Products & Delivery Mechanism</h4>
                  <p>
                    All items in the "Digital eBooks & Notes" and "Free Vault" are purely electronic formats (High-Resolution PDF documents). No physical paper copies will be dispatched to your postal address for digital-tier products unless explicitly purchased from authorized retail book links (Amazon / Flipkart).
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-white">4. User Account & Device Fair Usage</h4>
                  <p>
                    Users may sign in via Google to sync their purchase library across their own personal devices (e.g. mobile phone, tablet, desktop). Sharing accounts across multiple commercial coaching institutes is prohibited.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-white">5. Educational Nature & Disclaimer</h4>
                  <p>
                    Our notes and PYQ compilations are prepared with extreme diligence to match recent Staff Selection Commission (SSC) patterns. However, examination results depend on individual student dedication, practice, and commission discretion. We make no guarantee of specific exam rank or government appointment.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* TAB 3: REFUND POLICY */}
          {activeTab === 'refund' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <RefreshCcw className="w-5 h-5 text-emerald-400" />
                  <span>Refund & Cancellation Policy (रिफंड और रद्दीकरण नीति)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Clear, honest, and transparent guidelines regarding digital purchases and payment issues.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Instant Resolution Guarantee</span>
                  </div>
                  <p className="text-xs text-slate-200">
                    If any money is deducted from your bank/UPI but you did not receive your download or faced a technical glitch, we resolve it within <strong>2 to 24 hours</strong> or initiate a full 100% refund!
                  </p>
                </div>

                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-white">1. Nature of Digital Goods</h4>
                  <p>
                    Since all study materials sold on this portal are <strong>instantly accessible digital PDF files and download links</strong>, once the content is delivered and accessed, standard physical return is not applicable.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-white">2. Eligible Cases for 100% Full Refund:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Duplicate Payment / Double Charge:</strong> If you were charged twice for the same eBook order due to bank server timeouts.</li>
                    <li><strong>Payment Deducted but Order Failed:</strong> If UPI/Card deducted funds but gateway failed to transmit the license key.</li>
                    <li><strong>Corrupt / Unreadable PDF:</strong> If the file link is broken and our support team cannot provide an alternative working link within 24 hours.</li>
                  </ul>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-white">3. How to Request Support or Refund</h4>
                  <p>Simply message us on WhatsApp or Email with your transaction details:</p>
                  <div className="p-3 rounded-xl bg-[#08111D] border border-slate-800 text-xs space-y-1">
                    <div>💬 <strong>WhatsApp Support:</strong> <span className="text-emerald-400 font-mono">+{WHATSAPP_SUPPORT_NUMBER}</span></div>
                    <div>📧 <strong>Email Support:</strong> <span className="text-emerald-400 font-mono">{CONTACT_EMAIL}</span></div>
                    <div>📝 <strong>Required Details:</strong> Payment Screenshot / UPI Ref ID / Razorpay Payment ID</div>
                  </div>
                  <p className="text-xs text-slate-400">
                    Approved refunds are credited back to the original payment source (UPI / Bank / Card) within 3-5 business days as per banking cycles.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* TAB 4: SHIPPING & DELIVERY */}
          {activeTab === 'delivery' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-400" />
                  <span>Shipping & Delivery Policy (डिलीवरी नीति)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Details about delivery timeframes for digital downloads and physical books.
                </p>
              </div>

              <div className="space-y-4">
                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-white">1. Digital Study Materials (eBooks / PDFs / Formula Sheets)</h4>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                    <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-black">
                      0 SECONDS
                    </span>
                    <div className="space-y-1 text-xs">
                      <div className="text-white font-bold">Instant On-Screen Access</div>
                      <p className="text-slate-300">
                        Immediately upon successful payment, you will see a green "Download PDF" button and an "Instant Web Reader" directly on your screen. You can also view all purchases under your "Profile & Purchases" tab at any time.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-white">2. Physical Paper Books & Stationery Store</h4>
                  <p>
                    For printed physical paperbacks and study tools listed in the "Printed Books & Stationery" section:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Orders are fulfilled and dispatched directly by certified marketplace logistics partners (Amazon India / Flipkart).</li>
                    <li>Standard delivery timeline: <strong>2 to 5 business days</strong> across India.</li>
                    <li>Real-time courier tracking number is provided via Amazon / Flipkart order tracking system.</li>
                  </ul>
                </section>
              </div>
            </div>
          )}

          {/* TAB 5: DISCLAIMER & COPYRIGHT */}
          {activeTab === 'disclaimer' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-emerald-400" />
                  <span>Disclaimer & Copyright Notice (अस्वीकरण)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Non-governmental affiliation disclosure and official affiliate statements.
                </p>
              </div>

              <div className="space-y-4">
                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-white">1. Non-Government Organization Disclaimer</h4>
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
                    <strong>Important Note:</strong> <em>{BRAND_NAME}</em> is a private educational study initiative operated by independent educators ({AUTHOR_NAME}). We are <strong>NOT affiliated, associated, authorized, endorsed by, or in any way officially connected</strong> with the Staff Selection Commission (SSC), Government of India, or any other official examination body. Official examination notifications and forms should always be cross-checked at <span className="underline font-mono">ssc.gov.in</span>.
                  </div>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-white">2. Amazon & Flipkart Affiliate Disclosure</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {AFFILIATE_DISCLOSURE_EN}
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-sm font-bold text-white">3. Content Accuracy</h4>
                  <p>
                    While maximum editorial care is taken to verify all formulas, shortcuts, and solutions, typographical errors may occasionally occur. If you notice any errata, please inform our support team for prompt rectification in subsequent PDF revisions.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* TAB 6: CONTACT & GRIEVANCE */}
          {activeTab === 'contact' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-emerald-400" />
                  <span>Contact Us & Grievance Officer (संपर्क व शिकायत निवारण)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Direct contact information for assistance, inquiries, and legal compliance.
                </p>
              </div>

              <div className="space-y-4">
                <p>
                  Have any questions regarding an eBook, payment issue, or partnership? Reach out directly to our dedicated support desk:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="p-4 rounded-xl bg-[#081220] border border-slate-800 hover:border-emerald-500/50 transition-colors flex items-start gap-3"
                  >
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-400">Official Support Email</div>
                      <div className="text-sm font-bold text-white font-mono">{CONTACT_EMAIL}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Response within 12-24 hours</div>
                    </div>
                  </a>

                  <a
                    href={`${WHATSAPP_SUPPORT_URL}?text=${encodeURIComponent('Hello Abhishek Sir, I have an inquiry regarding MISSION_SSC_CGL study portal.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl bg-[#092218] border border-emerald-500/40 hover:bg-[#0E3224] transition-colors flex items-start gap-3"
                  >
                    <div className="p-2 rounded-lg bg-emerald-500 text-slate-950">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-emerald-300">WhatsApp Instant Support</div>
                      <div className="text-sm font-bold text-white font-mono">+{WHATSAPP_SUPPORT_NUMBER}</div>
                      <div className="text-[11px] text-emerald-400/80 mt-0.5">Quick resolution desk</div>
                    </div>
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Designated Grievance & Nodal Officer
                  </h4>
                  <div className="text-xs space-y-1 text-slate-300">
                    <div><strong>Officer Name:</strong> {AUTHOR_NAME}</div>
                    <div><strong>Designation:</strong> Founder & Chief Educational Curator</div>
                    <div><strong>Address / Jurisdiction:</strong> Uttar Pradesh, India</div>
                    <div><strong>Email:</strong> {CONTACT_EMAIL}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-[#0A1322] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs flex-shrink-0">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit SSL Encrypted & Transparent Digital Commerce</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`${WHATSAPP_SUPPORT_URL}?text=${encodeURIComponent('Hello Sir, I have a query about terms/refunds on MISSION_SSC_CGL.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-500/40 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Need Help? Chat on WhatsApp</span>
            </a>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
