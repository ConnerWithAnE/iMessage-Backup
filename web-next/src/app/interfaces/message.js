"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessageInstance = void 0;
function createMessageInstance() {
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
exports.createMessageInstance = createMessageInstance;
