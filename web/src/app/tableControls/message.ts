import * as sqlite3 from 'sqlite3';

import { MESSAGE } from '../constants/tableNames';
import { Message, createMessageInstance } from '../interfaces/message';

const dbPath: string = 'chat.db';

export class MessageTable {
  private db: sqlite3.Database;


  private messageMap!: Map<number, Message>;

  constructor(db: sqlite3.Database) {
    this.db = db;
  }

  public async getAllRowsAsMap(): Promise<Map<number, Message>> {
    return new Promise((resolve, reject) => {
      const columns = Object.keys(createMessageInstance()).join(',');
      const query = `SELECT ${columns} FROM ${MESSAGE}`;

      this.db.all(query, (err: Error | null, rows: Message[]) => {
        if (err) {
          reject('Error executing query: ' + err.message);
        } else {
          const resultMap = new Map<number, Message>();
          rows.forEach((row) => {
            resultMap.set(row.ROWID as number, row);
          });
          this.messageMap = resultMap;
          resolve(resultMap);
        }
      });
    });
  }

  public getRowFromMap(rowID: number): Promise<Message> {
    return new Promise(async (resolve, reject) => {
      if (!this.messageMap) {
        await this.getAllRowsAsMap();
      }
      const row = this.messageMap.get(rowID);
      if (row) {
        resolve(row);
      } else {
        reject(`Error rowID ${rowID} does not exists within the handleMap`);
      }
    });
  }
}
