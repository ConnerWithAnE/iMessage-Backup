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
    is_audio_message: boolean,
    expire_state: number,
    associated_message_guid: string,
    
}

export function createMessageInstance(): Message {
    return {
        
    }
}