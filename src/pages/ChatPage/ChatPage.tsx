import { useMutation } from '@tanstack/react-query';
import styles from './ChatPage.module.css';
import ollama from 'ollama/browser';
import { FC, useEffect, useRef, useState } from 'react';
import { ChatBottomBar } from '@/components/ChatBottomBar';
import { ChatMessages } from '@/components/ChatMessages';
import { useChat } from '@/hooks/useChat';
import { MessageStatus } from '@/types/chat';

interface Abortable {
  abort: () => void;
}

export const ChatPage: FC = () => {
  const [prompt, setPrompt] = useState('');
  const { messages, lastMessageRole, addMessage, updateLastMessageContent } = useChat();
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
      const updatedMessages = addMessage({ role: 'user', content: message });

      return await ollama.chat({ model: 'llama3', messages: updatedMessages, stream: true });
    },

    onSuccess: async (stream) => {
      replyStreamRef.current = stream;
      addMessage({ role: 'assistant', content: '' });

      try {
        for await (const chunk of stream) {
          updateLastMessageContent((prev) => prev + chunk.message.content);
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
  }, [lastMessageRole]);

  const handleSend = () => {
    generateReply(prompt);
    setPrompt('');
  };

  const handleCancel = () => replyStreamRef.current?.abort();

  const status: MessageStatus =
    isPending && lastMessageRole === 'user'
      ? 'waiting'
      : isPending && lastMessageRole === 'assistant'
        ? 'streaming'
        : isSuccess
          ? 'success'
          : 'error';

  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <ChatMessages ref={scrollContainerRef} messages={messages} messageStatus={status} />

        <ChatBottomBar
          prompt={prompt}
          setPrompt={setPrompt}
          mode={status === 'waiting' ? 'waiting' : status === 'streaming' ? 'cancel' : 'send'}
          onSend={handleSend}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};
