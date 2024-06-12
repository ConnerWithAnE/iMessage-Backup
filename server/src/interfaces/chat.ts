export interface Chat {
    ROWID: number,
    guid: string,
    account_id: string,
    account_login: string,
    chat_identifier: string,
    group_id: string,
    original_group_id: string,
    last_read_message_timestamp: number,
    display_name: string,
}

export interface ChatData {
    OLD_ROWID: number;
    guid: string;
    style: number;
    state: number;
    account_id: string;
    properties: any; // Adjust the type as per your needs
    chat_identifier: string;
    service_name: string;
    room_name: string;
    account_login: string;
    is_archived: number;
    last_addressed_handle: string;
    display_name: string;
    group_id: string;
    is_filtered: number;
    successful_query: number;
    engram_id: string;
    server_change_token: string;
    ck_sync_state: number;
    original_group_id: string;
    last_read_message_timestamp: number;
    sr_server_change_token: string;
    sr_ck_sync_state: number;
    cloudkit_record_id: string;
    sr_cloudkit_record_id: string;
    last_addressed_sim_id: string;
    is_blackholed: number;
    syndication_date: number;
    syndication_type: number;
    is_recovered: number;
    is_deleting_incoming_messages: number;
}

export function createChatInstance(): Chat {
    return {
        ROWID: 0,
        guid: '',
        account_id: '',
        account_login: '',
        chat_identifier: '',
        group_id: '',
        original_group_id: '',
        last_read_message_timestamp: 0,
        display_name: ''
    };
}
