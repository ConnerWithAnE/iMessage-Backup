import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { MessageHandler } from './message-handler';
import { InitializeDatabase } from './databaseController';

async function bootstrap() {

const temp = async () => {

  const db = new InitializeDatabase('../../data/chat.db');

  const handler = new MessageHandler(db.getDB());
  const messageIDS = handler.getMessageIDsFromChatIDs(37);
  console.log(messageIDS)


  //const chatTableInstance = new ChatTable(db.getDB());
  //const chatTable = await chatTableInstance.getAllRowsAsMap();

  //chatTable.forEach((value, key) => {
    
  //})

  //const chatMessageTable = new ChatMessageTable(db.getDB());
  //const messageIDs = await chatMessageTable.getMessageIDs(37);
  //console.log(await chatMessageTable.getMessagesFromIDs(messageIDs));


};

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
