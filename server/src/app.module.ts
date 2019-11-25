// Vendors
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

// Component
import { UsersModule } from './modules/users.module';

// Controller
import { NoteController } from './controllers/note.controller';

// Service
import { NoteService, PhotoService } from './services';

@Module({
  imports: [
    MulterModule.register({
      dest: 'uploads/',
    }),
    UsersModule,
  ],
  controllers: [ NoteController ],
  providers: [ NoteService, PhotoService ],
})
export class AppModule {}
