import { Injectable } from '@angular/core';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  DocumentData,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from './firebase-config';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Booking {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  checkIn: Date;
  checkOut: Date;
  nationality: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
  // Ferry booking specific fields
  ferryBooking?: {
    from: string;
    to: string;
    travelDate: string;
    travelTime: string;
    passengers: Array<{
      name: string;
      identityCard: string;
      birthDate: string;
      homePlace: string;
      relationship: string;
      phone: string;
    }>;
    mainPassenger: {
      name: string;
      identityCard: string;
      birthDate: string;
      homePlace: string;
      relationship: string;
      phone: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor() { }

  // Create a new booking
  async createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const bookingData = {
        ...booking,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'bookings'), bookingData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  // Get a single booking by ID
  async getBooking(bookingId: string): Promise<Booking | null> {
    try {
      const docRef = doc(db, 'bookings', bookingId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          checkIn: data['checkIn'].toDate(),
          checkOut: data['checkOut'].toDate(),
          createdAt: data['createdAt'].toDate(),
          updatedAt: data['updatedAt'].toDate()
        } as Booking;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting booking:', error);
      throw error;
    }
  }

  // Get all bookings for a user
  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const q = query(
        collection(db, 'bookings'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          checkIn: data['checkIn'].toDate(),
          checkOut: data['checkOut'].toDate(),
          createdAt: data['createdAt'].toDate(),
          updatedAt: data['updatedAt'].toDate()
        } as Booking;
      });
    } catch (error) {
      console.error('Error getting user bookings:', error);
      throw error;
    }
  }

  // Get all bookings (admin function)
  async getAllBookings(): Promise<Booking[]> {
    try {
      const q = query(
        collection(db, 'bookings'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          checkIn: data['checkIn'].toDate(),
          checkOut: data['checkOut'].toDate(),
          createdAt: data['createdAt'].toDate(),
          updatedAt: data['updatedAt'].toDate()
        } as Booking;
      });
    } catch (error) {
      console.error('Error getting all bookings:', error);
      throw error;
    }
  }

  // Update a booking
  async updateBooking(bookingId: string, updates: Partial<Booking>): Promise<void> {
    try {
      const docRef = doc(db, 'bookings', bookingId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  // Delete a booking
  async deleteBooking(bookingId: string): Promise<void> {
    try {
      const docRef = doc(db, 'bookings', bookingId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }

  // Get bookings by status
  async getBookingsByStatus(status: Booking['status']): Promise<Booking[]> {
    try {
      const q = query(
        collection(db, 'bookings'),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          checkIn: data['checkIn'].toDate(),
          checkOut: data['checkOut'].toDate(),
          createdAt: data['createdAt'].toDate(),
          updatedAt: data['updatedAt'].toDate()
        } as Booking;
      });
    } catch (error) {
      console.error('Error getting bookings by status:', error);
      throw error;
    }
  }

  // Real-time listener for user bookings
  getUserBookingsRealtime(userId: string): Observable<Booking[]> {
    return new Observable(observer => {
      const q = query(
        collection(db, 'bookings'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const bookings = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            checkIn: data['checkIn'].toDate(),
            checkOut: data['checkOut'].toDate(),
            createdAt: data['createdAt'].toDate(),
            updatedAt: data['updatedAt'].toDate()
          } as Booking;
        });
        observer.next(bookings);
      }, (error) => {
        console.error('Error in real-time listener:', error);
        observer.error(error);
      });
      
      // Return unsubscribe function
      return () => unsubscribe();
    });
  }

  // Real-time listener for all bookings (admin)
  getAllBookingsRealtime(): Observable<Booking[]> {
    return new Observable(observer => {
      const q = query(
        collection(db, 'bookings'),
        orderBy('createdAt', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const bookings = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            checkIn: data['checkIn'].toDate(),
            checkOut: data['checkOut'].toDate(),
            createdAt: data['createdAt'].toDate(),
            updatedAt: data['updatedAt'].toDate()
          } as Booking;
        });
        observer.next(bookings);
      }, (error) => {
        console.error('Error in real-time listener:', error);
        observer.error(error);
      });
      
      // Return unsubscribe function
      return () => unsubscribe();
    });
  }

  // Check availability for a date range
  async checkAvailability(checkIn: Date, checkOut: Date): Promise<boolean> {
    try {
      const q = query(
        collection(db, 'bookings'),
        where('status', 'in', ['confirmed', 'pending']),
        where('checkIn', '<', checkOut),
        where('checkOut', '>', checkIn)
      );
      
      const querySnapshot = await getDocs(q);
      // If no conflicting bookings found, it's available
      return querySnapshot.empty;
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  }
}
