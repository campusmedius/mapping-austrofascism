import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LinkInternComponent } from './link-intern.component';

describe('LinkInternComponent', () => {
  let component: LinkInternComponent;
  let fixture: ComponentFixture<LinkInternComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkInternComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkInternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
