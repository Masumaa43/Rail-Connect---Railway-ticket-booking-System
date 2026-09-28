import React, { useState, useMemo } from 'react';
import { 
  Train, 
  Check, 
  User, 
  DoorClosed, 
  Sparkles, 
  Armchair, 
  Eye, 
  Compass, 
  ArrowRight, 
  Layers, 
  Info,
  CheckCircle2,
  Users
} from 'lucide-react';
import { TravelClassKey } from '../data/railData';

export interface SeatInfo {
  id: string; // e.g., '23'
  number: number;
  code: string; // e.g. '23LB' or '18W'
  berthType: 'Window' | 'Middle' | 'Aisle' | 'Lower Berth' | 'Middle Berth' | 'Upper Berth' | 'Side Lower' | 'Side Upper' | 'Cabin Coupe';
  berthCode: 'W' | 'M' | 'A' | 'LB' | 'MB' | 'UB' | 'SL' | 'SU' | 'CP';
  bayNumber: number;
  isSideBerth: boolean;
  status: 'available' | 'occupied' | 'selected' | 'ladies';
  windowSide: 'Left Window' | 'Right Window' | 'Aisle';
  price?: number;
}

interface CoachLayoutVisualizerProps {
  trainNumber: string;
  trainName: string;
  trainType: string;
  seatClassKey: string;
  selectedSeat: string;
  onSelectSeat: (seatCode: string, seatInfo?: SeatInfo) => void;
  passengers?: number;
  quota?: string;
  basePrice?: number;
}

export const CoachLayoutVisualizer: React.FC<CoachLayoutVisualizerProps> = ({
  trainNumber,
  trainName,
  trainType,
  seatClassKey,
  selectedSeat,
  onSelectSeat,
  passengers = 1,
  quota = 'General',
  basePrice = 1200,
}) => {
  // Available coaches to switch
  const coachList = useMemo(() => {
    switch (seatClassKey) {
      case 'EC': return ['E1', 'E2'];
      case 'CC': return ['C1', 'C2', 'C3', 'C4'];
      case '1A': return ['H1'];
      case '2A': return ['A1', 'A2', 'A3'];
      case '3A': return ['B1', 'B2', 'B3', 'B4', 'B5'];
      case 'SL': return ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
      case '2S': return ['D1', 'D2', 'D3'];
      default: return ['C1', 'C2'];
    }
  }, [seatClassKey]);

  const [activeCoach, setActiveCoach] = useState<string>(coachList[0] || 'C1');
  const [filterType, setFilterType] = useState<'all' | 'window' | 'lower' | 'side_lower'>('all');

  // Hardcoded occupied seats for realism (simulating PRS reservation chart)
  const occupiedSet = useMemo(() => {
    return new Set([
      '02W', '05M', '08A', '12W', '15A', '19W', '20W', '25M', '31A',
      '01LB', '04UB', '07SL', '08SU', '11MB', '15UB', '17LB', '21LB', '22MB', '29LB', '30MB', '35SL'
    ]);
  }, []);

  // Generate seats based on class
  const seatsData: SeatInfo[] = useMemo(() => {
    const seats: SeatInfo[] = [];

    if (seatClassKey === 'CC') {
      // 3 + 2 Chair Car (75 seats, 15 rows)
      for (let r = 1; r <= 15; r++) {
        const rowStart = (r - 1) * 5;
        // Left side: W, M, A
        seats.push({
          id: `${rowStart + 1}`,
          number: rowStart + 1,
          code: `${rowStart + 1}W`,
          berthType: 'Window',
          berthCode: 'W',
          bayNumber: r,
          isSideBerth: false,
          status: occupiedSet.has(`${rowStart + 1}W`) ? 'occupied' : 'available',
          windowSide: 'Left Window',
        });
        seats.push({
          id: `${rowStart + 2}`,
          number: rowStart + 2,
          code: `${rowStart + 2}M`,
          berthType: 'Middle',
          berthCode: 'M',
          bayNumber: r,
          isSideBerth: false,
          status: occupiedSet.has(`${rowStart + 2}M`) ? 'occupied' : 'available',
          windowSide: 'Aisle',
        });
        seats.push({
          id: `${rowStart + 3}`,
          number: rowStart + 3,
          code: `${rowStart + 3}A`,
          berthType: 'Aisle',
          berthCode: 'A',
          bayNumber: r,
          isSideBerth: false,
          status: occupiedSet.has(`${rowStart + 3}A`) ? 'occupied' : 'available',
          windowSide: 'Aisle',
        });

        // Right side: A, W
        seats.push({
          id: `${rowStart + 4}`,
          number: rowStart + 4,
          code: `${rowStart + 4}A`,
          berthType: 'Aisle',
          berthCode: 'A',
          bayNumber: r,
          isSideBerth: false,
          status: occupiedSet.has(`${rowStart + 4}A`) ? 'occupied' : 'available',
          windowSide: 'Aisle',
        });
        seats.push({
          id: `${rowStart + 5}`,
          number: rowStart + 5,
          code: `${rowStart + 5}W`,
          berthType: 'Window',
          berthCode: 'W',
          bayNumber: r,
          isSideBerth: false,
          status: occupiedSet.has(`${rowStart + 5}W`) ? 'occupied' : 'available',
          windowSide: 'Right Window',
        });
      }
    } else if (seatClassKey === 'EC') {
      // 2 + 2 Executive Chair Car (48 seats, 12 rows)
      for (let r = 1; r <= 12; r++) {
        const rowStart = (r - 1) * 4;
        seats.push({
          id: `${rowStart + 1}`,
          number: rowStart + 1,
          code: `${rowStart + 1}W`,
          berthType: 'Window',
          berthCode: 'W',
          bayNumber: r,
          isSideBerth: false,
          status: occupiedSet.has(`${rowStart + 1}W`) ? 'occupied' : 'available',
          windowSide: 'Left Window',
        });
        seats.push({
          id: `${rowStart + 2}`,
          number: rowStart + 2,
          code: `${rowStart + 2}A`,
          berthType: 'Aisle',
          berthCode: 'A',
          bayNumber: r,
          isSideBerth: false,
          status: occupiedSet.has(`${rowStart + 2}A`) ? 'occupied' : 'available',
          windowSide: 'Aisle',
        });
        seats.push({
          id: `${rowStart + 3}`,
          number: rowStart + 3,
          code: `${rowStart + 3}A`,
          berthType: 'Aisle',
          berthCode: 'A',
          bayNumber: r,
          isSideBerth: false,
          status: occupiedSet.has(`${rowStart + 3}A`) ? 'occupied' : 'available',
          windowSide: 'Aisle',
        });
        seats.push({
          id: `${rowStart + 4}`,
          number: rowStart + 4,
          code: `${rowStart + 4}W`,
          berthType: 'Window',
          berthCode: 'W',
          bayNumber: r,
          isSideBerth: false,
          status: occupiedSet.has(`${rowStart + 4}W`) ? 'occupied' : 'available',
          windowSide: 'Right Window',
        });
      }
    } else if (seatClassKey === '3A' || seatClassKey === 'SL') {
      // 8-Berth Bays (Total 72 berths, 9 bays)
      // Standard Indian Railways Berth Layout:
      // 1: LB, 2: MB, 3: UB, 4: LB, 5: MB, 6: UB, 7: SL, 8: SU
      for (let bay = 1; bay <= 9; bay++) {
        const start = (bay - 1) * 8;
        const bayPattern: Array<{ offset: number; type: SeatInfo['berthType']; code: SeatInfo['berthCode']; isSide: boolean; side: 'Left Window' | 'Right Window' | 'Aisle' }> = [
          { offset: 1, type: 'Lower Berth', code: 'LB', isSide: false, side: 'Left Window' },
          { offset: 2, type: 'Middle Berth', code: 'MB', isSide: false, side: 'Aisle' },
          { offset: 3, type: 'Upper Berth', code: 'UB', isSide: false, side: 'Aisle' },
          { offset: 4, type: 'Lower Berth', code: 'LB', isSide: false, side: 'Left Window' },
          { offset: 5, type: 'Middle Berth', code: 'MB', isSide: false, side: 'Aisle' },
          { offset: 6, type: 'Upper Berth', code: 'UB', isSide: false, side: 'Aisle' },
          { offset: 7, type: 'Side Lower', code: 'SL', isSide: true, side: 'Right Window' },
          { offset: 8, type: 'Side Upper', code: 'SU', isSide: true, side: 'Right Window' },
        ];

        bayPattern.forEach(b => {
          const num = start + b.offset;
          const code = `${num < 10 ? '0' : ''}${num}${b.code}`;
          seats.push({
            id: `${num}`,
            number: num,
            code,
            berthType: b.type,
            berthCode: b.code,
            bayNumber: bay,
            isSideBerth: b.isSide,
            status: occupiedSet.has(code) ? 'occupied' : 'available',
            windowSide: b.side,
          });
        });
      }
    } else if (seatClassKey === '2A') {
      // 6-Berth Bays (Total 54 berths, 9 bays)
      // 1: LB, 2: UB, 3: LB, 4: UB, 5: SL, 6: SU
      for (let bay = 1; bay <= 9; bay++) {
        const start = (bay - 1) * 6;
        const bayPattern: Array<{ offset: number; type: SeatInfo['berthType']; code: SeatInfo['berthCode']; isSide: boolean; side: 'Left Window' | 'Right Window' | 'Aisle' }> = [
          { offset: 1, type: 'Lower Berth', code: 'LB', isSide: false, side: 'Left Window' },
          { offset: 2, type: 'Upper Berth', code: 'UB', isSide: false, side: 'Aisle' },
          { offset: 3, type: 'Lower Berth', code: 'LB', isSide: false, side: 'Left Window' },
          { offset: 4, type: 'Upper Berth', code: 'UB', isSide: false, side: 'Aisle' },
          { offset: 5, type: 'Side Lower', code: 'SL', isSide: true, side: 'Right Window' },
          { offset: 6, type: 'Side Upper', code: 'SU', isSide: true, side: 'Right Window' },
        ];

        bayPattern.forEach(b => {
          const num = start + b.offset;
          const code = `${num < 10 ? '0' : ''}${num}${b.code}`;
          seats.push({
            id: `${num}`,
            number: num,
            code,
            berthType: b.type,
            berthCode: b.code,
            bayNumber: bay,
            isSideBerth: b.isSide,
            status: occupiedSet.has(code) ? 'occupied' : 'available',
            windowSide: b.side,
          });
        });
      }
    } else if (seatClassKey === '1A') {
      // First Class AC Coupes & Cabins (Coupes: 2 berths, Cabins: 4 berths)
      const cabins = [
        { name: 'Cabin A (4 Berths)', type: 'Cabin Coupe' as const, berths: [1, 2, 3, 4] },
        { name: 'Coupe B (2 Berths)', type: 'Cabin Coupe' as const, berths: [5, 6] },
        { name: 'Cabin C (4 Berths)', type: 'Cabin Coupe' as const, berths: [7, 8, 9, 10] },
        { name: 'Coupe D (2 Berths)', type: 'Cabin Coupe' as const, berths: [11, 12] },
        { name: 'Cabin E (4 Berths)', type: 'Cabin Coupe' as const, berths: [13, 14, 15, 16] },
      ];

      cabins.forEach((c, idx) => {
        c.berths.forEach(num => {
          const code = `${num < 10 ? '0' : ''}${num}CP`;
          seats.push({
            id: `${num}`,
            number: num,
            code,
            berthType: 'Cabin Coupe',
            berthCode: 'CP',
            bayNumber: idx + 1,
            isSideBerth: false,
            status: occupiedSet.has(code) ? 'occupied' : 'available',
            windowSide: 'Left Window',
          });
        });
      });
    } else {
      // 2S / Second Seating / Local
      for (let r = 1; r <= 18; r++) {
        const rowStart = (r - 1) * 6;
        ['W', 'M', 'A', 'A', 'M', 'W'].forEach((pos, i) => {
          const num = rowStart + i + 1;
          const code = `${num}${pos}`;
          seats.push({
            id: `${num}`,
            number: num,
            code,
            berthType: pos === 'W' ? 'Window' : pos === 'M' ? 'Middle' : 'Aisle',
            berthCode: pos as any,
            bayNumber: r,
            isSideBerth: false,
            status: occupiedSet.has(code) ? 'occupied' : 'available',
            windowSide: i < 3 ? 'Left Window' : 'Right Window',
          });
        });
      }
    }

    return seats;
  }, [seatClassKey, occupiedSet]);

  // Find currently selected seat info
  const selectedSeatInfo = useMemo(() => {
    return seatsData.find(s => s.code === selectedSeat || s.id === selectedSeat.replace(/\D/g, ''));
  }, [seatsData, selectedSeat]);

  // Filter seats based on quick picker
  const filteredSeats = useMemo(() => {
    if (filterType === 'window') {
      return seatsData.filter(s => s.berthType === 'Window' || s.windowSide !== 'Aisle');
    }
    if (filterType === 'lower') {
      return seatsData.filter(s => s.berthType === 'Lower Berth');
    }
    if (filterType === 'side_lower') {
      return seatsData.filter(s => s.berthType === 'Side Lower');
    }
    return seatsData;
  }, [seatsData, filterType]);

  const handleSeatClick = (seat: SeatInfo) => {
    if (seat.status === 'occupied') return;
    onSelectSeat(seat.code, seat);
  };

  // Group sleeper/3A/2A into bays
  const baysGrouped = useMemo(() => {
    const map = new Map<number, SeatInfo[]>();
    filteredSeats.forEach(s => {
      const list = map.get(s.bayNumber) || [];
      list.push(s);
      map.set(s.bayNumber, list);
    });
    return Array.from(map.entries());
  }, [filteredSeats]);

  const isChairCar = seatClassKey === 'CC' || seatClassKey === 'EC' || seatClassKey === '2S';

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl space-y-4">
      {/* Top Banner: Coach switcher & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0">
            <Train className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
              <span>Interactive Coach Layout</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {seatClassKey}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              #{trainNumber} · {trainName} ({trainType})
            </div>
          </div>
        </div>

        {/* Coach Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 px-2 shrink-0">Coach:</span>
          {coachList.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setActiveCoach(c)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCoach === c
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Berth Preference Filters */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none text-xs pb-1">
        <span className="text-slate-400 font-bold shrink-0">Filter Berths:</span>
        <button
          type="button"
          onClick={() => setFilterType('all')}
          className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
            filterType === 'all'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          All Berths
        </button>
        <button
          type="button"
          onClick={() => setFilterType('window')}
          className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
            filterType === 'window'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Window Views
        </button>
        {(!isChairCar) && (
          <>
            <button
              type="button"
              onClick={() => setFilterType('lower')}
              className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterType === 'lower'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Lower Berths (Senior Citizen)
            </button>
            <button
              type="button"
              onClick={() => setFilterType('side_lower')}
              className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterType === 'side_lower'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Side Lower (SL)
            </button>
          </>
        )}
      </div>

      {/* Legend & Seat Color Codes */}
      <div className="flex items-center flex-wrap gap-4 text-[11px] bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-emerald-600 ring-2 ring-emerald-400" />
          <span className="font-semibold text-white">Your Selection</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-white text-slate-900 border border-slate-400" />
          <span className="text-slate-300">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-slate-700 opacity-60" />
          <span className="text-slate-400">Booked (PRS)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-amber-400/80" />
          <span className="text-amber-300">Lower Berth</span>
        </div>
        <div className="ml-auto flex items-center gap-1 text-slate-400 font-mono text-[10px]">
          <DoorClosed className="w-3.5 h-3.5 text-slate-400" />
          <span>Entry / Toilets at both ends</span>
        </div>
      </div>

      {/* Interactive Coach Body Visualization Container */}
      <div className="relative bg-slate-950 rounded-2xl border-2 border-slate-700 p-4 overflow-x-auto scrollbar-none">
        {/* Train Direction Header */}
        <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 border-b border-slate-800 pb-2 mb-3">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span>▲ LOCOMOTIVE / ENGINE DIRECTION</span>
          </div>
          <div className="text-slate-400">
            Coach {activeCoach} ({seatClassKey}) · Capacity {seatsData.length} Berths
          </div>
        </div>

        {/* Coach Door & Washroom Header Area */}
        <div className="grid grid-cols-4 gap-2 mb-4 text-[10px] text-slate-400 font-mono text-center">
          <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800">
            <span>Entry Door L</span>
          </div>
          <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800">
            <span>Bio-Toilet 1</span>
          </div>
          <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800">
            <span>Bio-Toilet 2</span>
          </div>
          <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800">
            <span>Entry Door R</span>
          </div>
        </div>

        {/* Render Chair Car Layout */}
        {isChairCar ? (
          <div className="space-y-2 max-w-xl mx-auto">
            {/* Header column labels */}
            <div className="flex items-center justify-between px-2 text-[10px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-7 text-center">W (Left)</span>
                {seatClassKey !== 'EC' && <span className="w-7 text-center">M</span>}
                <span className="w-7 text-center">A</span>
              </div>
              <span className="text-slate-500 font-bold">AISLE</span>
              <div className="flex items-center gap-2">
                <span className="w-7 text-center">A</span>
                {seatClassKey === '2S' && <span className="w-7 text-center">M</span>}
                <span className="w-7 text-center">W (Right)</span>
              </div>
            </div>

            {/* Rows */}
            {baysGrouped.map(([bayNum, baySeats]) => {
              const leftSeats = baySeats.filter(s => s.windowSide === 'Left Window' || (s.berthType === 'Middle' && baySeats.indexOf(s) < 3) || (s.berthType === 'Aisle' && baySeats.indexOf(s) < 3));
              const rightSeats = baySeats.filter(s => !leftSeats.includes(s));

              return (
                <div 
                  key={bayNum} 
                  className="flex items-center justify-between gap-3 p-1.5 bg-slate-900/80 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  {/* Left Gang */}
                  <div className="flex items-center gap-1.5">
                    {leftSeats.map(seat => {
                      const isOccupied = seat.status === 'occupied';
                      const isSelected = selectedSeat === seat.code || selectedSeat === seat.id;
                      return (
                        <button
                          key={seat.code}
                          type="button"
                          disabled={isOccupied}
                          onClick={() => handleSeatClick(seat)}
                          title={`Seat ${seat.number} · ${seat.berthType} (${seat.windowSide})`}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 scale-105 shadow-md'
                              : isOccupied
                              ? 'bg-slate-800 text-slate-600 border border-slate-700/50 cursor-not-allowed'
                              : 'bg-slate-100 hover:bg-emerald-50 text-slate-800 border border-slate-300 hover:border-emerald-500'
                          }`}
                        >
                          <span className="leading-none">{seat.number}</span>
                          <span className="text-[8px] font-mono leading-none opacity-80">{seat.berthCode}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Aisle Spacer */}
                  <div className="text-[10px] font-mono font-bold text-slate-500 px-2 py-0.5 rounded bg-slate-950">
                    R{bayNum}
                  </div>

                  {/* Right Gang */}
                  <div className="flex items-center gap-1.5">
                    {rightSeats.map(seat => {
                      const isOccupied = seat.status === 'occupied';
                      const isSelected = selectedSeat === seat.code || selectedSeat === seat.id;
                      return (
                        <button
                          key={seat.code}
                          type="button"
                          disabled={isOccupied}
                          onClick={() => handleSeatClick(seat)}
                          title={`Seat ${seat.number} · ${seat.berthType} (${seat.windowSide})`}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 scale-105 shadow-md'
                              : isOccupied
                              ? 'bg-slate-800 text-slate-600 border border-slate-700/50 cursor-not-allowed'
                              : 'bg-slate-100 hover:bg-emerald-50 text-slate-800 border border-slate-300 hover:border-emerald-500'
                          }`}
                        >
                          <span className="leading-none">{seat.number}</span>
                          <span className="text-[8px] font-mono leading-none opacity-80">{seat.berthCode}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Render Sleeper / 3A / 2A / 1A Bay Layout */
          <div className="space-y-3">
            {baysGrouped.map(([bayNum, baySeats]) => {
              const mainCabin = baySeats.filter(s => !s.isSideBerth);
              const sideBerths = baySeats.filter(s => s.isSideBerth);

              return (
                <div
                  key={bayNum}
                  className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  {/* Left: Main Bay Compartment */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Armchair className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Compartment Bay {bayNum}</span>
                      </span>
                      <span className="text-[10px] text-slate-500">Left Window Side</span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {mainCabin.map(seat => {
                        const isOccupied = seat.status === 'occupied';
                        const isSelected = selectedSeat === seat.code || selectedSeat === seat.id;
                        const isLower = seat.berthCode === 'LB';

                        return (
                          <button
                            key={seat.code}
                            type="button"
                            disabled={isOccupied}
                            onClick={() => handleSeatClick(seat)}
                            title={`Berth ${seat.number} · ${seat.berthType}`}
                            className={`p-2 rounded-xl text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 shadow-md scale-102'
                                : isOccupied
                                ? 'bg-slate-800 text-slate-600 border border-slate-700/50 cursor-not-allowed'
                                : isLower
                                ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
                                : 'bg-slate-100 hover:bg-white text-slate-800 border border-slate-300'
                            }`}
                          >
                            <span className="text-xs font-extrabold">{seat.number}</span>
                            <span className="text-[9px] font-bold uppercase">{seat.berthCode}</span>
                            <span className="text-[8px] opacity-75 truncate max-w-full">{seat.berthType.split(' ')[0]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Divider / Aisle */}
                  <div className="hidden md:flex flex-col items-center justify-center px-2 text-slate-600 font-mono text-[10px]">
                    <span className="rotate-90">AISLE</span>
                  </div>

                  {/* Right: Side Berths (SL / SU) */}
                  {sideBerths.length > 0 && (
                    <div className="md:w-44 bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-bold mb-1.5 flex items-center justify-between">
                        <span>Side Berths</span>
                        <span className="text-emerald-400 text-[9px]">Right Window</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {sideBerths.map(seat => {
                          const isOccupied = seat.status === 'occupied';
                          const isSelected = selectedSeat === seat.code || selectedSeat === seat.id;
                          return (
                            <button
                              key={seat.code}
                              type="button"
                              disabled={isOccupied}
                              onClick={() => handleSeatClick(seat)}
                              title={`Berth ${seat.number} · ${seat.berthType}`}
                              className={`p-2 rounded-xl text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 shadow-md scale-102'
                                  : isOccupied
                                  ? 'bg-slate-800 text-slate-600 border border-slate-700/50 cursor-not-allowed'
                                  : 'bg-slate-100 hover:bg-white text-slate-800 border border-slate-300'
                              }`}
                            >
                              <span className="text-xs font-extrabold">{seat.number}</span>
                              <span className="text-[9px] font-bold uppercase">{seat.berthCode}</span>
                              <span className="text-[8px] opacity-75">{seat.berthType}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Coach Rear Area */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Rear Vestibule & Guard Section</span>
          <span>Next Coach ➔</span>
        </div>
      </div>

      {/* Selected Seat Summary Card */}
      {selectedSeatInfo && (
        <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-sm shrink-0">
              {selectedSeatInfo.number}
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Selected: Coach {activeCoach}, Seat {selectedSeatInfo.number}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 font-bold uppercase">
                  {selectedSeatInfo.berthType}
                </span>
              </div>
              <div className="text-[11px] text-emerald-300 mt-0.5">
                Bay {selectedSeatInfo.bayNumber} · {selectedSeatInfo.windowSide} · {quota} Quota
              </div>
            </div>
          </div>

          <div className="sm:text-right shrink-0">
            <div className="text-[10px] text-slate-300">Base Fare ({passengers} P)</div>
            <div className="text-base font-extrabold text-white tabular-nums">
              ₹{basePrice * passengers}.00
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
