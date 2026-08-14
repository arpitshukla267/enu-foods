import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ShieldCheck, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    queryType: 'General Inquiry',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="pt-12 sm:pt-24 pb-20 bg-[#F7F5EF] min-h-screen text-left">
      
      {/* Contact Hero Banner */}
      <div className="bg-[#1E3A2B] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center max-w-3xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#D6A146] font-btn bg-[#D6A146]/20 px-3 py-1 rounded-full border border-[#D6A146]/30 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> We Are Here To Help
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold">
            Get In Touch With ENU Foods
          </h1>
          <p className="font-body text-white/80 mt-2 text-base font-light">
            Have questions about our spice purity, bulk distribution, or store availability? Connect with our team directly.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Address & Details */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-3xl p-8 border border-[#D6A146]/20 shadow-lg space-y-6">
              
              <h2 className="font-heading text-2xl font-bold text-[#1D1D1D]">
                Head Office & Manufacturing Hub
              </h2>

              <div className="space-y-4 text-sm font-body text-gray-700">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#284C38]/10 text-[#284C38] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#284C38]" />
                  </div>
                  <div>
                    <strong className="text-[#1D1D1D] block font-semibold">Corporate Address:</strong>
                    <span>ENU Foods Spice Park, Plot 42, Organic Agro Infrastructure Zone, Gujarat 380001, India</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#284C38]/10 text-[#284C38] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#284C38]" />
                  </div>
                  <div>
                    <strong className="text-[#1D1D1D] block font-semibold">Customer Support Hotline:</strong>
                    <span className="text-[#284C38] font-bold">+91 1800-200-3688 (Toll Free)</span> <br />
                    <span className="text-xs text-gray-500">+91 98765 43210 (Distribution Queries)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#284C38]/10 text-[#284C38] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#284C38]" />
                  </div>
                  <div>
                    <strong className="text-[#1D1D1D] block font-semibold">Email Enquiries:</strong>
                    <span>care@enufoods.com (General)</span> <br />
                    <span>sales@enufoods.com (Bulk / Distributorship)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-2 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-[#284C38]/10 text-[#284C38] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[#284C38]" />
                  </div>
                  <div>
                    <strong className="text-[#1D1D1D] block font-semibold">Working Hours:</strong>
                    <span>Monday - Saturday: 9:00 AM - 7:00 PM IST</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Google Maps Visual Interactive Placeholder */}
            <div className="bg-[#1E3A2B] rounded-3xl p-6 text-white border border-[#D6A146]/30 shadow-lg relative overflow-hidden">
              <div className="relative z-10 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D6A146] font-btn flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> Global Manufacturing Unit
                </span>
                <h3 className="font-heading text-xl font-bold">
                  ENU Agro Spice Park, India
                </h3>
                <p className="text-xs text-white/80 font-body font-light">
                  Aseptic cold-milling plant equipped with European optical sorters and automated packaging lines.
                </p>
                <div className="h-36 w-full rounded-2xl bg-[#284C38] border border-[#D6A146]/20 flex items-center justify-center text-xs text-[#D6A146] font-btn font-semibold relative overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80')" }} />
                  <span className="relative z-10 bg-[#1D1D1D]/90 px-4 py-2 rounded-full border border-[#D6A146]/50">
                    📍 Map Location: Gujarat Agro Park
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-[#D6A146]/20 shadow-xl">
            
            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C86D39] font-btn mb-1">
                <MessageSquare className="w-4 h-4" /> Send Message
              </div>
              <h2 className="font-heading text-3xl font-bold text-[#1D1D1D]">
                How Can We Help You?
              </h2>
              <p className="font-body text-xs text-gray-600 mt-1 font-light">
                Fill out the form below and our team will get back to you within 24 business hours.
              </p>
            </div>

            {isSubmitted ? (
              <div className="bg-[#284C38]/10 border border-[#284C38] p-8 rounded-2xl text-center space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-[#284C38] text-[#D6A146] flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-[#284C38]">
                  Message Received Successfully!
                </h3>
                <p className="font-body text-sm text-gray-700 font-light leading-relaxed max-w-md mx-auto">
                  Thank you for reaching out to ENU Foods. Our spice relationship representative will contact you shortly on your provided details.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="bg-[#284C38] text-white text-xs font-semibold px-6 py-3 rounded-full font-btn shadow-md hover:bg-[#1E3A2B] transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-btn mb-1.5">
                      Your Full Name *
                    </label>
                    <input 
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full bg-[#F7F5EF] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#284C38] font-body"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-btn mb-1.5">
                      Phone Number *
                    </label>
                    <input 
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-[#F7F5EF] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#284C38] font-body"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-btn mb-1.5">
                      Email Address *
                    </label>
                    <input 
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="e.g. ramesh@example.com"
                      className="w-full bg-[#F7F5EF] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#284C38] font-body"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-btn mb-1.5">
                      Query Purpose
                    </label>
                    <select
                      value={formData.queryType}
                      onChange={(e) => setFormData({...formData, queryType: e.target.value})}
                      className="w-full bg-[#F7F5EF] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#284C38] font-body"
                    >
                      <option value="General Inquiry">General Product Inquiry</option>
                      <option value="Distributorship">Retail / Wholesale Distributorship</option>
                      <option value="Quality Certification">Quality & Lab Assay Report Request</option>
                      <option value="Export Inquiry">International Export Enquiries</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-btn mb-1.5">
                    Your Message / Requirements *
                  </label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Tell us about your query or requirement..."
                    className="w-full bg-[#F7F5EF] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#284C38] font-body"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#284C38] hover:bg-[#1E3A2B] text-white font-semibold text-sm py-4 px-8 rounded-xl font-btn shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <Send className="w-4 h-4 text-[#D6A146] group-hover:translate-x-1 transition-transform" />
                  <span>Submit Form Message</span>
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
