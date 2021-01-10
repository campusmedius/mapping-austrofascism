import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MapMediatorComponent } from './map-mediator';

describe('MapMediatorComponent', () => {
  let component: MapMediatorComponent;
  let fixture: ComponentFixture<MapMediatorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MapMediatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapMediatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
