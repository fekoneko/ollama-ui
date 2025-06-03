import { useChatList } from "@/features/messenger/hooks/use-chat-list";
import { ChatListItem } from "@/features/messenger/ui/ChatListItem";
import { Button } from "@mantine/core";
import { FC } from "react";
import classes from "./ChatList.module.css";

export interface ChatListProps {
  chatId: string | null;
  onSelect?: (chatId: string | null) => void;
}

export const ChatList: FC<ChatListProps> = ({ chatId, onSelect }) => {
  const { chats, createChat, removeChat } = useChatList();

  return (
    <div className={classes.chatList}>
      {chats.map((chat) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          isSelected={chat.id === chatId}
          onSelect={() => onSelect?.(chat.id)}
          onRemove={() => {
            removeChat(chat.id);
            if (chat.id === chatId) onSelect?.(null);
          }}
        />
      ))}

      <Button onClick={createChat}>Create new chat</Button>
    </div>
  );
};
