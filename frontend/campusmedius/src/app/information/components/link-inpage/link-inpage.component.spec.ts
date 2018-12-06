import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkInpageComponent } from './link-inpage.component';

describe('LinkInpageComponent', () => {
  let component: LinkInpageComponent;
  let fixture: ComponentFixture<LinkInpageComponent>;

  beforeEach(async(() => {
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
