import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartPageSelectorComponent } from './start-page-selector';

describe('StartPageSelectorComponent', () => {
  let component: StartPageSelectorComponent;
  let fixture: ComponentFixture<StartPageSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartPageSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartPageSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
