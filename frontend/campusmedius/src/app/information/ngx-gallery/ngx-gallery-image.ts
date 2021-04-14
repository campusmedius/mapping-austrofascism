import { SafeResourceUrl } from '@angular/platform-browser';

export interface INgxGalleryImage {
    cmtype: 'image' | 'video' | 'audio';
    small?: string | SafeResourceUrl;
    medium?: string | SafeResourceUrl;
    big?: string | SafeResourceUrl;
    description?: string;
    url?: string;
    type?: string;
    label?: string;
}

export class NgxGalleryImage implements INgxGalleryImage {
    cmtype: 'image' | 'video' | 'audio';
    small?: string | SafeResourceUrl;
    medium?: string | SafeResourceUrl;
    big?: string | SafeResourceUrl;
    description?: string;
    url?: string;
    type?: string;
    label?: string;

    constructor(obj: INgxGalleryImage) {
        this.cmtype = obj.cmtype || 'image';
        this.small = obj.small;
        this.medium = obj.medium;
        this.big = obj.big;
        this.description = obj.description;
        this.url = obj.url;
        this.cmtype = obj.cmtype;
        this.label = obj.label;
    }
}
