import * as sqlite3 from 'sqlite3';

import { CHAT_MESSAGE_JOIN } from '../constants/tableNames';
import { ChatMessage, createChatMessageInstance } from '../interfaces/chat_message';

const dbPath: string = 'chat.db';

export class ChatMessageTable {
  private db: sqlite3.Database;


  private chatMessageMap!: Map<number, ChatMessage>;

  constructor(db: sqlite3.Database) {
    this.db = db;
  }

  public async getAllRowsAsMap(): Promise<Map<number, ChatMessage>> {
    return new Promise((resolve, reject) => {
      const columns = Object.keys(createChatMessageInstance()).join(',');
      const query = `SELECT ${columns} FROM ${CHAT_MESSAGE_JOIN}`;

      this.db.all(query, (err: Error | null, rows: ChatMessage[]) => {
        if (err) {
          reject('Error executing query: ' + err.message);
        } else {
          const resultMap = new Map<number, ChatMessage>();
          rows.forEach((row) => {
            resultMap.set(row.chat_id as number, row);
          });
          this.chatMessageMap = resultMap;
          resolve(resultMap);
        }
      });
    });
  }

  public getRowFromMap(chat_id: number): Promise<ChatMessage> {
    return new Promise(async (resolve, reject) => {
      if (!this.chatMessageMap) {
        await this.getAllRowsAsMap();
      }
      const row = this.chatMessageMap.get(chat_id);
      if (row) {
        resolve(row);
      } else {
        reject(`Error rowID ${chat_id} does not exists within the chatMessageMap`);
      }
    });
  }
}
