import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LinkExternComponent } from './link-extern.component';

describe('LinkExternComponent', () => {
  let component: LinkExternComponent;
  let fixture: ComponentFixture<LinkExternComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkExternComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkExternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
