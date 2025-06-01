import { ChatMessage } from "@/components/ChatMessage/ChatMessage";
import { Message } from "@/types/message";
import { forwardRef } from "react";
import classes from "./ChatMessages.module.css";

export interface ChatMessagesProps {
  messages: Message[];
}

// TODO: use ScrollArea
export const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(
  ({ messages }, ref) => (
    <div ref={ref} className={classes.messagesWrapper}>
      <div className={classes.messagesContainer}>
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </div>
    </div>
  ),
);
