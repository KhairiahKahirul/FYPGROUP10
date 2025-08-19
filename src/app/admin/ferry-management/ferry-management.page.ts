import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Ferry {
  id: string;
  name: string;
  route: string;
  departureTime: string;
  arrivalTime: string;
  capacity: number;
  availableSeats: number;
  price: number;
  status: 'Active' | 'Maintenance' | 'Cancelled';
  operatingDays: string[];
}

@Component({
  selector: 'app-ferry-management',
  templateUrl: './ferry-management.page.html',
  styleUrls: ['./ferry-management.page.scss'],
  standalone: false,
})
export class FerryManagementPage implements OnInit {
  ferries: Ferry[] = [];
  filteredFerries: Ferry[] = [];
  searchTerm = '';
  selectedStatus = 'All';
  selectedRoute = 'All';
  isLoading = true;

  statuses = ['All', 'Active', 'Maintenance', 'Cancelled'];
  routes = ['All', 'Muara - Labuan', 'Labuan - Muara'];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadFerries();
  }

  loadFerries() {
    // Simulate loading data
    setTimeout(() => {
      this.ferries = [
        {
          id: 'FRY001',
          name: 'Brunei Express',
          route: 'Muara - Labuan',
          departureTime: '09:00',
          arrivalTime: '10:30',
          capacity: 120,
          availableSeats: 45,
          price: 25.00,
          status: 'Active',
          operatingDays: ['Monday', 'Wednesday', 'Friday', 'Sunday']
        },
        {
          id: 'FRY002',
          name: 'Labuan Express',
          route: 'Labuan - Muara',
          departureTime: '14:30',
          arrivalTime: '16:00',
          capacity: 120,
          availableSeats: 23,
          price: 25.00,
          status: 'Active',
          operatingDays: ['Monday', 'Wednesday', 'Friday', 'Sunday']
        },
        {
          id: 'FRY003',
          name: 'Island Hopper',
          route: 'Muara - Labuan',
          departureTime: '08:00',
          arrivalTime: '09:30',
          capacity: 80,
          availableSeats: 67,
          price: 25.00,
          status: 'Active',
          operatingDays: ['Tuesday', 'Thursday', 'Saturday']
        }
      ];
      
      this.filteredFerries = [...this.ferries];
      this.isLoading = false;
    }, 1000);
  }

  filterFerries() {
    this.filteredFerries = this.ferries.filter(ferry => {
      const matchesSearch = ferry.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           ferry.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           ferry.route.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.selectedStatus === 'All' || ferry.status === this.selectedStatus;
      const matchesRoute = this.selectedRoute === 'All' || ferry.route === this.selectedRoute;
      
      return matchesSearch && matchesStatus && matchesRoute;
    });
  }

  updateFerryStatus(ferryId: string, newStatus: string) {
    const ferry = this.ferries.find(f => f.id === ferryId);
    if (ferry) {
      ferry.status = newStatus as any;
      this.filterFerries();
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Active': return 'success';
      case 'Maintenance': return 'warning';
      case 'Cancelled': return 'danger';
      default: return 'medium';
    }
  }

  getOccupancyPercentage(ferry: Ferry): number {
    return ((ferry.capacity - ferry.availableSeats) / ferry.capacity) * 100;
  }

  getOccupancyColor(percentage: number): string {
    if (percentage >= 80) return 'danger';
    if (percentage >= 60) return 'warning';
    return 'success';
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }
} 