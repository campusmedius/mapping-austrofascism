import { Information } from '../../information/models/information';
import { LngLat } from 'mapbox-gl';


export interface Page {
    id: string;
    titleDe: string;
    titleEn: string;
    abstractDe: string;
    abstractEn: string;
    contentDe: string;
    contentEn: string;
    information: string;
    informationId: string;
    coordinates: LngLat;
}
