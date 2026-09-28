export interface Station {
  id: string;
  code: string;
  name: string;
  city: string;
  state: string;
  zone: string;
  popular?: boolean;
}

export interface PopularRoute {
  id: string;
  fromStation: string;
  fromCode: string;
  toStation: string;
  toCode: string;
  trainName: string;
  trainNumber: string;
  distance: string;
  duration: string;
  frequency: string;
  startingPrice: number;
  currency: string;
  image: string;
  category: string;
  highlight: string;
}

export type TravelClassKey = 'CC' | 'EC' | '3A' | '2A' | '1A' | 'SL' | '2S' | 'GEN';

export interface ClassFare {
  name: string;
  code: TravelClassKey;
  price: number;
  availableSeats: number;
  status: 'AVL' | 'RAC' | 'WL';
  statusNumber?: number;
}

export interface TrainSchedule {
  id: string;
  trainNumber: string;
  trainName: string;
  trainType: 'Vande Bharat' | 'Tejas Rajdhani' | 'Shatabdi' | 'Duronto' | 'Superfast Express' | 'Mail / Express' | 'Local Passenger / MEMU' | 'Intercity Express';
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fromStation: string;
  fromCode: string;
  toStation: string;
  toCode: string;
  runningDays: string[];
  stops: number;
  stopDetails: string[];
  classes: Record<string, ClassFare>;
  amenities: string[];
  onTimeRate: string;
  platform: string;
  pantry: boolean;
}

export interface BookingTicket {
  pnr: string;
  trainNumber: string;
  trainName: string;
  fromStation: string;
  fromCode: string;
  toStation: string;
  toCode: string;
  departureTime: string;
  arrivalTime: string;
  travelDate: string;
  passengerName: string;
  quota: 'General' | 'Tatkal' | 'Ladies' | 'Senior Citizen';
  seatClass: string;
  coach: string;
  seatNumber: string;
  berthType: string;
  totalPaid: number;
  status: 'Confirmed' | 'RAC' | 'Waitlisted' | 'Chart Prepared';
  platform: string;
  bookingTime?: string;
  transactionId?: string;
  paymentMethod?: string;
  paymentStatus?: 'SUCCESS' | 'REFUNDED';
  baseFare?: number;
  convenienceFee?: number;
  gstAmount?: number;
  insuranceOpted?: boolean;
}

export interface WalletTransaction {
  id: string;
  userId?: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  description: string;
  referenceId: string;
  category: 'Ticket Booking' | 'Ticket Refund' | 'Food Order' | 'Wallet Topup' | 'Cashback';
  balanceAfter: number;
  timestamp: string;
}

export const INITIAL_WALLET_BALANCE = 5000;

export const INITIAL_WALLET_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-init-1',
    type: 'CREDIT',
    amount: 5000,
    description: 'Welcome Bonus & RailPay Virtual Wallet Activation',
    referenceId: 'TOPUP-WELCOME-2026',
    category: 'Wallet Topup',
    balanceAfter: 5000,
    timestamp: 'Today, 08:00 AM',
  },
  {
    id: 'tx-init-2',
    type: 'DEBIT',
    amount: 3350,
    description: 'Payment for Vande Bharat Express (PNR: 284-9201843)',
    referenceId: '284-9201843',
    category: 'Ticket Booking',
    balanceAfter: 1650,
    timestamp: 'Today, 08:30 AM',
  },
  {
    id: 'tx-init-3',
    type: 'CREDIT',
    amount: 168,
    description: '5% IRCTC RailPay Superfast Cashback Credited',
    referenceId: 'CASHBACK-284-9201843',
    category: 'Cashback',
    balanceAfter: 1818,
    timestamp: 'Today, 08:31 AM',
  },
  {
    id: 'tx-init-4',
    type: 'CREDIT',
    amount: 3000,
    description: 'Virtual Wallet Recharge via UPI (Google Pay)',
    referenceId: 'UPI-RECH-9812401',
    category: 'Wallet Topup',
    balanceAfter: 4818,
    timestamp: 'Today, 09:15 AM',
  },
];

export interface TimelineMilestone {
  step: number;
  title: string;
  description: string;
  time: string;
  completed: boolean;
  badge: string;
}

export interface PnrHistoryItem {
  id: string;
  userId?: string;
  pnr: string;
  trainNumber: string;
  trainName: string;
  fromStation: string;
  toStation: string;
  journeyDate: string;
  bookingStatus: string;
  coach: string;
  berth: string;
  classType: string;
  chartStatus: string;
  currentSpeed?: string;
  currentStation?: string;
  eta?: string;
  checkedAt: string;
  timeline: TimelineMilestone[];
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Thali & Meals' | 'Rice & Biryani' | 'Breakfast' | 'Jain Food' | 'Snacks & Beverages';
  veg: boolean;
  rating: number;
  prepTime: string;
  vendor: string;
  image: string;
}

export interface FoodOrder {
  id: string;
  userId?: string;
  pnr: string;
  trainNumber: string;
  trainName: string;
  coach: string;
  seat: string;
  deliveryStation: string;
  itemName: string;
  quantity: number;
  totalPrice: number;
  paymentMethod: string;
  transactionId?: string;
  paymentStatus?: 'PAID' | 'COD' | 'SUCCESS';
  orderStatus: 'Preparing at Station' | 'Out for Berth Delivery' | 'Delivered at Seat';
  orderedAt: string;
  estimatedDelivery?: string;
}

export interface EmergencyContact {
  service: string;
  number: string;
  category: string;
  description: string;
  type: string;
  available: string;
}

export interface EmergencySosRequest {
  id: string;
  userId?: string;
  pnr?: string;
  trainNumber: string;
  coach: string;
  seat: string;
  emergencyType: 'Medical Emergency' | 'RPF Security Threat' | 'Women Passenger Safety' | 'Coach Maintenance / Water' | 'Fire / Safety Hazard';
  description: string;
  phone: string;
  status: 'Dispatched to RPF Control' | 'Attending at Next Halt' | 'Medical Unit Deployed' | 'Resolved';
  officialsAssigned: string;
  createdAt: string;
}

export interface AreaScenario {
  id: string;
  areaId: string;
  areaName: string;
  region: string;
  title: string;
  category: 'Scenic Vista' | 'Weather & Monsoon' | 'Cultural Window' | 'Station Food' | 'Transit Connection';
  description: string;
  bestWindowSide: 'Left Window' | 'Right Window' | 'Both Sides';
  timingHighlight: string;
  weatherTip?: string;
  keyStations: string[];
  iconType: 'mountain' | 'water' | 'cloud' | 'food' | 'temple' | 'sun';
}

export interface ScenicPlace {
  id: string;
  name: string;
  cityName: string;
  state: string;
  nearestStation: string;
  nearestStationCode: string;
  distanceFromStation: string;
  category: 'Spiritual & Ghats' | 'Heritage & Forts' | 'Nature & Waterfalls' | 'Iconic Landmark' | 'Architectural Marvel';
  rating: number;
  bestTimeToVisit: string;
  description: string;
  imageUrl: string;
  corridors: string[];
  mapsUrl: string;
}

export interface BookmarkedPlaceRecord {
  id: string;
  userId?: string;
  placeId: string;
  placeName: string;
  cityName: string;
  nearestStation: string;
  category: string;
  imageUrl: string;
  description: string;
  mapsUrl: string;
  bookmarkedAt: string;
}

// Comprehensive Pan-India Stations Database covering all Indian States, Territories & Railway Zones
export const STATIONS: Station[] = [
  // Northern Railway / North Central / North Western
  { id: 'del-ndls', code: 'NDLS', name: 'New Delhi Railway Station', city: 'New Delhi', state: 'Delhi', zone: 'Northern Railway (NR)', popular: true },
  { id: 'del-dli', code: 'DLI', name: 'Old Delhi Junction', city: 'Delhi', state: 'Delhi', zone: 'Northern Railway (NR)', popular: false },
  { id: 'del-nqm', code: 'NZM', name: 'Hazrat Nizamuddin', city: 'New Delhi', state: 'Delhi', zone: 'Northern Railway (NR)', popular: true },
  { id: 'del-anvt', code: 'ANVT', name: 'Anand Vihar Terminal', city: 'Delhi', state: 'Delhi', zone: 'Northern Railway (NR)', popular: false },
  { id: 'vns-bsb', code: 'BSB', name: 'Varanasi Junction (Cantt)', city: 'Varanasi', state: 'Uttar Pradesh', zone: 'Northern Railway (NR)', popular: true },
  { id: 'vns-ddu', code: 'DDU', name: 'Pt. Deen Dayal Upadhyaya Jn', city: 'Mughalsarai', state: 'Uttar Pradesh', zone: 'East Central Railway (ECR)', popular: false },
  { id: 'lko-lko', code: 'LKO', name: 'Lucknow Charbagh', city: 'Lucknow', state: 'Uttar Pradesh', zone: 'Northern Railway (NR)', popular: true },
  { id: 'knp-cnb', code: 'CNB', name: 'Kanpur Central', city: 'Kanpur', state: 'Uttar Pradesh', zone: 'North Central Railway (NCR)', popular: true },
  { id: 'pry-pryj', code: 'PRYJ', name: 'Prayagraj Junction (Allahabad)', city: 'Prayagraj', state: 'Uttar Pradesh', zone: 'North Central Railway (NCR)', popular: true },
  { id: 'agr-agc', code: 'AGC', name: 'Agra Cantt', city: 'Agra', state: 'Uttar Pradesh', zone: 'North Central Railway (NCR)', popular: true },
  { id: 'chd-cdg', code: 'CDG', name: 'Chandigarh Junction', city: 'Chandigarh', state: 'Punjab/Haryana', zone: 'Northern Railway (NR)', popular: true },
  { id: 'asr-asr', code: 'ASR', name: 'Amritsar Junction', city: 'Amritsar', state: 'Punjab', zone: 'Northern Railway (NR)', popular: true },
  { id: 'ktr-svdk', code: 'SVDK', name: 'Shri Mata Vaishno Devi Katra', city: 'Katra', state: 'Jammu and Kashmir', zone: 'Northern Railway (NR)', popular: true },
  { id: 'jam-jat', code: 'JAT', name: 'Jammu Tawi', city: 'Jammu', state: 'Jammu and Kashmir', zone: 'Northern Railway (NR)', popular: false },
  { id: 'ddn-ddn', code: 'DDN', name: 'Dehradun Railway Station', city: 'Dehradun', state: 'Uttarakhand', zone: 'Northern Railway (NR)', popular: true },
  { id: 'hwd-hw', code: 'HW', name: 'Haridwar Junction', city: 'Haridwar', state: 'Uttarakhand', zone: 'Northern Railway (NR)', popular: true },
  { id: 'jpr-jp', code: 'JP', name: 'Jaipur Junction', city: 'Jaipur', state: 'Rajasthan', zone: 'North Western Railway (NWR)', popular: true },
  { id: 'jdh-ju', code: 'JU', name: 'Jodhpur Junction', city: 'Jodhpur', state: 'Rajasthan', zone: 'North Western Railway (NWR)', popular: false },
  { id: 'ajm-aii', code: 'AII', name: 'Ajmer Junction', city: 'Ajmer', state: 'Rajasthan', zone: 'North Western Railway (NWR)', popular: false },
  { id: 'uda-udz', code: 'UDZ', name: 'Udaipur City', city: 'Udaipur', state: 'Rajasthan', zone: 'North Western Railway (NWR)', popular: true },

  // Western & Central Railway
  { id: 'mum-csmt', code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus', city: 'Mumbai', state: 'Maharashtra', zone: 'Central Railway (CR)', popular: true },
  { id: 'mum-mmct', code: 'MMCT', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra', zone: 'Western Railway (WR)', popular: true },
  { id: 'mum-bdts', code: 'BDTS', name: 'Bandra Terminus', city: 'Mumbai', state: 'Maharashtra', zone: 'Western Railway (WR)', popular: false },
  { id: 'mum-ltt', code: 'LTT', name: 'Lokmanya Tilak Terminus', city: 'Mumbai', state: 'Maharashtra', zone: 'Central Railway (CR)', popular: false },
  { id: 'pun-pune', code: 'PUNE', name: 'Pune Junction', city: 'Pune', state: 'Maharashtra', zone: 'Central Railway (CR)', popular: true },
  { id: 'ngp-ngp', code: 'NGP', name: 'Nagpur Junction', city: 'Nagpur', state: 'Maharashtra', zone: 'Central Railway (CR)', popular: true },
  { id: 'ahm-adi', code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat', zone: 'Western Railway (WR)', popular: true },
  { id: 'srt-st', code: 'ST', name: 'Surat Railway Station', city: 'Surat', state: 'Gujarat', zone: 'Western Railway (WR)', popular: true },
  { id: 'brc-brc', code: 'BRC', name: 'Vadodara Junction', city: 'Vadodara', state: 'Gujarat', zone: 'Western Railway (WR)', popular: false },
  { id: 'rjt-rjt', code: 'RJT', name: 'Rajkot Junction', city: 'Rajkot', state: 'Gujarat', zone: 'Western Railway (WR)', popular: false },
  { id: 'bpl-rkmp', code: 'RKMP', name: 'Rani Kamlapati (Bhopal)', city: 'Bhopal', state: 'Madhya Pradesh', zone: 'West Central Railway (WCR)', popular: true },
  { id: 'ind-indb', code: 'INDB', name: 'Indore Junction', city: 'Indore', state: 'Madhya Pradesh', zone: 'Western Railway (WR)', popular: true },
  { id: 'gwl-gwl', code: 'GWL', name: 'Gwalior Junction', city: 'Gwalior', state: 'Madhya Pradesh', zone: 'North Central Railway (NCR)', popular: false },
  { id: 'jbp-jbp', code: 'JBP', name: 'Jabalpur Junction', city: 'Jabalpur', state: 'Madhya Pradesh', zone: 'West Central Railway (WCR)', popular: false },

  // Eastern & East Central / South Eastern / South East Central
  { id: 'kol-hwh', code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal', zone: 'Eastern Railway (ER)', popular: true },
  { id: 'kol-sdah', code: 'SDAH', name: 'Sealdah Railway Station', city: 'Kolkata', state: 'West Bengal', zone: 'Eastern Railway (ER)', popular: true },
  { id: 'kol-koaa', code: 'KOAA', name: 'Kolkata Terminal (Chitpur)', city: 'Kolkata', state: 'West Bengal', zone: 'Eastern Railway (ER)', popular: false },
  { id: 'ptn-pnbe', code: 'PNBE', name: 'Patna Junction', city: 'Patna', state: 'Bihar', zone: 'East Central Railway (ECR)', popular: true },
  { id: 'ptn-dnr', code: 'DNR', name: 'Danapur Railway Station', city: 'Danapur (Patna)', state: 'Bihar', zone: 'East Central Railway (ECR)', popular: true },
  { id: 'cpr-cpr', code: 'CPR', name: 'Chhapra Junction', city: 'Chhapra', state: 'Bihar', zone: 'North Eastern Railway (NER)', popular: true },
  { id: 'gkp-gkp', code: 'GKP', name: 'Gorakhpur Junction', city: 'Gorakhpur', state: 'Uttar Pradesh', zone: 'North Eastern Railway (NER)', popular: true },
  { id: 'gay-gaya', code: 'GAYA', name: 'Gaya Junction', city: 'Gaya', state: 'Bihar', zone: 'East Central Railway (ECR)', popular: false },
  { id: 'rnc-rnc', code: 'RNC', name: 'Ranchi Junction', city: 'Ranchi', state: 'Jharkhand', zone: 'South Eastern Railway (SER)', popular: true },
  { id: 'rnc-hte', code: 'HTE', name: 'Hatia Railway Station', city: 'Hatia (Ranchi)', state: 'Jharkhand', zone: 'South Eastern Railway (SER)', popular: true },
  { id: 'tat-tata', code: 'TATA', name: 'Tatanagar Junction (Jamshedpur)', city: 'Jamshedpur', state: 'Jharkhand', zone: 'South Eastern Railway (SER)', popular: true },
  { id: 'dhn-dhn', code: 'DHN', name: 'Dhanbad Junction', city: 'Dhanbad', state: 'Jharkhand', zone: 'East Central Railway (ECR)', popular: true },
  { id: 'bkc-bksc', code: 'BKSC', name: 'Bokaro Steel City', city: 'Bokaro', state: 'Jharkhand', zone: 'South Eastern Railway (SER)', popular: false },
  { id: 'asn-asn', code: 'ASN', name: 'Asansol Junction', city: 'Asansol', state: 'West Bengal', zone: 'Eastern Railway (ER)', popular: true },
  { id: 'rou-rou', code: 'ROU', name: 'Rourkela Junction', city: 'Rourkela', state: 'Odisha', zone: 'South Eastern Railway (SER)', popular: true },
  { id: 'jsg-jsg', code: 'JSG', name: 'Jharsuguda Junction', city: 'Jharsuguda', state: 'Odisha', zone: 'South East Central Railway (SECR)', popular: true },
  { id: 'drg-durg', code: 'DURG', name: 'Durg Junction', city: 'Durg', state: 'Chhattisgarh', zone: 'South East Central Railway (SECR)', popular: true },
  { id: 'rpr-r', code: 'R', name: 'Raipur Junction', city: 'Raipur', state: 'Chhattisgarh', zone: 'South East Central Railway (SECR)', popular: true },
  { id: 'bsp-bsp', code: 'BSP', name: 'Bilaspur Junction', city: 'Bilaspur', state: 'Chhattisgarh', zone: 'South East Central Railway (SECR)', popular: true },
  { id: 'rig-rig', code: 'RIG', name: 'Raigarh Railway Station', city: 'Raigarh', state: 'Chhattisgarh', zone: 'South East Central Railway (SECR)', popular: false },
  { id: 'ckp-ckp', code: 'CKP', name: 'Chakradharpur', city: 'Chakradharpur', state: 'Jharkhand', zone: 'South Eastern Railway (SER)', popular: false },
  { id: 'kte-kte', code: 'KTE', name: 'Katni Junction', city: 'Katni', state: 'Madhya Pradesh', zone: 'West Central Railway (WCR)', popular: false },
  { id: 'sta-sta', code: 'STA', name: 'Satna Junction', city: 'Satna', state: 'Madhya Pradesh', zone: 'West Central Railway (WCR)', popular: false },
  { id: 'sdl-sdl', code: 'SDL', name: 'Shahdol Railway Station', city: 'Shahdol', state: 'Madhya Pradesh', zone: 'South East Central Railway (SECR)', popular: false },
  { id: 'bxr-bxr', code: 'BXR', name: 'Buxar Railway Station', city: 'Buxar', state: 'Bihar', zone: 'East Central Railway (ECR)', popular: false },
  { id: 'ara-ara', code: 'ARA', name: 'Ara Junction', city: 'Ara', state: 'Bihar', zone: 'East Central Railway (ECR)', popular: false },
  { id: 'kiul-kiul', code: 'KIUL', name: 'Kiul Junction', city: 'Kiul', state: 'Bihar', zone: 'East Central Railway (ECR)', popular: false },
  { id: 'jsme-jsme', code: 'JSME', name: 'Jasidih Junction', city: 'Jasidih', state: 'Jharkhand', zone: 'Eastern Railway (ER)', popular: false },
  { id: 'bbs-bbs', code: 'BBS', name: 'Bhubaneswar Railway Station', city: 'Bhubaneswar', state: 'Odisha', zone: 'East Coast Railway (ECoR)', popular: true },
  { id: 'pur-puri', code: 'PURI', name: 'Puri Railway Station', city: 'Puri', state: 'Odisha', zone: 'East Coast Railway (ECoR)', popular: true },

  // Southern & South Central / South Western
  { id: 'chn-mas', code: 'MAS', name: 'MGR Chennai Central', city: 'Chennai', state: 'Tamil Nadu', zone: 'Southern Railway (SR)', popular: true },
  { id: 'chn-ms', code: 'MS', name: 'Chennai Egmore', city: 'Chennai', state: 'Tamil Nadu', zone: 'Southern Railway (SR)', popular: false },
  { id: 'blr-sbc', code: 'SBC', name: 'KSR Bengaluru City', city: 'Bengaluru', state: 'Karnataka', zone: 'South Western Railway (SWR)', popular: true },
  { id: 'blr-smvb', code: 'SMVB', name: 'Sir M. Visvesvaraya Terminal', city: 'Bengaluru', state: 'Karnataka', zone: 'South Western Railway (SWR)', popular: false },
  { id: 'hyd-sc', code: 'SC', name: 'Secunderabad Junction', city: 'Hyderabad', state: 'Telangana', zone: 'South Central Railway (SCR)', popular: true },
  { id: 'hyd-hyb', code: 'HYB', name: 'Hyderabad Deccan (Nampally)', city: 'Hyderabad', state: 'Telangana', zone: 'South Central Railway (SCR)', popular: false },
  { id: 'vsk-vskp', code: 'VSKP', name: 'Visakhapatnam Junction', city: 'Visakhapatnam', state: 'Andhra Pradesh', zone: 'East Coast Railway (ECoR)', popular: true },
  { id: 'vij-bza', code: 'BZA', name: 'Vijayawada Junction', city: 'Vijayawada', state: 'Andhra Pradesh', zone: 'South Central Railway (SCR)', popular: true },
  { id: 'tvc-tvc', code: 'TVC', name: 'Thiruvananthapuram Central', city: 'Thiruvananthapuram', state: 'Kerala', zone: 'Southern Railway (SR)', popular: true },
  { id: 'ers-ers', code: 'ERS', name: 'Ernakulam Junction (Kochi)', city: 'Kochi', state: 'Kerala', zone: 'Southern Railway (SR)', popular: true },
  { id: 'cbe-cbe', code: 'CBE', name: 'Coimbatore Junction', city: 'Coimbatore', state: 'Tamil Nadu', zone: 'Southern Railway (SR)', popular: true },
  { id: 'mdu-mdu', code: 'MDU', name: 'Madurai Junction', city: 'Madurai', state: 'Tamil Nadu', zone: 'Southern Railway (SR)', popular: false },
  { id: 'mys-mys', code: 'MYS', name: 'Mysuru Junction', city: 'Mysuru', state: 'Karnataka', zone: 'South Western Railway (SWR)', popular: true },
  { id: 'goa-mao', code: 'MAO', name: 'Madgaon Junction', city: 'Goa', state: 'Goa', zone: 'Konkan Railway (KR)', popular: true },

  // North-East Frontier
  { id: 'ghy-ghy', code: 'GHY', name: 'Guwahati Railway Station', city: 'Guwahati', state: 'Assam', zone: 'Northeast Frontier Railway (NFR)', popular: true },
  { id: 'njp-njp', code: 'NJP', name: 'New Jalpaiguri (Siliguri)', city: 'Siliguri', state: 'West Bengal', zone: 'Northeast Frontier Railway (NFR)', popular: true },
  { id: 'dbr-dbrg', code: 'DBRG', name: 'Dibrugarh Railway Station', city: 'Dibrugarh', state: 'Assam', zone: 'Northeast Frontier Railway (NFR)', popular: false },
];

// Helper to look up or dynamically resolve ANY station or city in India
export function findOrCreateStation(input: string): Station {
  const clean = input.trim();
  const lower = clean.toLowerCase();

  const found = STATIONS.find(
    (s) =>
      s.name.toLowerCase() === lower ||
      s.city.toLowerCase() === lower ||
      s.code.toLowerCase() === lower ||
      s.name.toLowerCase().includes(lower) ||
      lower.includes(s.city.toLowerCase())
  );

  if (found) return found;

  // Dynamically resolve custom station anywhere in India
  const guessedCode = clean.replace(/[^A-Za-z]/g, '').slice(0, 4).toUpperCase() || 'STN';
  return {
    id: `custom-${guessedCode.toLowerCase()}`,
    code: guessedCode,
    name: clean.includes('Station') || clean.includes('Junction') ? clean : `${clean} Railway Station`,
    city: clean.split(' ')[0],
    state: 'India',
    zone: 'Indian Railways (IRCTC)',
    popular: false,
  };
}

export const POPULAR_ROUTES: PopularRoute[] = [
  {
    id: 'route-ndls-bsb',
    fromStation: 'New Delhi Railway Station',
    fromCode: 'NDLS',
    toStation: 'Varanasi Junction (Cantt)',
    toCode: 'BSB',
    trainName: 'Vande Bharat Express',
    trainNumber: '22436',
    distance: '759 km',
    duration: '8h 00m',
    frequency: '6 Days a week (Except Thu)',
    startingPrice: 1750,
    currency: '₹',
    image: '/src/assets/images/vande_bharat_train_1790504178153.jpg',
    category: 'Vande Bharat Express',
    highlight: "India's first indigenous semi-high speed corridor connecting the capital to Kashi with onboard catering.",
  },
  {
    id: 'route-ndls-mmct',
    fromStation: 'New Delhi Railway Station',
    fromCode: 'NDLS',
    toStation: 'Mumbai Central',
    toCode: 'MMCT',
    trainName: 'Mumbai Tejas Rajdhani Express',
    trainNumber: '12952',
    distance: '1,386 km',
    duration: '15h 32m',
    frequency: 'Daily Express',
    startingPrice: 2280,
    currency: '₹',
    image: '/src/assets/images/vande_bharat_interior_1790506633999.jpg',
    category: 'Premier Tejas Rajdhani',
    highlight: 'Flagship overnight corridor with smart automatic plug doors, bio-vacuum toilets and chef-curated meals.',
  },
  {
    id: 'route-csmt-mao',
    fromStation: 'Chhatrapati Shivaji Maharaj Terminus',
    fromCode: 'CSMT',
    toStation: 'Madgaon Junction',
    toCode: 'MAO',
    trainName: 'Goa Vande Bharat Express',
    trainNumber: '22229',
    distance: '586 km',
    duration: '7h 45m',
    frequency: '6 Days a week (Except Fri)',
    startingPrice: 1815,
    currency: '₹',
    image: '/src/assets/images/konkan_scenic_rail_1790504207098.jpg',
    category: 'Scenic Coastal Line',
    highlight: 'Spectacular Konkan Railway journey through tunnels, viaducts, Western Ghats waterfalls and coastal bridges.',
  },
  {
    id: 'route-ndls-svdk',
    fromStation: 'New Delhi Railway Station',
    fromCode: 'NDLS',
    toStation: 'Shri Mata Vaishno Devi Katra',
    toCode: 'SVDK',
    trainName: 'Vande Bharat Express',
    trainNumber: '22439',
    distance: '655 km',
    duration: '8h 00m',
    frequency: '6 Days a week (Except Tue)',
    startingPrice: 1630,
    currency: '₹',
    image: '/src/assets/images/himalayan_express_train_1790506670145.jpg',
    category: 'Devotional Corridor',
    highlight: 'Rapid pilgrim transit from Delhi via Ambala, Ludhiana and Jammu Tawi directly to Katra foothills.',
  },
  {
    id: 'route-sbc-mas',
    fromStation: 'KSR Bengaluru City',
    fromCode: 'SBC',
    toStation: 'MGR Chennai Central',
    toCode: 'MAS',
    trainName: 'Chennai Vande Bharat Express',
    trainNumber: '20608',
    distance: '359 km',
    duration: '4h 25m',
    frequency: '6 Days a week (Except Wed)',
    startingPrice: 995,
    currency: '₹',
    image: '/src/assets/images/vande_bharat_train_1790504178153.jpg',
    category: 'Southern High-Speed',
    highlight: 'Rapid intercity corridor connecting India\'s premier IT capital to the cultural gateway of Tamil Nadu.',
  },
  {
    id: 'route-hwh-ndls',
    fromStation: 'Howrah Junction',
    fromCode: 'HWH',
    toStation: 'New Delhi Railway Station',
    toCode: 'NDLS',
    trainName: 'Howrah Rajdhani Express (via Gaya)',
    trainNumber: '12301',
    distance: '1,451 km',
    duration: '17h 05m',
    frequency: '6 Days a week (Except Sun)',
    startingPrice: 2420,
    currency: '₹',
    image: '/src/assets/images/mumbai_csmt_train_1790504192421.jpg',
    category: 'Golden Quadrilateral',
    highlight: "India's original Rajdhani connecting Kolkata to the national capital via Asansol, Dhanbad and Prayagraj.",
  },
  {
    id: 'route-durg-dnr-south-bihar',
    fromStation: 'Durg Junction',
    fromCode: 'DURG',
    toStation: 'Danapur Railway Station',
    toCode: 'DNR',
    trainName: 'South Bihar Express',
    trainNumber: '13287',
    distance: '1,145 km',
    duration: '23h 40m',
    frequency: 'Daily Express',
    startingPrice: 295,
    currency: '₹',
    image: '/src/assets/images/mumbai_csmt_train_1790504192421.jpg',
    category: 'Historic Regional Express',
    highlight: 'Connecting Chhattisgarh, Jharkhand & Bihar via Raipur, Bilaspur, Rourkela, Tatanagar, Asansol & Kiul.',
  },
  {
    id: 'route-cpr-durg-sarnath',
    fromStation: 'Chhapra Junction',
    fromCode: 'CPR',
    toStation: 'Durg Junction',
    toCode: 'DURG',
    trainName: 'Sarnath Express (via Varanasi & Katni)',
    trainNumber: '15159',
    distance: '1,018 km',
    duration: '23h 55m',
    frequency: 'Daily Express',
    startingPrice: 275,
    currency: '₹',
    image: '/src/assets/images/himalayan_express_train_1790506670145.jpg',
    category: 'Spiritual Cross-State Line',
    highlight: 'Beloved pilgrimage express connecting the holy shrine of Sarnath & Kashi to central India & Chhattisgarh.',
  },
  {
    id: 'route-durg-hte-express',
    fromStation: 'Durg Junction',
    fromCode: 'DURG',
    toStation: 'Hatia Railway Station',
    toCode: 'HTE',
    trainName: 'Durg - Hatia Express (via Rourkela)',
    trainNumber: '18186',
    distance: '628 km',
    duration: '10h 55m',
    frequency: 'Daily Overnight',
    startingPrice: 195,
    currency: '₹',
    image: '/src/assets/images/konkan_scenic_rail_1790504207098.jpg',
    category: 'Mineral & Tribal Belt Line',
    highlight: 'Key overnight connection linking Bhilai steel city to Hatia/Ranchi through the Chota Nagpur plateau.',
  },
];

// Initial Seed Bookings
export const INITIAL_BOOKINGS: BookingTicket[] = [
  {
    pnr: '284-9201843',
    trainNumber: '22436',
    trainName: 'New Delhi - Varanasi Vande Bharat Express',
    fromStation: 'New Delhi Railway Station',
    fromCode: 'NDLS',
    toStation: 'Varanasi Junction (Cantt)',
    toCode: 'BSB',
    departureTime: '06:00',
    arrivalTime: '14:00',
    travelDate: 'Tomorrow, Oct 12',
    passengerName: 'Masuma Akhtar',
    quota: 'General',
    seatClass: 'Executive Chair Car (EC)',
    coach: 'E1',
    seatNumber: '18',
    berthType: 'Window (Rotatable 180°)',
    totalPaid: 3350,
    status: 'Chart Prepared',
    platform: 'Platform 16 (Ajmeri Gate Entry)',
    bookingTime: 'Today at 08:30 AM',
  },
  {
    pnr: '451-8392011',
    trainNumber: '12952',
    trainName: 'New Delhi - Mumbai Central Tejas Rajdhani',
    fromStation: 'New Delhi Railway Station',
    fromCode: 'NDLS',
    toStation: 'Mumbai Central',
    toCode: 'MMCT',
    departureTime: '16:55',
    arrivalTime: '08:35',
    travelDate: 'Friday, Oct 16',
    passengerName: 'Masuma Akhtar',
    quota: 'General',
    seatClass: 'AC 3 Tier (3A)',
    coach: 'B4',
    seatNumber: '27',
    berthType: 'Lower Berth (LB)',
    totalPaid: 2310,
    status: 'Confirmed',
    platform: 'Platform 1',
    bookingTime: 'Yesterday at 02:15 PM',
  },
];

// Initial PNR Search History with Timeline Milestones
export const INITIAL_PNR_HISTORY: PnrHistoryItem[] = [
  {
    id: 'pnr-hist-1',
    pnr: '2849201843',
    trainNumber: '22436',
    trainName: 'New Delhi - Varanasi Vande Bharat Express',
    fromStation: 'New Delhi (NDLS)',
    toStation: 'Varanasi Junction (BSB)',
    journeyDate: 'Tomorrow, Oct 12',
    bookingStatus: 'CNF (Confirmed)',
    coach: 'E1',
    berth: 'Seat 18 (Window)',
    classType: 'Executive Chair Car (EC)',
    chartStatus: 'Chart Prepared at New Delhi',
    currentSpeed: '128 km/h',
    currentStation: 'Approaching Kanpur Central (Platform 1 allocated)',
    eta: 'Today, 1:58 PM (2 mins early)',
    checkedAt: '10:45 AM, Today',
    timeline: [
      {
        step: 1,
        title: 'Booking Confirmed (IRCTC PRS)',
        description: 'Ticket confirmed with Executive Chair Car quota. Transaction verified via UPI.',
        time: '24 Sep, 10:30 AM',
        completed: true,
        badge: 'CONFIRMED',
      },
      {
        step: 2,
        title: 'Chart Preparation at NDLS',
        description: 'Final chart finalized at originating station. Coach E1, Berth 18 allocated.',
        time: 'Today, 04:00 AM',
        completed: true,
        badge: 'CHART PREPARED',
      },
      {
        step: 3,
        title: 'Departed New Delhi (NDLS)',
        description: 'Punctual departure from Platform 16 (Ajmeri Gate). Trajectory clear.',
        time: 'Today, 06:00 AM',
        completed: true,
        badge: 'ON-TIME DEPARTURE',
      },
      {
        step: 4,
        title: 'Passed Kanpur Central Outer',
        description: 'Cruising at 128 km/h on dedicated electrified mainline track. Signal green.',
        time: 'Today, 10:14 AM',
        completed: true,
        badge: 'LIVE SATELLITE GPS',
      },
      {
        step: 5,
        title: 'Varanasi Junction Arrival (BSB)',
        description: 'Scheduled arrival at Platform 1. Auto/Metro transport connectivity available.',
        time: 'Today, 02:00 PM',
        completed: false,
        badge: 'ESTIMATED 13:58',
      },
    ],
  },
  {
    id: 'pnr-hist-2',
    pnr: '4518392011',
    trainNumber: '12952',
    trainName: 'New Delhi - Mumbai Central Tejas Rajdhani',
    fromStation: 'New Delhi (NDLS)',
    toStation: 'Mumbai Central (MMCT)',
    journeyDate: 'Friday, Oct 16',
    bookingStatus: 'CNF (Confirmed)',
    coach: 'B4',
    berth: 'Seat 27 (Lower Berth)',
    classType: 'AC 3 Tier (3A)',
    chartStatus: 'Chart Not Prepared (Will prepare 4h before departure)',
    currentSpeed: '0 km/h (Station Yard)',
    currentStation: 'NDLS Maintenance Yard',
    eta: 'Oct 17, 08:35 AM',
    checkedAt: 'Yesterday, 04:20 PM',
    timeline: [
      {
        step: 1,
        title: 'Ticket Booked & Confirmed',
        description: 'Confirmed berth in Coach B4. PNR valid for travel.',
        time: '26 Sep, 02:15 PM',
        completed: true,
        badge: 'CONFIRMED',
      },
      {
        step: 2,
        title: 'Chart Preparation',
        description: 'Chart will be published 4 hours prior to scheduled departure.',
        time: 'Expected Oct 16, 12:55 PM',
        completed: false,
        badge: 'SCHEDULED',
      },
      {
        step: 3,
        title: 'Platform Allocation & Boarding',
        description: 'Allocated to Platform 1 at New Delhi Railway Station.',
        time: 'Expected Oct 16, 04:15 PM',
        completed: false,
        badge: 'UPCOMING',
      },
      {
        step: 4,
        title: 'Journey In-Transit',
        description: 'High-speed overnight Rajdhani via Kota, Vadodara, and Surat.',
        time: 'Oct 16 - 17',
        completed: false,
        badge: 'OVERNIGHT',
      },
      {
        step: 5,
        title: 'Arrival at Mumbai Central',
        description: 'Terminus platform arrival with direct Western Suburban local link.',
        time: 'Oct 17, 08:35 AM',
        completed: false,
        badge: 'DESTINATION',
      },
    ],
  },
];

// Food on Train (IRCTC e-Catering) Menu Items
export const FOOD_ITEMS: FoodItem[] = [
  {
    id: 'food-thali-royal',
    name: 'IRCTC Maharaja Deluxe Veg Thali',
    description: 'Shahi Paneer, Dal Makhani, Mixed Vegetable, Jeera Pulao, 3 Butter Rotis, Cucumber Raita, Gulab Jamun',
    price: 220,
    category: 'Thali & Meals',
    veg: true,
    rating: 4.8,
    prepTime: '25 mins',
    vendor: 'IRCTC Food Plaza (ISO Certified)',
    image: '/src/assets/images/indian_railway_food_1790506654544.jpg',
  },
  {
    id: 'food-biryani-hyderabadi',
    name: 'Nawabi Dum Biryani with Mirchi ka Salan',
    description: 'Long grain dum-cooked basmati rice with aromatic Indian spices, served with fresh boondi raita & salan',
    price: 240,
    category: 'Rice & Biryani',
    veg: false,
    rating: 4.9,
    prepTime: '20 mins',
    vendor: 'Behrouz / Comesum Partner',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'food-breakfast-south',
    name: 'Dakshin Express South Indian Breakfast',
    description: '3 Steaming Ghee Idlis, Crispy Medu Vada, piping hot Vegetable Sambar & fresh Coconut Chutney',
    price: 130,
    category: 'Breakfast',
    veg: true,
    rating: 4.7,
    prepTime: '15 mins',
    vendor: 'Saravana Bhavan / Jan Ahaar',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'food-jain-sattvic',
    name: 'Pure Jain Sattvic Deluxe Meal',
    description: 'Prepared strictly without onion or garlic. Paneer bhurji, yellow dal tadka, steamed basmati rice & phulkas',
    price: 195,
    category: 'Jain Food',
    veg: true,
    rating: 4.9,
    prepTime: '30 mins',
    vendor: 'Shuddh Sattva Kitchens',
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'food-chai-samosa',
    name: 'Railway Special Kulhad Chai & Samosa Duo',
    description: '2 Crispy Punjabi Aloo Samosas served with tangy tamarind chutney and piping hot ginger-cardamom Kulhad Chai',
    price: 65,
    category: 'Snacks & Beverages',
    veg: true,
    rating: 4.8,
    prepTime: '10 mins',
    vendor: 'Chai Point / Rail Cafe',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'food-haldiram-snack',
    name: 'Haldirams Snack Box & Rail Neer (1L)',
    description: 'Assorted namkeen mix, Dhokla bites, Kaju Katli (2 pcs) and packaged chilled mineral water',
    price: 110,
    category: 'Snacks & Beverages',
    veg: true,
    rating: 4.6,
    prepTime: '5 mins',
    vendor: "Haldiram's Certified Station Outlet",
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
  },
];

// Initial Seed Food Orders
export const INITIAL_FOOD_ORDERS: FoodOrder[] = [
  {
    id: 'order-101',
    pnr: '284-9201843',
    trainNumber: '22436',
    trainName: 'Vande Bharat Express',
    coach: 'E1',
    seat: '18',
    deliveryStation: 'Kanpur Central (CNB)',
    itemName: 'IRCTC Maharaja Deluxe Veg Thali',
    quantity: 1,
    totalPrice: 220,
    paymentMethod: 'UPI / Prepaid',
    orderStatus: 'Out for Berth Delivery',
    orderedAt: '09:15 AM, Today',
    estimatedDelivery: 'At Kanpur Central (Platform 1, 10:08 AM)',
  },
];

// Indian Railways 139 RailMadad Official Emergency Registry
export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    service: 'RailMadad 24x7 Single Helpline',
    number: '139',
    category: 'All-in-One Railway Helpline',
    description: 'National helpline for medical emergencies, security, grievances, inquiry, and real-time train updates',
    type: 'Toll-Free Helpline',
    available: '24x7 Realtime',
  },
  {
    service: 'RPF (Railway Protection Force) Security SOS',
    number: '182 / 139',
    category: 'Security & Anti-Theft',
    description: 'Immediate armed escort assistance, prevention of crime, theft alerts, and women safety squads on train',
    type: 'Security Police',
    available: '24x7 Realtime',
  },
  {
    service: 'Onboard Medical Emergency & Doctor',
    number: '139 (Option 1)',
    category: 'Medical Urgent Care',
    description: 'Immediate doctor attending at next scheduled halt, basic first aid box available with Train Superintendent',
    type: 'Medical Ambulance',
    available: '24x7 Realtime',
  },
  {
    service: 'Women In Distress Special Helpline',
    number: '1091 / 139',
    category: 'Women Passenger Safety',
    description: 'Direct alert to Meri Saheli railway security taskforce traveling on express trains',
    type: 'Women Safety',
    available: '24x7 Realtime',
  },
  {
    service: 'Coach Maintenance / Clean My Coach',
    number: 'SMS CLEAN <PNR> to 58888',
    category: 'Amenities & Watering',
    description: 'OBHS (Onboard Housekeeping Service) for emergency coach cleaning, water tank refill, and AC cooling issues',
    type: 'Coach Care',
    available: 'During Train Journey',
  },
];

// Area Scenarios along Indian Railway Routes & Corridors
export const AREA_SCENARIOS: AreaScenario[] = [
  // Varanasi & Holy Ganges Corridor
  {
    id: 'scen-varanasi-ganga-bridge',
    areaId: 'varanasi-ganga',
    areaName: 'Varanasi & Holy Ganges Corridor',
    region: 'Eastern UP & Bihar',
    title: 'River Ganga Sunrise Malviya Bridge Crossing',
    category: 'Scenic Vista',
    description: 'As your train rolls onto the historic double-decker Malviya bridge, the morning sun lights up holy bathing ghats, boatmen, and ancient temple spires across the sacred Ganges.',
    bestWindowSide: 'Right Window',
    timingHighlight: '06:15 AM - 07:00 AM (Dawn & Early Morning)',
    weatherTip: 'Clear golden lighting in autumn/spring; ethereal morning mist during winter.',
    keyStations: ['Varanasi Junction (Cantt)', 'Pt. Deen Dayal Upadhyaya Jn', 'Prayagraj Junction (Allahabad)'],
    iconType: 'water',
  },
  {
    id: 'scen-varanasi-kachori-halt',
    areaId: 'varanasi-ganga',
    areaName: 'Varanasi & Holy Ganges Corridor',
    region: 'Eastern UP',
    title: 'Banarasi Crispy Kachori & Kesar Jalebi Station Halt',
    category: 'Station Food',
    description: 'Platform 1 & 2 refreshment rooms serve piping hot hing kachoris with spiced potato curry and golden saffron jalebis on leaf plates during morning halts.',
    bestWindowSide: 'Left Window',
    timingHighlight: '07:30 AM - 10:30 AM (Breakfast hours)',
    keyStations: ['Varanasi Junction (Cantt)', 'Pt. Deen Dayal Upadhyaya Jn'],
    iconType: 'food',
  },
  {
    id: 'scen-varanasi-fog-advisory',
    areaId: 'varanasi-ganga',
    areaName: 'Varanasi & Holy Ganges Corridor',
    region: 'Northern & Eastern Plains',
    title: 'Northern Winter Fog Advisory & GPS Headlight Running',
    category: 'Weather & Monsoon',
    description: 'Thick radiation fog covers the agricultural plains of Uttar Pradesh in Dec-Jan. Trains activate GPS-based Fog PASS devices and high-intensity LED cab signals for safety.',
    bestWindowSide: 'Both Sides',
    timingHighlight: '05:00 AM - 09:30 AM (Winter December to January)',
    weatherTip: 'Dress in thermal layers inside coach; delays may occur during dense fog.',
    keyStations: ['Varanasi Junction (Cantt)', 'Kanpur Central', 'Prayagraj Junction (Allahabad)'],
    iconType: 'cloud',
  },

  // Mumbai & Western Ghats Corridor
  {
    id: 'scen-mumbai-bhor-ghat',
    areaId: 'mumbai-ghats',
    areaName: 'Mumbai & Western Ghats Corridor',
    region: 'Maharashtra & Konkan',
    title: 'Bhor Ghat Incline & Waterfall Gorges',
    category: 'Scenic Vista',
    description: 'Twin banker electric locomotives attach at Karjat to push your train up a steep 1:37 cliff gradient through 28 tunnels and cascading emerald green monsoon canyons towards Lonavala.',
    bestWindowSide: 'Left Window',
    timingHighlight: '09:00 AM - 05:00 PM (Daylight run for gorge depth)',
    weatherTip: 'Spectacular raging waterfalls and cloud ceilings during July-September monsoon.',
    keyStations: ['Chhatrapati Shivaji Maharaj Terminus', 'Mumbai Central', 'Pune Junction'],
    iconType: 'mountain',
  },
  {
    id: 'scen-mumbai-lonavala-chikki',
    areaId: 'mumbai-ghats',
    areaName: 'Mumbai & Western Ghats Corridor',
    region: 'Western Ghats',
    title: 'Lonavala Fresh Cashew Chikki & Walnut Fudge Halt',
    category: 'Station Food',
    description: '3-minute train halt at Lonavala station allows travelers to grab freshly boxed peanut, cashew, and crushed til chikki from iconic vendors along the platform.',
    bestWindowSide: 'Both Sides',
    timingHighlight: 'Available 24/7 on Platform 1 & 2',
    keyStations: ['Chhatrapati Shivaji Maharaj Terminus', 'Pune Junction'],
    iconType: 'food',
  },

  // Goa & Konkan Coastal Route
  {
    id: 'scen-goa-dudhsagar-spray',
    areaId: 'goa-konkan',
    areaName: 'Goa & Konkan Coastal Route',
    region: 'Goa & Karnataka Border',
    title: 'Dudhsagar Waterfalls Viaduct Misty Spray',
    category: 'Scenic Vista',
    description: 'As the train rolls across the curving stone viaduct between Castle Rock and Kulem, the thunderous 310m white cascade sprays refreshing cool water mist against coach windowpanes.',
    bestWindowSide: 'Left Window',
    timingHighlight: '11:00 AM - 03:00 PM (Prime daylight visibility)',
    weatherTip: 'Peak monsoon flow in July-October creates a roaring cloud of white water droplets.',
    keyStations: ['Madgaon Junction', 'Ratnagiri'],
    iconType: 'water',
  },
  {
    id: 'scen-goa-river-estuaries',
    areaId: 'goa-konkan',
    areaName: 'Goa & Konkan Coastal Route',
    region: 'Konkan Coastline',
    title: 'Arabian Sea Tidal River Estuaries & Coconut Grooves',
    category: 'Scenic Vista',
    description: 'Long railway bridges span tidal creeks with colorful local fishing trawlers, backwater houseboats, and swaying emerald coconut palms stretching to the horizon.',
    bestWindowSide: 'Right Window',
    timingHighlight: 'Golden Hour (04:30 PM - 06:15 PM)',
    keyStations: ['Madgaon Junction', 'Ratnagiri'],
    iconType: 'sun',
  },

  // Delhi NCR & Yamuna Plains
  {
    id: 'scen-delhi-highspeed-kavach',
    areaId: 'delhi-agra',
    areaName: 'Delhi NCR & Yamuna Plains',
    region: 'National Capital Region & UP',
    title: '160 km/h High-Speed KAVACH Corridor Run',
    category: 'Transit Connection',
    description: 'Vande Bharat and Gatimaan Express sprint along the fenced New Delhi to Agra corridor touching 160 km/h with automatic Indian Railways KAVACH train collision prevention system.',
    bestWindowSide: 'Both Sides',
    timingHighlight: 'Morning 06:00 AM - 08:30 AM & Evening runs',
    keyStations: ['New Delhi Railway Station', 'Hazrat Nizamuddin', 'Agra Cantt'],
    iconType: 'sun',
  },
  {
    id: 'scen-delhi-mathura-peda',
    areaId: 'delhi-agra',
    areaName: 'Delhi NCR & Yamuna Plains',
    region: 'Braj Bhoomi',
    title: 'Mathura Junction Authentic Khoya Peda Rush',
    category: 'Station Food',
    description: 'During the 5-minute halt at Mathura Junction, certified IRCTC vendors rush boxes of roasted khoya and cardamom pedas made from fresh local buffalo milk.',
    bestWindowSide: 'Left Window',
    timingHighlight: 'All express trains halting at Mathura',
    keyStations: ['New Delhi Railway Station', 'Agra Cantt'],
    iconType: 'food',
  },
  {
    id: 'scen-delhi-airport-metro-link',
    areaId: 'delhi-agra',
    areaName: 'Delhi NCR & Yamuna Plains',
    region: 'Delhi Transit',
    title: 'Direct Airport Express Metro Interchange at NDLS',
    category: 'Transit Connection',
    description: 'Exit from Ajmeri Gate (Platform 16) directly via air-conditioned skywalk into the Delhi Airport Express Metro line — reach Indira Gandhi International Airport Terminal 3 in just 19 minutes.',
    bestWindowSide: 'Both Sides',
    timingHighlight: 'Metro runs every 10 mins from 04:45 AM to 11:30 PM',
    keyStations: ['New Delhi Railway Station'],
    iconType: 'temple',
  },

  // Rajasthan Royal Heritage Corridor
  {
    id: 'scen-rajasthan-thar-sunset',
    areaId: 'rajasthan-royal',
    areaName: 'Rajasthan Royal Heritage Corridor',
    region: 'Rajasthan Desert',
    title: 'Thar Desert Golden Hour Sunset & Camel Silhouettes',
    category: 'Scenic Vista',
    description: 'Watch rolling yellow sand dunes, ancient havelis, and desert acacia trees glow incandescent copper as twilight descends over western Rajasthan.',
    bestWindowSide: 'Right Window',
    timingHighlight: '05:45 PM - 06:45 PM (Sunset)',
    weatherTip: 'Chilly desert breeze at night; crisp dry afternoon air.',
    keyStations: ['Jaipur Junction', 'Jodhpur Junction'],
    iconType: 'sun',
  },
  {
    id: 'scen-rajasthan-mirchi-vada',
    areaId: 'rajasthan-royal',
    areaName: 'Rajasthan Royal Heritage Corridor',
    region: 'Marwar',
    title: 'Spicy Marwari Mirchi Vada & Pyaaz Kachori Stall',
    category: 'Station Food',
    description: 'Famous jumbo Bhavnagri green chillies stuffed with seasoned spiced potatoes, batter fried golden crisp, and served with tamarind chutney on Platform 1.',
    bestWindowSide: 'Left Window',
    timingHighlight: 'Afternoon & Evening tea time',
    keyStations: ['Jaipur Junction', 'Jodhpur Junction'],
    iconType: 'food',
  },

  // Himalayan Foothills & Kashmir Rail
  {
    id: 'scen-himalaya-kashmir-gorges',
    areaId: 'himalaya-kashmir',
    areaName: 'Himalayan Foothills & Kashmir Rail',
    region: 'Jammu & Kashmir / Himachal',
    title: 'Chenab Bridge & Pine-Clad Shivalik Switchbacks',
    category: 'Scenic Vista',
    description: 'Traversing the world’s highest railway arch bridge soaring 359m above the turquoise Chenab riverbed with snowcapped Pir Panjal peaks framing the coaches.',
    bestWindowSide: 'Left Window',
    timingHighlight: '10:00 AM - 02:00 PM (Bright mountain sunlight)',
    weatherTip: 'Sub-zero temperatures and snow blankets in December to February.',
    keyStations: ['Shri Mata Vaishno Devi Katra', 'Jammu Tawi', 'Dehradun Railway Station'],
    iconType: 'mountain',
  },

  // Kolkata & Eastern Corridors
  {
    id: 'scen-kolkata-hooghly-wharf',
    areaId: 'kolkata-east',
    areaName: 'Kolkata & Eastern Corridors',
    region: 'Bengal Delta',
    title: 'Hooghly River & 23-Platform Terminus Panorama',
    category: 'Cultural Window',
    description: 'Arrive at India’s largest historic terminus with its imposing red-brick colonial facade, yellow ambassador taxi ranks, and passenger steam ferries crossing the Hooghly.',
    bestWindowSide: 'Right Window',
    timingHighlight: 'Morning & Dusk illuminated view',
    keyStations: ['Howrah Junction', 'Sealdah'],
    iconType: 'water',
  },
  {
    id: 'scen-kolkata-kullhad-chai',
    areaId: 'kolkata-east',
    areaName: 'Kolkata & Eastern Corridors',
    region: 'Bengal',
    title: 'Fresh Clay Bhar (Kullhad) Chai & Warm Chena Sandesh',
    category: 'Station Food',
    description: 'Traditional earthen pot tea brewed with crushed ginger and green cardamom, accompanied by fresh melt-in-mouth cottage cheese sandesh on Platform 8-9.',
    bestWindowSide: 'Left Window',
    timingHighlight: '06:00 AM - 11:00 PM',
    keyStations: ['Howrah Junction', 'Sealdah'],
    iconType: 'food',
  },

  // Bengaluru & South Deccan Corridor
  {
    id: 'scen-south-filter-coffee',
    areaId: 'bengaluru-south',
    areaName: 'Bengaluru & South Deccan Corridor',
    region: 'Karnataka & Tamil Nadu',
    title: 'Aromatic Brass-Tumbler Kumbakonam Filter Coffee',
    category: 'Station Food',
    description: 'Chicory-infused freshly brewed South Indian filter coffee frothed to creamy perfection in traditional brass dabarahs by traveling onboard catering servers.',
    bestWindowSide: 'Both Sides',
    timingHighlight: '06:30 AM - 10:00 AM & 04:00 PM - 06:30 PM',
    keyStations: ['KSR Bengaluru (City)', 'MGR Chennai Central', 'Mysuru Junction'],
    iconType: 'food',
  },
];

// Curated Famous Scenic Places, Attractions & Landmarks along Indian Railway Routes
export const SCENIC_PLACES: ScenicPlace[] = [
  {
    id: 'place-kashi-vishwanath',
    name: 'Shri Kashi Vishwanath Temple & Ganga Corridor',
    cityName: 'Varanasi',
    state: 'Uttar Pradesh',
    nearestStation: 'Varanasi Junction Cantt',
    nearestStationCode: 'BSB',
    distanceFromStation: '4.5 km',
    category: 'Spiritual & Ghats',
    rating: 4.9,
    bestTimeToVisit: 'Early morning or evening Aarti (Oct - Mar)',
    description: 'Sacred golden-spired Jyotirlinga shrine connected directly to the holy Ganges with modern riverfront corridors.',
    imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
    corridors: ['NDLS-BSB', 'HWH-NDLS', 'BSB-DDU'],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kashi+Vishwanath+Temple+Varanasi',
  },
  {
    id: 'place-dashashwamedh-ghat',
    name: 'Dashashwamedh Ghat & Maha Ganga Aarti',
    cityName: 'Varanasi',
    state: 'Uttar Pradesh',
    nearestStation: 'Varanasi Junction Cantt',
    nearestStationCode: 'BSB',
    distanceFromStation: '4.8 km',
    category: 'Spiritual & Ghats',
    rating: 4.9,
    bestTimeToVisit: '6:30 PM for grand evening synchronized Aarti ceremony',
    description: 'The spectacular spiritual heart of Varanasi with blazing brass lamps, conch shells, and evening boat rides on the Ganges.',
    imageUrl: 'https://images.unsplash.com/photo-1598977123418-35f557000000?auto=format&fit=crop&w=600&q=80',
    corridors: ['NDLS-BSB', 'HWH-NDLS'],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Dashashwamedh+Ghat+Varanasi',
  },
  {
    id: 'place-gateway-of-india',
    name: 'Gateway of India & Taj Mahal Palace',
    cityName: 'Mumbai',
    state: 'Maharashtra',
    nearestStation: 'Chhatrapati Shivaji Maharaj Terminus',
    nearestStationCode: 'CSMT',
    distanceFromStation: '3.1 km',
    category: 'Iconic Landmark',
    rating: 4.8,
    bestTimeToVisit: 'Sunrise or sunset overlooking Mumbai Harbor',
    description: 'Grand Indo-Saracenic arch overlooking the Arabian Sea, standing opposite the legendary heritage Taj hotel.',
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80',
    corridors: ['NDLS-MMCT', 'CSMT-MAO', 'PUNE-CSMT'],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Gateway+of+India+Mumbai',
  },
  {
    id: 'place-marine-drive',
    name: 'Marine Drive & Queens Necklace',
    cityName: 'Mumbai',
    state: 'Maharashtra',
    nearestStation: 'Mumbai Central / Churchgate',
    nearestStationCode: 'MMCT',
    distanceFromStation: '3.8 km',
    category: 'Nature & Waterfalls',
    rating: 4.8,
    bestTimeToVisit: 'Evenings for sea breeze and panoramic city night skyline',
    description: '3.6 km arc along the Arabian Sea curving from Nariman Point to Girgaon Chowpatty with cooling sea waves.',
    imageUrl: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=600&q=80',
    corridors: ['NDLS-MMCT', 'CSMT-MAO'],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Marine+Drive+Mumbai',
  },
  {
    id: 'place-dudhsagar-falls',
    name: 'Dudhsagar Waterfalls (Konkan Rail Bridge View)',
    cityName: 'Goa / Karnataka Border',
    state: 'Goa',
    nearestStation: 'Madgaon Junction / Castle Rock',
    nearestStationCode: 'MAO',
    distanceFromStation: '45 km (Viewable directly from train track)',
    category: 'Nature & Waterfalls',
    rating: 4.9,
    bestTimeToVisit: 'Monsoon and Post-Monsoon (July to November)',
    description: 'Spectacular 310m four-tiered waterfall cascading under the famous railway viaduct directly visible from train windows.',
    imageUrl: '/src/assets/images/konkan_scenic_rail_1790504207098.jpg',
    corridors: ['CSMT-MAO'],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Dudhsagar+Falls+Goa',
  },
  {
    id: 'place-vaishno-devi',
    name: 'Shri Mata Vaishno Devi Shrine & Trikuta Hills',
    cityName: 'Katra',
    state: 'Jammu & Kashmir',
    nearestStation: 'Shri Mata Vaishno Devi Katra',
    nearestStationCode: 'SVDK',
    distanceFromStation: '1.5 km to base camp Ban Ganga',
    category: 'Spiritual & Ghats',
    rating: 5.0,
    bestTimeToVisit: 'Year-round spiritual pilgrimage (March - October)',
    description: 'Holy cave shrine nestled at 5,200 ft amidst the pine-clad peaks of the Shivalik and Trikuta mountain range.',
    imageUrl: '/src/assets/images/himalayan_express_train_1790506670145.jpg',
    corridors: ['NDLS-SVDK'],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Vaishno+Devi+Katra',
  },
  {
    id: 'place-taj-mahal',
    name: 'Taj Mahal (UNESCO World Heritage Site)',
    cityName: 'Agra',
    state: 'Uttar Pradesh',
    nearestStation: 'Agra Cantt',
    nearestStationCode: 'AGC',
    distanceFromStation: '5.2 km',
    category: 'Architectural Marvel',
    rating: 4.9,
    bestTimeToVisit: 'Sunrise for stunning white marble radiance',
    description: 'Immense ivory-white marble mausoleum on the right bank of the Yamuna River, one of the Seven Wonders of the World.',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80',
    corridors: ['NDLS-BSB', 'NDLS-MMCT'],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Taj+Mahal+Agra',
  },
  {
    id: 'place-howrah-bridge',
    name: 'Howrah Bridge (Rabindra Setu) & Hooghly Ghats',
    cityName: 'Kolkata',
    state: 'West Bengal',
    nearestStation: 'Howrah Junction',
    nearestStationCode: 'HWH',
    distanceFromStation: '0.4 km (Right outside station concourse)',
    category: 'Iconic Landmark',
    rating: 4.7,
    bestTimeToVisit: 'Dawn or night when illuminated across the Hooghly River',
    description: 'World-famous balanced cantilever steel suspension bridge carrying over 100,000 vehicles and millions of commuters daily.',
    imageUrl: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=600&q=80',
    corridors: ['HWH-NDLS'],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Howrah+Bridge+Kolkata',
  },
  {
    id: 'place-victoria-memorial',
    name: 'Victoria Memorial Hall & Maidan',
    cityName: 'Kolkata',
    state: 'West Bengal',
    nearestStation: 'Howrah Junction / Sealdah',
    nearestStationCode: 'HWH',
    distanceFromStation: '5.8 km',
    category: 'Heritage & Forts',
    rating: 4.8,
    bestTimeToVisit: 'Afternoon & evening garden strolls',
    description: 'Opulent white Makrana marble monument surrounded by lush 64-acre gardens, galleries, and colonial museums.',
    imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010f443831b?auto=format&fit=crop&w=600&q=80',
    corridors: ['HWH-NDLS'],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Victoria+Memorial+Kolkata',
  },
  {
    id: 'place-india-gate',
    name: 'India Gate & Kartavya Path',
    cityName: 'New Delhi',
    state: 'Delhi',
    nearestStation: 'New Delhi Railway Station',
    nearestStationCode: 'NDLS',
    distanceFromStation: '4.2 km',
    category: 'Iconic Landmark',
    rating: 4.8,
    bestTimeToVisit: 'Evenings for lighted fountains and street ice creams',
    description: 'Majestic 42m triumphal stone arch war memorial commemorating Indian soldiers, surrounded by lawns and water bodies.',
    imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80',
    corridors: ['NDLS-BSB', 'NDLS-MMCT', 'HWH-NDLS', 'NDLS-SVDK'],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=India+Gate+New+Delhi',
  },
  {
    id: 'place-red-fort',
    name: 'Red Fort (Lal Qila) & Chandni Chowk',
    cityName: 'Delhi',
    state: 'Delhi',
    nearestStation: 'Old Delhi (DLI) / New Delhi (NDLS)',
    nearestStationCode: 'DLI',
    distanceFromStation: '1.8 km from Old Delhi Station',
    category: 'Heritage & Forts',
    rating: 4.7,
    bestTimeToVisit: 'Mornings (9 AM - 12 PM)',
    description: 'Massive Mughal red sandstone fortress with grand Diwan-i-Aam and historic bazaar streets serving Banarasi street food.',
    imageUrl: 'https://images.unsplash.com/photo-1592635196078-9fe3d54f2377?auto=format&fit=crop&w=600&q=80',
    corridors: ['NDLS-BSB', 'NDLS-MMCT'],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Red+Fort+Delhi',
  },
  {
    id: 'place-mysore-palace',
    name: 'Mysuru Royal Palace (Amba Vilas)',
    cityName: 'Mysuru',
    state: 'Karnataka',
    nearestStation: 'Mysuru Junction',
    nearestStationCode: 'MYS',
    distanceFromStation: '2.0 km',
    category: 'Heritage & Forts',
    rating: 4.9,
    bestTimeToVisit: 'Sunday evening 7 PM for 100,000 bulb illumination',
    description: 'Breathtaking Indo-Saracenic royal palace with stained glass ceilings, carved rosewood doors, and golden royal throne.',
    imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010f443831b?auto=format&fit=crop&w=600&q=80',
    corridors: ['SBC-MAS'],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mysore+Palace',
  },
  {
    id: 'place-hawa-mahal',
    name: 'Hawa Mahal & Amer Fort',
    cityName: 'Jaipur',
    state: 'Rajasthan',
    nearestStation: 'Jaipur Junction',
    nearestStationCode: 'JP',
    distanceFromStation: '4.8 km',
    category: 'Heritage & Forts',
    rating: 4.8,
    bestTimeToVisit: 'Early morning sunrise on the pink honeycomb facade',
    description: 'Iconic five-story pink sandstone palace with 953 jharokhas designed for royal ladies to view city festivals in privacy.',
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
    corridors: ['NDLS-MMCT'],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Hawa+Mahal+Jaipur',
  },
  {
    id: 'place-golden-temple',
    name: 'Sri Harmandir Sahib (Golden Temple) & Wagah Border',
    cityName: 'Amritsar',
    state: 'Punjab',
    nearestStation: 'Amritsar Junction',
    nearestStationCode: 'ASR',
    distanceFromStation: '2.3 km (Free SGPC electric shuttle available)',
    category: 'Spiritual & Ghats',
    rating: 5.0,
    bestTimeToVisit: 'Night Palki Sahib ceremony or dawn Amrit Vela',
    description: 'Gleaming gold-plated spiritual epicenter of Sikhism surrounded by the holy Amrit Sarovar lake and 24/7 world-largest community Langar hall.',
    imageUrl: 'https://images.unsplash.com/photo-1588096344356-9b497782b53b?auto=format&fit=crop&w=600&q=80',
    corridors: ['NDLS-SVDK'],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Golden+Temple+Amritsar',
  },
  {
    id: 'place-jagannath-puri',
    name: 'Shri Jagannath Temple & Puri Golden Sea Beach',
    cityName: 'Puri',
    state: 'Odisha',
    nearestStation: 'Puri Railway Station',
    nearestStationCode: 'PURI',
    distanceFromStation: '2.5 km',
    category: 'Spiritual & Ghats',
    rating: 4.9,
    bestTimeToVisit: 'Morning Mahaprasad Darshan & evening coastal breeze',
    description: 'Ancient 12th-century Kalinga-style high-towered sanctum of Lord Jagannath, famous for its sacred flag flying opposite the wind and the holy beach corridor.',
    imageUrl: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=600&q=80',
    corridors: ['HWH-NDLS'],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jagannath+Temple+Puri',
  },
  {
    id: 'place-sarnath',
    name: 'Sarnath Dhamek Stupa & Deer Park',
    cityName: 'Varanasi',
    state: 'Uttar Pradesh',
    nearestStation: 'Varanasi Junction Cantt',
    nearestStationCode: 'BSB',
    distanceFromStation: '9.2 km',
    category: 'Architectural Marvel',
    rating: 4.8,
    bestTimeToVisit: 'Winter mornings (8 AM - 11 AM)',
    description: 'Sacred UNESCO site where Lord Buddha gave his first sermon of the Four Noble Truths. Houses Ashoka’s Lion Capital emblem of India.',
    imageUrl: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=600&q=80',
    corridors: ['NDLS-BSB', 'HWH-NDLS'],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sarnath+Dhamek+Stupa+Varanasi',
  },
];

// Initial Bookmarked Places
export const INITIAL_BOOKMARKED_PLACES: BookmarkedPlaceRecord[] = [
  {
    id: 'bkm-1',
    placeId: 'place-kashi-vishwanath',
    placeName: 'Shri Kashi Vishwanath Temple & Ganga Corridor',
    cityName: 'Varanasi',
    nearestStation: 'Varanasi Junction Cantt (BSB)',
    category: 'Spiritual & Ghats',
    imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
    description: 'Sacred golden-spired shrine connected directly to the holy Ganges.',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kashi+Vishwanath+Temple+Varanasi',
    bookmarkedAt: 'Yesterday',
  },
  {
    id: 'bkm-2',
    placeId: 'place-dudhsagar-falls',
    placeName: 'Dudhsagar Waterfalls (Konkan Rail Bridge View)',
    cityName: 'Goa',
    nearestStation: 'Madgaon Junction (MAO)',
    category: 'Nature & Waterfalls',
    imageUrl: '/src/assets/images/konkan_scenic_rail_1790504207098.jpg',
    description: '310m four-tiered waterfall cascading under the famous railway viaduct.',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Dudhsagar+Falls+Goa',
    bookmarkedAt: 'Today',
  },
];

// Dynamic Train Schedule Generator for ANY route in India
export function generateSchedules(fromStationName: string, toStationName: string, date: string): TrainSchedule[] {
  const from = findOrCreateStation(fromStationName);
  const to = findOrCreateStation(toStationName);

  // Derive distance estimate
  let distKm = 650;
  if (from.code === 'NDLS' && to.code === 'BSB') distKm = 759;
  else if (from.code === 'NDLS' && to.code === 'MMCT') distKm = 1386;
  else if (from.code === 'CSMT' && to.code === 'MAO') distKm = 586;
  else if (from.code === 'SBC' && to.code === 'MAS') distKm = 359;
  else if (from.code === 'HWH' && to.code === 'NDLS') distKm = 1451;
  else if ((from.code === 'DURG' || from.code === 'R') && (to.code === 'DNR' || to.code === 'PNBE')) distKm = 1145;
  else if ((from.code === 'CPR' || from.code === 'BSB') && (to.code === 'DURG' || to.code === 'R')) distKm = 1018;
  else if ((from.code === 'DURG' || from.code === 'R') && (to.code === 'HTE' || to.code === 'RNC')) distKm = 628;
  else if (from.state !== to.state) distKm = 850;
  else distKm = 380;

  const durationHours = Math.max(3, Math.round(distKm / 85));
  const durationMins = (distKm % 85 > 40) ? 30 : 0;
  const durationStr = `${durationHours}h ${durationMins > 0 ? `${durationMins}m` : '15m'}`;

  const basePrice = Math.round(distKm * 1.55);

  const trains: TrainSchedule[] = [];

  const southBiharStations = ['DURG', 'R', 'BSP', 'RIG', 'JSG', 'ROU', 'CKP', 'TATA', 'ASN', 'JSME', 'KIUL', 'MKA', 'PNBE', 'DNR'];
  const sarnathStations = ['CPR', 'BSB', 'PRYJ', 'STA', 'KTE', 'SDL', 'BSP', 'R', 'DURG'];
  const durgHatiaStations = ['DURG', 'R', 'BSP', 'RIG', 'JSG', 'ROU', 'HTE', 'RNC'];

  const isSouthBiharRoute = southBiharStations.includes(from.code) || southBiharStations.includes(to.code) || 
    fromStationName.toLowerCase().includes('south bihar') || toStationName.toLowerCase().includes('south bihar');

  const isSarnathRoute = sarnathStations.includes(from.code) || sarnathStations.includes(to.code) ||
    fromStationName.toLowerCase().includes('sarnath') || toStationName.toLowerCase().includes('sarnath');

  const isDurgHatiaRoute = durgHatiaStations.includes(from.code) || durgHatiaStations.includes(to.code) ||
    fromStationName.toLowerCase().includes('hatia') || toStationName.toLowerCase().includes('hatia');

  // 1. South Bihar Express (13287 / 13288) - Durg to Danapur / Patna via Tatanagar
  if (isSouthBiharRoute || Math.random() > 0.4) {
    const isUp = from.code === 'DURG' || from.code === 'R' || from.code === 'BSP';
    trains.push({
      id: `south-bihar-express-${from.code}-${to.code}`,
      trainNumber: isUp ? '13287' : '13288',
      trainName: 'South Bihar Express (Durg - Danapur Daily)',
      trainType: 'Mail / Express',
      departureTime: '07:45',
      arrivalTime: '07:25',
      duration: '23h 40m',
      fromStation: from.name,
      fromCode: from.code,
      toStation: to.name,
      toCode: to.code,
      runningDays: ['Daily', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      stops: 43,
      stopDetails: [
        'Bhilai Power House', 'Raipur Jn', 'Tilda Neora', 'Bhatapara', 'Bilaspur Jn', 
        'Champa Jn', 'Raigarh', 'Jharsuguda Jn', 'Rourkela Jn', 'Chakradharpur', 
        'Tatanagar Jn (Jamshedpur)', 'Purulia Jn', 'Asansol Jn', 'Jasidih Jn (Deoghar)', 
        'Jhajha', 'Kiul Jn', 'Mokama', 'Bakhtiyarpur', 'Patna Jn', 'Danapur'
      ],
      classes: {
        '2S': { name: 'Second Seating (2S)', code: '2S', price: 295, availableSeats: 140, status: 'AVL' },
        SL: { name: 'Sleeper Class (SL)', code: 'SL', price: 490, availableSeats: 88, status: 'AVL' },
        '3A': { name: 'AC 3 Tier (3A)', code: '3A', price: 1320, availableSeats: 32, status: 'AVL' },
        '2A': { name: 'AC 2 Tier (2A)', code: '2A', price: 1890, availableSeats: 12, status: 'AVL' },
      },
      amenities: ['Pantry Car Available', 'Charging Sockets at all berths', 'Daily Running', 'RPF Escorted', 'Bio-Toilets'],
      onTimeRate: '94.8%',
      platform: 'Platform 1',
      pantry: true,
    });
  }

  // 2. Sarnath Express (15159 / 15160) - Chhapra to Durg via Varanasi, Prayagraj, Katni, Bilaspur
  if (isSarnathRoute || Math.random() > 0.4) {
    const isUp = from.code === 'CPR' || from.code === 'BSB' || from.code === 'PRYJ';
    trains.push({
      id: `sarnath-express-${from.code}-${to.code}`,
      trainNumber: isUp ? '15159' : '15160',
      trainName: 'Sarnath Express (Chhapra - Durg via Varanasi)',
      trainType: 'Mail / Express',
      departureTime: '07:10',
      arrivalTime: '07:05',
      duration: '23h 55m',
      fromStation: from.name,
      fromCode: from.code,
      toStation: to.name,
      toCode: to.code,
      runningDays: ['Daily', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      stops: 49,
      stopDetails: [
        'Ballia', 'Ghazipur City', 'Aunrihar Jn', 'Varanasi Jn (Cantt)', 'Prayagraj Jn', 
        'Manikpur Jn', 'Satna Jn', 'Maihar', 'Katni Jn', 'Umaria (Bandhavgarh)', 
        'Shahdol', 'Anuppur Jn', 'Pendra Road', 'Bilaspur Jn', 'Bhatapara', 'Raipur Jn', 'Durg Jn'
      ],
      classes: {
        '2S': { name: 'Second Seating (2S)', code: '2S', price: 275, availableSeats: 110, status: 'AVL' },
        SL: { name: 'Sleeper Class (SL)', code: 'SL', price: 460, availableSeats: 64, status: 'AVL' },
        '3A': { name: 'AC 3 Tier (3A)', code: '3A', price: 1260, availableSeats: 24, status: 'AVL' },
        '2A': { name: 'AC 2 Tier (2A)', code: '2A', price: 1810, availableSeats: 8, status: 'AVL' },
      },
      amenities: ['Onboard Food Vendors', 'Linen Provided in AC', 'Scenic Vindhya & Satpura Hills View', 'Daily Running'],
      onTimeRate: '95.1%',
      platform: 'Platform 2',
      pantry: true,
    });
  }

  // 3. Durg - Hatia Express (18185 / 18186) - Durg to Hatia via Raipur, Bilaspur, Rourkela
  if (isDurgHatiaRoute || Math.random() > 0.4) {
    const isUp = from.code === 'DURG' || from.code === 'R' || from.code === 'BSP';
    trains.push({
      id: `durg-hatia-express-${from.code}-${to.code}`,
      trainNumber: isUp ? '18186' : '18185',
      trainName: 'Durg - Hatia Express (via Rourkela & Bilaspur)',
      trainType: 'Mail / Express',
      departureTime: '19:45',
      arrivalTime: '06:40',
      duration: '10h 55m',
      fromStation: from.name,
      fromCode: from.code,
      toStation: to.name,
      toCode: to.code,
      runningDays: ['Daily', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      stops: 18,
      stopDetails: [
        'Raipur Jn', 'Tilda Neora', 'Bhatapara', 'Bilaspur Jn', 'Akaltara', 'Champa Jn', 
        'Baradwar', 'Sakti', 'Kharsia', 'Raigarh', 'Belpahar', 'Brajarajnagar', 
        'Jharsuguda Jn', 'Rajgangpur', 'Rourkela Jn', 'Bano', 'Hatia (Ranchi)'
      ],
      classes: {
        '2S': { name: 'Second Seating (2S)', code: '2S', price: 195, availableSeats: 160, status: 'AVL' },
        SL: { name: 'Sleeper Class (SL)', code: 'SL', price: 345, availableSeats: 92, status: 'AVL' },
        '3A': { name: 'AC 3 Tier (3A)', code: '3A', price: 935, availableSeats: 40, status: 'AVL' },
      },
      amenities: ['Overnight Express', 'Charging Points', 'RailTel High-Speed Wi-Fi at Halts', 'Daily Regular'],
      onTimeRate: '96.2%',
      platform: 'Platform 3',
      pantry: true,
    });
  }

  // 4. Local Passenger / MEMU Train (e.g., Durg-Raipur-Bilaspur MEMU or Intercity Local)
  trains.push({
    id: `${from.code}-${to.code}-memu-local`,
    trainNumber: '68728',
    trainName: `${from.city} - ${to.city} MEMU Passenger Fast Local`,
    trainType: 'Local Passenger / MEMU',
    departureTime: '08:20',
    arrivalTime: `${String((8 + Math.min(6, durationHours)) % 24).padStart(2, '0')}:45`,
    duration: `${Math.min(6, durationHours)}h 25m`,
    fromStation: from.name,
    fromCode: from.code,
    toStation: to.name,
    toCode: to.code,
    runningDays: ['Daily', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    stops: 24,
    stopDetails: ['Outer Halt 1', 'Gramin Station', 'Tehsil Junction', 'Industrial Siding', 'Town Cantt', 'Central Junction'],
    classes: {
      GEN: { name: 'General Unreserved (GEN)', code: 'GEN', price: Math.max(35, Math.round(basePrice * 0.18)), availableSeats: 350, status: 'AVL' },
      '2S': { name: 'Second Seating (2S)', code: '2S', price: Math.max(55, Math.round(basePrice * 0.25)), availableSeats: 180, status: 'AVL' },
    },
    amenities: ['CCTV in All Coaches', 'LED Station Announcements', 'Ventilated Bench Seating', 'Emergency Talkback to Driver'],
    onTimeRate: '93.5%',
    platform: 'Platform 4 (Local Loop)',
    pantry: false,
  });

  // 5. Vande Bharat Express (Semi High-Speed)
  trains.push({
    id: `${from.code}-${to.code}-vb-22401`,
    trainNumber: `22${Math.floor(100 + Math.random() * 899)}`,
    trainName: `${from.city} - ${to.city} Vande Bharat Express`,
    trainType: 'Vande Bharat',
    departureTime: '06:00',
    arrivalTime: `${String((6 + durationHours) % 24).padStart(2, '0')}:${String(durationMins).padStart(2, '0')}`,
    duration: durationStr,
    fromStation: from.name,
    fromCode: from.code,
    toStation: to.name,
    toCode: to.code,
    runningDays: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    stops: 3,
    stopDetails: [`Intermediate Junction 1`, `Intermediate Junction 2`, `${to.city} Outer`],
    classes: {
      CC: { name: 'AC Chair Car', code: 'CC', price: basePrice, availableSeats: 32, status: 'AVL' },
      EC: { name: 'Executive Chair Car', code: 'EC', price: Math.round(basePrice * 1.85), availableSeats: 12, status: 'AVL' },
    },
    amenities: ['160 km/h Capable', 'Bio-Vacuum Toilets', 'Rotatable Seats', 'Hot Catering Included', 'Free RailTel Wi-Fi'],
    onTimeRate: '99.2%',
    platform: 'Platform 1',
    pantry: true,
  });

  // 6. Superfast Express / Intercity Express
  trains.push({
    id: `${from.code}-${to.code}-sf-12480`,
    trainNumber: `12${Math.floor(100 + Math.random() * 899)}`,
    trainName: `${from.city} - ${to.city} Superfast Intercity Express`,
    trainType: 'Superfast Express',
    departureTime: '15:30',
    arrivalTime: `${String((15 + durationHours) % 24).padStart(2, '0')}:50`,
    duration: `${durationHours}h 20m`,
    fromStation: from.name,
    fromCode: from.code,
    toStation: to.name,
    toCode: to.code,
    runningDays: ['Daily'],
    stops: 9,
    stopDetails: ['Sub-Division A', 'District Halt B', 'Junction C', 'Division D'],
    classes: {
      '2S': { name: 'Second Seating (2S)', code: '2S', price: Math.round(basePrice * 0.3), availableSeats: 120, status: 'AVL' },
      SL: { name: 'Sleeper Class', code: 'SL', price: Math.round(basePrice * 0.45), availableSeats: 85, status: 'AVL' },
      '3A': { name: 'AC 3 Tier', code: '3A', price: Math.round(basePrice * 1.1), availableSeats: 19, status: 'AVL' },
      '2A': { name: 'AC 2 Tier', code: '2A', price: Math.round(basePrice * 1.7), availableSeats: 8, status: 'AVL' },
    },
    amenities: ['Pantry Car Available', 'Charging Points', 'Onboard Housekeeping (OBHS)'],
    onTimeRate: '95.4%',
    platform: 'Platform 2',
    pantry: true,
  });

  return trains;
}
