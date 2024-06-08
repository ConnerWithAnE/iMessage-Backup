import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { MessageHandler } from './message-handler';
import { InitializeDatabase } from './databaseController';
import { DBSetup } from './initialDBSetup';

async function bootstrap() {

const temp = async () => {

  const db = new InitializeDatabase('../data/chat.db', '../data/Manifest.db');

 

};


  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

