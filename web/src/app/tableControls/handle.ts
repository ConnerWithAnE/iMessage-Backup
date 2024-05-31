import * as sqlite3 from 'sqlite3';

import { Handle, createHandleInstance } from '../interfaces/handle';
import { HANDLE } from '../constants/tableNames';

const dbPath: string = 'chat.db';

export class HandleTable {
  private db: sqlite3.Database;


  private handleMap!: Map<number, Handle>;

  constructor(db: sqlite3.Database) {
    this.db = db;
  }

  public async getAllRowsAsMap(): Promise<Map<number, Handle>> {
    return new Promise((resolve, reject) => {
      const columns = Object.keys(createHandleInstance()).join(',');
      const query = `SELECT ${columns} FROM ${HANDLE}`;

      this.db.all(query, (err: Error | null, rows: Handle[]) => {
        if (err) {
          reject('Error executing query: ' + err.message);
        } else {
          const resultMap = new Map<number, Handle>();
          rows.forEach((row) => {
            resultMap.set(row.ROWID as number, row);
          });
          this.handleMap = resultMap;
          resolve(resultMap);
        }
      });
    });
  }

  public getRowFromMap(rowID: number): Promise<Handle> {
    return new Promise(async (resolve, reject) => {
      if (!this.handleMap) {
        await this.getAllRowsAsMap();
      }
      const row = this.handleMap.get(rowID);
      if (row) {
        resolve(row);
      } else {
        reject(`Error rowID ${rowID} does not exists within the handleMap`);
      }
    });
  }
}
