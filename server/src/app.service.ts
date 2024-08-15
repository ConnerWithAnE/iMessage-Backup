import { Injectable } from '@nestjs/common';
import * as sqlite3 from 'sqlite3';
import { MessageHandler } from './message-handler';
import { DBSetup } from './initialDBSetup';
import { test1 } from './streamtypedparser';

@Injectable()
export class AppService {
  private chat_db: sqlite3.Database;
  private manifest_db: sqlite3.Database;
  private address_db: sqlite3.Database;
  private messageHandler: MessageHandler;
  private dbSetup: DBSetup;

  constructor() {
    this.chat_db = new sqlite3.Database('./data/Backup.db');
    this.manifest_db = new sqlite3.Database('./data/Manifest.db');
    this.address_db = new sqlite3.Database('./data/AddressBook.db');
    this.messageHandler = new MessageHandler(
      this.chat_db,
      this.manifest_db,
      this.address_db,
    );
    this.dbSetup = new DBSetup();

    

  }

  async getMessagesByChatId(chatId: number) {
    const messageIds =
      await this.messageHandler.getMessageIDsFromChatID(chatId);
    return this.messageHandler.getFractionOfMessagesFromIDs(messageIds, 1);
  }

  async getChatPreviewsWithHandles() {
    return this.messageHandler.getChatPreviewsWithHandles();
  }

  async testStreamTypedParser() {
    return test1();
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

  async getAttachmentTest() {
    await this.dbSetup.createNewDatabase();
    return this.dbSetup.process();
  }
}
