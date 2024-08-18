import * as sqlite3 from 'sqlite3';
import * as fs from 'fs';
import heic2any from 'heic2any';
import bPlistParser from 'bplist-parser';

import {
  MESSAGE,
  CHAT_MESSAGE_JOIN,
  CHAT_HANDLE_JOIN,
  HANDLE,
  CHAT,
  ABMULTIVALUE,
  ABPERSON,
  ATTACHMENT,
  MESSAGE_ATTACHMENT_JOIN,
} from './constants/tableNames';
import {
  Message,
  MessageSend,
  createMessageInstance,
} from './interfaces/message.interface';
import { Handle, createHandleInstance } from './interfaces/handle.interface';
import {
  ChatPreview,
  EarlyChatPreview,
  createChatPreviewInstance,
} from './interfaces/chat_preview.interface';

import {
  ChatMessage,
  createChatMessageInstance,
} from './interfaces/chat_message';
import {
  ChatHandle,
  createChatHandleInstance,
} from './interfaces/chat_handle.interface';
import { rejects } from 'assert';
import { ListHandle } from './interfaces/list_handle.interface';
import { format } from 'path';
import { parse } from "./streamtypedparser";

export class MessageHandler {
  private chatDB: sqlite3.Database;
  private manifestDB: sqlite3.Database;
  private addressDB: sqlite3.Database;

  public chatMessageMap!: Map<number, ChatMessage>;

  constructor(
    cdb: sqlite3.Database,
    mdb: sqlite3.Database,
    adb: sqlite3.Database,
  ) {
    this.chatDB = cdb;
    this.manifestDB = mdb;
    this.addressDB = adb;
  }

  public async getContactFromNumber(h_id: string): Promise<ListHandle> {
    return new Promise<ListHandle>((resolve, reject) => {
      const query = `SELECT abp.First, abp.Last, abp.Middle, abp.Nickname, abmv.value
      FROM ${ABPERSON} abp
      JOIN ${ABMULTIVALUE} abmv ON abp.ROWID = abmv.record_id
      WHERE abmv.value = ${h_id}`;
      this.addressDB.get(query, (err: Error | null, row: any) => {
        if (err) {
          reject('Error executing query: ' + err.message);
        } else if (!row) {
          resolve(undefined);
        } else {
          const listHandle: ListHandle = {
            id: row.value,
            First: row.First,
            Last: row.Last,
            Middle: row.Middle,
            Nickname: row.Nickname,
          };
          resolve(listHandle);
        }
      });
    });
  }

  public async getContactsFromNumbers(
    h_id: string,
  ): Promise<Record<string, ListHandle>> {
    return new Promise<Record<string, ListHandle>>((resolve, reject) => {
      const query = `SELECT abp.First, abp.Last, abp.Middle, abp.Nickname, abmv.value
      FROM ${ABPERSON} abp
      JOIN ${ABMULTIVALUE} abmv ON abp.ROWID = abmv.record_id
      WHERE abmv.value IN  ('${h_id}')`;
      this.addressDB.all(query, (err: Error | null, rows: any[]) => {
        if (err) {
          reject('Error executing query: ' + err.message);
        } else if (!rows) {
          resolve(undefined);
        } else {
          const listHandles: Record<string, ListHandle> = rows.reduce(
            (acc: Record<string, ListHandle>, row) => {
              acc[row.value] = {
                id: row.value,
                First: row.First,
                Last: row.Last,
                Middle: row.Middle,
                Nickname: row.Nickname,
              };
              return acc;
            },
            {},
          );
          resolve(listHandles);
        }
      });
    });
  }

  public async getChatPreviews(): Promise<EarlyChatPreview[]> {
    console.log('Getting Chats');
    return new Promise<EarlyChatPreview[]>((resolve, reject) => {
      const query = `SELECT c.ROWID AS CHATID, c.last_read_message_timestamp, c.service_name, c.display_name, GROUP_CONCAT(h.ROWID || ':' || h.id) AS handle_ids 
          FROM ${CHAT} c 
          JOIN ${CHAT_HANDLE_JOIN} chj ON c.ROWID = chj.chat_id 
          JOIN ${HANDLE} h ON chj.handle_id = h.ROWID 
          GROUP BY c.ROWID, c.last_read_message_timestamp, c.service_name, c.display_name`;
      this.chatDB.all(query, (err: Error | null, rows: any[]) => {
        if (err) {
          reject('Error executing query: ' + err.message);
        } else {
          const chatPreviews: EarlyChatPreview[] = rows.map((row) => ({
            CHATID: row.CHATID,
            last_read_message_timestamp: row.last_read_message_timestamp,
            service_name: row.service_name,
            display_name: row.display_name,
            // Parse handle_ids string into a Record<number, string>
            handle_ids: this.parseHandleIds(row.handle_ids),
          }));
          resolve(chatPreviews);
        }
      });
    });
  }

  public async getChatPreviewsWithHandles(): Promise<ChatPreview[]> {
    try {
      const chatPreviews = await this.getChatPreviews();
      const allHandleIDs = Array.from(
        new Set(
          chatPreviews.flatMap((preview) => Object.values(preview.handle_ids)),
        ),
      );
      const handlevalues = await this.getHandleValues(allHandleIDs);

      return chatPreviews.map((preview) => ({
        ...preview,
        handle_ids: Object.entries(preview.handle_ids).reduce(
          (acc: Record<number, ListHandle>, [handleID, handleValue]) => {
            const handleData = handlevalues[handleValue] || {
              id: handleValue,
              First: undefined,
              Last: undefined,
              Middle: undefined,
              Nickname: undefined,
            };
            acc[Number(handleID)] = handleData;
            return acc;
          },
          {},
        ),
      }));
    } catch (error) {
      console.error('Error fetching chat previews with handles', error);
      throw error;
    }
  }

  public async getChatPreviewWithHandles(
    chat_id: number,
  ): Promise<ChatPreview> {
    try {
      const chatPreview = await this.getChatPreview(chat_id);
      const allHandleIDs = Array.from(Object.values(chatPreview.handle_ids));
      const handlevalues = await this.getHandleValues(allHandleIDs);

      return {
        ...chatPreview,
        handle_ids: Object.entries(chatPreview.handle_ids).reduce(
          (acc: Record<number, ListHandle>, [handleID, handleValue]) => {
            const handleData = handlevalues[handleValue] || {
              id: handleValue,
              First: undefined,
              Last: undefined,
              Middle: undefined,
              Nickname: undefined,
            };
            acc[Number(handleID)] = handleData;
            return acc;
          },
          {},
        ),
      };
    } catch (error) {
      console.error('Error fetching chat previews with handles', error);
      throw error;
    }
  }

  public async getHandleValues(
    hid: string[],
  ): Promise<Record<number, ListHandle>> {
    return new Promise<Record<number, ListHandle>>((resolve, reject) => {
      const query = `SELECT abp.First, abp.Last, abp.Middle, abp.Nickname, abmv.value
      FROM ${ABPERSON} abp
      JOIN ${ABMULTIVALUE} abmv ON abp.ROWID = abmv.record_id
      WHERE abmv.value IN (${hid.map((id) => `'${id}'`).join(', ')})`;
      this.addressDB.all(query, (err: Error | null, rows: any[]) => {
        if (err) {
          reject('Error executing query: ' + err.message);
        } else if (!rows) {
          resolve(undefined);
        } else {
          const listHandles: Record<string, ListHandle> = rows.reduce(
            (acc: Record<string, ListHandle>, row) => {
              acc[row.value] = {
                id: row.value,
                First: row.First,
                Last: row.Last,
                Middle: row.Middle,
                Nickname: row.Nickname,
              };
              return acc;
            },
            {},
          );
          resolve(listHandles);
        }
      });
    });
  }

  public async getChatPreview(chat_id: number): Promise<EarlyChatPreview> {
    console.log('Getting Chat');
    return new Promise<EarlyChatPreview>((resolve, reject) => {
      const query = `SELECT c.ROWID AS CHATID, c.last_read_message_timestamp, c.service_name, c.display_name, GROUP_CONCAT(h.ROWID || ':' || h.id) AS handle_ids 
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
          const chatPreview: EarlyChatPreview = {
            CHATID: row.CHATID,
            last_read_message_timestamp: row.last_read_message_timestamp,
            service_name: row.service_name,
            display_name: row.display_name,
            // Parse handle_ids string into a Record<number, string>
            handle_ids: this.parseHandleIds(row.handle_ids),
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
      const query = `SELECT HEX(attributedBody) as hexAB, ${columns} FROM ${MESSAGE} WHERE ROWID IN (${rowIDList})`;

      this.chatDB.all(
        query,
        async (err: Error | null, messageRows: Message[]) => {
          if (err) {
            reject('Error executing query: ' + err.message);
          } else {
            const messageSendList: MessageSend[] = [];

            

            try {
              await Promise.all(
                messageRows.map(async (row: any) => {
                  let messageSend: MessageSend = {
                    ...row,
                    attachment: undefined,
                  };
                  let base64Data: string;

                  if (row.cache_has_attachments) {
                    const cacheQuery = `
                  SELECT a.ROWID, a.filename, a.mime_type, a.uti, a.transfer_name, a.total_bytes, a.is_sticker, a.hide_attachment
                  FROM ${ATTACHMENT} a
                  JOIN ${MESSAGE_ATTACHMENT_JOIN} ma ON a.ROWID = ma.attachment_id
                  WHERE ma.message_id = ?
                `;

                    const attachmentRow = await new Promise<any>(
                      (resolve, reject) => {
                        this.chatDB.get(
                          cacheQuery,
                          row.ROWID,
                          (err: Error | null, attachmentRow: any) => {
                            if (err) {
                              reject(
                                `Error getting attachment for message ${row.ROWID}: ${err}`,
                              );
                            } else {
                              resolve(attachmentRow);
                            }
                          },
                        );
                      },
                    );

                    if (
                      attachmentRow &&
                      attachmentRow.mime_type &&
                      attachmentRow.mime_type.startsWith('image')
                    ) {
                      if (fs.existsSync(attachmentRow.filename)) {
                        let fileData = fs.readFileSync(
                          attachmentRow.filename,
                        );
                        /*
                        if (attachmentRow.mime_type == 'image/heic') {
                          const blobData = await heic2any({
                            blob: new Blob([fileData]),
                            toType: 'image/jpeg',
                            
                          });
                          if (blobData instanceof Blob) {
                            const dataBuffer = Buffer.from(await blobData.arrayBuffer());
                            base64Data = dataBuffer.toString('base64');
                            attachmentRow.mime_type = 'image/jpeg';
                          }
                          
                        } else {
                          */
                          base64Data = fileData.toString('base64');
                        
                        
                       

                        messageSend = {
                          ...row,
                          attachment: {
                            ROWID: attachmentRow.ROWID,
                            filename: attachmentRow.filename,
                            uti: attachmentRow.uti,
                            transfer_name: attachmentRow.transfer_name,
                            total_bytes: attachmentRow.total_bytes,
                            mime_type: attachmentRow.mime_type,
                            is_sticker: attachmentRow.is_sticker,
                            hide_attachment: attachmentRow.hide_attachment,
                            data: base64Data,
                          },
                        };
                      }
                    }
                  }

                  //const msg = parse(row.hexAB)
                  //console.log(row.ROWID)
                  //console.log(msg);
                  

                  messageSendList.push(messageSend);
                }),
              );

              // Sort messageSendList based on ROWID if needed
              messageSendList.sort((a, b) => a.ROWID - b.ROWID);

              resolve(messageSendList);
            } catch (error) {
              reject(`Error retrieving attachments: ${error}`);
            }
          }
        },
      );
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
