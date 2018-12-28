import { Component, OnInit, ViewChild, ElementRef, Input, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

import * as mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import { Map, LngLat, Point } from 'mapbox-gl';

const MAX_ZOOM = 15;
const MIN_ZOOM = 9;

@Component({
    selector: 'cm-map',
    templateUrl: './map.html',
    styleUrls: ['./map.scss']
})
export class MapComponent implements OnInit {
    @ViewChild('map') mapElement: ElementRef;
    private MAP_TILES_URL = environment.mapTilesUrl;

    @Input() overlayLeftSize = '0px';
    @Input() overlayRightSize = '0px';
    @Input() overlayTopSize = '0px';
    @Input() overlayBottomSize = '0px';

    public viennaMapVisible = true;
    public map: Map;

    public isMaxZoom = false;
    public isMinZoom = false;

    private paths = {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [
                        [
                            16.504679213444614,
                            48.21700684299768
                        ],
                        [
                            16.504207144656178,
                            48.21566286162705
                        ],
                        [
                            16.49240542499803,
                            48.21730708933378
                        ],
                        [
                            16.491010676309713,
                            48.21702114048203
                        ],
                        [
                            16.489701758309874,
                            48.21690676049404
                        ],
                        [
                            16.486724506304792,
                            48.21741860888722
                        ],
                        [
                            16.483693610119445,
                            48.21788756045956
                        ],
                        [
                            16.483639965939155,
                            48.21796762524958
                        ],
                        [
                            16.482953320432106,
                            48.218739669210336
                        ],
                        [
                            16.48125816433452,
                            48.21982622987548
                        ],
                        [
                            16.46960664837574,
                            48.229961586058224
                        ],
                        [
                            16.467160473754763,
                            48.23426385958202
                        ],
                        [
                            16.4658515557552,
                            48.23506424265465
                        ],
                        [
                            16.462418328216373,
                            48.235493014150286
                        ],
                        [
                            16.46048713772613,
                            48.23922317454985
                        ],
                        [
                            16.460530053070645,
                            48.240352173313255
                        ],
                        [
                            16.45362068264937,
                            48.245110843603385
                        ],
                        [
                            16.45183969586361,
                            48.24673983621778
                        ],
                        [
                            16.451582203798242,
                            48.24748286824954
                        ],
                        [
                            16.45183969586361,
                            48.248483086630635
                        ],
                        [
                            16.449221859865407,
                            48.248654550674566
                        ],
                        [
                            16.443449746065543,
                            48.25002624233052
                        ],
                        [
                            16.436712037021486,
                            48.24326744728334
                        ],
                        [
                            16.434416066104994,
                            48.24168121587688
                        ],
                        [
                            16.413130055365865,
                            48.230161699824606
                        ],
                        [
                            16.401081572473565,
                            48.22374623464121
                        ],
                        [
                            16.400899182258204,
                            48.22359184183782
                        ],
                        [
                            16.395341645180103,
                            48.22054677835409
                        ],
                        [
                            16.39360357373887,
                            48.219560310493705
                        ],
                        [
                            16.39322270005856,
                            48.219367303688976
                        ],
                        [
                            16.39280963987007,
                            48.21918144459664
                        ],
                        [
                            16.392369757591876,
                            48.2189991590622
                        ],
                        [
                            16.391897688805532,
                            48.21883831834575
                        ],
                        [
                            16.391243229806083,
                            48.21852378392884
                        ],
                        [
                            16.391001830994792,
                            48.21831111467685
                        ],
                        [
                            16.390835534035897,
                            48.21811274172107
                        ],
                        [
                            16.390814076363792,
                            48.217651655665044
                        ],
                        [
                            16.390824805199816,
                            48.217304944810444
                        ],
                        [
                            16.390856991707953,
                            48.21698682660003
                        ],
                        [
                            16.39089990705252,
                            48.216343435412924
                        ],
                        [
                            16.391479264199596,
                            48.21361250727701
                        ],
                        [
                            16.39032054990455,
                            48.21106589248445
                        ],
                        [
                            16.389912854134668,
                            48.21100154628932
                        ],
                        [
                            16.386951695382063,
                            48.21115168728553
                        ],
                        [
                            16.386597643792165,
                            48.208577780725065
                        ],
                        [
                            16.386597643792165,
                            48.208170233656546
                        ],
                        [
                            16.38656545728401,
                            48.20729792903158
                        ],
                        [
                            16.385460387169836,
                            48.20576063471741
                        ],
                        [
                            16.38455916494104,
                            48.20448786311462
                        ],
                        [
                            16.383969078957605,
                            48.20444496015002
                        ],
                        [
                            16.383067856728836,
                            48.20453076604329
                        ],
                        [
                            16.382821093499828,
                            48.204023079084294
                        ],
                        [
                            16.379945765436258,
                            48.201813509627705
                        ],
                        [
                            16.379398594797333,
                            48.20121998444068
                        ],
                        [
                            16.37882460206846,
                            48.20080522781812
                        ],
                        [
                            16.37732256501987,
                            48.19989346654166
                        ],
                        [
                            16.376550088823763,
                            48.200379741242195
                        ],
                        [
                            16.376120935382087,
                            48.20051203576574
                        ],
                        [
                            16.375841985644,
                            48.200504884719564
                        ],
                        [
                            16.373900066317404,
                            48.200015035649244
                        ],
                        [
                            16.37344945520301,
                            48.19990061767387
                        ],
                        [
                            16.372891555728643,
                            48.19993994888176
                        ],
                        [
                            16.371153484286513,
                            48.200379741242195
                        ],
                        [
                            16.368932615222718,
                            48.20101975752483
                        ],
                        [
                            16.368058215083934,
                            48.20111629559945
                        ],
                        [
                            16.367360840740528,
                            48.20103048398631
                        ],
                        [
                            16.366819034519782,
                            48.20079807681231
                        ],
                        [
                            16.3665937289626,
                            48.20069438711766
                        ],
                        [
                            16.365976820889184,
                            48.20079807681231
                        ],
                        [
                            16.364678631725976,
                            48.20106266335837
                        ],
                        [
                            16.363965164128032,
                            48.20126646557651
                        ],
                        [
                            16.362892280522043,
                            48.2018170850599
                        ],
                        [
                            16.362210999432286,
                            48.20114132395961
                        ],
                        [
                            16.361781845989686,
                            48.20070868915682
                        ],
                        [
                            16.3609342679418,
                            48.199839833020384
                        ],
                        [
                            16.358970890943375,
                            48.19913901651044
                        ],
                        [
                            16.35728646368212,
                            48.198534733353554
                        ],
                        [
                            16.356336961690634,
                            48.19822364989638
                        ],
                        [
                            16.354293118421328,
                            48.19771232470648
                        ],
                        [
                            16.35381032079877,
                            48.1975943258614
                        ],
                        [
                            16.35224927515294,
                            48.196897054408886
                        ],
                        [
                            16.35172892660402,
                            48.196360685295886
                        ],
                        [
                            16.351160298292413,
                            48.195448844917145
                        ],
                        [
                            16.350538025801704,
                            48.194697905360464
                        ],
                        [
                            16.349711905424694,
                            48.19385040321371
                        ],
                        [
                            16.34918619245763,
                            48.19312804854578
                        ],
                        [
                            16.34918082804034,
                            48.19312447250714
                        ],
                        [
                            16.348140130942507,
                            48.19407568996225
                        ],
                        [
                            16.34699214548381,
                            48.19511986322798
                        ]
                    ]
                },
                'properties': {
                    'event': 15
                }
            },
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [
                        [
                            16.313137303302607,
                            48.18650408467937
                        ],
                        [
                            16.31337333769615,
                            48.18696187472001
                        ],
                        [
                            16.313823948810544,
                            48.18684742759348
                        ],
                        [
                            16.314403305957622,
                            48.18777730310251
                        ],
                        [
                            16.3142101869086,
                            48.188406747717046
                        ],
                        [
                            16.315240155170073,
                            48.19035225492375
                        ],
                        [
                            16.320239792773805,
                            48.19013768054683
                        ],
                        [
                            16.322557221362125,
                            48.19033794999343
                        ],
                        [
                            16.326848755785203,
                            48.1912677621704
                        ],
                        [
                            16.32841516585013,
                            48.19143941795893
                        ],
                        [
                            16.33154798597905,
                            48.19165398688523
                        ],
                        [
                            16.332470665879665,
                            48.19194007738898
                        ],
                        [
                            16.334122906632736,
                            48.19347063445518
                        ],
                        [
                            16.33583952040215,
                            48.19451482005111
                        ],
                        [
                            16.33811403364593,
                            48.19533012825588
                        ],
                        [
                            16.339058171219236,
                            48.195573287840716
                        ],
                        [
                            16.340002308792545,
                            48.19568771548084
                        ],
                        [
                            16.339980851120742,
                            48.19593087336856
                        ],
                        [
                            16.34174038023378,
                            48.196274153127526
                        ],
                        [
                            16.34553838819884,
                            48.19700361497866
                        ],
                        [
                            16.34800602049164,
                            48.19757573465377
                        ],
                        [
                            16.35234047025926,
                            48.19916333328773
                        ],
                        [
                            16.354207287733182,
                            48.199835544910485
                        ],
                        [
                            16.356868039075906,
                            48.20057925812971
                        ],
                        [
                            16.359142552319682,
                            48.201094130187464
                        ],
                        [
                            16.36017252058205,
                            48.20146597901107
                        ],
                        [
                            16.36133123487621,
                            48.20256720776958
                        ],
                        [
                            16.363713036480846,
                            48.20391153286354
                        ],
                        [
                            16.364356766644267,
                            48.20349679803441
                        ],
                        [
                            16.368047486248464,
                            48.20269592127395
                        ],
                        [
                            16.373605023326586,
                            48.2014802808348
                        ],
                        [
                            16.37423802465095,
                            48.20162615916778
                        ]
                    ]
                },
                'properties': {
                    'event': 15
                }
            }
        ]
    };
    constructor(
        private router: Router,
        private zone: NgZone
    ) { }

    ngOnInit() {
        // check webgl
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl || !(gl instanceof WebGLRenderingContext)) {
            alert('No Webgl found');
            return;
        }

        mapboxgl.accessToken = 'pk.eyJ1IjoiY2FydDBncmFwaCIsImEiOiI2Z1FEdEJVIn0.y2iW4bIEbP-xCQ8BU3-RjA';
        this.map = new mapboxgl.Map({
            container: this.mapElement.nativeElement,
            maxZoom: MAX_ZOOM,
            minZoom: MIN_ZOOM,
            style: 'mapbox://styles/mapbox/streets-v9',
            center: [16.4, 48.2], // starting position
            zoom: 11 // starting zoom
        });

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
