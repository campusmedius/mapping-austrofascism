import { Component, OnInit, ViewChild, ElementRef, Input, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

import { Map, LngLat, Point as MapboxPoint, PointLike } from 'mapbox-gl';
import * as turf from '@turf/turf';
import { LineString, Point, Feature } from '@turf/turf';
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

    private animationStepDistance = 0.1;
    private animationRouteLength = 0;
    private animationRoute: Feature<LineString>;
    private animationCounter = 0;
    private animationLastPoint: Feature<Point>;

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

    animateRoute(route: Feature<LineString>) {
        this.animationRoute = route;
        this.animationRouteLength = turf.length(route);
        this.animationCounter = 0;
        this.animationLastPoint = turf.along(this.animationRoute, 0);
        this.animateRouteStep();
    }

    animateRouteStep() {
        const nextPoint = turf.along(this.animationRoute, this.animationCounter * this.animationStepDistance);
        const bearing = turf.bearing(this.animationLastPoint, nextPoint);

        // fly to next point
        this.map.easeTo({
            duration: 40,
            center: <LngLat><any>nextPoint.geometry.coordinates,
            bearing: bearing,
            pitch: 67,
            zoom: 18,
            easing: (t) => t
        });

        this.animationCounter += 1;
        this.animationLastPoint = nextPoint;

        // Request the next frame of animation so long the end has not been reached.
        if ((this.animationCounter * this.animationStepDistance) < this.animationRouteLength) {
            this.map.once('moveend', () => this.animateRouteStep());
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
            // style: './assets/map/styles/panorama_street-view.json',
            style: './assets/map/styles/buildings.json',
            // style: './assets/map/styles/birds-eye-view.json',
            center: [16.312149167060852, 48.184669372961885], // starting position
            pitch: 83,
            zoom: 18 // starting zoom
        });

        (<any>window).map = this.map;


        this.map.addControl(new mapboxgl.AttributionControl(), 'top-right');

        // TODO: move to topography module
        this.map.on('load', () => {
            this.map.addLayer({
                id: 'vienna-map-1933',
                type: 'raster',
                source: {
                    type: 'raster',
                    tiles: [
                        `${this.MAP_TILES_URL}/{z}/{x}/{y}.png`
                    ],
                    tileSize: 256,
                    scheme: 'tms',
                    minzoom: 0,
                    maxzoom: 22
                }
            }, 'building');
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

        return new MapboxPoint(centerX, centerY);
    }

    private getVisibleMapCenterLatLng() {
        return this.map.unproject(this.getVisibleMapCenterPixel());
    }

    private getVisibleMapCenterOffest() {
        const mapCenter = this.map.project(this.map.getCenter());
    }

    private getOverlayAdjustedCoordinates(coordinates: LngLat) {
        const mapCenterPixel = this.map.project(this.map.getCenter());
        const visibleMapCenterPixel = this.getVisibleMapCenterPixel();
        const coordPixel = this.map.project(coordinates);

        const centerX = coordPixel.x + (mapCenterPixel.x - visibleMapCenterPixel.x);
        const centerY = coordPixel.y + (mapCenterPixel.y - visibleMapCenterPixel.y);

        return this.map.unproject({ x: centerX, y: centerY } as PointLike);
    }

    public zoomIn() {
        this.map.zoomIn(<any>{ around: this.getVisibleMapCenterLatLng() });
    }

    public zoomOut() {
        this.map.zoomOut(<any>{ around: this.getVisibleMapCenterLatLng() });
    }

    public setPerspective(mediation: Mediation) {
        if (!mediation) {
            this.map.jumpTo({
                zoom: 16.58,
                bearing: -172.8,
                pitch: 44,
                center: { lng: 16.30977750423665, lat: 48.184310981018285 }
            });
        } else if (mediation.id === '1') {
            this.map.setStyle('./assets/map/styles/buildings.json');
        } else if (mediation.id === '2') {
            this.map.setStyle('./assets/map/styles/buildings.json');
        } else if (mediation.id === '3') {
            this.map.setStyle('./assets/map/styles/buildings.json');
        }
    }

    public doNavigation(mediation: Mediation, sourceMediator: Mediator, targetMediator: Mediator) {
        if (mediation.id === '1') {
            if (targetMediator.id === '16') {
                this.map.flyTo({
                    zoom: 1,
                    duration: 200
                });
            } else {
                this.map.flyTo({
                    center: targetMediator.coordinates,
                    zoom: targetMediator.zoom,
                    duration: 200
                });
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
            console.log(sourceMediator.id + '-' + targetMediator.id);

            let route =  turf.lineString([
                [
                    sourceMediator.coordinates.lng,
                    sourceMediator.coordinates.lat
                ],
                [
                    targetMediator.coordinates.lng,
                    targetMediator.coordinates.lat
                ]
            ]);
            if (this.routes[sourceMediator.id] && this.routes[sourceMediator.id][targetMediator.id]) {
                route = this.routes[sourceMediator.id][targetMediator.id];
            }
            this.animateRoute(route);
        }
    }

    public showMediator(mediation: Mediation, mediator: Mediator) {
        this.map.jumpTo({
            center: mediator.coordinates,
            zoom: mediator.zoom,
            pitch: 0,
            bearing: 0
        });
        this.map.jumpTo({
            center: this.getOverlayAdjustedCoordinates(mediator.coordinates),
        });
        //this.map.setPitch(mediator.pitch);
        this.map.jumpTo({
            around: mediator.coordinates,
            pitch: mediator.pitch,
            bearing: mediator.bearing
        });
    }

    private routes = {
        '11': {
            '12': turf.lineString([
                [
                    16.31218671798706,
                    48.18472302236427
                ],
                [
                    16.315137147903442,
                    48.190123441516214
                ],
                [
                    16.315759420394897,
                    48.190352320883285
                ],
                [
                    16.319552063941952,
                    48.190123441516214
                ],
                [
                    16.322518587112427,
                    48.19030582984459
                ],
                [
                    16.324503421783447,
                    48.1906670283439
                ],
                [
                    16.32720708847046,
                    48.19131431829516
                ],
                [
                    16.33139669895172,
                    48.19163974827592
                ],
                [
                    16.33245348930359,
                    48.1919294149818
                ],
                [
                    16.334261298179626,
                    48.19353149262171
                ],
                [
                    16.335296630859375,
                    48.19423596179967
                ],
                [
                    16.335983276367188,
                    48.19461501227339
                ],
                [
                    16.338708400726315,
                    48.19551613987803
                ],
                [
                    16.341047286987305,
                    48.1961276102981
                ],
                [
                    16.34269416332245,
                    48.19646731293376
                ],
                [
                    16.34467899799347,
                    48.19681058909863
                ],
                [
                    16.34768307209015,
                    48.19750786172777
                ],
                [
                    16.349474787712094,
                    48.19807282438564
                ],
                [
                    16.351325511932373,
                    48.198805836270026
                ],
                [
                    16.353460550308228,
                    48.199610349436384
                ],
                [
                    16.355080604553223,
                    48.20009305127186
                ],
                [
                    16.35589599609375,
                    48.200325461644574
                ],
                [
                    16.358583569526672,
                    48.20094760114545
                ],
                [
                    16.359533071517944,
                    48.201180007641206
                ],
                [
                    16.360074877738953,
                    48.20145889404435
                ],
                [
                    16.36064350605011,
                    48.201877220802196
                ],
                [
                    16.3614159822464,
                    48.20257799985264
                ],
                [
                    16.36366367340088,
                    48.20392947523346
                ],
                [
                    16.36205434799194,
                    48.205148632748404
                ],
                [
                    16.3621187210083,
                    48.2053452683396
                ],
                [
                    16.366485357284546,
                    48.20793006237886
                ],
                [
                    16.367831826210022,
                    48.20897037834795
                ],
                [
                    16.366056203842163,
                    48.2101608170861
                ]
            ]),
            '14': turf.lineString([
                [
                    16.31218671798706,
                    48.184737328862084
                ],
                [
                    16.315083503723145,
                    48.1901377465066
                ],
                [
                    16.31546974182129,
                    48.1903415921858
                ],
                [
                    16.3158318400383,
                    48.190352320883285
                ],
                [
                    16.319541335105896,
                    48.19012165339214
                ],
                [
                    16.320539116859432,
                    48.19014668712357
                ],
                [
                    16.323103308677673,
                    48.19033801595279
                ],
                [
                    16.32705956697464,
                    48.19130358979908
                ],
                [
                    16.33146643638611,
                    48.19164511248904
                ],
                [
                    16.332477629184723,
                    48.19192226273717
                ],
                [
                    16.333416402339935,
                    48.19277694890194
                ],
                [
                    16.334508061408997,
                    48.19372459681175
                ],
                [
                    16.335133016109463,
                    48.194139410759185
                ],
                [
                    16.335980594158173,
                    48.19460428446834
                ],
                [
                    16.336726248264313,
                    48.194877842795215
                ],
                [
                    16.339942216873165,
                    48.1958951808812
                ],
                [
                    16.337817907333374,
                    48.201626940246484
                ],
                [
                    16.337324380874634,
                    48.205953046303236
                ],
                [
                    16.33741021156311,
                    48.206249782335874
                ],
                [
                    16.33891224861145,
                    48.20860215896064
                ],
                [
                    16.339266300201416,
                    48.20964603616281
                ],
                [
                    16.339786648750305,
                    48.21235572767313
                ],
                [
                    16.34242057800293,
                    48.2172385300389
                ],
                [
                    16.34368658065796,
                    48.220233752285715
                ],
                [
                    16.344357132911682,
                    48.22102363253134
                ],
                [
                    16.345086693763733,
                    48.22156689150865
                ],
                [
                    16.34612739086151,
                    48.22205296044344
                ],
                [
                    16.34817123413086,
                    48.22263909625555
                ],
                [
                    16.348954439163208,
                    48.22315374655677
                ],
                [
                    16.34943723678589,
                    48.22362550478732
                ],
                [
                    16.350005865097046,
                    48.226019968156585
                ],
                [
                    16.35092854499817,
                    48.23018320863316
                ],
                [
                    16.35116457939148,
                    48.23054055254774
                ],
                [
                    16.35393261909485,
                    48.23159112920427
                ],
                [
                    16.35419011116028,
                    48.231826969979075
                ],
                [
                    16.3541042804718,
                    48.23207710294641
                ],
                [
                    16.35293483734131,
                    48.233713657047204
                ],
                [
                    16.352773904800415,
                    48.234363976240296
                ],
                [
                    16.353567838668823,
                    48.23660072530353
                ],
                [
                    16.35541319847107,
                    48.240752386875215
                ],
                [
                    16.355563402175903,
                    48.241481215241805
                ],
                [
                    16.355348825454712,
                    48.24391771312005
                ],
                [
                    16.35563850402832,
                    48.24453217813026
                ],
                [
                    16.35587453842163,
                    48.24462506173369
                ],
                [
                    16.36143207550049,
                    48.244675075911864
                ],
                [
                    16.361775398254395,
                    48.24483226301052
                ],
                [
                    16.36187195777893,
                    48.245053753102404
                ],
                [
                    16.362215280532837,
                    48.24763297032724
                ],
                [
                    16.362816095352173,
                    48.249411911396585
                ],
                [
                    16.36313796043396,
                    48.24956908393754
                ],
                [
                    16.36336326599121,
                    48.249533362947915
                ]
            ])
        },
        '12': {
            '13': turf.lineString([
                [
                    16.366034746170044,
                    48.21016796678471
                ],
                [
                    16.36784791946411,
                    48.208945353813256
                ],
                [
                    16.368480920791626,
                    48.20943154258418
                ],
                [
                    16.37040138244629,
                    48.208251811843006
                ],
                [
                    16.37066960334778,
                    48.20818746211189
                ],
                [
                    16.371742486953735,
                    48.20798011242826
                ],
                [
                    16.373040676116943,
                    48.207572560603495
                ],
                [
                    16.37385606765747,
                    48.20728655738642
                ],
                [
                    16.37466073036194,
                    48.20684324924357
                ],
                [
                    16.37537956237793,
                    48.20652149093023
                ],
                [
                    16.375926733016968,
                    48.206314134501646
                ],
                [
                    16.376774311065674,
                    48.206178279834624
                ],
                [
                    16.377171277999878,
                    48.20632843497194
                ],
                [
                    16.37883424758911,
                    48.20555620386179
                ],
                [
                    16.376012563705444,
                    48.2028032482257
                ],
                [
                    16.376559734344482,
                    48.20256727371495
                ]
            ])
        }
    };
}
