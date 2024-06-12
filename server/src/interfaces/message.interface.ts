import { Service } from "../types/service";

export interface Message {
    ROWID: number,
    guid: string,
    text: string,
    handle_id: number,
    service: Service,
    account_guid: string,
    date: number,
    date_read: number,
    date_delivered: number,
    is_delivered: boolean,
    is_from_me: boolean,
    is_read: boolean,
    is_sent: boolean,
    has_dd_results: boolean,
    cache_has_attachments: boolean,
    cache_roomnames: string,
    is_audio_message: boolean,
    expire_state: number,
    associated_message_guid: string,
    associated_message_type: number,
    balloon_bundle_id: string,
    expressive_send_style_id: string,
    associated_message_range_length: number,
    reply_to_guid: string,
    thread_originator_guid: string,
    thread_originator_part: string,
    date_retracted: number,
    date_edited: number,
    part_count: number,
}

export interface MessageData {
    OLD_ROWID: number;
    guid: string;
    text: string;
    replace: number;
    service_center: string;
    handle_id: number;
    subject: string;
    country: string;
    attributedBody: any; // Adjust the type as per your needs
    version: number;
    type: number;
    service: string;
    account: string;
    account_guid: string;
    error: number;
    date: number;
    date_read: number;
    date_delivered: number;
    is_delivered: number;
    is_finished: number;
    is_emote: number;
    is_from_me: number;
    is_empty: number;
    is_delayed: number;
    is_auto_reply: number;
    is_prepared: number;
    is_read: number;
    is_system_message: number;
    is_sent: number;
    has_dd_results: number;
    is_service_message: number;
    is_forward: number;
    was_downgraded: number;
    is_archive: number;
    cache_has_attachments: number;
    cache_roomnames: string;
    was_data_detected: number;
    was_deduplicated: number;
    is_audio_message: number;
    is_played: number;
    date_played: number;
    item_type: number;
    other_handle: number;
    group_title: string;
    group_action_type: number;
    share_status: number;
    share_direction: number;
    is_expirable: number;
    expire_state: number;
    message_action_type: number;
    message_source: number;
    associated_message_guid: string;
    associated_message_type: number;
    balloon_bundle_id: string;
    payload_data: any; // Adjust the type as per your needs
    expressive_send_style_id: string;
    associated_message_range_location: number;
    associated_message_range_length: number;
    time_expressive_send_played: number;
    message_summary_info: any; // Adjust the type as per your needs
    ck_sync_state: number;
    ck_record_id: string;
    ck_record_change_tag: string;
    destination_caller_id: string;
    sr_ck_sync_state: number;
    sr_ck_record_id: string;
    sr_ck_record_change_tag: string;
    is_corrupt: number;
    reply_to_guid: string;
    sort_id: number;
    is_spam: number;
    has_unseen_mention: number;
    thread_originator_guid: string | null;
    thread_originator_part: string | null;
    syndication_ranges: string | null;
    was_delivered_quietly: number;
    did_notify_recipient: number;
    synced_syndication_ranges: string | null;
    date_retracted: number;
    date_edited: number;
    was_detonated: number;
    part_count: number;
    is_stewie: number;
    is_kt_verified: number;
    is_sos: number;
    is_critical: number;
    bia_reference_id: string | null;
    fallback_hash: string | null;
}

export function createMessageInstance(): Message {
    return {
        ROWID: 0,
        guid: '',
        text: '',
        handle_id: 0,
        service: 'iMessage', // Assuming 'iMessage' is a valid default value
        account_guid: '',
        date: 0,
        date_read: 0,
        date_delivered: 0,
        is_delivered: false,
        is_from_me: false,
        is_read: false,
        is_sent: false,
        has_dd_results: false,
        cache_has_attachments: false,
        cache_roomnames: '',
        is_audio_message: false,
        expire_state: 0,
        associated_message_guid: '',
        associated_message_type: 0,
        balloon_bundle_id: '',
        expressive_send_style_id: '',
        associated_message_range_length: 0,
        reply_to_guid: '',
        thread_originator_guid: '',
        thread_originator_part: '',
        date_retracted: 0,
        date_edited: 0,
        part_count: 0,
      };
}
