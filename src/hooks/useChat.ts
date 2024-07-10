import { useCallback, useEffect, useMemo } from 'react';
import { Message } from '@/types/chat';
import { useLocalStorage } from '@mantine/hooks';

export const useChat = () => {
  const [messages, setMessages] = useLocalStorage<Message[]>({ key: 'messages', defaultValue: [] });

  const lastMessage = useMemo(
    () => (messages.length > 0 ? messages[messages.length - 1] : undefined),
    [messages],
  );

  const addMessage = useCallback(
    (message: Message) => setMessages((prev) => [...prev, message]),
    [setMessages],
  );

  const updateLastMessage = useCallback(
    (setMessage: (prev: Message) => Message) => {
      setMessages((prev) => [...prev.slice(0, -1), setMessage(prev[prev.length - 1])]);
    },
    [setMessages],
  );

  const clear = useCallback(() => setMessages([]), [setMessages]);

  useEffect(() => {
    const setErrorOnWaitingMessages = () =>
      setMessages((prev) =>
        prev.map((message) => ({
          ...message,
          status: message.status === 'waiting' ? 'error' : message.status,
        })),
      );

    addEventListener('beforeunload', setErrorOnWaitingMessages);
    return () => removeEventListener('beforeunload', setErrorOnWaitingMessages);
  }, [setMessages]);

  return {
    messages,
    lastMessage,
    addMessage,
    updateLastMessage,
    clear,
  };
};
