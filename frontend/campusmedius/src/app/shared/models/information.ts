export type MediaEntity = Image | Audio | Video;


export interface Image {
    id: string;
    type: 'image';
    url: string;
    format: string;
    captionDe: string;
    captionEn: string;
}

export interface Audio {
    id: string;
    type: 'audio';
    url: string;
    format: string;
    captionDe: string;
    captionEn: string;
}

export interface Video {
    id: string;
    type: 'video';
    url: string;
    format: string;
    captionDe: string;
    captionEn: string;
}

export interface Gallery {
    id: string;
    type: 'gallery';
    titleDe: string;
    titleEn: string;
    entities: MediaEntity[];
}

export interface InformationMedia {
    images: Image[];
    audios: Audio[];
    videos: Video[];
    galleries: Gallery[];
}

export interface Information {
    id: string;
    type: 'quote';
    titleDe: string;
    titleEn: string;
    contentDe: string;
    contentEn: string;
    media: InformationMedia;
}

export interface Block {
    type: string;
    data: any;
}
