import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CiteDialogComponent } from './cite-dialog.component';

describe('CiteDialogComponent', () => {
  let component: CiteDialogComponent;
  let fixture: ComponentFixture<CiteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CiteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CiteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
