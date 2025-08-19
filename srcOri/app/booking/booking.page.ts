import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, ToastController, NavController, LoadingController, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FirestoreService, Booking } from '../services/firestore.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class BookingPage implements OnInit, OnDestroy {
  bookingData = {
    name: '',
    identityCard: '',
    birthDate: '',
    homePlace: '',
    relationship: '',
    phone: '',
    nationality: '',
    from: '',
    to: '',
    date: '',
    time: '',
    passengers: '',
    notes: ''
  };

  additionalPassengers: Array<{name: string, identityCard: string, birthDate: string, homePlace: string, relationship: string, phone: string}> = [];
  isSubmitting = false;
  bookings: Booking[] = [];
  private subscription: Subscription | null = null;

  goBack() {
    this.navController.back();
  }

  getPassengerCount(): number {
    return parseInt(this.bookingData.passengers) || 0;
  }

  onPassengerCountChange() {
    const count = parseInt(this.bookingData.passengers);
    if (count > 1) {
      // Calculate how many additional passengers we need
      const needed = count - 1;
      const current = this.additionalPassengers.length;
      
      if (needed > current) {
        // Add more passengers
        for (let i = current; i < needed; i++) {
          this.additionalPassengers.push({ name: '', identityCard: '', birthDate: '', homePlace: '', relationship: '', phone: '' });
        }
      } else if (needed < current) {
        // Remove excess passengers
        this.additionalPassengers = this.additionalPassengers.slice(0, needed);
      }
    } else {
      // Reset if only 1 passenger
      this.additionalPassengers = [];
    }
  }

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private navController: NavController,
    private loadingController: LoadingController,
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async loadBookings() {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        return;
      }

      this.subscription = this.firestoreService
        .getUserBookingsRealtime(currentUser.uid)
        .subscribe({
          next: (bookings) => {
            this.bookings = bookings;
          },
          error: (error) => {
            console.error('Error loading bookings:', error);
          }
        });
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  }

  getLocationName(location: string): string {
    const locationNames: { [key: string]: string } = {
      'mainland': 'Mainland',
      'island': 'Island'
    };
    return locationNames[location] || location;
  }

  getTimeDisplayName(time: string): string {
    const timeNames: { [key: string]: string } = {
      '06:00': '6:00 AM',
      '08:00': '8:00 AM',
      '10:00': '10:00 AM',
      '12:00': '12:00 PM',
      '14:00': '2:00 PM',
      '16:00': '4:00 PM',
      '18:00': '6:00 PM'
    };
    return timeNames[time] || time;
  }

  getRelationshipName(relationship: string): string {
    const relationshipNames: { [key: string]: string } = {
      'self': 'Self',
      'spouse': 'Spouse',
      'child': 'Child',
      'parent': 'Parent',
      'sibling': 'Sibling',
      'friend': 'Friend',
      'other': 'Other'
    };
    return relationshipNames[relationship] || relationship;
  }

  calculatePrice(): number {
    // Base price for ferry booking
    const basePrice = 50; // $50 base price
    const passengerCount = parseInt(this.bookingData.passengers) || 0;
    return basePrice * passengerCount;
  }

  async submitBooking() {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    try {
      // Show loading
      const loading = await this.loadingController.create({
        message: 'Creating booking...'
      });
      await loading.present();

      // Get current user
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Create booking data for Firestore
      const bookingData = {
        userId: currentUser.uid,
        userName: currentUser.displayName || this.bookingData.name,
        userEmail: currentUser.email || '',
        checkIn: new Date(this.bookingData.date),
        checkOut: new Date(this.bookingData.date), // Same day for ferry booking
        nationality: this.bookingData.nationality,
        guests: parseInt(this.bookingData.passengers),
        totalPrice: this.calculatePrice(),
        status: 'pending' as const,
        specialRequests: this.bookingData.notes || '',
        // Additional ferry-specific fields
        ferryBooking: {
          from: this.bookingData.from,
          to: this.bookingData.to,
          travelDate: this.bookingData.date,
          travelTime: this.bookingData.time,
          passengers: this.additionalPassengers,
          mainPassenger: {
            name: this.bookingData.name,
            identityCard: this.bookingData.identityCard,
            birthDate: this.bookingData.birthDate,
            homePlace: this.bookingData.homePlace,
            relationship: this.bookingData.relationship,
            phone: this.bookingData.phone
          }
        }
      };

      // Save to Firestore
      const bookingId = await this.firestoreService.createBooking(bookingData);
      
      await loading.dismiss();
      
      console.log('Booking submitted:', bookingData);
      
      // Show success message
      const toast = await this.toastController.create({
        message: `Ticket booked successfully! Booking ID: ${bookingId}. Check your email for confirmation.`,
        duration: 4000,
        position: 'top',
        color: 'success',
        buttons: [
          {
            text: 'OK',
            role: 'cancel'
          }
        ]
      });
      await toast.present();

      // Reset form
      this.resetForm();

    } catch (error) {
      console.error('Error submitting booking:', error);
      
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'There was an error booking your ticket. Please try again.',
        buttons: ['OK']
      });
      await alert.present();
    } finally {
      this.isSubmitting = false;
    }
  }

  private validateForm(): boolean {
    if (!this.bookingData.name || !this.bookingData.identityCard || 
        !this.bookingData.birthDate || !this.bookingData.homePlace || 
        !this.bookingData.relationship || !this.bookingData.from || 
        !this.bookingData.to || !this.bookingData.date || 
        !this.bookingData.time || !this.bookingData.passengers) {
      this.showValidationError('Please fill in all required fields.');
      return false;
    }

    if (this.bookingData.from === this.bookingData.to) {
      this.showValidationError('Departure and destination cannot be the same.');
      return false;
    }

    const passengers = parseInt(this.bookingData.passengers);
    if (passengers < 1 || passengers > 10) {
      this.showValidationError('Number of passengers must be between 1 and 10.');
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private async showValidationError(message: string) {
    const alert = await this.alertController.create({
      header: 'Validation Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  private resetForm() {
    this.bookingData = {
      name: '',
      identityCard: '',
      birthDate: '',
      homePlace: '',
      relationship: '',
      phone: '',
      nationality: '',
      from: '',
      to: '',
      date: '',
      time: '',
      passengers: '',
      notes: ''
    };
    this.additionalPassengers = [];
  }

  async showMyBookings() {
    const alert = await this.alertController.create({
      header: 'My Bookings',
      message: this.getBookingsMessage(),
      buttons: [
        {
          text: 'Close',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  private getBookingsMessage(): string {
    if (this.bookings.length === 0) {
      return 'You have no bookings yet.';
    }

    let message = `You have ${this.bookings.length} booking(s):<br><br>`;
    
    this.bookings.forEach((booking, index) => {
      message += `<strong>Booking ${index + 1}:</strong><br>`;
      message += `ID: ${booking.id}<br>`;
      message += `Status: ${booking.status}<br>`;
      message += `Price: $${booking.totalPrice}<br>`;
      
      if (booking.ferryBooking) {
        message += `Route: ${booking.ferryBooking.from} → ${booking.ferryBooking.to}<br>`;
        message += `Date: ${booking.ferryBooking.travelDate}<br>`;
        message += `Time: ${booking.ferryBooking.travelTime}<br>`;
      }
      
      message += '<br>';
    });

    return message;
  }
}
