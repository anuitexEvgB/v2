import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class Photo {
    @ObjectIdColumn()
    id: string;

    @Column()
    noteId: string;

    @Column()
    photo: string;

    @Column()
    SqlPhoto: number;
}
