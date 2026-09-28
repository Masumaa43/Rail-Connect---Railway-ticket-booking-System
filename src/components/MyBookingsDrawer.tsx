import React, { useState, useEffect } from 'react';
import { BookingTicket, PnrHistoryItem, FoodOrder, EmergencySosRequest, BookmarkedPlaceRecord, WalletTransaction } from '../data/railData';
import { 
  X, 
  Ticket, 
  Train, 
  Calendar, 
  MapPin, 
  QrCode, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  LogIn, 
  Cloud, 
  Clock, 
  RefreshCw, 
  Gauge, 
  Utensils, 
  ShieldAlert, 
  PlusCircle, 
  ArrowRight,
  Sparkles,
  PhoneCall,
  Bookmark,
  ExternalLink,
  Wallet,
  CreditCard,
  Receipt,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MyBookingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingTicket[];
  onCancelBooking: (pnr: string) => void;
  onViewBoardingPass: (ticket: BookingTicket) => void;
  pnrHistory: PnrHistoryItem[];
  onRefreshPnr: (pnr: string) => Promise<void>;
  onDeletePnrHistory: (id: string) => void;
  onOpenLiveTracker: (pnr?: string) => void;
  foodOrders: FoodOrder[];
  onOpenFoodModal: () => void;
  emergencyRequests: EmergencySosRequest[];
  onOpenEmergencyModal: () => void;
  bookmarkedPlaces?: BookmarkedPlaceRecord[];
  onDeleteBookmark?: (bookmarkId: string) => void;
  onBookToStation?: (stationName: string) => void;
  walletBalance?: number;
  walletTransactions?: WalletTransaction[];
  onTopupWallet?: (amount: number) => Promise<void> | void;
  initialTab?: 'tickets' | 'pnr_history' | 'food' | 'emergency' | 'saved_places' | 'wallet';
}

export const MyBookingsDrawer: React.FC<MyBookingsDrawerProps> = ({
  isOpen,
  onClose,
  bookings,
  onCancelBooking,
  onViewBoardingPass,
  pnrHistory,
  onRefreshPnr,
  onDeletePnrHistory,
  onOpenLiveTracker,
  foodOrders,
  onOpenFoodModal,
  emergencyRequests,
  onOpenEmergencyModal,
  bookmarkedPlaces = [],
  onDeleteBookmark,
  onBookToStation,
  walletBalance = 5000,
  walletTransactions = [],
  onTopupWallet,
  initialTab,
}) => {
  const { user, loginWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<'tickets' | 'pnr_history' | 'food' | 'emergency' | 'saved_places' | 'wallet'>('tickets');
  const [refreshingPnr, setRefreshingPnr] = useState<string | null>(null);
  const [topupInputAmount, setTopupInputAmount] = useState<number>(1000);
  const [isTopupProcessing, setIsTopupProcessing] = useState<boolean>(false);
  const [topupSuccessMessage, setTopupSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialTab && isOpen) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleRefresh = async (pnr: string) => {
    setRefreshingPnr(pnr);
    try {
      await onRefreshPnr(pnr);
    } finally {
      setRefreshingPnr(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="px-6 py-4.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Train className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold">Indian Rail Travel Dashboard</h3>
                <p className="text-xs text-slate-300">
                  Tickets, PNR History Timeline & Onboard Services
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center border-b border-slate-200 bg-slate-50 px-3 pt-2 gap-1 overflow-x-auto shrink-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('tickets')}
              className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'tickets'
                  ? 'bg-white text-slate-900 border-t-2 border-emerald-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Ticket className="w-3.5 h-3.5 text-emerald-600" />
              <span>My Tickets</span>
              <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full text-[10px]">
                {bookings.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pnr_history')}
              className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'pnr_history'
                  ? 'bg-white text-slate-900 border-t-2 border-emerald-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>PNR History & Timeline</span>
              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                {pnrHistory.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('food')}
              className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'food'
                  ? 'bg-white text-slate-900 border-t-2 border-amber-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Utensils className="w-3.5 h-3.5 text-amber-600" />
              <span>Food on Track</span>
              {foodOrders.length > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-full text-[10px]">
                  {foodOrders.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('emergency')}
              className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'emergency'
                  ? 'bg-white text-slate-900 border-t-2 border-rose-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Emergency 139</span>
              {emergencyRequests.length > 0 && (
                <span className="px-1.5 py-0.2 bg-rose-100 text-rose-800 rounded-full text-[10px] animate-pulse">
                  {emergencyRequests.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('saved_places')}
              className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'saved_places'
                  ? 'bg-white text-slate-900 border-t-2 border-amber-500 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-current" />
              <span>Saved Places</span>
              {bookmarkedPlaces.length > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 font-bold rounded-full text-[10px]">
                  {bookmarkedPlaces.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('wallet')}
              className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'wallet'
                  ? 'bg-white text-slate-900 border-t-2 border-emerald-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-600" />
              <span>RailPay Wallet</span>
              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                ₹{walletBalance.toFixed(0)}
              </span>
            </button>
          </div>

          {/* Cloud Sync Status */}
          <div className="px-4 py-2 bg-slate-100/90 border-b border-slate-200/90 flex items-center justify-between text-xs text-slate-600 shrink-0">
            {user ? (
              <div className="flex items-center gap-1.5 font-medium">
                <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cloud Synced: <span className="font-bold text-slate-800">{user.email?.split('@')[0]}</span></span>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className="text-[11px] text-slate-500">Sign in to save PNR & meals across devices</span>
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  className="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-bold text-slate-800 hover:bg-slate-50 cursor-pointer"
                >
                  Google Sign-In
                </button>
              </div>
            )}
          </div>

          {/* Drawer Body Tabs */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* TAB 1: CONFIRMED TICKETS */}
            {activeTab === 'tickets' && (
              <div className="space-y-4">
                {bookings.length > 0 ? (
                  bookings.map((ticket) => (
                    <div
                      key={ticket.pnr}
                      className="bg-slate-50 rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-3 relative group"
                    >
                      {/* Top line with PNR & Status */}
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                          PNR: {ticket.pnr}
                        </span>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {ticket.status}
                        </span>
                      </div>

                      {/* Route & Times */}
                      <div>
                        <div className="text-xs font-bold text-slate-600 flex items-center justify-between">
                          <span>{ticket.trainNumber} · {ticket.trainName}</span>
                          <span className="font-mono text-emerald-700 font-extrabold">₹{ticket.totalPaid.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1 text-slate-900">
                          <div>
                            <span className="text-base font-extrabold">{ticket.departureTime}</span>
                            <div className="text-xs font-semibold text-slate-700">{ticket.fromCode}</div>
                          </div>
                          <div className="text-center px-3">
                            <div className="text-[10px] text-slate-400">{ticket.quota} Quota</div>
                            <div className="w-16 h-0.5 bg-slate-300 relative my-1">
                              <Train className="w-3 h-3 text-slate-500 absolute -top-1.5 left-1/2 -translate-x-1/2" />
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-base font-extrabold">{ticket.arrivalTime}</span>
                            <div className="text-xs font-semibold text-slate-700">{ticket.toCode}</div>
                          </div>
                        </div>
                      </div>

                      {/* Passenger & Seat */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs text-slate-600">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Date & Class</span>
                          <span className="font-medium text-slate-800">{ticket.travelDate} ({ticket.seatClass.split(' ')[0]})</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Coach / Berth</span>
                          <span className="font-bold text-emerald-700">{ticket.coach} - {ticket.seatNumber}</span>
                        </div>
                      </div>

                      {/* Virtual Payment Verification details */}
                      <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>{ticket.paymentMethod || 'RailPay Virtual Wallet'}</span>
                        </span>
                        <span className="text-slate-400 font-mono text-[10px] truncate max-w-[150px]">
                          {ticket.transactionId || 'TXN-IRCTC-PAID'}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onViewBoardingPass(ticket)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>View e-Ticket</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => window.print()}
                            title="Print / Save IRCTC Tax Invoice"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                          >
                            <Receipt className="w-3.5 h-3.5 text-slate-500" />
                            <span>Receipt</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={onOpenFoodModal}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Utensils className="w-3 h-3" />
                            <span>Order Food</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onCancelBooking(ticket.pnr)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h4 className="text-sm font-bold text-slate-800">No active bookings yet</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                      Search for Indian Railways trains (Vande Bharat, Rajdhani, Shatabdi) to reserve your berth.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PNR STATUS HISTORY WITH TIMELINE VISUAL */}
            {activeTab === 'pnr_history' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Previously Checked PNR History
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Real-time timeline progression from booking to arrival
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenLiveTracker()}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Check New PNR</span>
                  </button>
                </div>

                {pnrHistory.length > 0 ? (
                  pnrHistory.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-50 rounded-2xl border border-slate-200 p-4.5 space-y-4 relative shadow-2xs hover:shadow-sm transition-all"
                    >
                      {/* PNR Header Bar */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-sm text-slate-900">
                              PNR: {item.pnr}
                            </span>
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                              {item.bookingStatus}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-slate-700 mt-0.5">
                            {item.trainNumber} - {item.trainName}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleRefresh(item.pnr)}
                            disabled={refreshingPnr === item.pnr}
                            title="Refresh status in realtime"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${refreshingPnr === item.pnr ? 'animate-spin text-emerald-600' : ''}`} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeletePnrHistory(item.id)}
                            title="Remove from history"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Travel Specs Card */}
                      <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-200">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Coach & Seat</span>
                          <span className="font-bold text-emerald-700 font-mono">
                            {item.coach} / {item.berth}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Travel Class</span>
                          <span className="font-bold text-slate-800">
                            {item.classType}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Journey Route</span>
                          <span className="font-medium text-slate-700 truncate block">
                            {item.fromStation} → {item.toStation}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Current NTES Speed</span>
                          <span className="font-mono font-bold text-slate-900 flex items-center gap-1">
                            <Gauge className="w-3 h-3 text-emerald-600" />
                            {item.currentSpeed || '128 km/h'}
                          </span>
                        </div>
                      </div>

                      {/* TIMELINE VISUAL */}
                      <div className="pt-2">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Journey & Tracking Timeline</span>
                        </div>

                        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                          {item.timeline && item.timeline.length > 0 ? (
                            item.timeline.map((step, idx) => (
                              <div key={idx} className="relative group/step">
                                {/* Dot indicator */}
                                <div
                                  className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    step.completed
                                      ? 'bg-emerald-600 border-white text-white shadow-xs'
                                      : 'bg-white border-slate-300'
                                  }`}
                                >
                                  {step.completed && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                  )}
                                </div>

                                {/* Step details */}
                                <div>
                                  <div className="flex items-center justify-between gap-2">
                                    <span className={`text-xs font-bold ${step.completed ? 'text-slate-900' : 'text-slate-500'}`}>
                                      {step.title}
                                    </span>
                                    <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                                      step.completed ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                      {step.badge}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                                    {step.description}
                                  </p>
                                  <span className="text-[10px] font-mono text-slate-400 block mt-1">
                                    {step.time}
                                  </span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-xs text-slate-400">Timeline not available for this record.</div>
                          )}
                        </div>
                      </div>

                      {/* Card Footer Action */}
                      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-slate-400">
                          Inquired: {item.checkedAt}
                        </span>
                        <button
                          type="button"
                          onClick={() => onOpenLiveTracker(item.pnr)}
                          className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Open Live Satellite View</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <h4 className="text-xs font-bold text-slate-700">No PNR searches recorded</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Use the Live Status & PNR Tracker in the navbar to check any 10-digit Indian PNR.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: FOOD ON TRACK */}
            {activeTab === 'food' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      IRCTC e-Catering Deliveries
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Delivered directly to your train berth
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenFoodModal}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors cursor-pointer"
                  >
                    <Utensils className="w-3 h-3" />
                    <span>Order New Meal</span>
                  </button>
                </div>

                {foodOrders.length > 0 ? (
                  foodOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900">
                          {order.itemName} (x{order.quantity})
                        </span>
                        <span className="text-xs font-black text-amber-800 font-mono">
                          ₹{order.totalPrice}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded-xl border border-amber-200/80">
                        <div>
                          <span className="text-slate-400 text-[10px] block">Train & Berth</span>
                          <span className="font-bold text-slate-800">
                            {order.trainNumber} · Coach {order.coach} / {order.seat}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Delivery Station</span>
                          <span className="font-bold text-amber-800 truncate block">
                            {order.deliveryStation}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-amber-900 pt-1">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          <span>Status: {order.orderStatus}</span>
                        </div>
                        <span className="text-[11px] text-slate-500">{order.orderedAt}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Utensils className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <h4 className="text-xs font-bold text-slate-700">No active meal orders</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Order hot Maharaja Thalis, Biryani, or Chai combos delivered straight to your coach.
                    </p>
                    <button
                      type="button"
                      onClick={onOpenFoodModal}
                      className="mt-3 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Browse Train Menu
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: EMERGENCY SOS */}
            {activeTab === 'emergency' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      RailMadad 139 SOS Center
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Real-time emergency escalation to RPF & Medical Staff
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenEmergencyModal}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
                  >
                    <ShieldAlert className="w-3 h-3" />
                    <span>Raise SOS</span>
                  </button>
                </div>

                {emergencyRequests.length > 0 ? (
                  emergencyRequests.map((sos) => (
                    <div
                      key={sos.id}
                      className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                          {sos.emergencyType}
                        </span>
                        <span className="text-[10px] font-mono text-rose-700 font-bold bg-rose-100 px-2 py-0.5 rounded">
                          {sos.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-rose-200 leading-relaxed">
                        {sos.description}
                      </p>

                      <div className="text-[11px] text-slate-600 flex items-center justify-between">
                        <span>Coach {sos.coach}, Seat {sos.seat}</span>
                        <span className="font-semibold text-rose-800">{sos.officialsAssigned}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200 p-4">
                    <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <h4 className="text-xs font-bold text-slate-800">All Journeys Safe & Secure</h4>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                      Dial 139 anytime for 24x7 security, medical support, or onboard grievance redressing.
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-3">
                      <a
                        href="tel:139"
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                      >
                        <PhoneCall className="w-3 h-3 text-emerald-400" />
                        <span>Call 139 Helpline</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: SAVED FAMOUS PLACES / BOOKMARKS */}
            {activeTab === 'saved_places' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Bookmarked Places & Attractions</h4>
                    <p className="text-xs text-slate-500">Saved Indian travel destinations & scenic landmarks</p>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {bookmarkedPlaces.length} Saved
                  </span>
                </div>

                {bookmarkedPlaces.length > 0 ? (
                  bookmarkedPlaces.map((bkm) => (
                    <div
                      key={bkm.id}
                      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-amber-400 transition-all flex flex-col justify-between group"
                    >
                      <div className="flex gap-3">
                        <img
                          src={bkm.imageUrl}
                          alt={bkm.placeName}
                          className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-100 shadow-2xs"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-1">
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                              {bkm.category}
                            </span>
                            {onDeleteBookmark && (
                              <button
                                type="button"
                                onClick={() => onDeleteBookmark(bkm.id)}
                                title="Remove Bookmark"
                                className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <h5 className="text-xs sm:text-sm font-bold text-slate-900 mt-1 truncate">
                            {bkm.placeName}
                          </h5>

                          <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-emerald-600" />
                            <span>{bkm.cityName} · {bkm.nearestStation}</span>
                          </p>

                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                            {bkm.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <a
                          href={bkm.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-slate-600 hover:text-emerald-700 flex items-center gap-1 font-medium"
                        >
                          <ExternalLink className="w-3 h-3 text-emerald-600" />
                          <span>Google Maps</span>
                        </a>

                        {onBookToStation && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onBookToStation(bkm.nearestStation);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                          >
                            <Train className="w-3.5 h-3.5" />
                            <span>Book Train</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 p-4">
                    <Bookmark className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <h4 className="text-xs font-bold text-slate-800">No Bookmarked Places Yet</h4>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                      Explore the "Area Scenarios & Famous Places" section to bookmark Kashi Vishwanath, Dudhsagar Falls, Taj Mahal & more.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: RAILPAY VIRTUAL WALLET & PAYMENT TRANSACTIONS */}
            {activeTab === 'wallet' && (
              <div className="space-y-5">
                {/* Virtual RailPay Card Graphic */}
                <div className="relative rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white shadow-xl border border-slate-700/80 overflow-hidden">
                  {/* Subtle Background Rings */}
                  <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

                  {/* Card Header */}
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                        <Train className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-black tracking-wider block">IRCTC RailPay</span>
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">Virtual Transit Card</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                      ACTIVE
                    </span>
                  </div>

                  {/* Card Chip & Contactless Symbol */}
                  <div className="my-5 flex items-center justify-between relative z-10">
                    <div className="w-10 h-7 rounded-md bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 border border-amber-500/60 shadow-inner flex items-center justify-center">
                      <div className="w-6 h-4 border border-amber-700/40 rounded-sm grid grid-cols-2" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 tracking-widest">
                      NPCI · RBI TOKENIZED
                    </span>
                  </div>

                  {/* Available Balance */}
                  <div className="relative z-10 mb-4">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Available Virtual Balance</span>
                    <div className="text-3xl font-black font-mono tracking-tight text-white flex items-baseline gap-1 mt-0.5">
                      <span>₹{walletBalance.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Card Footer: Name & Card Number */}
                  <div className="flex items-end justify-between relative z-10 pt-3 border-t border-slate-700/60 text-xs font-mono">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Cardholder</span>
                      <span className="font-bold text-slate-200 uppercase tracking-wider">
                        {user?.displayName || 'Masuma Akhtar'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 block uppercase">Card Number</span>
                      <span className="text-slate-300 font-semibold tracking-wider">•••• 4920</span>
                    </div>
                  </div>
                </div>

                {/* 5% Cashback Perk Banner */}
                <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-emerald-950">5% Superfast Cashback</h5>
                      <p className="text-[11px] text-emerald-800">
                        Automatically credited back to your RailPay balance on all train bookings
                      </p>
                    </div>
                  </div>
                </div>

                {/* Top-Up Section */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4.5 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PlusCircle className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-xs font-bold text-slate-900">Virtual Wallet Recharge</h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">0% Processing Fee</span>
                  </div>

                  {topupSuccessMessage && (
                    <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{topupSuccessMessage}</span>
                    </div>
                  )}

                  {/* Preset Quick Recharge Chips */}
                  <div className="grid grid-cols-4 gap-2">
                    {[500, 1000, 2000, 5000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setTopupInputAmount(amt)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          topupInputAmount === amt
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300'
                        }`}
                      >
                        +₹{amt}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount Form */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₹</span>
                      <input
                        type="number"
                        min="100"
                        max="50000"
                        value={topupInputAmount}
                        onChange={(e) => setTopupInputAmount(Number(e.target.value) || 0)}
                        placeholder="Amount"
                        className="w-full pl-7 pr-3 py-2 text-xs font-bold font-mono bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={isTopupProcessing || topupInputAmount <= 0}
                      onClick={async () => {
                        if (topupInputAmount <= 0) return;
                        setIsTopupProcessing(true);
                        try {
                          if (onTopupWallet) {
                            await onTopupWallet(topupInputAmount);
                          }
                          setTopupSuccessMessage(`₹${topupInputAmount.toLocaleString('en-IN')} added to RailPay wallet!`);
                          setTimeout(() => setTopupSuccessMessage(null), 3000);
                        } finally {
                          setIsTopupProcessing(false);
                        }
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                    >
                      {isTopupProcessing ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Recharging...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Recharge Now</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Transaction Ledger */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Wallet Transaction History
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {walletTransactions.length} records
                    </span>
                  </div>

                  {walletTransactions.length > 0 ? (
                    <div className="space-y-2">
                      {walletTransactions.map((tx) => {
                        const isCredit = tx.type === 'CREDIT';
                        return (
                          <div
                            key={tx.id}
                            className="p-3 bg-slate-50 border border-slate-200/90 rounded-2xl flex items-center justify-between text-xs hover:bg-slate-100/70 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                isCredit ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                              }`}>
                                {isCredit ? (
                                  <ArrowDownLeft className="w-4 h-4" />
                                ) : (
                                  <ArrowUpRight className="w-4 h-4" />
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 line-clamp-1">{tx.description}</div>
                                <div className="text-[10px] text-slate-500 font-mono mt-0.5 flex items-center gap-1.5">
                                  <span>{tx.timestamp}</span>
                                  <span>·</span>
                                  <span className="text-slate-400">Ref: {tx.referenceId}</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className={`font-mono font-extrabold text-xs block ${
                                isCredit ? 'text-emerald-700' : 'text-slate-900'
                              }`}>
                                {isCredit ? '+' : '-'}₹{tx.amount.toFixed(2)}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Bal: ₹{tx.balanceAfter.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
                      No wallet transactions recorded yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between shrink-0">
            <span className="text-[11px]">Synced with Indian Railways PRS & NTES</span>
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
    </div>
  );
};
