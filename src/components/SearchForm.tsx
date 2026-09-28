import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowRightLeft, 
  Calendar as CalendarIcon, 
  MapPin, 
  Search, 
  Users, 
  ChevronDown, 
  Check, 
  Sparkles,
  TrainTrack,
  ShieldCheck
} from 'lucide-react';
import { STATIONS, Station } from '../data/railData';

interface SearchFormProps {
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
  initialDate?: string;
  isSearching?: boolean;
}

export const INDIAN_CLASSES = [
  { code: 'ALL', name: 'All Classes' },
  { code: 'CC', name: 'AC Chair Car (CC)' },
  { code: 'EC', name: 'Exec. Chair Car (EC)' },
  { code: '3A', name: 'AC 3 Tier (3A)' },
  { code: '2A', name: 'AC 2 Tier (2A)' },
  { code: '1A', name: 'AC 1st Class (1A)' },
  { code: 'SL', name: 'Sleeper (SL)' },
];

export const INDIAN_QUOTAS = [
  { code: 'GN', name: 'General Quota (GN)' },
  { code: 'TQ', name: 'Tatkal Quota (TQ)' },
  { code: 'LD', name: 'Ladies Quota (LD)' },
  { code: 'SS', name: 'Sr. Citizen Quota (SS)' },
];

export const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  initialFrom = 'New Delhi Railway Station',
  initialTo = 'Varanasi Junction',
  initialDate,
  isSearching = false,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
  const [fromStation, setFromStation] = useState(initialFrom);
  const [toStation, setToStation] = useState(initialTo);
  const [travelDate, setTravelDate] = useState(initialDate || tomorrowStr);
  const [returnDate, setReturnDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  
  const [passengers, setPassengers] = useState(1);
  const [quota, setQuota] = useState('General Quota (GN)');
  const [travelClass, setTravelClass] = useState('All Classes');
  const [passengerDropdownOpen, setPassengerDropdownOpen] = useState(false);

  // Autocomplete dropdown states
  const [fromQuery, setFromQuery] = useState(initialFrom);
  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  
  const [toQuery, setToQuery] = useState(initialTo);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const passengerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialFrom) {
      setFromStation(initialFrom);
      setFromQuery(initialFrom);
    }
    if (initialTo) {
      setToStation(initialTo);
      setToQuery(initialTo);
    }
  }, [initialFrom, initialTo]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(e.target as Node)) {
        setFromDropdownOpen(false);
      }
      if (toRef.current && !toRef.current.contains(e.target as Node)) {
        setToDropdownOpen(false);
      }
      if (passengerRef.current && !passengerRef.current.contains(e.target as Node)) {
        setPassengerDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwapStations = () => {
    const tempStation = fromStation;
    const tempQuery = fromQuery;
    setFromStation(toStation);
    setFromQuery(toQuery);
    setToStation(tempStation);
    setToQuery(tempQuery);
  };

  const filteredFromStations = STATIONS.filter(s => 
    s.name.toLowerCase().includes(fromQuery.toLowerCase()) ||
    s.city.toLowerCase().includes(fromQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(fromQuery.toLowerCase()) ||
    s.state.toLowerCase().includes(fromQuery.toLowerCase())
  );

  const filteredToStations = STATIONS.filter(s => 
    s.name.toLowerCase().includes(toQuery.toLowerCase()) ||
    s.city.toLowerCase().includes(toQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(toQuery.toLowerCase()) ||
    s.state.toLowerCase().includes(toQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fromStation || !fromStation.trim()) {
      setErrorMessage('Please select an origin Indian Railway station.');
      return;
    }
    if (!toStation || !toStation.trim()) {
      setErrorMessage('Please select a destination Indian Railway station.');
      return;
    }
    if (fromStation.toLowerCase() === toStation.toLowerCase()) {
      setErrorMessage('Source and Destination railway stations cannot be the same.');
      return;
    }
    if (!travelDate) {
      setErrorMessage('Please select a journey date.');
      return;
    }
    if (tripType === 'round-trip' && returnDate && returnDate < travelDate) {
      setErrorMessage('Return journey date must be on or after onward travel date.');
      return;
    }

    onSearch({
      fromStation,
      toStation,
      travelDate,
      returnDate: tripType === 'round-trip' ? returnDate : undefined,
      tripType,
      passengers,
      quota,
      travelClass,
    });
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200/90 p-5 sm:p-7 relative z-30">
      {/* Top Segmented Controls: Trip Type & Quota / Class */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl text-xs sm:text-sm font-medium">
          <button
            type="button"
            onClick={() => setTripType('one-way')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              tripType === 'one-way'
                ? 'bg-white text-slate-900 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            One-Way Journey
          </button>
          <button
            type="button"
            onClick={() => setTripType('round-trip')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              tripType === 'round-trip'
                ? 'bg-white text-slate-900 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Round-Trip Journey
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-slate-800 font-semibold">Indian Railways Direct</span>
          <span>·</span>
          <span>INR (₹) Standard Fares</span>
          <span>·</span>
          <span className="hidden sm:inline">Tatkal / General Quota</span>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs sm:text-sm font-medium flex items-center gap-2">
          <span className="font-bold">Error:</span> {errorMessage}
        </div>
      )}

      {/* Main Search Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-2.5 items-center">
          {/* FROM STATION (lg:col-span-4) */}
          <div ref={fromRef} className="relative lg:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              From Station (Source)
            </label>
            <div
              onClick={() => setFromDropdownOpen(true)}
              className="flex items-center gap-3 px-3.5 py-3 border border-slate-300 rounded-xl hover:border-emerald-600 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 bg-slate-50/50 hover:bg-white transition-all cursor-text"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-xs">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={fromQuery}
                  onChange={(e) => {
                    setFromQuery(e.target.value);
                    setFromStation(e.target.value);
                    setFromDropdownOpen(true);
                  }}
                  onFocus={() => setFromDropdownOpen(true)}
                  placeholder="e.g. New Delhi (NDLS)"
                  className="w-full text-slate-900 font-semibold text-sm sm:text-base placeholder-slate-400 bg-transparent border-none outline-none p-0 focus:ring-0 truncate"
                />
                <span className="block text-[11px] text-slate-400 truncate">
                  {STATIONS.find(s => s.name === fromStation)?.city ? `${STATIONS.find(s => s.name === fromStation)?.city} (${STATIONS.find(s => s.name === fromStation)?.zone})` : 'Select origin station'}
                </span>
              </div>
            </div>

            {/* From Stations Autocomplete Dropdown */}
            {fromDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto divide-y divide-slate-100">
                <div className="p-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50">
                  Major Indian Railway Junctions & Terminals
                </div>
                {filteredFromStations.length > 0 ? (
                  filteredFromStations.map((station) => (
                    <button
                      key={station.id}
                      type="button"
                      onClick={() => {
                        setFromStation(station.name);
                        setFromQuery(station.name);
                        setFromDropdownOpen(false);
                      }}
                      className="w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-emerald-50/70 transition-colors cursor-pointer"
                    >
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{station.name}</div>
                        <div className="text-xs text-slate-500">{station.city}, {station.state} · <span className="text-emerald-700">{station.zone}</span></div>
                      </div>
                      <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded border border-slate-200">
                        {station.code}
                      </span>
                    </button>
                  ))
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setFromStation(fromQuery);
                      setFromDropdownOpen(false);
                    }}
                    className="w-full p-3.5 text-left text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>Use &quot;{fromQuery}&quot; as Indian Railway Station</span>
                    <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded">Select</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* SWAP STATIONS BUTTON (lg:col-span-1 flex justify-center) */}
          <div className="lg:col-span-1 flex justify-center -my-2 lg:my-0 lg:pt-5">
            <button
              type="button"
              onClick={handleSwapStations}
              title="Swap Stations"
              aria-label="Swap source and destination stations"
              className="w-10 h-10 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-600 hover:text-emerald-600 flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* TO STATION (lg:col-span-4) */}
          <div ref={toRef} className="relative lg:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              To Station (Destination)
            </label>
            <div
              onClick={() => setToDropdownOpen(true)}
              className="flex items-center gap-3 px-3.5 py-3 border border-slate-300 rounded-xl hover:border-emerald-600 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 bg-slate-50/50 hover:bg-white transition-all cursor-text"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={toQuery}
                  onChange={(e) => {
                    setToQuery(e.target.value);
                    setToStation(e.target.value);
                    setToDropdownOpen(true);
                  }}
                  onFocus={() => setToDropdownOpen(true)}
                  placeholder="e.g. Varanasi Junction (BSB)"
                  className="w-full text-slate-900 font-semibold text-sm sm:text-base placeholder-slate-400 bg-transparent border-none outline-none p-0 focus:ring-0 truncate"
                />
                <span className="block text-[11px] text-slate-400 truncate">
                  {STATIONS.find(s => s.name === toStation)?.city ? `${STATIONS.find(s => s.name === toStation)?.city} (${STATIONS.find(s => s.name === toStation)?.zone})` : 'Select arrival destination'}
                </span>
              </div>
            </div>

            {/* To Stations Autocomplete Dropdown */}
            {toDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto divide-y divide-slate-100">
                <div className="p-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50">
                  Major Indian Railway Junctions & Terminals
                </div>
                {filteredToStations.length > 0 ? (
                  filteredToStations.map((station) => (
                    <button
                      key={station.id}
                      type="button"
                      onClick={() => {
                        setToStation(station.name);
                        setToQuery(station.name);
                        setToDropdownOpen(false);
                      }}
                      className="w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-blue-50/70 transition-colors cursor-pointer"
                    >
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{station.name}</div>
                        <div className="text-xs text-slate-500">{station.city}, {station.state} · <span className="text-blue-700">{station.zone}</span></div>
                      </div>
                      <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded border border-slate-200">
                        {station.code}
                      </span>
                    </button>
                  ))
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setToStation(toQuery);
                      setToDropdownOpen(false);
                    }}
                    className="w-full p-3.5 text-left text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>Use &quot;{toQuery}&quot; as Destination Station</span>
                    <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded">Select</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* TRAVEL DATE (lg:col-span-3) */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Travel Date
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setTravelDate(todayStr)}
                  className={`text-[11px] font-medium transition-colors cursor-pointer ${
                    travelDate === todayStr ? 'text-emerald-700 font-bold underline' : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Today
                </button>
                <span className="text-slate-300">·</span>
                <button
                  type="button"
                  onClick={() => setTravelDate(tomorrowStr)}
                  className={`text-[11px] font-medium transition-colors cursor-pointer ${
                    travelDate === tomorrowStr ? 'text-emerald-700 font-bold underline' : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Tomorrow
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3.5 py-3 border border-slate-300 rounded-xl hover:border-emerald-600 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 bg-slate-50/50 hover:bg-white transition-all">
              <CalendarIcon className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="date"
                min={todayStr}
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full text-slate-900 font-semibold text-sm sm:text-base bg-transparent border-none outline-none p-0 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Second Row: Quota Selector + Class Selector + Search Trains Button */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 pt-2 items-end">
          {/* Quota Selector (lg:col-span-3) */}
          <div className="lg:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Railway Quota
            </label>
            <div className="relative">
              <select
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
                className="w-full px-3.5 py-3 border border-slate-300 rounded-xl bg-slate-50/50 hover:bg-white text-slate-900 font-semibold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none"
              >
                {INDIAN_QUOTAS.map(q => (
                  <option key={q.code} value={q.name}>
                    {q.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Travel Class & Passengers (lg:col-span-5) */}
          <div ref={passengerRef} className="relative lg:col-span-5">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Travel Class & Passengers
            </label>
            <button
              type="button"
              onClick={() => setPassengerDropdownOpen(!passengerDropdownOpen)}
              className="w-full flex items-center justify-between gap-3 px-3.5 py-3 border border-slate-300 rounded-xl hover:border-emerald-600 bg-slate-50/50 hover:bg-white transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Users className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                  {passengers} {passengers === 1 ? 'Passenger' : 'Passengers'} · {travelClass}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            </button>

            {/* Popover */}
            {passengerDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl p-4 z-50 space-y-4">
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Number of Travellers
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-800">Adults (5+ yrs)</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPassengers(Math.max(1, passengers - 1))}
                        disabled={passengers <= 1}
                        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 disabled:opacity-40 hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="font-semibold text-sm tabular-nums w-4 text-center">
                        {passengers}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPassengers(Math.min(6, passengers + 1))}
                        disabled={passengers >= 6}
                        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 disabled:opacity-40 hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Indian Railways Coach Class
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {INDIAN_CLASSES.map((cls) => (
                      <button
                        key={cls.code}
                        type="button"
                        onClick={() => setTravelClass(cls.name)}
                        className={`px-2.5 py-1.5 text-xs font-medium rounded-lg text-left border transition-all cursor-pointer truncate ${
                          travelClass === cls.name
                            ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {cls.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPassengerDropdownOpen(false)}
                  className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>

          {/* SEARCH TRAINS BUTTON (lg:col-span-4) */}
          <div className="lg:col-span-4">
            <button
              type="submit"
              disabled={isSearching}
              className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-500/25 disabled:opacity-75"
            >
              {isSearching ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Checking Indian Railway Schedules...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Search Trains (₹)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
