import { useCallback, useEffect, useMemo } from 'react';
import { Message, MessageStatus } from '@/types/chat';
import { useLocalStorage, useWindowEvent } from '@mantine/hooks';

export const useChat = (model: string | undefined) => {
  const [messages, setMessages] = useLocalStorage<Message[]>({
    key: `messages-${model}`,
    defaultValue: [],
  });

  useEffect(() => {
    const newModelMessages = JSON.parse(localStorage.getItem(`messages-${model}`) ?? 'null');
    setMessages(newModelMessages ?? []);
  }, [model, setMessages]);

  const lastMessage = useMemo(
    () => (messages.length > 0 ? messages[messages.length - 1] : undefined),
    [messages],
  );

  const addMessage = useCallback(
    (message: Message) => setMessages((prev) => [...prev, message]),
    [setMessages],
  );

  const updateLastMessage = useCallback(
    (setMessage: (prev: Message) => Message) =>
      setMessages((prev) => [...prev.slice(0, -1), setMessage(prev[prev.length - 1])]),
    [setMessages],
  );

  const appendLastMessageContent = useCallback(
    (appendedContent: string) =>
      updateLastMessage((prev) => ({ ...prev, content: prev.content + appendedContent })),
    [updateLastMessage],
  );

  const updateLastMessageStatus = useCallback(
    (newStatus: MessageStatus) => updateLastMessage((prev) => ({ ...prev, status: newStatus })),
    [updateLastMessage],
  );

  const clearMessages = useCallback(() => setMessages([]), [setMessages]);

  useWindowEvent('beforeunload', () =>
    setMessages((prev) =>
      prev.map((message) => ({
        ...message,
        status: message.status === 'pending' ? 'error' : message.status,
      })),
    ),
  );

  return {
    messages,
    lastMessage,
    addMessage,
    updateLastMessage,
    appendLastMessageContent,
    updateLastMessageStatus,
    clearMessages,
  };
};
