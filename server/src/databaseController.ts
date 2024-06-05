import * as sqlite3 from 'sqlite3';

export class InitializeDatabase {

    private chatDB: sqlite3.Database;
    private manifestDB: sqlite3.Database;

    constructor(chatDBPath: string, manifestDBPath: string) {
        
        this.chatDB = new sqlite3.Database(chatDBPath, sqlite3.OPEN_READONLY, (err: Error | null) => {
            if (err) {
              console.error('Error opening Chat database:', err.message);
            } else {
              console.log(`Connected to the database: ${chatDBPath}`);
            }
          });
          
          this.manifestDB = new sqlite3.Database(manifestDBPath, sqlite3.OPEN_READONLY, (err: Error | null) => {
            if (err) {
              console.error('Error opening Manifest database:', err.message);
            } else {
              console.log(`Connected to the database: ${manifestDBPath}`);
            }
          });
    }

    getChatDB(): sqlite3.Database {
        return this.chatDB;
    }

    getManifestDB(): sqlite3.Database {
      return this.manifestDB;
    }

}