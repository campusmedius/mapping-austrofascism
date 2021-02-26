import { Information } from '@app/information/models/information';
import { Moment } from 'moment';

export interface Page {
    id: string;
    titleDe: string;
    titleEn: string;
    abstractDe: string;
    abstractEn: string;
    created: Moment;
    updated: Moment;
    mobileAbstractDe: string;
    mobileAbstractEn: string;
    keywordsDe: string[];
    keywordsEn: string[];
    information: Information;
    informationId: string;
}
