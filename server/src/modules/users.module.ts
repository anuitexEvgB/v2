// Vendors
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Component
import { UsersController } from '../controllers/users.controller';
import { JwtStrategy } from '../common/jwt.strategy';
import { DatabaseModule } from './database.module';

// entities
import { User } from '../entities';

// Service
import { UsersService, AuthService } from '../services';

@Module({
    imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([User]),
        PassportModule.register({
            defaultStrategy: 'jwt',
          }),
          JwtModule.register({
            secret: 'aye228',
          }),
    ],
    controllers: [UsersController],
    providers: [UsersService, AuthService, JwtStrategy],
})
export class UsersModule {}
