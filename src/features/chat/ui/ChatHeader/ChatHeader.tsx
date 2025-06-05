import { useChat } from "@/features/chat/hooks/use-chat";
import { ChatModelPicker } from "@/features/chat/ui/ChatModelPicker";
import { ActionIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { FC } from "react";
import classes from "./ChatHeader.module.css";

export const ChatHeader: FC = () => {
  const { clearMessages, lastMessage } = useChat();

  return (
    <header className={classes.chatHeader}>
      <div className={classes.leftSection}>
        <ChatModelPicker disabled={lastMessage?.status === "pending"} />
      </div>

      <ActionIcon
        onClick={clearMessages}
        variant="subtle"
        title="Clear chat"
        className={classes.clearButton}
      >
        <IconTrash />
      </ActionIcon>
    </header>
  );
};
