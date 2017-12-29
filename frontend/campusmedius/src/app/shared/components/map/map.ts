import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

declare var mapboxgl: any;

// TODO: find place for .mapboxgl-control-container

@Component({
    selector: 'cm-map',
    templateUrl: './map.html',
    styleUrls: ['./map.scss']
})
export class MapComponent implements OnInit {
    @ViewChild('map') mapElement: ElementRef;

    public map: any;

    constructor() { }

    ngOnInit() {
        mapboxgl.accessToken = 'pk.eyJ1IjoiY2FydDBncmFwaCIsImEiOiI2Z1FEdEJVIn0.y2iW4bIEbP-xCQ8BU3-RjA';
        this.map = new mapboxgl.Map({
            container: this.mapElement.nativeElement,
            style: 'mapbox://styles/mapbox/streets-v9', //stylesheet location
            center: [16.35, 48.2], // starting position
            zoom: 12 // starting zoom
        });
    }

}
