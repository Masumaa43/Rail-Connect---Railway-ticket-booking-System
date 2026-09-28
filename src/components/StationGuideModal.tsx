import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Search, 
  Compass, 
  ExternalLink, 
  Navigation, 
  Sparkles, 
  Building2, 
  Coffee, 
  ShieldCheck, 
  CheckCircle2,
  Train,
  ArrowRight,
  Route,
  Car
} from 'lucide-react';
import { STATIONS, Station } from '../data/railData';

interface StationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStation?: string;
}

export const StationGuideModal: React.FC<StationGuideModalProps> = ({
  isOpen,
  onClose,
  defaultStation = 'New Delhi Railway Station',
}) => {
  const [activeTab, setActiveTab] = useState<'station' | 'navigation'>('station');
  const [selectedStation, setSelectedStation] = useState<Station>(
    STATIONS.find((s) => s.name === defaultStation) || STATIONS[0]
  );
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [guideData, setGuideData] = useState<{
    text: string;
    sources: Array<{ title: string; uri: string }>;
  } | null>(null);

  // Navigation mode state
  const [navFrom, setNavFrom] = useState('New Delhi Railway Station');
  const [navTo, setNavTo] = useState('Varanasi Junction');
  const [navLoading, setNavLoading] = useState(false);
  const [navData, setNavData] = useState<{
    navigationGuide: string;
    sources: Array<{ title: string; uri: string }>;
    mapsUrl: string;
  } | null>(null);

  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Request browser location if available for geo-retrieval
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => {},
        { timeout: 5000 }
      );
    }
  }, []);

  // Update selected station if default changes
  useEffect(() => {
    if (defaultStation) {
      const match = STATIONS.find((s) => s.name === defaultStation || s.city === defaultStation || s.code === defaultStation);
      if (match) setSelectedStation(match);
    }
  }, [defaultStation]);

  // Fetch station guide with Maps Grounding
  const fetchStationInfo = async (customQuery?: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/station-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stationName: selectedStation.name,
          cityName: selectedStation.city,
          query: customQuery || query || `Station facilities, IRCTC lounge, coach indicators, and transport near ${selectedStation.name}, ${selectedStation.city}`,
          userLocation,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve Google Maps information.');
      }

      const data = await response.json();
      setGuideData(data);
    } catch (err: any) {
      console.error('Error querying Maps grounding:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Route Navigation with Maps Grounding
  const fetchRouteNavigation = async () => {
    setNavLoading(true);
    try {
      const response = await fetch('/api/route-navigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromStation: navFrom,
          toStation: navTo,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve navigation information.');
      }

      const data = await response.json();
      setNavData(data);
    } catch (err) {
      console.error('Navigation error:', err);
    } finally {
      setNavLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === 'station') {
      fetchStationInfo();
    }
  }, [isOpen, selectedStation, activeTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">Google Maps India Rail Navigator & City Guide</span>
                <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  Google Maps Grounded
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Verified platform information, IRCTC executive lounges, entry gates & turn-by-turn navigation
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center border-b border-slate-200 bg-slate-100/70 px-4 pt-2 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('station')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'station'
                ? 'bg-white text-slate-900 border-t-2 border-emerald-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Station Explorer & Facilities</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('navigation');
              if (!navData) fetchRouteNavigation();
            }}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'navigation'
                ? 'bg-white text-slate-900 border-t-2 border-emerald-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Route className="w-3.5 h-3.5 text-emerald-600" />
            <span>Corridor Route & Gate Navigation</span>
          </button>
        </div>

        {/* STATION EXPLORER TAB */}
        {activeTab === 'station' && (
          <>
            {/* Station Selector Bar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200/80 shrink-0">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs font-bold text-slate-500 shrink-0 mr-1 flex items-center gap-1">
                  <Train className="w-3.5 h-3.5 text-slate-400" />
                  Station:
                </span>
                {STATIONS.slice(0, 15).map((station) => (
                  <button
                    key={station.id}
                    type="button"
                    onClick={() => {
                      setSelectedStation(station);
                      setGuideData(null);
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      selectedStation.id === station.id
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{station.name.split(' Railway')[0].split(' Junction')[0]}</span>
                    <span className={`text-[10px] font-mono px-1 rounded ${
                      selectedStation.id === station.id ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {station.code}
                    </span>
                  </button>
                ))}
              </div>

              {/* Quick Query Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchStationInfo(query);
                }}
                className="flex gap-2 mt-3"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Ask about IRCTC lounges, coach position, or metro transfers at ${selectedStation.name}...`}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Checking Maps...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Explore</span>
                    </>
                  )}
                </button>
              </form>

              {/* Quick Suggestion Chips Grounded with Google Maps */}
              <div className="flex items-center gap-1.5 overflow-x-auto mt-2.5 pb-0.5 scrollbar-none text-[11px]">
                <span className="text-slate-400 font-medium shrink-0">Quick Maps Query:</span>
                {[
                  'IRCTC Lounges & Retiring Rooms',
                  'Metro & Airport Express Transfers',
                  'Platform Entry Gates & Parking',
                  'Top Sights & Famous Places Nearby',
                  'Station Food & Local Dining',
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      setQuery(chip);
                      fetchStationInfo(chip);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 text-slate-700 font-medium whitespace-nowrap shadow-2xs transition-all cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {loading ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <div className="text-sm font-bold text-slate-800">
                    Grounding Station Data with Google Maps India...
                  </div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Retrieving verified location details, surrounding metro/transit links, and platform amenities for {selectedStation.name}.
                  </p>
                </div>
              ) : guideData ? (
                <div className="space-y-6">
                  {/* Station Hero Card */}
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{selectedStation.city}, {selectedStation.state} · {selectedStation.zone}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                        {selectedStation.name}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1">
                        Indian Railways Station Code: <span className="font-mono font-bold text-emerald-400 bg-slate-800 px-1.5 py-0.5 rounded">{selectedStation.code}</span>
                      </p>
                    </div>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedStation.name} ${selectedStation.city} India`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shrink-0 cursor-pointer self-start sm:self-auto"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Open in Google Maps India</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Maps Grounded Sources Badges */}
                  {guideData.sources && guideData.sources.length > 0 && (
                    <div className="p-4 bg-emerald-50/70 border border-emerald-200/90 rounded-2xl">
                      <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Verified Google Maps Grounding Links ({guideData.sources.length}):</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {guideData.sources.map((source, idx) => (
                          <a
                            key={idx}
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-300 hover:border-emerald-500 rounded-lg text-xs font-semibold text-slate-800 hover:text-emerald-700 shadow-2xs hover:shadow transition-all group"
                          >
                            <MapPin className="w-3 h-3 text-emerald-600 group-hover:scale-110 transition-transform" />
                            <span className="truncate max-w-[200px]">{source.title}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-600" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Grounded Information Text */}
                  <div className="prose prose-sm prose-slate max-w-none bg-slate-50 p-5 rounded-2xl border border-slate-200/90 text-xs sm:text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                    {guideData.text}
                  </div>

                  {/* Station Quick Tips */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                        <Building2 className="w-4 h-4 text-emerald-600" />
                        <span>Coach & Platform Indicators</span>
                      </div>
                      <p className="text-slate-500 text-[11px]">
                        Overhead displays indicate coaches (e.g. C1-C14, B1-B6, H1) and departure platforms.
                      </p>
                    </div>
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                        <Coffee className="w-4 h-4 text-emerald-600" />
                        <span>IRCTC Executive Lounges</span>
                      </div>
                      <p className="text-slate-500 text-[11px]">
                        Enjoy air-conditioned lounges, complimentary Wi-Fi, luggage storage, and buffet catering.
                      </p>
                    </div>
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>ID & Digital Boarding Pass</span>
                      </div>
                      <p className="text-slate-500 text-[11px]">
                        Carry valid Government ID (Aadhaar, Voter ID, Driving License) along with your digital ticket.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 text-xs">
                  Select an Indian railway station to view Google Maps-grounded details.
                </div>
              )}
            </div>
          </>
        )}

        {/* NAVIGATION TAB */}
        {activeTab === 'navigation' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Route Input Bar */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Origin Station / City
                  </label>
                  <input
                    type="text"
                    value={navFrom}
                    onChange={(e) => setNavFrom(e.target.value)}
                    placeholder="e.g. New Delhi Railway Station"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-semibold text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Destination Station / City
                  </label>
                  <input
                    type="text"
                    value={navTo}
                    onChange={(e) => setNavTo(e.target.value)}
                    placeholder="e.g. Varanasi Junction"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-semibold text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Includes platform entry gates, metro links & highway routes</span>
                </span>

                <button
                  type="button"
                  onClick={fetchRouteNavigation}
                  disabled={navLoading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  {navLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Calculating Routes...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Get Google Maps Directions</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {navLoading ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <div className="text-sm font-bold text-slate-800">
                  Grounding Navigation with Google Maps India...
                </div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Analyzing train corridors, station entrances, and connecting transit lines between {navFrom} and {navTo}.
                </p>
              </div>
            ) : navData ? (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider block">
                      Google Maps Navigation Trajectory
                    </span>
                    <h4 className="text-base font-bold text-white mt-0.5">
                      {navFrom} ⇄ {navTo}
                    </h4>
                  </div>
                  <a
                    href={navData.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow cursor-pointer shrink-0"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Open Live Maps Turn-by-Turn</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Grounded Navigation Text */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {navData.navigationGuide}
                </div>

                {/* Verified Grounding links */}
                {navData.sources && navData.sources.length > 0 && (
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/90 rounded-2xl">
                    <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider mb-2 block">
                      Direct Google Maps Location Pins:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {navData.sources.map((s, idx) => (
                        <a
                          key={idx}
                          href={s.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-300 hover:border-emerald-500 rounded-lg text-xs font-semibold text-slate-800 hover:text-emerald-700 shadow-2xs transition-all"
                        >
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span>{s.title}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Maps Grounding powered by gemini-3.5-flash & Google Maps</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Navigator
          </button>
        </div>
      </div>
    </div>
  );
};
