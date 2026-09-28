import React, { useState } from 'react';
import { X, Utensils, Clock, Star, CheckCircle2, ShieldCheck, MapPin, Train, AlertCircle, ShoppingBag, ArrowRight, CreditCard, Banknote, Shield } from 'lucide-react';
import { FOOD_ITEMS, FoodItem, FoodOrder, BookingTicket } from '../data/railData';
import { PaymentSuccessResult } from './PaymentModal';

interface FoodOnTrainModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingTicket[];
  onOrderFood: (order: FoodOrder) => Promise<void>;
  onInitiatePayment?: (order: {
    orderType: 'food';
    orderTitle: string;
    itemDetails: string;
    baseFare: number;
    onSuccess: (res: PaymentSuccessResult) => void;
  }) => void;
}

export const FoodOnTrainModal: React.FC<FoodOnTrainModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onOrderFood,
  onInitiatePayment,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedFood, setSelectedFood] = useState<FoodItem>(FOOD_ITEMS[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedPnr, setSelectedPnr] = useState<string>(bookings[0]?.pnr || '284-9201843');
  const [trainNumber, setTrainNumber] = useState<string>(bookings[0]?.trainNumber || '22436');
  const [trainName, setTrainName] = useState<string>(bookings[0]?.trainName || 'Vande Bharat Express');
  const [coach, setCoach] = useState<string>(bookings[0]?.coach || 'E1');
  const [seat, setSeat] = useState<string>(bookings[0]?.seatNumber || '18');
  const [deliveryStation, setDeliveryStation] = useState<string>('Kanpur Central (CNB)');
  const [paymentMode, setPaymentMode] = useState<'online' | 'cod'>('online');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  // When selected PNR changes from dropdown
  const handlePnrChange = (pnrVal: string) => {
    setSelectedPnr(pnrVal);
    const matched = bookings.find((b) => b.pnr === pnrVal);
    if (matched) {
      setTrainNumber(matched.trainNumber);
      setTrainName(matched.trainName);
      setCoach(matched.coach);
      setSeat(matched.seatNumber);
    }
  };

  const categories = ['All', 'Thali & Meals', 'Rice & Biryani', 'Breakfast', 'Jain Food', 'Snacks & Beverages'];

  const filteredItems = FOOD_ITEMS.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const orderAmount = selectedFood.price * quantity;

    if (paymentMode === 'online' && onInitiatePayment) {
      onInitiatePayment({
        orderType: 'food',
        orderTitle: `IRCTC Meal: ${selectedFood.name} (Qty: ${quantity})`,
        itemDetails: `Delivery to Coach ${coach}, Seat ${seat} at ${deliveryStation} · Train #${trainNumber}`,
        baseFare: orderAmount,
        onSuccess: async (payRes: PaymentSuccessResult) => {
          setIsSubmitting(true);
          const newOrder: FoodOrder = {
            id: `food-${Date.now()}`,
            pnr: selectedPnr,
            trainNumber,
            trainName,
            coach,
            seat,
            deliveryStation,
            itemName: selectedFood.name,
            quantity,
            totalPrice: payRes.totalPaid,
            paymentMethod: payRes.paymentMethod,
            transactionId: payRes.transactionId,
            paymentStatus: 'PAID',
            orderStatus: 'Preparing at Station',
            orderedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ', Today',
            estimatedDelivery: `At ${deliveryStation.split(' ')[0]} station platform`,
          };
          try {
            await onOrderFood(newOrder);
            setIsSubmitting(false);
            setOrderSuccess(true);
            setTimeout(() => {
              setOrderSuccess(false);
              onClose();
            }, 2500);
          } catch (err) {
            console.error('Failed to place food order:', err);
            setIsSubmitting(false);
          }
        },
      });
      return;
    }

    setIsSubmitting(true);
    const newOrder: FoodOrder = {
      id: `food-${Date.now()}`,
      pnr: selectedPnr,
      trainNumber,
      trainName,
      coach,
      seat,
      deliveryStation,
      itemName: selectedFood.name,
      quantity,
      totalPrice: orderAmount,
      paymentMethod: paymentMode === 'cod' ? 'Cash on Delivery (Pay at Seat)' : 'RailPay Virtual Prepaid',
      transactionId: paymentMode === 'cod' ? 'COD-PAY-ON-DELIVERY' : `TXN-FOOD-${Date.now()}`,
      paymentStatus: paymentMode === 'cod' ? 'COD' : 'PAID',
      orderStatus: 'Preparing at Station',
      orderedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ', Today',
      estimatedDelivery: `At ${deliveryStation.split(' ')[0]} station platform`,
    };

    try {
      await onOrderFood(newOrder);
      setIsSubmitting(false);
      setOrderSuccess(true);
      setTimeout(() => {
        setOrderSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Failed to place food order:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-sm">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold">IRCTC e-Catering · Food on Track</span>
                <span className="text-[10px] font-bold bg-white/25 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Seat Delivery
                </span>
              </div>
              <p className="text-xs text-amber-100">
                Fresh, hygienic, ISO-certified meals delivered directly to your train coach & berth
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {orderSuccess ? (
          <div className="p-12 text-center space-y-4 my-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Meal Order Placed Successfully!</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your order for <span className="font-bold text-slate-800">{selectedFood.name}</span> will be freshly prepared and delivered to <span className="font-bold text-slate-800">Coach {coach}, Seat {seat}</span> at <span className="font-bold text-slate-800">{deliveryStation}</span>.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Track live status inside My Bookings &gt; Food on Track</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Visual Hero Banner */}
            <div className="relative rounded-2xl overflow-hidden aspect-[21/8] max-h-36 shadow-sm border border-amber-200">
              <img
                src="/src/assets/images/indian_railway_food_1790506654544.jpg"
                alt="IRCTC Hot Gourmet Dining on Train"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/50 to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <span className="text-[10px] font-mono font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
                  Pantry & Food Plaza Network
                </span>
                <h4 className="text-sm sm:text-base font-extrabold mt-1">Royal Maharaja Thali & Hot Regional Meals</h4>
                <p className="text-[11px] text-amber-200">Delivered directly to your berth at any major junction</p>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Meals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedFood(item)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedFood.id === item.id
                      ? 'border-amber-600 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-2.5 bg-slate-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className={`absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm ${
                        item.veg ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}>
                        {item.veg ? '● Pure Veg' : '▲ Non-Veg'}
                      </span>
                      <span className="absolute bottom-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-amber-300 backdrop-blur-xs flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {item.rating}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">{item.prepTime}</span>
                      <div className="text-sm font-extrabold text-slate-900">₹{item.price}</div>
                    </div>
                    <button
                      type="button"
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        selectedFood.id === item.id
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {selectedFood.id === item.id ? 'Selected' : 'Choose'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Details Form */}
            <form onSubmit={handlePlaceOrder} className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-slate-900">Seat Delivery Details for {selectedFood.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Qty:</span>
                  <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2 py-0.5 text-xs font-bold hover:bg-slate-100 text-slate-700"
                    >
                      -
                    </button>
                    <span className="px-2.5 py-0.5 text-xs font-bold text-slate-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(6, quantity + 1))}
                      className="px-2 py-0.5 text-xs font-bold hover:bg-slate-100 text-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Select PNR</label>
                  <select
                    value={selectedPnr}
                    onChange={(e) => handlePnrChange(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white font-mono text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    {bookings.map((b) => (
                      <option key={b.pnr} value={b.pnr}>
                        {b.pnr} ({b.trainNumber})
                      </option>
                    ))}
                    <option value="284-9201843">284-9201843 (Vande Bharat)</option>
                    <option value="451-8392011">451-8392011 (Rajdhani Exp)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Delivery Station</label>
                  <select
                    value={deliveryStation}
                    onChange={(e) => setDeliveryStation(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="Kanpur Central (CNB)">Kanpur Central (CNB)</option>
                    <option value="Prayagraj Junction (PRYJ)">Prayagraj Junction (PRYJ)</option>
                    <option value="Varanasi Cantt (BSB)">Varanasi Cantt (BSB)</option>
                    <option value="Kota Junction (KOTA)">Kota Junction (KOTA)</option>
                    <option value="Vadodara Junction (BRC)">Vadodara Junction (BRC)</option>
                    <option value="Surat Railway Station (ST)">Surat Railway Station (ST)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Coach Number</label>
                  <input
                    type="text"
                    value={coach}
                    onChange={(e) => setCoach(e.target.value)}
                    placeholder="e.g. E1, B4, C2"
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Berth / Seat</label>
                  <input
                    type="text"
                    value={seat}
                    onChange={(e) => setSeat(e.target.value)}
                    placeholder="e.g. 18, 27 LB"
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Payment Mode Selection */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Select Payment Method:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('online')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      paymentMode === 'online'
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="text-xs font-bold">Pay Online with RailPay</div>
                        <div className="text-[10px] text-slate-500 font-normal">UPI, Cards, NetBanking, Wallet</div>
                      </div>
                    </div>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded uppercase">
                      Instant
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMode('cod')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      paymentMode === 'cod'
                        ? 'border-amber-600 bg-amber-50/80 text-amber-950 font-bold shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-amber-600" />
                      <div>
                        <div className="text-xs font-bold">Cash on Delivery (COD)</div>
                        <div className="text-[10px] text-slate-500 font-normal">Pay cash to delivery staff at seat</div>
                      </div>
                    </div>
                    <span className="text-[9px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.2 rounded uppercase">
                      At Seat
                    </span>
                  </button>
                </div>
              </div>

              {/* Price Calculation and Submit */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] text-slate-500">
                    Hand-delivered hot in sealed foil packs by IRCTC partner vendor
                  </span>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Total Payable</span>
                    <span className="text-lg font-black text-slate-900">
                      ₹{selectedFood.price * quantity}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Confirming with Station...</span>
                      </>
                    ) : (
                      <>
                        <span>{paymentMode === 'online' ? `Pay Online ₹${selectedFood.price * quantity}` : 'Confirm COD Order'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Powered by IRCTC e-Catering & Station Food Plaza Network</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
