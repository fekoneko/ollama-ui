import { useMutation } from '@tanstack/react-query';
import styles from './ChatPage.module.css';
import ollama from 'ollama/browser';
import { FC, useEffect, useRef, useState } from 'react';
import { MessageInput } from '@/components/MessageInput';
import { ChatMessages } from '@/components/ChatMessages';
import { useChatHistory } from '@/hooks/useChatHistory';
import { MessageStatus } from '@/types/chat';

interface Abortable {
  abort: () => void;
}

export const ChatPage: FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const { chatHistory, lastMessageFrom, pushToChatHistory, updateLastMessage } = useChatHistory();
  const replyStreamRef = useRef<Abortable>();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const {
    mutate: generateReply,
    isPending,
    isSuccess,
  } = useMutation({
    mutationKey: ['generate'],
    mutationFn: async (message: string) => {
      replyStreamRef.current?.abort();
      const newChatHistory = pushToChatHistory({ role: 'user', content: message });

      return await ollama.chat({ model: 'llama3', messages: newChatHistory, stream: true });
    },

    onSuccess: async (stream) => {
      replyStreamRef.current = stream;
      pushToChatHistory({ role: 'assistant', content: '' });

      try {
        for await (const chunk of stream) {
          updateLastMessage((prev) => prev + chunk.message.content);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') throw error;
      }
    },
  });

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    scrollContainer.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior: 'smooth',
    });
  }, [lastMessageFrom]);

  const handleSend = () => {
    generateReply(inputMessage);
    setInputMessage('');
  };

  const handleCancel = () => replyStreamRef.current?.abort();

  const status: MessageStatus =
    isPending && lastMessageFrom === 'user'
      ? 'waiting'
      : isPending && lastMessageFrom === 'assistant'
        ? 'streaming'
        : isSuccess
          ? 'success'
          : 'error';

  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <ChatMessages ref={scrollContainerRef} chatHistory={chatHistory} messageStatus={status} />

        <MessageInput
          message={inputMessage}
          setMessage={setInputMessage}
          mode={status === 'waiting' ? 'waiting' : status === 'streaming' ? 'cancel' : 'send'}
          onSend={handleSend}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};
