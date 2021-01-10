import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StartSelectorComponent } from './start-selector';

describe('StartSelectorComponent', () => {
  let component: StartSelectorComponent;
  let fixture: ComponentFixture<StartSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StartSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
