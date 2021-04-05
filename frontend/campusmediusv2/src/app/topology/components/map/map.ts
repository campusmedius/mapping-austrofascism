import { Component, OnInit, ViewChild, ElementRef, Input, NgZone, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { Map } from 'mapbox-gl';
import * as turf from '@turf/turf';
import { Mediation } from '@app/topology/models/mediation';
import { Mediator } from '@app/topology/models/mediator';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';

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

    @Input() isMobile = false;

    @Input() selectedMediation: Mediation;
    @Input() selectedMediator: Mediator;

    public viennaMapVisible = true;
    public map: Map;

    public isMaxZoom = false;
    public isMinZoom = false;

    public noWebGL = false;
    public isServer = true;

    private timer: ReturnType<typeof setTimeout>;

    private buildingsOnMap = false;
    private layerSchoenbrunn;
    private layerJohannesgasse;
    private layerFichtegasse;
    private layerKarlmarxhof;
    private layerVorwaertshaus;

    private currentMediationId: string;


    constructor(
        private router: Router,
        private zone: NgZone,
        @Inject(PLATFORM_ID) private platformId: any,
    ) {

        if (isPlatformBrowser(this.platformId)) {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl || !(gl instanceof WebGLRenderingContext)) {
                this.noWebGL = true;
            }
            this.isServer = false;
        } else {
            this.isServer = true;
        }
    }

    animateRoute(source: Mediator, target: Mediator) {
        const distance = turf.distance([source.coordinates.lng, source.coordinates.lat],
                                       [target.coordinates.lng, target.coordinates.lat]);

        const duration = 15000 * distance / 8.2; // normalize to longest distance

        this.map.easeTo({
            center: target.coordinates,
            duration: duration,
            easing: (t) => t
        });
    }


    navigateToGod() {
        this.timer = setTimeout(() => {
            this.map.setLayoutProperty('eckebrecht', 'visibility', 'visible');
        }, 1000);

        this.map.flyTo({
            zoom: this.isMobile ? 1 : 1.3,
            duration: 5000,
            center: [0, 0],
            curve: 1
        });

    }

    ngOnInit() {
        if (this.noWebGL || this.isServer) {
            return;
        }

        this.map = new mapboxgl.Map({
            container: this.mapElement.nativeElement,
            attributionControl: false,
            maxZoom: MAX_ZOOM,
            minZoom: MIN_ZOOM,
            maxPitch: 89,
            style: './assets/map/styles/topology.json',
            center: [16.311658322849894, 48.1850403758292], // starting position
            pitch: 55,
            bearing: -21.6,
            zoom: 16.6, // starting zoom
            interactive: false
        });

        this.map.addControl(new mapboxgl.AttributionControl(), 'top-right');

        // TODO: move to topography module
        this.map.on('load', () => {
            this.map.resize();
        });

        this.layerSchoenbrunn = this.createBuildingLayer('schoenbrunn', './assets/map/buildings/schoenbrunn.glb', [16.3188412, 48.1844412, -1.8]);
        this.layerJohannesgasse = this.createBuildingLayer('johannesgasse', './assets/map/buildings/johannesgasse.glb', [16.3723716, 48.2047589, 0]);
        this.layerFichtegasse = this.createBuildingLayer('fichtegasse', './assets/map/buildings/fichtegasse.glb', [16.3772644, 48.2028985, -0.5]);
        this.layerKarlmarxhof = this.createBuildingLayer('karlmarxhof', './assets/map/buildings/karlmarxhof.glb', [16.3625843, 48.2452702, -1.4]);
        this.layerVorwaertshaus = this.createBuildingLayer('vorwaertshaus', './assets/map/buildings/vorwaertshaus.glb', [16.3547281, 48.1920838, 0]);
    }

    private addBulidings() {
      if (!this.buildingsOnMap) {
        this.map.addLayer(this.layerSchoenbrunn);
        this.map.addLayer(this.layerJohannesgasse);
        this.map.addLayer(this.layerFichtegasse);
        this.map.addLayer(this.layerKarlmarxhof);
        this.map.addLayer(this.layerVorwaertshaus);
        this.buildingsOnMap = true;
      }
    }

    private removeBuildings() {
      if (this.buildingsOnMap) {
          this.map.removeLayer('schoenbrunn');
          this.map.removeLayer('johannesgasse');
          this.map.removeLayer('fichtegasse');
          this.map.removeLayer('karlmarxhof');
          this.map.removeLayer('vorwaertshaus');
          this.buildingsOnMap = false;
      }
    }

    public setPerspective(mediation: Mediation) {
        if (!this.map) {
            return
        }

        if (mediation.id === '1' && this.currentMediationId !== '1') {
            //this.map.setStyle('./assets/map/styles/topology.json');
            this.removeBuildings();
            this.currentMediationId = '1';
        } else if (mediation.id === '2' && this.currentMediationId !== '2') {
            //this.map.setStyle('./assets/map/styles/topology.json');
            if (this.map.isStyleLoaded()) {
                this.map.setLayoutProperty('eckebrecht', 'visibility', 'none');
            }
            this.removeBuildings();
            this.currentMediationId = '2';
        } else if (mediation.id === '3' && this.currentMediationId !== '3') {
            //this.map.setStyle('./assets/map/styles/topology.json');
            if (this.map.isStyleLoaded()) {
                this.map.setLayoutProperty('eckebrecht', 'visibility', 'none');
                this.addBulidings();
            } else {
              this.map.on('style.load', () => {
                  this.addBulidings();
                  this.map.setLayoutProperty('eckebrecht', 'visibility', 'none');
              });
            }
            this.currentMediationId = '3';
        }
    }

    public doNavigation(mediation: Mediation, sourceMediator: Mediator, targetMediator: Mediator) {
        if (!this.map) {
            return
        }

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

                this.timer = setTimeout(() => {
                    this.map.setLayoutProperty('eckebrecht', 'visibility', 'none');
                }, 2500);

            }
        } else if (mediation.id === '2') {
            this.map.flyTo({
                center: targetMediator.coordinates,
                bearing: targetMediator.bearing,
                pitch: (this.isMobile === false) ? targetMediator.pitch : (targetMediator.pitch - 10),
                zoom: targetMediator.zoom,
                duration: 6000,
                curve: 0.1
            });
        } else if (mediation.id === '3') {
            this.animateRoute(sourceMediator, targetMediator);
        }
    }

    public flyToSovereignSign(mediation: Mediation, sourceMediator: Mediator, targetMediator: Mediator) {
        if (!this.map) {
            return
        }

        this.map.flyTo({
            center: [16.372472, 48.208417],
            duration: 2000,
            zoom: 11
        });
        this.map.once('moveend', () => {
            this.map.flyTo({
                center: targetMediator.coordinates,
                duration: 2000,
                zoom: targetMediator.zoom
            });
        });
    }

    public showMediator(mediation: Mediation, mediator: Mediator) {
        if (!this.map) {
            return
        }

        if (mediator.id === '0') {
            mediator.zoom = this.isMobile ? 1 : 1.3;
            setTimeout(() => {
                if (this.map.isStyleLoaded()) {
                    this.map.setLayoutProperty('eckebrecht', 'visibility', 'visible');
                } else {
                    this.map.on('load', () => {
                        this.map.setLayoutProperty('eckebrecht', 'visibility', 'visible');
                    });
                }
             }, 0);
        }

        this.map.jumpTo({
            center: mediator.coordinates,
            zoom: (this.isMobile === true && mediation.id === '3') ? (mediator.zoom - 0.5) : mediator.zoom,
            pitch: (this.isMobile === false) ? mediator.pitch : (mediator.pitch - 10),
            bearing: mediator.bearing
        });

    }

    public stopAnimation() {
      clearTimeout(this.timer);
      this.map.stop();
    }

    private createBuildingLayer(id: String, path: String, coord: [Number, Number, Number]) {
        if (isPlatformServer(this.platformId)) {
            return
        }

        // parameters to ensure the model is georeferenced correctly on the map
       var modelOrigin = [coord[0], coord[1]];
       var modelAltitude = coord[2];
       var modelRotate = [0, 0, 0];
       var modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
           modelOrigin,
           modelAltitude
       );
       // transformation parameters to position, rotate and scale the 3D model onto the map
       var modelTransform = {
           translateX: modelAsMercatorCoordinate.x,
           translateY: modelAsMercatorCoordinate.y,
           translateZ: modelAsMercatorCoordinate.z,
           rotateX: modelRotate[0],
           rotateY: modelRotate[1],
           rotateZ: modelRotate[2],
           /* Since our 3D model is in real world meters, a scale transform needs to be
            * applied since the CustomLayerInterface expects units in MercatorCoordinates.
            */
           scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
       };
       var THREE = (<any>window).THREE;
       // configuration of the custom layer for a 3D model per the CustomLayerInterface
       var customLayer = {
           id: id,
           type: 'custom',
           renderingMode: '3d',
           onAdd: function (map, gl) {
               this.camera = new THREE.Camera();
               this.scene = new THREE.Scene();
               this.scene.environment = null;


                var light = new THREE.AmbientLight( 0xffffff, 0.6 );
                this.scene.add( light );

                // create two three.js lights to illuminate the model
                var directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
                directionalLight.position.set(0, -70, 100).normalize();
                this.scene.add(directionalLight);
                
                var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
                directionalLight2.position.set(0, 70, 100).normalize();
                this.scene.add(directionalLight2);

               // use the three.js GLTF loader to add the 3D model to the three.js scene
               var loader = new THREE.GLTFLoader();
               loader.load(
                   path,
                   function (gltf) {
                    var newMaterial = new THREE.MeshPhongMaterial({color: 0x6d4651, emissive: 0x281a1e});
                    gltf.scene.traverse((o) => {
                      if (o.isMesh) o.material = newMaterial;
                    });

                       this.scene.add(gltf.scene);
                   }.bind(this)
               );
               this.map = map;
               // use the Mapbox GL JS map canvas for three.js
               this.renderer = new THREE.WebGLRenderer({
                   canvas: map.getCanvas(),
                   context: gl,
                   antialias: true
               });
               this.renderer.autoClear = false;
           },
           render: function (gl, matrix) {
               var rotationX = new THREE.Matrix4().makeRotationAxis(
                   new THREE.Vector3(1, 0, 0),
                   modelTransform.rotateX
               );
               var rotationY = new THREE.Matrix4().makeRotationAxis(
                   new THREE.Vector3(0, 1, 0),
                   modelTransform.rotateY
               );
               var rotationZ = new THREE.Matrix4().makeRotationAxis(
                   new THREE.Vector3(0, 0, 1),
                   modelTransform.rotateZ
               );
               var m = new THREE.Matrix4().fromArray(matrix);
               var l = new THREE.Matrix4()
                   .makeTranslation(
                       modelTransform.translateX,
                       modelTransform.translateY,
                       modelTransform.translateZ
                   )
                   .scale(
                       new THREE.Vector3(
                           modelTransform.scale,
                           -modelTransform.scale,
                           modelTransform.scale
                       )
                   )
                   .multiply(rotationX)
                   .multiply(rotationY)
                   .multiply(rotationZ);

               this.camera.projectionMatrix = m.multiply(l);
               this.renderer.state.reset();
               this.renderer.render(this.scene, this.camera);
               this.map.triggerRepaint();
           }
       };
       return customLayer
    }

}
