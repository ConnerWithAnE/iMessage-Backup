import { useEffect, useState } from "react";
import { Message } from "../interfaces/message.interface";
import ChatBubble from "./ChatBubble";
import "../App.css";

interface ChatProps {
    id: number;
}

export default function Chat({ id }: ChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/messages/${id}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setMessages(data);
                    console.log(data);
                }
            } catch (error) {
                console.error("Error fetching messages", error);
                throw error;
            }
        };
        fetchMessages();
    }, []);

    return (
        <div className="mx-[20%]">
            {messages.map((message: Message, index: number) => (
              
                <div
                    key={index}
                    
                >
                    <ChatBubble sender={message.is_from_me}>
                        {message.text}
                    </ChatBubble>
                </div>
            ))}
        </div>
    );
}
