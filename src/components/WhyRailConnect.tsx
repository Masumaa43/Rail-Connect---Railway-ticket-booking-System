import React from 'react';
import { ShieldCheck, Armchair, Leaf, Smartphone, Check, Clock, Award, TrainTrack } from 'lucide-react';

export const WhyRailConnect: React.FC = () => {
  return (
    <section id="why-us" className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold text-emerald-700 tracking-wider uppercase mb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Why Book With RailConnect India</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
            The Modern Standard for Indian Railways Ticket Booking
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Fast, reliable, and user-friendly ticket reservations across Indian Railways. Experience instant berth allocation, live PNR confirmation alerts, zero payment markups in INR, and seamless Google Maps station assistance.
          </p>
        </div>

        {/* 4-Item Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 01. Zero Hidden Fees */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-emerald-700 mb-3">
                01. Transparent INR Pricing
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Zero Hidden Markups
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                What you see is the exact official Indian Railways fare. No sudden payment gateway surcharges, no surprise agent fees, and full clarity in ₹ (INR).
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center gap-2 text-xs font-medium text-slate-700">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Official IRCTC & Railway tariffs</span>
            </div>
          </div>

          {/* 02. Interactive Coach Seat Maps */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-emerald-700 mb-3">
                02. Live Coach Schematics
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Pick Lower Berth or Window
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose your favorite berth preference: Lower Berth for elderly travelers, Side Upper for solitude, or Executive 180° rotatable seats on Vande Bharat trains.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center gap-2 text-xs font-medium text-slate-700">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant coach & seat allocation</span>
            </div>
          </div>

          {/* 03. High Speed Vande Bharat */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-emerald-700 mb-3">
                03. Next-Gen Train Travel
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Vande Bharat & Tejas
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Travel on India's indigenous semi-high speed trains cruising at 130–160 km/h with bio-vacuum toilets, automatic plug doors, and hot onboard meal services.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center gap-2 text-xs font-medium text-slate-700">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Catering & tea included</span>
            </div>
          </div>

          {/* 04. Digital Mobile Pass */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-emerald-700 mb-3">
                04. Paperless e-Ticket
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Instant QR Boarding Pass
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No station counter queues. Receive your 10-digit PNR and digital QR boarding pass on your mobile with cloud syncing via Google authentication.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center gap-2 text-xs font-medium text-slate-700">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Valid for TTE handheld inspection</span>
            </div>
          </div>
        </div>

        {/* Quantified Adjacency Proof Bar */}
        <div className="mt-12 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums">
              7,325+
            </div>
            <div className="text-xs text-slate-300 mt-1 font-medium">Stations Across Indian Railways</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums">
              99.2%
            </div>
            <div className="text-xs text-slate-300 mt-1 font-medium">Vande Bharat Average Punctuality</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums">
              2.4 Cr+
            </div>
            <div className="text-xs text-slate-300 mt-1 font-medium">Daily Indian Rail Passengers</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums">
              ₹0
            </div>
            <div className="text-xs text-slate-300 mt-1 font-medium">Payment Gateway Surcharge</div>
          </div>
        </div>
      </div>
    </section>
  );
};
