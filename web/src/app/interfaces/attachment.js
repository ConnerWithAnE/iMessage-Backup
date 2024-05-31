"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAttachmentInstance = void 0;
function createAttachmentInstance() {
    return {
        ROWID: 0,
        guid: '',
        create_date: 0,
        start_date: 0,
        filename: '',
        uti: '',
        mime_type: '',
        transfer_state: 0,
        is_outgoing: false,
        transfer_name: '',
        total_bytes: 0,
        is_sticker: false,
        hide_attachment: false,
        original_guid: '',
    };
}
exports.createAttachmentInstance = createAttachmentInstance;
