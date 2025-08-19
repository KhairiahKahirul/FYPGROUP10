import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  totalBookings: number;
  totalSpent: number;
  status: 'Active' | 'Inactive' | 'Suspended';
  lastLogin: string;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.page.html',
  styleUrls: ['./user-management.page.scss'],
  standalone: false,
})
export class UserManagementPage implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';
  selectedStatus = 'All';
  isLoading = true;

  statuses = ['All', 'Active', 'Inactive', 'Suspended'];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    // Simulate loading data
    setTimeout(() => {
      this.users = [
        {
          id: 'USR001',
          name: 'Ahmad bin Abdullah',
          email: 'ahmad@example.com',
          phone: '+67312345678',
          registrationDate: '2023-12-01',
          totalBookings: 5,
          totalSpent: 125.00,
          status: 'Active',
          lastLogin: '2024-01-14 10:30'
        },
        {
          id: 'USR002',
          name: 'Siti binti Omar',
          email: 'siti@example.com',
          phone: '+67312345679',
          registrationDate: '2023-11-15',
          totalBookings: 3,
          totalSpent: 75.00,
          status: 'Active',
          lastLogin: '2024-01-13 15:45'
        },
        {
          id: 'USR003',
          name: 'Mohammad bin Hassan',
          email: 'mohammad@example.com',
          phone: '+67312345680',
          registrationDate: '2023-10-20',
          totalBookings: 0,
          totalSpent: 0.00,
          status: 'Inactive',
          lastLogin: '2023-12-05 09:15'
        }
      ];
      
      this.filteredUsers = [...this.users];
      this.isLoading = false;
    }, 1000);
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           user.id.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.selectedStatus === 'All' || user.status === this.selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }

  updateUserStatus(userId: string, newStatus: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.status = newStatus as any;
      this.filterUsers();
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'medium';
      case 'Suspended': return 'danger';
      default: return 'medium';
    }
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }
} 