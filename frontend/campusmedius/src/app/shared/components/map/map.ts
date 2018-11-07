import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { environment } from '../../../../environments/environment';

declare var mapboxgl: any;
import { Map } from 'mapbox-gl';

@Component({
    selector: 'cm-map',
    templateUrl: './map.html',
    styleUrls: ['./map.scss']
})
export class MapComponent implements OnInit {
    @ViewChild('map') mapElement: ElementRef;
    private MAP_TILES_URL = environment.mapTilesUrl;

    public map: Map;

    constructor() { }

    ngOnInit() {
        mapboxgl.accessToken = 'pk.eyJ1IjoiY2FydDBncmFwaCIsImEiOiI2Z1FEdEJVIn0.y2iW4bIEbP-xCQ8BU3-RjA';
        this.map = new mapboxgl.Map({
            container: this.mapElement.nativeElement,
            style: 'mapbox://styles/mapbox/streets-v9',
            center: [16.4, 48.2], // starting position
            zoom: 13 // starting zoom
        });

        // TODO: move to topography module
        this.map.on('load', () => {
            this.map.addLayer({
                'id': 'vienna-map-1933',
                'type': 'raster',
                'source': {
                    'type': 'raster',
                    'tiles': [
                        `${this.MAP_TILES_URL}/{z}/{x}/{y}.png`
                    ],
                    'tileSize': 256,
                    'scheme': 'tms'
                }
            });
        });
    }

    public zoomIn() {
        this.map.zoomIn();
    }

    public zoomOut() {
        this.map.zoomOut();
    }
}
