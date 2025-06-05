import { useChats } from "@/features/messenger/hooks/use-chats";
import { ChatListItem } from "@/features/messenger/ui/ChatListItem";
import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { FC } from "react";
import classes from "./ChatList.module.css";

export const ChatList: FC = () => {
  const { chats, createChat, removeChat, selectedChatId, selectChat } = useChats();

  const handleCreateChat = () => {
    createChat();
    selectChat(chats[chats.length - 1].id);
  };

  const handleRemoveChat = (chatId: string) => {
    removeChat(chatId);
    if (chatId) selectChat(null);
  };

  return (
    <div className={classes.chatList}>
      <div className={classes.titleContainer}>
        <h1 role="banner" className={classes.title}>
          Ollama UI
        </h1>
      </div>

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
        onClick={handleCreateChat}
        className={classes.createButton}
      >
        Create chat
      </Button>
    </div>
  );
};
