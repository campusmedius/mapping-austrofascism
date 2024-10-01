import { Moment } from 'moment';
import { Information } from '../../information/models/information';
import { LngLat } from 'mapbox-gl';


export interface Event {
    id: string;
    titleDe: string;
    titleEn: string;
    abstractDe: string;
    abstractEn: string;
    start: Moment;
    end: Moment;
    created: Moment;
    updated: Moment;
    timelineRow: number;
    information: Information;
    informationId: string;
    coordinates: LngLat;
    keywordsDe: string[];
    keywordsEn: string[];
    nextEvent: Event;
    previousEvent: Event;
    nextEventId: string;
    previousEventId: string;
}

export interface TimelineLine {
    left: number;
    width: number;
    event: Event;
}
