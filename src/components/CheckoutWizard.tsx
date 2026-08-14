import React, { useState } from 'react';
import { CartItem, ShippingAddress, PaymentMethod, OrderDetails } from '../types';
import { 
  Check, 
  ShieldCheck, 
  MapPin, 
  CreditCard, 
  Truck, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ShoppingBag, 
  Tag, 
  Lock, 
  Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';

interface CheckoutWizardProps {
  cartItems: CartItem[];
  onClearCart: () => void;
}

export const CheckoutWizard: React.FC<CheckoutWizardProps> = ({
  cartItems,
  onClearCart
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  
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

  // Coupon Code
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Order Result State
  const [completedOrder, setCompletedOrder] = useState<OrderDetails | null>(null);

  // Subtotals
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingCost = shippingMethod === 'express' ? 49 : 0;
  const couponDiscount = appliedCoupon === 'ENU15' ? Math.round(subtotal * 0.15) : 0;
  const finalTotal = Math.max(0, subtotal + shippingCost - couponDiscount);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'ENU15') {
      setAppliedCoupon('ENU15');
    } else {
      alert('Invalid coupon. Try code: ENU15');
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      if (!address.fullName || !address.phone || !address.pincode || !address.addressLine || !address.city || !address.state) {
        alert('Please fill out all address fields.');
        return;
      }
      if (address.phone.replace(/\D/g, '').length < 10) {
        alert('Please enter a valid 10-digit phone number.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePlaceOrder = () => {
    // Place Order Success
    const newOrder: OrderDetails = {
      orderId: `ENU-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cartItems],
      shippingAddress: { ...address },
      paymentMethod: paymentMethod,
      subtotal: subtotal,
      discount: couponDiscount,
      total: finalTotal,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    
    setCompletedOrder(newOrder);
    onClearCart();
    // Scroll to top to see confirmation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const WIZARD_STEPS = [
    { id: 1, name: 'Information', icon: <MapPin className="w-4 h-4" /> },
    { id: 2, name: 'Payment Method', icon: <CreditCard className="w-4 h-4" /> },
    { id: 3, name: 'Confirm Payment', icon: <CheckCircle2 className="w-4 h-4" /> }
  ];

  // If order is completed successfully
  if (completedOrder) {
    return (
      <div className="pt-36 pb-20 bg-[#F7F5EF] min-h-screen text-left">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-6 border border-[#D6A146]/30 shadow-xl text-center space-y-6"
          >
            <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-14 h-14" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 font-btn bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
                Order Successfully Placed
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#1D1D1D] mt-3">
                Thank You For Your Order!
              </h1>
              <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto font-body font-light">
                Your order is confirmed. A WhatsApp update and SMS confirmation with shipping details has been sent to <span className="font-bold text-gray-800">{completedOrder.shippingAddress.phone}</span>.
              </p>
            </div>

            <div className="bg-[#F7F5EF] p-6 rounded-2xl border border-gray-200 text-xs text-left max-w-lg mx-auto space-y-3 font-body">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">Order ID:</span>
                <span className="font-bold text-gray-800 text-sm">{completedOrder.orderId}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">Estimated Delivery:</span>
                <span className="font-bold text-emerald-700">Within 2 - 3 Days (Pan-India Express)</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">Payment Method:</span>
                <span className="font-bold text-gray-800 uppercase">{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">Deliver To:</span>
                <span className="font-bold text-gray-800 text-right">
                  {completedOrder.shippingAddress.fullName}<br />
                  {completedOrder.shippingAddress.addressLine}, {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state} - {completedOrder.shippingAddress.pincode}
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-gray-500 text-sm font-bold">Total Paid:</span>
                <span className="font-bold text-[#284C38] text-base">₹{completedOrder.total}</span>
              </div>
            </div>

            <button 
              onClick={() => router.push('/products')}
              className="bg-[#284C38] hover:bg-[#1E3A2B] text-white text-xs font-bold font-btn px-10 py-4 rounded-full shadow-lg transition-colors inline-flex items-center gap-2"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4 text-[#D6A146]" />
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="pt-24 pb-20 bg-[#F7F5EF] min-h-screen text-left">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-3xl p-10 border border-[#D6A146]/20 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-gray-800">
              Your cart is empty
            </h2>
            <p className="text-sm text-gray-500 max-w-xs mx-auto font-body font-light">
              Add some authentic cold-ground masalas and spices to your basket before checking out.
            </p>
            <button
              onClick={() => router.push('/products')}
              className="bg-[#284C38] text-white text-xs font-bold font-btn px-8 py-3 rounded-full hover:bg-[#1E3A2B] transition-colors inline-flex items-center gap-1.5"
            >
              <span>Browse Products</span>
              <ArrowRight className="w-4 h-4 text-[#D6A146]" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-36 md:pt-36 pb-20 bg-[#F7F5EF] min-h-screen text-left">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        
        {/* Page Title & Trust Hook */}
        <div className="mb-8 mx-4 md:mx-0 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#1D1D1D]">
              Complete Your Order
            </h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-btn text-gray-500">
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Purity Verified</span>
            <span className="flex items-center gap-1"><Truck className="w-4 h-4 text-emerald-600" /> Free Shipping</span>
          </div>
        </div>

        {/* Checkout Page Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Checkout Wizard (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step Wizard Node Tracker */}
            <div className="p-5 bg-white sticky top-[104px] md:top-[12vh] z-30 shadow-md border border-[#D6A146]/20 rounded-3xl mx-4 md:mx-0">
              <div className="flex items-center justify-between">
                {WIZARD_STEPS.map((step, idx) => {
                  const isCompleted = step.id < currentStep;
                  const isActive = step.id === currentStep;

                  return (
                    <React.Fragment key={step.id}>
                      <button
                        onClick={() => {
                          if (step.id < currentStep) {
                            setCurrentStep(step.id as any);
                          }
                        }}
                        disabled={step.id >= currentStep}
                        className="flex items-center gap-2.5 cursor-pointer disabled:cursor-not-allowed group focus:outline-none"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                          isCompleted 
                            ? 'bg-[#D6A146] text-[#1D1D1D] border-transparent hover:scale-105 shadow-md' 
                            : isActive 
                              ? 'bg-[#284C38] text-white border-[#D6A146] shadow-[0_0_10px_rgba(214,161,70,0.5)]' 
                              : 'bg-gray-100 text-gray-400 border-gray-200'
                        }`}>
                          <AnimatePresence mode="wait">
                            {isCompleted ? (
                              <motion.div
                                key="tick"
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: -45 }}
                                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                              >
                                <Check className="w-5 h-5 text-[#1D1D1D]" />
                              </motion.div>
                            ) : (
                              <motion.span
                                key="number"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              >
                                0{step.id}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                        <span className={`hidden sm:inline text-xs font-bold font-btn uppercase tracking-wider transition-colors duration-300 ${
                          isActive 
                            ? 'text-[#284C38]' 
                            : isCompleted 
                              ? 'text-emerald-700 group-hover:text-[#D6A146]' 
                              : 'text-gray-400'
                        }`}>
                          {step.name}
                        </span>
                      </button>
                      
                      {idx < WIZARD_STEPS.length - 1 && (
                        <div className="flex-1 h-1 mx-2 bg-gray-100 rounded-full relative overflow-hidden">
                          <motion.div 
                            className="absolute inset-y-0 left-0 bg-[#D6A146] rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: step.id < currentStep ? "100%" : "0%" }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Wizard Body Card */}
            <div className="bg-white rounded-3xl mx-4 md:mx-0 p-6 sm:p-8 border border-gray-200 shadow-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* STEP 1: INFORMATION */}
                  {currentStep === 1 && (
                    <form onSubmit={handleNextStep} className="space-y-6">
                      
                      {/* Shipping Address Header */}
                      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                        <MapPin className="w-5 h-5 text-[#284C38]" />
                        <h2 className="font-heading text-lg font-bold text-[#1D1D1D]">
                          1. Delivery Address
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                          <input 
                            type="text" 
                            required
                            value={address.fullName}
                            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                            className="w-full px-4 py-3 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#284C38] focus:border-[#284C38] focus:outline-none bg-[#F7F5EF] font-body"
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
                            className="w-full px-4 py-3 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#284C38] focus:border-[#284C38] focus:outline-none bg-[#F7F5EF] font-body"
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
                            className="w-full px-4 py-3 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#284C38] focus:border-[#284C38] focus:outline-none bg-[#F7F5EF] font-body"
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
                            className="w-full px-4 py-3 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#284C38] focus:border-[#284C38] focus:outline-none bg-[#F7F5EF] font-body"
                            placeholder="e.g. New Delhi"
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
                          className="w-full px-4 py-3 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#284C38] focus:border-[#284C38] focus:outline-none bg-[#F7F5EF] font-body"
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
                          className="w-full px-4 py-3 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#284C38] focus:border-[#284C38] focus:outline-none bg-[#F7F5EF] font-body"
                          placeholder="e.g. Delhi"
                        />
                      </div>

                      {/* Delivery Speed Header */}
                      <div className="flex items-center gap-2 border-b border-gray-100 pt-6 pb-3">
                        <Truck className="w-5 h-5 text-[#284C38]" />
                        <h2 className="font-heading text-lg font-bold text-[#1D1D1D]">
                          2. Shipping Speed
                        </h2>
                      </div>

                      <div className="space-y-3">
                        <label 
                          className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                            shippingMethod === 'free' ? 'border-[#284C38] bg-[#284C38]/5 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setShippingMethod('free')}
                        >
                          <div className="flex items-center gap-3">
                            <input type="radio" checked={shippingMethod === 'free'} readOnly className="text-[#284C38]" />
                            <div className="text-left">
                              <div className="text-xs font-bold text-[#1D1D1D]">Standard Pan-India Express Delivery</div>
                              <div className="text-[11px] text-gray-500">Delivered in 2 to 3 Business Days</div>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                            FREE
                          </span>
                        </label>

                        <label 
                          className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                            shippingMethod === 'express' ? 'border-[#284C38] bg-[#284C38]/5 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setShippingMethod('express')}
                        >
                          <div className="flex items-center gap-3">
                            <input type="radio" checked={shippingMethod === 'express'} readOnly className="text-[#284C38]" />
                            <div className="text-left">
                              <div className="text-xs font-bold text-[#1D1D1D]">Priority Air Courier (Fastest)</div>
                              <div className="text-[11px] text-gray-500">Delivered in 24 to 36 Hours</div>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-[#284C38] bg-gray-100 px-3 py-1 rounded-full">
                            +₹49
                          </span>
                        </label>
                      </div>

                      {/* Bottom Navigation */}
                      <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button 
                          type="submit"
                          className="bg-[#284C38] hover:bg-[#1E3A2B] text-white text-xs font-bold font-btn px-6 py-3.5 rounded-xl shadow-md flex items-center gap-2 transition-colors"
                        >
                          <span>Proceed to Payment Method</span>
                          <ArrowRight className="w-4 h-4 text-[#D6A146]" />
                        </button>
                      </div>

                    </form>
                  )}

                  {/* STEP 2: PAYMENT METHOD */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      
                      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                        <CreditCard className="w-5 h-5 text-[#284C38]" />
                        <h2 className="font-heading text-lg font-bold text-[#1D1D1D]">
                          Select Payment Method
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        
                        <label 
                          className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                            paymentMethod === 'upi' ? 'border-[#284C38] bg-[#284C38]/5 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setPaymentMethod('upi')}
                        >
                          <div className="flex items-center gap-3">
                            <input type="radio" checked={paymentMethod === 'upi'} readOnly className="text-[#284C38]" />
                            <div className="text-left">
                              <div className="text-xs font-bold text-[#1D1D1D]">Instant UPI (GPay / PhonePe / Paytm / BHIM)</div>
                              <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">Instant Cashback Eligible</div>
                            </div>
                          </div>
                          <span className="text-[9px] bg-[#D6A146] text-[#1D1D1D] px-2 py-1 rounded font-bold font-btn shadow-sm">
                            RECOMMENDED
                          </span>
                        </label>

                        <label 
                          className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                            paymentMethod === 'card' ? 'border-[#284C38] bg-[#284C38]/5 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setPaymentMethod('card')}
                        >
                          <div className="flex items-center gap-3">
                            <input type="radio" checked={paymentMethod === 'card'} readOnly className="text-[#284C38]" />
                            <div className="text-left">
                              <div className="text-xs font-bold text-[#1D1D1D]">Credit / Debit Card</div>
                              <div className="text-[11px] text-gray-500">Visa, Mastercard, RuPay, Amex</div>
                            </div>
                          </div>
                        </label>

                        <label 
                          className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                            paymentMethod === 'cod' ? 'border-[#284C38] bg-[#284C38]/5 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setPaymentMethod('cod')}
                        >
                          <div className="flex items-center gap-3">
                            <input type="radio" checked={paymentMethod === 'cod'} readOnly className="text-[#284C38]" />
                            <div className="text-left">
                              <div className="text-xs font-bold text-[#1D1D1D]">Cash on Delivery (COD)</div>
                              <div className="text-[11px] text-gray-500">Pay upon delivery to courier executive</div>
                            </div>
                          </div>
                        </label>

                      </div>

                      {/* Payment Note */}
                      <div className="bg-[#F7F5EF] p-4 rounded-2xl border border-gray-200 flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="text-xs font-body text-gray-600 leading-relaxed text-left">
                          <strong className="text-gray-800 font-semibold block">ENU Foods Security Policy</strong>
                          Your transaction is secure and encrypted. We do not store your credit card details or bank passwords on our servers.
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <button 
                          onClick={() => setCurrentStep(1)}
                          className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-black flex items-center gap-1 font-btn transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Back to Info</span>
                        </button>

                        <button 
                          onClick={() => setCurrentStep(3)}
                          className="bg-[#284C38] hover:bg-[#1E3A2B] text-white text-xs font-bold font-btn px-6 py-3.5 rounded-xl shadow-md flex items-center gap-2 transition-colors"
                        >
                          <span>Proceed to Confirm</span>
                          <ArrowRight className="w-4 h-4 text-[#D6A146]" />
                        </button>
                      </div>

                    </div>
                  )}

                  {/* STEP 3: CONFIRM PAYMENT */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      
                      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                        <CheckCircle2 className="w-5 h-5 text-[#284C38]" />
                        <h2 className="font-heading text-lg font-bold text-[#1D1D1D]">
                          Review & Confirm Order
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-body">
                        
                        {/* Address Summary */}
                        <div className="p-4 bg-[#F7F5EF] rounded-2xl border border-gray-200 relative text-left">
                          <button 
                            onClick={() => setCurrentStep(1)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-[#284C38] transition-colors"
                            title="Edit Address"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <div className="font-bold text-[#284C38] font-heading mb-1 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#D6A146]" /> Shipping Details
                          </div>
                          <div className="text-gray-700 leading-relaxed">
                            <span className="font-bold">{address.fullName}</span><br />
                            {address.addressLine}<br />
                            {address.city}, {address.state} - {address.pincode}<br />
                            Phone: {address.phone}
                          </div>
                          <div className="text-[10px] text-gray-500 mt-2 font-medium">
                            Method: {shippingMethod === 'free' ? 'Standard Delivery (FREE)' : 'Priority Air Courier (+₹49)'}
                          </div>
                        </div>

                        {/* Payment Method Summary */}
                        <div className="p-4 bg-[#F7F5EF] rounded-2xl border border-gray-200 relative text-left flex flex-col justify-between">
                          <div>
                            <button 
                              onClick={() => setCurrentStep(2)}
                              className="absolute top-4 right-4 text-gray-400 hover:text-[#284C38] transition-colors"
                              title="Edit Payment"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <div className="font-bold text-[#284C38] font-heading mb-1 flex items-center gap-1">
                              <CreditCard className="w-3.5 h-3.5 text-[#D6A146]" /> Payment Method
                            </div>
                            <div className="text-gray-700 font-semibold uppercase tracking-wider pt-1">
                              {paymentMethod === 'upi' && 'Instant UPI (Cashback Eligible)'}
                              {paymentMethod === 'card' && 'Credit / Debit Card'}
                              {paymentMethod === 'cod' && 'Cash on Delivery (COD)'}
                            </div>
                          </div>
                          
                          <div className="text-[10px] text-[#284C38] font-bold bg-[#284C38]/10 px-2.5 py-1 rounded-lg mt-3 self-start">
                            💳 Safe Secure Payment Gateway
                          </div>
                        </div>

                      </div>

                      {/* Inline Itemized Review for Mobile */}
                      <div className="block lg:hidden border border-gray-200 rounded-2xl overflow-hidden">
                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs font-bold text-gray-700">
                          Items Review ({totalItems})
                        </div>
                        <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto px-4 py-1">
                          {cartItems.map((item, idx) => (
                            <div key={idx} className="py-2.5 flex items-center justify-between text-xs gap-3">
                              <div className="flex items-center gap-2 truncate">
                                <img src={item.product.image} alt="" className="w-8 h-8 rounded object-cover border" />
                                <div className="truncate">
                                  <div className="font-bold truncate text-gray-800">{item.product.name}</div>
                                  <div className="text-[10px] text-gray-400">{item.selectedWeight} • Qty {item.quantity}</div>
                                </div>
                              </div>
                              <span className="font-bold text-[#284C38] shrink-0">₹{item.product.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Confirm Controls */}
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <button 
                          onClick={() => setCurrentStep(2)}
                          className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-black flex items-center gap-1 font-btn transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Back to Payment</span>
                        </button>

                        <button 
                          onClick={handlePlaceOrder}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold font-btn px-8 py-3.5 rounded-xl shadow-lg flex items-center gap-2 transition-colors"
                        >
                          <span>Confirm & Place Order (₹{finalTotal})</span>
                          <Check className="w-4 h-4 text-[#D6A146]" />
                        </button>
                      </div>

                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xl space-y-5">
              
              <h2 className="font-heading text-lg font-bold text-[#1D1D1D] border-b border-gray-100 pb-3 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#284C38]" />
                <span>Order Summary ({totalItems})</span>
              </h2>

              {/* Items List */}
              <div className="divide-y divide-gray-100 max-h-[30vh] overflow-y-auto pr-1">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center gap-3">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0 bg-gray-50"
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="font-heading text-xs font-bold text-[#1D1D1D] truncate">
                        {item.product.name}
                      </h4>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        Pack: <span className="font-semibold text-gray-700">{item.selectedWeight}</span> • Qty: <span className="font-semibold text-gray-700">{item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-[#284C38] shrink-0">
                      ₹{item.product.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="bg-[#F7F5EF] p-4 rounded-2xl border border-[#D6A146]/20">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="ENTER COUPON (ENU15)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#284C38] focus:ring-1 focus:ring-[#284C38] uppercase bg-white font-body"
                  />
                  <button
                    type="submit"
                    className="bg-[#1E3A2B] text-[#D6A146] text-xs font-bold px-4 py-2 rounded-lg font-btn hover:bg-[#284C38] transition-colors shadow-sm shrink-0"
                  >
                    Apply
                  </button>
                </form>

                {appliedCoupon && (
                  <div className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 p-2 rounded-lg font-medium flex items-center justify-between mt-2 text-left">
                    <span>🎉 Coupon <strong>ENU15</strong> applied (15% Off)</span>
                    <button
                      onClick={() => setAppliedCoupon(null)}
                      className="text-gray-500 font-bold hover:text-black transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Price Details */}
              <div className="space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-4 font-body">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-gray-800">₹{subtotal}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping Cost</span>
                  {shippingCost > 0 ? (
                    <span className="font-semibold text-gray-800">+₹{shippingCost}</span>
                  ) : (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">FREE</span>
                  )}
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon Savings (15% Off)</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between pt-3 border-t border-gray-100 text-sm font-bold text-[#1D1D1D]">
                  <span>Total Amount</span>
                  <span className="text-[#284C38] font-heading text-lg">
                    ₹{finalTotal}
                  </span>
                </div>
              </div>

            </div>

            {/* Trust Badging Block */}
            <div className="bg-[#1E3A2B] text-white p-6 rounded-3xl border border-[#D6A146]/20 shadow-md text-left space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <Tag className="w-4 h-4 text-[#D6A146]" />
                <span className="text-xs font-bold tracking-wider uppercase font-btn text-[#D6A146]">ENU Foods Promise</span>
              </div>
              <div className="space-y-3 text-[11px] font-body text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="text-[#D6A146] mt-0.5">✔</span>
                  <span>100% pure cold-ground spices, zero adulteration.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#D6A146] mt-0.5">✔</span>
                  <span>Pan-India priority shipping via leading courier networks.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#D6A146] mt-0.5">✔</span>
                  <span>Easy returns and instant refund support hotlines.</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
