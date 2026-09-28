import React from 'react';
import { Train, Ticket, MapPin, Sparkles, LogIn, LogOut, Utensils, ShieldAlert, PhoneCall, Bookmark, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenBookings: () => void;
  bookingCount: number;
  onOpenLiveStatus: () => void;
  onOpenStationGuide: () => void;
  onOpenFoodModal: () => void;
  onOpenEmergencyModal: () => void;
  onScrollToSearch: () => void;
  onScrollToRoutes: () => void;
  onScrollToWhyUs: () => void;
  onScrollToScenarios?: () => void;
  bookmarkCount?: number;
  walletBalance?: number;
  onOpenWallet?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBookings,
  bookingCount,
  onOpenLiveStatus,
  onOpenStationGuide,
  onOpenFoodModal,
  onOpenEmergencyModal,
  onScrollToSearch,
  onScrollToRoutes,
  onScrollToWhyUs,
  onScrollToScenarios,
  bookmarkCount = 0,
  walletBalance = 5000,
  onOpenWallet,
}) => {
  const { user, loginWithGoogle, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Brand element */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-lg py-1 px-1.5 -ml-1.5"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm group-hover:bg-emerald-700 transition-colors">
            <Train className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 font-sans">
                Rail<span className="text-emerald-600">Connect</span>
              </span>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded font-mono">
                INDIA
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium tracking-tight -mt-0.5 hidden sm:block">
              Pan-India Realtime Rail Booking & IRCTC Services
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-600">
          <button
            onClick={onScrollToSearch}
            className="hover:text-emerald-600 transition-colors whitespace-nowrap cursor-pointer py-1"
          >
            Search Any Route
          </button>
          <button
            onClick={onScrollToRoutes}
            className="hover:text-emerald-600 transition-colors whitespace-nowrap cursor-pointer py-1"
          >
            Corridors
          </button>
          {onScrollToScenarios && (
            <button
              onClick={onScrollToScenarios}
              className="hover:text-emerald-600 transition-colors whitespace-nowrap cursor-pointer py-1 flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Area Scenarios & Sights</span>
            </button>
          )}
          <button
            onClick={onOpenStationGuide}
            className="hover:text-emerald-600 transition-colors whitespace-nowrap cursor-pointer py-1 flex items-center gap-1 text-slate-800 font-bold"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Station Guide</span>
            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-bold">
              Google Maps
            </span>
          </button>
          <button
            onClick={onOpenFoodModal}
            className="hover:text-amber-700 transition-colors whitespace-nowrap cursor-pointer py-1 flex items-center gap-1 text-amber-800 font-bold bg-amber-50 px-2 py-1 rounded-lg border border-amber-200"
          >
            <Utensils className="w-3.5 h-3.5 text-amber-600" />
            <span>Food on Train</span>
          </button>
          <button
            onClick={onOpenLiveStatus}
            className="hover:text-emerald-600 transition-colors whitespace-nowrap cursor-pointer py-1 flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Status (NTES)
          </button>
          <button
            onClick={onOpenEmergencyModal}
            className="hover:text-rose-700 transition-colors whitespace-nowrap cursor-pointer py-1 flex items-center gap-1 text-rose-700 font-bold bg-rose-50 px-2 py-1 rounded-lg border border-rose-200"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Emergency 139</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action buttons & Google Auth */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Google Maps Station Guide shortcut on Mobile */}
          <button
            onClick={onOpenStationGuide}
            className="lg:hidden p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
            title="Google Maps Station Navigator"
          >
            <MapPin className="w-4 h-4" />
          </button>

          {/* Quick Emergency Hot Button on Mobile */}
          <button
            onClick={onOpenEmergencyModal}
            className="lg:hidden p-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
            title="Emergency 139 SOS"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>

          {/* Quick Food on Train shortcut */}
          <button
            onClick={onOpenFoodModal}
            className="lg:hidden p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
            title="Order Food on Train"
          >
            <Utensils className="w-4 h-4" />
          </button>

          {/* Bookings & PNR History button */}
          <button
            onClick={onOpenBookings}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap cursor-pointer focus:outline-none"
          >
            <Ticket className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">My Bookings & PNR</span>
            <span className="sm:hidden">Bookings</span>
            {bookingCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[11px] font-bold text-slate-900 bg-emerald-400 rounded-full tabular-nums">
                {bookingCount}
              </span>
            )}
          </button>

          {/* RailPay Virtual Wallet Quick Balance Button */}
          <button
            type="button"
            onClick={onOpenWallet || onOpenBookings}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg shadow-2xs transition-all cursor-pointer"
            title="RailPay Virtual Payment Wallet & Cashback"
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="hidden md:inline text-slate-600 font-medium">Wallet:</span>
            <span className="font-mono text-emerald-700 font-extrabold">₹{walletBalance.toLocaleString('en-IN')}</span>
            <span className="hidden lg:inline-block text-[9px] font-extrabold bg-emerald-600 text-white px-1.5 py-0.2 rounded uppercase">
              5% Back
            </span>
          </button>

          {/* Saved Places Bookmark Button */}
          {bookmarkCount > 0 && (
            <button
              onClick={onOpenBookings}
              title={`${bookmarkCount} Bookmarked Famous Places`}
              className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg shadow-2xs transition-all cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-600 fill-current" />
              <span className="text-[11px] font-bold">{bookmarkCount}</span>
            </button>
          )}

          {/* Google Auth with Firebase */}
          {user ? (
            <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-8 h-8 rounded-full border border-slate-300 object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
              )}
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-900 truncate max-w-[95px]">
                  {user.displayName?.split(' ')[0] || 'Traveler'}
                </div>
                <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Synced
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                title="Sign out of Firebase"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={loginWithGoogle}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:border-slate-400 rounded-lg shadow-2xs hover:shadow transition-all whitespace-nowrap cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
