import * as sqlite3 from 'sqlite3';

import { ATTACHMENT } from '../constants/tableNames';
import { Attachment, createAttachmentInstance } from '../interfaces/attachment';

const dbPath: string = 'chat.db';

export class AttachmentTable {
  private db: sqlite3.Database;


  private attachmentMap!: Map<number, Attachment>;

  constructor(db: sqlite3.Database) {
    this.db = db;
  }

  public async getAllRowsAsMap(): Promise<Map<number, Attachment>> {
    return new Promise((resolve, reject) => {
      const columns = Object.keys(createAttachmentInstance()).join(',');
      const query = `SELECT ${columns} FROM ${ATTACHMENT}`;

      this.db.all(query, (err: Error | null, rows: Attachment[]) => {
        if (err) {
          reject('Error executing query: ' + err.message);
        } else {
          const resultMap = new Map<number, Attachment>();
          rows.forEach((row) => {
            resultMap.set(row.ROWID as number, row);
          });
          this.attachmentMap = resultMap;
          resolve(resultMap);
        }
      });
    });
  }

  public getRowFromMap(rowID: number): Promise<Attachment> {
    return new Promise(async (resolve, reject) => {
      if (!this.attachmentMap) {
        await this.getAllRowsAsMap();
      }
      const row = this.attachmentMap.get(rowID);
      if (row) {
        resolve(row);
      } else {
        reject(`Error rowID ${rowID} does not exists within the attachmentMap`);
      }
    });
  }
}
