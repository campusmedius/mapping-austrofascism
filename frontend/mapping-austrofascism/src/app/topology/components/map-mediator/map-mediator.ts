import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Mediator } from '@app/topology/models/mediator';
import { Marker } from 'mapbox-gl';
import { MapComponent } from '../map/map';
import { Mediation } from '@app/topology/models/mediation';
import { Router } from '@angular/router';


@Component({
  selector: 'cm-map-mediator',
  templateUrl: './map-mediator.html',
  styleUrls: ['./map-mediator.scss']
})
export class MapMediatorComponent implements OnInit, OnDestroy {
    @Input() mediator: Mediator;
    @Input() mediation: Mediation;
    @Input() lang: string;

    @ViewChild('marker') markerElement: ElementRef;

    public marker: Marker;

    public mapAvailable = true;

    constructor(private mapCmp: MapComponent,private router: Router) { }

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

        this.marker = new Marker(this.markerElement.nativeElement, { offset: [0, 0] })
            .setLngLat([this.mediator.coordinates.lng, this.mediator.coordinates.lat])
            .addTo(this.mapCmp.map);
    }

    navigate(path: string[]) {
        this.router.navigate(path, {
            queryParamsHandling: 'merge'
        });
    }

    ngOnDestroy() {
        if(this.marker) {
            this.marker.remove();
        }
    }

}
