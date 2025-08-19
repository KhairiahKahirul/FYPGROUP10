import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  activeUsers: number;
  availableFerries: number;
}

interface RecentBooking {
  id: string;
  passengerName: string;
  ferryRoute: string;
  departureTime: string;
  status: string;
  amount: number;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: false,
})
export class AdminDashboardPage implements OnInit {
  stats: DashboardStats = {
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    activeUsers: 0,
    availableFerries: 0
  };

  recentBookings: RecentBooking[] = [];
  isLoading = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Simulate loading data
    setTimeout(() => {
      this.stats = {
        totalBookings: 1247,
        pendingBookings: 23,
        completedBookings: 1189,
        cancelledBookings: 35,
        totalRevenue: 26400.00,
        activeUsers: 89,
        availableFerries: 12
      };

      this.recentBookings = [
        {
          id: 'BK001',
          passengerName: 'Ahmad bin Abdullah',
          ferryRoute: 'Muara - Labuan',
          departureTime: '2024-01-15 09:00',
          status: 'Confirmed',
          amount: 25.00
        },
        {
          id: 'BK002',
          passengerName: 'Siti binti Omar',
          ferryRoute: 'Labuan - Muara',
          departureTime: '2024-01-15 14:30',
          status: 'Pending',
          amount: 25.00
        },
        {
          id: 'BK003',
          passengerName: 'Mohammad bin Hassan',
          ferryRoute: 'Muara - Labuan',
          departureTime: '2024-01-16 08:00',
          status: 'Confirmed',
          amount: 25.00
        }
      ];

      this.isLoading = false;
    }, 1000);
  }

  navigateTo(page: string) {
    this.router.navigate([`/admin/${page}`]);
  }

  refreshData() {
    this.isLoading = true;
    this.loadDashboardData();
  }
} 