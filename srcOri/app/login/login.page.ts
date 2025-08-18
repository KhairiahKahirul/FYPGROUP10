import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const result = await this.authService.signIn(this.email, this.password);
      
      if (result.success) {
        // Login successful, navigate to home page
        this.router.navigate(['/home']);
      } else {
        // Login failed, show error message
        this.errorMessage = this.getErrorMessage(result.error);
      }
    } catch (error) {
      this.errorMessage = 'An unexpected error occurred. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  private getErrorMessage(error: string): string {
    switch (error) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return 'Login failed. Please check your credentials and try again.';
    }
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
} 