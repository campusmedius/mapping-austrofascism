import { Relation } from './relation';

export interface Mediation {
    id: string;
    demandDe: string;
    demandEn: string;
    responseDe: string;
    responseEn: string;
    relations: Relation[];
}
