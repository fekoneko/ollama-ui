import { ChatData } from "@/features/chat/types/chat-data";
import { readLocalStorageValue, useLocalStorage } from "@mantine/hooks";
import { createContext, Dispatch, FC, ReactNode, SetStateAction, useEffect } from "react";

export interface MessengerContextValue {
  chats: ChatData[];
  setChats: Dispatch<SetStateAction<ChatData[]>>;
  selectedChatId: string | null;
  selectChat: (chatId: string | null) => void;
}

export const MessengerContext = createContext<MessengerContextValue | null>(null);

export interface MessengerProviderProps {
  selectedChatId: string | null;
  selectChat: (chatId: string | null) => void;
  children?: ReactNode;
}

export const MessengerProvider: FC<MessengerProviderProps> = ({
  selectedChatId,
  selectChat,
  children,
}) => {
  const [chats, setChats] = useLocalStorage<ChatData[]>({
    key: "chats",
    defaultValue: [],
  });

  useEffect(() => {
    const chats = readLocalStorageValue<ChatData[]>({ key: `chats`, defaultValue: [] });
    setChats(chats);
  }, [setChats]);

  return (
    <MessengerContext.Provider value={{ chats, setChats, selectedChatId, selectChat }}>
      {children}
    </MessengerContext.Provider>
  );
};
