import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular';
import { FirestoreService, Booking } from '../services/firestore.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

declare var L: any;



@Component({
  selector: 'app-map-tracker',
  templateUrl: './map-tracker.page.html',
  styleUrls: ['./map-tracker.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class MapTrackerPage implements OnInit, OnDestroy {
  private map: any;
  private routeLine: any;
  private serasaMarker: any;
  private labuanMarker: any;
  
  // Route management
  public routeDirection: 'serasa-to-labuan' | 'labuan-to-serasa' = 'serasa-to-labuan';
  public isTracking = true;
  public routeDistance = '';
  public routeDuration = '';
  
  // Ferry locations
  private serasaPort = { 
    lat: 4.9456, 
    lng: 114.9378, 
    name: 'Serasa Port', 
    country: 'Brunei Darussalam'
  };
  
  private labuanPort = { 
    lat: 5.2767, 
    lng: 115.2417, 
    name: 'Port Labuan', 
    country: 'Malaysia'
  };

  // Current route data
  public currentRoute = {
    from: this.serasaPort,
    to: this.labuanPort
  };

  // User bookings
  public userBookings: Booking[] = [];
  public activeBooking: Booking | null = null;
  public hasBookings = false;
  private bookingsSubscription: Subscription | null = null;

  // Ferry speed in knots
  private readonly FERRY_SPEED_KNOTS = 25;
  private readonly NAUTICAL_MILE_TO_KM = 1.852;

  constructor(
    private navController: NavController,
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.initializeMap();
      this.calculateInitialRoute();
      this.loadUserBookings();
    }, 100);
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
    if (this.bookingsSubscription) {
      this.bookingsSubscription.unsubscribe();
    }
  }

  private initializeMap() {
    // Initialize map centered between Serasa and Labuan
    this.map = L.map('tracking-map').setView([5.1, 115.1], 9);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Disable map interactions for cleaner view
    this.map.dragging.disable();
    this.map.touchZoom.disable();
    this.map.doubleClickZoom.disable();
    this.map.scrollWheelZoom.disable();
    this.map.boxZoom.disable();
    this.map.keyboard.disable();

    // Add port markers
    this.addPortMarkers();
    
    // Draw initial route
    this.drawRoute();
  }

  private addPortMarkers() {
    // Serasa Port marker
    const serasaIcon = L.divIcon({
      html: `<div class="port-marker serasa-marker">
               <div class="port-icon">🏢</div>
               <div class="port-label">SERASA</div>
             </div>`,
      className: 'port-marker-container',
      iconSize: [50, 60],
      iconAnchor: [25, 50]
    });

    this.serasaMarker = L.marker([this.serasaPort.lat, this.serasaPort.lng], { icon: serasaIcon })
      .addTo(this.map);

    // Labuan Port marker
    const labuanIcon = L.divIcon({
      html: `<div class="port-marker labuan-marker">
               <div class="port-icon">🏢</div>
               <div class="port-label">LABUAN</div>
             </div>`,
      className: 'port-marker-container',
      iconSize: [50, 60],
      iconAnchor: [25, 50]
    });

    this.labuanMarker = L.marker([this.labuanPort.lat, this.labuanPort.lng], { icon: labuanIcon })
      .addTo(this.map);
  }

  private drawRoute() {
    // Remove existing route line
    if (this.routeLine) {
      this.map.removeLayer(this.routeLine);
    }

    // Draw route line between ports
    this.routeLine = L.polyline([
      [this.serasaPort.lat, this.serasaPort.lng],
      [this.labuanPort.lat, this.labuanPort.lng]
    ], {
      color: '#2196F3',
      weight: 4,
      opacity: 0.8,
      dashArray: '10, 10'
    }).addTo(this.map);
  }

  private calculateInitialRoute() {
    const distance = this.calculateDistance(
      this.serasaPort.lat,
      this.serasaPort.lng,
      this.labuanPort.lat,
      this.labuanPort.lng
    );

    const timeInHours = distance / (this.FERRY_SPEED_KNOTS * this.NAUTICAL_MILE_TO_KM);
    
    this.routeDistance = `${distance.toFixed(1)} km`;
    this.routeDuration = this.formatTravelTime(timeInHours);
  }

  public toggleRoute() {
    if (this.routeDirection === 'serasa-to-labuan') {
      this.routeDirection = 'labuan-to-serasa';
      this.currentRoute = {
        from: this.labuanPort,
        to: this.serasaPort
      };
    } else {
      this.routeDirection = 'serasa-to-labuan';
      this.currentRoute = {
        from: this.serasaPort,
        to: this.labuanPort
      };
    }
  }

  public centerMap() {
    // Center between Serasa and Labuan ports
    this.map.setView([5.1, 115.1], 9);
  }

  // Load user bookings
  private async loadUserBookings() {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        return;
      }

      this.bookingsSubscription = this.firestoreService
        .getUserBookingsRealtime(currentUser.uid)
        .subscribe({
          next: (bookings) => {
            this.userBookings = bookings;
            this.hasBookings = bookings.length > 0;
            
            // Find active booking (pending or confirmed)
            this.activeBooking = bookings.find(booking => 
              booking.status === 'pending' || booking.status === 'confirmed'
            ) || null;
            
            // If we have an active booking, set the route based on it
            if (this.activeBooking && this.activeBooking.ferryBooking) {
              this.setRouteFromBooking(this.activeBooking);
            }
          },
          error: (error) => {
            console.error('Error loading bookings:', error);
          }
        });
    } catch (error) {
      console.error('Error loading user bookings:', error);
    }
  }

  // Set route based on booking
  private setRouteFromBooking(booking: Booking) {
    if (booking.ferryBooking) {
      // Determine direction based on booking from/to
      const fromSerasa = booking.ferryBooking.from.toLowerCase().includes('serasa');
      const toLabuan = booking.ferryBooking.to.toLowerCase().includes('labuan');
      
      if (fromSerasa && toLabuan) {
        this.routeDirection = 'serasa-to-labuan';
        this.currentRoute = {
          from: this.serasaPort,
          to: this.labuanPort
        };
      } else {
        this.routeDirection = 'labuan-to-serasa';
        this.currentRoute = {
          from: this.labuanPort,
          to: this.serasaPort
        };
      }
    }
  }

  // Get booking status display
  public getBookingStatusColor(status: string): string {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'medium';
    }
  }

  // Get booking status text
  public getBookingStatusText(status: string): string {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  }

  // Format date for display
  public formatBookingDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  public goBack() {
    this.navController.back();
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadian(lat2 - lat1);
    const dLng = this.toRadian(lng2 - lng1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadian(lat1)) * Math.cos(this.toRadian(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadian(degree: number): number {
    return degree * (Math.PI / 180);
  }



  private formatTravelTime(hours: number): string {
    const totalMinutes = Math.round(hours * 60);
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    } else {
      return `${mins}m`;
    }
  }



}