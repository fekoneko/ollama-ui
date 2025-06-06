import { Message, MessageStatus } from "@/features/chat/types/message";
import { useChats } from "@/features/messenger/hooks/use-chats";
import { useWindowEvent } from "@mantine/hooks";
import { useCallback } from "react";

export const useChat = (chatId: string) => {
  const { chats, updateChat, selectedChatId } = useChats();

  const chat = chats.find((chat) => chat.id === chatId);
  const { model, messages } = chat ?? { model: null, messages: [] as Message[] };
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

  const addMessage = useCallback(
    (message: Message) => {
      if (!chatId) return;
      updateChat(chatId, (prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));
    },
    [chatId, updateChat],
  );

  const updateLastMessage = useCallback(
    (setter: (prev: Message) => Message) => {
      if (!chatId) return;
      updateChat(chatId, (prev) => ({
        ...prev,
        messages: [
          ...prev.messages.slice(0, -1),
          setter(prev.messages[prev.messages.length - 1]),
        ],
      }));
    },
    [chatId, updateChat],
  );

  const appendLastMessageContent = useCallback(
    (appendedContent: string) =>
      updateLastMessage((prev) => ({ ...prev, content: prev.content + appendedContent })),
    [updateLastMessage],
  );

  const updateLastMessageStatus = useCallback(
    (newStatus: MessageStatus) =>
      updateLastMessage((prev) => ({ ...prev, status: newStatus })),
    [updateLastMessage],
  );

  const clearMessages = useCallback(() => {
    if (!chatId) return;
    updateChat(chatId, (prev) => ({ ...prev, messages: [] }));
  }, [chatId, updateChat]);

  const setModel = useCallback(
    (newModel: string) => {
      if (!chatId) return;
      updateChat(chatId, (prev) => ({ ...prev, model: newModel }));
    },
    [chatId, updateChat],
  );

  useWindowEvent("beforeunload", () => {
    if (!chatId) return;
    updateChat(chatId, (prev) => ({
      ...prev,
      messages: prev.messages.map((message) => ({
        ...message,
        status: message.status === "pending" ? "error" : message.status,
      })),
    }));
  });

  return {
    model,
    messages,
    lastMessage,
    addMessage,
    updateLastMessage,
    appendLastMessageContent,
    updateLastMessageStatus,
    clearMessages,
    setModel,
    isChatSelected: selectedChatId === chatId,
  };
};
