import { ObjectID } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';

export class SocialLoginModel {
    @ApiModelProperty()
    id: ObjectID;

    @ApiModelProperty()
    email: string;

    @ApiModelProperty()
    name: string;
}