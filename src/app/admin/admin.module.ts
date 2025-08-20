import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardPage } from './admin-dashboard/admin-dashboard.page';
import { AdminLoginPage } from './admin-login/admin-login.page';
import { BookingManagementPage } from './booking-management/booking-management.page';
import { UserManagementPage } from './user-management/user-management.page';
import { FerryManagementPage } from './ferry-management/ferry-management.page';
import { ReportsPage } from './reports/reports.page';
import { NotificationsPage } from './notifications/notifications.page';
import { QrScannerPage } from './qr-scanner/qr-scanner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    AdminRoutingModule
  ],
  declarations: [
    AdminDashboardPage,
    AdminLoginPage,
    BookingManagementPage,
    UserManagementPage,
    FerryManagementPage,
    ReportsPage,
    NotificationsPage,
    QrScannerPage
  ]
})
export class AdminModule {} 