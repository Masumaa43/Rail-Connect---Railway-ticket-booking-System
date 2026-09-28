import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Wallet, 
  QrCode, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  RefreshCw, 
  Plus, 
  Receipt, 
  Download, 
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export interface PaymentSuccessResult {
  transactionId: string;
  paymentMethod: string;
  baseFare: number;
  convenienceFee: number;
  superfastSurcharge: number;
  insuranceFee: number;
  gstAmount: number;
  totalPaid: number;
  cashbackEarned: number;
  bankReference: string;
  paidAt: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderType: 'ticket' | 'food' | 'wallet_topup';
  orderTitle: string;
  itemDetails: string;
  baseFare: number;
  walletBalance: number;
  onTopupWallet: (amount: number) => Promise<void> | void;
  onPaymentSuccess: (result: PaymentSuccessResult) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  orderType,
  orderTitle,
  itemDetails,
  baseFare,
  walletBalance,
  onTopupWallet,
  onPaymentSuccess,
}) => {
  // Payment methods state
  const [selectedMethod, setSelectedMethod] = useState<'wallet' | 'upi' | 'card' | 'netbanking'>('wallet');

  // Fare options
  const [insuranceOpted, setInsuranceOpted] = useState(true);
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);

  // Topup state
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState(1000);
  const [isProcessingTopup, setIsProcessingTopup] = useState(false);

  // UPI state
  const [upiId, setUpiId] = useState('');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [qrTimer, setQrTimer] = useState(299); // 5 mins in seconds

  // Card state
  const [cardNumber, setCardNumber] = useState('4532 8912 3456 7890');
  const [cardName, setCardName] = useState('Masuma Akhtar');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('492');
  const [otpStep, setOtpStep] = useState(false);
  const [cardOtp, setCardOtp] = useState('');

  // Netbanking state
  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingPhase, setProcessingPhase] = useState<string>('');
  const [paymentCompleted, setPaymentCompleted] = useState<PaymentSuccessResult | null>(null);

  // Timer for UPI QR countdown
  useEffect(() => {
    if (!isOpen || selectedMethod !== 'upi') return;
    const interval = setInterval(() => {
      setQrTimer((prev) => (prev > 0 ? prev - 1 : 299));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, selectedMethod]);

  // Reset states when opened
  useEffect(() => {
    if (isOpen) {
      setIsProcessing(false);
      setPaymentCompleted(null);
      setOtpStep(false);
      setCardOtp('');
      // Default to wallet if sufficient, else UPI
      if (orderType === 'wallet_topup') {
        setSelectedMethod('upi');
      } else if (walletBalance >= baseFare) {
        setSelectedMethod('wallet');
      } else {
        setSelectedMethod('upi');
      }
    }
  }, [isOpen, baseFare, walletBalance, orderType]);

  if (!isOpen) return null;

  // Realistic Indian Railways fare surcharge breakdown
  const isTicket = orderType === 'ticket';
  const isTopup = orderType === 'wallet_topup';
  const convenienceFee = isTicket ? 17.70 : 0; // ₹15 + 18% GST = ₹17.70
  const superfastSurcharge = isTicket ? 45.00 : 0;
  const insuranceFee = (isTicket && insuranceOpted) ? 0.45 : 0;
  const gstRate = isTopup ? 0 : 0.05; // 5% GST on AC travel / restaurant food, 0 on topup
  const gstAmount = Math.round(baseFare * gstRate * 100) / 100;
  const totalPayable = isTopup 
    ? baseFare 
    : Math.round((baseFare + convenienceFee + superfastSurcharge + insuranceFee + gstAmount) * 100) / 100;

  // RailPay 5% Cashback Reward
  const cashbackEarned = isTopup ? 0 : Math.round(totalPayable * 0.05);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleCardNumberChange = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 16);
    const formatted = clean.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleQuickTopup = async (amt: number) => {
    setIsProcessingTopup(true);
    try {
      await onTopupWallet(amt);
      setIsTopupOpen(false);
    } finally {
      setIsProcessingTopup(false);
    }
  };

  const executePaymentFlow = (methodName: string) => {
    setIsProcessing(true);
    setProcessingPhase('Establishing 256-bit SSL encrypted handshake with RailPay...');

    setTimeout(() => {
      setProcessingPhase('Validating NPCI / RBI payment token & authorizing funds...');

      setTimeout(() => {
        setProcessingPhase('Authorization Approved! Generating IRCTC PRS Tax Invoice...');

        setTimeout(() => {
          const txnId = `TXN-IRCTC-${Math.floor(10000000 + Math.random() * 90000000)}`;
          const bankRef = `UTR${Math.floor(100000000000 + Math.random() * 900000000000)}`;
          const paidAtTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ', Today';

          const result: PaymentSuccessResult = {
            transactionId: txnId,
            paymentMethod: methodName,
            baseFare,
            convenienceFee,
            superfastSurcharge,
            insuranceFee,
            gstAmount,
            totalPaid: totalPayable,
            cashbackEarned: methodName.includes('Wallet') ? cashbackEarned : 0,
            bankReference: bankRef,
            paidAt: paidAtTime,
          };

          setIsProcessing(false);
          setPaymentCompleted(result);
          onPaymentSuccess(result);
        }, 600);
      }, 700);
    }, 600);
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedMethod === 'wallet') {
      if (walletBalance < totalPayable) {
        setIsTopupOpen(true);
        return;
      }
      executePaymentFlow('RailPay Virtual Wallet');
    } else if (selectedMethod === 'upi') {
      const upiLabel = upiId ? `UPI (${upiId})` : `UPI (${selectedUpiApp.toUpperCase()})`;
      executePaymentFlow(upiLabel);
    } else if (selectedMethod === 'card') {
      if (!otpStep) {
        // Step into 3D Secure OTP verification
        setOtpStep(true);
        return;
      }
      executePaymentFlow(`Card (RuPay/Visa ending in ${cardNumber.slice(-4)})`);
    } else if (selectedMethod === 'netbanking') {
      executePaymentFlow(`NetBanking (${selectedBank})`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[94vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">IRCTC RailPay Secure Checkout</span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  256-bit SSL
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Authorized Virtual Payment Gateway for Indian Railways PRS
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {isProcessing ? (
          /* Processing Screen */
          <div className="p-12 text-center space-y-5 my-auto">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
              <ShieldCheck className="w-7 h-7 text-emerald-600 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Processing Secure Payment
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto animate-pulse">
                {processingPhase}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-slate-600 text-xs font-mono">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Do not refresh or close window</span>
            </div>
          </div>
        ) : paymentCompleted ? (
          /* Payment Success & Official Tax Invoice */
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 shadow-inner">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Payment Authorized Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                ₹{paymentCompleted.totalPaid.toFixed(2)} debited via {paymentCompleted.paymentMethod}
              </p>
            </div>

            {/* Cashback Reward Alert */}
            {paymentCompleted.cashbackEarned > 0 && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">5% RailPay Cashback Earned!</span>
                </div>
                <span className="font-extrabold text-emerald-700 bg-white px-2 py-0.5 rounded shadow-2xs font-mono">
                  +₹{paymentCompleted.cashbackEarned}.00 credited to Wallet
                </span>
              </div>
            )}

            {/* Official Digital Tax Invoice / Payment Receipt */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3.5 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    IRCTC Official Tax Invoice
                  </span>
                  <span className="text-sm font-black font-mono text-slate-900">
                    {paymentCompleted.transactionId}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">GSTIN (Indian Railways)</span>
                  <span className="font-mono text-xs font-bold text-slate-800">07AABCI1234F1Z5</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-slate-700">
                <div>
                  <span className="text-slate-400 text-[10px] block">Order Description</span>
                  <span className="font-bold text-slate-900">{orderTitle}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Bank Reference (UTR)</span>
                  <span className="font-mono font-bold text-slate-900">{paymentCompleted.bankReference}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Payment Mode</span>
                  <span className="font-semibold text-slate-800">{paymentCompleted.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Date & Timestamp</span>
                  <span className="font-mono text-slate-800">{paymentCompleted.paidAt}</span>
                </div>
              </div>

              {/* Line items */}
              <div className="pt-2 border-t border-slate-200 space-y-1 text-slate-600 text-[11px]">
                <div className="flex justify-between">
                  <span>Base Booking Amount:</span>
                  <span className="font-mono font-medium">₹{paymentCompleted.baseFare.toFixed(2)}</span>
                </div>
                {paymentCompleted.convenienceFee > 0 && (
                  <div className="flex justify-between">
                    <span>IRCTC Convenience Fee (+ 18% GST):</span>
                    <span className="font-mono font-medium">₹{paymentCompleted.convenienceFee.toFixed(2)}</span>
                  </div>
                )}
                {paymentCompleted.superfastSurcharge > 0 && (
                  <div className="flex justify-between">
                    <span>Superfast Track Surcharge:</span>
                    <span className="font-mono font-medium">₹{paymentCompleted.superfastSurcharge.toFixed(2)}</span>
                  </div>
                )}
                {paymentCompleted.insuranceFee > 0 && (
                  <div className="flex justify-between">
                    <span>Travel Insurance Cover (₹10 Lakhs):</span>
                    <span className="font-mono font-medium">₹{paymentCompleted.insuranceFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>CGST (2.5%) + SGST (2.5%):</span>
                  <span className="font-mono font-medium">₹{paymentCompleted.gstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 text-xs font-bold text-slate-900">
                  <span>Total Paid (INR):</span>
                  <span className="text-emerald-700 text-sm font-extrabold font-mono">₹{paymentCompleted.totalPaid.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Tax Invoice</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>View My e-Ticket</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Payment Selection & Checkout Form */
          <form onSubmit={handlePay} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {/* Order & Pricing Summary Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    {orderType === 'ticket' ? 'Railway Ticket Booking' : orderType === 'wallet_topup' ? 'RailPay Virtual Wallet Recharge' : 'Food on Track Order'}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">
                    {orderTitle}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {itemDetails}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block">Total Payable</span>
                  <div className="text-xl font-extrabold text-slate-900 font-mono">
                    ₹{totalPayable.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Price Breakdown Toggle */}
              <div className="pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>{showPriceBreakdown ? 'Hide Fare Breakdown' : 'View Fare Breakdown & GST'}</span>
                  {showPriceBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showPriceBreakdown && (
                  <div className="mt-2.5 p-3 bg-white rounded-xl border border-slate-200 space-y-1 text-[11px] text-slate-600 font-mono">
                    <div className="flex justify-between">
                      <span>Base Fare:</span>
                      <span>₹{baseFare.toFixed(2)}</span>
                    </div>
                    {convenienceFee > 0 && (
                      <div className="flex justify-between">
                        <span>IRCTC Convenience Fee (+ 18% GST):</span>
                        <span>₹{convenienceFee.toFixed(2)}</span>
                      </div>
                    )}
                    {superfastSurcharge > 0 && (
                      <div className="flex justify-between">
                        <span>Superfast Train Surcharge:</span>
                        <span>₹{superfastSurcharge.toFixed(2)}</span>
                      </div>
                    )}
                    {orderType === 'ticket' && (
                      <div className="flex items-center justify-between text-slate-800 pt-1 border-t border-slate-100">
                        <label className="flex items-center gap-1.5 cursor-pointer font-sans text-[11px]">
                          <input
                            type="checkbox"
                            checked={insuranceOpted}
                            onChange={(e) => setInsuranceOpted(e.target.checked)}
                            className="rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>Opt for Travel Insurance (₹10L cover)</span>
                        </label>
                        <span>+₹0.45</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>GST (5% AC Passenger Tax):</span>
                      <span>₹{gstAmount.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Wallet Recharge Drawer / Prompt if open */}
            {isTopupOpen && (
              <div className="p-4 bg-emerald-50/80 border-2 border-emerald-500/80 rounded-2xl space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-950">
                      Recharge RailPay Virtual Wallet
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsTopupOpen(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                  >
                    Cancel
                  </button>
                </div>

                <p className="text-xs text-slate-600">
                  Current balance is <span className="font-bold font-mono">₹{walletBalance.toFixed(2)}</span>. Add funds to complete instant 1-click checkout.
                </p>

                <div className="flex items-center gap-2">
                  {[500, 1000, 2000, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopupAmount(amt)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        topupAmount === amt
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-emerald-200 hover:bg-emerald-100/50'
                      }`}
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={isProcessingTopup}
                  onClick={() => handleQuickTopup(topupAmount)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {isProcessingTopup ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Crediting Virtual Balance...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Recharge ₹{topupAmount} Instantly</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Payment Method Selector Tabs */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Select Virtual Payment Method
              </span>

              <div className={`grid gap-2 ${orderType === 'wallet_topup' ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
                {orderType !== 'wallet_topup' && (
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('wallet')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedMethod === 'wallet'
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Wallet className={`w-4 h-4 ${selectedMethod === 'wallet' ? 'text-emerald-600' : 'text-slate-500'}`} />
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-800 uppercase">
                        5% Back
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">RailPay Wallet</div>
                      <div className="text-[11px] font-mono text-emerald-700 font-extrabold mt-0.5">
                        ₹{walletBalance.toFixed(2)}
                      </div>
                    </div>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedMethod === 'upi'
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <QrCode className={`w-4 h-4 ${selectedMethod === 'upi' ? 'text-emerald-600' : 'text-slate-500'}`} />
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 uppercase">
                      0% Fee
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">UPI / QR Code</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">GPay, PhonePe</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedMethod === 'card'
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <CreditCard className={`w-4 h-4 ${selectedMethod === 'card' ? 'text-emerald-600' : 'text-slate-500'}`} />
                    <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-slate-200 text-slate-700">
                      RuPay
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Credit / Debit</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Visa, RuPay, MC</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('netbanking')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedMethod === 'netbanking'
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Building2 className={`w-4 h-4 ${selectedMethod === 'netbanking' ? 'text-emerald-600' : 'text-slate-500'}`} />
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      Banks
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">NetBanking</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">SBI, HDFC, ICICI</div>
                  </div>
                </button>
              </div>
            </div>

            {/* TAB CONTENT 1: RAILPAY VIRTUAL WALLET */}
            {selectedMethod === 'wallet' && (
              <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">IRCTC RailPay Prepaid Wallet</div>
                      <div className="text-xs text-slate-500">
                        Available Balance:{' '}
                        <span className="font-bold text-emerald-800 font-mono">
                          ₹{walletBalance.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsTopupOpen(true)}
                    className="px-3 py-1.5 bg-white border border-emerald-300 hover:border-emerald-500 text-emerald-700 text-xs font-bold rounded-lg shadow-2xs hover:shadow transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Top-up</span>
                  </button>
                </div>

                {walletBalance < totalPayable ? (
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2 text-xs text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Insufficient Wallet Balance:</span> You need ₹{(totalPayable - walletBalance).toFixed(2)} more. Click top-up above or select UPI/Card below.
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Sufficient balance available for 1-Click Instant Checkout</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 font-mono">
                      Remaining: ₹{(walletBalance - totalPayable).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 2: UPI APPS & QR CODE */}
            {selectedMethod === 'upi' && (
              <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  {/* Dynamic QR Code */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-2xs flex flex-col items-center">
                    <div className="relative p-2 bg-slate-900 rounded-xl mb-2 text-white">
                      <QrCode className="w-24 h-24 text-white" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 rounded bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">
                          ₹
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-800">Scan to Pay with any UPI App</span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono mt-0.5">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>Expires in {formatTimer(qrTimer)}</span>
                    </div>
                  </div>

                  {/* UPI Apps Selection */}
                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-slate-600 block">
                      Or select your preferred UPI App:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'gpay', name: 'Google Pay', badge: 'GPay' },
                        { id: 'phonepe', name: 'PhonePe', badge: 'BHIM' },
                        { id: 'paytm', name: 'Paytm UPI', badge: 'Instant' },
                        { id: 'bhim', name: 'BHIM UPI', badge: 'Govt' },
                      ].map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => setSelectedUpiApp(app.id as any)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                            selectedUpiApp === app.id
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span>{app.name}</span>
                          <span className="text-[9px] font-mono px-1 rounded bg-slate-100 text-slate-500">
                            {app.badge}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* VPA ID manual input */}
                    <div className="pt-1">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Virtual Payment Address (VPA)
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. yourname@okhdfcbank"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: CREDIT / DEBIT CARD */}
            {selectedMethod === 'card' && (
              <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-200 space-y-4">
                {otpStep ? (
                  /* 3D Secure OTP Verification Step */
                  <div className="space-y-4 p-4 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Bank 3D Secure Service</span>
                        <div className="text-xs font-bold text-slate-900">Enter Verified One-Time Password</div>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                        Ending in {cardNumber.slice(-4)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      A 6-digit OTP has been sent to mobile number registered with your card: <span className="font-mono font-bold">+91 ••••• ••410</span>
                    </p>

                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        maxLength={6}
                        value={cardOtp}
                        onChange={(e) => setCardOtp(e.target.value)}
                        placeholder="e.g. 849201"
                        className="w-40 px-3 py-2 text-sm font-mono font-bold tracking-widest text-center border-2 border-slate-300 rounded-xl focus:border-emerald-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setCardOtp('849201')}
                        className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-300 transition-colors cursor-pointer"
                      >
                        Auto-Fill Simulated OTP (849201)
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Card Details Input */
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Card Number (RuPay, Visa, Mastercard)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => handleCardNumberChange(e.target.value)}
                          placeholder="4532 •••• •••• 8912"
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-mono font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                        <span className="absolute right-3 top-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          {cardNumber.startsWith('4') ? 'Visa' : cardNumber.startsWith('5') ? 'Mastercard' : 'RuPay'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          required
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="As printed on card"
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Expiry
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full px-2 py-2 text-xs border border-slate-300 rounded-xl bg-white font-mono text-center focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            CVV
                          </label>
                          <input
                            type="password"
                            required
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                            className="w-full px-2 py-2 text-xs border border-slate-300 rounded-xl bg-white font-mono text-center focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 4: NETBANKING */}
            {selectedMethod === 'netbanking' && (
              <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-200 space-y-3">
                <span className="text-xs font-semibold text-slate-600 block">
                  Select your Bank for Direct Authorization:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'State Bank of India (SBI)',
                    'HDFC Bank',
                    'ICICI Bank',
                    'Axis Bank',
                    'Punjab National Bank',
                    'Bank of Baroda',
                  ].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                        selectedBank === bank
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Checkout Action Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">PCI-DSS Level 1 & RBI Tokenized</span>
                  <span className="text-slate-400 text-[10px]">Zero liability guarantee & instant cancellation refund</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={selectedMethod === 'wallet' && walletBalance < totalPayable}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/25 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>
                    {orderType === 'wallet_topup'
                      ? `Recharge ₹${totalPayable.toFixed(2)} to Wallet`
                      : selectedMethod === 'card' && !otpStep
                      ? `Proceed to 3D Secure OTP (₹${totalPayable.toFixed(2)})`
                      : `Pay ₹${totalPayable.toFixed(2)} Securely`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
