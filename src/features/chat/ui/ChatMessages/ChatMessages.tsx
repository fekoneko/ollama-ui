import { useChat } from "@/features/chat/hooks/use-chat";
import { ChatMessage } from "@/features/chat/ui/ChatMessage/ChatMessage";
import { forwardRef } from "react";
import classes from "./ChatMessages.module.css";

export interface ChatMessagesProps {
  chatId: string;
}

export const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(
  ({ chatId }, ref) => {
    const { messages } = useChat(chatId);

    return (
      <div ref={ref} className={classes.messagesWrapper}>
        <div className={classes.messagesContainer}>
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
      </div>
    );
  },
);
