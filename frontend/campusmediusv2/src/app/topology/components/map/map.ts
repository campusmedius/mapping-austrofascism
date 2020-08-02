import { Component, OnInit, ViewChild, ElementRef, Input, NgZone, HostBinding } from '@angular/core';
import { Router } from '@angular/router';

import { Map, LngLat, Point as MapboxPoint, PointLike } from 'mapbox-gl';
import * as turf from '@turf/turf';
import { LineString, Point, Feature, Coord } from '@turf/turf';
import { Relation } from '@app/topology/models/relation';
import { Mediation } from '@app/topology/models/mediation';
import { Mediator } from '@app/topology/models/mediator';

declare var mapboxgl: any;

const MAX_ZOOM = 18;
const MIN_ZOOM = 0;

@Component({
    selector: 'cm-map',
    templateUrl: './map.html',
    styleUrls: ['./map.scss']
})
export class MapComponent implements OnInit {
    @ViewChild('map', { static: true }) mapElement: ElementRef;

    @Input() overlayLeftSize = '0px';
    @Input() overlayRightSize = '0px';
    @Input() overlayTopSize = '0px';
    @Input() overlayBottomSize = '0px';

    public viennaMapVisible = true;
    public map: Map;

    public isMaxZoom = false;
    public isMinZoom = false;

    public noWebGL = false;

    private animationStepDistance = 0.04;
    private animationRouteLength = 0;
    private animationRoute: Feature<LineString>;
    private animationCounter = 0;
    private animationLastPoint: Feature<Point>;

    private currentMediationId: string;

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

    animateRoute(source: Mediator, target: Mediator) {
        const bearing = turf.bearing([source.coordinates.lng, source.coordinates.lat],
                                     [target.coordinates.lng, target.coordinates.lat]);

        const distance = turf.distance([source.coordinates.lng, source.coordinates.lat],
                                       [target.coordinates.lng, target.coordinates.lat]);

        const duration = 15000 * distance / 8.2; // normalize to longest distance

        this.map.easeTo({
            zoom: 16.5,
            pitch: 75,
            bearing: bearing,
            duration: 500,
            easing: (t) => t
        });

        this.map.once('moveend', () => {
            this.map.easeTo({
                center: target.coordinates,
                duration: duration,
                easing: (t) => t
            });
            this.map.once('moveend', () => {
                this.map.easeTo({
                    zoom: target.zoom,
                    pitch: target.pitch,
                    bearing: target.bearing,
                    duration: 500,
                    easing: (t) => t
                });
            });
        });

    }


    navigateToGod() {
        setTimeout(() => {
            this.map.setLayoutProperty('eckebrecht', 'visibility', 'visible');
        }, 1000);

        this.map.flyTo({
            zoom: 1.3,
            duration: 5000,
            center: [0, 0],
            curve: 1
        });

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
            style: './assets/map/styles/governed-transmissions.json',
            center: [16.311658322849894, 48.1850403758292], // starting position
            pitch: 55,
            bearing: -21.6,
            zoom: 16.6 // starting zoom
        });

        (<any>window).map = this.map;

        this.map.addControl(new mapboxgl.AttributionControl(), 'top-right');

        // TODO: move to topography module
        this.map.on('load', () => {
            this.map.resize();
        });

    }

    public setPerspective(mediation: Mediation) {
        if (!mediation && this.currentMediationId !== null) {
            this.map.setStyle('./assets/map/styles/governed-transmissions.json');
            this.map.jumpTo({
                center: [16.311658322849894, 48.1850403758292],
                pitch: 55,
                bearing: -21.6,
                zoom: 16.6
            });
            this.currentMediationId = null;
        } else if (mediation.id === '1' && this.currentMediationId !== '1') {
            this.map.setStyle('./assets/map/styles/sovereign-signs.json');
            this.currentMediationId = '1';
        } else if (mediation.id === '2' && this.currentMediationId !== '2') {
            this.map.setStyle('./assets/map/styles/examining-gazes.json');
            this.currentMediationId = '2';
        } else if (mediation.id === '3' && this.currentMediationId !== '3') {
            this.map.setStyle('./assets/map/styles/governed-transmissions.json');
            this.currentMediationId = '3';
        }
    }

    public doNavigation(mediation: Mediation, sourceMediator: Mediator, targetMediator: Mediator) {
        if (mediation.id === '1') {
            if (targetMediator.id === '0') {
                this.navigateToGod();
            } else {
                this.map.flyTo({
                    center: targetMediator.coordinates,
                    zoom: targetMediator.zoom,
                    duration: 5000,
                    curve: 1
                });

                setTimeout(() => {
                    this.map.setLayoutProperty('eckebrecht', 'visibility', 'none');
                }, 2500);

            }
        } else if (mediation.id === '2') {
            this.map.flyTo({
                center: targetMediator.coordinates,
                bearing: targetMediator.bearing,
                pitch: targetMediator.pitch,
                zoom: targetMediator.zoom,
                duration: 6000,
                curve: 0.1
            });
        } else if (mediation.id === '3') {
            this.animateRoute(sourceMediator, targetMediator);
        }
    }

    public showMediator(mediation: Mediation, mediator: Mediator) {
        if (mediator.id === '0') {
            if (this.map.isStyleLoaded()) {
                this.map.setLayoutProperty('eckebrecht', 'visibility', 'visible');
            } else {
                this.map.on('load', () => {
                    this.map.setLayoutProperty('eckebrecht', 'visibility', 'visible');
                });
            }
        }

        this.map.jumpTo({
            center: mediator.coordinates,
            zoom: mediator.zoom,
            pitch: mediator.pitch,
            bearing: mediator.bearing
        });

    }
}
