import React, { useState } from 'react';
import { Sparkles, Train, Utensils, Compass, ShieldCheck, MapPin, ArrowRight, Eye, CheckCircle2 } from 'lucide-react';

interface RailExperienceShowcaseProps {
  onOpenFoodModal: () => void;
  onOpenStationGuide: (stationName?: string) => void;
  onScrollToSearch: () => void;
}

export const RailExperienceShowcase: React.FC<RailExperienceShowcaseProps> = ({
  onOpenFoodModal,
  onOpenStationGuide,
  onScrollToSearch,
}) => {
  const [activeTab, setActiveTab] = useState<'vande_bharat' | 'dining' | 'scenic' | 'terminals'>('vande_bharat');

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold text-emerald-700 tracking-wider uppercase mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Modern Indian Railways Experience</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
            World-Class Comfort on India&apos;s High-Speed Tracks
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Experience the transformation of Indian Railways: from indigenous 160 km/h Vande Bharat trains and rotatable executive class seats to freshly catered royal regional meals and scenic mountain journeys.
          </p>
        </div>

        {/* Feature Experience Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('vande_bharat')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'vande_bharat'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Train className="w-4 h-4 text-emerald-400" />
            <span>Vande Bharat & Executive Cabin</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dining')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'dining'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Utensils className="w-4 h-4 text-amber-300" />
            <span>Royal Dining & e-Catering</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('scenic')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'scenic'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-300" />
            <span>Scenic Himalayan & Konkan Rails</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('terminals')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'terminals'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4 text-blue-300" />
            <span>Heritage & Modern Terminals</span>
          </button>
        </div>

        {/* TAB 1: VANDE BHARAT & EXECUTIVE CABIN */}
        {activeTab === 'vande_bharat' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fadeIn">
            {/* Split Images Grid */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                <img
                  src="/src/assets/images/vande_bharat_train_1790504178153.jpg"
                  alt="Vande Bharat semi-high speed train running on Indian Railways track"
                  className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/80 px-2 py-0.5 rounded text-white uppercase">
                    160 km/h Tested
                  </span>
                  <div className="text-xs font-bold mt-1">Aerodynamic High-Speed Bullet Nose</div>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                <img
                  src="/src/assets/images/vande_bharat_interior_1790506633999.jpg"
                  alt="Luxury Executive Class interior of Vande Bharat Express with rotatable seats"
                  className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <span className="text-[10px] font-mono font-bold bg-blue-500/80 px-2 py-0.5 rounded text-white uppercase">
                    Executive Class (EC)
                  </span>
                  <div className="text-xs font-bold mt-1">180° Rotatable Plush Blue Berths</div>
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Indigenous Semi-High Speed Benchmark</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                Designed for Speed, Engineered for Total Comfort
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                Step inside the future of Indian intercity travel. Vande Bharat Express features world-class sound dampening, automatic sliding plug doors, bio-vacuum lavatories with touch-free fittings, and panoramic heat-resistant tinted windows.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">180° Rotatable Reclining Seats</h5>
                    <p className="text-xs text-slate-500">In Executive Class (EC), swivel your seat to face the direction of train travel or fellow travelers.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Kavach Automatic Train Protection</h5>
                    <p className="text-xs text-slate-500">Equipped with indigenous railway anti-collision technology and high-speed emergency braking systems.</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onScrollToSearch}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <span>Find Vande Bharat Trains</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: ROYAL DINING & E-CATERING */}
        {activeTab === 'dining' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fadeIn">
            <div className="lg:col-span-7 relative rounded-3xl overflow-hidden shadow-xl group">
              <img
                src="/src/assets/images/indian_railway_food_1790506654544.jpg"
                alt="Delicious Indian Railways Maharaja royal thali served on train table"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
                <div>
                  <span className="text-xs font-mono font-bold bg-amber-500 text-slate-950 px-2.5 py-1 rounded-md uppercase">
                    Delivered to Your Seat
                  </span>
                  <h4 className="text-lg font-bold mt-1.5">IRCTC Maharaja Deluxe Veg Thali</h4>
                  <p className="text-xs text-amber-100">Paneer Butter Masala, Dal Makhani, Jeera Rice, Phulkas & Sweet</p>
                </div>
                <span className="text-xl font-black text-amber-300 font-mono bg-black/60 px-3 py-1 rounded-xl">
                  ₹220
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-full text-xs font-bold">
                <Utensils className="w-3.5 h-3.5 text-amber-600" />
                <span>IRCTC Food on Track e-Catering</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                Authentic Indian Flavors Delivered Straight to Your Berth
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                Enjoy hot, hygienic meals prepared in ISO-22000 certified station kitchens. Choose your favorite station along the route (e.g. Kanpur, Surat, Prayagraj, Nagpur), and our verified delivery partner brings it directly to your coach.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-0.5">Zero Food Markup</span>
                  <span className="text-slate-500 text-[11px]">Exact IRCTC approved tariff prices in Indian Rupees.</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-0.5">Pure Jain & Sattvic</span>
                  <span className="text-slate-500 text-[11px]">Strictly prepared meals without onion or garlic on request.</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenFoodModal}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <span>Browse Menu & Order Meal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: SCENIC HIMALAYAN & KONKAN RAILS */}
        {activeTab === 'scenic' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fadeIn">
            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                <img
                  src="/src/assets/images/himalayan_express_train_1790506670145.jpg"
                  alt="Scenic Himalayan Express train crossing mountain viaduct"
                  className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/80 px-2 py-0.5 rounded text-white uppercase">
                    Himalayan Corridors
                  </span>
                  <div className="text-xs font-bold mt-1">Katra, Jammu & Kashmir Rail Link</div>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                <img
                  src="/src/assets/images/konkan_scenic_rail_1790504207098.jpg"
                  alt="Konkan Railway viaduct through Western Ghats waterfalls"
                  className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <span className="text-[10px] font-mono font-bold bg-teal-500/80 px-2 py-0.5 rounded text-white uppercase">
                    Konkan Coastal Line
                  </span>
                  <div className="text-xs font-bold mt-1">Western Ghats & Arabian Sea Coast</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold">
                <Compass className="w-3.5 h-3.5 text-emerald-600" />
                <span>Incredible Indian Landscapes</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                India&apos;s Most Breathtaking Railway Engineering Marvels
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                From the mist-draped viaducts of the Konkan Railway hugging the Arabian Sea to the world&apos;s highest railway bridges in Jammu and Kashmir, explore India through wide picture-window coaches.
              </p>

              <div className="space-y-3 pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="font-bold text-slate-900 mb-0.5">Mumbai CSMT ⇄ Goa Madgaon Express</div>
                  <div className="text-slate-500">Traverses 91 tunnels, 2,000 bridges, and lush emerald coconut groves of the Konkan coast.</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="font-bold text-slate-900 mb-0.5">Delhi ⇄ Shri Mata Vaishno Devi Katra</div>
                  <div className="text-slate-500">Fast 8-hour devotional corridor leading directly to the Trikuta foothills with panoramic Shivalik views.</div>
                </div>
              </div>

              <button
                type="button"
                onClick={onScrollToSearch}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <span>Book Scenic Corridors</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: HERITAGE & MODERN TERMINALS */}
        {activeTab === 'terminals' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fadeIn">
            <div className="lg:col-span-7 relative rounded-3xl overflow-hidden shadow-xl group">
              <img
                src="/src/assets/images/mumbai_csmt_train_1790504192421.jpg"
                alt="Chhatrapati Shivaji Maharaj Terminus CSMT Mumbai iconic railway station"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs font-mono font-bold bg-blue-600 px-2.5 py-1 rounded-md uppercase">
                  UNESCO World Heritage Site
                </span>
                <h4 className="text-lg font-bold mt-1.5">Chhatrapati Shivaji Maharaj Terminus (CSMT), Mumbai</h4>
                <p className="text-xs text-slate-200">18 platforms connecting Mumbai to every corner of peninsular India</p>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-900 rounded-full text-xs font-bold">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Station Navigation with Google Maps</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                Smart Station Guidance at India&apos;s Busiest Junctions
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                Never get lost on a 16-platform terminal. Our Google Maps India integration provides exact entrance guidance (Paharganj Gate 1 vs Ajmeri Gate 2 at New Delhi), IRCTC executive lounges, and direct subway links to city metros.
              </p>

              <div className="space-y-2.5 pt-1 text-xs">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-semibold text-slate-800">New Delhi Railway Station (NDLS)</span>
                  <span className="text-emerald-700 font-bold">16 Platforms · Airport Metro</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-semibold text-slate-800">Howrah Junction, Kolkata (HWH)</span>
                  <span className="text-emerald-700 font-bold">23 Platforms · Underwater Metro</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-semibold text-slate-800">Varanasi Junction Cantt (BSB)</span>
                  <span className="text-emerald-700 font-bold">9 Platforms · Vishwanath Corridor</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onOpenStationGuide('New Delhi Railway Station')}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                <span>Explore Stations on Google Maps</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
