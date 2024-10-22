import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InfoImageComponent } from './info-image.component';

describe('InfoImageComponent', () => {
  let component: InfoImageComponent;
  let fixture: ComponentFixture<InfoImageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
