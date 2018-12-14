import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicAbstractComponent } from './dynamic-abstract.component';

describe('DynamicAbstractComponent', () => {
  let component: DynamicAbstractComponent;
  let fixture: ComponentFixture<DynamicAbstractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicAbstractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicAbstractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
