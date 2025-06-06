import { Message } from "@/features/chat/types/message";
import { MarkdownView } from "@/ui/MarkdownView";
import { Loader } from "@mantine/core";
import clsx from "clsx";
import { FC } from "react";
import classes from "./ChatMessage.module.css";

export interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: FC<ChatMessageProps> = ({ message }) => {
  const withTyping = message.role === "assistant" && message.status === "pending";

  return (
    <div
      className={clsx(classes.messageBox, {
        [classes.user]: message.role === "user",
        [classes.assistant]: message.role === "assistant",
        [classes.pending]: message.status === "pending",
        [classes.error]: message.status === "error",
      })}
    >
      <MarkdownView>{message.content}</MarkdownView>

      {withTyping && <Loader type="dots" size="sm" color="white" mt={-10} />}
    </div>
  );
};
