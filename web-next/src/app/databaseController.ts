import * as sqlite3 from 'sqlite3';

export class InitializeDatabase {

    private db: sqlite3.Database;
    private dbPath: string;

    constructor(dbPath: string) {
        this.dbPath = dbPath;
        this.db = new sqlite3.Database(this.dbPath, sqlite3.OPEN_READONLY, (err: Error | null) => {
            if (err) {
              console.error('Error opening database:', err.message);
            } else {
              console.log(`Connected to the database: ${this.dbPath}`);
            }
          });
    }

    getDB(): sqlite3.Database {
        return this.db;
    }

}