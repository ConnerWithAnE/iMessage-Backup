import * as sqlite3 from 'sqlite3';

import { Chat, createChatInstance } from '../interfaces/chat';
import { CHAT } from '../constants/tableNames';

const dbPath: string = 'chat.db';

export class ChatTable {
  private db: sqlite3.Database;


  private chatMap!: Map<number, Chat>;

  constructor(db: sqlite3.Database) {
    this.db = db;
  }

  public async getAllRowsAsMap(): Promise<Map<number, Chat>> {
    return new Promise((resolve, reject) => {
        const columns = Object.keys(createChatInstance()).join(',');
      const query = `SELECT ${columns} FROM ${CHAT}`;

      this.db.all(query, (err: Error | null, rows: Chat[]) => {
        if (err) {
          reject('Error executing query: ' + err.message);
        } else {
          const resultMap = new Map<number, Chat>();
          rows.forEach((row) => {
            resultMap.set(row.ROWID as number, row);
          });
          this.chatMap = resultMap;
          resolve(resultMap);
        }
      });
    });
  }

  public getRowFromMap(rowID: number): Promise<Chat> {
    return new Promise(async (resolve, reject) => {
      if (!this.chatMap) {
        await this.getAllRowsAsMap();
      }
      const row = this.chatMap.get(rowID);
      if (row) {
        resolve(row);
      } else {
        reject(`Error row_id ${rowID} does not exists within the chatMap`);
      }
    });
  }
}
