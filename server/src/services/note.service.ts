import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectID } from 'typeorm';

import { NoteModel } from '../models';
import { Note, Photo } from '../entities';

@Injectable()
export class NoteService {
    ObjectId = require('mongodb').ObjectID;

    constructor(
        @InjectRepository(Note) private noteRepository: Repository<Note>,
        @InjectRepository(Photo) private photoRepository: Repository<Photo>,
    ) { }

    public async getNotes(id: ObjectID): Promise<Note[]> {
        const note = await this.noteRepository.find({
            where: {
                userId: String(id),
            },
       });
        return note;
    }

    public async addNote(model: NoteModel, photo: Photo[]): Promise<Note> {
        const savedNote = await this.noteRepository.save(model);
        photo.forEach(x => {
            x.noteId = String(savedNote.id);
            x.id = this.ObjectId(x.id);
        });
        this.photoRepository.save(photo);
        return savedNote;
    }

    public async updateNote(id: ObjectID, note: Note) {
        return await this.noteRepository.update(id, note);
    }

    public async deleteNoteId(id: string) {
        const res = await this.noteRepository.delete(id);
        if (res) {
            const photos = await this.photoRepository.find({
                noteId: id,
            });
            photos.forEach(a => {
                const name = a.photo;
                const fs = require('fs');
                const file = 'uploads/';
                fs.unlink(file + name, (err) => {
                    // tslint:disable-next-line: no-console
                    console.error(err, ' Eror unlinka');
                });
            });
            await this.photoRepository.remove(photos);
        }
        return res;
    }
}
