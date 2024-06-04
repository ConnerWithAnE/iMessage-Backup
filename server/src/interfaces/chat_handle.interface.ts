export interface ChatHandle {
    chat_id: number,
    handle_id: number,   
}

export function createChatHandleInstance() {
    return {
        chat_id: 0,
        handle_id: 0,
    }
}