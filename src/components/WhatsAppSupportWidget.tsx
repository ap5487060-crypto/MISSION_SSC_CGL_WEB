import React, { useState } from 'react';
import { 
  WHATSAPP_SUPPORT_NUMBER, 
  WHATSAPP_SUPPORT_URL 
} from '../constants';
import { 
  MessageCircle, 
  X, 
  Send, 
  CheckCircle, 
  Sparkles, 
  Zap, 
  FileText, 
  CreditCard 
} from 'lucide-react';

export const WhatsAppSupportWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const quickTemplates = [
    { label: "💳 Payment/UPI Issue", text: "Hello Abhishek Sir, I faced an issue while paying for SSC CGL study notes. Please assist me with manual UPI or PDF access." },
    { label: "📥 Direct PDF Delivery", text: "Hello Sir, I want to purchase SSC CGL handwritten notes directly on WhatsApp. Please share UPI QR / payment details." },
    { label: "⚡ Formula Handbook Access", text: "Hello Sir, I have a query regarding the Formula Handbook & English 100 Golden Rules material." }
  ];

  const handleSend = (textToSend?: string) => {
    const message = textToSend || customMsg || "Hello Sir, I need help with SSC CGL PDF study materials / UPI Payment.";
    const url = `${WHATSAPP_SUPPORT_URL}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Expanded Quick Support Modal Popup */}
      {isOpen && (
        <div className="mb-3 w-[90vw] max-w-sm rounded-3xl bg-[#091524] border border-emerald-500/40 p-5 shadow-2xl shadow-emerald-950/60 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/30">
                  <MessageCircle className="w-5 h-5 fill-slate-950" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#091524] rounded-full animate-pulse" />
              </div>

              <div>
                <div className="text-sm font-black text-white flex items-center gap-1.5 font-['Outfit',sans-serif]">
                  <span>WhatsApp Direct Support</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <span>+91 {WHATSAPP_SUPPORT_NUMBER}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-emerald-300">Quick Reply</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick context info */}
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Got a UPI / payment issue or want direct PDF delivery on your WhatsApp number? Tap below to connect instantly:
          </p>

          {/* Quick template buttons */}
          <div className="space-y-2 mb-4">
            {quickTemplates.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(item.text)}
                className="w-full text-left px-3 py-2 rounded-xl bg-[#060E18] hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/40 text-xs font-semibold text-slate-200 transition-all flex items-center justify-between group"
              >
                <span>{item.label}</span>
                <Send className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-colors ml-2 flex-shrink-0" />
              </button>
            ))}
          </div>

          {/* Custom message input */}
          <div className="relative">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Type your message / issue..."
              className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-[#060E18] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-all"
            />
            <button
              onClick={() => handleSend()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* Floating WhatsApp Action Button */}
      <button
        id="whatsapp-direct-support-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/30 border border-emerald-300/40 transition-all duration-300 transform hover:scale-105 active:scale-95"
        title="Connect on WhatsApp (8957154976)"
      >
        <MessageCircle className="w-5 h-5 fill-slate-950 group-hover:rotate-12 transition-transform duration-300" />
        <span className="hidden sm:inline font-bold">WhatsApp PDF Order / Support</span>
        <span className="sm:hidden font-bold">WhatsApp Support</span>
        
        {/* Pulse ring */}
        <span className="absolute -inset-0.5 rounded-full bg-emerald-400/40 animate-ping -z-10 opacity-75" />
      </button>
    </div>
  );
};
