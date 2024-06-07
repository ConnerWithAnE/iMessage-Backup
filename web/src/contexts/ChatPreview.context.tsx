import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
import { ChatPreview } from '../interfaces/chat_preview.interface';

interface ChatPreviewContextType {
    chatPreview: ChatPreview | null;
    setChatPreview: Dispatch<SetStateAction<ChatPreview | null>>;
}

export const ChatPreviewContext = createContext<ChatPreviewContextType | null>(null);

export const useChatPreview = () => {
    const context = useContext(ChatPreviewContext);
    if (!context) {
        throw new Error('useChatPreview must be used within a ChatPreviewProvider');
    }
    return context;
};

