export interface Sql {
    id?: number;
    title: string;
    text: string;
    completed: boolean;
    latLng: object | string;
    userId: string;
    LiteId?: number;
    PhotoId?: any[];
}
