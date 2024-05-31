import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  ROWID: number;

  @Column()
  guid: string;

  @Column()
  text: string;

  @Column()
  handle_id: number;

  @Column()
  service: string;

  @Column()
  account_guid: string;

  @Column()
  date: number;

  @Column()
  date_read: number;

  @Column()
  date_delivered: number;

  @Column()
  is_delivered: boolean;

  @Column()
  is_from_me: boolean;

  @Column()
  is_read: boolean;

  @Column()
  is_sent: boolean;

  @Column()
  has_dd_results: boolean;

  @Column()
  cache_has_attachments: boolean;

  @Column()
  cache_roomnames: string;

  @Column()
  is_audio_message: boolean;

  @Column()
  expire_state: number;

  @Column()
  associated_message_guid: string;

  @Column()
  asscociate_message_type: number;

  @Column()
  balloon_bundle_id: string;

  @Column()
  expressive_send_style_id: string;

  @Column()
  associated_message_range_length: number;

  @Column()
  reply_to_guid: string;

  @Column()
  thread_originator_guid: string;

  @Column()
  thread_originator_part: string;

  @Column()
  date_retracted: number;

  @Column()
  date_edited: number;

  @Column()
  part_count: number;
}
