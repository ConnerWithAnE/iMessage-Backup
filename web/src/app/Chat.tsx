import React, { ReactNode } from 'react';

interface ChatBubbleProps {
  children: ReactNode;
  sender?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ children, sender }) => {
  const bubbleStyle = sender
    ? "bg-blue-500 text-white self-end"
    : "bg-gray-200 text-gray-700";

  return (
    <div className={`max-w-md mx-auto my-4 px-4 py-2 rounded-xl ${bubbleStyle} shadow-md`}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          {sender ? (
            <div className="w-4 h-4 bg-blue-500 rounded-full" />
          ) : (
            <div className="w-4 h-4 bg-gray-200 rounded-full" />
          )}
        </div>
        <div className="relative p-2">
          <div className="">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
