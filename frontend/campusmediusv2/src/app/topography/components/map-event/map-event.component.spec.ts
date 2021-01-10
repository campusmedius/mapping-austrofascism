import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CmMapEventComponent } from './cm-map-event.component';

describe('CmMapEventComponent', () => {
  let component: CmMapEventComponent;
  let fixture: ComponentFixture<CmMapEventComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CmMapEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmMapEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
