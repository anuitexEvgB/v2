import { NestFactory } from '@nestjs/core';
import bodyParser = require('body-parser');
import * as express from 'express';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  app.enableCors();
  app.use('/uploads', express.static('uploads'));
  await app.listen(3010);
}
bootstrap();
