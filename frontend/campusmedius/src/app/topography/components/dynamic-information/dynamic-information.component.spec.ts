import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicInformationComponent } from './dynamic-information.component';

describe('DynamicInformationComponent', () => {
  let component: DynamicInformationComponent;
  let fixture: ComponentFixture<DynamicInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
