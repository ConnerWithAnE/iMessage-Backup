import * as sqlite3 from 'sqlite3';

import { PersonID, createPersonIDInstance } from '../interfaces/personID';
import { HANDLE } from '../constants/tableNames';

const dbPath: string = 'chat.db';

export class HandleTable {
  private db: sqlite3.Database;


  private handleMap!: Map<number, PersonID>;

  constructor(db: sqlite3.Database) {
    this.db = db;
  }

  public async getAllRowsAsMap(): Promise<Map<number, PersonID>> {
    return new Promise((resolve, reject) => {
      const columns = Object.keys(createPersonIDInstance()).join(',');
      const query = `SELECT ${columns} FROM ${HANDLE}`;

      this.db.all(query, (err: Error | null, rows: PersonID[]) => {
        if (err) {
          reject('Error executing query: ' + err.message);
        } else {
          const resultMap = new Map<number, PersonID>();
          rows.forEach((row) => {
            resultMap.set(row.ROWID as number, row);
          });
          this.handleMap = resultMap;
          resolve(resultMap);
        }
      });
    });
  }

  public getRowFromMap(rowID: number): Promise<PersonID> {
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
