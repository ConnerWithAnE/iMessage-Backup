// @ts-ignore
import { useContext, useEffect, useState } from "react";
import "../../App.css";
import { ChatPreview } from "../../interfaces/chat_preview.interface";
import ChatSliver from "./ChatSliver";

export default function ChatList() {
    const [chatPreviews, setChatPreviews] = useState<ChatPreview[]>([]);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/chats/previews"
                );
                if (response.ok) {
                    const data = await response.json();
                    data.sort(
                        (a: ChatPreview, b: ChatPreview) =>
                            b.last_read_message_timestamp -
                            a.last_read_message_timestamp
                    );
                    setChatPreviews(data);
                }
            } catch (error) {
                console.error("Error fetching chat previews", error);
            }
        };

        fetchChats();
    }, []);

    return (
        <div className="w-full h-[85vh] flex flex-col overflow-y-auto bg-slate-100 rounded-xl py-5"
        >
            {chatPreviews.map((preview) => (
                <div key={preview.CHATID}>
                    <ChatSliver preview={preview} />
                    <div className="w-[95%] mx-auto border-b border-b-gray-200"></div>
                </div>
            ))}
        </div>
    );
}
