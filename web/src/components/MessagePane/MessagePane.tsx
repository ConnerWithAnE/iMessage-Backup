import { useEffect, useRef, useState } from "react";
import { Message } from "../../interfaces/message.interface";
import ChatBubble from "./ChatBubble";
import "../../App.css";
import ChatPanel from "./ChatPanel";
import React from "react";
import { ChatPreview } from "../../interfaces/chat_preview.interface";

interface MessagePaneProps {
    id: number;
}

export default function MessagePane({ id }: MessagePaneProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [renderedMessages, setRenderedMessages] = useState<Message[]>([]);
    const [loadCount, setLoadCount] = useState<number>(10); // Number of messages to load at a time
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const topMessageIdRef = useRef<number | null>(null);
    const [chatPreview, setChatPreview] = React.useState<ChatPreview>();

    const [isLoading, setIsLoading] = useState<boolean>(true); // State to track loading



    const debug = false;

    useEffect(() => {
        const fetchMessages = async () => {
            if (messages.length === 0) {
                try {
                    const messageResponse = await fetch(
                        `http://localhost:3000/messages/${id}`
                    );
                    if (messageResponse.ok) {
                        const data = await messageResponse.json();
                        setMessages(data); // Ensure messages are in the correct order
                        try {
                            const response = await fetch(
                                `http://localhost:3000/chats/preview/${id}`
                            );
                            if (response.ok) {
                                const data = await response.json();
                                console.log(data)
                                setChatPreview(data);
                            }
                        } catch (error) {
                            console.error("Error fetching chat previews", error);
                        } finally {
                            setIsLoading(false); // Set loading state to false when fetches are done
                        }
                        
                    }
                } catch (error) {
                    console.error("Error fetching messages", error);
                }
            }
        };
        

        fetchMessages();
    }, [id]);

    useEffect(() => {
        if (messages.length > 0) {
            setRenderedMessages(messages.slice(-loadCount));
            setTimeout(() => {
                if (chatContainerRef.current) {
                    chatContainerRef.current.scrollTop =
                        chatContainerRef.current.scrollHeight;
                }
            }, 0);
        }
    }, [messages]);

    const loadMoreMessages = () => {
        if (chatContainerRef.current) {
            const scrollTopBefore = chatContainerRef.current.scrollTop;
            const scrollHeightBefore = chatContainerRef.current.scrollHeight;

            const newRenderCount = Math.min(
                renderedMessages.length + loadCount,
                messages.length
            );
            setRenderedMessages(messages.slice(-newRenderCount));

            requestAnimationFrame(() => {
                if (chatContainerRef.current) {
                    const scrollHeightAfter =
                        chatContainerRef.current.scrollHeight;
                    chatContainerRef.current.scrollTop =
                        scrollHeightAfter -
                        scrollHeightBefore +
                        scrollTopBefore;
                }
            });
        }
    };

    const handleScroll = () => {
        if (chatContainerRef.current) {
            const { scrollTop } = chatContainerRef.current;

            if (scrollTop === 0) {
                // Get the ROWID of the top message
                const topMessageElement = chatContainerRef.current.querySelector(
                    ".chat-container > div:first-child"
                );
                if (topMessageElement) {
                    const topMessageId = parseInt(
                        topMessageElement.getAttribute("data-rowid") || ""
                    );
                    topMessageIdRef.current = topMessageId;
                }

                loadMoreMessages();
            }
        }
    };

    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            chatContainer.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (chatContainer) {
                chatContainer.removeEventListener("scroll", handleScroll);
            }
        };
    }, [renderedMessages]);

    // Scroll to the top message when new messages are loaded
    useEffect(() => {
        if (topMessageIdRef.current !== null) {
            const topMessageElement = document.querySelector(
                `#message-${topMessageIdRef.current}`
            ) as HTMLElement;
            if (topMessageElement && chatContainerRef.current) {
                chatContainerRef.current.scrollTop =
                    topMessageElement.offsetTop - chatContainerRef.current.offsetTop;
            }
        }
    }, [renderedMessages]);

    

    return (
        <div className="flex flex-col h-[800px] mb-5">
            <div className="items-center border-b border-b-gray-300 flex-shrink-0">
                <ChatPanel chatInfo={chatPreview}/>
            </div>
            <div
                className="chat-container flex-grow overflow-y-auto"
                ref={chatContainerRef}
            >
                {renderedMessages.map((message: Message, index: number) => {
                    const prevMessageID = index > 0 ? renderedMessages[index - 1].handle_id : null;
                    return (
                        <div
                            key={index}
                            id={`message-${message.ROWID}`}
                            data-rowid={message.ROWID} // Store the ROWID as data attribute
                        >
                            {debug ? <p>{message.ROWID}</p> : <p></p>}
                            <ChatBubble message={message} handle={chatPreview?.handle_ids[message.handle_id]} prevMessageID={prevMessageID}>
                                {message.text}
                            </ChatBubble>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
