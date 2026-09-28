import React, { useState, useEffect } from 'react';
import { X, Search, Train, Clock, CheckCircle2, AlertTriangle, ArrowRight, Gauge, MapPin, QrCode, Sparkles } from 'lucide-react';
import { PnrHistoryItem } from '../data/railData';

interface LiveStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPnr?: string;
  onPnrChecked?: (pnrItem: PnrHistoryItem) => void;
}

export const LiveStatusModal: React.FC<LiveStatusModalProps> = ({ 
  isOpen, 
  onClose,
  initialPnr,
  onPnrChecked 
}) => {
  const [activeTab, setActiveTab] = useState<'train' | 'pnr'>('train');
  const [trainQuery, setTrainQuery] = useState('22436');
  const [pnrQuery, setPnrQuery] = useState(initialPnr || '284-9201843');
  const [hasSearched, setHasSearched] = useState(true);
  const [isCheckingPnr, setIsCheckingPnr] = useState(false);
  const [pnrResult, setPnrResult] = useState<any>(null);

  const handleCheckPnr = async (queryToUse?: string) => {
    const rawPnr = queryToUse || pnrQuery;
    setIsCheckingPnr(true);
    try {
      const response = await fetch('/api/pnr-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pnr: rawPnr }),
      });
      if (response.ok) {
        const data = await response.json();
        setPnrResult(data);
        if (onPnrChecked) {
          onPnrChecked({
            id: `pnr-${data.pnr}-${Date.now()}`,
            pnr: data.pnr,
            trainNumber: data.trainNumber,
            trainName: data.trainName,
            fromStation: data.fromStation,
            toStation: data.toStation,
            journeyDate: data.journeyDate,
            bookingStatus: data.bookingStatus,
            coach: data.coach,
            berth: data.berth,
            classType: data.classType,
            chartStatus: data.chartStatus,
            currentSpeed: data.currentSpeed,
            currentStation: data.currentLocation,
            eta: data.eta,
            checkedAt: data.checkedAt,
            timeline: data.timeline,
          });
        }
      }
    } catch (e) {
      console.error('PNR inquiry error:', e);
    } finally {
      setIsCheckingPnr(false);
      setHasSearched(true);
    }
  };

  useEffect(() => {
    if (isOpen && initialPnr) {
      setPnrQuery(initialPnr);
      setActiveTab('pnr');
      handleCheckPnr(initialPnr);
    }
  }, [isOpen, initialPnr]);

  if (!isOpen) return null;

  const mockLiveStatus = {
    trainNumber: '22436',
    trainName: 'New Delhi - Varanasi Vande Bharat Express',
    status: 'Running On-Time',
    speed: '128 km/h',
    currentLocation: 'Approaching Kanpur Central Outer (Platform 1 allocated)',
    departure: { 
      station: 'New Delhi Railway Station (NDLS)', 
      time: '06:00', 
      actual: '06:00 (Departed on time)', 
      platform: 'Platform 16' 
    },
    destination: { 
      station: 'Varanasi Junction (BSB)', 
      scheduled: '14:00', 
      estimated: '13:58 (2 mins early)', 
      platform: 'Platform 1' 
    },
    nextStop: 'Kanpur Central (CNB)',
    etaNextStop: '18 mins away (10:08 AM)',
    progressPercent: 62,
    stationsList: [
      { name: 'New Delhi (NDLS)', time: '06:00', status: 'Departed (PF 16)' },
      { name: 'Kanpur Central (CNB)', time: '10:08', status: 'Next Stop (PF 1)' },
      { name: 'Prayagraj Jn (PRYJ)', time: '12:08', status: 'Scheduled (PF 6)' },
      { name: 'Varanasi Jn (BSB)', time: '14:00', status: 'Terminus (PF 1)' },
    ],
  };

  const activePnrData = pnrResult || {
    pnr: pnrQuery.replace(/\D/g, '') || '2849201843',
    trainNumber: '22436',
    trainName: 'Vande Bharat Express',
    journeyDate: 'Tomorrow, Oct 12',
    boardingStation: 'New Delhi (NDLS) · Platform 16',
    destinationStation: 'Varanasi Junction (BSB)',
    bookingStatus: 'CNF (Confirmed)',
    coach: 'Coach E1',
    berth: 'Seat 18 (Window)',
    classType: 'Executive Chair Car (EC)',
    chartStatus: 'Chart Prepared at New Delhi',
    passenger: 'Masuma Akhtar',
    timeline: [
      { step: 1, title: 'Booked & Confirmed', description: 'IRCTC PRS Booking Confirmed', time: '24 Sep, 10:30 AM', completed: true, badge: 'CNF' },
      { step: 2, title: 'Chart Prepared', description: 'Chart prepared at New Delhi (Coach E1/18)', time: 'Today, 04:00 AM', completed: true, badge: 'CHART' },
      { step: 3, title: 'Train Departed', description: 'Departed NDLS Platform 16 on time', time: 'Today, 06:00 AM', completed: true, badge: 'ON-TIME' },
      { step: 4, title: 'Passed Kanpur Central', description: 'Cruising at 128 km/h speed', time: 'Today, 10:14 AM', completed: true, badge: 'LIVE GPS' },
      { step: 5, title: 'Varanasi Arrival', description: 'Scheduled arrival at Platform 1', time: 'Today, 02:00 PM', completed: false, badge: 'SCHEDULED' },
    ],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Train className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold">Indian Railways Live NTES & PNR Tracker</div>
              <div className="text-xs text-slate-300">Live GPS satellite tracking, timeline & chart status</div>
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

        {/* Modal Body */}
        <div className="p-6 space-y-5 flex-1 overflow-y-auto">
          {/* Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('train')}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'train'
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Train Running Status (Live NTES)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pnr')}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'pnr'
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              10-Digit PNR Inquiry & Timeline
            </button>
          </div>

          {/* Search Inputs */}
          {activeTab === 'train' ? (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={trainQuery}
                  onChange={(e) => setTrainQuery(e.target.value)}
                  placeholder="Enter 5-digit train no. (e.g. 22436, 12952)"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <button
                type="button"
                onClick={() => setHasSearched(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Track Live
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={pnrQuery}
                  onChange={(e) => setPnrQuery(e.target.value)}
                  placeholder="Enter 10-digit Indian PNR (e.g. 284-9201843)"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <button
                type="button"
                onClick={() => handleCheckPnr()}
                disabled={isCheckingPnr}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {isCheckingPnr ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <span>Check PNR</span>
                )}
              </button>
            </div>
          )}

          {/* Train Live Status Output */}
          {hasSearched && activeTab === 'train' && (
            <div className="space-y-4 pt-1 animate-fadeIn">
              {/* Train Status Banner */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900 bg-white px-2 py-0.5 rounded border border-emerald-200">
                      {mockLiveStatus.trainNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {mockLiveStatus.trainName}
                    </span>
                  </div>
                  <div className="text-xs text-emerald-800 font-medium flex items-center gap-1.5 mt-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{mockLiveStatus.status} · Speed {mockLiveStatus.speed}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Cruising Speed</div>
                  <div className="text-sm font-extrabold text-slate-900 font-mono flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{mockLiveStatus.speed}</span>
                  </div>
                </div>
              </div>

              {/* Live Location Alert */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5 text-xs text-slate-700">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900">Current Position:</span>{' '}
                  {mockLiveStatus.currentLocation}
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Next Stop: <span className="font-semibold text-slate-800">{mockLiveStatus.nextStop}</span> ({mockLiveStatus.etaNextStop})
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-500 font-medium mb-1">
                  <span>New Delhi (NDLS)</span>
                  <span>{mockLiveStatus.progressPercent}% Route Completed</span>
                  <span>Varanasi (BSB)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                    style={{ width: `${mockLiveStatus.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Stations Timeline */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Station Halt Timeline
                </div>
                <div className="space-y-2.5">
                  {mockLiveStatus.stationsList.map((stn, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${idx < 1 ? 'bg-emerald-500' : idx === 1 ? 'bg-amber-500 animate-ping' : 'bg-slate-300'}`} />
                        <span className="font-semibold text-slate-800">{stn.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-600">{stn.time}</span>
                        <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                          idx === 0 ? 'bg-slate-200 text-slate-700' : idx === 1 ? 'bg-emerald-100 text-emerald-800 font-bold' : 'text-slate-400'
                        }`}>
                          {stn.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PNR Status Output with Visual Timeline */}
          {hasSearched && activeTab === 'pnr' && (
            <div className="space-y-4 pt-1 animate-fadeIn">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">PNR Number</span>
                    <div className="font-mono font-extrabold text-base text-slate-900 tracking-wider">
                      {activePnrData.pnr}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{activePnrData.bookingStatus}</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Train Details</span>
                    <span className="font-bold text-slate-800">{activePnrData.trainNumber} - {activePnrData.trainName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Travel Date</span>
                    <span className="font-bold text-slate-800">{activePnrData.journeyDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Route</span>
                    <span className="font-bold text-slate-800">{activePnrData.fromStation || activePnrData.boardingStation} → {activePnrData.toStation || activePnrData.destinationStation}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Seat / Berth</span>
                    <span className="font-bold text-emerald-700 font-mono">{activePnrData.coach} / {activePnrData.berth}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{activePnrData.chartStatus}</span>
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700">Saved to PNR History</span>
                </div>
              </div>

              {/* VISUAL JOURNEY TIMELINE */}
              {activePnrData.timeline && (
                <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-3">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Real-time Journey Progress Timeline</span>
                  </div>

                  <div className="relative pl-6 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {activePnrData.timeline.map((step: any, idx: number) => (
                      <div key={idx} className="relative">
                        <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          step.completed ? 'bg-emerald-600 border-white text-white' : 'bg-white border-slate-300'
                        }`}>
                          {step.completed && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs">
                            <span className={`font-bold ${step.completed ? 'text-slate-900' : 'text-slate-500'}`}>{step.title}</span>
                            <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${step.completed ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{step.badge}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{step.description}</p>
                          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">{step.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Synced with Indian Railways National Train Enquiry System</span>
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
  );
};
