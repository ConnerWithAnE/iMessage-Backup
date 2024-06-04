import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { MessageHandler } from './message-handler';
import { InitializeDatabase } from './databaseController';

async function bootstrap() {

const temp = async () => {

  const db = new InitializeDatabase('../../data/chat.db');

};

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
