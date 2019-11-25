import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Note, Photo, User } from '../entities';

const enities = [
    Note,
    Photo,
    User,
];

@Global()
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mongodb',
            url: 'mongodb+srv://local:12345@cluster0-vrq7n.mongodb.net/notes',
            entities: [...enities],
            synchronize: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }),
        TypeOrmModule.forFeature([...enities]),
    ],
    exports: [
        TypeOrmModule.forRoot({
            type: 'mongodb',
            url: 'mongodb+srv://local:12345@cluster0-vrq7n.mongodb.net/notes',
            entities: [...enities],
            synchronize: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }),
        TypeOrmModule.forFeature([...enities]),
    ],
})
export class DatabaseModule {}
