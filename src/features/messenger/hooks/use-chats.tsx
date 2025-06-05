import { ChatData } from "@/features/chat/types/chat-data";
import { MessengerContext } from "@/features/messenger/providers/MessengerProvider";
import { use, useCallback } from "react";
import { v4 as uuid } from "uuid";

export const useChats = () => {
  const context = use(MessengerContext);
  if (!context) throw new Error("useChats must be used within ChatsContext");
  const { chats, setChats, selectedChatId, selectChat } = context;

  const updateChat = useCallback(
    (chatId: string, setter: (prev: ChatData) => ChatData) =>
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id === chatId) return chat;
          return setter(chat);
        }),
      ),
    [setChats],
  );

  const createChat = useCallback(
    () => setChats((prev) => [...prev, { id: uuid(), model: null, messages: [] }]),
    [setChats],
  );

  const removeChat = useCallback(
    (chatId: string) => setChats((prev) => prev.filter((chat) => chat.id !== chatId)),
    [setChats],
  );

  return { chats, updateChat, createChat, removeChat, selectedChatId, selectChat };
};
