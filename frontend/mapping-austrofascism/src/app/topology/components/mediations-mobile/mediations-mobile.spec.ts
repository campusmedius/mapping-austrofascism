import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MediationsMobileComponent } from './mediations-mobile';

describe('MediationsComponent', () => {
  let component: MediationsMobileComponent;
  let fixture: ComponentFixture<MediationsMobileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MediationsMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediationsMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
