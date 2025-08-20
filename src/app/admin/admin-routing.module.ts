import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDashboardPage } from './admin-dashboard/admin-dashboard.page';
import { AdminLoginPage } from './admin-login/admin-login.page';
import { BookingManagementPage } from './booking-management/booking-management.page';
import { UserManagementPage } from './user-management/user-management.page';
import { FerryManagementPage } from './ferry-management/ferry-management.page';
import { ReportsPage } from './reports/reports.page';
import { NotificationsPage } from './notifications/notifications.page';
import { QrScannerPage } from './qr-scanner/qr-scanner.page';
import { AdminGuard } from './admin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: AdminLoginPage
  },
  {
    path: 'dashboard',
    component: AdminDashboardPage,
    canActivate: [AdminGuard]
  },
  {
    path: 'bookings',
    component: BookingManagementPage,
    canActivate: [AdminGuard]
  },
  {
    path: 'users',
    component: UserManagementPage,
    canActivate: [AdminGuard]
  },
  {
    path: 'ferries',
    component: FerryManagementPage,
    canActivate: [AdminGuard]
  },
  {
    path: 'reports',
    component: ReportsPage,
    canActivate: [AdminGuard]
  },
  {
    path: 'notifications',
    component: NotificationsPage,
    canActivate: [AdminGuard]
  },
  {
    path: 'qr-scanner',
    component: QrScannerPage,
    canActivate: [AdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {} 