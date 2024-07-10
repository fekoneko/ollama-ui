import { useMutation } from '@tanstack/react-query';
import styles from './ChatPage.module.css';
import ollama from 'ollama/browser';
import { FC, useEffect, useRef, useState } from 'react';
import { ChatBottomBar } from '@/components/ChatBottomBar';
import { ChatMessages } from '@/components/ChatMessages';
import { useChat } from '@/hooks/useChat';
import { Message } from '@/types/chat';

interface Abortable {
  abort: () => void;
}

export const ChatPage: FC = () => {
  const [prompt, setPrompt] = useState('');
  const { messages, lastMessage, addMessage, updateLastMessage } = useChat();
  const replyStreamRef = useRef<Abortable>();
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  const { mutate: generateReply } = useMutation({
    mutationKey: ['generate'],
    mutationFn: async (message: string) => {
      replyStreamRef.current?.abort();
      const newMessage: Message = { role: 'user', content: message, status: 'waiting' };
      addMessage(newMessage);

      return await ollama.chat({
        model: 'llama3',
        messages: [...messages, newMessage],
        stream: true,
      });
    },

    onSuccess: async (stream) => {
      replyStreamRef.current = stream;
      updateLastMessage((prev) => ({ ...prev, status: 'success' }));
      addMessage({ role: 'assistant', content: '', status: 'streaming' });

      try {
        for await (const chunk of stream) {
          updateLastMessage((prev) => ({ ...prev, content: prev.content + chunk.message.content }));
        }
        updateLastMessage((prev) => ({ ...prev, status: 'success' }));
      } catch (error: any) {
        if (error.name !== 'AbortError') throw error;
        updateLastMessage((prev) => ({ ...prev, status: 'error' }));
      }
    },

    onError: () => {
      updateLastMessage((prev) => ({ ...prev, status: 'error' }));
    },
  });

  useEffect(() => {
    const chatMessages = chatMessagesRef.current;
    if (!chatMessages) return;

    chatMessages.scrollTo({
      top: chatMessages.scrollHeight,
      behavior: 'smooth',
    });
  }, [lastMessage]);

  const handleSend = () => {
    generateReply(prompt);
    setPrompt('');
  };

  const handleStop = () => replyStreamRef.current?.abort();

  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <ChatMessages ref={chatMessagesRef} messages={messages} />

        <ChatBottomBar
          prompt={prompt}
          setPrompt={setPrompt}
          mode={
            lastMessage?.status === 'waiting'
              ? 'waiting'
              : lastMessage?.status === 'streaming'
                ? 'stop'
                : 'send'
          }
          onSend={handleSend}
          onStop={handleStop}
        />
      </div>
    </div>
  );
};
