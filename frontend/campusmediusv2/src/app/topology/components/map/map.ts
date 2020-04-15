import { Component, OnInit, ViewChild, ElementRef, Input, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

import { Map, LngLat, Point } from 'mapbox-gl';

declare var mapboxgl: any;

const MAX_ZOOM = 20;
const MIN_ZOOM = 9;

@Component({
    selector: 'cm-map',
    templateUrl: './map.html',
    styleUrls: ['./map.scss']
})
export class MapComponent implements OnInit {
    @ViewChild('map', {static: true}) mapElement: ElementRef;
    private MAP_TILES_URL = environment.mapTilesUrl;

    @Input() overlayLeftSize = '0px';
    @Input() overlayRightSize = '0px';
    @Input() overlayTopSize = '0px';
    @Input() overlayBottomSize = '0px';

    public viennaMapVisible = true;
    public map: Map;

    public isMaxZoom = false;
    public isMinZoom = false;

    public noWebGL = false;

    constructor(
        private router: Router,
        private zone: NgZone
    ) {
        // check webgl
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl || !(gl instanceof WebGLRenderingContext)) {
            this.noWebGL = true;
        }
    }

    ngOnInit() {
        if (this.noWebGL) {
            return;
        }

        this.map = new mapboxgl.Map({
            container: this.mapElement.nativeElement,
            attributionControl: false,
            maxZoom: MAX_ZOOM,
            minZoom: MIN_ZOOM,
            maxPitch: 89,
            style: './assets/map/styles/panorama_street-view.json',
//            style: './assets/map/styles/birds-eye-view.json',
            center: [16.3128, 48.1858], // starting position
            zoom: 17.14 // starting zoom
        });

        (<any>window).map = this.map;


        this.map.addControl(new mapboxgl.AttributionControl(), 'top-right');

        this.map.on('zoomend', (e) => {
            const zoom = e.target.getZoom();
            let newIsMaxZoom = false;
            let newIsMinZoom = false;
            if (zoom === MIN_ZOOM) {
                newIsMinZoom = true;
            } else if (zoom === MAX_ZOOM) {
                newIsMaxZoom = true;
            }
            if (this.isMinZoom !== newIsMinZoom || this.isMaxZoom !== newIsMaxZoom) {
                this.zone.run(() => {
                    this.isMinZoom = newIsMinZoom;
                    this.isMaxZoom = newIsMaxZoom;
                });
            }
        });

        // TODO: move to topography module
        this.map.on('load', () => {


        });

    }

    private getOverlaySize(size: string, fullSize: number) {
        let result;
        if (size.endsWith('%')) {
            result = parseFloat(size.substring(0, size.length - 1)) * fullSize / 100;
        } else if (size.endsWith('px')) {
            result = parseFloat(size.substring(0, size.length - 2));
        } else {
            console.log('error: size not valid format');
        }
        return result;
    }

    private getVisibleMapCenterPixel() {
        const mapSize = this.map.project(this.map.getBounds().getSouthEast());

        const overlayRightSize = this.getOverlaySize(this.overlayRightSize, mapSize.x);
        const overlayLeftSize = this.getOverlaySize(this.overlayLeftSize, mapSize.x);
        const overlayTopSize = this.getOverlaySize(this.overlayTopSize, mapSize.y);
        const overlayBottomSize = this.getOverlaySize(this.overlayBottomSize, mapSize.y);

        const centerX = ((mapSize.x - overlayRightSize - overlayLeftSize) / 2) + overlayLeftSize;
        const centerY = ((mapSize.y - overlayTopSize - overlayBottomSize) / 2) + overlayTopSize;

        return new Point(centerX, centerY);
    }

    private getVisibleMapCenterLatLng() {
        return this.map.unproject(this.getVisibleMapCenterPixel());
    }

    private getVisibleMapCenterOffest() {
        const mapCenter = this.map.project(this.map.getCenter());
    }

    public zoomIn() {
        this.map.zoomIn(<any>{ around: this.getVisibleMapCenterLatLng() });
    }

    public zoomOut() {
        this.map.zoomOut(<any>{ around: this.getVisibleMapCenterLatLng() });
    }

    public flyTo(coordinate: LngLat, zoom: number = null) {
        if (!this.map) {
            return;
        }

        if (!zoom) {
            zoom = this.map.getZoom();
        }

        const mapCenterPixel = this.map.project(this.map.getCenter());
        const visibleMapCenterPixel = this.getVisibleMapCenterPixel();
        const coordPixel = this.map.project(coordinate);

        const centerX = coordPixel.x + (mapCenterPixel.x - visibleMapCenterPixel.x);
        const centerY = coordPixel.y + (mapCenterPixel.y - visibleMapCenterPixel.y);

        this.map.easeTo({
            center: this.map.unproject(<Point>{ x: centerX, y: centerY }),
            zoom: zoom,
            duration: 600
        });
    }


}
