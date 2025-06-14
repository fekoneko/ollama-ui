import { useChat } from "@/features/chat/hooks/use-chat";
import { ChatModelPicker } from "@/features/chat/ui/ChatModelPicker";
import { ActionIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import classes from "./ChatHeader.module.css";

export interface ChatHeaderProps {
  chatId: string;
}

export const ChatHeader: FC<ChatHeaderProps> = ({ chatId }) => {
  const { t } = useTranslation();
  const { clearMessages, lastMessage } = useChat(chatId);

  return (
    <header className={classes.chatHeader}>
      <div className={classes.leftSection}>
        <ChatModelPicker chatId={chatId} disabled={lastMessage?.status === "pending"} />
      </div>

      <ActionIcon
        onClick={clearMessages}
        variant="subtle"
        title={t("clear-chat")}
        className={classes.clearButton}
      >
        <IconTrash />
      </ActionIcon>
    </header>
  );
};
