import * as sqlite3 from 'sqlite3';

import { MESSAGE_ATTACHMENT_JOIN } from '../constants/tableNames';
import { MessageAttachment, createMessageAttachmentInstance } from '../interfaces/message_attachment';

const dbPath: string = 'chat.db';

export class MessageAttachmentTable {
  private db: sqlite3.Database;


  private messageAttachmentMap!: Map<number, MessageAttachment>;

  constructor(db: sqlite3.Database) {
    this.db = db;
  }

  public async getAllRowsAsMap(): Promise<Map<number, MessageAttachment>> {
    return new Promise((resolve, reject) => {
      const columns = Object.keys(createMessageAttachmentInstance()).join(',');
      const query = `SELECT ${columns} FROM ${MESSAGE_ATTACHMENT_JOIN}`;

      this.db.all(query, (err: Error | null, rows: MessageAttachment[]) => {
        if (err) {
          reject('Error executing query: ' + err.message);
        } else {
          const resultMap = new Map<number, MessageAttachment>();
          rows.forEach((row) => {
            resultMap.set(row.message_id as number, row);
          });
          this.messageAttachmentMap = resultMap;
          resolve(resultMap);
        }
      });
    });
  }

  public getRowFromMap(message_id: number): Promise<MessageAttachment> {
    return new Promise(async (resolve, reject) => {
      if (!this.messageAttachmentMap) {
        await this.getAllRowsAsMap();
      }
      const row = this.messageAttachmentMap.get(message_id);
      if (row) {
        resolve(row);
      } else {
        reject(`Error rowID ${message_id} does not exists within the messageAttachmentMap`);
      }
    });
  }
}
