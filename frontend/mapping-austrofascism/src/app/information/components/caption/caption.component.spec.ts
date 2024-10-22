import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CaptionComponent } from './caption.component';

describe('CaptionComponent', () => {
  let component: CaptionComponent;
  let fixture: ComponentFixture<CaptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CaptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
