import { useCallback, useState } from 'react';
import { Message } from '@/types/chat';

export const useChatHistory = () => {
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  const pushToChatHistory = useCallback(
    (message: Message) => {
      const newChatHistory = [...chatHistory, message];
      setChatHistory(newChatHistory);
      return newChatHistory;
    },
    [chatHistory],
  );

  const clearChatHistory = useCallback(() => setChatHistory([]), []);

  return {
    chatHistory,
    pushToChatHistory,
    clearChatHistory,
  };
};
