import { Service } from "src/types/service";

export interface ChatPreview {
    CHATID: number,
    handle_ids: Record<number, string>,
    last_read_message_timestamp: number,
    service_name: Service,
    display_name: string | undefined,
}

export function createChatPreviewChatInstance() {
    
}

export function createChatPreviewInstance(): ChatPreview {
    return {
        CHATID: 0,
        handle_ids: {},
        last_read_message_timestamp: 0,
        service_name: 'iMessage',
        display_name: undefined,
    }
}