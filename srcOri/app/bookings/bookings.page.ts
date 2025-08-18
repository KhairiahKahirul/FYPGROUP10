import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, ActionSheetController, LoadingController } from '@ionic/angular';
import { FirestoreService, Booking } from '../services/firestore.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  bookings: Booking[] = [];
  loading = true;
  private subscription: Subscription | null = null;

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private loadingController: LoadingController
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
        console.error('User not authenticated');
        return;
      }

      // Subscribe to real-time updates
      this.subscription = this.firestoreService
        .getUserBookingsRealtime(currentUser.uid)
        .subscribe({
          next: (bookings) => {
            this.bookings = bookings;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading bookings:', error);
            this.loading = false;
          }
        });
    } catch (error) {
      console.error('Error loading bookings:', error);
      this.loading = false;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
      case 'completed':
        return 'medium';
      default:
        return 'primary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'cancelled':
        return 'close-circle';
      case 'completed':
        return 'checkmark-done-circle';
      default:
        return 'help-circle';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  getBookingType(booking: Booking): string {
    if (booking.ferryBooking) {
      return 'Ferry Booking';
    }
    return 'Hotel Booking';
  }

  getBookingDetails(booking: Booking): string {
    if (booking.ferryBooking) {
      return `${booking.ferryBooking.from} → ${booking.ferryBooking.to}`;
    }
    return `Nationality: ${booking.nationality}`;
  }

  async showBookingActions(booking: Booking) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Booking Actions',
      buttons: [
        {
          text: 'View Details',
          icon: 'eye',
          handler: () => {
            this.showBookingDetails(booking);
          }
        },
        {
          text: 'Cancel Booking',
          icon: 'close-circle',
          role: 'destructive',
          handler: () => {
            this.cancelBooking(booking);
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async showBookingDetails(booking: Booking) {
    let message = `
      <strong>Booking ID:</strong> ${booking.id}<br>
      <strong>Type:</strong> ${this.getBookingType(booking)}<br>
      <strong>Status:</strong> ${booking.status}<br>
      <strong>Total Price:</strong> $${booking.totalPrice}<br>
      <strong>Created:</strong> ${this.formatDate(booking.createdAt)}<br>
    `;

    if (booking.ferryBooking) {
      message += `
        <strong>From:</strong> ${booking.ferryBooking.from}<br>
        <strong>To:</strong> ${booking.ferryBooking.to}<br>
        <strong>Travel Date:</strong> ${booking.ferryBooking.travelDate}<br>
        <strong>Travel Time:</strong> ${booking.ferryBooking.travelTime}<br>
        <strong>Passengers:</strong> ${booking.guests}<br>
        <strong>Main Passenger:</strong> ${booking.ferryBooking.mainPassenger.name}<br>
      `;
    } else {
      message += `
        <strong>Nationality:</strong> ${booking.nationality}<br>
        <strong>Check-in:</strong> ${this.formatDate(booking.checkIn)}<br>
        <strong>Check-out:</strong> ${this.formatDate(booking.checkOut)}<br>
        <strong>Guests:</strong> ${booking.guests}<br>
      `;
    }

    if (booking.specialRequests) {
      message += `<strong>Special Requests:</strong> ${booking.specialRequests}<br>`;
    }

    const alert = await this.alertController.create({
      header: 'Booking Details',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async cancelBooking(booking: Booking) {
    const alert = await this.alertController.create({
      header: 'Cancel Booking',
      message: 'Are you sure you want to cancel this booking?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: async () => {
            try {
              const loading = await this.loadingController.create({
                message: 'Cancelling booking...'
              });
              await loading.present();

              await this.firestoreService.updateBooking(booking.id!, { status: 'cancelled' });
              
              await loading.dismiss();
              await this.showAlert('Success', 'Booking cancelled successfully');
            } catch (error) {
              console.error('Error cancelling booking:', error);
              await this.showAlert('Error', 'Failed to cancel booking');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  refreshBookings(event: any) {
    this.loadBookings();
    event.target.complete();
  }
}
