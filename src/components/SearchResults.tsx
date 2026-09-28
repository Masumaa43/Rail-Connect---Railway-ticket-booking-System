import React, { useState } from 'react';
import { TrainSchedule, ClassFare } from '../data/railData';
import { 
  ArrowRight, 
  Clock, 
  Wifi, 
  Zap, 
  Utensils, 
  VolumeX, 
  Check, 
  Filter, 
  ArrowUpDown,
  Sparkles,
  Info,
  Calendar,
  ShieldCheck,
  Armchair,
  Train
} from 'lucide-react';

interface SearchResultsProps {
  schedules: TrainSchedule[];
  searchParams: {
    fromStation: string;
    toStation: string;
    travelDate: string;
    returnDate?: string;
    tripType: string;
    passengers: number;
    quota: string;
    travelClass: string;
  };
  onSelectTrain: (train: TrainSchedule, selectedClassKey: string) => void;
  onModifySearch: () => void;
  onOpenStationGuide?: (stationName: string) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  schedules,
  searchParams,
  onSelectTrain,
  onModifySearch,
  onOpenStationGuide,
}) => {
  const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const [trainTypeFilter, setTrainTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'departure' | 'price' | 'duration'>('departure');
  const [selectedClasses, setSelectedClasses] = useState<{ [trainId: string]: string }>({});

  const getClassKeyForTrain = (train: TrainSchedule): string => {
    if (selectedClasses[train.id]) {
      return selectedClasses[train.id];
    }
    // Pick first available class key
    const availableKeys = Object.keys(train.classes);
    return availableKeys[0] || 'CC';
  };

  const handleClassChange = (trainId: string, classKey: string) => {
    setSelectedClasses(prev => ({ ...prev, [trainId]: classKey }));
  };

  // Filter schedules
  const filtered = schedules.filter(train => {
    if (trainTypeFilter !== 'all' && train.trainType !== trainTypeFilter) return false;
    const hour = parseInt(train.departureTime.split(':')[0], 10);
    if (timeFilter === 'morning' && (hour < 6 || hour >= 12)) return false;
    if (timeFilter === 'afternoon' && (hour < 12 || hour >= 18)) return false;
    if (timeFilter === 'evening' && hour < 18) return false;
    return true;
  });

  // Sort schedules
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price') {
      const clsKeyA = getClassKeyForTrain(a);
      const clsKeyB = getClassKeyForTrain(b);
      const priceA = a.classes[clsKeyA]?.price || 9999;
      const priceB = b.classes[clsKeyB]?.price || 9999;
      return priceA - priceB;
    }
    if (sortBy === 'duration') {
      const getMins = (dur: string) => {
        const parts = dur.match(/(\d+)h\s*(\d+)m/);
        if (!parts) return 0;
        return parseInt(parts[1], 10) * 60 + parseInt(parts[2], 10);
      };
      return getMins(a.duration) - getMins(b.duration);
    }
    return a.departureTime.localeCompare(b.departureTime);
  });

  return (
    <div id="search-results-section" className="py-12 bg-slate-100/70 border-t border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Header / Route Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
              <span>Indian Railways Timetable & Fares Found</span>
              <span>·</span>
              <span>{sorted.length} {sorted.length === 1 ? 'Train' : 'Trains'} Running</span>
            </div>
            <div className="flex items-center flex-wrap gap-2 text-xl sm:text-2xl font-extrabold text-slate-900">
              <span>{searchParams.fromStation}</span>
              <ArrowRight className="w-5 h-5 text-slate-400 shrink-0" />
              <span>{searchParams.toStation}</span>
            </div>
            <div className="flex items-center flex-wrap gap-2 mt-1.5 text-xs text-slate-500 font-medium">
              <span>Journey: {searchParams.travelDate}</span>
              <span>·</span>
              <span>{searchParams.passengers} {searchParams.passengers === 1 ? 'Passenger' : 'Passengers'}</span>
              <span>·</span>
              <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {searchParams.quota}
              </span>
              <span>·</span>
              <span>{searchParams.travelClass}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onModifySearch}
            className="self-start md:self-auto px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Modify Search
          </button>
        </div>

        {/* Filter and Sort Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          {/* Time of Day Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-xl overflow-x-auto">
            <span className="text-xs font-bold text-slate-500 px-2 shrink-0">Time:</span>
            {[
              { id: 'all', label: 'All Day' },
              { id: 'morning', label: 'Morning (06:00 - 12:00)' },
              { id: 'afternoon', label: 'Afternoon (12:00 - 18:00)' },
              { id: 'evening', label: 'Night (18:00+)' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTimeFilter(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  timeFilter === tab.id
                    ? 'bg-white text-slate-900 font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Train Category Filter & Sort Selectors */}
          <div className="flex items-center flex-wrap gap-3">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700">
              <span>Category:</span>
              <select
                value={trainTypeFilter}
                onChange={(e) => setTrainTypeFilter(e.target.value)}
                className="bg-transparent font-semibold text-slate-900 border-none outline-none p-0 cursor-pointer focus:ring-0"
              >
                <option value="all">All Indian Trains</option>
                <option value="Mail / Express">Mail / Express (South Bihar, Sarnath, etc.)</option>
                <option value="Local Passenger / MEMU">Local Passenger / MEMU Local</option>
                <option value="Vande Bharat">Vande Bharat Express</option>
                <option value="Tejas Rajdhani">Tejas Rajdhani</option>
                <option value="Shatabdi">Shatabdi Express</option>
                <option value="Superfast Express">Superfast Express</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-semibold text-slate-900 border-none outline-none p-0 cursor-pointer focus:ring-0"
              >
                <option value="departure">Earliest Departure</option>
                <option value="price">Lowest Fare (₹)</option>
                <option value="duration">Fastest Duration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Train Schedule Cards */}
        {sorted.length > 0 ? (
          <div className="space-y-4">
            {sorted.map((train) => {
              const currentClassKey = getClassKeyForTrain(train);
              const classDetails: ClassFare = train.classes[currentClassKey] || Object.values(train.classes)[0];

              return (
                <div
                  key={train.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* Operator & Train Info (lg:col-span-3) */}
                    <div className="lg:col-span-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <span className="font-mono bg-slate-900 text-white px-2 py-0.5 rounded text-[11px] font-bold">
                          #{train.trainNumber}
                        </span>
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-200">
                          {train.trainType}
                        </span>
                      </div>
                      <div className="text-base font-bold text-slate-900 mt-1">
                        {train.trainName}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        <span>{train.platform}</span>
                        <span>·</span>
                        <span className="text-emerald-700 font-medium">On-time: {train.onTimeRate}</span>
                      </div>

                      {/* Running days badge */}
                      <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Runs: {train.runningDays.join(', ')}</span>
                      </div>

                      {/* Amenities Icons */}
                      <div className="flex items-center gap-2.5 mt-3 text-slate-400">
                        <span title="High-Speed Infotainment / Wi-Fi">
                          <Wifi className="w-4 h-4 hover:text-slate-700 transition-colors" />
                        </span>
                        <span title="AC Power / Charging Sockets">
                          <Zap className="w-4 h-4 hover:text-slate-700 transition-colors" />
                        </span>
                        {train.pantry && (
                          <span title="Pantry & Catering Car">
                            <Utensils className="w-4 h-4 hover:text-slate-700 transition-colors text-emerald-600" />
                          </span>
                        )}
                        <span title="Clean Linen / Quiet Zones">
                          <VolumeX className="w-4 h-4 hover:text-slate-700 transition-colors" />
                        </span>
                      </div>
                    </div>

                    {/* Timeline & Durations (lg:col-span-4) */}
                    <div className="lg:col-span-4">
                      <div className="flex items-center justify-between gap-3">
                        {/* Departure */}
                        <div>
                          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                            {train.departureTime}
                          </div>
                          {onOpenStationGuide ? (
                            <button
                              type="button"
                              onClick={() => onOpenStationGuide(train.fromStation)}
                              className="text-xs font-bold text-slate-800 hover:text-emerald-700 transition-colors cursor-pointer flex items-center gap-1 group"
                              title="Explore station amenities on Google Maps"
                            >
                              <span>{train.fromCode}</span>
                              <span className="text-[10px] text-emerald-600 opacity-80 group-hover:opacity-100">Maps ↗</span>
                            </button>
                          ) : (
                            <div className="text-xs font-bold text-slate-800">
                              {train.fromCode}
                            </div>
                          )}
                          <div className="text-[11px] text-slate-400 truncate max-w-[100px]">
                            {train.fromStation}
                          </div>
                        </div>

                        {/* Midline duration */}
                        <div className="flex-1 flex flex-col items-center px-2">
                          <div className="text-[11px] font-medium text-slate-500 mb-1 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{train.duration}</span>
                          </div>
                          <div className="w-full flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full border-2 border-emerald-600 bg-white" />
                            <div className="flex-1 h-0.5 bg-slate-300 relative">
                              {train.stops > 0 && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-500" />
                              )}
                            </div>
                            <div className="w-2 h-2 rounded-full bg-emerald-600" />
                          </div>
                          <div className="text-[10px] font-medium text-slate-500 mt-1">
                            {train.stops === 0 ? 'Non-stop' : `${train.stops} intermediate halts`}
                          </div>
                        </div>

                        {/* Arrival */}
                        <div className="text-right">
                          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                            {train.arrivalTime}
                          </div>
                          {onOpenStationGuide ? (
                            <button
                              type="button"
                              onClick={() => onOpenStationGuide(train.toStation)}
                              className="text-xs font-bold text-slate-800 hover:text-emerald-700 transition-colors cursor-pointer flex items-center justify-end gap-1 ml-auto group"
                              title="Explore destination station amenities on Google Maps"
                            >
                              <span className="text-[10px] text-emerald-600 opacity-80 group-hover:opacity-100">Maps ↗</span>
                              <span>{train.toCode}</span>
                            </button>
                          ) : (
                            <div className="text-xs font-bold text-slate-800">
                              {train.toCode}
                            </div>
                          )}
                          <div className="text-[11px] text-slate-400 truncate max-w-[100px]">
                            {train.toStation}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Class Selector & Fare (lg:col-span-5) */}
                    <div className="lg:col-span-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 lg:pt-0 lg:pl-6 lg:border-l border-slate-100">
                      {/* Indian Railway Class Selector */}
                      <div className="flex flex-col gap-1.5 flex-1">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Choose Coach Class:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                          {Object.keys(train.classes).map((clsKey) => {
                            const fare = train.classes[clsKey];
                            const isSelected = currentClassKey === clsKey;
                            return (
                              <button
                                key={clsKey}
                                type="button"
                                onClick={() => handleClassChange(train.id, clsKey)}
                                className={`p-1.5 text-center rounded-lg transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-white text-slate-900 shadow-sm font-bold border border-emerald-600'
                                    : 'text-slate-600 hover:bg-slate-200/70'
                                }`}
                              >
                                <div className="text-[11px] font-bold text-emerald-800">{fare.code}</div>
                                <div className="text-xs font-bold tabular-nums">₹{fare.price}</div>
                                <div className="text-[9px] font-semibold text-emerald-700">
                                  {fare.status} {fare.availableSeats}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Total in INR (₹) and CTA */}
                      <div className="text-right sm:min-w-[130px] flex flex-col justify-center">
                        <div className="text-xs text-slate-400 font-medium">Total Fare ({searchParams.passengers} P)</div>
                        <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                          ₹{classDetails.price * searchParams.passengers}
                        </div>
                        {searchParams.passengers > 1 && (
                          <div className="text-[10px] text-slate-400 tabular-nums">
                            (₹{classDetails.price} × {searchParams.passengers})
                          </div>
                        )}

                        <div className="flex flex-col gap-1.5 mt-2">
                          <button
                            type="button"
                            onClick={() => onSelectTrain(train, currentClassKey)}
                            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all cursor-pointer whitespace-nowrap"
                          >
                            Book Now (₹)
                          </button>
                          <button
                            type="button"
                            onClick={() => onSelectTrain(train, currentClassKey)}
                            className="w-full py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-semibold text-[11px] rounded-xl border border-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Armchair className="w-3 h-3 text-emerald-600" />
                            <span>Coach Layout & Seats</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
            <Info className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No trains matching selected criteria</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting the departure time filter or selecting "All Indian Trains".
            </p>
            <button
              type="button"
              onClick={() => {
                setTimeFilter('all');
                setTrainTypeFilter('all');
              }}
              className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
