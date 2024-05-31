export interface MessageAttachment {
    message_id: number,
    attachment_id: number,
}

export function createMessageAttachmentInstance() {
    return {
        message_id: 0,
        attachment_id: 0
    }
}