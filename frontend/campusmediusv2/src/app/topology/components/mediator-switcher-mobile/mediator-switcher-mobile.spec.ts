import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediatorSwitcherMobileComponent } from './mediator-switcher-mobile';

describe('MediatorSwitcherMobileComponent', () => {
  let component: MediatorSwitcherMobileComponent;
  let fixture: ComponentFixture<MediatorSwitcherMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediatorSwitcherMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediatorSwitcherMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
