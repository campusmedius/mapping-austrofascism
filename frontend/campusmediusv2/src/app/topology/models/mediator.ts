import { Moment } from 'moment';
import { Information } from '../../information/models/information';
import { LngLat } from 'mapbox-gl';
import { Medium } from './medium';
import { Relation } from './relation';


export interface Mediator {
    id: string;
    titleDe: string;
    titleEn: string;
    abstractDe: string;
    abstractEn: string;
    placeDe: string;
    placeEn: string;
    momentDe: string;
    momentEn: string;
    created: Moment;
    updated: Moment;
    medium: Medium;
    information: Information;
    informationId: string;
    coordinates: LngLat;
    time: Moment;
    keywordsDe: string;
    keywordsEn: string;
    relationsTo: Relation[];
    relationsFrom: Relation[];
    mediationId: string;
    bearing: number;
    pitch: number;
    zoom: number;
}

