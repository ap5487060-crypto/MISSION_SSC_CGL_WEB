import React, { useState, useEffect } from 'react';
import { 
  BRAND_NAME, 
  BRAND_TAGLINE, 
  INSTAGRAM_HANDLE 
} from '../constants';
import { 
  Menu, 
  X, 
  Sparkles, 
  BookOpen, 
  Gift, 
  ShoppingBag, 
  Target, 
  Zap, 
  Info, 
  Search, 
  Lock, 
  LogOut, 
  SlidersHorizontal,
  Bookmark,
  Instagram,
  Layers,
  User as UserIcon
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  user: any;
  isAdmin?: boolean;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAdminLogin: () => void;
  onOpenAdminPanel: () => void;
  onLogout: () => void;
  savedCount: number;
  onOpenWishlist: () => void;
  onOpenUserProfile?: () => void;
  onSearchFocus?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  isAdmin = false,
  activeTab,
  onSelectTab,
  onOpenAdminLogin,
  onOpenAdminPanel,
  onLogout,
  savedCount,
  onOpenWishlist,
  onOpenUserProfile,
  onSearchFocus
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navTabs = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'ebooks', label: 'eBooks & Notes', icon: BookOpen, badge: 'PDF' },
    { id: 'free-vault', label: 'Free Vault', icon: Gift, badge: 'Free' },
    { id: 'store', label: 'Books Store', icon: ShoppingBag },
    { id: 'syllabus-planner', label: 'Syllabus Tracker', icon: Target },
    { id: 'formula-hub', label: 'Formulas & Tricks', icon: Zap },
    { id: 'flashcards', label: 'Flashcards Deck', icon: Layers, badge: 'New' },
    { id: 'about', label: 'About', icon: Info }
  ];

  const handleTabClick = (tabId: string) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#070D16]/95 backdrop-blur-md shadow-xl shadow-black/60 border-b border-emerald-500/20 py-2.5' 
          : 'bg-[#070D16]/85 backdrop-blur-sm border-b border-slate-800/90 py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <button 
          onClick={() => handleTabClick('home')}
          className="flex items-center gap-2.5 group focus:outline-none text-left"
          id="brand-logo-link"
        >
          <BrandLogo size="md" showText={true} />
        </button>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden xl:flex items-center gap-1">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black uppercase ${
                    tab.badge === 'Free' 
                      ? 'bg-emerald-500 text-[#070D16]' 
                      : 'bg-amber-500 text-[#070D16]'
                  }`}>
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#22C55E]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls: Search, Saved Bookmarks, Admin & CTA */}
        <div className="flex items-center gap-2">
          
          {/* Quick Search Button */}
          {onSearchFocus && (
            <button
              onClick={onSearchFocus}
              className="p-2 rounded-xl bg-[#0F1D31] text-slate-300 hover:text-emerald-400 hover:bg-slate-800 transition-colors border border-slate-700/70"
              title="Search Materials"
              id="nav-search-btn"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Bookmarks / Saved Drawer Button */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 rounded-xl bg-[#0F1D31] text-slate-300 hover:text-amber-400 hover:bg-slate-800 transition-colors border border-slate-700/70"
            title="Saved Materials"
            id="nav-wishlist-btn"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-[#070D16] text-[10px] font-black flex items-center justify-center animate-bounce">
                {savedCount}
              </span>
            )}
          </button>

          {/* User Profile & Purchases Button */}
          {onOpenUserProfile && (
            <button
              onClick={onOpenUserProfile}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#0F1D31] hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-700/80 text-xs font-semibold transition-all"
              title="My Profile & Purchases"
              id="nav-user-profile-btn"
            >
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'Profile'} 
                  className="w-4 h-4 rounded-full object-cover border border-emerald-400"
                />
              ) : (
                <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span className="hidden sm:inline truncate max-w-[100px]">
                {user?.displayName ? user.displayName.split(' ')[0] : 'Profile'}
              </span>
              {user && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Cloud Synced" />
              )}
            </button>
          )}

          {/* Admin Controls / Portal */}
          {isAdmin ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenAdminPanel}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all shadow-sm"
                id="open-admin-panel-btn"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </button>
              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-red-950/50 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-800/50 transition-colors"
                title="Sign Out Admin"
                id="admin-logout-btn"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : !user ? (
            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#0F1D31] hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-700/80 text-xs font-semibold transition-all"
              id="admin-login-nav-btn"
              title="Admin Portal"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400/70" />
              <span>Admin</span>
            </button>
          ) : null}

          {/* Direct Store Button */}
          <button
            onClick={() => handleTabClick('ebooks')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-black shadow-md transition-all"
            id="nav-explore-btn"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Store</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-[#0F1D31] text-slate-300 hover:text-white border border-slate-700"
            aria-label="Toggle Menu"
            id="mobile-menu-toggle-btn"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          id="mobile-menu-drawer"
          className="xl:hidden px-4 pt-3 pb-6 bg-[#070D16] border-b border-emerald-500/20 space-y-3 animate-fadeIn"
        >
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-[#0F1D31] text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="truncate">{tab.label}</span>
                  {tab.badge && (
                    <span className={`ml-auto text-[9px] px-1.5 py-0.2 rounded-full font-black uppercase ${
                      tab.badge === 'Free' ? 'bg-emerald-500 text-[#070D16]' : 'bg-amber-500 text-[#070D16]'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            {onOpenUserProfile && (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenUserProfile(); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold"
              >
                <UserIcon className="w-4 h-4 text-emerald-400" />
                <span>My Profile & Purchase Records</span>
              </button>
            )}

            {isAdmin ? (
              <div className="flex gap-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAdminPanel(); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Admin Panel
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                  className="p-2.5 rounded-xl bg-red-950/50 text-red-400 border border-red-800/50 text-xs font-bold"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : !user ? (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAdminLogin(); }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[#0F1D31] text-slate-400 border border-slate-800 text-xs font-semibold"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Admin Portal
              </button>
            ) : null}

            <button
              onClick={() => handleTabClick('ebooks')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl btn-neon-amber text-xs font-black"
            >
              <BookOpen className="w-4 h-4" />
              Explore All Digital eBooks & Notes
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
