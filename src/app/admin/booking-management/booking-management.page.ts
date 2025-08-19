import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Booking {
  id: string;
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  ferryRoute: string;
  departureTime: string;
  returnTime?: string;
  passengers: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  amount: number;
  bookingDate: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
}

@Component({
  selector: 'app-booking-management',
  templateUrl: './booking-management.page.html',
  styleUrls: ['./booking-management.page.scss'],
  standalone: false,
})
export class BookingManagementPage implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  searchTerm = '';
  selectedStatus = 'All';
  selectedRoute = 'All';
  isLoading = true;

  statuses = ['All', 'Pending', 'Confirmed', 'Cancelled', 'Completed'];
  routes = ['All', 'Muara - Labuan', 'Labuan - Muara'];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    // Simulate loading data
    setTimeout(() => {
      this.bookings = [
        {
          id: 'BK001',
          passengerName: 'Ahmad bin Abdullah',
          passengerEmail: 'ahmad@example.com',
          passengerPhone: '+67312345678',
          ferryRoute: 'Muara - Labuan',
          departureTime: '2024-01-15 09:00',
          returnTime: '2024-01-17 16:00',
          passengers: 2,
          status: 'Confirmed',
          amount: 50.00,
          bookingDate: '2024-01-10',
          paymentStatus: 'Paid'
        },
        {
          id: 'BK002',
          passengerName: 'Siti binti Omar',
          passengerEmail: 'siti@example.com',
          passengerPhone: '+67312345679',
          ferryRoute: 'Labuan - Muara',
          departureTime: '2024-01-15 14:30',
          passengers: 1,
          status: 'Pending',
          amount: 25.00,
          bookingDate: '2024-01-11',
          paymentStatus: 'Pending'
        },
        {
          id: 'BK003',
          passengerName: 'Mohammad bin Hassan',
          passengerEmail: 'mohammad@example.com',
          passengerPhone: '+67312345680',
          ferryRoute: 'Muara - Labuan',
          departureTime: '2024-01-16 08:00',
          passengers: 3,
          status: 'Confirmed',
          amount: 75.00,
          bookingDate: '2024-01-12',
          paymentStatus: 'Paid'
        }
      ];
      
      this.filteredBookings = [...this.bookings];
      this.isLoading = false;
    }, 1000);
  }

  filterBookings() {
    this.filteredBookings = this.bookings.filter(booking => {
      const matchesSearch = booking.passengerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           booking.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           booking.passengerEmail.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.selectedStatus === 'All' || booking.status === this.selectedStatus;
      const matchesRoute = this.selectedRoute === 'All' || booking.ferryRoute === this.selectedRoute;
      
      return matchesSearch && matchesStatus && matchesRoute;
    });
  }

  updateBookingStatus(bookingId: string, newStatus: string) {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = newStatus as any;
      this.filterBookings();
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Confirmed': return 'success';
      case 'Pending': return 'warning';
      case 'Cancelled': return 'danger';
      case 'Completed': return 'primary';
      default: return 'medium';
    }
  }

  getPaymentStatusColor(status: string): string {
    switch (status) {
      case 'Paid': return 'success';
      case 'Pending': return 'warning';
      case 'Failed': return 'danger';
      default: return 'medium';
    }
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }
} 