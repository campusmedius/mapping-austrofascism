import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoAudioComponent } from './info-audio.component';

describe('InfoAudioComponent', () => {
  let component: InfoAudioComponent;
  let fixture: ComponentFixture<InfoAudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoAudioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
