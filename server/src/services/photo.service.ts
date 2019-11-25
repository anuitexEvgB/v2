import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectID } from 'typeorm';

import { Photo } from '../entities';

@Injectable()
export class PhotoService {
    constructor(
        @InjectRepository(Photo) private photoRepository: Repository<Photo>,
        ) {}

    public async addPhotoToNote(id: any, photo: Photo) {
        const photoToSave = {
            noteId: id,
            photo: photo[0].filename,
            SqlPhoto: id.inserOnl,
        } as any;
        const res = await this.photoRepository.save(photoToSave);
        return res;
    }

    public async getPhotoToNote(id: number): Promise<Photo[]> {

        const res = await this.photoRepository.find({
            where: {
                noteId: id,
            },
        });
        return res;
    }

    public async deletePhoto(id: string, namePhoto: {namePhoto: string}) {
        const name = namePhoto.namePhoto;
        const fs = require('fs');
        const file = 'uploads/';
        fs.unlink(file + name, (err) => {
            // tslint:disable-next-line: no-console
            console.error(err, ' Eror unlinka');
        });
        return await this.photoRepository.delete(id);
    }
}
