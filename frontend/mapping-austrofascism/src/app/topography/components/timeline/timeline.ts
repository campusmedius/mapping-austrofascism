import {
    Component,
    HostBinding,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    ViewChild,
    ElementRef,
    EventEmitter,
    Output,
    AfterViewInit
} from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { Event, TimelineLine } from '../../models/event';

import { Moment } from 'moment';
import * as moment from 'moment';

import * as Hammer from '@egjs/hammerjs';

const OPENED_HEIGHT = '220px';
const CLOSED_HEIGHT = '40px';

@Component({
    selector: 'cm-timeline',
    templateUrl: './timeline.html',
    styleUrls: ['./timeline.scss'],
    host: {
        '[class.open]': 'opened'
    },
    animations: [
        trigger('panelControl', [
            state('true', style({ transform: 'scaleY(1)' })),
            state('false', style({ transform: 'scaleY(-1)' })),
            transition('false <=> true', animate('300ms ease-in'))
        ]),
        trigger('panel', [
            state('true', style({ height: OPENED_HEIGHT })),
            state('false', style({ height: CLOSED_HEIGHT })),
            transition('false <=> true', animate('300ms ease-in'))
        ])
    ]
})
export class TimelineComponent implements OnChanges, OnDestroy, AfterViewInit {
    @Input() events: Event[];
    @Input() filteredIds: number[];
    @Input() selectedEvent: Event;

    private destroy$: Subject<boolean> = new Subject<boolean>();

    @ViewChild('baseline') baselineElement: ElementRef;
    @ViewChild('handleright') handleRightElement: ElementRef;
    @ViewChild('handleleft') handleLeftElement: ElementRef;

    @Output() startFilterChanged = new EventEmitter<Moment>();
    @Output() endFilterChanged = new EventEmitter<Moment>();
    @Output() height = new EventEmitter<string>();

    public timelineStart: Moment = moment('1933-05-13T13:00Z');
    public timelineEnd: Moment = moment('1933-05-14T13:00Z');
    public baselineLabelFormatEn = 'MMM D, YYYY – h a';
    public baselineLabelFormatDe = 'D. MMM YYYY – H:mm';
    public lang: string = null;
    public baselineLabelFormat: string = null;
    public handleLabelFormat: string = null;
    private steps = 24;
    private totalMinutes = this.steps * 60;

    public rows: TimelineLine[][] = [];
    public indicatorLineHeight: number = null;

    private mouseStartX: number = null;
    private leftHandleStartX: number = null;
    private rightHandleStartX: number = null;

    private handleRightHammer: any;
    private handleLeftHammer: any;

    public leftHandleX: number = null;
    public leftHandleLabel: string;
    private leftHandleStep: number = null;
    public rightHandleX: number = null;
    public rightHandleLabel: string;
    private rightHandleStep: number = null;

    public moveRightHandle = false;
    public moveLeftHandle = false;

    private initialized = false;

    @HostBinding('@panel')
    public opened = true;

    constructor(private translate: TranslateService) { }

    ngAfterViewInit() {

        this.handleRightHammer = new Hammer.Manager(this.handleRightElement.nativeElement);
        this.handleRightHammer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }));
        this.handleRightHammer.on('pan', (ev) => this.handleRightMouseMove(ev));
        this.handleLeftHammer = new Hammer.Manager(this.handleLeftElement.nativeElement);
        this.handleLeftHammer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }));
        this.handleLeftHammer.on('pan', (ev) => this.handleLeftMouseMove(ev));

        this.leftHandleX = 0;
        this.leftHandleStep = 0;
        this.leftHandleLabel = this.getLabel(this.leftHandleStep);
        this.rightHandleX = 100;
        this.rightHandleStep = this.steps;
        this.rightHandleLabel = this.getLabel(this.rightHandleStep);
        this.setupRows(this.events);
        this.initialized = true;
        this.setLang(this.translate.currentLang);
        this.translate.onLangChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: LangChangeEvent) => {
                this.setLang(event.lang);
            });
        setTimeout(() => this.height.emit(this.opened ? OPENED_HEIGHT : CLOSED_HEIGHT));
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!this.initialized) {
            return;
        }

        if (changes['events']) {
            this.setupRows(changes['events'].currentValue);
        }
        if (changes['filteredIds']) {
        }
    }

    public toggle() {
        this.opened = !this.opened;
        this.height.emit(this.opened ? OPENED_HEIGHT : CLOSED_HEIGHT);
    }

    private setLang(lang: string) {
        this.lang = lang;
        if (lang === 'de') {
            this.baselineLabelFormat = this.baselineLabelFormatDe;
        } else {
            this.baselineLabelFormat = this.baselineLabelFormatEn;
        }
    }

    private setupRows(events: Event[]) {
        if (!events) {
            return;
        }

        const rows = [];

        events.forEach((event: Event) => {
            const timeline_row_index = event.timelineRow - 1;

            if (!rows[timeline_row_index]) {
                rows[timeline_row_index] = [];
            }

            const startDiffMinutes = event.start.diff(this.timelineStart, 'minutes');
            const endDiffMinutes = event.end.diff(this.timelineStart, 'minutes');
            const left = (startDiffMinutes / this.totalMinutes) * 100;
            const right = (endDiffMinutes / this.totalMinutes) * 100;
            const width = right - left;
            const line = {
                left: left,
                width: width,
                event: event
            };

            rows[timeline_row_index].push(line);
        });

        rows.forEach(row => {
            row = row.sort((a: TimelineLine, b: TimelineLine) => {
                return a.event.start.isBefore(b.event.start);
            });
        });

        this.rows = rows;
        this.indicatorLineHeight = this.rows.length * 13 + 39;
    }

    private getLabel(step: number) {
        return `${step} h`;
    }

    public handleRightMouseMove(event: any) {
        const baselineWidth = this.baselineElement.nativeElement.getBoundingClientRect().width;
        const spacing = baselineWidth / this.steps;

        if (!this.moveRightHandle) {
            this.moveRightHandle = true;
            this.rightHandleStartX = this.rightHandleX;
            window.document.body.style.cursor = 'pointer';
        }
        let newValue = (this.rightHandleStartX / 100) * baselineWidth + event.deltaX;
        if (newValue > baselineWidth) {
            newValue = baselineWidth;
        }
        let step = Math.round(newValue / spacing);
        if (step <= this.leftHandleStep) {
            step = this.leftHandleStep + 1;
            if (step > this.steps) {
                step = this.steps;
            }
        }

        if (this.rightHandleStep !== step) {
            this.endFilterChanged.emit(this.timelineStart.clone().add(step, 'hours'));
            this.rightHandleX = (step * spacing) * 100 / baselineWidth;
            this.rightHandleLabel = this.getLabel(step);
        }

        this.rightHandleStep = step;

        if (event.isFinal) {
            this.moveLeftHandle = false;
            window.document.body.style.cursor = 'default';
        }

    }

    public handleLeftMouseMove(event: any) {
        const baselineWidth = this.baselineElement.nativeElement.getBoundingClientRect().width;
        const spacing = baselineWidth / this.steps;

        if (!this.moveLeftHandle) {
            this.moveLeftHandle = true;
            this.leftHandleStartX = this.leftHandleX;
            window.document.body.style.cursor = 'pointer';
        }

        let newValue = (this.leftHandleStartX / 100) * baselineWidth + event.deltaX;
        if (newValue < 0) {
            newValue = 0;
        }
        let step = Math.round(newValue / spacing);
        if (step >= this.rightHandleStep) {
            step = this.rightHandleStep - 1;
            if (step < 0) {
                step = 0;
            }
        }

        if (this.leftHandleStep !== step) {
            this.startFilterChanged.emit(this.timelineStart.clone().add(step, 'hours'));
            this.leftHandleX = (step * spacing) * 100 / baselineWidth;
            this.leftHandleLabel = this.getLabel(step);
        }

        this.leftHandleStep = step;

        if (event.isFinal) {
            this.moveLeftHandle = false;
            window.document.body.style.cursor = 'default';
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.handleLeftHammer.destroy();
        this.handleRightHammer.destroy();
    }
}
