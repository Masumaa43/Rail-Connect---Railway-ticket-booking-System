import React from 'react';
import { Train, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 text-white mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Train className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Rail<span className="text-emerald-500">Connect</span>
                <span className="text-xs font-normal text-slate-400 ml-1.5 font-mono">India</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-4">
              Modern Indian Railways ticket booking & journey companion. Connect with Vande Bharat, Tejas Rajdhani, Shatabdi, and Superfast express trains with transparent INR fares, live PNR tracking, and Google Maps station explorer.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>PCI-DSS Compliant · 256-bit SSL · Official IRCTC Direct Partner</span>
            </div>
          </div>

          {/* Popular Corridors */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Key Indian Corridors
            </h4>
            <ul className="space-y-2">
              <li><span className="hover:text-white transition-colors cursor-pointer">New Delhi ⇄ Varanasi</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">New Delhi ⇄ Mumbai Central</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Mumbai CSMT ⇄ Madgaon (Goa)</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Bengaluru ⇄ Chennai Central</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Howrah ⇄ New Delhi</span></li>
            </ul>
          </div>

          {/* Travel Information */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Passenger Services
            </h4>
            <ul className="space-y-2">
              <li><span className="hover:text-white transition-colors cursor-pointer">Live Train Running Status</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">10-Digit PNR Chart Status</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Tatkal Booking Guidelines</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">IRCTC Executive Lounges</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Refund Rules & TDR Filing</span></li>
            </ul>
          </div>

          {/* Support & Zones */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Railway Zones
            </h4>
            <ul className="space-y-2">
              <li><span className="hover:text-white transition-colors cursor-pointer">Northern Railway (NR)</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Western Railway (WR)</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Central Railway (CR)</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Eastern Railway (ER)</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Southern Railway (SR)</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} RailConnect India. Built with pride for Indian Railways travelers. All fares listed in Indian Rupees (INR ₹).
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Carriage</span>
            <span className="hover:text-slate-400 cursor-pointer">IRCTC Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
