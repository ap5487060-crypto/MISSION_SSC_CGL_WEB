import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword } from '../firebase';
import { Lock, Mail, Key, X, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { CONTACT_EMAIL } from '../constants';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user?: any) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [email, setEmail] = useState(CONTACT_EMAIL);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both admin email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      onSuccess(userCredential.user);
      onClose();
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Email ya password galat hai. Kripya sahi credentials enter karein.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please wait a moment and try again.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error: Internet connection check karein.');
      } else {
        setError(err.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0B1B2B] border border-amber-500/30 p-6 sm:p-8 shadow-2xl shadow-black overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-10"
          title="Close"
          id="close-admin-login-modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-400 flex items-center justify-center mb-3 shadow-lg shadow-amber-500/10">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-white font-['Outfit',sans-serif]">
            Admin Login
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Products add/edit/remove karne ke liye login karo
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 mb-5 rounded-xl bg-red-950/80 border border-red-800/80 text-red-200 text-xs animate-in fade-in relative z-10 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#06101B] border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400"
                id="admin-email-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#06101B] border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400"
                id="admin-password-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all mt-3 active:scale-[0.99]"
            id="admin-login-submit-btn"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        {/* Security Info */}
        <div className="flex items-center justify-center gap-1.5 mt-5 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 relative z-10">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>MISSION_SSC_CGL Admin Portal</span>
        </div>

      </div>
    </div>
  );
};


