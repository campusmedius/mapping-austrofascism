import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Mediator } from '@app/topology/models/mediator';
import { Marker } from 'mapbox-gl';
import { MapComponent } from '../map/map';

@Component({
  selector: 'cm-map-mediator',
  templateUrl: './map-mediator.component.html',
  styleUrls: ['./map-mediator.component.scss']
})
export class MapMediatorComponent implements OnInit {
    @Input() mediator: Mediator;
    @Input() lang: string;
    @Input() selected: boolean;

    @ViewChild('marker', {static: false}) markerElement: ElementRef;

    public marker: Marker;

    public mapAvailable = true;
    public mediumType: string;

    constructor(private mapCmp: MapComponent) { }

    ngOnInit() {
        if (!this.mapCmp.map) {
            this.mapAvailable = false;
            return;
        }
        this.mediumType = this.mediator.medium.titleEn.toLowerCase();
    }

    ngAfterViewInit() {
        if (!this.mapCmp.map) {
            this.mapAvailable = false;
            return;
        }

        this.marker = new Marker(this.markerElement.nativeElement, { offset: [0, -25] })
            .setLngLat([this.mediator.coordinates.lng, this.mediator.coordinates.lat])
            .addTo(this.mapCmp.map);
    }

}
