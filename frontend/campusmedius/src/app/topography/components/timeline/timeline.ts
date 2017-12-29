import {
    Component,
    OnInit,
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

import { Event, TimelineLine } from '../../models/event';

import { Moment } from 'moment';
import * as moment from 'moment';


@Component({
    selector: 'cm-timeline',
    templateUrl: './timeline.html',
    styleUrls: ['./timeline.scss']
})
export class TimelineComponent implements OnInit, OnChanges {
    @Input() events: Event[];
    @Input() filteredIds: number[];

    @Output() startFilterChanged = new EventEmitter<Moment>();
    @Output() endFilterChanged = new EventEmitter<Moment>();

    @ViewChild('baseline') baselineElement: ElementRef;

    private timelineStart: Moment = moment('1933-05-13T12:00Z');
    private timelineEnd: Moment = moment('1933-05-14T12:00Z');
    public baselineLabelFormat = 'MMM D, YYYY - h a';
    private steps = 24;
    private totalMinutes = this.steps * 60;
    private baselineWidth: number = null;
    private spacing: number = null;

    public rows: TimelineLine[][] = [];
    public indicatorLineHeight: number = null;

    private mouseStartX: number = null;
    private leftHandleStartX: number = null;
    private rightHandleStartX: number = null;

    public leftHandleX: number = null;
    public leftHandleLabel: string = null;
    private leftHandleStep: number = null;
    public rightHandleX: number = null;
    public rightHandleLabel: string = null;
    private rightHandleStep: number = null;

    private moveRightHandle = false;
    private moveLeftHandle = false;

    constructor() { }

    ngOnInit() {
        this.baselineWidth = this.baselineElement.nativeElement.getBoundingClientRect().width;
        this.spacing = this.baselineWidth / this.steps;
        this.leftHandleX = 0;
        this.leftHandleStep = 0;
        this.leftHandleLabel = this.getLabel(this.leftHandleStep);
        this.rightHandleX = this.baselineWidth;
        this.rightHandleStep = this.steps;
        this.rightHandleLabel = this.getLabel(this.rightHandleStep);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['events']) {
            console.log(changes['events'].currentValue);
            this.rows = this.generateRows(changes['events'].currentValue);
            this.indicatorLineHeight = this.rows.length * 9 + 30;
        }
        if (changes['filteredIds']) {
            console.log(this.filteredIds);
        }
    }

    private generateRows(events: Event[]): TimelineLine[][] {
        const rows = [];

        events.forEach((event: Event) => {
            const timeline_row_index = event.timelineRow - 1;

            if (!rows[timeline_row_index]) {
                rows[timeline_row_index] = [];
            }

            const startDiffMinutes = event.start.diff(this.timelineStart, 'minutes');
            const endDiffMinutes = event.end.diff(this.timelineStart, 'minutes');
            const left = (startDiffMinutes / this.totalMinutes) * this.baselineWidth;
            const right = (endDiffMinutes / this.totalMinutes) * this.baselineWidth;
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

        return rows;
    }

    private getLabel(step: number) {
        const time = this.timelineStart.clone().add(step, 'hours');
        return time.format('h') + ' h';
    }

    @HostListener('window:resize', ['$event'])
    private windowWidthChange(event) {
        this.baselineWidth = this.baselineElement.nativeElement.getBoundingClientRect().width;
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
        if (this.moveLeftHandle) {
            event.preventDefault();
            let newValue = this.leftHandleStartX + (event.clientX - this.mouseStartX);
            if (newValue < 0) {
                newValue = 0;
            }
            let step = Math.round(newValue / this.spacing);
            if (step >= this.rightHandleStep) {
                step = this.rightHandleStep - 1;
                if (step < 0) {
                    step = 0;
                }
            }

            if (this.leftHandleStep !== step) {
                this.startFilterChanged.emit(this.timelineStart.clone().add(step, 'hours'));
                this.leftHandleX = step * this.spacing;
                this.leftHandleLabel = this.getLabel(step);
            }

            this.leftHandleStep = step;
        }

        if (this.moveRightHandle) {
            event.preventDefault();
            let newValue = this.rightHandleStartX + (event.clientX - this.mouseStartX);
            if (newValue > this.baselineWidth) {
                newValue = this.baselineWidth;
            }
            let step = Math.round(newValue / this.spacing);
            if (step <= this.leftHandleStep) {
                step = this.leftHandleStep + 1;
                if (step > this.steps) {
                    step = this.steps;
                }
            }

            if (this.rightHandleStep !== step) {
                this.endFilterChanged.emit(this.timelineStart.clone().add(step, 'hours'));
                this.rightHandleX = step * this.spacing;
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

}
