import React, { useState } from 'react';
import { POPULAR_ROUTES, PopularRoute } from '../data/railData';
import { ArrowRight, Clock, Gauge, Train, Sparkles, Navigation, MapPin } from 'lucide-react';

interface PopularRoutesProps {
  onSelectRoute: (route: PopularRoute) => void;
  onOpenStationGuide?: (stationName: string) => void;
}

export const PopularRoutes: React.FC<PopularRoutesProps> = ({ 
  onSelectRoute,
  onOpenStationGuide 
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Popular Corridors' },
    { id: 'vande_bharat', label: 'Vande Bharat Express' },
    { id: 'rajdhani', label: 'Rajdhani Corridors' },
    { id: 'scenic', label: 'Scenic & Coastal' },
  ];

  const filteredRoutes = POPULAR_ROUTES.filter(route => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'vande_bharat') return route.category.toLowerCase().includes('vande') || route.trainName.toLowerCase().includes('vande');
    if (activeCategory === 'rajdhani') return route.category.toLowerCase().includes('rajdhani') || route.category.toLowerCase().includes('quadrilateral');
    if (activeCategory === 'scenic') return route.category.toLowerCase().includes('scenic') || route.category.toLowerCase().includes('devotional') || route.category.toLowerCase().includes('konkan');
    return true;
  });

  return (
    <section id="popular-routes" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-semibold text-emerald-700 tracking-wider uppercase mb-1.5 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
              <span>Curated Indian Railway Corridors</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Popular Train Routes in India
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl">
              Experience the best of Indian Railways with Vande Bharat, Tejas Rajdhani, and Shatabdi express services. Guaranteed seat availability, INR pricing, and live Google Maps station guidance.
            </p>
          </div>

          {/* Interactive Category Filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl self-start md:self-auto overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Route Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutes.map((route) => (
            <div
              key={route.id}
              className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Image Container with Fallback */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <img
                  src={route.image}
                  alt={`${route.fromStation} to ${route.toStation} Indian railway route`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.classList.add('bg-gradient-to-br', 'from-slate-800', 'to-slate-900', 'flex', 'items-center', 'justify-center');
                    }
                  }}
                />
                
                {/* Gradient Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                {/* Over-image Route details */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold tracking-wide text-white bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/15">
                    {route.category}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-300 bg-black/60 px-2 py-0.5 rounded border border-emerald-400/30">
                    {route.trainNumber}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-xs font-bold text-emerald-300 mb-0.5">
                    {route.trainName}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-200">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{route.duration} ({route.distance})</span>
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-300">
                      <span>{route.frequency}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Origin to Destination */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-slate-900 truncate">
                        {route.fromStation.split(' Railway')[0].split(' Junction')[0]}
                      </div>
                      <span className="text-xs text-slate-500 font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                        {route.fromCode}
                      </span>
                    </div>

                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-400 shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1 text-right">
                      <div className="text-sm font-bold text-slate-900 truncate">
                        {route.toStation.split(' Railway')[0].split(' Junction')[0]}
                      </div>
                      <span className="text-xs text-slate-500 font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                        {route.toCode}
                      </span>
                    </div>
                  </div>

                  {/* Route Highlights */}
                  <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                    {route.highlight}
                  </p>

                  {/* Maps Station Explorer link */}
                  {onOpenStationGuide && (
                    <button
                      type="button"
                      onClick={() => onOpenStationGuide(route.fromStation)}
                      className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                    >
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>Station & Map Guide ({route.fromCode})</span>
                    </button>
                  )}
                </div>

                {/* Pricing & Booking Action */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="block text-[11px] text-slate-400 font-medium">Starting from</span>
                    <div className="text-lg font-bold text-slate-900 tabular-nums">
                      {route.currency}{route.startingPrice.toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-slate-500 ml-1">/ person</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectRoute(route)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-lg transition-colors cursor-pointer group/btn"
                  >
                    <span>Book Route</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
