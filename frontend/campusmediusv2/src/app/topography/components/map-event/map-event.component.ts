import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

import { MapComponent } from '../../components/map/map';
import { Event } from '../../models/event';

import { Marker } from 'mapbox-gl';

import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
    selector: 'cm-map-event',
    templateUrl: './map-event.component.html',
    styleUrls: ['./map-event.component.scss']
})
export class MapEventComponent implements OnInit, AfterViewInit {
    @Input() event: Event;
    @Input() lang: string;
    @Input() active: boolean;
    @Input() selected: boolean;

    @ViewChild('marker', {static: false}) markerElement: ElementRef;

    public marker: Marker;

    public mapAvailable = true;

    constructor(private mapCmp: MapComponent) { }

    ngOnInit() {
        if (!this.mapCmp.map) {
            this.mapAvailable = false;
            return;
        }
    }

    ngAfterViewInit() {
        if (!this.mapCmp.map) {
            this.mapAvailable = false;
            return;
        }
        this.marker = new Marker(this.markerElement.nativeElement, { offset: [0, -25] })
            .setLngLat([this.event.coordinates.lng, this.event.coordinates.lat])
            .addTo(this.mapCmp.map);
    }
}
