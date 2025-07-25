import { useChats } from "@/features/messenger/hooks/use-chats";
import { ChatListItem } from "@/features/messenger/ui/ChatListItem";
import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import classes from "./ChatList.module.css";

export const ChatList: FC = () => {
  const { t } = useTranslation();
  const { chats, createChat, removeChat, selectedChatId, selectChat } = useChats();

  const handleRemoveChat = (chatId: string) => {
    removeChat(chatId);
    if (chatId) selectChat(null);
  };

  return (
    <div className={classes.chatList}>
      {chats.map((chat) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          isSelected={chat.id === selectedChatId}
          onSelect={() => selectChat(chat.id)}
          onRemove={() => handleRemoveChat(chat.id)}
        />
      ))}

      <Button
        variant="subtle"
        rightSection={<IconPlus />}
        onClick={createChat}
        className={classes.createButton}
      >
        {t("create-chat")}
      </Button>
    </div>
  );
};
