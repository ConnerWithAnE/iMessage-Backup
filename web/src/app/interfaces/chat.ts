export interface Chat {
    ROWID: number,
    guid: string,
    account_id: string,
    account_login: string,
    chat_identifier: string,
    group_id: string,
    original_group_id: string,
}

export function createChatInstance(): Chat {
    return {
        ROWID: 0,
        guid: '',
        account_id: '',
        account_login: '',
        chat_identifier: '',
        group_id: '',
        original_group_id: ''
    };
}
