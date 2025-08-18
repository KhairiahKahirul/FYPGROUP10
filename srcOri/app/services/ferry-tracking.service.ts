import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Ferry {
  id: string;
  name: string;
  lat: number;
  lng: number;
  heading: number;
  speed: number;
  capacity: number;
  currentPassengers: number;
  route: string;
  status: 'active' | 'docked' | 'maintenance';
  nextStop: string;
  estimatedArrival: string;
}

export interface FerryRoute {
  id: string;
  name: string;
  coordinates: [number, number][];
  stops: { name: string; lat: number; lng: number }[];
  duration: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class FerryTrackingService {
  private ferriesSubject = new BehaviorSubject<Ferry[]>([]);
  public ferries$ = this.ferriesSubject.asObservable();

  private routesSubject = new BehaviorSubject<FerryRoute[]>([]);
  public routes$ = this.routesSubject.asObservable();

  constructor() {
    this.initializeMockData();
    this.startFerrySimulation();
  }

  private initializeMockData() {
    // Mock ferry routes
    const routes: FerryRoute[] = [
      {
        id: 'route1',
        name: 'Mainland - Island Express',
        coordinates: [
          [14.5994, 120.9842], // Manila Bay area
          [14.6042, 120.9822],
          [14.6089, 120.9802],
          [14.6136, 120.9782],
          [14.6183, 120.9762]
        ],
        stops: [
          { name: 'Mainland Terminal', lat: 14.5994, lng: 120.9842 },
          { name: 'Island Terminal', lat: 14.6183, lng: 120.9762 }
        ],
        duration: '45 min',
        color: '#3498db'
      },
      {
        id: 'route2',
        name: 'North Coast Route',
        coordinates: [
          [14.6183, 120.9762],
          [14.6230, 120.9742],
          [14.6277, 120.9722],
          [14.6324, 120.9702]
        ],
        stops: [
          { name: 'Island Terminal', lat: 14.6183, lng: 120.9762 },
          { name: 'North Port', lat: 14.6324, lng: 120.9702 }
        ],
        duration: '25 min',
        color: '#e74c3c'
      }
    ];

    // Mock ferries
    const ferries: Ferry[] = [
      {
        id: 'ferry1',
        name: 'SeaBird Express',
        lat: 14.5994,
        lng: 120.9842,
        heading: 45,
        speed: 12,
        capacity: 150,
        currentPassengers: 87,
        route: 'Mainland - Island Express',
        status: 'active',
        nextStop: 'Island Terminal',
        estimatedArrival: '2:30 PM'
      },
      {
        id: 'ferry2',
        name: 'Ocean Wave',
        lat: 14.6136,
        lng: 120.9782,
        heading: 225,
        speed: 10,
        capacity: 120,
        currentPassengers: 45,
        route: 'Mainland - Island Express',
        status: 'active',
        nextStop: 'Mainland Terminal',
        estimatedArrival: '3:15 PM'
      },
      {
        id: 'ferry3',
        name: 'Blue Current',
        lat: 14.6183,
        lng: 120.9762,
        heading: 0,
        speed: 0,
        capacity: 200,
        currentPassengers: 0,
        route: 'North Coast Route',
        status: 'docked',
        nextStop: 'North Port',
        estimatedArrival: '4:00 PM'
      }
    ];

    this.routesSubject.next(routes);
    this.ferriesSubject.next(ferries);
  }

  private startFerrySimulation() {
    // Update ferry positions every 5 seconds for realistic tracking
    interval(5000).pipe(
      map(() => {
        const currentFerries = this.ferriesSubject.value;
        return currentFerries.map(ferry => {
          if (ferry.status === 'active') {
            // Simulate movement along route
            const movement = 0.0001; // Small lat/lng movement
            return {
              ...ferry,
              lat: ferry.lat + (Math.random() - 0.5) * movement,
              lng: ferry.lng + (Math.random() - 0.5) * movement,
              heading: ferry.heading + (Math.random() - 0.5) * 10,
              speed: ferry.speed + (Math.random() - 0.5) * 2
            };
          }
          return ferry;
        });
      })
    ).subscribe(updatedFerries => {
      this.ferriesSubject.next(updatedFerries);
    });
  }

  getFerryById(id: string): Observable<Ferry | undefined> {
    return this.ferries$.pipe(
      map(ferries => ferries.find(ferry => ferry.id === id))
    );
  }

  getRoutes(): Observable<FerryRoute[]> {
    return this.routes$;
  }
}
