import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoVideoComponent } from './info-video.component';

describe('InfoVideoComponent', () => {
  let component: InfoVideoComponent;
  let fixture: ComponentFixture<InfoVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
