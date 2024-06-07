import { Injectable } from '@nestjs/common';
import * as sqlite3 from 'sqlite3';
import { MessageHandler } from './message-handler';

@Injectable()
export class AppService {
  private chat_db: sqlite3.Database;
  private manifest_db: sqlite3.Database;
  private messageHandler: MessageHandler;

  constructor() {
    this.chat_db = new sqlite3.Database('./data/chat.db');
    this.manifest_db = new sqlite3.Database('./data/Manifest.db');
    this.messageHandler = new MessageHandler(this.chat_db, this.manifest_db);
  }

  async getMessagesByChatId(chatId: number) {
    const messageIds = await this.messageHandler.getMessageIDsFromChatID(chatId);
    return this.messageHandler.getFractionOfMessagesFromIDs(messageIds, 1);
    
  }

  async getChatPreviews() {
    return this.messageHandler.getChatPreviews();
  }

  async getChatPreview(chat_id: number) {
    return this.messageHandler.getChatPreview(chat_id);
  }
}
