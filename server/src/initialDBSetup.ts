import { Database, sqlite3 } from 'sqlite3';
import * as fs from 'node:fs';
import * as cliProgress from 'cli-progress';
import {
  ABMULTIVALUE,
  ABPERSON,
  ATTACHMENT,
  CHAT,
  CHAT_HANDLE_JOIN,
  CHAT_MESSAGE_JOIN,
  FILES,
  HANDLE,
  MESSAGE,
  MESSAGE_ATTACHMENT_JOIN,
} from './constants/tableNames';

import {
  attachmentCreateQuery,
  chatCreateQuery,
  chatHandleCreateQuery,
  chatMessageCreateQuery,
  handleCreateQuery,
  messageAttachmentCreateQuery,
  messageCreateQuery,
} from './queries';
import { Service } from './types/service';
import * as path from 'node:path';
import { ChatData } from './interfaces/chat';
import { MessageData } from './interfaces/message.interface';
import { HandleData } from './interfaces/handle.interface';

interface idkyet {
  MESID: number;
  ATTID: number;
  filename: string;
  mime_type: string;
  transfer_name: string;
  total_bytes: number;
}

interface Handle {
  ROWID: number;
  id: string;
  country: string;
  service: Service;
  uncanonicalized_id: string;
  person_centric_id: string;
}

export interface JoinedData {
  attachment: AppleAttachment;
  fileID: string[] | null;
}

export interface AppleAttachment {
  OLD_ROWID: number;
  guid: string;
  created_date: number; // Assuming this is a timestamp in milliseconds
  start_date: number; // Assuming this is a timestamp in milliseconds
  filename: string | null;
  uti: string | null;
  mime_type: string | null;
  transfer_state: number; // Assuming an integer representing the state
  is_outgoing: boolean;
  user_info: string | null; // Assuming a JSON string
  transfer_name: string | null;
  total_bytes: number; // Assuming a number representing the size in bytes
  is_sticker: boolean;
  sticker_user_info: string | null; // Assuming a JSON string
  attribution_info: string | null; // Assuming a JSON string
  hide_attachment: boolean;
  ck_sync_state: number; // Assuming an integer representing the sync state
  ck_server_change_token_blob: string | null;
  ck_record_id: string | null;
  original_guid: string | null;
  sr_ck_sync_state: number; // Assuming an integer representing the sync state
  sr_ck_server_change_token_blob: string | null;
  sr_ck_record_id: string | null;
  is_commsafety_sensitive: boolean;
}

interface AppleFile {
  fileID: string;
  domain: string;
  relativePath: string;
  flags: number;
  file: Buffer;
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
    console.log('created');
    this.createTables();
    console.log('Tables Created');
  }

  public async process() {
    await this.processChats();
    console.log('Chats Migrated');
    await this.processHandles();
    console.log('Handles Migrated');
    await this.processMessages();
    console.log('Messages Migrated');
    await this.processAttachments();
    console.log('Attachments Migrated');
    await this.migrateChatHandleJoin();
    console.log('Chat Handle Links Migrated');
    await this.migrateChatMessageJoin();
    console.log('Chat Message Links Migrated');
    await this.migrateMessageAttachmentJoin();
    console.log('Message Attachment Links Migrated');
    console.log('\n\n\n Migration Complete');
  }

  public async getHandleContactCombo() {
    return new Promise<Handle[]>((resolve, reject) => {
      /*
      const contactQuery = `SELECT abp.First, abp.Last, abp.Middle, abp.Nickname, abmv.value, abmv.record_id
      FROM ${ABPERSON} abp
      JOIN ${ABMULTIVALUE} abmv ON abp.ROWID = abmv.record_id
      WHERE abmv.value IN (${result.map((handle) => `'${handle.id}'`).join(', ')})`;
      */

      const handleQuery = `SELECT h.ROWID, h.id, h.country, h.service, h.uncanolized_id, h.person_centric_id
      FROM ${HANDLE} h`;
      this.chatDB.all(handleQuery, (err: Error | null, rows: Handle[]) => {
        if (err) {
          reject('Error executing query: ' + err.message);
        } else if (!rows) {
          resolve(undefined);
        } else {
          resolve(rows);
        }
      });
    }).then((result) => {
      new Promise((resolve, reject) => {
        const contactQuery = `SELECT abp.First, abp.Last, abp.Middle, abp.Nickname, abmv.value, abmv.record_id
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
      });
    });
  }

  public async createTables() {
    try {
      await this.checkAndCreateTable(
        this.backupDB,
        CHAT,
        this.createChatTable.bind(this),
      );
      await this.checkAndCreateTable(
        this.backupDB,
        MESSAGE,
        this.createMessageTable.bind(this),
      );
      await this.checkAndCreateTable(
        this.backupDB,
        ATTACHMENT,
        this.createAttachmentTable.bind(this),
      );
      await this.checkAndCreateTable(
        this.backupDB,
        HANDLE,
        this.createHandleTable.bind(this),
      );
      await this.checkAndCreateTable(
        this.backupDB,
        CHAT_HANDLE_JOIN,
        this.createChatHandleTable.bind(this),
      );
      await this.checkAndCreateTable(
        this.backupDB,
        CHAT_MESSAGE_JOIN,
        this.createChatMessageTable.bind(this),
      );
      await this.checkAndCreateTable(
        this.backupDB,
        MESSAGE_ATTACHMENT_JOIN,
        this.createMessageAttachmentTable.bind(this),
      );
      // Add more tables as needed
    } catch (err) {
      console.error(`Problem creating tables: ${err}`);
    }
  }

  private async checkAndCreateTable(
    db: any,
    tableName: string,
    createTableFn: () => Promise<void>,
  ) {
    try {
      const exists = await this.tableExists(db, tableName);
      if (!exists) {
        await createTableFn();
      }
    } catch (err) {
      console.error(
        `Cannot verify if ${tableName} exists or problem creating table, ${err}`,
      );
      throw err;
    }
  }

  // HANDLE PROCESSING

  public async processHandles(): Promise<void> {
    const handles: HandleData[] = await this.retrieveHandles();

    for (const handle of handles) {
      await this.insertHandle(handle);
    }

    console.log('Chats Proccessed');
  }

  public async retrieveHandles(): Promise<HandleData[]> {
    return new Promise<HandleData[]>((resolve, reject) => {
      const aquireHandles = `SELECT ROWID AS OLD_ROWID, * FROM ${HANDLE}`;
      this.chatDB.all(aquireHandles, (err: Error | null, rows: any[]) => {
        if (err) {
          console.error(err);
          reject();
        } else {
          resolve(rows);
        }
      });
    });
  }

  private async insertHandle(handle: HandleData): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const insertQuery = `
          INSERT INTO ${HANDLE} (OLD_ROWID, id, country, service, uncanonicalized_id, person_centric_id)
          VALUES (?, ?, ?, ?, ?, ?)
      `;

      this.backupDB.run(
        insertQuery,
        [
          handle.OLD_ROWID,
          handle.id,
          handle.country,
          handle.service,
          handle.uncanonicalized_id,
          handle.person_centric_id,
        ],
        (err: Error | null) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve();
          }
        },
      );
    });
  }

  // MESSAGE PROCESSING

  public async processMessages(): Promise<void> {
    const messageBar = new cliProgress.SingleBar(
      {
        format: ' Inserting Messages | {bar} {percentage}% | {filename} | {value}/{total}',
      },
      cliProgress.Presets.legacy,
    );
    const messages: MessageData[] = await this.retrieveMessages();

    console.log("Messages Retrieved")

    messageBar.start(messages.length, 0, {
      speed: 'N/A',
    });
    for (const message of messages) {
      await this.insertMessage(message);
      messageBar.increment({filename: message.OLD_ROWID});
    }
  }

  private async retrieveMessages(): Promise<MessageData[]> {
    return new Promise<MessageData[]>((resolve, reject) => {
      const aquireMessages = `SELECT ROWID AS OLD_ROWID, * FROM ${MESSAGE}`;
      this.chatDB.all(aquireMessages, (err: Error | null, rows: any[]) => {
        if (err) {
          console.error(err);
          reject();
        } else {
          resolve(rows);
        }
      });
    });
  }

  private async insertMessage(message: MessageData): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const insertQuery = `INSERT INTO message (
        OLD_ROWID, guid, text, replace, service_center, handle_id, subject, country, 
        attributedBody, version, type, service, account, account_guid, error, date, 
        date_read, date_delivered, is_delivered, is_finished, is_emote, is_from_me, 
        is_empty, is_delayed, is_auto_reply, is_prepared, is_read, is_system_message, 
        is_sent, has_dd_results, is_service_message, is_forward, was_downgraded, is_archive, 
        cache_has_attachments, cache_roomnames, was_data_detected, was_deduplicated, 
        is_audio_message, is_played, date_played, item_type, other_handle, group_title, 
        group_action_type, share_status, share_direction, is_expirable, expire_state, 
        message_action_type, message_source, associated_message_guid, associated_message_type, 
        balloon_bundle_id, payload_data, expressive_send_style_id, associated_message_range_location, 
        associated_message_range_length, time_expressive_send_played, message_summary_info, 
        ck_sync_state, ck_record_id, ck_record_change_tag, destination_caller_id, 
        sr_ck_sync_state, sr_ck_record_id, sr_ck_record_change_tag, is_corrupt, reply_to_guid, 
        sort_id, is_spam, has_unseen_mention, thread_originator_guid, thread_originator_part, 
        syndication_ranges, was_delivered_quietly, did_notify_recipient, synced_syndication_ranges, 
        date_retracted, date_edited, was_detonated, part_count, is_stewie, is_kt_verified, 
        is_sos, is_critical, bia_reference_id, fallback_hash
      )
      VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `;
      this.backupDB.run(
        insertQuery,
        [
          message.OLD_ROWID,
          message.guid,
          message.text,
          message.replace,
          message.service_center,
          message.handle_id,
          message.subject,
          message.country,
          message.attributedBody,
          message.version,
          message.type,
          message.service,
          message.account,
          message.account_guid,
          message.error,
          message.date,
          message.date_read,
          message.date_delivered,
          message.is_delivered,
          message.is_finished,
          message.is_emote,
          message.is_from_me,
          message.is_empty,
          message.is_delayed,
          message.is_auto_reply,
          message.is_prepared,
          message.is_read,
          message.is_system_message,
          message.is_sent,
          message.has_dd_results,
          message.is_service_message,
          message.is_forward,
          message.was_downgraded,
          message.is_archive,
          message.cache_has_attachments,
          message.cache_roomnames,
          message.was_data_detected,
          message.was_deduplicated,
          message.is_audio_message,
          message.is_played,
          message.date_played,
          message.item_type,
          message.other_handle,
          message.group_title,
          message.group_action_type,
          message.share_status,
          message.share_direction,
          message.is_expirable,
          message.expire_state,
          message.message_action_type,
          message.message_source,
          message.associated_message_guid,
          message.associated_message_type,
          message.balloon_bundle_id,
          message.payload_data,
          message.expressive_send_style_id,
          message.associated_message_range_location,
          message.associated_message_range_length,
          message.time_expressive_send_played,
          message.message_summary_info,
          message.ck_sync_state,
          message.ck_record_id,
          message.ck_record_change_tag,
          message.destination_caller_id,
          message.sr_ck_sync_state,
          message.sr_ck_record_id,
          message.sr_ck_record_change_tag,
          message.is_corrupt,
          message.reply_to_guid,
          message.sort_id,
          message.is_spam,
          message.has_unseen_mention,
          message.thread_originator_guid,
          message.thread_originator_part,
          message.syndication_ranges,
          message.was_delivered_quietly,
          message.did_notify_recipient,
          message.synced_syndication_ranges,
          message.date_retracted,
          message.date_edited,
          message.was_detonated,
          message.part_count,
          message.is_stewie,
          message.is_kt_verified,
          message.is_sos,
          message.is_critical,
          message.bia_reference_id,
          message.fallback_hash,
        ],
        (err: Error | null) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve();
          }
        },
      );
    });
  }

  // CHAT PROCESSING

  public async processChats(): Promise<void> {
    const chats: ChatData[] = await this.retrieveChats();

    for (const chat of chats) {
      await this.insertChat(chat);
    }

    console.log('Chats Proccessed');
  }

  private async retrieveChats(): Promise<ChatData[]> {
    return new Promise<ChatData[]>((resolve, reject) => {
      const acquireChats = `SELECT ROWID AS OLD_ROWID, * FROM ${CHAT}`;
      this.chatDB.all(acquireChats, (err: Error | null, rows: any[]) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  private async insertChat(chat: ChatData): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const insertQuery = `
          INSERT INTO ${CHAT} (OLD_ROWID, guid, style, state, account_id, properties, chat_identifier, service_name, room_name, account_login, is_archived, last_addressed_handle, display_name, group_id, is_filtered, successful_query, engram_id, server_change_token, ck_sync_state, original_group_id, last_read_message_timestamp, sr_server_change_token, sr_ck_sync_state, cloudkit_record_id, sr_cloudkit_record_id, last_addressed_sim_id, is_blackholed, syndication_date, syndication_type, is_recovered, is_deleting_incoming_messages)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      this.backupDB.run(
        insertQuery,
        [
          chat.OLD_ROWID,
          chat.guid,
          chat.style,
          chat.state,
          chat.account_id,
          chat.properties,
          chat.chat_identifier,
          chat.service_name,
          chat.room_name,
          chat.account_login,
          chat.is_archived,
          chat.last_addressed_handle,
          chat.display_name,
          chat.group_id,
          chat.is_filtered,
          chat.successful_query,
          chat.engram_id,
          chat.server_change_token,
          chat.ck_sync_state,
          chat.original_group_id,
          chat.last_read_message_timestamp,
          chat.sr_server_change_token,
          chat.sr_ck_sync_state,
          chat.cloudkit_record_id,
          chat.sr_cloudkit_record_id,
          chat.last_addressed_sim_id,
          chat.is_blackholed,
          chat.syndication_date,
          chat.syndication_type,
          chat.is_recovered,
          chat.is_deleting_incoming_messages,
        ],
        (err: Error | null) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve();
          }
        },
      );
    });
  }

  // JOIN PROCESSING

  private getNewRowId(tableName: string, oldRowId: number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const selectNewRowIdQuery = `
        SELECT ROWID 
        FROM ${tableName} 
        WHERE OLD_ROWID = ?
      `;

      this.backupDB.get(
        selectNewRowIdQuery,
        [oldRowId],
        (err: Error | null, row: any) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(row.ROWID);
          }
        },
      );
    });
  }

  // CHAT HANDLE JOIN

  public async migrateChatHandleJoin(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Retrieve the existing chat_handle_join pairs
      const selectOldJoinQuery = `
        SELECT chat_id, handle_id 
        FROM ${CHAT_HANDLE_JOIN}
      `;

      this.chatDB.all(
        selectOldJoinQuery,
        async (err: Error | null, rows: any[]) => {
          if (err) {
            console.error(err);
            reject(err);
            return;
          }

          try {
            for (const row of rows) {
              // Retrieve new ROWIDs for chat and handle using OLD_ROWID
              const newChatId = await this.getNewRowId('chat', row.chat_id);
              const newHandleId = await this.getNewRowId(
                'handle',
                row.handle_id,
              );

              // Insert the new chat_handle_join pair
              await this.insertNewChatHandleJoin(newChatId, newHandleId);
            }
            resolve();
          } catch (err) {
            reject(err);
          }
        },
      );
    });
  }

  private insertNewChatHandleJoin(
    newChatId: number,
    newHandleId: number,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const insertNewJoinQuery = `
        INSERT INTO chat_handle_join (chat_id, handle_id) 
        VALUES (?, ?)
      `;

      this.backupDB.run(
        insertNewJoinQuery,
        [newChatId, newHandleId],
        (err: Error | null) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve();
          }
        },
      );
    });
  }

  // CHAT MESSAGE JOIN

  public async migrateChatMessageJoin(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Retrieve the existing chat_handle_join pairs
      const selectOldJoinQuery = `
        SELECT chat_id, message_id, message_date 
        FROM ${CHAT_MESSAGE_JOIN}
      `;

      this.chatDB.all(
        selectOldJoinQuery,
        async (err: Error | null, rows: any[]) => {
          if (err) {
            console.error(err);
            reject(err);
            return;
          }

          try {
            for (const row of rows) {
              // Retrieve new ROWIDs for chat and handle using OLD_ROWID
              const newChatId = await this.getNewRowId('chat', row.chat_id);
              const newMessageId = await this.getNewRowId(
                'message',
                row.handle_id,
              );
              // Insert the new chat_handle_join pair
              await this.insertNewChatMessageJoin(
                newChatId,
                newMessageId,
                row.message_date,
              );
            }
            resolve();
          } catch (err) {
            reject(err);
          }
        },
      );
    });
  }

  private insertNewChatMessageJoin(
    newChatId: number,
    newMessageId: number,
    messageDate: number,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const insertNewJoinQuery = `
        INSERT INTO ${CHAT_MESSAGE_JOIN} (chat_id, message_id, message_date) 
        VALUES (?, ?, ?)
      `;

      this.backupDB.run(
        insertNewJoinQuery,
        [newChatId, newMessageId, messageDate],
        (err: Error | null) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve();
          }
        },
      );
    });
  }

  // MESSAGE ATTACHMENT JOIN

  public async migrateMessageAttachmentJoin(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Retrieve the existing chat_handle_join pairs
      const selectOldJoinQuery = `
        SELECT message_id, attachment_id 
        FROM ${MESSAGE_ATTACHMENT_JOIN}
      `;

      this.chatDB.all(
        selectOldJoinQuery,
        async (err: Error | null, rows: any[]) => {
          if (err) {
            console.error(err);
            reject(err);
            return;
          }

          try {
            for (const row of rows) {
              // Retrieve new ROWIDs for chat and handle using OLD_ROWID
              const newMessageId = await this.getNewRowId(
                'message',
                row.message_id,
              );
              const newAttachmentId = await this.getNewRowId(
                'attachment',
                row.attachment_id,
              );
              // Insert the new chat_handle_join pair
              await this.insertNewMessageAttachmentJoin(
                newMessageId,
                newAttachmentId,
              );
            }
            resolve();
          } catch (err) {
            reject(err);
          }
        },
      );
    });
  }

  private insertNewMessageAttachmentJoin(
    newMessageId: number,
    newAttachmentId: number,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const insertNewJoinQuery = `
        INSERT INTO ${MESSAGE_ATTACHMENT_JOIN} (message_id, attachment_id) 
        VALUES (?, ?)
      `;

      this.backupDB.run(
        insertNewJoinQuery,
        [newMessageId, newAttachmentId],
        (err: Error | null) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve();
          }
        },
      );
    });
  }

  // TABLE CREATION

  public async createChatTable(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.backupDB.run(chatCreateQuery, (err) => {
        if (err) {
          reject(`Could not create ${CHAT} table: ${err}`);
        } else {
          resolve();
        }
      });
    });
  }

  public async createMessageTable(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.backupDB.run(messageCreateQuery, (err) => {
        if (err) {
          reject(`Could not create ${MESSAGE} table: ${err}`);
        } else {
          resolve();
        }
      });
    });
  }

  public async createHandleTable(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.backupDB.run(handleCreateQuery, (err) => {
        if (err) {
          reject(`Could not create ${HANDLE} table: ${err}`);
        } else {
          resolve();
        }
      });
    });
  }

  public async createAttachmentTable(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.backupDB.run(attachmentCreateQuery, (err) => {
        if (err) {
          reject(`Could not create ${ATTACHMENT} table: ${err}`);
        } else {
          resolve();
        }
      });
    });
  }

  public async createChatHandleTable(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.backupDB.run(chatHandleCreateQuery, (err) => {
        if (err) {
          reject(`Could not create ${CHAT_HANDLE_JOIN} table: ${err}`);
        } else {
          resolve();
        }
      });
    });
  }

  public async createChatMessageTable(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.backupDB.run(chatMessageCreateQuery, (err) => {
        if (err) {
          reject(`Could not create ${CHAT_MESSAGE_JOIN} table: ${err}`);
        } else {
          resolve();
        }
      });
    });
  }

  public async createMessageAttachmentTable(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.backupDB.run(messageAttachmentCreateQuery, (err) => {
        if (err) {
          reject(`Could not create ${MESSAGE_ATTACHMENT_JOIN} table: ${err}`);
        } else {
          resolve();
        }
      });
    });
  }

  // Function to check if a table exists

  public async tableExists(db: Database, tableName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query = `SELECT name FROM sqlite_master WHERE type='table' AND name=?;`;
      db.get(query, [tableName], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row !== undefined);
        }
      });
    });
  }

  // ATTACHMENT PROCESSING

  public async processAttachments(): Promise<void> {
    const attachments: AppleAttachment[] = await this.aquireAttachments();

    for (const attachment of attachments) {
      await this.insertAttachment(attachment);
    }

    console.log('Chats Proccessed');
  }

  private async insertAttachment(attachment: AppleAttachment): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const insertQuery = `
      INSERT INTO attachment (
        OLD_ROWID,
        guid,
        created_date,
        start_date,
        filename,
        uti,
        mime_type,
        transfer_state,
        is_outgoing,
        user_info,
        transfer_name,
        total_bytes,
        is_sticker,
        sticker_user_info,
        attribution_info,
        hide_attachment,
        ck_sync_state,
        ck_server_change_token_blob,
        ck_record_id,
        original_guid,
        sr_ck_sync_state,
        sr_ck_server_change_token_blob,
        sr_ck_record_id,
        is_commsafety_sensitive
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

      this.backupDB.run(
        insertQuery,
        [
          attachment.OLD_ROWID,
          attachment.guid,
          attachment.created_date,
          attachment.start_date,
          attachment.filename,
          attachment.uti,
          attachment.mime_type,
          attachment.transfer_state,
          attachment.is_outgoing,
          attachment.user_info,
          attachment.transfer_name,
          attachment.total_bytes,
          attachment.is_sticker,
          attachment.sticker_user_info,
          attachment.attribution_info,
          attachment.hide_attachment,
          attachment.ck_sync_state,
          attachment.ck_server_change_token_blob,
          attachment.ck_record_id,
          attachment.original_guid,
          attachment.sr_ck_sync_state,
          attachment.sr_ck_server_change_token_blob,
          attachment.sr_ck_record_id,
          attachment.is_commsafety_sensitive,
        ],
        (err: Error | null) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve();
          }
        },
      );
    });
  }

  public async aquireAttachments(): Promise<AppleAttachment[]> {
    try {
      const attachments = await this.getChatAttachments();
      const files = await this.getFiles();
      const joinedData = await this.joinData(attachments, files);
      const data = this.filterAttachmentsWithSingleExistingFileID(joinedData);
      return data;
    } catch (err) {
      console.error(err);
    }
  }

  private getChatAttachments(): Promise<AppleAttachment[]> {
    const attachmentQuery = `SELECT ROWID AS OLD_ROWID, * FROM ${ATTACHMENT}`;
    return this.queryDB<AppleAttachment>(this.chatDB, attachmentQuery);
  }

  private getFiles(): Promise<AppleFile[]> {
    const filesQuery = `SELECT fileID, domain, relativePath, flags, file FROM ${FILES}`;
    return this.queryDB<AppleFile>(this.manifestDB, filesQuery);
  }

  private queryDB<T>(db: Database, query: string): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      db.all(query, (err: Error | null, rows: T[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  private extractLastTwoPortions(path: string): string {
    const parts = path.split('/');
    return parts.slice(-2).join('/');
  }

  private fileExists(filePath: string): Promise<boolean> {
    return new Promise((resolve) => {
      fs.access(filePath, fs.constants.F_OK, (err) => {
        resolve(!err);
      });
    });
  }

  private async fileExistsForID(
    fileID: string[],
    attachment: AppleAttachment,
  ): Promise<AppleAttachment> {
    const backupDir: string =
      '/home/conner/iPhoneBackup/00008030-000445EC0C84802E/'; // Adjust the path to your iPhone backup directory

    // Loop through each nested directory
    for (let i = 0; i < 256; i++) {
      const subdir: string = i.toString(16).padStart(2, '0'); // Convert the loop index to hexadecimal and pad with zeros

      const dirPath = `${backupDir}${subdir}`;
      const filesInDir = await fs.promises.readdir(dirPath);
      for (let file = 0; file < fileID.length; file++) {
        if (filesInDir.includes(fileID[file])) {
          let destDir;

          // Dir types:
          //  0: None
          //  1: '~Library/SMS/Attachments'
          //  2: '/var/tmp/com.apple.messages/com.apple.MobileSMS/Media'
          const dirType = attachment.filename.startsWith(
            '~/Library/SMS/Attachments',
          )
            ? 1
            : attachment.filename.startsWith(
                  '/var/tmp/com.apple.messages/com.apple.MobileSMS/Media',
                )
              ? 2
              : 0;
          // File found, create new directory and copy the file
          switch (dirType) {
            case 1:
              destDir = path.join(
                'data',
                'Attachments',
                attachment.filename.split('/').slice(-4, -1).join('/'),
              );
              break;
            case 2:
              destDir = path.join(
                'data',
                'Attachments',
                'Media',
                attachment.filename.split('/').slice(-2, -1).join(''),
              );
              break;
            default:
              destDir = path.join(
                'data',
                'Attachments',
                'Other',
                attachment.filename.split('/').slice(-2, -1).join(''),
              );
              break;
          }
          if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
          }
          const filePath = path.join(
            destDir,
            attachment.filename.split('/').pop()!,
          );
          fs.copyFileSync(path.join(dirPath, fileID[file]), filePath);
          attachment.filename = filePath;
          return attachment;
        }
      }

      // File not found
    }
    // File not found
    console.log('File not found');
    return attachment;
  }

  private async filterAttachmentsWithSingleExistingFileID(
    joinedData: JoinedData[],
  ): Promise<AppleAttachment[]> {
    const filteredJoinedData: AppleAttachment[] = [];
    const fileCopyBar = new cliProgress.SingleBar(
      {
        format: ' {bar} {percentage}% | {filename} | {value}/{total}',
      },
      cliProgress.Presets.legacy,
    );

    console.log('Copying Accessible Attachments');
    fileCopyBar.start(joinedData.length, 0, {
      speed: 'N/A',
    });
    for (const joinedItem of joinedData) {
      const { attachment, fileID } = joinedItem;
      if (fileID && fileID.length > 0) {
        const ajdustedAttachment = await this.fileExistsForID(
          fileID,
          attachment,
        ); // Implement fileExistsForID method to check file existence
        filteredJoinedData.push(ajdustedAttachment);
      }
      fileCopyBar.increment();
    }

    return filteredJoinedData;
  }

  private async joinData(
    attachments: AppleAttachment[],
    files: AppleFile[],
  ): Promise<JoinedData[]> {
    const joinedData: JoinedData[] = [];
    const fileMap = new Map<string, string[]>();
    const fileIDBar = new cliProgress.SingleBar(
      {
        format: ' Getting fileIDs | {bar} {percentage}% | {filename} | {value}/{total}',
      },
      cliProgress.Presets.legacy,
    );

    const attachmentBar = new cliProgress.SingleBar(
      {
        format: ' Getting Attachments | {bar} {percentage}% | {filename} | {value}/{total}',
      },
      cliProgress.Presets.legacy,
    );

    // Populate fileMap with fileIDs indexed by their last two portions of relativePath
    fileIDBar.start(files.length, 0, {
      speed: 'N/A',
    });
    for (const file of files) {
      const extractedPath = this.extractLastTwoPortions(file.relativePath);
      const fileIDs = fileMap.get(extractedPath) || [];
      if (file.fileID && !fileIDs.includes(file.fileID)) {
        fileIDs.push(file.fileID);
      }
      fileMap.set(extractedPath, fileIDs);
      fileIDBar.increment({filename: file.fileID});
    }

    attachmentBar.start(attachments.length, 0, {
      speed: 'N/A',
    });
    for (const attachment of attachments) {
      let extractedFilename = this.extractLastTwoPortions(attachment.filename);
      let matchingFileIDs: string[] = [];

      // Check for matching file based on last two portions
      if (fileMap.has(extractedFilename)) {
        matchingFileIDs = fileMap.get(extractedFilename) || [];
      } else {
        // If no match found, relax matching criteria and check for matches by filename
        extractedFilename = attachment.filename.split('/').slice(-1)[0];
        if (fileMap.has(extractedFilename)) {
          matchingFileIDs = fileMap.get(extractedFilename) || [];
        } else {
          // If still no match found, check for matches anywhere in the filename
          for (const [path, fileIDs] of fileMap.entries()) {
            if (path.includes(extractedFilename)) {
              matchingFileIDs.push(...fileIDs);
            }
          }
        }
      }

      joinedData.push({ attachment, fileID: matchingFileIDs });

      attachmentBar.increment({filename: attachment.filename});
    }

    return joinedData;
  }
}
