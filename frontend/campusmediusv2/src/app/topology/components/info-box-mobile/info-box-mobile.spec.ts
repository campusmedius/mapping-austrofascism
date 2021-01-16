import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InfoBoxMobileComponent } from './info-box-mobile';

describe('InfoBoxMobileComponent', () => {
  let component: InfoBoxMobileComponent;
  let fixture: ComponentFixture<InfoBoxMobileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoBoxMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoBoxMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
