import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartSelectorMobileComponent } from './start-selector-mobile';

describe('StartSelectorMobileComponent', () => {
  let component: StartSelectorMobileComponent;
  let fixture: ComponentFixture<StartSelectorMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartSelectorMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartSelectorMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
