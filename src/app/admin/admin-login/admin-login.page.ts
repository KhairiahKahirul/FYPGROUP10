import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.page.html',
  styleUrls: ['./admin-login.page.scss'],
  standalone: false
})
export class AdminLoginPage {
  loginForm: FormGroup;
  isLoading = false;
  
  // Admin accounts
  adminAccounts = [
    {
      username: 'admin1',
      password: 'admin123',
      name: 'Admin One',
      role: 'admin1'
    },
    {
      username: 'admin2', 
      password: 'admin456',
      name: 'Admin Two',
      role: 'admin2'
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private alertController: AlertController
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      const { username, password } = this.loginForm.value;
      
      // Simulate authentication delay
      setTimeout(() => {
        const admin = this.authenticateAdmin(username, password);
        
        if (admin) {
          // Store admin session
          localStorage.setItem('isAdminLoggedIn', 'true');
          localStorage.setItem('adminUser', JSON.stringify(admin));
          
          // Navigate to dashboard
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.showLoginError();
        }
        
        this.isLoading = false;
      }, 1000);
    } else {
      this.showLoginError();
    }
  }

  private authenticateAdmin(username: string, password: string): any {
    return this.adminAccounts.find(account => 
      account.username === username && account.password === password
    );
  }

  private async showLoginError() {
    const alert = await this.alertController.create({
      header: 'Login Failed',
      message: 'Invalid username or password. Please try again.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async showAvailableAccounts() {
    const alert = await this.alertController.create({
      header: 'Available Admin Accounts',
      message: `
        <div style="text-align: left;">
          <p><strong>Admin 1:</strong></p>
          <p>Username: admin1</p>
          <p>Password: admin123</p>
          <br>
          <p><strong>Admin 2:</strong></p>
          <p>Username: admin2</p>
          <p>Password: admin456</p>
        </div>
      `,
      buttons: ['OK']
    });
    await alert.present();
  }

  clearForm() {
    this.loginForm.reset();
  }
} 