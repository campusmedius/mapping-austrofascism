import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

import { MapComponent } from '../../../shared/components/map/map';
import { Event } from '../../models/event';

import * as mapbox from 'mapbox-gl';

@Component({
    selector: 'cm-map-event',
    templateUrl: './map-event.component.html',
    styleUrls: ['./map-event.component.scss']
})
export class MapEventComponent implements OnInit {
    @Input() event: Event;
    @Input() active: boolean;
    @Input() selected: boolean;

    @Output() eventSelected = new EventEmitter<Event>();

    @ViewChild('marker') markerElement: ElementRef;

    public marker: mapbox.Marker;

    constructor(private mapCmp: MapComponent) { }

    ngOnInit() {
        this.marker = new mapboxgl.Marker(this.markerElement.nativeElement)
            .setLngLat([this.event.coordinates.lng, this.event.coordinates.lat])
            .addTo(this.mapCmp.map);
    }

    select() {
        this.eventSelected.emit(this.event);
    }
}
