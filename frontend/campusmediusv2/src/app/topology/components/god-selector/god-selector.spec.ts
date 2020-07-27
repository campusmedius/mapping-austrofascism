import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GodSelectorComponent } from './god-selector';

describe('GodSelectorComponent', () => {
  let component: GodSelectorComponent;
  let fixture: ComponentFixture<GodSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GodSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GodSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
