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
    //entities: MediaEntity[];
    images: string[];
}

export interface InformationMedia {
    images: { [id: string]: Image };
    audios: { [id: string]: Audio };
    videos: { [id: string]: Video };
    galleries: { [id: string]: Gallery };
}

export interface Information {
    id: string;
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
