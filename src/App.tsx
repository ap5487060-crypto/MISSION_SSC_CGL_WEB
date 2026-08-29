import React, { useState, useEffect, useRef } from 'react';
import type { Product, PurchaseRecord } from './types';
import { 
  auth, 
  onAuthStateChanged, 
  signOut, 
  productsCollection, 
  onSnapshot, 
  recordUserPurchase,
  subscribeUserPurchases,
  testFirestoreConnection,
  doc,
  updateDoc,
  db,
  type User 
} from './firebase';
import { isPublished, INSTAGRAM_HANDLE, TELEGRAM_HANDLE, BRAND_LOGO_BASE64 } from './constants';
import { DEFAULT_PRODUCTS } from './data/defaultProducts';
import { COVER_IMAGES } from './data/productCovers';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { FeaturedSection } from './components/FeaturedSection';
import { PremiumEbooksSection } from './components/PremiumEbooksSection';
import { FreeResourcesSection } from './components/FreeResourcesSection';
import { BrowseAllSection } from './components/BrowseAllSection';
import { SyllabusPlanner } from './components/SyllabusPlanner';
import { FormulaHub } from './components/FormulaHub';
import { FlashcardsSection } from './components/FlashcardsSection';
import { WhatsAppSupportWidget } from './components/WhatsAppSupportWidget';
import { WhyChooseUs } from './components/WhyChooseUs';
import { AboutMission } from './components/AboutMission';
import { FAQSection } from './components/FAQSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { PdfReaderModal } from './components/PdfReaderModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AdminPanel } from './components/AdminPanel';
import { UserProfileModal } from './components/UserProfileModal';
import { LegalPoliciesModal, type PolicyTab } from './components/LegalPoliciesModal';
import { Loader2 } from 'lucide-react';

// Direct mapping of default products to their authentic covers
const DEFAULT_COVER_MAP: Record<string, string> = {
  p1: COVER_IMAGES.mathsHandbook,
  p2: COVER_IMAGES.englishRules,
  p3: COVER_IMAGES.staticGk,
  p4: COVER_IMAGES.freeTrigSheet,
  p5: COVER_IMAGES.freeVocabPyq,
  p6: COVER_IMAGES.freePolitySheet,
  p7: COVER_IMAGES.pinnacleMaths,
  p8: COVER_IMAGES.blackBookVocab,
  'ssc-cgl-maths-formula-handbook': COVER_IMAGES.mathsHandbook,
  'ssc-cgl-100-golden-grammar-rules': COVER_IMAGES.englishRules,
  'ssc-cgl-static-gk-mindmaps': COVER_IMAGES.staticGk,
  'ssc-cgl-reasoning-puzzle-master': COVER_IMAGES.reasoningPuzzles,
  'ssc-cgl-english-idioms-phrases': COVER_IMAGES.idiomsPocket,
  'free-ssc-cgl-trig-geometry-sheet': COVER_IMAGES.freeTrigSheet,
  'free-ssc-cgl-one-word-vocab-pyq': COVER_IMAGES.freeVocabPyq,
  'free-ssc-cgl-polity-articles-sheet': COVER_IMAGES.freePolitySheet,
  'pinnacle-ssc-maths-6800-tcs': COVER_IMAGES.pinnacleMaths,
  'blackbook-english-vocabulary': COVER_IMAGES.blackBookVocab,
};

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Navigation Tab State: 'home' | 'ebooks' | 'free-vault' | 'store' | 'syllabus-planner' | 'formula-hub' | 'flashcards' | 'community' | 'about'
  const [activeTab, setActiveTab] = useState<string>('home');

  // Modals & Panels state
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);
  const [showUserProfile, setShowUserProfile] = useState<boolean>(false);
  const [showLegalModal, setShowLegalModal] = useState<boolean>(false);
  const [legalModalTab, setLegalModalTab] = useState<PolicyTab>('privacy');

  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [samplePdfProduct, setSamplePdfProduct] = useState<Product | null>(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);

  // User Purchases & Download Records State
  const [userPurchases, setUserPurchases] = useState<PurchaseRecord[]>(() => {
    try {
      const saved = localStorage.getItem('mssc_purchases');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Filter out any legacy dummy seed item
        const clean = Array.isArray(parsed) 
          ? parsed.filter((p: PurchaseRecord) => p.id !== 'seed-order-1' && p.transactionId !== 'TXN-FREE-TRIG101')
          : [];
        return clean;
      }
    } catch {
      // Ignored
    }
    return [];
  });

  // User Purchased Books state (tracked locally and synchronized)
  const [purchasedProductIds, setPurchasedProductIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mssc_purchased_ids');
      if (saved) {
        const parsed = JSON.parse(saved);
        const clean = Array.isArray(parsed) 
          ? parsed.filter((id: string) => id !== 'free-ssc-cgl-trig-geometry-sheet')
          : [];
        return clean;
      }
      return [];
    } catch {
      return [];
    }
  });

  // Local Bookmarks persistence
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mssc_saved_notes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync saved notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mssc_saved_notes', JSON.stringify(savedIds));
    } catch {
      // Ignored
    }
  }, [savedIds]);

  // Sync purchased ids to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mssc_purchased_ids', JSON.stringify(purchasedProductIds));
    } catch {
      // Ignored
    }
  }, [purchasedProductIds]);

  const handleToggleSave = (product: Product) => {
    setSavedIds((prev) => 
      prev.includes(product.id) 
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  const handleRemoveSaved = (id: string) => {
    setSavedIds((prev) => prev.filter((item) => item !== id));
  };

  const handleClearSaved = () => {
    setSavedIds([]);
  };

  // Listen for Firebase Auth State & Sync Purchases Across Devices
  useEffect(() => {
    let unsubscribePurchases: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Subscribe to user's real-time cloud purchases for cross-device sync
        if (unsubscribePurchases) unsubscribePurchases();
        unsubscribePurchases = subscribeUserPurchases(currentUser.uid, (cloudPurchases) => {
          if (cloudPurchases && cloudPurchases.length > 0) {
            setUserPurchases((prev) => {
              const combined = [...cloudPurchases];
              // Keep any local items that aren't yet in cloud
              const cloudIds = new Set(cloudPurchases.map((p) => p.productId));
              prev.forEach((item) => {
                if (!cloudIds.has(item.productId)) {
                  combined.push(item);
                }
              });
              try {
                localStorage.setItem('mssc_purchases', JSON.stringify(combined.slice(0, 50)));
              } catch {
                // Ignored
              }
              return combined;
            });

            // Unlock product IDs
            setPurchasedProductIds((prev) => {
              const newIds = new Set([...prev, ...cloudPurchases.map((p) => p.productId)]);
              return Array.from(newIds);
            });
          }
        });
      } else {
        if (unsubscribePurchases) {
          unsubscribePurchases();
          unsubscribePurchases = null;
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribePurchases) unsubscribePurchases();
    };
  }, []);

  // Real-time Firestore sync with 'products' collection
  useEffect(() => {
    setLoading(true);

    testFirestoreConnection().catch((err) => {
      console.warn('Firestore connection check:', err);
    });

    const unsubscribeSnapshot = onSnapshot(
      productsCollection,
      (snapshot) => {
        const items: Product[] = [];
        snapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          const docId = docSnapshot.id;

          let resolvedImg = data.img || '';
          const isGenericBrandLogo = 
            !resolvedImg || 
            resolvedImg === BRAND_LOGO_BASE64 || 
            resolvedImg.startsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAABapElEQVR42tX9dZxcZRL2D3+PtPd0j08yM3F3IyEhCUmIECTBZXHYhUWCLb6LLLY4LAuLLe6wwOISAjHi7j6RyWTc2vtYvX90zyQP');

          if (isGenericBrandLogo && DEFAULT_COVER_MAP[docId]) {
            resolvedImg = DEFAULT_COVER_MAP[docId];
            try {
              const docRef = doc(db, 'products', docId);
              updateDoc(docRef, { img: resolvedImg }).catch(() => {});
            } catch {
              // Ignore background update errors
            }
          }

          items.push({
            id: docId,
            title: data.title || '',
            desc: data.desc || '',
            cat: data.cat || '',
            badge: data.badge || '',
            price: data.price || '',
            mrp: data.mrp || '',
            amazon: data.amazon || '',
            flipkart: data.flipkart || '',
            free: data.free,
            pdf: data.pdf || '',
            landingPageUrl: data.landingPageUrl || '',
            paymentUrl: data.paymentUrl || '',
            downloadUrl: data.downloadUrl || '',
            img: resolvedImg,
            type: data.type || 'ebooks',
            status: data.status || 'published',
            featured: data.featured === true,
            createdAt: data.createdAt,
          });
        });

        items.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });

        if (items.length === 0) {
          setProducts(DEFAULT_PRODUCTS);
        } else {
          setProducts(items);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Firestore snapshot listener error:', error);
        setProducts((prev) => (prev.length > 0 ? prev : DEFAULT_PRODUCTS));
        setLoading(false);
      }
    );

    return () => unsubscribeSnapshot();
  }, []);

  const isAdmin = user?.email === 'ap5487060@gmail.com' || !!adminUser;

  const publishedProducts = products.filter(isPublished);
  const featuredProducts = publishedProducts.filter((p) => p.featured);
  const premiumEbooks = publishedProducts.filter((p) => p.type === 'ebooks' && p.free === false);
  const freeResources = publishedProducts.filter((p) => p.type === 'ebooks' && p.free !== false);
  const savedProductsList = publishedProducts.filter((p) => savedIds.includes(p.id));

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFocusSearch = () => {
    setActiveTab('home');
    setTimeout(() => {
      const target = document.querySelector('#catalog');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 400);
    }, 100);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      // Ignored
    }
    setUser(null);
    setAdminUser(null);
    setShowAdminPanel(false);
  };

  // Open PDF reader with specific document
  const handleOpenPdfReader = (url: string, title: string) => {
    const existing = products.find(p => p.downloadUrl === url || p.pdf === url);
    if (existing) {
      setSamplePdfProduct(existing);
    } else {
      setSamplePdfProduct({
        id: `custom-pdf-${Date.now()}`,
        title: title || 'SSC CGL Study Material',
        desc: 'Official SSC CGL Digital Resource',
        type: 'ebooks',
        pdf: url,
        downloadUrl: url,
        free: true,
        status: 'published'
      });
    }
  };

  // Handle tracking when user purchases or downloads
  const handleRecordPurchase = async (product: Product, method: string) => {
    setPurchasedProductIds((prev) => 
      prev.includes(product.id) ? prev : [...prev, product.id]
    );

    const newRecord: PurchaseRecord = {
      id: `ORD_${Date.now()}_${product.id.slice(0, 8)}`,
      userId: user?.uid || 'local-user',
      userEmail: localStorage.getItem('mssc_user_email') || user?.email || 'aspirant@ssc-cgl.in',
      userName: localStorage.getItem('mssc_user_name') || user?.displayName || 'SSC Aspirant',
      productId: product.id,
      productTitle: product.title,
      productType: product.type,
      productImage: product.img || '',
      amount: Number(product.price) || 0,
      paymentMethod: method as any,
      transactionId: `ORDER-${Date.now().toString().slice(-8)}`,
      paymentStatus: product.free !== false ? 'free' : 'verified',
      downloadUrl: product.downloadUrl || product.pdf || product.paymentUrl || '',
      pdfUrl: product.downloadUrl || product.pdf || '',
      createdAt: new Date().toISOString(),
      notes: `Purchased via ${method} on Web Store`
    };

    setUserPurchases((prev) => {
      const updated = [newRecord, ...prev.filter(p => p.productId !== product.id)];
      try {
        localStorage.setItem('mssc_purchases', JSON.stringify(updated.slice(0, 50)));
      } catch {
        // Ignored
      }
      return updated;
    });

    try {
      await recordUserPurchase({
        userId: user?.uid || `guest_${Date.now()}`,
        userEmail: newRecord.userEmail,
        userName: newRecord.userName,
        productId: product.id,
        productTitle: product.title,
        productType: product.type,
        productImage: product.img || '',
        amount: Number(product.price) || 0,
        paymentMethod: method,
        transactionId: newRecord.transactionId,
        paymentStatus: product.free !== false ? 'free' : 'verified',
        downloadUrl: product.downloadUrl || product.pdf || '',
        pdfUrl: product.downloadUrl || product.pdf || '',
        notes: `Purchased via ${method} on Web Store`
      });
    } catch {
      // Handled gracefully without interrupting user experience
    }
  };

  return (
    <div className="min-h-screen bg-[#070D16] text-slate-100 font-sans selection:bg-emerald-500 selection:text-[#070D16] flex flex-col">
      
      {/* Main Navigation Bar */}
      <Navbar
        user={user}
        isAdmin={isAdmin}
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        onOpenAdminLogin={() => setShowAdminLogin(true)}
        onOpenAdminPanel={() => setShowAdminPanel(true)}
        onLogout={handleLogout}
        savedCount={savedIds.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenUserProfile={() => setShowUserProfile(true)}
        onSearchFocus={handleFocusSearch}
      />

      {/* Main Content Body */}
      <main className="flex-1 pt-16">
        
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <span className="text-xs font-bold tracking-widest uppercase text-emerald-400">Loading MISSION_SSC_CGL Database...</span>
          </div>
        )}

        {!loading && (
          <>
            {/* VIEW 1: HOME TAB */}
            {activeTab === 'home' && (
              <div className="animate-fadeIn">
                <Hero
                  totalCount={publishedProducts.length}
                  freeCount={freeResources.length}
                  onExploreEbooks={() => handleTabChange('ebooks')}
                  onExploreFree={() => handleTabChange('free-vault')}
                />

                <TrustBar />

                {featuredProducts.length > 0 && (
                  <FeaturedSection
                    products={featuredProducts}
                    onExploreAll={() => handleTabChange('ebooks')}
                    onPreview={(p) => setSamplePdfProduct(p)}
                    savedIds={savedIds}
                    onToggleSave={handleToggleSave}
                    purchasedProductIds={purchasedProductIds}
                    onRecordPurchase={handleRecordPurchase}
                    onOpenPdfReader={handleOpenPdfReader}
                  />
                )}

                {freeResources.length > 0 && (
                  <FreeResourcesSection
                    products={freeResources.slice(0, 4)}
                    onExploreAllFree={() => handleTabChange('free-vault')}
                    onPreview={(p) => setSamplePdfProduct(p)}
                    savedIds={savedIds}
                    onToggleSave={handleToggleSave}
                    purchasedProductIds={purchasedProductIds}
                    onRecordPurchase={handleRecordPurchase}
                    onOpenPdfReader={handleOpenPdfReader}
                  />
                )}

                <div id="catalog">
                  <BrowseAllSection
                    products={publishedProducts}
                    onPreview={(p) => setSamplePdfProduct(p)}
                    savedIds={savedIds}
                    onToggleSave={handleToggleSave}
                    purchasedProductIds={purchasedProductIds}
                    onRecordPurchase={handleRecordPurchase}
                    onOpenPdfReader={handleOpenPdfReader}
                  />
                </div>

                <WhyChooseUs />

                <FinalCTA onExploreEbooks={() => handleTabChange('ebooks')} />
              </div>
            )}

            {/* VIEW 2: EBOOKS & NOTES TAB */}
            {activeTab === 'ebooks' && (
              <div className="animate-fadeIn py-4">
                <BrowseAllSection
                  products={publishedProducts}
                  defaultType="ebooks"
                  defaultFreeOnly={false}
                  title="Official SSC CGL 2026 Digital Notes & Formula Handbooks"
                  subtitle="Instant PDF delivery with high-yield revision summaries, formulas, and PYQ trends."
                  onPreview={(p) => setSamplePdfProduct(p)}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                  purchasedProductIds={purchasedProductIds}
                  onRecordPurchase={handleRecordPurchase}
                  onOpenPdfReader={handleOpenPdfReader}
                />
                <TrustBar />
              </div>
            )}

            {/* VIEW 3: FREE VAULT TAB */}
            {activeTab === 'free-vault' && (
              <div className="animate-fadeIn py-4">
                <BrowseAllSection
                  products={publishedProducts}
                  defaultType="all"
                  defaultFreeOnly={true}
                  title="100% Free SSC CGL Study Vault (Zero Cost PDFs)"
                  subtitle="Download high-yield formula cheat sheets, 500+ one-word substitution banks, and high-frequency polity article summaries."
                  onPreview={(p) => setSamplePdfProduct(p)}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                  purchasedProductIds={purchasedProductIds}
                  onRecordPurchase={handleRecordPurchase}
                  onOpenPdfReader={handleOpenPdfReader}
                />
                <TrustBar />
              </div>
            )}

            {/* VIEW 4: PHYSICAL BOOKS STORE TAB */}
            {activeTab === 'store' && (
              <div className="animate-fadeIn py-4">
                <BrowseAllSection
                  products={publishedProducts}
                  defaultType="books"
                  defaultFreeOnly={false}
                  title="Authentic Printed Books & Hardcopy Stationery"
                  subtitle="Verified official Amazon & Flipkart partner links for authentic paperbacks, practice sets, and mock notebooks."
                  onPreview={(p) => setSamplePdfProduct(p)}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                  purchasedProductIds={purchasedProductIds}
                  onRecordPurchase={handleRecordPurchase}
                  onOpenPdfReader={handleOpenPdfReader}
                />
                <TrustBar />
              </div>
            )}

            {/* VIEW 5: SYLLABUS PLANNER TAB */}
            {activeTab === 'syllabus-planner' && (
              <div className="animate-fadeIn">
                <SyllabusPlanner />
              </div>
            )}

            {/* VIEW 6: FORMULA & SHORTCUT HUB */}
            {activeTab === 'formula-hub' && (
              <div className="animate-fadeIn">
                <FormulaHub />
              </div>
            )}

            {/* VIEW 7: FLASHCARDS REVISION DECK */}
            {activeTab === 'flashcards' && (
              <div className="animate-fadeIn py-4">
                <FlashcardsSection />
              </div>
            )}

            {/* VIEW 8: ABOUT US */}
            {activeTab === 'about' && (
              <div className="animate-fadeIn py-8 space-y-8">
                <AboutMission />
                <WhyChooseUs />
                <FAQSection />
              </div>
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <Footer
        user={isAdmin ? (user || { uid: 'admin' }) : null}
        onOpenAdminLogin={() => setShowAdminLogin(true)}
        onOpenAdminPanel={() => setShowAdminPanel(true)}
        onNavigateTab={handleTabChange}
        onOpenLegalPolicy={(tab) => {
          setLegalModalTab(tab);
          setShowLegalModal(true);
        }}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onSuccess={(customAdmin) => {
          if (customAdmin) {
            setAdminUser(customAdmin);
          }
          setShowAdminPanel(true);
        }}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={previewProduct}
        onClose={() => setPreviewProduct(null)}
        isPurchased={previewProduct ? purchasedProductIds.includes(previewProduct.id) : false}
        onRecordPurchase={handleRecordPurchase}
        onOpenPdfReader={handleOpenPdfReader}
      />

      {/* High-Yield Sample PDF Reader Modal */}
      <PdfReaderModal
        product={samplePdfProduct}
        onClose={() => setSamplePdfProduct(null)}
      />

      {/* Wishlist / Saved Notes Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        savedProducts={savedProductsList}
        onRemove={handleRemoveSaved}
        onClear={handleClearSaved}
        onPreview={(p) => setSamplePdfProduct(p)}
      />

      {/* Aspirant User Profile & Purchases Modal */}
      <UserProfileModal
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
        purchases={userPurchases}
        currentUser={user}
        onOpenPdfReader={handleOpenPdfReader}
        onExploreStore={() => handleTabChange('ebooks')}
      />

      {/* Admin Dashboard Overlay */}
      {isAdmin && showAdminPanel && (
        <AdminPanel
          user={user as User || { uid: 'admin', email: 'ap5487060@gmail.com', displayName: 'Admin' } as any}
          products={products}
          onClose={() => setShowAdminPanel(false)}
        />
      )}

      {/* Legal & Policies Modal */}
      <LegalPoliciesModal
        isOpen={showLegalModal}
        initialTab={legalModalTab}
        onClose={() => setShowLegalModal(false)}
      />

      {/* Floating WhatsApp Support */}
      <WhatsAppSupportWidget />

    </div>
  );
}

export default App;
