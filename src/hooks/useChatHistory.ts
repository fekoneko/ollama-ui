import { useCallback, useMemo, useState } from 'react';
import { Message } from '@/types/chat';

export const useChatHistory = () => {
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  const lastMessageFrom = useMemo(
    () => (chatHistory.length ? chatHistory[chatHistory.length - 1].role : undefined),
    [chatHistory],
  );

  const pushToChatHistory = useCallback(
    (message: Message) => {
      const newChatHistory = [...chatHistory, message];
      setChatHistory(newChatHistory);
      return newChatHistory;
    },
    [chatHistory],
  );

  const updateLastMessage = useCallback((content: string | ((prev: string) => string)) => {
    setChatHistory((prev) => [
      ...prev.slice(0, -1),
      {
        role: 'assistant',
        content: typeof content === 'function' ? content(prev[prev.length - 1].content) : content,
      },
    ]);
  }, []);

  const clearChatHistory = useCallback(() => setChatHistory([]), []);

  return {
    chatHistory,
    lastMessageFrom,
    pushToChatHistory,
    updateLastMessage,
    clearChatHistory,
  };
};
