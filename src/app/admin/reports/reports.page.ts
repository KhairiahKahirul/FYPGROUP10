import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface RevenueData {
  month: string;
  revenue: number;
  bookings: number;
}

interface RouteData {
  route: string;
  bookings: number;
  revenue: number;
  occupancy: number;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
  standalone: false,
})
export class ReportsPage implements OnInit {
  revenueData: RevenueData[] = [];
  routeData: RouteData[] = [];
  isLoading = true;
  selectedPeriod = 'month';

  periods = ['week', 'month', 'quarter', 'year'];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    // Simulate loading data
    setTimeout(() => {
      this.revenueData = [
        { month: 'Jan', revenue: 45678.50, bookings: 1247 },
        { month: 'Feb', revenue: 52345.75, bookings: 1389 },
        { month: 'Mar', revenue: 48923.25, bookings: 1156 },
        { month: 'Apr', revenue: 56789.00, bookings: 1456 },
        { month: 'May', revenue: 61234.50, bookings: 1678 },
        { month: 'Jun', revenue: 57890.25, bookings: 1345 }
      ];

      this.routeData = [
        {
          route: 'Muara - Labuan',
          bookings: 567,
          revenue: 14175.00,
          occupancy: 78.5
        },
        {
          route: 'Labuan - Muara',
          bookings: 489,
          revenue: 12225.00,
          occupancy: 72.3
        }
      ];

      this.isLoading = false;
    }, 1000);
  }

  getTotalRevenue(): number {
    return this.revenueData.reduce((sum, data) => sum + data.revenue, 0);
  }

  getTotalBookings(): number {
    return this.revenueData.reduce((sum, data) => sum + data.bookings, 0);
  }

  getAverageRevenue(): number {
    return this.getTotalRevenue() / this.revenueData.length;
  }

  getTopRoute(): RouteData {
    return this.routeData.reduce((top, current) => 
      current.revenue > top.revenue ? current : top
    );
  }

  getOccupancyColor(occupancy: number): string {
    if (occupancy >= 80) return 'success';
    if (occupancy >= 60) return 'warning';
    return 'danger';
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }
} 