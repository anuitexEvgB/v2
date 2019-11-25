import { ObjectID } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';

export class NoteModel {
    @ApiModelProperty()
    id: ObjectID;

    @ApiModelProperty()
    title: string;

    @ApiModelProperty()
    text: string;

    @ApiModelProperty()
    completed: boolean;

    @ApiModelProperty()
    latLng: {
        lat: number,
        lng: number,
    };

    @ApiModelProperty()
    userId: string;

    @ApiModelProperty()
    LiteId: number;

    @ApiModelProperty()
    PhotoId: [];
}
