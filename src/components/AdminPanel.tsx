import React, { useState, useRef } from 'react';
import type { Product, ProductType } from '../types';
import { 
  db, 
  productsCollection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  uploadProductImage, 
  deleteOldStorageImage,
  seedDefaultCatalog,
  purgeExtraAndSync10Products,
  signOut,
  auth
} from '../firebase';
import { 
  calcDiscount, 
  FALLBACK_IMG, 
  typeLabel, 
  isPublished 
} from '../constants';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  Check, 
  X, 
  UploadCloud, 
  Image as ImageIcon, 
  SlidersHorizontal, 
  LogOut, 
  Eye, 
  EyeOff, 
  Search, 
  Star, 
  Layers, 
  BookOpen, 
  FileText, 
  PenTool, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import type { User } from 'firebase/auth';

interface AdminPanelProps {
  user: User;
  products: Product[];
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  user,
  products,
  onClose
}) => {
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [type, setType] = useState<'books' | 'ebooks' | 'stationery'>('ebooks');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [cat, setCat] = useState('');
  const [badge, setBadge] = useState('');
  const [price, setPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [landingPageUrl, setLandingPageUrl] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [amazon, setAmazon] = useState('');
  const [flipkart, setFlipkart] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [featured, setFeatured] = useState(false);

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Action status state
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Table filter state
  const [tableSearch, setTableSearch] = useState('');
  const [tableTypeFilter, setTableTypeFilter] = useState<string>('all');
  const [tableStatusFilter, setTableStatusFilter] = useState<string>('all');

  const formTopRef = useRef<HTMLDivElement>(null);

  // Populate form for editing
  const handleStartEdit = (p: Product) => {
    setEditingId(p.id);
    setType((p.type as any) || 'ebooks');
    setTitle(p.title || '');
    setDesc(p.desc || '');
    setCat(p.cat || '');
    setBadge(p.badge || '');
    setPrice(p.price || '');
    setMrp(p.mrp || '');
    setIsFree(p.free === true);
    setLandingPageUrl(p.landingPageUrl || '');
    setPaymentUrl(p.paymentUrl || (p.free === false ? p.pdf || '' : ''));
    setDownloadUrl(p.downloadUrl || (p.free !== false ? p.pdf || '' : ''));
    setAmazon(p.amazon || '');
    setFlipkart(p.flipkart || '');
    setImgUrl(p.img || '');
    setImageFile(null);
    setImagePreview(p.img || null);
    setStatus(p.status === 'draft' ? 'draft' : 'published');
    setFeatured(p.featured === true);

    formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Reset form
  const handleResetForm = () => {
    setEditingId(null);
    setType('ebooks');
    setTitle('');
    setDesc('');
    setCat('');
    setBadge('');
    setPrice('');
    setMrp('');
    setIsFree(false);
    setLandingPageUrl('');
    setPaymentUrl('');
    setDownloadUrl('');
    setAmazon('');
    setFlipkart('');
    setImgUrl('');
    setImageFile(null);
    setImagePreview(null);
    setStatus('published');
    setFeatured(false);
  };

  // Handle image file selection
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Save product (Add or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setStatusMessage({ text: 'Product Title is required.', type: 'error' });
      return;
    }

    try {
      setSaving(true);
      setStatusMessage(null);

      let finalImgUrl = imgUrl.trim();

      // If a new image file is chosen, upload to Firebase Storage
      if (imageFile) {
        finalImgUrl = await uploadProductImage(imageFile);
      }

      const productData: any = {
        title: title.trim(),
        desc: desc.trim(),
        cat: cat.trim(),
        badge: badge.trim(),
        price: price.trim(),
        mrp: mrp.trim(),
        type,
        status,
        featured,
        free: type === 'ebooks' ? isFree : false,
        landingPageUrl: landingPageUrl.trim(),
        paymentUrl: paymentUrl.trim(),
        downloadUrl: downloadUrl.trim(),
        // Legacy backward compatibility
        pdf: type === 'ebooks' ? (isFree ? downloadUrl.trim() : paymentUrl.trim()) : '',
        amazon: amazon.trim(),
        flipkart: flipkart.trim(),
        img: finalImgUrl,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        // Update existing document
        const productRef = doc(db, 'products', editingId);
        await updateDoc(productRef, productData);
        setStatusMessage({ text: 'Product updated successfully in Firestore!', type: 'success' });
      } else {
        // Add new document
        productData.createdAt = serverTimestamp();
        await addDoc(productsCollection, productData);
        setStatusMessage({ text: 'New product added successfully to Firestore!', type: 'success' });
      }

      handleResetForm();
    } catch (err: any) {
      console.error('Save error:', err);
      setStatusMessage({ text: `Failed to save product: ${err.message}`, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Duplicate Product
  const handleDuplicate = async (p: Product) => {
    try {
      setSaving(true);
      const duplicateData: any = {
        ...p,
        title: `${p.title} (Copy)`,
        status: 'draft',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      delete duplicateData.id;

      await addDoc(productsCollection, duplicateData);
      setStatusMessage({ text: 'Product duplicated as Draft!', type: 'success' });
    } catch (err: any) {
      setStatusMessage({ text: `Duplicate failed: ${err.message}`, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Toggle publish status
  const handleToggleStatus = async (p: Product) => {
    try {
      const newStatus = p.status === 'draft' ? 'published' : 'draft';
      const productRef = doc(db, 'products', p.id);
      await updateDoc(productRef, { status: newStatus });
      setStatusMessage({ 
        text: `Product is now ${newStatus === 'published' ? 'Published' : 'saved as Draft'}!`, 
        type: 'success' 
      });
    } catch (err: any) {
      setStatusMessage({ text: `Status update failed: ${err.message}`, type: 'error' });
    }
  };

  // Delete product
  const handleDelete = async (id: string, oldImgUrl?: string) => {
    try {
      setSaving(true);
      const productRef = doc(db, 'products', id);
      await deleteDoc(productRef);
      if (oldImgUrl) {
        await deleteOldStorageImage(oldImgUrl);
      }
      setDeleteConfirmId(null);
      setStatusMessage({ text: 'Product deleted from Firestore.', type: 'success' });
    } catch (err: any) {
      setStatusMessage({ text: `Delete failed: ${err.message}`, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // 1-Click Seed / Sync Verified SSC CGL Catalog with Authentic Covers
  const handleSeedCatalog = async (overwrite: boolean = true) => {
    try {
      setSaving(true);
      setStatusMessage({ text: 'Syncing & refreshing verified SSC CGL book cover images...', type: 'success' });
      const count = await seedDefaultCatalog(overwrite);
      setStatusMessage({ 
        text: `Successfully refreshed ${count} verified SSC CGL books & digital resources with original cover images!`, 
        type: 'success' 
      });
    } catch (err: any) {
      setStatusMessage({ text: `Seeding error: ${err.message}`, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // 1-Click Cleanup: Delete Extra Products and keep exactly the 10 verified products
  const handlePurgeExtra = async () => {
    try {
      setSaving(true);
      setStatusMessage({ text: 'Cleaning Firestore: removing extra products and restoring 10 verified products...', type: 'success' });
      const res = await purgeExtraAndSync10Products();
      setStatusMessage({ 
        text: `Firestore Cleaned! Removed ${res.deleted} extra products and synced exactly 10 original products with high-res covers!`, 
        type: 'success' 
      });
    } catch (err: any) {
      setStatusMessage({ text: `Cleanup error: ${err.message}`, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Filter products for management table
  const filteredProducts = products.filter((p) => {
    if (tableTypeFilter !== 'all' && p.type !== tableTypeFilter) return false;
    if (tableStatusFilter === 'published' && p.status === 'draft') return false;
    if (tableStatusFilter === 'draft' && p.status !== 'draft') return false;
    if (tableStatusFilter === 'featured' && !p.featured) return false;

    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase();
      const matchTitle = p.title?.toLowerCase().includes(q);
      const matchCat = p.cat?.toLowerCase().includes(q);
      if (!matchTitle && !matchCat) return false;
    }
    return true;
  });

  const discountPreview = calcDiscount(mrp, price);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#070E17] text-slate-200">
      
      {/* Top Sticky Header */}
      <div className="sticky top-0 z-20 bg-[#0B1523]/95 backdrop-blur-md border-b border-amber-500/30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>Admin Management Portal</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                Firestore Connected
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Logged in as: <strong className="text-amber-300">{user.email}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => signOut(auth)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/60 text-xs font-semibold transition-all"
            title="Sign Out"
            id="admin-top-signout-btn"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
          
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
            id="admin-top-close-btn"
          >
            <X className="w-4 h-4" />
            <span>Close Admin</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* KPI Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="p-4 rounded-2xl bg-[#0F2439] border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Total Products</span>
            <div className="text-2xl font-black text-white mt-1">{products.length}</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0F2439] border border-slate-800">
            <span className="text-xs text-emerald-400 font-medium">Published Live</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {products.filter(isPublished).length}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0F2439] border border-slate-800">
            <span className="text-xs text-amber-400 font-medium">Drafts</span>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {products.filter(p => p.status === 'draft').length}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0F2439] border border-slate-800">
            <span className="text-xs text-sky-400 font-medium">eBooks / PDFs</span>
            <div className="text-2xl font-black text-sky-400 mt-1">
              {products.filter(p => p.type === 'ebooks').length}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0F2439] border border-slate-800">
            <span className="text-xs text-emerald-300 font-medium">100% Free Items</span>
            <div className="text-2xl font-black text-emerald-300 mt-1">
              {products.filter(p => p.type === 'ebooks' && p.free !== false).length}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0F2439] border border-slate-800">
            <span className="text-xs text-amber-300 font-medium">⭐ Featured</span>
            <div className="text-2xl font-black text-amber-300 mt-1">
              {products.filter(p => p.featured).length}
            </div>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {statusMessage && (
          <div 
            className={`flex items-center justify-between gap-3 p-4 rounded-2xl border text-xs sm:text-sm font-semibold animate-fadeIn ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200' 
                : 'bg-red-950/70 border-red-500/50 text-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-red-400" />}
              <span>{statusMessage.text}</span>
            </div>
            <button 
              onClick={() => setStatusMessage(null)}
              className="p-1 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Section 1: Add / Edit Product Form */}
        <div 
          ref={formTopRef} 
          className="rounded-3xl bg-[#0F2439] border border-amber-500/30 p-6 sm:p-8 shadow-2xl space-y-6"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-400/30">
                {editingId ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white">
                  {editingId ? 'Edit Product Item' : 'Add New Product or Study Resource'}
                </h2>
                <p className="text-xs text-slate-400">
                  {editingId ? `Editing ID: ${editingId}` : 'Create a new book, digital PDF eBook, or stationery item'}
                </p>
              </div>
            </div>

            {editingId && (
              <button
                onClick={handleResetForm}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700"
              >
                <X className="w-4 h-4" />
                <span>Cancel Editing</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Product Type Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                1. Product Category / Format <span className="text-amber-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setType('ebooks')}
                  className={`flex items-center justify-center gap-2.5 p-3 rounded-2xl border text-xs sm:text-sm font-bold transition-all ${
                    type === 'ebooks'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>📱 Digital eBook / PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('books')}
                  className={`flex items-center justify-center gap-2.5 p-3 rounded-2xl border text-xs sm:text-sm font-bold transition-all ${
                    type === 'books'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>📚 Printed Book</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('stationery')}
                  className={`flex items-center justify-center gap-2.5 p-3 rounded-2xl border text-xs sm:text-sm font-bold transition-all ${
                    type === 'stationery'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <PenTool className="w-4 h-4" />
                  <span>📒 Stationery / Notes</span>
                </button>
              </div>
            </div>

            {/* 2. Basic Info: Title, Cat, Badge, Desc */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              <div className="md:col-span-8">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Product Title <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. SSC CGL Complete Maths Formula Book Tier 1 & 2"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Category / Subject Pill
                </label>
                <input
                  type="text"
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  placeholder="e.g. Quantitative Aptitude"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Promotional Badge
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. 🔥 BESTSELLER or 🎯 TOP CHOICE"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="md:col-span-8">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Description / Features Overview
                </label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={2}
                  placeholder="Key highlights, coverage topics, target exam tier..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

            </div>

            {/* 3. Pricing Box */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                2. Pricing & Value
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Selling Price (₹)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 49"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    MRP / Original Price (₹)
                  </label>
                  <input
                    type="number"
                    value={mrp}
                    onChange={(e) => setMrp(e.target.value)}
                    placeholder="e.g. 199"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <span className="text-xs font-semibold text-slate-400 mb-1">
                    Calculated Discount
                  </span>
                  <div className="text-sm font-extrabold text-emerald-400">
                    {discountPreview > 0 ? `${discountPreview}% OFF` : 'No Discount'}
                  </div>
                </div>
              </div>
              
              {type !== 'ebooks' && (
                <p className="text-[11px] text-amber-300/90 pt-1">
                  💡 <strong>Tip for Books:</strong> Amazon/Flipkart par live price change hota rahta hai, isliye price khali chhodne par automatic <em>"Check Price on Website"</em> dikhega.
                </p>
              )}
            </div>

            {/* 3. Type-Specific Links Section */}
            {type === 'ebooks' ? (
              /* 3A. Digital eBook / PDF Specific Settings */
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      3. Digital eBook / PDF Settings
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Configure how students download or purchase this digital PDF
                    </p>
                  </div>

                  {/* Free Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-700 hover:border-emerald-400 transition-colors">
                    <input
                      type="checkbox"
                      checked={isFree}
                      onChange={(e) => setIsFree(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-800 border-slate-700"
                    />
                    <span className="text-xs font-bold text-emerald-400">
                      Mark as 100% FREE Resource
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isFree ? (
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-emerald-300 mb-1.5">
                        Direct PDF Download Link (Google Drive / Telegram / Direct URL) <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="url"
                        value={downloadUrl}
                        onChange={(e) => setDownloadUrl(e.target.value)}
                        placeholder="https://drive.google.com/... or https://t.me/..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-emerald-500/50 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-400"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Students can click to instantly download this PDF for free without payment.
                      </span>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-amber-300 mb-1.5">
                          Payment Gateway URL (Razorpay / Instamojo / UPI Link) <span className="text-amber-400">*</span>
                        </label>
                        <input
                          type="url"
                          value={paymentUrl}
                          onChange={(e) => setPaymentUrl(e.target.value)}
                          placeholder="https://rzp.io/l/... or Instamojo payment link"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-amber-500/40 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Secure PDF Delivery / Download Link (Post-Payment)
                        </label>
                        <input
                          type="url"
                          value={downloadUrl}
                          onChange={(e) => setDownloadUrl(e.target.value)}
                          placeholder="https://drive.google.com/... (eBook PDF File)"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Optional Landing Page / Course Details URL
                    </label>
                    <input
                      type="url"
                      value={landingPageUrl}
                      onChange={(e) => setLandingPageUrl(e.target.value)}
                      placeholder="https://... (Optional overview webpage link)"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* 3B. Physical Retailer Links (Amazon & Flipkart) - Only shown for Printed Books & Stationery */
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    3. Retailer Buying Links (Amazon & Flipkart Stores)
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Enter official affiliate or product URLs for hardcopy doorstep delivery
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Amazon Affiliate / Buy URL</span>
                      <span className="text-[10px] text-slate-400">amazon.in</span>
                    </label>
                    <input
                      type="url"
                      value={amazon}
                      onChange={(e) => setAmazon(e.target.value)}
                      placeholder="https://amzn.to/..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Flipkart Affiliate / Buy URL</span>
                      <span className="text-[10px] text-slate-400">flipkart.com</span>
                    </label>
                    <input
                      type="url"
                      value={flipkart}
                      onChange={(e) => setFlipkart(e.target.value)}
                      placeholder="https://fkrt.co/..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. Cover Image & Live Preview */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                4. Cover Image
              </span>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Option A: Upload Image File to Firebase Storage
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Option B: Direct Public Image URL
                    </label>
                    <input
                      type="url"
                      value={imgUrl}
                      onChange={(e) => {
                        setImgUrl(e.target.value);
                        setImagePreview(e.target.value);
                      }}
                      placeholder="Paste Image URL or use Upload button above"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Preview Box */}
                <div className="md:col-span-4 flex flex-col items-center">
                  <span className="text-[11px] font-semibold text-slate-400 mb-2">Live Image Preview</span>
                  <div className="w-24 h-32 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center overflow-hidden p-1 shadow-inner">
                    <img
                      src={imagePreview || FALLBACK_IMG}
                      alt="Preview"
                      className="max-h-full max-w-full object-contain rounded"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Publishing & Visibility Controls */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                
                {/* Published vs Draft */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-300">Status:</span>
                  <button
                    type="button"
                    onClick={() => setStatus(status === 'published' ? 'draft' : 'published')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      status === 'published'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                    }`}
                  >
                    {status === 'published' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{status === 'published' ? 'Published (Live)' : 'Draft (Hidden)'}</span>
                  </button>
                </div>

                {/* Featured Toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-800 border-slate-700"
                  />
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    Feature on Homepage
                  </span>
                </label>

              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {editingId && (
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all"
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
                  id="admin-save-product-btn"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Firebase...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingId ? 'Update Product' : 'Save New Product'}</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </form>
        </div>

        {/* Section 2: Inventory Table & Card List */}
        <div className="rounded-3xl bg-[#0F2439] border border-slate-800 p-6 sm:p-8 space-y-5">
          
          {/* Header & Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Product Inventory</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {filteredProducts.length} Items
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Manage, edit, duplicate, or delete study resources in Firestore
              </p>
            </div>

            {/* Filter inputs */}
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Filter inventory..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Type Select */}
              <select
                value={tableTypeFilter}
                onChange={(e) => setTableTypeFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="all">All Types</option>
                <option value="ebooks">📱 eBooks</option>
                <option value="books">📚 Books</option>
                <option value="stationery">📒 Stationery</option>
              </select>

              {/* Status Select */}
              <select
                value={tableStatusFilter}
                onChange={(e) => setTableStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
                <option value="featured">Featured Only</option>
              </select>

            </div>
          </div>

          {/* Inventory Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0A1624] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Cover</th>
                  <th className="p-3.5">Product Title & Category</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Pricing</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-[#0F2439]">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Cover */}
                    <td className="p-3.5">
                      <div className="w-10 h-14 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-0.5">
                        <img 
                          src={p.img || FALLBACK_IMG} 
                          alt="" 
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </td>

                    {/* Title & Details */}
                    <td className="p-3.5 max-w-xs">
                      <div className="font-bold text-white line-clamp-1">{p.title}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {p.cat && (
                          <span className="text-[10px] text-amber-400 font-semibold">{p.cat}</span>
                        )}
                        {p.badge && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 rounded">
                            {p.badge}
                          </span>
                        )}
                        {p.featured && (
                          <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-1.5 rounded font-bold">
                            ⭐ Featured
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-medium">
                        {typeLabel(p.type)}
                      </span>
                    </td>

                    {/* Pricing */}
                    <td className="p-3.5 whitespace-nowrap">
                      {p.type === 'ebooks' && p.free !== false ? (
                        <span className="text-emerald-400 font-bold">100% FREE</span>
                      ) : p.price ? (
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-amber-400">₹{p.price}</span>
                          {p.mrp && <span className="line-through text-slate-400 text-[10px]">₹{p.mrp}</span>}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No price</span>
                      )}
                    </td>

                    {/* Status Pill */}
                    <td className="p-3.5 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(p)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                          p.status !== 'draft'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30'
                        }`}
                        title="Click to toggle Status"
                      >
                        {p.status !== 'draft' ? '● Published' : '○ Draft'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Edit */}
                        <button
                          onClick={() => handleStartEdit(p)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition-colors"
                          title="Edit Product"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Duplicate */}
                        <button
                          onClick={() => handleDuplicate(p)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Duplicate as Draft"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete with Confirm */}
                        {deleteConfirmId === p.id ? (
                          <div className="flex items-center gap-1 bg-red-950 border border-red-800 p-1 rounded-lg">
                            <button
                              onClick={() => handleDelete(p.id, p.img)}
                              className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[10px]"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="p-0.5 text-slate-400 hover:text-white"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/60 hover:text-red-300 text-slate-400 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                      </div>
                    </td>

                  </tr>
                ))}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No products match your inventory filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
};
