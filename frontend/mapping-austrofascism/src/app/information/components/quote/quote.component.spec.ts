import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuoteComponent } from './quote.component';

describe('QuoteComponent', () => {
    let component: QuoteComponent;
    let fixture: ComponentFixture<QuoteComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [QuoteComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(QuoteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
