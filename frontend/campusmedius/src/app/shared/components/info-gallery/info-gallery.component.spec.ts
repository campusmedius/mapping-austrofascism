import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoGalleryComponent } from './info-gallery.component';

describe('InfoGalleryComponent', () => {
  let component: InfoGalleryComponent;
  let fixture: ComponentFixture<InfoGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoGalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
