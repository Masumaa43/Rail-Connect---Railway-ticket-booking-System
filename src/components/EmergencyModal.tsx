import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  PhoneCall, 
  ShieldAlert, 
  HeartPulse, 
  UserCheck, 
  Wrench, 
  Send, 
  CheckCircle2, 
  Clock, 
  Radio, 
  AlertCircle,
  Train
} from 'lucide-react';
import { EMERGENCY_CONTACTS, EmergencyContact, EmergencySosRequest, BookingTicket } from '../data/railData';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingTicket[];
  onSubmitSos: (sos: EmergencySosRequest) => Promise<void>;
  activeSos?: EmergencySosRequest | null;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onSubmitSos,
  activeSos,
}) => {
  const [emergencyType, setEmergencyType] = useState<EmergencySosRequest['emergencyType']>('Medical Emergency');
  const [trainNumber, setTrainNumber] = useState(bookings[0]?.trainNumber || '22436');
  const [coach, setCoach] = useState(bookings[0]?.coach || 'E1');
  const [seat, setSeat] = useState(bookings[0]?.seatNumber || '18');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liveSos, setLiveSos] = useState<EmergencySosRequest | null>(activeSos || null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    const assignedOfficial = emergencyType === 'Medical Emergency'
      ? 'Dr. S. K. Verma (Railway Divisional Medical Officer)'
      : emergencyType === 'RPF Security Threat'
      ? 'Inspector Rajesh Kumar (RPF Taskforce Unit 4)'
      : emergencyType === 'Women Passenger Safety'
      ? 'Sub-Inspector Anjali Sharma (Meri Saheli Squad)'
      : 'Chief Onboard Engineer (Coach Maintenance)';

    const newSos: EmergencySosRequest = {
      id: `sos-${Date.now()}`,
      trainNumber,
      coach,
      seat,
      emergencyType,
      description,
      phone,
      status: 'Dispatched to RPF Control',
      officialsAssigned: assignedOfficial,
      createdAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ', Today',
    };

    try {
      await onSubmitSos(newSos);
      setLiveSos(newSos);
      setIsSubmitting(false);
      setShowSuccessAlert(true);
    } catch (err) {
      console.error('Failed to submit emergency SOS:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-rose-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Urgent Red Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-rose-700 via-rose-600 to-red-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-sm animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold">Indian Railways Official Emergency SOS</span>
                <span className="text-[10px] font-bold bg-white text-rose-700 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Radio className="w-3 h-3 text-rose-600 animate-spin" />
                  Live 139 / RPF
                </span>
              </div>
              <p className="text-xs text-rose-100">
                Direct real-time emergency dispatch to Railway Protection Force & Control Room
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Active Live SOS Status Banner if exists */}
          {liveSos && (
            <div className="p-4 bg-rose-50 border-2 border-rose-500 rounded-2xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                  <span className="text-xs font-black text-rose-900 uppercase tracking-wider">
                    Active Emergency Case Dispatched
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-rose-800 bg-rose-200/80 px-2 py-0.5 rounded">
                  Ref: {liveSos.id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-rose-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Type & Train</span>
                  <span className="font-bold text-slate-900">{liveSos.emergencyType} · Train {liveSos.trainNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Coach & Seat</span>
                  <span className="font-bold text-rose-700 font-mono">Coach {liveSos.coach}, Seat {liveSos.seat}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Assigned Authority</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {liveSos.officialsAssigned}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-rose-800 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Status: Attending at upcoming station halt / onboard inspection</span>
                </span>
                <span className="font-semibold">Help arriving in ~8 mins</span>
              </div>
            </div>
          )}

          {/* Quick Direct-Dial Hotlines Grid */}
          <div>
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
              <span>Official Emergency Helplines (One-Tap Dial)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {EMERGENCY_CONTACTS.map((contact, idx) => (
                <a
                  key={idx}
                  href={`tel:${contact.number.split(' ')[0]}`}
                  className="p-3 bg-slate-50 hover:bg-rose-50/60 border border-slate-200 hover:border-rose-300 rounded-2xl transition-all group flex items-start justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wide block">
                      {contact.category}
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 group-hover:text-rose-900 mt-0.5">
                      {contact.service}
                    </h5>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {contact.description}
                    </p>
                  </div>
                  <div className="px-2.5 py-1 bg-white border border-slate-300 group-hover:border-rose-400 rounded-lg text-xs font-black font-mono text-slate-800 group-hover:text-rose-700 shrink-0 ml-2 shadow-2xs">
                    {contact.number}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Real-Time SOS Dispatch Form */}
          <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-bold text-slate-900">Raise Real-Time Grievance / Emergency Alert</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nature of Emergency
                </label>
                <select
                  value={emergencyType}
                  onChange={(e) => setEmergencyType(e.target.value as any)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                >
                  <option value="Medical Emergency">Medical Emergency / Doctor Required</option>
                  <option value="RPF Security Threat">RPF Security Threat / Anti-Theft</option>
                  <option value="Women Passenger Safety">Women Safety / Harassment Assistance</option>
                  <option value="Coach Maintenance / Water">Coach Maintenance / AC / Water Shortage</option>
                  <option value="Fire / Safety Hazard">Fire / Smoke / Electrical Hazard</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Contact Mobile Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white font-mono text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Train Number
                </label>
                <input
                  type="text"
                  value={trainNumber}
                  onChange={(e) => setTrainNumber(e.target.value)}
                  placeholder="e.g. 22436, 12952"
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white font-mono text-xs font-bold focus:ring-2 focus:ring-rose-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Coach
                  </label>
                  <input
                    type="text"
                    value={coach}
                    onChange={(e) => setCoach(e.target.value)}
                    placeholder="e.g. E1, B4"
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold focus:ring-2 focus:ring-rose-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Seat / Berth
                  </label>
                  <input
                    type="text"
                    value={seat}
                    onChange={(e) => setSeat(e.target.value)}
                    placeholder="e.g. 18, 27"
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold focus:ring-2 focus:ring-rose-500 outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Describe the Situation / Required Assistance
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the urgent requirement (e.g. Elderly passenger feeling breathless, need doctor at next halt with oxygen / Suspicious person in coach / Water tank empty in washroom)..."
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-rose-500 outline-none resize-none"
                required
              />
            </div>

            <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Directly alerts Train Superintendent (TS), RPF Post, and RailMadad Central Server</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting to RPF...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Real-Time SOS Alert</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Synced with Ministry of Railways RailMadad Control Infrastructure</span>
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
