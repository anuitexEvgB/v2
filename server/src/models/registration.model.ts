import { ApiModelProperty } from '@nestjs/swagger';

export class RegistrationModel {
    @ApiModelProperty()
    name: string;

    @ApiModelProperty()
    email: string;

    @ApiModelProperty()
    password: string;
}
