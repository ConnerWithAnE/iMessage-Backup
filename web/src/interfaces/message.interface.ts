import { Service } from "../types/service.type";

export interface Message {
    ROWID: number;
    guid: string;
    text: string;
    handle_id: number;
    service: Service;
    attachment: MessageAttachment;
    account_guid: string;
    date: number;
    date_read: number;
    date_delivered: number;
    is_delivered: boolean;
    is_from_me: boolean;
    is_read: boolean;
    is_sent: boolean;
    has_dd_results: boolean;
    cache_has_attachments: boolean;
    cache_roomnames: string;
    is_audio_message: boolean;
    expire_state: number;
    associated_message_guid: string;
    associated_message_type: number;
    balloon_bundle_id: string;
    expressive_send_style_id: string;
    associated_message_range_length: number;
    reply_to_guid: string;
    thread_originator_guid: string;
    thread_originator_part: string;
    date_retracted: number;
    date_edited: number;
    part_count: number;
}

export interface MessageAttachment {
    ROWID: number;
    data: string;
    filename: string;
    uti: string;
    mime_type: string;
    transfer_name: string;
    total_bytes: number;
    is_sticker: boolean;
    hide_attachment: boolean;
}

