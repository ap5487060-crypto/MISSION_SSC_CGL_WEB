import React, { useState, useEffect } from 'react';
import type { PurchaseRecord } from '../types';
import { 
  X, 
  User as UserIcon, 
  ShoppingBag, 
  Download, 
  BookOpen, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  Check, 
  Search, 
  Sparkles, 
  MessageCircle, 
  Target, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck,
  Cloud,
  LogOut,
  Loader2,
  Smartphone,
  Laptop
} from 'lucide-react';
import { FALLBACK_IMG, WHATSAPP_SUPPORT_URL } from '../constants';
import { auth, googleProvider, signInWithPopup, signOut, syncUserProfile, type User } from '../firebase';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchases: PurchaseRecord[];
  currentUser: User | null;
  onOpenPdfReader?: (url: string, title: string) => void;
  onExploreStore?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  purchases,
  currentUser,
  onOpenPdfReader,
  onExploreStore
}) => {
  const [activeTab, setActiveTab] = useState<'purchases' | 'profile'>('purchases');
  const [filterType, setFilterType] = useState<'all' | 'paid' | 'free'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Simple local/synced user info
  const [userName, setUserName] = useState<string>(() => {
    return currentUser?.displayName || localStorage.getItem('mssc_user_name') || 'SSC Aspirant';
  });
  const [userEmail, setUserEmail] = useState<string>(() => {
    return currentUser?.email || localStorage.getItem('mssc_user_email') || 'aspirant@ssc-cgl.in';
  });
  const [userPhone, setUserPhone] = useState<string>(() => {
    return currentUser?.phoneNumber || localStorage.getItem('mssc_user_phone') || '';
  });
  const [targetExam, setTargetExam] = useState<string>(() => {
    return localStorage.getItem('mssc_target_exam') || 'SSC CGL 2026 (Income Tax / ASO / Excise)';
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.displayName) setUserName(currentUser.displayName);
      if (currentUser.email) setUserEmail(currentUser.email);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!isOpen) {
      setSavedSuccess(false);
      setAuthError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await syncUserProfile(result.user, {
          displayName: result.user.displayName || userName,
          email: result.user.email || userEmail,
          targetExam: targetExam
        });
        localStorage.setItem('mssc_user_name', result.user.displayName || userName);
        if (result.user.email) localStorage.setItem('mssc_user_email', result.user.email);
      }
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('auth/unauthorized-domain')) {
        setAuthError(
          'Firebase Console setup required: Please add this domain to Firebase Console > Authentication > Settings > Authorized domains.'
        );
      } else if (err?.message?.includes('popup-closed') || err?.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in popup closed before completion.');
      } else {
        setAuthError(err?.message || 'Sign-in failed. Please try again.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign Out Error:', err);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('mssc_user_name', userName);
    localStorage.setItem('mssc_user_email', userEmail);
    localStorage.setItem('mssc_user_phone', userPhone);
    localStorage.setItem('mssc_target_exam', targetExam);

    if (currentUser) {
      try {
        await syncUserProfile(currentUser, {
          displayName: userName,
          phoneNumber: userPhone,
          targetExam: targetExam
        });
      } catch {
        // Ignored
      }
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter purchases
  const filteredPurchases = purchases.filter((item) => {
    const matchesSearch = 
      item.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.transactionId && item.transactionId.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterType === 'paid') return item.amount > 0 || item.paymentStatus !== 'free';
    if (filterType === 'free') return item.amount === 0 || item.paymentStatus === 'free';
    return true;
  });

  const totalSpent = purchases.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const paidCount = purchases.filter(p => p.amount > 0 || p.paymentStatus !== 'free').length;

  const formatDate = (val: any) => {
    if (!val) return 'Recently';
    try {
      if (typeof val === 'string') return new Date(val).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      if (val.seconds) return new Date(val.seconds * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      if (val instanceof Date) return val.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      return 'Recently';
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#0A1524] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-5 py-4 bg-[#070D16] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentUser?.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt={userName} 
                className="w-10 h-10 rounded-xl object-cover border border-emerald-500/40 shadow-md"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-[#070D16] font-black text-lg flex items-center justify-center shadow-md">
                {userName ? userName.charAt(0).toUpperCase() : 'A'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{userName}</h3>
                {currentUser ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                    <Cloud className="w-2.5 h-2.5" />
                    <span>Synced (Cloud)</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-medium">
                    This Device
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 truncate max-w-[240px] sm:max-w-md">
                {currentUser?.email || targetExam}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700 text-xs font-semibold transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sync Banner (If user is not logged in) */}
        {!currentUser && (
          <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border-b border-emerald-500/20 px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <div className="flex items-center -space-x-1 text-emerald-400">
                <Smartphone className="w-4 h-4" />
                <Laptop className="w-4 h-4" />
              </div>
              <span>
                Want to open your purchases on your <strong>Laptop, Tablet or another Phone</strong>?
              </span>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold shadow transition-all whitespace-nowrap active:scale-95 disabled:opacity-50"
            >
              {isSigningIn ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign in with Google to Sync</span>
                </>
              )}
            </button>
          </div>
        )}

        {authError && (
          <div className="px-4 py-1.5 bg-rose-950/60 border-b border-rose-800 text-rose-300 text-xs font-semibold text-center">
            {authError}
          </div>
        )}

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-3 bg-[#081220] border-b border-slate-800/80 px-4 py-3 text-center divide-x divide-slate-800">
          <div>
            <span className="text-xs text-slate-400 block">Total Items</span>
            <span className="text-sm sm:text-base font-black text-white">{purchases.length} Resources</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">eBooks Purchased</span>
            <span className="text-sm sm:text-base font-black text-amber-400">{paidCount} Paid</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Total Investment</span>
            <span className="text-sm sm:text-base font-black text-emerald-400">₹{totalSpent}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-800 px-5 bg-[#070D16]/60">
          <button
            onClick={() => setActiveTab('purchases')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'purchases'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>My Purchases & Downloads ({purchases.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Aspirant Profile Info</span>
          </button>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#070D16]/40">
          
          {/* TAB 1: PURCHASES & DOWNLOADS */}
          {activeTab === 'purchases' && (
            <div className="space-y-4">
              
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0B1524] p-3 rounded-xl border border-slate-800">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your orders..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      filterType === 'all'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    All ({purchases.length})
                  </button>
                  <button
                    onClick={() => setFilterType('paid')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      filterType === 'paid'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Paid eBooks ({paidCount})
                  </button>
                  <button
                    onClick={() => setFilterType('free')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      filterType === 'free'
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Free Vault ({purchases.length - paidCount})
                  </button>
                </div>
              </div>

              {/* Purchase Records List */}
              {filteredPurchases.length > 0 ? (
                <div className="space-y-3">
                  {filteredPurchases.map((item) => {
                    const isFree = item.amount === 0 || item.paymentStatus === 'free';
                    const downloadHref = item.downloadUrl || item.pdfUrl;

                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-[#0B1524] border border-slate-800/90 hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        {/* Book details & Thumbnail */}
                        <div className="flex items-start gap-3.5">
                          <img
                            src={item.productImage || FALLBACK_IMG}
                            alt={item.productTitle}
                            className="w-14 h-18 object-contain rounded-lg bg-slate-900 border border-slate-800 flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                          />

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                isFree
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}>
                                {isFree ? 'Free PDF Download' : 'Verified Paid eBook'}
                              </span>

                              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {formatDate(item.createdAt)}
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-white leading-snug">
                              {item.productTitle}
                            </h4>

                            <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                              <span>
                                Amount: <strong className={isFree ? 'text-emerald-400' : 'text-amber-400 font-bold'}>{isFree ? 'FREE' : `₹${item.amount}`}</strong>
                              </span>
                              
                              {item.paymentMethod && (
                                <span>via {item.paymentMethod}</span>
                              )}

                              {item.transactionId && (
                                <button
                                  onClick={() => handleCopy(item.transactionId || '', item.id)}
                                  className="inline-flex items-center gap-1 font-mono text-[10px] text-slate-400 hover:text-white bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800"
                                  title="Copy Order ID"
                                >
                                  <span>ID: {item.transactionId}</span>
                                  {copiedId === item.id ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                          {downloadHref && (
                            <a
                              href={downloadHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-sm transition-all"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download PDF</span>
                            </a>
                          )}

                          {onOpenPdfReader && downloadHref && (
                            <button
                              onClick={() => {
                                onOpenPdfReader(downloadHref, item.productTitle);
                                onClose();
                              }}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                              title="Read Online"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                              <span>Read Online</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty state */
                <div className="py-12 px-4 text-center rounded-2xl bg-[#0B1524] border border-dashed border-slate-800 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">No Purchases Found</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {searchQuery
                      ? 'No study materials matched your search query.'
                      : 'You have not downloaded or purchased any digital eBooks yet. Start by exploring our Free Study Vault or high-yield handbooks.'}
                  </p>
                  {onExploreStore && (
                    <button
                      onClick={() => {
                        onClose();
                        onExploreStore();
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl btn-neon-amber text-xs font-bold shadow-md"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Browse SSC CGL Notes & eBooks</span>
                    </button>
                  )}
                </div>
              )}

              {/* Order / Payment Support Callout */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Facing any issue with downloading or opening your purchased PDF?</span>
                </div>
                <a
                  href={`${WHATSAPP_SUPPORT_URL}?text=${encodeURIComponent(`Hello Abhishek Sir, I need assistance with my study material purchase on MISSION_SSC_CGL (Name: ${userName}).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold whitespace-nowrap"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Instant WhatsApp Help</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>
          )}

          {/* TAB 2: ASPIRANT PROFILE INFO */}
          {activeTab === 'profile' && (
            <div className="space-y-5 max-w-xl mx-auto">
              
              {savedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Your Full Name / Aspirant Name</span>
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Email Address (For PDF delivery & receipts)</span>
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="e.g. aspirant@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>WhatsApp Mobile Number (Optional for order alerts)</span>
                  </label>
                  <input
                    type="tel"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-purple-400" />
                    <span>Target SSC Exam & Goal Post</span>
                  </label>
                  <input
                    type="text"
                    value={targetExam}
                    onChange={(e) => setTargetExam(e.target.value)}
                    placeholder="e.g. SSC CGL 2026 (Income Tax Inspector / ASO MEA)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl btn-neon-primary text-xs font-black shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Aspirant Profile</span>
                  </button>
                </div>
              </form>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

