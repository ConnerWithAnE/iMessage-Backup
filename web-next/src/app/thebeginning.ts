import * as sqlite3 from 'sqlite3';
import { HandleTable } from './tableControls/handle';
import { ChatTable } from './tableControls/chat';
import { MessageTable, ChatMessageTable } from './tableControls/tables';
import { InitializeDatabase } from './databaseController';

const temp = async () => {

  const db = new InitializeDatabase('../../data/chat.db');

  const chatTableInstance = new ChatTable(db.getDB());
  const chatTable = await chatTableInstance.getAllRowsAsMap();

  chatTable.forEach((value, key) => {
    
  })

  

  const chatMessageTable = new ChatMessageTable(db.getDB());
  const messageIDs = await chatMessageTable.getMessageIDs(37);
  console.log(await chatMessageTable.getMessagesFromIDs(messageIDs));


};

temp();
/*
// Open the SQLite database
let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err: Error | null) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the database:', dbPath);
    
    // Execute a SQL query to select all data from a table (replace 'your_table_name' with the actual table name)
    const query = 'SELECT text FROM message';
    
    db.all(query, (err: Error | null, rows: any[]) => {
      if (err) {
        console.error('Error executing query:', err.message);
      } else {
        console.log('Data from the database:');
        // Print out each row of data
        rows.forEach(row => {
          console.log(row);
        });
      }
      
      // Close the database connection when done
      db.close((err: Error | null) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Disconnected from the database:', dbPath);
        }
      });
    });
  }
});
*/
