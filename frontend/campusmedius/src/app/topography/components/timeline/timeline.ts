import {
    Component,
    OnInit,
    OnDestroy,
    HostBinding,
    Input,
    OnChanges,
    SimpleChanges,
    HostListener,
    ViewChild,
    ElementRef,
    EventEmitter,
    Output
} from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition,
    query
} from '@angular/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { Event, TimelineLine } from '../../models/event';

import { Moment } from 'moment';
import * as moment from 'moment';


@Component({
    selector: 'cm-timeline',
    templateUrl: './timeline.html',
    styleUrls: ['./timeline.scss'],
    animations: [
        trigger('panelControl', [
            state('true', style({ transform: 'scaleY(1)' })),
            state('false', style({ transform: 'scaleY(-1)' })),
            transition('false <=> true', animate('300ms ease-in'))
        ]),
        trigger('panel', [
            state('true', style({ height: '190px' })),
            state('false', style({ height: '40px' })),
            transition('false <=> true', animate('300ms ease-in'))
        ])
    ]
})
export class TimelineComponent implements OnInit, OnChanges, OnDestroy {
    @Input() events: Event[];
    @Input() filteredIds: number[];

    private destroy$: Subject<boolean> = new Subject<boolean>();

    @ViewChild('baseline') baselineElement: ElementRef;

    @Output() startFilterChanged = new EventEmitter<Moment>();
    @Output() endFilterChanged = new EventEmitter<Moment>();

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

    ngOnInit() {
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
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!this.initialized) {
            return;
        }

        if (changes['events']) {
            console.log(changes['events'].currentValue);
            this.setupRows(changes['events'].currentValue);
        }
        if (changes['filteredIds']) {
            console.log(this.filteredIds);
        }
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
            const line = {
                left: left + 1,
                width: right - left - 2,
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
        this.indicatorLineHeight = this.rows.length * 9 + 30;
    }

    private getLabel(step: number) {
        return `${step} h`;
    }

    private bindMouseMove = (ev) => this.handleMouseMove(ev);
    private bindMouseUp = (ev) => this.handleMouseUp(ev);

    public handleMouseDown(handle: string, event: any) {
        this.mouseStartX = event.clientX;
        if (handle === 'left') {
            this.leftHandleStartX = this.leftHandleX;
            this.moveLeftHandle = true;
        }
        if (handle === 'right') {
            this.rightHandleStartX = this.rightHandleX;
            this.moveRightHandle = true;
        }
        window.document.addEventListener('mousemove', this.bindMouseMove);
        window.document.addEventListener('mouseup', this.bindMouseUp);
        window.document.body.style.cursor = 'pointer';
    }

    public handleMouseMove(event: any) {
        const baselineWidth = this.baselineElement.nativeElement.getBoundingClientRect().width;
        const spacing = baselineWidth / this.steps;

        if (this.moveLeftHandle) {
            event.preventDefault();
            let newValue = (this.leftHandleStartX / 100) * baselineWidth + (event.clientX - this.mouseStartX);
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
        }

        if (this.moveRightHandle) {
            event.preventDefault();
            let newValue = (this.rightHandleStartX / 100) * baselineWidth + (event.clientX - this.mouseStartX);
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

        }
    }

    public handleMouseUp(event: any) {
        this.moveLeftHandle = false;
        this.moveRightHandle = false;

        window.document.removeEventListener('mousemove', this.bindMouseMove);
        window.document.removeEventListener('mouseup', this.bindMouseUp);
        window.document.body.style.cursor = 'default';
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
