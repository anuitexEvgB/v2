import { ObjectID } from 'typeorm';
import { Controller, Get, Param, Post, Body, Put, Delete, UseInterceptors, UploadedFiles, Res, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

import { PhotoService, NoteService } from '../services';
import { Note } from '../entities';
import { MulterOptions } from '../common/middleware/multer-config';

@Controller('note')
export class NoteController {

    constructor(
        private noteService: NoteService,
        private photoService: PhotoService,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getNotes(@Req() req) {
        const user = req.user;
        return await this.noteService.getNotes(user.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Body() body) {
        return await this.noteService.addNote(body.note, body.photo);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('getPhotos/:id')
    async getPhotos(@Param('id') id: number) {
        return await this.photoService.getPhotoToNote(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(@Param('id') id: ObjectID, @Body() note: Note) {
        return await this.noteService.updateNote(id, note);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.noteService.deleteNoteId(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('upload/:id')
    @UseInterceptors(AnyFilesInterceptor(MulterOptions))
    async uploadFile(@UploadedFiles() photo, @Param('id') id: {}, @Res() res) {
        const result = await this.photoService.addPhotoToNote(id, photo);
        res.status(HttpStatus.OK).json({ result });

    }

    @UseGuards(AuthGuard('jwt'))
    @Post('deletePhotos/:photoId')
    async deletePhoto(@Param('photoId') id: string, @Body() namePhoto: {namePhoto: string}) {
        return await this.photoService.deletePhoto(id, namePhoto);
    }
}
