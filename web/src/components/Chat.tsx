import MessagePane from "./MessagePane/MessagePane";
import "../App.css";
import { useParams } from "react-router-dom";

export default function Chat() {
    const { id } = useParams<{ id?: string }>();
    const chatId = id ? parseInt(id, 10) : undefined;

    if (chatId === undefined) {
        return <div>Invalid chat ID</div>; // Display an error message or handle the case where id is undefined
    }

    return (
        <div className="relative bg-gray-100 px-5 mr-2 rounded-lg">
            <MessagePane id={chatId} />
        </div>
    );
}
