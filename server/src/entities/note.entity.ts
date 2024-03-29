import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity()
export class Note {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    title: string;

    @Column()
    text: string;

    @Column()
    completed: boolean;

    @Column()
    latLng: {
        lat: number,
        lng: number,
    };

    @Column()
    userId: string;

    @Column()
    LiteId: number;

    @Column()
    PhotoId: [];
}
