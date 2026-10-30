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
      {/* Indian Railways Train Backdrop with clear visibility */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/images/vande_bharat_express.jpg"
          alt="Indian Railways Vande Bharat Express Train"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 opacity-55 brightness-90"
          onError={(e) => {
            e.currentTarget.src = '/src/assets/images/vande_bharat_express_1793352021993.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/30 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Streamlined Hero Header with Featured Train Showcase */}
        <div className="max-w-4xl mx-auto text-center pt-1 pb-4 sm:pb-5">
          {/* Compact Category Pill */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 backdrop-blur-md text-[11px] font-semibold text-emerald-300 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Official Indian Railways Booking & Real-time Services</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-200">Vande Bharat & Express Network</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
            Book Train Tickets Anywhere in India <span className="text-emerald-400 font-medium">in Real-Time (₹)</span>
          </h1>

          <p className="mt-1.5 text-xs sm:text-sm text-slate-200 max-w-2xl mx-auto font-normal drop-shadow-xs">
            Instant PRS reservation across 7,000+ stations. Check live seat availability, onboard e-catering, area scenic windows & bookmark famous destinations.
          </p>

          {/* Featured Hero Image Strip inside the selected Hero Header */}
          <div className="mt-3.5 mb-3 grid grid-cols-3 gap-2.5 max-w-3xl mx-auto">
            <div className="relative h-20 sm:h-24 rounded-xl overflow-hidden border border-white/15 shadow-lg group">
              <img
                src="/images/vande_bharat_express.jpg"
                alt="Vande Bharat Express High Speed Train"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
              <span className="absolute bottom-1.5 left-2 text-[10px] sm:text-xs font-bold text-white flex items-center gap-1">
                <Train className="w-3 h-3 text-emerald-400" />
                <span>Vande Bharat 160 km/h</span>
              </span>
            </div>

            <div className="relative h-20 sm:h-24 rounded-xl overflow-hidden border border-white/15 shadow-lg group">
              <img
                src="/images/konkan_coastal_rail.jpg"
                alt="Konkan Scenic Waterfall Viaduct"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
              <span className="absolute bottom-1.5 left-2 text-[10px] sm:text-xs font-bold text-white flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Konkan & Dudhsagar</span>
              </span>
            </div>

            <div className="relative h-20 sm:h-24 rounded-xl overflow-hidden border border-white/15 shadow-lg group">
              <img
                src="/images/himalayan_kashmir_rail.jpg"
                alt="Himalayan Kashmir Chenab Bridge"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
              <span className="absolute bottom-1.5 left-2 text-[10px] sm:text-xs font-bold text-white flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400" />
                <span>Kashmir Chenab Rail</span>
              </span>
            </div>
          </div>

          {/* Compact Feature Chips with direct scenario jump */}
          <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] text-slate-200">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-slate-200">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>Instant Confirmation</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-slate-200">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Official IRCTC Fares (₹)</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-slate-200">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>Live NTES Tracking</span>
            </span>
            {onOpenStationGuide && (
              <button
                type="button"
                onClick={onOpenStationGuide}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 transition-all cursor-pointer font-semibold shadow-xs"
              >
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>Google Maps Station Navigator</span>
              </button>
            )}
            {onScrollToScenarios && (
              <button
                type="button"
                onClick={onScrollToScenarios}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 transition-all cursor-pointer font-semibold shadow-xs"
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
