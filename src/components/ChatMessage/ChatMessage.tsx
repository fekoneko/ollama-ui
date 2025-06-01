import { MarkdownView } from "@/components/MarkdownView";
import { Message } from "@/types/message";
import clsx from "clsx";
import { FC } from "react";
import classes from "./ChatMessage.module.css";

export interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: FC<ChatMessageProps> = ({ message }) => (
  <div
    className={clsx(classes.messageBox, {
      [classes.user]: message.role === "user",
      [classes.assistant]: message.role === "assistant",
      [classes.pending]: message.status === "pending",
      [classes.error]: message.status === "error",
    })}
  >
    <MarkdownView
      withTyping={message.role === "assistant" && message.status === "pending"}
    >
      {message.content}
    </MarkdownView>
  </div>
);
