export interface ChatMessage {
    chat_id: number,
    message_id: number,
    message_date: number
}

export function createChatMessageInstance() {
    return {
        chat_id: 0,
        message_id: 0,
        message_date: 0
    }
}