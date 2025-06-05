import { useChat } from "@/features/chat/hooks/use-chat";
import { ChatMessage } from "@/features/chat/ui/ChatMessage/ChatMessage";
import { forwardRef } from "react";
import classes from "./ChatMessages.module.css";

export const ChatMessages = forwardRef<HTMLDivElement>((_, ref) => {
  const { messages } = useChat();

  return (
    <div ref={ref} className={classes.messagesWrapper}>
      <div className={classes.messagesContainer}>
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </div>
    </div>
  );
});
