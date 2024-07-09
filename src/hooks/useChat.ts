import { useCallback, useMemo, useState } from 'react';
import { Message } from '@/types/chat';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const lastMessageRole = useMemo(
    () => (messages.length ? messages[messages.length - 1].role : undefined),
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

  const updateLastMessageContent = useCallback((generateContent: (prev: string) => string) => {
    setMessages((prev) => [
      ...prev.slice(0, -1),
      {
        role: 'assistant',
        content: generateContent(prev[prev.length - 1].content),
      },
    ]);
  }, []);

  const clear = useCallback(() => setMessages([]), []);

  return {
    messages,
    lastMessageRole,
    addMessage,
    updateLastMessageContent,
    clear,
  };
};
