import { useCallback, useMemo, useState } from 'react';
import { Message } from '@/types/chat';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const lastMessage = useMemo(
    () => (messages.length > 0 ? messages[messages.length - 1] : undefined),
    [messages],
  );

  const addMessage = useCallback(
    (message: Message) => {
      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);
      return updatedMessages;
    },
    [messages],
  );

  const updateLastMessageContent = useCallback((setContent: (prev: string) => string) => {
    setMessages((prev) => [
      ...prev.slice(0, -1),
      {
        ...prev[prev.length - 1],
        content: setContent(prev[prev.length - 1].content),
      },
    ]);
  }, []);

  const clear = useCallback(() => setMessages([]), []);

  return {
    messages,
    lastMessage,
    addMessage,
    updateLastMessageContent,
    clear,
  };
};
