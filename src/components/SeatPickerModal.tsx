import React, { useState, useEffect } from 'react';
import { TrainSchedule, BookingTicket } from '../data/railData';
import { X, Check, QrCode, Train, ShieldCheck, Ticket, Download, ArrowRight, Cloud, LogIn, Utensils, Receipt, Sparkles, CreditCard, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CoachLayoutVisualizer, SeatInfo } from './CoachLayoutVisualizer';
import { PaymentSuccessResult } from './PaymentModal';

interface SeatPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  train: TrainSchedule | null;
  seatClassKey: string;
  passengers: number;
  travelDate: string;
  quota?: string;
  onConfirmBooking: (newTicket: BookingTicket) => void;
  onInitiatePayment?: (order: {
    orderType: 'ticket';
    orderTitle: string;
    itemDetails: string;
    baseFare: number;
    onSuccess: (res: PaymentSuccessResult) => void;
  }) => void;
  walletBalance?: number;
}

export const SeatPickerModal: React.FC<SeatPickerModalProps> = ({
  isOpen,
  onClose,
  train,
  seatClassKey,
  passengers,
  travelDate,
  quota = 'General',
  onConfirmBooking,
  onInitiatePayment,
  walletBalance = 5000,
}) => {
  const { user } = useAuth();

  const isChairCar = seatClassKey === 'CC' || seatClassKey === 'EC' || train?.trainType === 'Vande Bharat' || train?.trainType === 'Shatabdi';

  // Selected seat IDs
  const [selectedSeat, setSelectedSeat] = useState<string>(isChairCar ? '18W' : '23LB');
  const [selectedSeatInfo, setSelectedSeatInfo] = useState<SeatInfo | null>(null);
  const [passengerName, setPassengerName] = useState<string>(user?.displayName || 'Masuma Akhtar');
  const [passengerAge, setPassengerAge] = useState<string>('28');
  const [passengerGender, setPassengerGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [mealPreference, setMealPreference] = useState<'Veg' | 'Non-Veg' | 'No Food'>('Veg');
  const [confirmedTicket, setConfirmedTicket] = useState<BookingTicket | null>(null);

  useEffect(() => {
    if (user?.displayName) {
      setPassengerName(user.displayName);
    }
  }, [user]);

  useEffect(() => {
    if (train) {
      const chairCar = seatClassKey === 'CC' || seatClassKey === 'EC' || train.trainType === 'Vande Bharat' || train.trainType === 'Shatabdi';
      setSelectedSeat(chairCar ? '18W' : '23LB');
      setSelectedSeatInfo(null);
      setConfirmedTicket(null);
    }
  }, [train, seatClassKey]);

  if (!isOpen || !train) return null;

  const currentClass = train.classes[seatClassKey] || Object.values(train.classes)[0];

  const pricePerSeat = currentClass?.price || 1200;
  const totalPrice = pricePerSeat * passengers;

  // Indian Coach designation
  const coachLabel = seatClassKey === 'EC' ? 'Coach E1 (Executive)' 
    : seatClassKey === 'CC' ? 'Coach C2 (Chair Car)'
    : seatClassKey === '1A' ? 'Coach H1 (AC First)'
    : seatClassKey === '2A' ? 'Coach A2 (AC 2 Tier)'
    : seatClassKey === '3A' ? 'Coach B3 (AC 3 Tier)'
    : 'Coach S4 (Sleeper)';

  // Occupied seats
  const occupiedSeats = ['02W', '05M', '08A', '12W', '15A', '20LB', '21MB', '22UB'];

  const handleSeatClick = (seatCode: string) => {
    if (occupiedSeats.includes(seatCode)) return;
    setSelectedSeat(seatCode);
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    // 10-digit Indian Railway PNR format
    const prefix = Math.floor(200 + Math.random() * 700);
    const suffix = Math.floor(1000000 + Math.random() * 9000000);
    const pnrCode = `${prefix}-${suffix}`;

    const defaultBerthLabel = isChairCar 
      ? selectedSeat.endsWith('W') ? 'Window Seat' : selectedSeat.endsWith('M') ? 'Middle Seat' : 'Aisle Seat'
      : selectedSeat.endsWith('LB') ? 'Lower Berth' : selectedSeat.endsWith('MB') ? 'Middle Berth' : selectedSeat.endsWith('UB') ? 'Upper Berth' : 'Side Lower Berth';

    const berthLabel = selectedSeatInfo?.berthType || defaultBerthLabel;
    const seatDisplay = selectedSeatInfo ? `Seat ${selectedSeatInfo.number} (${berthLabel})` : `${selectedSeat} (${berthLabel})`;

    const draftTicket: BookingTicket = {
      pnr: pnrCode,
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      fromStation: train.fromStation,
      fromCode: train.fromCode,
      toStation: train.toStation,
      toCode: train.toCode,
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
      travelDate: travelDate,
      passengerName: passengerName || 'Passenger',
      quota: (quota.includes('Tatkal') ? 'Tatkal' : 'General') as any,
      seatClass: `${currentClass?.name || 'Class'} (${seatClassKey})`,
      coach: coachLabel.split(' ')[1] || 'Coach C1',
      seatNumber: seatDisplay,
      berthType: berthLabel,
      totalPaid: totalPrice,
      status: 'Confirmed',
      platform: train.platform,
      bookingTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    if (onInitiatePayment) {
      onInitiatePayment({
        orderType: 'ticket',
        orderTitle: `${train.trainNumber} · ${train.trainName} (${train.trainType})`,
        itemDetails: `${train.fromStation} (${train.fromCode}) → ${train.toStation} (${train.toCode}) · ${coachLabel} · ${seatDisplay} · Pax: ${passengerName || 'Passenger'}`,
        baseFare: totalPrice,
        onSuccess: (paymentRes: PaymentSuccessResult) => {
          const finalTicket: BookingTicket = {
            ...draftTicket,
            totalPaid: paymentRes.totalPaid,
            transactionId: paymentRes.transactionId,
            paymentMethod: paymentRes.paymentMethod,
            paymentStatus: 'SUCCESS',
            baseFare: paymentRes.baseFare,
            convenienceFee: paymentRes.convenienceFee,
            gstAmount: paymentRes.gstAmount,
            insuranceOpted: paymentRes.insuranceFee > 0,
          };
          onConfirmBooking(finalTicket);
          setConfirmedTicket(finalTicket);
        },
      });
      return;
    }

    onConfirmBooking(draftTicket);
    setConfirmedTicket(draftTicket);
  };

  const handleCloseAll = () => {
    setConfirmedTicket(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Train className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold">
                {confirmedTicket ? 'Indian Railways e-Ticket Confirmed' : 'Interactive Coach Layout & Passenger Details'}
              </div>
              <div className="text-xs text-slate-300">
                #{train.trainNumber} · {train.trainName} ({train.trainType})
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCloseAll}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {confirmedTicket ? (
          /* Indian Railways e-Ticket Boarding Pass View */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Ticket Booked Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Your Indian Railways reservation is confirmed with verified PNR. Synced with My Bookings.
              </p>
            </div>

            {/* Official Indian Railway e-Ticket Style */}
            <div className="bg-gradient-to-b from-slate-50 to-white rounded-2xl border-2 border-dashed border-slate-300 p-6 relative overflow-hidden shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                    Indian Railways Official e-Ticket
                  </div>
                  <div className="text-lg font-mono font-bold text-slate-900 tracking-wider">
                    PNR: {confirmedTicket.pnr}
                  </div>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Class & Quota</span>
                  <div className="text-xs font-bold text-slate-800">
                    {confirmedTicket.seatClass} · {confirmedTicket.quota}
                  </div>
                </div>
              </div>

              {/* Train & Journey details */}
              <div className="grid grid-cols-3 gap-3 my-4 py-2">
                <div>
                  <div className="text-xs text-slate-400">Boarding From</div>
                  <div className="text-base font-extrabold text-slate-900">{confirmedTicket.fromCode}</div>
                  <div className="text-[11px] text-slate-600 truncate">{confirmedTicket.fromStation}</div>
                  <div className="text-xs font-bold text-emerald-700 mt-1">{confirmedTicket.departureTime} hrs</div>
                </div>

                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] font-bold text-slate-700">#{confirmedTicket.trainNumber}</span>
                  <div className="w-full h-0.5 bg-slate-300 my-1" />
                  <div className="text-[10px] text-slate-500">{confirmedTicket.travelDate}</div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Destination</div>
                  <div className="text-base font-extrabold text-slate-900">{confirmedTicket.toCode}</div>
                  <div className="text-[11px] text-slate-600 truncate">{confirmedTicket.toStation}</div>
                  <div className="text-xs font-bold text-emerald-700 mt-1">{confirmedTicket.arrivalTime} hrs</div>
                </div>
              </div>

              {/* Passenger & Berth breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Passenger</span>
                  <span className="font-bold text-slate-800 truncate block">{confirmedTicket.passengerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Coach & Berth/Seat</span>
                  <span className="font-bold text-emerald-800 block">{confirmedTicket.coach} · {confirmedTicket.seatNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Expected Platform</span>
                  <span className="font-bold text-slate-800 block">{confirmedTicket.platform}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Total Fare (INR)</span>
                  <span className="font-bold text-slate-900 block tabular-nums text-sm">₹{confirmedTicket.totalPaid}.00</span>
                </div>
              </div>

              {/* QR and Ticket verification line */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <QrCode className="w-8 h-8 text-slate-800 shrink-0" />
                  <span className="text-[10px] text-slate-500 font-mono">Scan QR for TTE Onboard Verification & IRCTC Catering</span>
                </div>
                <div className="font-mono text-[10px] tracking-widest text-slate-600 font-bold hidden sm:block">
                  IR-PRS-{confirmedTicket.pnr.replace('-', '')}
                </div>
              </div>

              {/* Payment Verification & Official Tax Invoice Line */}
              <div className="mt-4 p-3 bg-emerald-50/90 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-950">Payment Verified · IRCTC PRS</span>
                      <span className="text-[10px] font-mono bg-white text-emerald-800 font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                        {confirmedTicket.paymentStatus || 'SUCCESS'}
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-800 font-mono mt-0.5">
                      Txn: <span className="font-bold">{confirmedTicket.transactionId || 'TXN-IRCTC-ONLINE'}</span> · Mode: {confirmedTicket.paymentMethod || 'RailPay Virtual Wallet'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-white hover:bg-emerald-100/60 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Save Tax Invoice</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCloseAll}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Done · Back to Homepage
              </button>
            </div>
          </div>
        ) : (
          /* Step 1: Interactive Seat & Berth Selection Form */
          <form onSubmit={handleConfirmReservation} className="p-6 space-y-5">
            {/* Quick Route Summary */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900">{train.fromStation}</span>
                <span className="mx-2 text-slate-400">→</span>
                <span className="font-bold text-slate-900">{train.toStation}</span>
              </div>
              <div className="text-slate-500 font-medium">
                <span>{travelDate}</span> · <span className="font-semibold text-emerald-700">{currentClass?.name} ({seatClassKey})</span>
              </div>
            </div>

            {/* Visual Cabin Preview */}
            <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 aspect-[21/9] sm:aspect-[24/8] max-h-36 w-full">
              <img
                src={isChairCar ? "/src/assets/images/vande_bharat_interior_1790506633999.jpg" : "/src/assets/images/vande_bharat_train_1790504178153.jpg"}
                alt={`${coachLabel} Cabin Interior`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-transparent" />
              <div className="absolute bottom-2.5 left-3 text-white">
                <span className="text-[10px] font-mono font-bold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded">
                  {coachLabel}
                </span>
                <div className="text-xs font-bold text-white mt-0.5">
                  {isChairCar ? "180° Rotatable Executive Seats · Wide Panoramic Windows" : "Comfortable Air-Conditioned Sleeper Berths · Linen Included"}
                </div>
              </div>
            </div>

            {/* Interactive Coach Layout Visualization Component */}
            <CoachLayoutVisualizer
              trainNumber={train.trainNumber}
              trainName={train.trainName}
              trainType={train.trainType}
              seatClassKey={seatClassKey}
              selectedSeat={selectedSeat}
              onSelectSeat={(seatCode, seatInfo) => {
                setSelectedSeat(seatCode);
                if (seatInfo) {
                  setSelectedSeatInfo(seatInfo);
                }
              }}
              passengers={passengers}
              quota={quota}
              basePrice={pricePerSeat}
            />

            {/* Passenger Information */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Primary Passenger Details (Indian Railways)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Full Name (As on Aadhaar / Govt ID)
                  </label>
                  <input
                    type="text"
                    required
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. Masuma Akhtar"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="105"
                    required
                    value={passengerAge}
                    onChange={(e) => setPassengerAge(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Gender
                  </label>
                  <select
                    value={passengerGender}
                    onChange={(e) => setPassengerGender(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Transgender / Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    IRCTC Food Catering Choice
                  </label>
                  <select
                    value={mealPreference}
                    onChange={(e) => setMealPreference(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Veg">Vegetarian Meal</option>
                    <option value="Non-Veg">Non-Vegetarian Meal</option>
                    <option value="No Food">No Food / Opt-Out</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Price Breakdown in INR (₹) & Confirmation */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 block">Total Indian Railways Fare (INR):</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
                    ₹{totalPrice}.00
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    +5% Cashback with RailPay
                  </span>
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
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Proceed to Virtual Payment (₹{totalPrice})</span>
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
