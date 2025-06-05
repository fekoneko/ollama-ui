import { ChatData } from "@/features/chat/types/chat-data";
import { readLocalStorageValue, useLocalStorage } from "@mantine/hooks";
import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from "react";

export interface MessengerContextValue {
  chats: ChatData[];
  setChats: Dispatch<SetStateAction<ChatData[]>>;
  selectedChatId: string | null;
  selectChat: (chatId: string | null) => void;
}

export const MessengerContext = createContext<MessengerContextValue | null>(null);

export const MessengerProvider: FC<PropsWithChildren> = ({ children }) => {
  const [chats, setChats] = useLocalStorage<ChatData[]>({
    key: "chats",
    defaultValue: [],
  });
  const [selectedChatId, setChatId] = useState<string | null>(null);

  useEffect(() => {
    const chats = readLocalStorageValue<ChatData[]>({ key: `chats`, defaultValue: [] });
    setChats(chats);
  }, [setChats]);

  return (
    <MessengerContext.Provider
      value={{ chats, setChats, selectedChatId, selectChat: setChatId }}
    >
      {children}
    </MessengerContext.Provider>
  );
};
