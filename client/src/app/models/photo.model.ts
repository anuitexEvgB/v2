export interface Photo {
    id?: string;
    noteId: number | string;
    photo: string;
    SqlPhoto: number;
}

export interface PhotoNote {
    id?: string;
    photo: string;
    namePhoto: string;
    SqlPhoto: number;
}

export interface PhotoResponse {
    result: {
        id: string;
        noteId: string;
        photo: string;
        SqlPhoto: number;
    };
}
