import { Component, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Mediator } from '@app/topology/models/mediator';
import { Moment } from 'moment';
import { LngLat } from 'mapbox-gl';
import { Relation } from '@app/topology/models/relation';
import * as turf from '@turf/turf';

@Component({
    selector: 'cm-info-box',
    templateUrl: './info-box.html',
    styleUrls: ['./info-box.scss']
})
export class InfoBoxComponent implements OnInit, OnChanges {
    mediator: Mediator;
    public spaceStr: string;
    public timeStr: string;
    public space: number;
    public time: number;
    public isSovereignSigns: boolean;
    public isOrigin: boolean;

    constructor(private translate: TranslateService, private cdRef: ChangeDetectorRef) { }

    ngOnInit() {
    }


    public navigateToMediator(mediator: Mediator, relation: Relation, direction: string) {
        if (['0', '1', '2', '3', '4', '5'].includes(mediator.id)) {
            this.animateSovereignSign(mediator);
        }
        else if (['6', '7', '8', '9', '10'].includes(mediator.id)) {
            this.animateExaminingGaze(mediator, relation, direction);
        } else {
            this.animateGovernedTransmission(mediator, relation);
        }
    }

    private animateSovereignSign(mediator: Mediator) {
        const steps = 50;
        const duration = 4500;
        const stepTime = duration / steps;
        const previousMediator = this.mediator;
        this.mediator = mediator;

        const previousYear = previousMediator.time.year();
        const previousCoordinates = previousMediator.coordinates;

        const startTime = new Date().getTime();
        const endTime = startTime + duration;

        if (mediator.id === '0') {
            var timer = setInterval(() => {
                var now = new Date().getTime();
                var currentStep = Math.max((endTime - now) / duration, 0) * steps;

                const coordinates = {
                    lng: (previousCoordinates.lng / steps) * currentStep,
                    lat: (previousCoordinates.lat / steps) * currentStep
                }
                this.spaceStr = this.getSovereignSignSpaceStr(coordinates);

                const year = Math.round((previousYear / steps) * currentStep);
                this.timeStr = this.getSovereignSignTimeStr(year, mediator.time);

                if (currentStep === 0) {
                    this.spaceStr = '0';
                    this.timeStr = '0';
                    clearInterval(timer);
                }
                this.cdRef.detectChanges();
            }, stepTime);
        } else {
            var timer = setInterval(() => {
                var now = new Date().getTime();
                var currentStep = Math.min((now - startTime) / duration, 1) * steps;

                const coordinates = {
                    lng: (mediator.coordinates.lng / steps) * currentStep,
                    lat: (mediator.coordinates.lat / steps) * currentStep
                }
                this.spaceStr = this.getSovereignSignSpaceStr(coordinates);

                const year = Math.round((mediator.time.year() / steps) * currentStep);
                this.timeStr = this.getSovereignSignTimeStr(year, mediator.time);

                if (currentStep === steps) {
                    clearInterval(timer);
                }
                this.cdRef.detectChanges();
            }, stepTime);
        }
    }


    private animateExaminingGaze(mediator: Mediator, relation: Relation, direction: string) {
        const steps = 50;
        const duration = 5000;
        const stepTime = duration / steps;

        const spaceDifference = relation.spaceDifference;
        const timeDiffernce = relation.timeDifference;

        const startTime = new Date().getTime();
        const endTime = startTime + duration;

        this.isOrigin = false;

        if (direction === 'forward') {
            var timer = setInterval(() => {
                var now = new Date().getTime();
                var currentStep = Math.min((now - startTime) / duration, 1) * steps;

                this.space = Math.round((spaceDifference / steps) * currentStep);
                this.time = Math.round((timeDiffernce / steps) * currentStep);

                if (currentStep === steps) {
                    clearInterval(timer);
                }
                this.cdRef.detectChanges();
            }, stepTime);
        } else {
            var timer = setInterval(() => {
                var now = new Date().getTime();
                var currentStep = Math.max((endTime - now) / duration, 0) * steps;

                this.space = Math.round((spaceDifference / steps) * currentStep);
                this.time = Math.round((timeDiffernce / steps) * currentStep);

                if (currentStep === 0) {
                    if (mediator.id === '6') {
                        this.spaceStr = '0';
                        this.timeStr = '0';
                        this.isOrigin = true;
                    } else {
                        this.space = Math.round(mediator.relationsFrom[0].spaceDifference);
                        this.time = Math.round(mediator.relationsFrom[0].timeDifference);
                        this.isOrigin = false;
                    }
                    clearInterval(timer);
                }
                this.cdRef.detectChanges();
            }, stepTime);
        }

    }

    private animateGovernedTransmission(mediator: Mediator, relation: Relation) {
        const steps = 50;
        const distance = turf.distance([relation.source.coordinates.lng, relation.source.coordinates.lat],
                                       [relation.target.coordinates.lng, relation.target.coordinates.lat]);
        const duration = 15000 * distance / 8.2; // normalize to longest distance
        const stepTime = duration / steps;

        const spaceDifference = relation.spaceDifference;
        const timeDiffernce = relation.timeDifference;

        const startTime = new Date().getTime();

        this.isOrigin = false;

        var timer = setInterval(() => {
            var now = new Date().getTime();
            var currentStep = Math.min((now - startTime) / duration, 1) * steps;

            this.space = Math.round((spaceDifference / steps) * currentStep);
            this.time = Math.round((timeDiffernce / steps) * currentStep);

            if (currentStep === steps) {
                clearInterval(timer);
            }
            this.cdRef.detectChanges();
        }, stepTime);

    }

    public initSpaceTime(mediator: Mediator) {
        this.isSovereignSigns = false;
        this.isOrigin = false;

        if (mediator.mediationId === '1') {
            this.isSovereignSigns = true;
            if (mediator.id === '0') {
                this.spaceStr = '0';
                this.timeStr = '0';
                this.isOrigin = true;
            } else {
                this.spaceStr = this.getSovereignSignSpaceStr(mediator.coordinates);
                this.timeStr = this.getSovereignSignTimeStr(mediator.time.year(), mediator.time);
            }
        } else if (mediator.mediationId === '2') {
            if (mediator.id === '6') {
                this.spaceStr = '0';
                this.timeStr = '0';
                this.isOrigin = true;
            } else {
                this.space = Math.round(mediator.relationsFrom[0].spaceDifference);
                this.time = Math.round(mediator.relationsFrom[0].timeDifference);
            }
        } else {
            this.spaceStr = '0';
            this.timeStr = '0';
            this.isOrigin = true;
        }

        this.mediator = mediator;
        this.cdRef.detectChanges();
    }

    private getSovereignSignTimeStr(year: number, time: Moment) {
        return year + ' a, ' + time.dayOfYear() + ' d, ' + time.hours() + ' h p. Chr.';
    }

    private getSovereignSignSpaceStr(coordinates: any) {
        return parseFloat(coordinates.lat).toFixed(6).toString() + ' | ' + parseFloat(coordinates.lng).toFixed(6).toString();
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log(changes);
    }

}
