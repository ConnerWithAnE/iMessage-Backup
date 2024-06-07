import * as sqlite3 from 'sqlite3';

import {
  MESSAGE,
  CHAT_MESSAGE_JOIN,
  CHAT_HANDLE_JOIN,
  HANDLE,
  CHAT,
} from './constants/tableNames';
import { Message, createMessageInstance } from './interfaces/message.interface';
import { Handle, createHandleInstance } from './interfaces/handle.interface';
import { ChatPreview, createChatPreviewInstance } from './interfaces/chat_preview.interface';

import {
  ChatMessage,
  createChatMessageInstance,
} from './interfaces/chat_message';
import {
  ChatHandle,
  createChatHandleInstance,
} from './interfaces/chat_handle.interface';
import { rejects } from 'assert';

export class MessageHandler {
  private chatDB: sqlite3.Database;
  private manifestDB: sqlite3.Database;

  public chatMessageMap!: Map<number, ChatMessage>;

  constructor(cdb: sqlite3.Database, mdb: sqlite3.Database) {
    this.chatDB = cdb;
    this.manifestDB = mdb;
  }

  public async getChatPreviews(): Promise<ChatPreview[]> {
    console.log("Getting Chats")
    return new Promise<ChatPreview[]>((resolve, reject) => {
      const query =
          `SELECT c.ROWID AS CHATID, c.last_read_message_timestamp, c.service_name, c.display_name, GROUP_CONCAT(h.ROWID || ':' || h.id) AS handle_ids 
          FROM ${CHAT} c 
          JOIN ${CHAT_HANDLE_JOIN} chj ON c.ROWID = chj.chat_id 
          JOIN ${HANDLE} h ON chj.handle_id = h.ROWID 
          GROUP BY c.ROWID, c.last_read_message_timestamp, c.service_name, c.display_name`;
      this.chatDB.all(query, (err: Error | null, rows: any[]) => {
          if (err) {
              reject('Error executing query: ' + err.message);
          } else {
              const chatPreviews: ChatPreview[] = rows.map(row => ({
                  CHATID: row.CHATID,
                  last_read_message_timestamp: row.last_read_message_timestamp,
                  service_name: row.service_name,
                  display_name: row.display_name,
                  // Parse handle_ids string into a Record<number, string>
                  handle_ids: this.parseHandleIds(row.handle_ids)
              }));
              console.log(chatPreviews.length);
              resolve(chatPreviews);
          }
      });
  });
}

public async getChatPreview(chat_id: number): Promise<ChatPreview> {
  console.log("Getting Chat");
  return new Promise<ChatPreview>((resolve, reject) => {
      const query =
          `SELECT c.ROWID AS CHATID, c.last_read_message_timestamp, c.service_name, c.display_name, GROUP_CONCAT(h.ROWID || ':' || h.id) AS handle_ids 
          FROM ${CHAT} c 
          JOIN ${CHAT_HANDLE_JOIN} chj ON c.ROWID = chj.chat_id 
          JOIN ${HANDLE} h ON chj.handle_id = h.ROWID 
          WHERE c.ROWID = ${chat_id}
          GROUP BY c.ROWID, c.last_read_message_timestamp, c.service_name, c.display_name`;

      this.chatDB.get(query, (err: Error | null, row: any) => {
          if (err) {
              reject('Error executing query: ' + err.message);
          } else if (!row) {
              reject('No chat found with the given chat_id');
          } else {
              const chatPreview: ChatPreview = {
                  CHATID: row.CHATID,
                  last_read_message_timestamp: row.last_read_message_timestamp,
                  service_name: row.service_name,
                  display_name: row.display_name,
                  // Parse handle_ids string into a Record<number, string>
                  handle_ids: this.parseHandleIds(row.handle_ids)
              };
              resolve(chatPreview);
          }
      });
  });
}


private parseHandleIds(handleIdsString: string): Record<number, string> {
  const handleIdsArray: string[] = handleIdsString.split(',');
  const handleIdsRecord: Record<number, string> = {};
  for (const handleIdString of handleIdsArray) {
      const [rowId, id]: string[] = handleIdString.split(':');
      const handleId: number = parseInt(rowId);
      handleIdsRecord[handleId] = id;
  }
  return handleIdsRecord;
}

  public async getMessageIDsFromChatID(chat_id: number): Promise<number[]> {
    return new Promise((resolve, reject) => {
      const columns = Object.keys(createChatMessageInstance()).join(',');
      const query = `SELECT ${columns} FROM ${CHAT_MESSAGE_JOIN} WHERE chat_id = ${chat_id}`;

      this.chatDB.all(query, (err: Error | null, rows: ChatMessage[]) => {
        if (err) {
          reject('Error executing query: ' + err.message);
        } else {
          let resultMap: number[] = [];
          rows.forEach((row) => {
            resultMap.push(row.message_id);
          });
          resolve(resultMap);
        }
      });
    });
  }

  public async getHandleIDsFromChatID(chat_id: number): Promise<number[]> {
    return new Promise((resolve, reject) => {
      const columns = Object.keys(createChatHandleInstance()).join(',');
      const query = `SELECT ${columns} FROM ${CHAT_HANDLE_JOIN} WHERE chat_id = ${chat_id}`;

      this.chatDB.all(query, (err: Error | null, rows: ChatHandle[]) => {
        if (err) {
          reject('Error executing query: ' + err.message);
        } else {
          let resultMap: number[] = [];
          rows.forEach((row) => {
            resultMap.push(row.handle_id);
          });
          resolve(resultMap);
        }
      });
    });
  }

  public async getHandlesFromChatID(chat_id: number): Promise<Handle[]> {
    return new Promise((resolve, reject) => {});
  }

  public async getHandleFromID(handle_id: number): Promise<Handle> {
    return new Promise((resolve, reject) => {
      const columns = Object.keys(createHandleInstance()).join(',');
      const query = `SELECT ${columns} FROM ${HANDLE} WHERE handle_id = ${handle_id}`;

      this.chatDB.all(query, (err: Error | null, handle: Handle) => {
        if (err) {
          reject('Error executing query: ' + err.message);
        } else {
          resolve(handle);
        }
      });
    });
  }

  public async getFractionOfMessagesFromIDs(
    message_ids: number[],
    fraction: number,
  ): Promise<Message[]> {
    return new Promise((resolve, reject) => {
      console.log('Getting Messages');
      // Calculate the number of messages to retrieve (approximately 1/3 of total)
      const numMessagesToRetrieve = Math.ceil(message_ids.length / fraction);
      const columns = Object.keys(createMessageInstance()).join(',');

      // Take only the first portion of message IDs
      const rowIDList = message_ids.slice(0, numMessagesToRetrieve).join(',');
      const query = `SELECT ${columns} FROM ${MESSAGE} WHERE ROWID IN (${rowIDList})`;

      this.chatDB.all(query, (err: Error | null, rows: Message[]) => {
        if (err) {
          reject('Error executing query: ' + err.message);
        } else {
          console.log(rows.length);
          resolve(rows);
        }
      });
    });
  }

  public async getMessagesFromIDs(message_ids: number[]): Promise<Message[]> {
    return new Promise((resolve, reject) => {
      const columns = Object.keys(createMessageInstance()).join(',');
      const rowIDList = message_ids.join(',');
      const query = `SELECT ${columns} FROM ${MESSAGE} WHERE ROWID IN (${rowIDList})`;

      this.chatDB.all(query, (err: Error | null, rows: Message[]) => {
        if (err) {
          reject('Error executing query: ' + err.message);
        } else {
          let resultMap: Message[] = [];
          rows.forEach((row) => {
            resultMap.push(row);
          });
          console.log(resultMap.length);
          resolve(resultMap);
        }
      });
    });
  }

  public async getAllRowsAsMap(): Promise<Map<number, ChatMessage>> {
    return new Promise((resolve, reject) => {
      const columns = Object.keys(createChatMessageInstance()).join(',');
      const query = `SELECT ${columns} FROM ${CHAT_MESSAGE_JOIN}`;

      this.chatDB.all(query, (err: Error | null, rows: ChatMessage[]) => {
        if (err) {
          reject('Error executing query: ' + err.message);
        } else {
          const resultMap = new Map<number, ChatMessage>();
          rows.forEach((row) => {
            resultMap.set(row.message_id as number, row);
          });
          this.chatMessageMap = resultMap;
          resolve(resultMap);
        }
      });
    });
  }

  public getEntriesByRowId(rowId: number): ChatMessage[] {
    if (!this.chatMessageMap) {
      throw new Error(
        'messageMap has not been initialized. Call getAllRowsAsMap() first.',
      );
    }

    const entries: ChatMessage[] = [];
    this.chatMessageMap.forEach((value, key) => {
      if (key === rowId) {
        entries.push(value);
      }
    });
    return entries;
  }

  public getRowFromMap(chat_id: number): Promise<ChatMessage> {
    return new Promise(async (resolve, reject) => {
      if (!this.chatMessageMap) {
        await this.getAllRowsAsMap();
      }
      const row = this.chatMessageMap.get(chat_id);
      if (row) {
        resolve(row);
      } else {
        reject(
          `Error rowID ${chat_id} does not exists within the chatMessageMap`,
        );
      }
    });
  }
}
