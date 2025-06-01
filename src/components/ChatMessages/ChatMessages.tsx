import { ChatMessage } from "@/components/ChatMessage/ChatMessage";
import { Message } from "@/types/message";
import { forwardRef } from "react";
import styles from "./ChatMessages.module.css";

export interface ChatMessagesProps {
  messages: Message[];
}

export const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(
  ({ messages }, ref) => (
    <div ref={ref} className={styles.messagesWrapper}>
      <div className={styles.messagesContainer}>
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </div>
    </div>
  ),
);
