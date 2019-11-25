import { ObjectID } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';

export class PhotoModel {
    @ApiModelProperty()
    id: ObjectID;

    @ApiModelProperty()
    noteId: string;

    @ApiModelProperty()
    photo: string;

    @ApiModelProperty()
    SqlPhoto: number;
}
