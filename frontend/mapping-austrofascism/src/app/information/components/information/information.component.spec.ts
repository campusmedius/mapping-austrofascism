import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InfoInformationComponent } from './info-information.component';

describe('InfoInformationComponent', () => {
    let component: InfoInformationComponent;
    let fixture: ComponentFixture<InfoInformationComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [InfoInformationComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InfoInformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
