import { Database, sqlite3 } from 'sqlite3';
import {
  ABMULTIVALUE,
  ABPERSON,
  ATTACHMENT,
  FILES,
  HANDLE,
  MESSAGE,
  MESSAGE_ATTACHMENT_JOIN,
} from './constants/tableNames';

import { messageCreateQuery } from './queries';
import { Service } from './types/service';

interface idkyet {
  MESID: number;
  ATTID: number;
  filename: string;
  mime_type: string;
  transfer_name: string;
  total_bytes: number;
}

interface Handle {
  ROWID: number,
  id: string,
  country: string,
  service: Service,
  uncanonicalized_id: string,
  person_centric_id: string,
}

export class DBSetup {
  private chatDB: Database;
  private manifestDB: Database;
  private addressDB: Database;

  private backupDB: Database;

  constructor() {
    this.chatDB = new Database('./data/chat.db');
    this.manifestDB = new Database('./data/Manifest.db');
    this.addressDB = new Database('./data/AddressBook.db');
  }

  public async createNewDatabase() {
    this.backupDB = new Database('./data/Backup.db');
    console.log("created");
    this.createMessageTable();
  }


  public async getHandleContactCombo() {
    return new Promise<Handle[]>((resolve, reject) => {
      const handleQuery = `SELECT h.ROWID, h.id, h.country, h.service, h.uncanolized_id, h.person_centric_id
      FROM ${HANDLE} h`
      this.chatDB.all(handleQuery, (err: Error | null, rows: Handle[]) => {
        if (err) {
          reject('Error executing query: ' + err.message);
        } else if (!rows) {
          resolve(undefined);
        } else {
          resolve(rows);
        }
      })
    }).then((result) => {
      new Promise((resolve, reject) => {
    const contactQuery = `SELECT abp.First, abp.Last, abp.Middle, abp.Nickname, abmv.value
      FROM ${ABPERSON} abp
      JOIN ${ABMULTIVALUE} abmv ON abp.ROWID = abmv.record_id
      WHERE abmv.value IN (${result.map((handle) => `'${handle.id}'`).join(', ')})`;

      this.addressDB.all(contactQuery, (err: Error | null, rows: any[]) => {
        if (err) {
          reject('Error executing query: ' + err.message);
        } else if (!rows) {
          resolve(undefined);
        } else {
          



          resolve(rows);
        }
      });
    })
  })
}

  

  public async createMessageTable() {
      this.backupDB.run(messageCreateQuery)


  }

  public async processAttatchments() {
    try {
      const messages = this.processMessageAttatchments();
      const filenamePatterns = (await messages)
        .map((m) => `'${m.filename.split('/').slice(-2).join('/')}'`)
        .join(' OR ');

      const query = `
        SELECT fileID, relativePath
        FROM ${FILES}
        WHERE ${filenamePatterns
          .split(' OR ')
          .map((pattern) => `relativePath LIKE ${pattern}`)
          .join(' OR ')}
    `;

      this.manifestDB.get(query, (err: Error | null, row: any) => {
        if (err) {
          console.error('errored', err);
        } else {
          console.log(row);
        }
      });
    } catch (error) {}
  }

  public async processMessageAttatchments(): Promise<idkyet[]> {
    console.log('processing');
    return new Promise<idkyet[]>((resolve, reject) => {
      const query = `SELECT m.ROWID AS MESID, a.ROWID AS ATTID, a.filename, a.mime_type, a.transfer_name, a.total_bytes
    FROM ${MESSAGE} AS m 
    JOIN ${MESSAGE_ATTACHMENT_JOIN} ma ON m.ROWID = ma.message_id
    JOIN ${ATTACHMENT} a ON ma.attachment_id = a.ROWID
    WHERE m.cache_has_attachments = 1`;

      this.chatDB.all(query, (err: Error | null, rows: idkyet[]) => {
        if (err) {
          reject('Error executing query: ' + err.message);
        } else {
          let resultMap: any[] = [];
          //console.log(rows);
          resolve(rows);
        }
      });
    });
  }
}
