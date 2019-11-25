import { ApiModelProperty } from '@nestjs/swagger';

export class LoginModel {
    @ApiModelProperty()
    email: string;

    @ApiModelProperty()
    name: string;

    @ApiModelProperty()
    password: string;
}