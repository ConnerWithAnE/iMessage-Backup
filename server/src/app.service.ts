import { Injectable } from '@nestjs/common';
import * as sqlite3 from 'sqlite3';
import { MessageHandler } from './message-handler';
import { DBSetup } from './initialDBSetup';

@Injectable()
export class AppService {
  private chat_db: sqlite3.Database;
  private manifest_db: sqlite3.Database;
  private address_db: sqlite3.Database;
  private messageHandler: MessageHandler;

  constructor() {
    this.chat_db = new sqlite3.Database('./data/chat.db');
    this.manifest_db = new sqlite3.Database('./data/Manifest.db');
    this.address_db = new sqlite3.Database('./data/AddressBook.db');
    this.messageHandler = new MessageHandler(
      this.chat_db,
      this.manifest_db,
      this.address_db,
    );

    

  }

  async getMessagesByChatId(chatId: number) {
    //const db = new DBSetup();
    //db.createNewDatabase();

    const messageIds =
      await this.messageHandler.getMessageIDsFromChatID(chatId);
    return this.messageHandler.getFractionOfMessagesFromIDs(messageIds, 1);
  }

  async getChatPreviewsWithHandles() {
    return this.messageHandler.getChatPreviewsWithHandles();
  }

  async getChatPreviewWithHandles(chatId: number) {
    return this.messageHandler.getChatPreviewWithHandles(chatId);
  }

  async getHandleContact(h_id: string) {
    return this.messageHandler.getContactFromNumber(h_id);
  }

  async getHandleContacts(h_id: string) {
    return this.messageHandler.getContactsFromNumbers(h_id);
  }
}
