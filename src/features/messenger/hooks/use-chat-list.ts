import { ChatData } from "@/features/chat/types/chat-data";
import { readLocalStorageValue, useLocalStorage } from "@mantine/hooks";
import { useCallback, useEffect } from "react";
import { v4 as uuid } from "uuid";

export const useChatList = () => {
  const [chats, setChats] = useLocalStorage<ChatData[]>({
    key: `chats`,
    defaultValue: [],
  });

  useEffect(() => {
    const chats = readLocalStorageValue<ChatData[]>({
      key: `chats`,
      defaultValue: [],
    });
    setChats(chats);
  }, [setChats]);

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

  return { chats, updateChat, createChat, removeChat };
};
