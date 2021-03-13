import { Component, OnInit, OnDestroy, SimpleChanges, ChangeDetectorRef, Input } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Mediator } from '@app/topology/models/mediator';
import { Moment } from 'moment';
import * as moment from 'moment';
import { LngLat } from 'mapbox-gl';
import { Relation } from '@app/topology/models/relation';
import * as turf from '@turf/turf';
import { trigger, transition, animate, style, state } from '@angular/animations';

@Component({
    selector: 'cm-info-box-mobile',
    templateUrl: './info-box-mobile.html',
    styleUrls: ['./info-box-mobile.scss'],
    animations: [
      trigger('infoBoxOpen', [
          state('true', style({ 'width': '*', 'height': '*', display: '*', 'max-height': '140px', opacity: 0.9 })),
          state('false', style({ 'width': '0px', 'height': '0px', display: 'none', 'max-height': '0px', opacity: 0 })),
          transition('false => true', [
              style({ 'display': 'block' }),
              animate('300ms ease-in')
          ]),
          transition('true => false', [
              animate('300ms ease-in')
          ])
      ])
  ]
})
export class InfoBoxMobileComponent implements OnInit, OnDestroy {
    mediator: Mediator;
    public spaceStr: string;
    private space = 0;
    public timeStr: string;
    private time = 0;
    private inAnimation = false;
    private timer: ReturnType<typeof setTimeout>;
    currentLangSubscription: Subscription;
    @Input() isOpen = false;

    constructor(private translate: TranslateService, private cdRef: ChangeDetectorRef) { }

    ngOnInit() {
      this.currentLangSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
          this.setSpaceTime(this.mediator, this.space, this.time);
      });
    }

    public navigateToMediator(mediator: Mediator, relation: Relation, direction: string) {
        if (['0', '1', '2', '3', '4', '5'].includes(mediator.id)) {
            this.animateSovereignSign(mediator, relation);
        }
        else if (['6', '7', '8', '9', '10'].includes(mediator.id)) {
            this.animateExaminingGaze(mediator, relation, direction);
        } else {
            this.animateGovernedTransmission(mediator, relation);
        }
    }

    private animateSovereignSign(mediator: Mediator, relation: Relation) {
        const steps = 50;
        const duration = 4500;
        const stepTime = duration / steps;
        const previousMediator = this.mediator;
        this.mediator = mediator;

        const previousCoordinates = previousMediator.coordinates;
        let timeDifference = relation.timeDifference;
        if (timeDifference < 0) {
          timeDifference = -timeDifference
        }

        const startTime = new Date().getTime();
        const endTime = startTime + duration;

        if (mediator.id === '0') {
            this.timer = setInterval(() => {
                this.inAnimation = true;

                var now = new Date().getTime();
                var currentStep = Math.max((endTime - now) / duration, 0) * steps;

                const coordinates = {
                    lng: (previousCoordinates.lng / steps) * currentStep,
                    lat: (previousCoordinates.lat / steps) * currentStep
                }
                this.spaceStr = this.getSovereignSignSpaceStr(coordinates);

                const time = (timeDifference / steps) * currentStep;
                this.timeStr = this.getSovereignSignTimeStr(time);

                if (currentStep === 0) {
                    clearInterval(this.timer);
                    this.inAnimation = false;
                    this.setSpaceTime(mediator, 0, 0);
                }
                this.cdRef.detectChanges();
            }, stepTime);
        } else {
            this.timer = setInterval(() => {
                this.inAnimation = true;

                var now = new Date().getTime();
                var currentStep = Math.min((now - startTime) / duration, 1) * steps;

                const coordinates = {
                    lng: (mediator.coordinates.lng / steps) * currentStep,
                    lat: (mediator.coordinates.lat / steps) * currentStep
                }
                this.spaceStr = this.getSovereignSignSpaceStr(coordinates);

                const time = (timeDifference / steps) * currentStep;
                this.timeStr = this.getSovereignSignTimeStr(time);

                if (currentStep === steps) {
                    clearInterval(this.timer);
                    this.inAnimation = false;
                }
                this.cdRef.detectChanges();
            }, stepTime);
        }
    }


    private animateExaminingGaze(mediator: Mediator, relation: Relation, direction: string) {
        const steps = 50;
        const duration = 5000;
        const stepTime = duration / steps;
        const previousMediator = this.mediator;
        this.mediator = mediator;

        const baseSpace = previousMediator.distanceFromStart;
        const spaceDifference = mediator.distanceFromStart - previousMediator.distanceFromStart;
        const baseTime = previousMediator.timeAfterEnd;
        const timeDiffernce = mediator.timeAfterEnd - previousMediator.timeAfterEnd;

        const startTime = new Date().getTime();
        const endTime = startTime + duration;

        this.timer = setInterval(() => {
            this.inAnimation = true;

            var now = new Date().getTime();
            var currentStep = Math.min((now - startTime) / duration, 1) * steps;

            var space = baseSpace + ((spaceDifference / steps) * currentStep);
            this.spaceStr = this.getExaminingGazeSpaceStr(space);
            var time = baseTime + ((timeDiffernce / steps) * currentStep);
            this.timeStr = this.getExaminingGazeTimeStr(time);

            if (currentStep === steps) {
                clearInterval(this.timer);
                this.inAnimation = false;
                this.setSpaceTime(mediator, space, time);
            }
            this.cdRef.detectChanges();
        }, stepTime);
    }

    private animateGovernedTransmission(mediator: Mediator, relation: Relation) {
        this.mediator = mediator;

        const steps = 50;
        const distance = turf.distance([relation.source.coordinates.lng, relation.source.coordinates.lat],
                                       [relation.target.coordinates.lng, relation.target.coordinates.lat]);
        let duration = 15000 * distance / 8.2; // normalize to longest distance
        duration = duration - 500;
        const stepTime = duration / steps;

        const spaceDifference = relation.spaceDifference;
        const timeDiffernce = relation.timeDifference;

        const startTime = new Date().getTime();

        this.timer = setInterval(() => {
            this.inAnimation = true;

            var now = new Date().getTime();
            var currentStep = Math.min((now - startTime) / duration, 1) * steps;

            this.spaceStr = this.getGovernedTransmissionSpaceStr((spaceDifference / steps) * currentStep);
            this.timeStr = this.getGovernedTransmissionTimeStr((timeDiffernce / steps) * currentStep);

            if (currentStep === steps) {
                clearInterval(this.timer);
                this.inAnimation = false;
            }
            this.cdRef.detectChanges();
        }, stepTime);

    }

    public setSpaceTime(mediator: Mediator, space: Number, time: Number) {
        if (this.inAnimation) {
          return
        }

        if (mediator.mediationId === '1') {
            if (mediator.id === '0') {
                this.spaceStr = '0';
                this.timeStr = '0';
            } else {
                this.spaceStr = this.getSovereignSignSpaceStr(mediator.coordinates);
                this.timeStr = this.getSovereignSignTimeStr(mediator.relationsFrom[0].timeDifference);
            }
        } else if (mediator.mediationId === '2') {
            if (mediator.id === '6') {
                this.spaceStr = this.translate.currentLang === 'de' ? 'Anfang' : 'Start';
                this.timeStr = this.translate.currentLang === 'de' ? 'Ende' : 'End';
            } else {
                this.spaceStr = this.getExaminingGazeSpaceStr(mediator.distanceFromStart);
                this.timeStr = this.getExaminingGazeTimeStr(mediator.timeAfterEnd);
            }
        } else {
            this.spaceStr = this.getGovernedTransmissionSpaceStr(space);
            this.timeStr = this.getGovernedTransmissionTimeStr(time);
        }

        this.mediator = mediator;
        this.cdRef.detectChanges();
    }

    private getSovereignSignTimeStr(time) {
      return this.getTimeStr(time, ' p. Chr.')
    }

    private getSovereignSignSpaceStr(coordinates: any) {
        return 'N ' + parseFloat(coordinates.lat).toFixed(6).toString() + '° | E ' + parseFloat(coordinates.lng).toFixed(6).toString() + '°';
    }

    private getExaminingGazeTimeStr(time) {
      this.time = time;

      let suffix = '';
      if (this.translate.currentLang === 'de') {
        suffix = ' vor dem Ende';
      } else {
        suffix = ' before the end';
      }

      return this.getTimeStr(time, suffix)
    }

    private getExaminingGazeSpaceStr(space) {
      this.space = space;

      if (this.translate.currentLang === 'de') {
        return Math.round(space).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + ' m vom Anfang';
      } else {
        return Math.round(space).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' m from the start';
      }
    }

    private getGovernedTransmissionTimeStr(time) {
      this.time = time;

      if (time === 0) {
        return '0';
      }

      let suffix = '';
      if (this.translate.currentLang === 'de') {
        suffix = 'später';
      } else {
        suffix = 'later';
      }
      if (time < 0) {
        time = -time;
        if (this.translate.currentLang === 'de') {
          suffix = 'früher';
        } else {
          suffix = 'earlier';
        }
      }

      return this.getTimeStr(time, suffix)
    }

    private getGovernedTransmissionSpaceStr(space) {
      this.space = space;

      if (space === 0) {
        return '0';
      }

      if (this.translate.currentLang === 'de') {
        return Math.round(space).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + ' m entfernt';
      } else {
        return Math.round(space).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' m away';
      }
    }

    private getTimeStr(time, suffix) {
      let hours = Math.floor(time);
      const minutes = Math.round((time - hours) * 60);
      if (hours > (365*24)) {
        const years = Math.floor(hours / (365*24));
        hours = hours - (years * (365*24));
        let yearsStr = years.toString();
        const days = Math.floor(hours / 24);
        hours = hours - (days * 24);
        let daysStr = days.toString();
        return yearsStr + ' a ' + daysStr + ' d ' + hours + ' h ' + minutes + ' min ' + suffix;
      } else if (hours > 48) {
        const days = Math.floor(hours / 24);
        hours = hours - (days * 24);
        let daysStr = days.toString();
        return daysStr + ' d ' + hours + ' h ' + minutes + ' min ' + suffix;
      } else if (hours > 0) {
        return hours + ' h ' + minutes + ' min ' + suffix;
      } else {
        return minutes + ' min ' + suffix;
      }
    }

    public stopAnimation() {
        clearInterval(this.timer);
        this.inAnimation = false;
    }

    ngOnDestroy() {
        this.currentLangSubscription.unsubscribe();
    }

}
