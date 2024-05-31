import { Injectable } from '@nestjs/common';
import * as sqlite3 from 'sqlite3';
import { MessageHandler } from './message-handler';

@Injectable()
export class AppService {
  private db: sqlite3.Database;
  private messageHandler: MessageHandler;

  constructor() {
    this.db = new sqlite3.Database('./data/chat.db');
    this.messageHandler = new MessageHandler(this.db);
  }

  async getMessagesByChatId(chatId: number) {
    const messageIds = await this.messageHandler.getMessageIDs(chatId);
    return this.messageHandler.getMessagesFromIDs(messageIds);
  }
}
