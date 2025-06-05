import { useChatList } from "@/features/messenger/hooks/use-chat-list";
import { ChatListItem } from "@/features/messenger/ui/ChatListItem";
import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { FC } from "react";
import classes from "./ChatList.module.css";

export interface ChatListProps {
  chatId: string | null;
  onSelect?: (chatId: string | null) => void;
}

export const ChatList: FC<ChatListProps> = ({ chatId, onSelect }) => {
  const { chats, createChat, removeChat } = useChatList();

  const handleCreateChat = () => {
    createChat();
    onSelect?.(chats[chats.length - 1].id);
  };

  const handleRemoveChat = (chatId: string) => {
    removeChat(chatId);
    if (chatId) onSelect?.(null);
  };

  return (
    <div className={classes.chatList}>
      {chats.map((chat) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          isSelected={chat.id === chatId}
          onSelect={() => onSelect?.(chat.id)}
          onRemove={() => handleRemoveChat(chat.id)}
        />
      ))}

      <Button
        variant="subtle"
        color="gray"
        rightSection={<IconPlus />}
        onClick={handleCreateChat}
        className={classes.createButton}
      >
        Create chat
      </Button>
    </div>
  );
};
