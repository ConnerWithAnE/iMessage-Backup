import { useContext, useEffect, useState } from "react";
import "../../App.css";
import { ChatPreview } from "../../interfaces/chat_preview.interface";
import ContactSliver from "./ContactSliver";
import ContactPanel from "./ContactPanel";
import { useSelectedTab } from "../../contexts/SelectedTab.context";

export default function ChatList() {
    const [chatPreviews, setChatPreviews] = useState<ChatPreview[]>([]);
    const {setSelectedTab} = useSelectedTab();

    setSelectedTab('contacts');
    useEffect(() => {
        
        const fetchChats = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/contacts/previews"
                );
                if (response.ok) {
                    const data = await response.json();
                    setChatPreviews(data);
                }
            } catch (error) {
                console.error("Error fetching chat previews", error);
            }
        };

        fetchChats();
    }, []);

    return (
        <div className="w-full h-[85vh] overflow-y-auto bg-slate-100 rounded-xl py-5">
            <ContactPanel />
            <div>
            {chatPreviews.map((preview) => (
                <div key={preview.CHATID}>
                    <ContactSliver preview={preview} />
                    <div className="w-[95%] mx-auto border-b border-b-gray-200"></div>
                </div>
            ))}
            </div>
        </div>
    );
}
