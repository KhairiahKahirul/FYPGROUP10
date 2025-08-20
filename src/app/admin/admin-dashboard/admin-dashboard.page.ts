import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: false
})
export class AdminDashboardPage implements OnInit {
  notifications: any[] = [];
  recentBookings: any[] = [];
  isLoading = true;
  currentAdmin: any = null;

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadCurrentAdmin();
    this.loadDashboardData();
  }

  loadCurrentAdmin() {
    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
      this.currentAdmin = JSON.parse(adminUser);
    } else {
      // If no admin user, redirect to login
      this.router.navigate(['/admin/login']);
    }
  }

  loadDashboardData() {
    // Simulate loading data
    setTimeout(() => {
      this.notifications = [
        {
          id: 1,
          type: 'payment_confirmed',
          message: 'Payment confirmed for Booking #BK001',
          timestamp: new Date(),
          isRead: false
        },
        {
          id: 2,
          type: 'booking_cancelled',
          message: 'Booking #BK002 has been cancelled',
          timestamp: new Date(Date.now() - 3600000),
          isRead: false
        },
        {
          id: 3,
          type: 'ferry_delayed',
          message: 'Ferry F001 delayed by 30 minutes',
          timestamp: new Date(Date.now() - 7200000),
          isRead: true
        },
        {
          id: 4,
          type: 'schedule_delayed',
          message: 'Schedule update: Next departure at 3:30 PM',
          timestamp: new Date(Date.now() - 10800000),
          isRead: true
        }
      ];

      this.recentBookings = [
        {
          id: 'BK001',
          passengerName: 'Ahmad bin Abdullah',
          passengerEmail: 'ahmad@email.com',
          passengerPhone: '+673 1234 5678',
          ferryRoute: 'Muara - Labuan',
          departureDate: '2025-08-20',
          departureTime: '09:00 AM',
          amount: 25.00,
          status: 'Confirmed'
        },
        {
          id: 'BK002',
          passengerName: 'Siti binti Omar',
          passengerEmail: 'siti@email.com',
          passengerPhone: '+673 2345 6789',
          ferryRoute: 'Labuan - Muara',
          departureDate: '2025-08-20',
          departureTime: '02:00 PM',
          amount: 35.00,
          status: 'Pending'
        }
      ];

      this.isLoading = false;
    }, 1000);
  }

  get unreadNotificationsCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  goToBookingView() {
    this.router.navigate(['/admin/bookings']);
  }

  goToChangeDelay() {
    this.router.navigate(['/admin/ferries']);
  }

  goToNotifications() {
    this.router.navigate(['/admin/notifications']);
  }

  openQRScanner() {
    this.router.navigate(['/admin/qr-scanner']);
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Confirm Logout',
      message: `Are you sure you want to logout, ${this.currentAdmin?.name}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Logout',
          handler: () => {
            // Clear admin session
            localStorage.removeItem('adminUser');
            localStorage.removeItem('isAdminLoggedIn');
            this.router.navigate(['/admin/login']);
          }
        }
      ]
    });
    await alert.present();
  }

  markNotificationAsRead(notificationId: number) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'payment_confirmed':
        return 'checkmark-circle';
      case 'booking_cancelled':
        return 'close-circle';
      case 'ferry_delayed':
        return 'time';
      case 'schedule_delayed':
        return 'calendar';
      default:
        return 'notifications';
    }
  }

  getNotificationColor(type: string): string {
    switch (type) {
      case 'payment_confirmed':
        return 'success';
      case 'booking_cancelled':
        return 'danger';
      case 'ferry_delayed':
        return 'warning';
      case 'schedule_delayed':
        return 'warning';
      default:
        return 'primary';
    }
  }

  getRoleDisplayName(role: string): string {
    switch (role) {
      case 'admin1':
        return 'Admin One';
      case 'admin2':
        return 'Admin Two';
      default:
        return role;
    }
  }
} 