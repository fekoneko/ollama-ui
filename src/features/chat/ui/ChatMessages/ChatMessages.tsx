import { Message } from "@/features/chat/types/message";
import { ChatMessage } from "@/features/chat/ui/ChatMessage/ChatMessage";
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
