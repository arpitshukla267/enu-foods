import React, { useState } from 'react';
import { CartItem, ShippingAddress, PaymentMethod, OrderDetails } from '../types';
import { X, Check, ShieldCheck, MapPin, CreditCard, Truck, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CheckoutWizardProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onClearCart: () => void;
}

export const CheckoutWizard: React.FC<CheckoutWizardProps> = ({
  isOpen,
  onClose,
  cartItems,
  onClearCart
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  
  // Shipping Address Form State
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: 'Rahul Sharma',
    phone: '9876543210',
    pincode: '110001',
    addressLine: 'A-42, Green Park Main, Near Metro Gate 2',
    city: 'New Delhi',
    state: 'Delhi'
  });

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'free' | 'express'>('free');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');

  // Order Result State
  const [completedOrder, setCompletedOrder] = useState<OrderDetails | null>(null);

  if (!isOpen) return null;

  // Subtotals
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingCost = shippingMethod === 'express' ? 49 : 0;
  const finalTotal = subtotal + shippingCost;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      if (!address.fullName || !address.phone || !address.pincode || !address.addressLine) {
        alert('Please fill out all address fields.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Place Order Success
      const newOrder: OrderDetails = {
        orderId: `ENU-${Math.floor(100000 + Math.random() * 900000)}`,
        items: [...cartItems],
        shippingAddress: { ...address },
        paymentMethod: paymentMethod,
        subtotal: subtotal,
        discount: 0,
        total: finalTotal,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      };
      setCompletedOrder(newOrder);
      setCurrentStep(4);
      onClearCart();
    }
  };

  const WIZARD_STEPS = [
    { id: 1, name: 'Address', icon: <MapPin className="w-4 h-4" /> },
    { id: 2, name: 'Shipping', icon: <Truck className="w-4 h-4" /> },
    { id: 3, name: 'Payment', icon: <CreditCard className="w-4 h-4" /> },
    { id: 4, name: 'Confirmed', icon: <CheckCircle2 className="w-4 h-4" /> }
  ];

  // Calculate wizard line progress (0%, 33%, 66%, 100%)
  const lineProgress = ((currentStep - 1) / (WIZARD_STEPS.length - 1)) * 100;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 text-left overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={currentStep === 4 ? onClose : undefined}
      />

      {/* Main Wizard Modal Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-[#D6A146]/40 flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-[#284C38] text-white p-5 sm:p-6 flex items-center justify-between border-b border-[#D6A146]/30">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight">
              ENU FOODS CHECKOUT
            </h2>
            <p className="text-xs text-[#D6A146] font-body mt-0.5">
              100% Secure Encrypted Direct Checkout
            </p>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Premium Horizontal Wizard Tracker */}
        <div className="bg-[#1E3A2B] px-6 py-6 border-b border-[#D6A146]/30 text-white relative">
          
          {/* Desktop Horizontal Wizard */}
          <div className="hidden sm:block relative max-w-xl mx-auto">
            
            {/* Background Grey Line */}
            <div className="absolute top-5 left-6 right-6 h-1 bg-white/20 rounded-full" />

            {/* Animate Progress Line Left -> Right */}
            <motion.div 
              className="absolute top-5 left-6 h-1 bg-gradient-to-r from-[#D6A146] to-emerald-400 rounded-full shadow-[0_0_12px_#D6A146]"
              initial={{ width: "0%" }}
              animate={{ width: `calc(${lineProgress}% * 0.88)` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />

            {/* Steps Row */}
            <div className="relative z-10 flex items-center justify-between">
              {WIZARD_STEPS.map((step) => {
                const isCompleted = step.id < currentStep;
                const isActive = step.id === currentStep;

                return (
                  <div key={step.id} className="flex flex-col items-center">
                    
                    {/* Circle Node with Scale & Glow Animation */}
                    <motion.div 
                      animate={{ 
                        scale: isActive ? 1.2 : 1,
                        boxShadow: isActive ? "0 0 20px #D6A146" : "0 0 0px transparent"
                      }}
                      transition={{ duration: 0.3 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-colors ${
                        isCompleted 
                          ? 'bg-[#D6A146] text-[#1D1D1D] border-white' 
                          : isActive 
                            ? 'bg-[#284C38] text-white border-[#D6A146]' 
                            : 'bg-[#1E3A2B] text-gray-400 border-white/20'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 text-[#1D1D1D]" />
                      ) : (
                        <span>0{step.id}</span>
                      )}
                    </motion.div>

                    {/* Step Title */}
                    <span className={`text-[11px] font-bold font-btn mt-2 uppercase tracking-wider ${
                      isActive ? 'text-[#D6A146]' : isCompleted ? 'text-white' : 'text-gray-400'
                    }`}>
                      {step.name}
                    </span>

                  </div>
                );
              })}
            </div>

          </div>

          {/* Mobile Vertical / Compact Wizard */}
          <div className="sm:hidden flex items-center justify-between text-xs font-btn">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#D6A146] text-[#1D1D1D] font-bold flex items-center justify-center">
                0{currentStep}
              </div>
              <div>
                <div className="text-[#D6A146] font-bold">
                  Step {currentStep} of 4: {WIZARD_STEPS[currentStep - 1].name}
                </div>
                <div className="text-[10px] text-gray-300">Pan-India Express Delivery</div>
              </div>
            </div>

            <div className="w-20 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#D6A146] transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>

        </div>

        {/* Wizard Body with Fade Transitions */}
        <div className="p-6 overflow-y-auto space-y-6">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              
              {/* STEP 1: SHIPPING ADDRESS */}
              {currentStep === 1 && (
                <form id="address-form" onSubmit={handleNextStep} className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#284C38] font-heading">
                    <MapPin className="w-4 h-4 text-[#D6A146]" />
                    <span>Enter Shipping Address</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                      <input 
                        type="text" 
                        required
                        value={address.fullName}
                        onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#284C38] focus:outline-none"
                        placeholder="e.g. Rahul Sharma"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number *</label>
                      <input 
                        type="tel" 
                        required
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#284C38] focus:outline-none"
                        placeholder="e.g. 9876543210"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Pincode *</label>
                      <input 
                        type="text" 
                        required
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#284C38] focus:outline-none"
                        placeholder="6-digit PIN"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">City *</label>
                      <input 
                        type="text" 
                        required
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#284C38] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Flat / House No / Road / Area *</label>
                    <textarea 
                      required
                      rows={2}
                      value={address.addressLine}
                      onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#284C38] focus:outline-none"
                      placeholder="Street name, house number, landmark..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">State *</label>
                    <input 
                      type="text" 
                      required
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#284C38] focus:outline-none"
                    />
                  </div>

                </form>
              )}

              {/* STEP 2: SHIPPING METHOD */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#284C38] font-heading">
                    <Truck className="w-4 h-4 text-[#D6A146]" />
                    <span>Select Delivery Speed</span>
                  </div>

                  <div className="space-y-3">
                    <label 
                      className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                        shippingMethod === 'free' ? 'border-[#284C38] bg-[#284C38]/5 shadow-md' : 'border-gray-200'
                      }`}
                      onClick={() => setShippingMethod('free')}
                    >
                      <div className="flex items-center gap-3">
                        <input type="radio" checked={shippingMethod === 'free'} readOnly className="text-[#284C38]" />
                        <div>
                          <div className="text-xs font-bold text-[#1D1D1D]">Standard Pan-India Express Delivery</div>
                          <div className="text-[11px] text-gray-500">Delivered in 2 to 3 Business Days</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                        FREE
                      </span>
                    </label>

                    <label 
                      className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                        shippingMethod === 'express' ? 'border-[#284C38] bg-[#284C38]/5 shadow-md' : 'border-gray-200'
                      }`}
                      onClick={() => setShippingMethod('express')}
                    >
                      <div className="flex items-center gap-3">
                        <input type="radio" checked={shippingMethod === 'express'} readOnly className="text-[#284C38]" />
                        <div>
                          <div className="text-xs font-bold text-[#1D1D1D]">Priority Air Courier (Fastest)</div>
                          <div className="text-[11px] text-gray-500">Delivered in 24 to 36 Hours</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#284C38]">
                        +₹49
                      </span>
                    </label>
                  </div>

                  {/* Summary */}
                  <div className="bg-[#F7F5EF] p-4 rounded-2xl border border-gray-200 text-xs space-y-1">
                    <div className="font-bold text-[#284C38] font-heading">Deliver To:</div>
                    <div className="text-gray-700">
                      {address.fullName} ({address.phone}) <br />
                      {address.addressLine}, {address.city}, {address.state} - {address.pincode}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT OPTIONS */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#284C38] font-heading">
                    <CreditCard className="w-4 h-4 text-[#D6A146]" />
                    <span>Select Payment Method</span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    
                    <label 
                      className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                        paymentMethod === 'upi' ? 'border-[#284C38] bg-[#284C38]/5 shadow-md' : 'border-gray-200'
                      }`}
                      onClick={() => setPaymentMethod('upi')}
                    >
                      <div className="flex items-center gap-3">
                        <input type="radio" checked={paymentMethod === 'upi'} readOnly />
                        <div>
                          <div className="text-xs font-bold text-[#1D1D1D]">Instant UPI (GPay / PhonePe / Paytm / BHIM)</div>
                          <div className="text-[11px] text-emerald-700 font-medium">Instant Cashback Eligible</div>
                        </div>
                      </div>
                      <span className="text-xs bg-[#D6A146] text-[#1D1D1D] px-2 py-0.5 rounded font-bold font-btn">
                        RECOMMENDED
                      </span>
                    </label>

                    <label 
                      className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                        paymentMethod === 'card' ? 'border-[#284C38] bg-[#284C38]/5 shadow-md' : 'border-gray-200'
                      }`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <div className="flex items-center gap-3">
                        <input type="radio" checked={paymentMethod === 'card'} readOnly />
                        <div>
                          <div className="text-xs font-bold text-[#1D1D1D]">Credit / Debit Card</div>
                          <div className="text-[11px] text-gray-500">Visa, Mastercard, RuPay, Amex</div>
                        </div>
                      </div>
                    </label>

                    <label 
                      className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                        paymentMethod === 'cod' ? 'border-[#284C38] bg-[#284C38]/5 shadow-md' : 'border-gray-200'
                      }`}
                      onClick={() => setPaymentMethod('cod')}
                    >
                      <div className="flex items-center gap-3">
                        <input type="radio" checked={paymentMethod === 'cod'} readOnly />
                        <div>
                          <div className="text-xs font-bold text-[#1D1D1D]">Cash on Delivery (COD)</div>
                          <div className="text-[11px] text-gray-500">Pay upon delivery to courier executive</div>
                        </div>
                      </div>
                    </label>

                  </div>

                  <div className="bg-[#1E3A2B] text-white p-4 rounded-2xl text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total Payable Amount:</span>
                      <span className="font-bold text-[#D6A146] text-sm">₹{finalTotal}</span>
                    </div>
                    <div className="text-[10px] text-gray-300">100% Encrypted & Safe Checkout • Official ENU Foods Store</div>
                  </div>
                </div>
              )}

              {/* STEP 4: ORDER CONFIRMED */}
              {currentStep === 4 && completedOrder && (
                <div className="py-6 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-lg animate-bounce">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 font-btn bg-emerald-50 px-3 py-1 rounded-full">
                      Order Successfully Placed
                    </span>
                    <h3 className="font-heading text-2xl font-bold text-[#1D1D1D] mt-2">
                      Thank You For Choosing ENU Foods!
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 max-w-md mx-auto">
                      Order ID: <span className="font-bold text-[#284C38]">{completedOrder.orderId}</span>. Details & tracking sent to <span className="font-semibold">{completedOrder.shippingAddress.phone}</span>.
                    </p>
                  </div>

                  <div className="bg-[#F7F5EF] p-4 rounded-2xl border border-gray-200 text-xs text-left max-w-md mx-auto space-y-2">
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500">Order Reference:</span>
                      <span className="font-bold text-gray-800">{completedOrder.orderId}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500">Estimated Delivery:</span>
                      <span className="font-bold text-emerald-700">Within 2 - 3 Days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Paid:</span>
                      <span className="font-bold text-[#284C38] text-sm">₹{completedOrder.total}</span>
                    </div>
                  </div>

                  <button 
                    onClick={onClose}
                    className="bg-[#284C38] text-white text-xs font-bold font-btn px-8 py-3.5 rounded-full shadow-xl"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Wizard Footer Controls */}
        {currentStep < 4 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            {currentStep > 1 ? (
              <button 
                onClick={() => setCurrentStep((currentStep - 1) as any)}
                className="px-4 py-2.5 text-xs font-bold text-gray-700 hover:text-black flex items-center gap-1 font-btn"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            <button 
              onClick={handleNextStep}
              className="bg-[#284C38] hover:bg-[#1E3A2B] text-white text-xs font-bold font-btn px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
            >
              <span>
                {currentStep === 1 && 'Proceed To Shipping'}
                {currentStep === 2 && 'Proceed To Payment'}
                {currentStep === 3 && `Pay ₹${finalTotal} & Confirm Order`}
              </span>
              <ArrowRight className="w-4 h-4 text-[#D6A146]" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
