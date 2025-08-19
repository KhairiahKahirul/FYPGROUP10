import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FerryTrackingService, Ferry, FerryRoute } from '../services/ferry-tracking.service';
import { Observable, Subscription } from 'rxjs';

declare var L: any;

@Component({
  selector: 'app-tstingmap',
  templateUrl: './tstingmap.page.html',
  styleUrls: ['./tstingmap.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class TstingmapPage implements OnInit, OnDestroy {
  public ferries$: Observable<Ferry[]>;
  public routes$: Observable<FerryRoute[]>;
  
  // View toggle
  public showTicketView = true;
  public showRoutes = true;
  public isLoading = true;

  // Ticket booking data
  public selectedRoute: FerryRoute | null = null;
  public passengerCount = 1;
  public selectedDate = new Date();
  public departureTime = '09:00 AM';
  public arrivalTime = '09:45 AM';
  public ticketNumber = this.generateTicketNumber();
  public ticketPrice = 0;
  public assignedFerry: Ferry | null = null;

  private map: any;
  private ferryMarkers: Map<string, any> = new Map();
  private routePolylines: Map<string, any> = new Map();
  private subscriptions: Subscription[] = [];

  constructor(private ferryTrackingService: FerryTrackingService) {
    this.ferries$ = this.ferryTrackingService.ferries$;
    this.routes$ = this.ferryTrackingService.routes$;
  }

  ngOnInit() {
    setTimeout(() => {
      if (!this.showTicketView) {
        this.initializeMap();
      }
    }, 100);
    this.subscribeToFerryUpdates();
    this.subscribeToRoutes();
    this.loadRouteDefaults();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.map) {
      this.map.remove();
    }
  }

  private initializeMap() {
    setTimeout(() => {
      // Initialize map centered on Manila Bay area
      this.map = L.map('ferry-map').setView([14.6042, 120.9822], 12);

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      // Add custom controls
      this.addMapControls();
      
      this.isLoading = false;
    }, 100);
  }

  private addMapControls() {
    // Add scale control
    L.control.scale().addTo(this.map);
  }

  private subscribeToFerryUpdates() {
    const ferrySub = this.ferries$.subscribe(ferries => {
      this.updateFerryMarkers(ferries);
    });
    this.subscriptions.push(ferrySub);
  }

  private subscribeToRoutes() {
    const routeSub = this.routes$.subscribe(routes => {
      this.updateRoutePolylines(routes);
    });
    this.subscriptions.push(routeSub);
  }

  private updateFerryMarkers(ferries: Ferry[]) {
    if (!this.map) return;

    // Remove existing markers
    this.ferryMarkers.forEach(marker => {
      this.map.removeLayer(marker);
    });
    this.ferryMarkers.clear();

    // Add new markers for each ferry
    ferries.forEach(ferry => {
      const marker = this.createFerryMarker(ferry);
      marker.addTo(this.map);
      this.ferryMarkers.set(ferry.id, marker);
    });
  }

  private createFerryMarker(ferry: Ferry): any {
    // Custom ferry icon based on status
    const iconColor = ferry.status === 'active' ? 'blue' : 
                     ferry.status === 'docked' ? 'orange' : 'red';
    
    const ferryIcon = L.divIcon({
      html: `<div style="background: ${iconColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      className: 'ferry-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    const marker = L.marker([ferry.lat, ferry.lng], { icon: ferryIcon });

    // Add popup with ferry information
    const popupContent = `
      <div class="ferry-popup">
        <h4>${ferry.name}</h4>
        <p><strong>Route:</strong> ${ferry.route}</p>
        <p><strong>Status:</strong> <span class="status-${ferry.status}">${ferry.status}</span></p>
        <p><strong>Passengers:</strong> ${ferry.currentPassengers}/${ferry.capacity}</p>
        <p><strong>Next Stop:</strong> ${ferry.nextStop}</p>
        <p><strong>ETA:</strong> ${ferry.estimatedArrival}</p>
        ${ferry.status === 'active' ? `<p><strong>Speed:</strong> ${ferry.speed} knots</p>` : ''}
      </div>
    `;

    marker.bindPopup(popupContent);
    return marker;
  }

  private updateRoutePolylines(routes: FerryRoute[]) {
    if (!this.map) return;

    // Remove existing route polylines
    this.routePolylines.forEach(polyline => {
      this.map.removeLayer(polyline);
    });
    this.routePolylines.clear();

    if (!this.showRoutes) return;

    // Add new route polylines
    routes.forEach(route => {
      const polyline = L.polyline(route.coordinates, {
        color: route.color,
        weight: 3,
        opacity: 0.7
      });

      polyline.bindPopup(`
        <div class="route-popup">
          <h4>${route.name}</h4>
          <p><strong>Duration:</strong> ${route.duration}</p>
          <p><strong>Stops:</strong> ${route.stops.map(stop => stop.name).join(' → ')}</p>
        </div>
      `);

      polyline.addTo(this.map);
      this.routePolylines.set(route.id, polyline);

      // Add stop markers
      route.stops.forEach(stop => {
        const stopIcon = L.divIcon({
          html: `<div style="background: white; border: 2px solid ${route.color}; width: 12px; height: 12px; border-radius: 50%;"></div>`,
          className: 'stop-marker',
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        });

        L.marker([stop.lat, stop.lng], { icon: stopIcon })
          .bindPopup(`<strong>${stop.name}</strong>`)
          .addTo(this.map);
      });
    });
  }

  public focusOnFerry(ferry: Ferry) {
    if (this.map && this.ferryMarkers.has(ferry.id)) {
      this.map.setView([ferry.lat, ferry.lng], 15);
      this.ferryMarkers.get(ferry.id).openPopup();
    }
  }

  public centerMap() {
    if (this.map) {
      this.map.setView([14.6042, 120.9822], 12);
    }
  }

  public toggleRoutes() {
    this.showRoutes = !this.showRoutes;
    
    if (this.showRoutes) {
      // Re-subscribe to routes to redraw them
      this.routes$.subscribe(routes => {
        this.updateRoutePolylines(routes);
      });
    } else {
      // Remove all route polylines
      this.routePolylines.forEach(polyline => {
        this.map.removeLayer(polyline);
      });
      this.routePolylines.clear();
    }
  }

  public refreshData() {
    this.isLoading = true;
    
    // Simulate refresh delay
    setTimeout(() => {
      // Re-subscribe to get latest data
      this.subscribeToFerryUpdates();
      this.subscribeToRoutes();
      this.isLoading = false;
    }, 1000);
  }

  // Ticket View Methods
  public toggleView() {
    this.showTicketView = !this.showTicketView;
    
    if (!this.showTicketView && !this.map) {
      setTimeout(() => {
        this.initializeMap();
      }, 100);
    }
  }

  public selectRoute(route: FerryRoute) {
    this.selectedRoute = route;
    this.calculateTicketPrice();
    this.assignFerry();
    this.calculateTimes();
  }

  public increasePassengers() {
    if (this.passengerCount < 10) {
      this.passengerCount++;
      this.calculateTicketPrice();
    }
  }

  public decreasePassengers() {
    if (this.passengerCount > 1) {
      this.passengerCount--;
      this.calculateTicketPrice();
    }
  }

  public proceedToPayment() {
    if (!this.selectedRoute) return;
    
    // Here you would navigate to payment page
    console.log('Proceeding to payment for:', {
      route: this.selectedRoute.name,
      passengers: this.passengerCount,
      price: this.ticketPrice,
      ticketNumber: this.ticketNumber
    });
    
    // For demo, show success message
    alert(`Booking confirmed! Ticket #${this.ticketNumber} for ${this.passengerCount} passenger(s) on ${this.selectedRoute.name}.`);
  }

  private loadRouteDefaults() {
    // Auto-select first route when available
    this.routes$.subscribe(routes => {
      if (routes.length > 0 && !this.selectedRoute) {
        this.selectRoute(routes[0]);
      }
    });
  }

  private calculateTicketPrice() {
    if (!this.selectedRoute) return;
    
    // Base price calculation
    const basePrice = this.selectedRoute.name.includes('Express') ? 150 : 120;
    this.ticketPrice = basePrice * this.passengerCount;
  }

  private assignFerry() {
    if (!this.selectedRoute) return;
    
    // Assign ferry based on route
    this.ferries$.subscribe(ferries => {
      const routeFerries = ferries.filter(ferry => 
        ferry.route === this.selectedRoute?.name
      );
      
      if (routeFerries.length > 0) {
        this.assignedFerry = routeFerries[0];
      }
    });
  }

  private calculateTimes() {
    if (!this.selectedRoute) return;
    
    // Calculate departure and arrival times based on route duration
    const now = new Date();
    const depHour = 9 + Math.floor(Math.random() * 8); // 9 AM to 5 PM
    const depMinute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
    
    const departure = new Date(this.selectedDate);
    departure.setHours(depHour, depMinute, 0);
    
    const durationMinutes = parseInt(this.selectedRoute.duration) || 45;
    const arrival = new Date(departure.getTime() + durationMinutes * 60000);
    
    this.departureTime = departure.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    this.arrivalTime = arrival.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }

  private generateTicketNumber(): string {
    const prefix = 'SB';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  }
}
