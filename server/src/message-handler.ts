import * as sqlite3 from 'sqlite3';

import {
  MESSAGE,
  CHAT_MESSAGE_JOIN,
  CHAT_HANDLE_JOIN,
  HANDLE,
} from './constants/tableNames';
import { Message, createMessageInstance } from './interfaces/message.interface';
import { Handle, createHandleInstance } from './interfaces/handle.interface';

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
  private db: sqlite3.Database;

  public chatMessageMap!: Map<number, ChatMessage>;

  constructor(db: sqlite3.Database) {
    this.db = db;
  }

  public async getMessageIDsFromChatID(chat_id: number): Promise<number[]> {
    return new Promise((resolve, reject) => {
      const columns = Object.keys(createChatMessageInstance()).join(',');
      const query = `SELECT ${columns} FROM ${CHAT_MESSAGE_JOIN} WHERE chat_id = ${chat_id}`;

      this.db.all(query, (err: Error | null, rows: ChatMessage[]) => {
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

      this.db.all(query, (err: Error | null, rows: ChatHandle[]) => {
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

      this.db.all(query, (err: Error | null, handle: Handle) => {
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

      this.db.all(query, (err: Error | null, rows: Message[]) => {
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

      this.db.all(query, (err: Error | null, rows: Message[]) => {
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

      this.db.all(query, (err: Error | null, rows: ChatMessage[]) => {
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
