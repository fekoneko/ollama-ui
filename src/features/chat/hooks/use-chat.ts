import { Message, MessageStatus } from "@/features/chat/types/message";
import { useChats } from "@/features/messenger/hooks/use-chats";
import { useWindowEvent } from "@mantine/hooks";
import { useCallback } from "react";

export const useChat = () => {
  const { chats, updateChat, selectedChatId } = useChats();

  const chat = chats.find((chat) => chat.id === selectedChatId);
  const { model, messages } = chat ?? { model: null, messages: [] as Message[] };
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

  const addMessage = useCallback(
    (message: Message) => {
      if (!selectedChatId) return;
      updateChat(selectedChatId, (prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));
    },
    [selectedChatId, updateChat],
  );

  const updateLastMessage = useCallback(
    (setter: (prev: Message) => Message) => {
      if (!selectedChatId) return;
      updateChat(selectedChatId, (prev) => ({
        ...prev,
        messages: [
          ...prev.messages.slice(0, -1),
          setter(prev.messages[prev.messages.length - 1]),
        ],
      }));
    },
    [selectedChatId, updateChat],
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
    if (!selectedChatId) return;
    updateChat(selectedChatId, (prev) => ({ ...prev, messages: [] }));
  }, [selectedChatId, updateChat]);

  const setModel = useCallback(
    (newModel: string) => {
      if (!selectedChatId) return;
      updateChat(selectedChatId, (prev) => ({ ...prev, model: newModel }));
    },
    [selectedChatId, updateChat],
  );

  useWindowEvent("beforeunload", () => {
    if (!selectedChatId) return;
    updateChat(selectedChatId, (prev) => ({
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
    isChatSelected: !!selectedChatId,
  };
};
