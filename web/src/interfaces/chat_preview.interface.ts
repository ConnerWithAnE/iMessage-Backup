import { Service } from "../types/service.type";
import { ListHandle } from "./list_handle.interface";

export interface ChatPreview {
    CHATID: number,
    handle_ids: Record<number, ListHandle>,
    last_read_message_timestamp: number,
    service_name: Service,
    display_name: string | undefined,
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