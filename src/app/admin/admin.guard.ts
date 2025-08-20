import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(private router: Router) {}
  
  canActivate(): boolean {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    const adminUser = localStorage.getItem('adminUser');
    
    if (isAdminLoggedIn === 'true' && adminUser) {
      return true;
    } else {
      // Redirect to login if not authenticated
      this.router.navigate(['/admin/login']);
      return false;
    }
  }
} 