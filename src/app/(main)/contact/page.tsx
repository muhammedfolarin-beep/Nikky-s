"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Plus, Minus, Send, CheckCircle2, MessageSquare, Clock, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";

const faqs = [
  {
    question: "What are your delivery options within Lagos and across Nigeria?",
    answer: "For Lagos orders, we provide direct Local Courier Dispatch (1–2 business days) with rates tiered by your local zone. For all other 35 states and FCT Abuja, we route shipments exclusively through GIG Logistics Express (3–5 business days) with full tracking. International orders are handled by DHL/FedEx Express."
  },
  {
    question: "How do custom made-to-measure measurements work?",
    answer: "When you select 'Bespoke Custom Tailoring' on any garment, you can provide your bust, waist, hips, and preferred length. If you'd like guidance, reach out to our concierge team on WhatsApp or via email at hello@sn24.com.ng."
  },
  {
    question: "What payment channels are supported?",
    answer: "We accept all Nigerian and International Debit/Credit cards (Visa, Mastercard, Verve), Instant Direct Bank Transfers with automatic verification, and USSD via our secured Paystack payment gateway."
  },
  {
    question: "How do I track my delivery?",
    answer: "Once your package is handed to the dispatch rider or registered with GIG Logistics, you receive an SMS/email notification with your tracking details. You can also view orders in your SN24 account dashboard."
  },
  {
    question: "What is your exchange policy?",
    answer: "For ready-to-wear pieces, we accommodate exchanges or returns within 14 days of delivery. For custom bespoke pieces, complimentary fitting adjustments are provided if fine-tuning is required."
  }
];

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-brand-softwhite font-sans">
      {/* Hero Banner */}
      <div className="relative h-[40vh] w-full flex items-center justify-center overflow-hidden bg-brand-midnight">
        <Image 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop" 
          alt="SN24 Concierge" 
          fill 
          className="object-cover opacity-30" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight via-brand-midnight/60 to-transparent" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-brand-champagne bg-brand-champagne/10 border border-brand-champagne/30 px-3 py-1 rounded-full inline-block mb-3">
            SN24 Client Concierge
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white mb-3 tracking-tight font-bold">
            Concierge & Support
          </h1>
          <p className="text-brand-silver/90 text-sm sm:text-base font-light max-w-xl mx-auto leading-relaxed">
            Get in touch with our team for styling consultations, order tracking, and bespoke inquiries.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16 py-16">
        
        {/* TOP CONTACT CARDS */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* WhatsApp Stylist */}
            <div className="bg-brand-midnight text-brand-snow rounded-2xl p-7 shadow-medium border border-brand-charcoal flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <MessageSquare size={22} />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-1">
                  Instant Messaging
                </span>
                <h3 className="font-display text-xl font-bold text-white mb-2">
                  VIP Stylist on WhatsApp
                </h3>
                <p className="text-xs text-brand-silver/80 leading-relaxed mb-6 font-light">
                  Direct chat for fast fitting advice, styling recommendations, and order inquiries.
                </p>
              </div>

              <a
                href="https://wa.me/234800645597?text=Hello%20SN24,%20I'd%20like%20to%20consult%20on%20sizing%20and%20orders."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <MessageSquare size={14} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Email Concierge */}
            <div className="bg-white rounded-2xl p-7 shadow-soft border border-brand-stone flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-brand-champagne/10 text-brand-midnight flex items-center justify-center mb-4">
                  <Mail size={22} />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-brand-midnight font-bold block mb-1">
                  Primary Email
                </span>
                <h3 className="font-display text-xl font-bold text-brand-midnight mb-2">
                  Client Concierge
                </h3>
                <p className="text-xs text-brand-graphite leading-relaxed mb-6">
                  For order tracking, bespoke wedding/event requests, and general support.
                </p>
              </div>

              <a
                href="mailto:hello@sn24.com.ng"
                className="w-full bg-brand-midnight hover:bg-brand-charcoal text-white py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Mail size={14} />
                <span>hello@sn24.com.ng</span>
              </a>
            </div>

            {/* Telephone Line */}
            <div className="bg-white rounded-2xl p-7 shadow-soft border border-brand-stone flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-brand-stone/40 text-brand-midnight flex items-center justify-center mb-4">
                  <Phone size={22} />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-brand-midnight font-bold block mb-1">
                  Phone Assistance
                </span>
                <h3 className="font-display text-xl font-bold text-brand-midnight mb-2">
                  SN24 Phone Line
                </h3>
                <p className="text-xs text-brand-graphite leading-relaxed mb-6">
                  Available Mon–Sat 8:00 AM – 8:00 PM WAT for urgent dispatch & order assistance.
                </p>
              </div>

              <a
                href="tel:+2348007624"
                className="w-full bg-white text-brand-midnight border border-brand-stone hover:bg-brand-stone/20 py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Phone size={14} />
                <span>+234 (0) 800 SN24</span>
              </a>
            </div>
          </div>
        </div>

        {/* MAIN SPLIT: CONTACT FORM & FAQS */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Column: Contact Form */}
          <div className="flex-1 bg-white border border-brand-stone p-8 sm:p-10 rounded-2xl shadow-soft relative overflow-hidden">
            <AnimatePresence>
              {isSuccess && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 bg-white flex flex-col items-center justify-center text-center p-8"
                >
                  <CheckCircle2 className="text-emerald-600 mb-4" size={52} />
                  <h3 className="font-display text-2xl font-bold text-brand-midnight mb-2">Message Sent</h3>
                  <p className="text-brand-graphite text-sm max-w-md">Thank you for reaching out. An SN24 representative will respond to your inquiry shortly.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-brand-champagne block mb-1">
              Send an Inquiry
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-midnight mb-6">
              How May We Assist You?
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal uppercase tracking-wider mb-2">
                    Your Name *
                  </label>
                  <input 
                    required 
                    type="text" 
                    className="w-full bg-brand-softwhite border border-brand-stone rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-champagne transition-colors" 
                    placeholder="Full Name" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <input 
                    required 
                    type="email" 
                    className="w-full bg-brand-softwhite border border-brand-stone rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-champagne transition-colors" 
                    placeholder="email@example.com" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal uppercase tracking-wider mb-2">
                    Phone Number (Optional)
                  </label>
                  <input 
                    type="tel" 
                    className="w-full bg-brand-softwhite border border-brand-stone rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-champagne transition-colors" 
                    placeholder="+234..." 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-charcoal uppercase tracking-wider mb-2">
                    Inquiry Topic
                  </label>
                  <select className="w-full bg-brand-softwhite border border-brand-stone rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-champagne transition-colors text-brand-midnight">
                    <option>Sizing & Fit Consultation</option>
                    <option>Delivery Logistics & Tracking</option>
                    <option>Bespoke / Custom Order</option>
                    <option>General Client Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-charcoal uppercase tracking-wider mb-2">
                  Message *
                </label>
                <textarea 
                  required 
                  rows={4} 
                  className="w-full bg-brand-softwhite border border-brand-stone rounded-lg p-4 text-sm focus:outline-none focus:border-brand-champagne transition-colors resize-none" 
                  placeholder="Please describe your inquiry, order reference, or custom tailoring requirement..."
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-brand-midnight text-brand-snow px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-charcoal transition-all disabled:opacity-70 shadow-medium"
              >
                {isSubmitting ? "Transmitting..." : (
                  <>Send Message <Send size={14} /></>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: FAQs */}
          <div className="flex-1 lg:max-w-md">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-brand-champagne block mb-1">
              SN24 Guidance
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-midnight mb-6">
              Frequently Asked Questions
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-brand-stone bg-white rounded-xl p-4 shadow-2xs">
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <span className="font-semibold text-xs sm:text-sm text-brand-midnight group-hover:text-brand-champagne transition-colors">
                      {faq.question}
                    </span>
                    <span className="text-brand-graphite ml-3 shrink-0">
                      {openFaq === index ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs text-brand-graphite pt-3 leading-relaxed border-t border-brand-stone/40 mt-3 font-light">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            
            {/* Operating Hours Box */}
            <div className="mt-8 p-6 bg-brand-midnight text-brand-snow rounded-2xl border border-brand-charcoal space-y-3">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-brand-champagne" />
                <h3 className="font-display font-semibold text-sm text-white">Concierge Hours</h3>
              </div>
              <p className="text-xs text-brand-silver/80 leading-relaxed font-light">
                Our support team is active <strong>Monday through Saturday, 8:00 AM – 8:00 PM (WAT)</strong>.
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-[11px] text-emerald-400">
                <Truck size={14} />
                <span>Daily dispatch across Lagos & GIG nationwide.</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
