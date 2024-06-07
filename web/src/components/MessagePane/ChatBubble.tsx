import "../../App.css";
import { Message } from "../../interfaces/message.interface";
import { usePreviousMessageID } from '../../contexts/PreviousIDContext';
import { useEffect } from "react";

interface ChatBubbleProps {
    children: string;
    message: Message;
    handle?: string;
    prevMessageID: number | null;
}

const ChatBubble = ({ children, message, handle, prevMessageID }: ChatBubbleProps) => {

    const sender = message.is_from_me;
    const bubbleStyle = sender
        ? "bg-blue-500 text-white self-end"
        : "bg-gray-200 text-gray-700";

    const bubblePosition = sender ? "items-end" : "items-start";
    const bubbleAlign = sender ? "float-end" : "float-start";

    return (
        
        <div>
                  <div className={`${sender ? 'ml-[50%]' : 'mr-[50%]'} mt-4 py-2 px-4`}>{ message.handle_id === prevMessageID ? "" : (sender ? "Me" : handle)}</div>
        <div
            className={`${sender ? 'ml-[50%]' : 'mr-[50%]'} mb-4 px-4 py-2 rounded-2xl ${bubbleStyle} shadow-md`}
        >
            <div className="relative">
                <div className={`absolute inset-0 flex ${bubblePosition}`}>
                </div>
                
                <div className="relative p-2">
                    <div className="text-left whitespace-pre-line">{children}</div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default ChatBubble;
