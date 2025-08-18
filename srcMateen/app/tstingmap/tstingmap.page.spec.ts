import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TstingmapPage } from './tstingmap.page';

describe('TstingmapPage', () => {
  let component: TstingmapPage;
  let fixture: ComponentFixture<TstingmapPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TstingmapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
