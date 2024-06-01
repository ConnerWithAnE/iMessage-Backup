export interface Attachment {
    ROWID: number,
    guid: string,
    create_date: number,
    start_date: number,
    filename: string,
    uti: string,
    mime_type: string,
    transfer_state: number,
    is_outgoing: boolean,
    transfer_name: string,
    total_bytes: number,
    is_sticker: boolean,
    hide_attachment: boolean,
    original_guid: string,
}

export function createAttachmentInstance() {
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