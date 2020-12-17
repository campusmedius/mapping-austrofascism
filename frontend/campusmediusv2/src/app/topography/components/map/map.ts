import { Component, OnInit, ViewChild, ElementRef, Input, NgZone, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import {
    trigger,
    state,
    style,
    animate,
    transition
  } from '@angular/animations';
import { environment } from '../../../../environments/environment';

import * as mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import { Map, LngLat, Point } from 'mapbox-gl';

const MAX_ZOOM = 15;
const MIN_ZOOM = 9;

@Component({
    selector: 'cm-map',
    templateUrl: './map.html',
    styleUrls: ['./map.scss'],
    animations: [
        trigger('mapattribOpen', [
            state('true', style({ 'width': '*', display: '*' })),
            state('false', style({ 'width': '0px', display: 'none' })),
            transition('false => true', [
                style({ 'display': 'block' }),
                animate('300ms ease-in')
            ]),
            transition('true => false', [
                animate('300ms ease-in')
            ])
        ]),
      ]
})
export class MapComponent implements OnInit {
    @ViewChild('map', {static: true}) mapElement: ElementRef;
    @ViewChild('mapattrib', {static: true}) mapAttrib: ElementRef;
    private MAP_TILES_URL = environment.mapTilesUrl;

    @Input() overlayLeftSize = '0px';
    @Input() overlayRightSize = '0px';
    @Input() overlayTopSize = '0px';
    @Input() overlayBottomSize = '0px';

    public viennaMapVisible = true;
    public map: Map;

    public isMaxZoom = false;
    public isMinZoom = false;

    public mapAttribIsOpen = false;

    @HostListener('document:click', ['$event'])
    clickout(event) {
      if(!this.mapAttrib.nativeElement.contains(event.target)) {
        this.mapAttribIsOpen = false;
      }
    }

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
            style: 'https://campusmedius.net/assets/style.json',
            center: [16.372472, 48.208417], // starting position
            zoom: 12.14 // starting zoom
        });

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
            // this.map.addLayer({
            //     'id': 'paths',
            //     'type': 'line',
            //     'source': {
            //         'type': 'geojson',
            //         'data': <any>this.paths
            //     },
            //     'layout': {
            //         'line-join': 'round',
            //         'line-cap': 'round'
            //     },
            //     'paint': {
            //         'line-color': '#4d4d4d',
            //         'line-width': 8,
            //     }
            // });

            // // When a click event occurs on a feature in the paths layer
            // this.map.on('click', 'paths', (e) => {
            //     this.router.navigate(['/topography', 'events', e.features[0].properties.event],
            //         { queryParamsHandling: 'preserve' });
            // });

            // // Change the cursor to a pointer when the mouse is over the paths layer.
            // this.map.on('mouseenter', 'paths', () => {
            //     this.map.getCanvas().style.cursor = 'pointer';
            // });

            // // Change it back to a pointer when it leaves.
            // this.map.on('mouseleave', 'paths', () => {
            //     this.map.getCanvas().style.cursor = '';
            //     this.map.setPaintProperty('paths', 'line-color', '#4d4d4d');
            //     this.map.setPaintProperty('paths', 'line-opacity', 1);
            // });

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

        this.map.setZoom(zoom);

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

    public toogleViennaMap() {
        this.viennaMapVisible = !this.viennaMapVisible;
        if (this.viennaMapVisible) {
            this.map.setLayoutProperty('vienna-map-1933', 'visibility', 'visible');
        } else {
            this.map.setLayoutProperty('vienna-map-1933', 'visibility', 'none');
        }
    }

}
