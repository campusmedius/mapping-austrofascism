import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DisclosurePageComponent } from './disclosure-page';

describe('DisclosurePageComponent', () => {
  let component: DisclosurePageComponent;
  let fixture: ComponentFixture<DisclosurePageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisclosurePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisclosurePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
