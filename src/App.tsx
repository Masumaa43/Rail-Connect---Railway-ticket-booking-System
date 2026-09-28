import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PopularRoutes } from './components/PopularRoutes';
import { SearchResults } from './components/SearchResults';
import { WhyRailConnect } from './components/WhyRailConnect';
import { SeatPickerModal } from './components/SeatPickerModal';
import { MyBookingsDrawer } from './components/MyBookingsDrawer';
import { LiveStatusModal } from './components/LiveStatusModal';
import { StationGuideModal } from './components/StationGuideModal';
import { FoodOnTrainModal } from './components/FoodOnTrainModal';
import { EmergencyModal } from './components/EmergencyModal';
import { RailExperienceShowcase } from './components/RailExperienceShowcase';
import { AreaScenariosSection } from './components/AreaScenariosSection';
import { Footer } from './components/Footer';
import { 
  POPULAR_ROUTES, 
  PopularRoute, 
  TrainSchedule, 
  BookingTicket, 
  PnrHistoryItem,
  FoodOrder,
  EmergencySosRequest,
  BookmarkedPlaceRecord,
  ScenicPlace,
  INITIAL_BOOKINGS, 
  INITIAL_PNR_HISTORY,
  INITIAL_FOOD_ORDERS,
  INITIAL_BOOKMARKED_PLACES,
  generateSchedules,
  STATIONS,
  ClassFare
} from './data/railData';
import { 
  db, 
  saveBookingToFirestore, 
  deleteBookingFromFirestore,
  savePnrToHistory,
  deletePnrFromHistory,
  saveFoodOrderToFirestore,
  deleteFoodOrderFromFirestore,
  saveEmergencySosToFirestore,
  saveBookmarkToFirestore,
  deleteBookmarkFromFirestore,
  handleFirestoreError, 
  OperationType 
} from './lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { MapPin, Sparkles, Navigation, ArrowRight, ShieldCheck, Utensils, ShieldAlert, Clock, PhoneCall, Bookmark } from 'lucide-react';

function RailConnectApp() {
  const { user, loginWithGoogle } = useAuth();

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  // Bookings list state
  const [bookings, setBookings] = useState<BookingTicket[]>(INITIAL_BOOKINGS);
  const [isBookingsDrawerOpen, setIsBookingsDrawerOpen] = useState(false);
  const [isLiveStatusModalOpen, setIsLiveStatusModalOpen] = useState(false);
  const [activeLivePnr, setActiveLivePnr] = useState<string | undefined>(undefined);

  // PNR Search History (with Timeline visual)
  const [pnrHistory, setPnrHistory] = useState<PnrHistoryItem[]>(INITIAL_PNR_HISTORY);

  // Food on Train (e-Catering)
  const [foodOrders, setFoodOrders] = useState<FoodOrder[]>(INITIAL_FOOD_ORDERS);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);

  // Emergency 139 SOS
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencySosRequest[]>([]);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // Bookmarked Places & Famous Landmarks
  const [bookmarkedPlaces, setBookmarkedPlaces] = useState<BookmarkedPlaceRecord[]>(INITIAL_BOOKMARKED_PLACES);

  // Google Maps Station Guide Modal State
  const [isStationGuideOpen, setIsStationGuideOpen] = useState(false);
  const [stationGuideStation, setStationGuideStation] = useState('New Delhi Railway Station');

  // Search parameters for Indian Railways
  const [searchParams, setSearchParams] = useState({
    fromStation: 'New Delhi Railway Station',
    toStation: 'Varanasi Junction (Cantt)',
    travelDate: tomorrow,
    tripType: 'one-way' as 'one-way' | 'round-trip',
    passengers: 1,
    quota: 'General',
    travelClass: 'ALL',
  });

  // Pre-load default Indian trains between NDLS and BSB so user sees instant results
  const [schedules, setSchedules] = useState<TrainSchedule[]>(() =>
    generateSchedules('New Delhi Railway Station', 'Varanasi Junction (Cantt)', tomorrow)
  );
  const [hasSearched, setHasSearched] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Booking Modal State
  const [isSeatPickerOpen, setIsSeatPickerOpen] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState<TrainSchedule | null>(null);
  const [selectedClassKey, setSelectedClassKey] = useState<string>('CC');

  // Firestore Data Persistence: Listen to user's bookings, PNR history, food orders, and emergency SOS
  useEffect(() => {
    if (!user) {
      return;
    }

    // 1. Sync Bookings
    const pathBookings = 'bookings';
    const qBookings = query(collection(db, pathBookings), where('userId', '==', user.uid));
    const unsubBookings = onSnapshot(
      qBookings,
      (snapshot) => {
        const list: BookingTicket[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as BookingTicket);
        });
        if (list.length > 0) setBookings(list);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, pathBookings)
    );

    // 2. Sync PNR History
    const pathPnr = 'pnr_history';
    const qPnr = query(collection(db, pathPnr), where('userId', '==', user.uid));
    const unsubPnr = onSnapshot(
      qPnr,
      (snapshot) => {
        const list: PnrHistoryItem[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as PnrHistoryItem);
        });
        if (list.length > 0) setPnrHistory(list);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, pathPnr)
    );

    // 3. Sync Food Orders
    const pathFood = 'food_orders';
    const qFood = query(collection(db, pathFood), where('userId', '==', user.uid));
    const unsubFood = onSnapshot(
      qFood,
      (snapshot) => {
        const list: FoodOrder[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as FoodOrder);
        });
        if (list.length > 0) setFoodOrders(list);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, pathFood)
    );

    // 4. Sync Emergency SOS
    const pathSos = 'emergency_sos';
    const qSos = query(collection(db, pathSos), where('userId', '==', user.uid));
    const unsubSos = onSnapshot(
      qSos,
      (snapshot) => {
        const list: EmergencySosRequest[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as EmergencySosRequest);
        });
        if (list.length > 0) setEmergencyRequests(list);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, pathSos)
    );

    // 5. Sync Bookmarked Places
    const pathBookmarks = 'bookmarked_places';
    const qBookmarks = query(collection(db, pathBookmarks), where('userId', '==', user.uid));
    const unsubBookmarks = onSnapshot(
      qBookmarks,
      (snapshot) => {
        const list: BookmarkedPlaceRecord[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as BookmarkedPlaceRecord);
        });
        if (list.length > 0) setBookmarkedPlaces(list);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, pathBookmarks)
    );

    return () => {
      unsubBookings();
      unsubPnr();
      unsubFood();
      unsubSos();
      unsubBookmarks();
    };
  }, [user]);

  // Trigger train search
  const handleSearch = (params: {
    fromStation: string;
    toStation: string;
    travelDate: string;
    returnDate?: string;
    tripType: 'one-way' | 'round-trip';
    passengers: number;
    quota: string;
    travelClass: string;
  }) => {
    setIsSearching(true);
    setSearchParams(params);

    setTimeout(() => {
      const generated = generateSchedules(params.fromStation, params.toStation, params.travelDate);
      setSchedules(generated);
      setHasSearched(true);
      setIsSearching(false);

      setTimeout(() => {
        const el = document.getElementById('search-results-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }, 400);
  };

  // Popular route selection shortcut
  const handleSelectPopularRoute = (route: PopularRoute) => {
    const newParams = {
      fromStation: route.fromStation,
      toStation: route.toStation,
      travelDate: tomorrow,
      tripType: 'one-way' as const,
      passengers: 1,
      quota: 'General',
      travelClass: 'ALL',
    };
    handleSearch(newParams);
  };

  // Open Station Guide for a specific station
  const handleOpenStationGuide = (stationName?: string) => {
    if (stationName) {
      setStationGuideStation(stationName);
    }
    setIsStationGuideOpen(true);
  };

  // Select train for reservation
  const handleSelectTrain = (train: TrainSchedule, classKey: string) => {
    setSelectedTrain(train);
    setSelectedClassKey(classKey);
    setIsSeatPickerOpen(true);
  };

  // Add new ticket to bookings and persist in Firestore
  const handleConfirmBooking = async (newTicket: BookingTicket) => {
    setBookings((prev) => [newTicket, ...prev]);

    // Also auto-add to PNR History with timeline
    const historyItem: PnrHistoryItem = {
      id: `pnr-${newTicket.pnr}-${Date.now()}`,
      pnr: newTicket.pnr,
      trainNumber: newTicket.trainNumber,
      trainName: newTicket.trainName,
      fromStation: newTicket.fromStation,
      toStation: newTicket.toStation,
      journeyDate: newTicket.travelDate,
      bookingStatus: 'CNF (Confirmed)',
      coach: newTicket.coach,
      berth: `${newTicket.seatNumber} (${newTicket.berthType})`,
      classType: newTicket.seatClass,
      chartStatus: 'Chart Prepared at Origin',
      currentSpeed: '0 km/h (Station Yard)',
      currentStation: newTicket.fromStation,
      eta: newTicket.arrivalTime,
      checkedAt: 'Just now',
      timeline: [
        {
          step: 1,
          title: 'Ticket Booked & Confirmed',
          description: `Confirmed reservation through Indian Railways PRS. Coach ${newTicket.coach}, Seat ${newTicket.seatNumber}.`,
          time: 'Today',
          completed: true,
          badge: 'CNF',
        },
        {
          step: 2,
          title: 'Chart Preparation',
          description: `Chart finalized at ${newTicket.fromCode}. Coach ${newTicket.coach} assigned.`,
          time: 'Scheduled',
          completed: true,
          badge: 'CHART PREPARED',
        },
        {
          step: 3,
          title: `Departure from ${newTicket.fromCode}`,
          description: `Scheduled departure at ${newTicket.departureTime} from ${newTicket.platform}.`,
          time: newTicket.departureTime,
          completed: false,
          badge: 'ON-TIME',
        },
        {
          step: 4,
          title: 'En Route Tracking',
          description: 'Live GPS speed and clearance alerts via NTES.',
          time: 'En-route',
          completed: false,
          badge: 'SATELLITE GPS',
        },
        {
          step: 5,
          title: `Arrival at ${newTicket.toCode}`,
          description: `Scheduled arrival at ${newTicket.arrivalTime}.`,
          time: newTicket.arrivalTime,
          completed: false,
          badge: 'DESTINATION',
        },
      ],
    };
    setPnrHistory((prev) => [historyItem, ...prev]);

    if (user) {
      try {
        await saveBookingToFirestore(newTicket, user.uid);
        await savePnrToHistory(historyItem, user.uid);
      } catch (err) {
        console.error('Error saving booking/pnr to Firestore:', err);
      }
    }
  };

  // Cancel booking and remove from Firestore
  const handleCancelBooking = async (pnr: string) => {
    setBookings((prev) => prev.filter((t) => t.pnr !== pnr));
    if (user) {
      try {
        await deleteBookingFromFirestore(pnr);
      } catch (err) {
        console.error('Error deleting booking from Firestore:', err);
      }
    }
  };

  // PNR History Refresh Handler
  const handleRefreshPnr = async (pnr: string) => {
    try {
      const res = await fetch('/api/pnr-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pnr }),
      });
      if (res.ok) {
        const data = await res.json();
        setPnrHistory((prev) =>
          prev.map((item) =>
            item.pnr === pnr
              ? {
                  ...item,
                  currentSpeed: data.currentSpeed,
                  currentStation: data.currentLocation,
                  eta: data.eta,
                  checkedAt: 'Refreshed just now',
                  timeline: data.timeline || item.timeline,
                }
              : item
          )
        );
      }
    } catch (e) {
      console.error('Error refreshing PNR:', e);
    }
  };

  // Delete PNR History Item
  const handleDeletePnrHistory = async (id: string) => {
    setPnrHistory((prev) => prev.filter((h) => h.id !== id));
    if (user) {
      try {
        await deletePnrFromHistory(id);
      } catch (e) {
        console.error('Error deleting PNR from history:', e);
      }
    }
  };

  // Open Live Tracker from Drawer with specific PNR
  const handleOpenLiveTrackerWithPnr = (pnr?: string) => {
    setActiveLivePnr(pnr);
    setIsLiveStatusModalOpen(true);
  };

  // Handle PNR Checked from Modal
  const handlePnrCheckedFromModal = async (item: PnrHistoryItem) => {
    setPnrHistory((prev) => [item, ...prev.filter((p) => p.pnr !== item.pnr)]);
    if (user) {
      try {
        await savePnrToHistory(item, user.uid);
      } catch (e) {
        console.error('Error saving checked PNR to history:', e);
      }
    }
  };

  // Handle Order Food on Train
  const handleOrderFood = async (newOrder: FoodOrder) => {
    setFoodOrders((prev) => [newOrder, ...prev]);
    if (user) {
      try {
        await saveFoodOrderToFirestore(newOrder, user.uid);
      } catch (e) {
        console.error('Error saving food order to Firestore:', e);
      }
    }
  };

  // Handle Submit Emergency SOS
  const handleSubmitSos = async (newSos: EmergencySosRequest) => {
    setEmergencyRequests((prev) => [newSos, ...prev]);
    if (user) {
      try {
        await saveEmergencySosToFirestore(newSos, user.uid);
      } catch (e) {
        console.error('Error saving emergency SOS to Firestore:', e);
      }
    }
  };

  // View boarding pass directly
  const handleViewBoardingPass = (ticket: BookingTicket) => {
    const classFareMock: ClassFare = {
      name: ticket.seatClass,
      code: (ticket.seatClass.includes('EC') ? 'EC' : ticket.seatClass.includes('CC') ? 'CC' : '3A') as any,
      price: ticket.totalPaid,
      availableSeats: 8,
      status: 'AVL',
    };

    const mockSchedule: TrainSchedule = {
      id: `${ticket.trainNumber}-${ticket.pnr}`,
      trainNumber: ticket.trainNumber,
      trainName: ticket.trainName,
      trainType: ticket.trainName.includes('Vande Bharat') ? 'Vande Bharat' : 'Tejas Rajdhani',
      departureTime: ticket.departureTime,
      arrivalTime: ticket.arrivalTime,
      duration: '8h 00m',
      fromStation: ticket.fromStation,
      fromCode: ticket.fromCode,
      toStation: ticket.toStation,
      toCode: ticket.toCode,
      runningDays: ['Daily'],
      stops: 3,
      stopDetails: ['Kanpur Central', 'Prayagraj Junction'],
      classes: {
        [ticket.seatClass]: classFareMock,
        CC: classFareMock,
      },
      amenities: ['CCTV Surveillance', 'Modular Vacuum Toilets', 'Bio-catering'],
      onTimeRate: '99.1%',
      platform: ticket.platform,
      pantry: true,
    };

    setSelectedTrain(mockSchedule);
    setSelectedClassKey(ticket.seatClass.includes('EC') ? 'EC' : 'CC');
    setIsSeatPickerOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        onOpenBookings={() => setIsBookingsDrawerOpen(true)}
        bookingCount={bookings.length}
        onOpenLiveStatus={() => {
          setActiveLivePnr(undefined);
          setIsLiveStatusModalOpen(true);
        }}
        onOpenStationGuide={() => handleOpenStationGuide(searchParams.fromStation)}
        onOpenFoodModal={() => setIsFoodModalOpen(true)}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onScrollToSearch={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onScrollToRoutes={() => {
          const el = document.getElementById('popular-routes');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onScrollToWhyUs={() => {
          const el = document.getElementById('why-us');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <main className="flex-1">
        {/* Hero Section with Search Form */}
        <HeroSection
          onSearch={handleSearch}
          initialFrom={searchParams.fromStation}
          initialTo={searchParams.toStation}
          isSearching={isSearching}
          onOpenStationGuide={() => handleOpenStationGuide(searchParams.fromStation)}
          onScrollToScenarios={() => {
            const el = document.getElementById('area-scenarios-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Action Shortcuts Banner: Google Maps Navigation, Food on Track & Emergency 139 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 mb-6 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. Google Maps India Navigation */}
            <div 
              onClick={() => handleOpenStationGuide(searchParams.fromStation)}
              className="bg-slate-900 text-white rounded-2xl p-4 shadow-xl border border-slate-800 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-850 hover:border-emerald-500/50 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold truncate">Google Maps Navigator</span>
                    <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded">
                      Maps
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 truncate mt-0.5">
                    Gate entrances & corridor turn-by-turn
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* 2. Food on Track (e-Catering) */}
            <div 
              onClick={() => setIsFoodModalOpen(true)}
              className="bg-gradient-to-r from-amber-900/90 to-amber-800/90 text-white rounded-2xl p-4 shadow-xl border border-amber-700/60 flex items-center justify-between gap-3 cursor-pointer hover:border-amber-500 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-transform">
                  <Utensils className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold truncate">Food on Track (e-Catering)</span>
                    <span className="text-[9px] font-bold bg-amber-400/20 text-amber-200 px-1.5 py-0.2 rounded">
                      Hot Meals
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-100 truncate mt-0.5">
                    Delivered straight to coach & berth
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-300 shrink-0 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* 3. Emergency SOS & RailMadad 139 */}
            <div 
              onClick={() => setIsEmergencyModalOpen(true)}
              className="bg-gradient-to-r from-rose-950 to-red-900 text-white rounded-2xl p-4 shadow-xl border border-rose-800/60 flex items-center justify-between gap-3 cursor-pointer hover:border-rose-500 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-5 h-5 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold truncate">Emergency SOS & 139</span>
                    <span className="text-[9px] font-bold bg-rose-500/30 text-rose-200 px-1.5 py-0.2 rounded">
                      Real-time
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-200 truncate mt-0.5">
                    Direct RPF, doctor & RailMadad escalation
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-rose-300 shrink-0 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Live Search Results (appears when searched) */}
        {hasSearched && (
          <SearchResults
            schedules={schedules}
            searchParams={searchParams}
            onSelectTrain={handleSelectTrain}
            onModifySearch={() => {
              window.scrollTo({ top: 120, behavior: 'smooth' });
            }}
            onOpenStationGuide={handleOpenStationGuide}
          />
        )}

        {/* Popular Indian Railway Routes Section */}
        <PopularRoutes 
          onSelectRoute={handleSelectPopularRoute}
          onOpenStationGuide={handleOpenStationGuide}
        />

        {/* Visual Indian Railway Experience Showcase */}
        <RailExperienceShowcase
          onOpenFoodModal={() => setIsFoodModalOpen(true)}
          onOpenStationGuide={handleOpenStationGuide}
          onScrollToSearch={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />

        {/* Why RailConnect Section */}
        <WhyRailConnect />
      </main>

      {/* Seat Picker & Instant Digital Boarding Pass Modal */}
      <SeatPickerModal
        isOpen={isSeatPickerOpen}
        onClose={() => setIsSeatPickerOpen(false)}
        train={selectedTrain}
        seatClassKey={selectedClassKey}
        passengers={searchParams.passengers}
        travelDate={searchParams.travelDate}
        quota={searchParams.quota}
        onConfirmBooking={handleConfirmBooking}
      />

      {/* User Bookings Slide-Over Drawer with PNR History Timeline, Meals & SOS */}
      <MyBookingsDrawer
        isOpen={isBookingsDrawerOpen}
        onClose={() => setIsBookingsDrawerOpen(false)}
        bookings={bookings}
        onCancelBooking={handleCancelBooking}
        onViewBoardingPass={handleViewBoardingPass}
        pnrHistory={pnrHistory}
        onRefreshPnr={handleRefreshPnr}
        onDeletePnrHistory={handleDeletePnrHistory}
        onOpenLiveTracker={handleOpenLiveTrackerWithPnr}
        foodOrders={foodOrders}
        onOpenFoodModal={() => {
          setIsBookingsDrawerOpen(false);
          setIsFoodModalOpen(true);
        }}
        emergencyRequests={emergencyRequests}
        onOpenEmergencyModal={() => {
          setIsBookingsDrawerOpen(false);
          setIsEmergencyModalOpen(true);
        }}
      />

      {/* Live Train Status Tracker Modal */}
      <LiveStatusModal
        isOpen={isLiveStatusModalOpen}
        onClose={() => setIsLiveStatusModalOpen(false)}
        initialPnr={activeLivePnr}
        onPnrChecked={handlePnrCheckedFromModal}
      />

      {/* Google Maps Station & Navigation Guide Modal (Grounded with gemini-3.5-flash) */}
      <StationGuideModal
        isOpen={isStationGuideOpen}
        onClose={() => setIsStationGuideOpen(false)}
        defaultStation={stationGuideStation}
      />

      {/* Food on Train (IRCTC e-Catering) Modal */}
      <FoodOnTrainModal
        isOpen={isFoodModalOpen}
        onClose={() => setIsFoodModalOpen(false)}
        bookings={bookings}
        onOrderFood={handleOrderFood}
      />

      {/* Real-time RailMadad 139 & RPF Emergency SOS Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        bookings={bookings}
        onSubmitSos={handleSubmitSos}
        activeSos={emergencyRequests[0] || null}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RailConnectApp />
    </AuthProvider>
  );
}
