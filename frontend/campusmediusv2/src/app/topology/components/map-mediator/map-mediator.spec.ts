import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapMediatorComponent } from './map-mediator';

describe('MapMediatorComponent', () => {
  let component: MapMediatorComponent;
  let fixture: ComponentFixture<MapMediatorComponent>;

  beforeEach(async(() => {
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
