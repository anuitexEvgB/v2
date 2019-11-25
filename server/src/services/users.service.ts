// Vendors
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SocialLoginModel, RegistrationModel } from '../models';
import { User } from '../entities';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private UserRepository: Repository<User>) { }

    public async findByEmail(email: string): Promise<User> {
        return await this.UserRepository.findOne({
            where: {
                email,
            },
        });
    }

    public async findById(id: string): Promise<User> {
        const res = await this.UserRepository.findOne(id);
        return res;
    }

    public async create(model: RegistrationModel): Promise<User> {
        return this.findByEmail(model.email).then(async res => {
            if (!res) {
                return await this.UserRepository.save(model);
            }
            return;
        });
    }

    public async customCreate(model: SocialLoginModel): Promise<User> {
        return this.findByEmail(model.email).then(async res => {
            if (!res) {
                return await this.UserRepository.save(model);
            }
            return res;
        });
    }
}
