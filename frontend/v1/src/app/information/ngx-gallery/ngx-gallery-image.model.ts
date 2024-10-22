import { SafeResourceUrl } from '@angular/platform-browser';

export interface INgxGalleryImage {
    type: 'image' | 'video' | 'audio';
    small?: string | SafeResourceUrl;
    medium?: string | SafeResourceUrl;
    big?: string | SafeResourceUrl;
    description?: string;
    url?: string;
    label?: string;
}

export class NgxGalleryImage implements INgxGalleryImage {
    type: 'image' | 'video' | 'audio';
    small?: string | SafeResourceUrl;
    medium?: string | SafeResourceUrl;
    big?: string | SafeResourceUrl;
    description?: string;
    url?: string;
    label?: string;

    constructor(obj: INgxGalleryImage) {
        this.type = obj.type || 'image';
        this.small = obj.small;
        this.medium = obj.medium;
        this.big = obj.big;
        this.description = obj.description;
        this.url = obj.url;
        this.label = obj.label;
    }
}
