import { Database, sqlite3 } from "sqlite3";
import { ATTACHMENT, FILES, MESSAGE, MESSAGE_ATTACHMENT_JOIN } from "./constants/tableNames";


interface idkyet {
  MESID: number,
  ATTID: number, 
  filename: string,
  mime_type: string 
  transfer_name: string,
  total_bytes: number,
}

export class DBSetup {

  private chatDB;
  private manifestDB;

  constructor() {
    this.chatDB = new Database('./data/chat.db');
    this.manifestDB = new Database('./data/Manifest.db');
  }

  public async processAttatchments() {
    try {
      const messages = this.processMessageAttatchments();
      const filenamePatterns = (await messages).map((m) => `'${m.filename.split('/').slice(-2).join('/')}'`).join(' OR ');

    const query = `
        SELECT fileID, relativePath
        FROM ${FILES}
        WHERE ${filenamePatterns.split(' OR ').map(pattern => `relativePath LIKE ${pattern}`).join(' OR ')}
    `;

      this.manifestDB.get(query, (err: Error | null, row: any) => {
        if (err) {
          console.error("errored", err)
        } else {
          console.log(row);
        }
      })

    } catch (error) {

    }


  }


  public async processMessageAttatchments(): Promise<idkyet[]> {
    console.log("processing")
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
