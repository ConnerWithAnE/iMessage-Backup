import "../App.css";

interface ChatBubbleProps {
    children: string;
    sender?: boolean;
}

const ChatBubble = ({ children, sender }: ChatBubbleProps) => {
    const bubbleStyle = sender
        ? "bg-blue-500 text-white self-end"
        : "bg-gray-200 text-gray-700";

    const bubblePosition = sender ? "items-end" : "items-start";
    const bubbleAlign = sender ? "float-end" : "float-start";

    return (
        <div
            className={`${sender ? 'ml-[50%]' : 'mr-[50%]'} my-4 px-4 py-2 rounded-2xl ${bubbleStyle} shadow-md`}
        >
            <div className="relative">
                <div className={`absolute inset-0 flex ${bubblePosition}`}>
                    <div
                        className={`w-4 h-4 ${bubbleStyle} rounded-full ${bubbleAlign}`}
                    />
                </div>
                <div className="relative p-2">
                    <div className="text-left">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default ChatBubble;
