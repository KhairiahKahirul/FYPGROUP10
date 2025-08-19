import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapTrackerPage } from './map-tracker.page';

describe('MapTrackerPage', () => {
  let component: MapTrackerPage;
  let fixture: ComponentFixture<MapTrackerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTrackerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
