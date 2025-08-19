import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDashboardPage } from './admin-dashboard/admin-dashboard.page';
import { AdminLoginPage } from './admin-login/admin-login.page';
import { BookingManagementPage } from './booking-management/booking-management.page';
import { UserManagementPage } from './user-management/user-management.page';
import { FerryManagementPage } from './ferry-management/ferry-management.page';
import { ReportsPage } from './reports/reports.page';

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
    component: AdminDashboardPage
  },
  {
    path: 'bookings',
    component: BookingManagementPage
  },
  {
    path: 'users',
    component: UserManagementPage
  },
  {
    path: 'ferries',
    component: FerryManagementPage
  },
  {
    path: 'reports',
    component: ReportsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {} 