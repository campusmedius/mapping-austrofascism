import { Mediator } from './mediator';

export interface Value {
    id: string;
    titleDe: string;
    titleEn: string;
}

export interface Space {
    id: string;
    titleDe: string;
    titleEn: string;
}

export interface Time {
    id: string;
    titleDe: string;
    titleEn: string;
}

export interface Relation {
    id: string;
    source: Mediator;
    sourceId: string;
    target: Mediator;
    targetId: string;
    value: Value;
    space: Space;
    time: Time;
    spaceDifference: number;
    timeDifference: number;
}

