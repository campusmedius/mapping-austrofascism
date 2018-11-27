import { Moment } from 'moment';
import { Information } from '../../information/models/information';
import { Coordinates } from '../../shared/models/geo';


export interface Event {
    id: string;
    titleDe: string;
    titleEn: string;
    abstractDe: string;
    abstractEn: string;
    start: Moment;
    end: Moment;
    timelineRow: number;
    information: string;
    informationId: string;
    coordinates: Coordinates;
    nextEvent: string;
    previousEvent: string;
}

export interface TimelineLine {
    left: number;
    width: number;
    event: Event;
}
