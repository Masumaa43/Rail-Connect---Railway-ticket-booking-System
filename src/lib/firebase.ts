import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as fbSignOut,
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer,
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { BookingTicket, PnrHistoryItem, FoodOrder, EmergencySosRequest, BookmarkedPlaceRecord, WalletTransaction } from '../data/railData';

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Error handling specifications from Firebase Integration skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

testConnection();

// Sign in with Google
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Save/update user profile in Firestore
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Rail Traveler',
        photoURL: user.photoURL || '',
        createdAt: new Date().toISOString(),
      }, { merge: true });
    }

    return user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

// Sign out
export async function signOutUser(): Promise<void> {
  await fbSignOut(auth);
}

// 1. Save ticket to Firestore
export async function saveBookingToFirestore(ticket: BookingTicket, userId: string): Promise<string> {
  const bookingId = ticket.pnr || `RC-${Date.now()}`;
  const path = `bookings/${bookingId}`;
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await setDoc(bookingRef, {
      id: bookingId,
      userId,
      pnr: ticket.pnr,
      trainNumber: ticket.trainNumber,
      trainName: ticket.trainName,
      fromStation: ticket.fromStation,
      fromCode: ticket.fromCode,
      toStation: ticket.toStation,
      toCode: ticket.toCode,
      departureTime: ticket.departureTime,
      arrivalTime: ticket.arrivalTime,
      travelDate: ticket.travelDate,
      passengerName: ticket.passengerName,
      passengerEmail: auth.currentUser?.email || '',
      seatClass: ticket.seatClass,
      coach: ticket.coach,
      seatNumber: ticket.seatNumber,
      totalPaid: ticket.totalPaid,
      status: ticket.status,
      platform: ticket.platform,
      transactionId: ticket.transactionId || `TXN-IRCTC-${Math.floor(10000000 + Math.random() * 90000000)}`,
      paymentMethod: ticket.paymentMethod || 'RailPay Virtual Wallet',
      paymentStatus: ticket.paymentStatus || 'SUCCESS',
      baseFare: ticket.baseFare || ticket.totalPaid,
      convenienceFee: ticket.convenienceFee || 17.70,
      gstAmount: ticket.gstAmount || Math.round(ticket.totalPaid * 0.05),
      insuranceOpted: ticket.insuranceOpted ?? true,
      bookingTime: ticket.bookingTime || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString(),
    });
    return bookingId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

// Delete ticket from Firestore
export async function deleteBookingFromFirestore(bookingId: string): Promise<void> {
  const path = `bookings/${bookingId}`;
  try {
    await deleteDoc(doc(db, 'bookings', bookingId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

// 2. Save PNR Search History to Firestore
export async function savePnrToHistory(pnrItem: PnrHistoryItem, userId: string): Promise<string> {
  const historyId = pnrItem.id || `pnr-${pnrItem.pnr}-${Date.now()}`;
  const path = `pnr_history/${historyId}`;
  try {
    const ref = doc(db, 'pnr_history', historyId);
    await setDoc(ref, {
      id: historyId,
      userId,
      pnr: pnrItem.pnr,
      trainNumber: pnrItem.trainNumber,
      trainName: pnrItem.trainName,
      fromStation: pnrItem.fromStation,
      toStation: pnrItem.toStation,
      journeyDate: pnrItem.journeyDate,
      bookingStatus: pnrItem.bookingStatus,
      coach: pnrItem.coach,
      berth: pnrItem.berth,
      classType: pnrItem.classType,
      chartStatus: pnrItem.chartStatus,
      currentSpeed: pnrItem.currentSpeed || '120 km/h',
      currentStation: pnrItem.currentStation || '',
      eta: pnrItem.eta || '',
      checkedAt: pnrItem.checkedAt || new Date().toISOString(),
      timeline: pnrItem.timeline || [],
    });
    return historyId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

// Delete PNR from history
export async function deletePnrFromHistory(historyId: string): Promise<void> {
  const path = `pnr_history/${historyId}`;
  try {
    await deleteDoc(doc(db, 'pnr_history', historyId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

// 3. Save Food Order to Firestore
export async function saveFoodOrderToFirestore(order: FoodOrder, userId: string): Promise<string> {
  const orderId = order.id || `food-${Date.now()}`;
  const path = `food_orders/${orderId}`;
  try {
    const ref = doc(db, 'food_orders', orderId);
    await setDoc(ref, {
      id: orderId,
      userId,
      pnr: order.pnr,
      trainNumber: order.trainNumber,
      trainName: order.trainName,
      coach: order.coach,
      seat: order.seat,
      deliveryStation: order.deliveryStation,
      itemName: order.itemName,
      quantity: order.quantity,
      totalPrice: order.totalPrice,
      paymentMethod: order.paymentMethod,
      transactionId: order.transactionId || (order.paymentMethod.includes('COD') ? 'COD-PAY-ON-DELIVERY' : `TXN-FOOD-${Math.floor(10000000 + Math.random() * 90000000)}`),
      paymentStatus: order.paymentStatus || (order.paymentMethod.includes('COD') ? 'COD' : 'PAID'),
      orderStatus: order.orderStatus,
      orderedAt: order.orderedAt,
      estimatedDelivery: order.estimatedDelivery || '',
    });
    return orderId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

// Delete Food Order from Firestore
export async function deleteFoodOrderFromFirestore(orderId: string): Promise<void> {
  const path = `food_orders/${orderId}`;
  try {
    await deleteDoc(doc(db, 'food_orders', orderId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

// 4. Save Emergency SOS to Firestore
export async function saveEmergencySosToFirestore(sos: EmergencySosRequest, userId: string): Promise<string> {
  const sosId = sos.id || `sos-${Date.now()}`;
  const path = `emergency_sos/${sosId}`;
  try {
    const ref = doc(db, 'emergency_sos', sosId);
    await setDoc(ref, {
      id: sosId,
      userId,
      pnr: sos.pnr || 'Not Provided',
      trainNumber: sos.trainNumber,
      coach: sos.coach,
      seat: sos.seat,
      emergencyType: sos.emergencyType,
      description: sos.description,
      phone: sos.phone,
      status: sos.status,
      officialsAssigned: sos.officialsAssigned,
      createdAt: sos.createdAt,
    });
    return sosId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

// 5. Save Bookmarked Place to Firestore
export async function saveBookmarkToFirestore(bookmark: BookmarkedPlaceRecord, userId: string): Promise<string> {
  const bookmarkId = bookmark.id || `bkm-${bookmark.placeId}-${Date.now()}`;
  const path = `bookmarked_places/${bookmarkId}`;
  try {
    const ref = doc(db, 'bookmarked_places', bookmarkId);
    await setDoc(ref, {
      id: bookmarkId,
      userId,
      placeId: bookmark.placeId,
      placeName: bookmark.placeName,
      cityName: bookmark.cityName,
      nearestStation: bookmark.nearestStation,
      category: bookmark.category,
      imageUrl: bookmark.imageUrl,
      description: bookmark.description,
      mapsUrl: bookmark.mapsUrl,
      bookmarkedAt: bookmark.bookmarkedAt || new Date().toISOString(),
    });
    return bookmarkId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

// Delete Bookmark from Firestore
export async function deleteBookmarkFromFirestore(bookmarkId: string): Promise<void> {
  const path = `bookmarked_places/${bookmarkId}`;
  try {
    await deleteDoc(doc(db, 'bookmarked_places', bookmarkId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

// 6. Save Wallet Transaction to Firestore
export async function saveWalletTransactionToFirestore(tx: WalletTransaction, userId: string): Promise<string> {
  const txId = tx.id || `tx-${Date.now()}`;
  const path = `wallet_transactions/${txId}`;
  try {
    const ref = doc(db, 'wallet_transactions', txId);
    await setDoc(ref, {
      id: txId,
      userId,
      type: tx.type,
      amount: tx.amount,
      description: tx.description,
      referenceId: tx.referenceId,
      category: tx.category,
      balanceAfter: tx.balanceAfter,
      createdAt: tx.timestamp || new Date().toISOString(),
    });
    return txId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}
