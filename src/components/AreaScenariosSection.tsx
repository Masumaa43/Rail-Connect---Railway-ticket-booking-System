import React, { useState } from 'react';
import { 
  AreaScenario, 
  AREA_SCENARIOS, 
  ScenicPlace, 
  SCENIC_PLACES, 
  BookmarkedPlaceRecord 
} from '../data/railData';
import { 
  Bookmark, 
  BookmarkCheck, 
  MapPin, 
  Sparkles, 
  Compass, 
  CloudSun, 
  Utensils, 
  Train, 
  ArrowRight, 
  ExternalLink, 
  Star, 
  Eye, 
  Check, 
  Flame, 
  Droplets,
  Calendar,
  Layers,
  ChevronRight,
  Heart
} from 'lucide-react';

interface AreaScenariosSectionProps {
  bookmarkedPlaces: BookmarkedPlaceRecord[];
  onToggleBookmark: (place: ScenicPlace) => void;
  onBookToStation: (stationName: string) => void;
  onOpenStationGuide?: (stationName: string) => void;
  currentFromStation?: string;
  currentToStation?: string;
}

export const AREA_REGIONS = [
  { id: 'all', name: 'All India Regions', badge: 'Pan-India' },
  { id: 'varanasi-ganga', name: 'Varanasi & Holy Ganges', badge: 'Spiritual River Corridor' },
  { id: 'delhi-agra', name: 'Delhi NCR & Yamuna Plains', badge: 'High-Speed KAVACH' },
  { id: 'mumbai-ghats', name: 'Mumbai & Western Ghats', badge: 'Reverse Incline & Gorges' },
  { id: 'goa-konkan', name: 'Goa & Konkan Coastal Route', badge: 'Dudhsagar & Estuaries' },
  { id: 'rajasthan-royal', name: 'Rajasthan Royal Heritage', badge: 'Desert Golden Hour' },
  { id: 'himalaya-kashmir', name: 'Himalayan & Kashmir Rail', badge: 'Chenab Bridge & Shivalik' },
  { id: 'kolkata-east', name: 'Kolkata & Eastern Corridors', badge: 'Hooghly & Howrah Wharf' },
  { id: 'bengaluru-south', name: 'Bengaluru & South Deccan', badge: 'Nilgiri & Filter Coffee' },
];

export const AreaScenariosSection: React.FC<AreaScenariosSectionProps> = ({
  bookmarkedPlaces,
  onToggleBookmark,
  onBookToStation,
  onOpenStationGuide,
  currentFromStation,
  currentToStation,
}) => {
  const [selectedAreaId, setSelectedAreaId] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'scenarios' | 'famous_places' | 'my_bookmarks'>('scenarios');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Filter Scenarios
  const filteredScenarios = AREA_SCENARIOS.filter((scen) => {
    if (selectedAreaId === 'all') return true;
    return scen.areaId === selectedAreaId;
  });

  // Filter Famous Places
  const filteredPlaces = SCENIC_PLACES.filter((place) => {
    // Area filter
    if (selectedAreaId !== 'all') {
      const areaMatches: Record<string, string[]> = {
        'varanasi-ganga': ['BSB', 'DDU', 'PRYJ'],
        'delhi-agra': ['NDLS', 'DLI', 'NZM', 'AGC'],
        'mumbai-ghats': ['CSMT', 'MMCT', 'PUNE'],
        'goa-konkan': ['MAO', 'RN'],
        'rajasthan-royal': ['JP', 'JU'],
        'himalaya-kashmir': ['SVDK', 'JAT', 'DDN'],
        'kolkata-east': ['HWH', 'SDAH', 'PURI'],
        'bengaluru-south': ['SBC', 'MAS', 'MYS'],
      };
      const allowedCodes = areaMatches[selectedAreaId] || [];
      if (!allowedCodes.includes(place.nearestStationCode)) {
        return false;
      }
    }
    // Category filter
    if (filterCategory !== 'all') {
      if (place.category !== filterCategory) return false;
    }
    return true;
  });

  const isPlaceBookmarked = (placeId: string) => {
    return bookmarkedPlaces.some((b) => b.placeId === placeId);
  };

  return (
    <section id="area-scenarios-section" className="py-12 bg-slate-900 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-950/40 via-slate-900 to-slate-950 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Route Scenarios & Famous Landmarks</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Scenarios in that Area & Bookmark Famous Places
            </h2>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl">
              Discover scenic train window views, weather & fog alerts, iconic station food stops, and bookmark must-visit Indian landmarks with direct train booking.
            </p>
          </div>

          {/* Tab Selector: Scenarios vs Famous Places vs Saved Bookmarks */}
          <div className="flex items-center bg-slate-950 border border-slate-800 p-1 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('scenarios')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'scenarios'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Area Scenarios ({filteredScenarios.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('famous_places')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'famous_places'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Famous Places ({filteredPlaces.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('my_bookmarks')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'my_bookmarks'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>Saved Bookmarks ({bookmarkedPlaces.length})</span>
            </button>
          </div>
        </div>

        {/* Region & Area Corridor Horizontal Filter Chips */}
        <div className="py-4 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-emerald-400" />
            Area Corridor:
          </span>
          {AREA_REGIONS.map((region) => (
            <button
              key={region.id}
              type="button"
              onClick={() => setSelectedAreaId(region.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedAreaId === region.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-xs'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60 hover:bg-slate-800'
              }`}
            >
              <span>{region.name}</span>
              {region.id !== 'all' && (
                <span className="text-[10px] opacity-75 font-normal px-1 py-0.2 rounded bg-slate-900">
                  {region.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: AREA JOURNEY SCENARIOS */}
        {activeTab === 'scenarios' && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredScenarios.map((scen) => (
              <div
                key={scen.id}
                className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-xl group"
              >
                <div>
                  {/* Category Pill and Best Window Side */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      scen.category === 'Scenic Vista'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : scen.category === 'Weather & Monsoon'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : scen.category === 'Station Food'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {scen.category}
                    </span>

                    <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {scen.bestWindowSide}
                    </span>
                  </div>

                  {/* Scenario Title */}
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    {scen.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    {scen.description}
                  </p>

                  {/* Timing & Highlights */}
                  <div className="mt-3.5 space-y-1.5 text-[11px] bg-slate-900/90 rounded-xl p-3 border border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <span className="text-emerald-400 font-bold shrink-0">Best Time:</span>
                      <span className="truncate">{scen.timingHighlight}</span>
                    </div>
                    {scen.weatherTip && (
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <span className="text-amber-400 font-bold shrink-0">Area Advisory:</span>
                        <span className="truncate">{scen.weatherTip}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer with key stations and quick booking */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="text-[10px] text-slate-400 truncate">
                    <span className="font-semibold text-slate-300">En Route: </span>
                    {scen.keyStations[0]}
                  </div>

                  <button
                    type="button"
                    onClick={() => onBookToStation(scen.keyStations[0])}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/70 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                  >
                    <span>Find Trains</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: FAMOUS PLACES TO BOOKMARK */}
        {activeTab === 'famous_places' && (
          <div>
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-none text-xs">
              <span className="text-slate-400 font-semibold mr-1">Filter Type:</span>
              {['all', 'Spiritual & Ghats', 'Heritage & Forts', 'Nature & Waterfalls', 'Iconic Landmark', 'Architectural Marvel'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cat === 'all' ? 'All Types' : cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPlaces.map((place) => {
                const bookmarked = isPlaceBookmarked(place.id);
                return (
                  <div
                    key={place.id}
                    className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 transition-all hover:shadow-xl group"
                  >
                    <div>
                      {/* Image Preview with Bookmark Toggle Overlay */}
                      <div className="relative h-44 w-full overflow-hidden bg-slate-800">
                        <img
                          src={place.imageUrl}
                          alt={place.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/90 text-white backdrop-blur-xs border border-white/10 shadow-sm">
                            {place.category}
                          </span>
                        </div>

                        {/* Interactive Bookmark Button */}
                        <button
                          type="button"
                          onClick={() => onToggleBookmark(place)}
                          title={bookmarked ? 'Remove Bookmark' : 'Bookmark this Famous Place'}
                          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer shadow-md ${
                            bookmarked
                              ? 'bg-amber-500 text-white scale-105 ring-2 ring-amber-300'
                              : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-900'
                          }`}
                        >
                          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                        </button>

                        {/* Rating and Distance Badge */}
                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 text-amber-300 font-bold bg-slate-900/80 px-2 py-0.5 rounded-md backdrop-blur-xs">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{place.rating.toFixed(1)}</span>
                          </div>
                          <div className="text-[11px] text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            <span>{place.distanceFromStation}</span>
                          </div>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="p-4">
                        <div className="flex items-baseline justify-between gap-1">
                          <h3 className="text-base font-bold text-white leading-snug">
                            {place.name}
                          </h3>
                        </div>

                        <p className="text-xs text-emerald-400 font-medium mt-0.5">
                          {place.cityName}, {place.state}
                        </p>

                        <p className="mt-2 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {place.description}
                        </p>

                        <div className="mt-3 p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400">
                          <span className="font-semibold text-slate-300">Best Timing: </span>
                          <span>{place.bestTimeToVisit}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="px-4 pb-4 pt-1 flex items-center gap-2">
                      {/* Direct Train Search Button */}
                      <button
                        type="button"
                        onClick={() => onBookToStation(place.nearestStation)}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Train className="w-3.5 h-3.5" />
                        <span>Book to {place.nearestStationCode}</span>
                      </button>

                      {/* Google Maps Station & Amenities Guide */}
                      {onOpenStationGuide && (
                        <button
                          type="button"
                          onClick={() => onOpenStationGuide(place.nearestStation)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer border border-slate-700 flex items-center gap-1"
                          title={`Explore ${place.nearestStation} Station on Google Maps`}
                        >
                          <MapPin className="w-4 h-4" />
                          <span className="text-[11px] font-semibold hidden sm:inline">Guide</span>
                        </button>
                      )}

                      {/* Google Maps External Link */}
                      <a
                        href={place.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
                        title="View on Google Maps India"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: MY SAVED BOOKMARKS */}
        {activeTab === 'my_bookmarks' && (
          <div>
            {bookmarkedPlaces.length === 0 ? (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-amber-400 mb-3">
                  <Bookmark className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">No Saved Bookmarks Yet</h4>
                <p className="mt-1 text-xs text-slate-400">
                  Click the bookmark star/ribbon on any famous place above to create your Indian travel bucket list!
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('famous_places')}
                  className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Browse Famous Places
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookmarkedPlaces.map((bkm) => (
                  <div
                    key={bkm.id}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between relative group hover:border-amber-500/50 transition-all"
                  >
                    <div className="flex gap-3">
                      <img
                        src={bkm.imageUrl}
                        alt={bkm.placeName}
                        className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-800"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                            Bookmarked
                          </span>
                          <span className="text-[10px] text-slate-400">{bkm.bookmarkedAt}</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-1">
                          {bkm.placeName}
                        </h4>
                        <p className="text-[11px] text-emerald-400 truncate">
                          {bkm.cityName} · {bkm.nearestStation}
                        </p>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                          {bkm.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <a
                        href={bkm.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3 text-emerald-400" />
                        <span>Google Maps</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => onBookToStation(bkm.nearestStation)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/70 border border-emerald-800 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <Train className="w-3 h-3" />
                        <span>Book Train</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
