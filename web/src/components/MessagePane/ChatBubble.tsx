import "../../App.css";
import { Message } from "../../interfaces/message.interface";
// @ts-ignore
import { usePreviousMessageID } from '../../contexts/PreviousIDContext';
// @ts-ignore
import { ReactNode, useEffect } from "react";

interface ChatBubbleProps {
    children: ReactNode;
    message: Message;
    handle?: string;
    prevMessageID: number | null;
}

const ChatBubble = ({ children, message, handle, prevMessageID }: ChatBubbleProps) => {

    const sender = message.is_from_me;
    const bubbleStyle = sender
        ? `${message.service === 'iMessage' ? /*bg-blue-500*/"bg-appleChatBubble" : "bg-otherChatBubble"} text-white self-end`
        : "bg-recieveChatBubble text-gray-700";

    const bubblePosition = sender ? "items-end" : "items-start";
    // @ts-ignore
    const bubbleAlign = sender ? "float-end" : "float-start";

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'America/Regina',
      };

      return (
        <div className={`${sender ? 'flex justify-end' : 'flex justify-start'}`}>
            <div className="max-w-xs md:max-w-md lg:max-w-lg">
                <div>
                    <div className={`mt-4 py-2 px-4 text-gray-800`}>
                        {message.handle_id === prevMessageID ? "" : (sender ? "Me" : handle)}
                    </div>
                </div>
                <div className={`px-4 py-2 rounded-2xl ${bubbleStyle} shadow-md inline-block ${sender ? 'justify-end' : '' }`}>
                    <div className="relative">
                        <div className={`absolute inset-0 flex ${bubblePosition}`}></div>
                        <div className="relative p-2">
                            <div className="text-left whitespace-pre-line">{children}</div>
                        </div>
                    </div>
                </div>
                <div className={`${sender ? 'text-right' : 'text-left'} text-sm text-slate-400`}>
                    {new Date((message.date / 1000000000 + Date.parse('2001-01-01') / 1000) * 1000).toLocaleString('en-CA', options)}
                </div>
            </div>
        </div>
    );

};

export default ChatBubble;
