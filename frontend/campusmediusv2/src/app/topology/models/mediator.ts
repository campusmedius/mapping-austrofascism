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
    created: Moment;
    updated: Moment;
    medium: Medium;
    information: Information;
    informationId: string;
    coordinates: LngLat;
    keywordsDe: string;
    keywordsEn: string;
    relationsTo: Relation[];
    relationsFrom: Relation[];
    mediationId: string;
    bearing: number;
    pitch: number;
    zoom: number;
}

