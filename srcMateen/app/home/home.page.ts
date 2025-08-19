import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit, OnDestroy {
  
  private currentThemeIndex = 0;
  private themes = ['', 'theme-sunset', 'theme-emerald', 'theme-purple', 'theme-teal'];
  private themeNames = ['Ocean Blue', 'Sunset Orange', 'Emerald Green', 'Purple Royal', 'Teal Ocean'];
  
  currentUser: User | null = null;
  
  // Advertisement carousel data
  currentAdIndex = 0;
  carouselInterval: any;
  advertisements = [
    {
      id: 1,
      title: 'Summer Special!',
      description: 'Get 20% off on all island routes this summer',
      icon: 'sunny-outline',
      buttonText: 'Learn More',
      action: 'summer-deal',
      backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 2,
      title: 'Family Package',
      description: 'Book for 4+ passengers and save big',
      icon: 'people-outline',
      buttonText: 'Book Now',
      action: 'family-package',
      backgroundImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 3,
      title: 'Early Bird Discounts',
      description: 'Book 7 days ahead and get exclusive rates',
      icon: 'time-outline',
      buttonText: 'View Deals',
      action: 'early-bird',
      backgroundImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    }
  ];
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Subscribe to user changes
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
      
      // Start carousel auto-play only for logged in users
      if (user) {
        this.startCarousel();
      } else {
        this.stopCarousel();
      }
    });
  }

  ngOnDestroy() {
    this.stopCarousel();
  }

  onThemeChange() {
    // Remove current theme
    document.body.classList.remove(...this.themes);
    
    // Move to next theme
    this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
    
    // Apply new theme
    if (this.themes[this.currentThemeIndex]) {
      document.body.classList.add(this.themes[this.currentThemeIndex]);
    }
    
    console.log(`Theme changed to: ${this.themeNames[this.currentThemeIndex]}`);
  }

  async onLogout() {
    try {
      await this.authService.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  onAdminLogin() {
    this.router.navigate(['/login']);
  }

  onViewSchedule() {
    console.log('View Schedule clicked');
    // Add schedule view logic here
  }

  onContactUs() {
    console.log('Contact Us clicked');
    // Add contact logic here
  }

  // Carousel functionality
  startCarousel() {
    this.stopCarousel(); // Clear any existing interval
    this.carouselInterval = setInterval(() => {
      this.nextSlide();
    }, 4000); // Change slide every 4 seconds
  }

  stopCarousel() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
      this.carouselInterval = null;
    }
  }

  nextSlide() {
    this.currentAdIndex = (this.currentAdIndex + 1) % this.advertisements.length;
  }

  goToSlide(index: number) {
    this.currentAdIndex = index;
    this.stopCarousel();
    // Restart carousel after manual navigation
    setTimeout(() => {
      if (this.currentUser) {
        this.startCarousel();
      }
    }, 6000); // Wait 6 seconds before auto-play resumes
  }

  onAdClick(ad: any) {
    console.log('Advertisement clicked:', ad);
    // Handle different ad actions
    switch (ad.action) {
      case 'summer-deal':
        // Navigate to summer deals page or show more info
        break;
      case 'family-package':
        // Navigate to family booking page
        break;
      case 'early-bird':
        // Navigate to early bird deals
        break;
      default:
        console.log('Unknown ad action:', ad.action);
    }
  }
}