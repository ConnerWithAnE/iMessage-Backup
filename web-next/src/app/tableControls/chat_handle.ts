import * as sqlite3 from 'sqlite3';

import { CHAT_HANDLE_JOIN } from '../constants/tableNames';
import { ChatHandle, createChatHandleInstance } from '../interfaces/chat_handle';

const dbPath: string = 'chat.db';

export class ChatHandleTable {
  private db: sqlite3.Database;


  private chatHandleMap!: Map<number, ChatHandle>;

  constructor(db: sqlite3.Database) {
    this.db = db;
  }

  public async getAllRowsAsMap(): Promise<Map<number, ChatHandle>> {
    return new Promise((resolve, reject) => {
      const columns = Object.keys(createChatHandleInstance()).join(',');
      const query = `SELECT ${columns} FROM ${CHAT_HANDLE_JOIN}`;

      this.db.all(query, (err: Error | null, rows: ChatHandle[]) => {
        if (err) {
          reject('Error executing query: ' + err.message);
        } else {
          const resultMap = new Map<number, ChatHandle>();
          rows.forEach((row) => {
            resultMap.set(row.chat_id as number, row);
          });
          this.chatHandleMap = resultMap;
          resolve(resultMap);
        }
      });
    });
  }

  public getRowFromMap(chat_id: number): Promise<ChatHandle> {
    return new Promise(async (resolve, reject) => {
      if (!this.chatHandleMap) {
        await this.getAllRowsAsMap();
      }
      const row = this.chatHandleMap.get(chat_id);
      if (row) {
        resolve(row);
      } else {
        reject(`Error rowID ${chat_id} does not exists within the chatHandleMap`);
      }
    });
  }
}
