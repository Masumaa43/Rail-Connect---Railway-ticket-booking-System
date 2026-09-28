import React from 'react';
import { SearchForm } from './SearchForm';
import { ShieldCheck, Zap, Clock, Train, Sparkles, MapPin, Bookmark } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (params: {
    fromStation: string;
    toStation: string;
    travelDate: string;
    returnDate?: string;
    tripType: 'one-way' | 'round-trip';
    passengers: number;
    quota: string;
    travelClass: string;
  }) => void;
  initialFrom?: string;
  initialTo?: string;
  isSearching?: boolean;
  onScrollToScenarios?: () => void;
  onOpenStationGuide?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  initialFrom,
  initialTo,
  isSearching,
  onScrollToScenarios,
  onOpenStationGuide,
}) => {
  return (
    <section className="relative pt-3 pb-6 sm:pt-4 sm:pb-8 overflow-hidden bg-slate-950">
      {/* Indian Railways Train Backdrop with streamlined height */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="/src/assets/images/vande_bharat_train_1790504178153.jpg"
          alt="Indian Railways Vande Bharat Express Train"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 opacity-30 brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-slate-950/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/25 via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimized, Streamlined Hero Header */}
        <div className="max-w-4xl mx-auto text-center pt-1 pb-3 sm:pb-4">
          {/* Compact Category Pill */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-400 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Official Indian Railways Booking & Real-time Services</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">Vande Bharat & Express Network</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Book Train Tickets Anywhere in India <span className="text-emerald-400 font-medium">in Real-Time (₹)</span>
          </h1>

          <p className="mt-1.5 text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto font-normal">
            Instant PRS reservation across 7,000+ stations. Check live seat availability, onboard e-catering, area scenic windows & bookmark famous destinations.
          </p>

          {/* Compact Feature Chips with direct scenario jump */}
          <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] text-slate-300">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-800 text-slate-300">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>Instant Confirmation</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-800 text-slate-300">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Official IRCTC Fares (₹)</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-800 text-slate-300">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>Live NTES Tracking</span>
            </span>
            {onOpenStationGuide && (
              <button
                type="button"
                onClick={onOpenStationGuide}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition-all cursor-pointer font-semibold shadow-xs"
              >
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>Google Maps Station Navigator</span>
              </button>
            )}
            {onScrollToScenarios && (
              <button
                type="button"
                onClick={onScrollToScenarios}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-all cursor-pointer font-semibold shadow-xs"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Explore Area Scenarios & Bookmarks</span>
              </button>
            )}
          </div>
        </div>

        {/* Hero Search Box Container - Docks directly into view */}
        <div className="max-w-5xl mx-auto">
          <SearchForm
            onSearch={onSearch}
            initialFrom={initialFrom}
            initialTo={initialTo}
            isSearching={isSearching}
          />
        </div>
      </div>
    </section>
  );
};
