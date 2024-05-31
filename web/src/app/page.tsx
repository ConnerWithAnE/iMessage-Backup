import React from "react";
import Image from "next/image";
import ChatBubble from "./Chat";
import { InitializeDatabase } from "./databaseController";
import { ChatMessageTable } from "./tableControls/tables";

export default function Home({ messages }: { messages: string[] }) {
  return (
    <div>
      {messages.map((message, index) => (
        <ChatBubble key={index}>{message}</ChatBubble>
      ))}
    </div>
  );
}

export async function getServerSide() {
  try {
    const db = new InitializeDatabase('../../data/chat.db');
    const chatMessageTable = new ChatMessageTable(db.getDB());
    const messageIDs = await chatMessageTable.getMessageIDs(37);
    const messages = await chatMessageTable.getMessagesFromIDs(messageIDs);
    
    return {
      props: {
        messages
      }
    };
  } catch (error) {
    return {
      props: {
        error: "Error accessing database"
      }
    };
  }
}
