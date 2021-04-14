import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LinkInpageComponent } from './link-inpage.component';

describe('LinkInpageComponent', () => {
  let component: LinkInpageComponent;
  let fixture: ComponentFixture<LinkInpageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkInpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkInpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
