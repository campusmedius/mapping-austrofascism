export type MediaEntity = Image | Audio | Video;

export interface ImageData {
    thumbnail: string;
    full: string;
    mobileThumbnail: string;
    mobileFull: string;
}

export interface Image {
    id: string;
    type: 'image';
    data: ImageData;
    format: string;
    captionDe: string;
    captionEn: string;
}

export interface AudioData {
    thumbnail: string;
    full: string;
    mobileThumbnail: string;
    mobileFull: string;
}

export interface Audio {
    id: string;
    type: 'audio';
    data: AudioData;
    captionDe: string;
    captionEn: string;
}

export interface VideoData {
    thumbnail: string;
    full: string;
    mobileThumbnail: string;
    mobileFull: string;
}

export interface Video {
    id: string;
    type: 'video';
    data: VideoData;
    captionDe: string;
    captionEn: string;
}

export interface Gallery {
    id: string;
    type: 'gallery';
    entities: MediaEntity[];
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
