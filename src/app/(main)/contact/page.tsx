"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Plus, Minus, Send, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Metadata } from "next";

const faqs = [
  {
    question: "What is your return policy?",
    answer: "We accept returns within 30 days of purchase. Items must be unworn, unwashed, and in their original packaging with all tags attached. Refunds are processed to the original payment method within 5-7 business days."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship globally! International shipping typically takes 7-14 business days. Please note that customs duties and taxes are not included in the checkout total and may be charged upon delivery."
  },
  {
    question: "How do I track my order?",
    answer: "Once your order ships, you will receive a confirmation email containing a tracking number and a link to trace your package. You can also view order status in your Account Dashboard."
  },
  {
    question: "Can I change or cancel my order?",
    answer: "We process orders very quickly. If you need to make a change or cancel, please contact us within 1 hour of placing the order. Once an order is being packed, we can no longer modify it."
  },
  {
    question: "How do I know my correct size?",
    answer: "Our garments are tailored to standard international sizing. We recommend checking the 'Size Guide' available on every product page, which includes detailed measurements and fit notes."
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
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Reset after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-brand-softwhite">
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full flex items-center justify-center overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop" 
          alt="Contact Us" 
          fill 
          className="object-cover" 
        />
        <div className="absolute inset-0 bg-brand-midnight/70" />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-display text-4xl md:text-6xl text-white mb-4 tracking-tight">Contact Us</h1>
          <p className="text-brand-snow text-lg max-w-2xl mx-auto">We're here to help. Reach out to our dedicated support team or find answers in our FAQs.</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16 py-20">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Column: Form & Info */}
          <div className="flex-1">
            <div className="mb-12">
              <h2 className="font-display text-3xl text-brand-midnight mb-6">Get in Touch</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="flex flex-col items-center text-center p-6 bg-white border border-brand-stone rounded-xl">
                  <Mail className="text-brand-midnight mb-4" size={24} />
                  <h3 className="font-semibold text-brand-midnight text-sm mb-2">Email</h3>
                  <p className="text-brand-graphite text-sm">support@nikkys.com</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-white border border-brand-stone rounded-xl">
                  <Phone className="text-brand-midnight mb-4" size={24} />
                  <h3 className="font-semibold text-brand-midnight text-sm mb-2">Phone</h3>
                  <p className="text-brand-graphite text-sm">+1 (800) 123-4567</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-white border border-brand-stone rounded-xl">
                  <MapPin className="text-brand-midnight mb-4" size={24} />
                  <h3 className="font-semibold text-brand-midnight text-sm mb-2">Studio</h3>
                  <p className="text-brand-graphite text-sm">New York, NY 10012</p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white border border-brand-stone p-8 rounded-xl relative overflow-hidden">
                <AnimatePresence>
                  {isSuccess && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-10 bg-white flex flex-col items-center justify-center text-center p-8"
                    >
                      <CheckCircle2 className="text-green-500 mb-4" size={48} />
                      <h3 className="font-display text-2xl text-brand-midnight mb-2">Message Sent!</h3>
                      <p className="text-brand-graphite">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <h3 className="font-display text-2xl text-brand-midnight mb-6">Send a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-brand-graphite uppercase tracking-wide mb-2">Name</label>
                      <input required type="text" className="w-full bg-transparent border-b border-brand-stone py-2 focus:outline-none focus:border-brand-champagne transition-colors" placeholder="Jane Doe" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brand-graphite uppercase tracking-wide mb-2">Email</label>
                      <input required type="email" className="w-full bg-transparent border-b border-brand-stone py-2 focus:outline-none focus:border-brand-champagne transition-colors" placeholder="jane@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-graphite uppercase tracking-wide mb-2">Subject</label>
                    <input required type="text" className="w-full bg-transparent border-b border-brand-stone py-2 focus:outline-none focus:border-brand-champagne transition-colors" placeholder="Order Inquiry" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-graphite uppercase tracking-wide mb-2">Message</label>
                    <textarea required rows={4} className="w-full bg-transparent border-b border-brand-stone py-2 focus:outline-none focus:border-brand-champagne transition-colors resize-none" placeholder="How can we help you today?"></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full md:w-auto bg-brand-midnight text-brand-snow px-8 py-4 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-brand-charcoal transition-colors disabled:opacity-70"
                  >
                    {isSubmitting ? "Sending..." : (
                      <>Send Message <Send size={16} /></>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column: FAQs */}
          <div className="flex-1 lg:max-w-md">
            <h2 className="font-display text-3xl text-brand-midnight mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-brand-stone pb-4">
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between py-2 text-left group"
                  >
                    <span className="font-medium text-brand-midnight group-hover:text-brand-champagne transition-colors">{faq.question}</span>
                    <span className="text-brand-graphite ml-4">
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
                        <p className="text-sm text-brand-graphite pt-4 leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-6 bg-brand-mist rounded-xl border border-brand-stone/50 text-center">
              <h3 className="font-medium text-brand-midnight mb-2">Still need help?</h3>
              <p className="text-sm text-brand-graphite">Our customer service team is available Monday through Friday, 9AM to 6PM EST.</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
