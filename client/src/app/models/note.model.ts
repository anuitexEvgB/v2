import { Geo } from './geo.model';
import { Photo } from './photo.model';

export interface Note {
    id?: number;
    title: string;
    text: string;
    completed: boolean;
    latLng: Geo;
    userId: string;
    LiteId?: number;
    PhotoId?: any[];
}
