import { MarkdownView } from "@/components/MarkdownView";
import { Message } from "@/types/message";
import clsx from "clsx";
import { FC } from "react";
import styles from "./ChatMessage.module.css";

export interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: FC<ChatMessageProps> = ({ message }) => (
  <div
    className={clsx(styles.messageBox, {
      [styles.user]: message.role === "user",
      [styles.assistant]: message.role === "assistant",
      [styles.pending]: message.status === "pending",
      [styles.error]: message.status === "error",
    })}
  >
    <MarkdownView
      withTyping={message.role === "assistant" && message.status === "pending"}
    >
      {message.content}
    </MarkdownView>
  </div>
);
