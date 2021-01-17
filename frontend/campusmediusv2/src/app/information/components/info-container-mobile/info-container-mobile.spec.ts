import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InfoContainerMobileComponent } from './info-container-mobile';

describe('InfoContainerComponent', () => {
  let component: InfoContainerMobileComponent;
  let fixture: ComponentFixture<ShortInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoContainerMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoContainerMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
