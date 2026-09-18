"use client";

import { useState } from "react";
import { MessageSquare, Mail, Phone, X, Sparkles, Clock, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConciergeCallWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 print:hidden font-sans">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs sm:hidden z-40"
            />

            {/* Concierge Popover Card */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute bottom-16 right-0 w-[330px] sm:w-[360px] bg-brand-midnight text-brand-snow rounded-2xl shadow-large border border-brand-charcoal overflow-hidden z-50"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-brand-midnight via-[#17171C] to-brand-midnight p-5 border-b border-white/10 relative">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 text-brand-silver/60 hover:text-brand-snow p-1 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Close concierge"
                >
                  <X size={16} />
                </button>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] uppercase tracking-widest font-mono text-brand-champagne font-bold">
                    SN24 Concierge Online
                  </span>
                </div>
                <h3 className="font-display font-semibold text-lg text-brand-snow">
                  How May We Assist You?
                </h3>
                <p className="text-xs text-brand-silver/80 mt-1 leading-relaxed">
                  Connect directly with our stylists for sizing guidance, delivery questions, or custom requests.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="p-4 space-y-3 bg-[#111115]">
                {/* WhatsApp Stylist */}
                <a
                  href="https://wa.me/234800645597?text=Hello%20SN24,%20I'd%20like%20assistance%20with%20sizing%20and%20orders."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-all shadow-md group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <MessageSquare size={15} />
                    </div>
                    <div className="text-left">
                      <span className="block font-bold text-xs leading-tight">Chat on WhatsApp</span>
                      <span className="block text-[10px] text-emerald-100 font-normal">Instant stylist & sizing advice</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-black/20 font-mono font-bold px-2 py-0.5 rounded">
                    Fastest
                  </span>
                </a>

                {/* Email Support */}
                <a
                  href="mailto:hello@sn24.com.ng"
                  className="w-full bg-white/5 hover:bg-white/10 text-brand-snow border border-white/10 p-3.5 rounded-xl font-semibold text-xs tracking-wide flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-champagne/20 text-brand-champagne flex items-center justify-center">
                      <Mail size={15} />
                    </div>
                    <div className="text-left">
                      <span className="block font-semibold text-xs">Email Concierge</span>
                      <span className="block text-[10px] text-brand-champagne font-mono">hello@sn24.com.ng</span>
                    </div>
                  </div>
                </a>

                {/* Phone Call Support */}
                <a
                  href="tel:+2348007624"
                  className="w-full bg-white/5 hover:bg-white/10 text-brand-snow border border-white/10 p-3.5 rounded-xl font-semibold text-xs tracking-wide flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white/10 text-brand-silver flex items-center justify-center">
                      <Phone size={15} />
                    </div>
                    <div className="text-left">
                      <span className="block font-semibold text-xs">Telephone Hotline</span>
                      <span className="block text-[10px] text-brand-silver/70 font-mono">+234 (0) 800 SN24</span>
                    </div>
                  </div>
                </a>
              </div>

              {/* Footer reassurance */}
              <div className="px-4 py-3 bg-black/40 border-t border-white/5 flex items-center justify-between text-[10px] text-brand-silver/60">
                <span className="flex items-center gap-1">
                  <Clock size={11} className="text-brand-champagne" /> Mon–Sat 8AM–8PM WAT
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck size={11} className="text-emerald-400" /> Guaranteed Response
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Floating Trigger Pill */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="flex items-center gap-2.5 bg-brand-midnight text-brand-snow px-4 py-3 rounded-full shadow-large border border-brand-champagne/40 hover:border-brand-champagne transition-all group"
        aria-label="Open SN24 Concierge"
      >
        <div className="relative flex items-center justify-center">
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative"></span>
        </div>
        <MessageSquare size={16} className="text-brand-champagne group-hover:scale-110 transition-transform duration-300" />
        <span className="text-xs font-bold uppercase tracking-wider text-brand-snow">
          SN24 Concierge
        </span>
      </motion.button>
    </div>
  );
}
