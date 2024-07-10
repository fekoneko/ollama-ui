import { useMutation } from '@tanstack/react-query';
import styles from './ChatPage.module.css';
import ollama from 'ollama/browser';
import { FC, useEffect, useRef, useState } from 'react';
import { ChatBottomBar } from '@/components/ChatBottomBar';
import { ChatMessages } from '@/components/ChatMessages';
import { useChat } from '@/hooks/useChat';
import { Message } from '@/types/chat';
import { ChatHeader } from '@/components/ChatHeader';

interface Abortable {
  abort: () => void;
}

export const ChatPage: FC = () => {
  const [prompt, setPrompt] = useState('');
  const [model] = useState('llama3');
  const {
    messages,
    lastMessage,
    addMessage,
    appendLastMessageContent,
    updateLastMessageStatus,
    clearMessages,
  } = useChat();
  const replyStreamRef = useRef<Abortable>();
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  const { mutate: generateReply } = useMutation({
    mutationKey: ['generate'],
    mutationFn: async (prompt: string) => {
      replyStreamRef.current?.abort();
      const newMessage: Message = { role: 'user', content: prompt, status: 'pending' };
      addMessage(newMessage);

      return await ollama.chat({
        model,
        messages: [...messages, newMessage],
        stream: true,
      });
    },

    onSuccess: async (stream) => {
      replyStreamRef.current = stream;
      updateLastMessageStatus('success');
      addMessage({ role: 'assistant', content: '', status: 'pending' });

      try {
        for await (const chunk of stream) {
          appendLastMessageContent(chunk.message.content);
        }
        updateLastMessageStatus('success');
      } catch (error: any) {
        updateLastMessageStatus('error');
        if (error?.name !== 'AbortError') throw error;
      }
    },

    onError: () => {
      updateLastMessageStatus('error');
    },
  });

  useEffect(() => {
    const chatMessages = chatMessagesRef.current;
    if (!chatMessages) return;

    chatMessages.scrollTo({
      top: chatMessages.scrollHeight,
      behavior: 'smooth',
    });
  }, [lastMessage?.role]);

  const handleSend = () => {
    generateReply(prompt);
    setPrompt('');
  };

  const handleStop = () => replyStreamRef.current?.abort();

  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <ChatHeader model={model} onClear={clearMessages} />
        <ChatMessages ref={chatMessagesRef} messages={messages} />

        <ChatBottomBar
          prompt={prompt}
          setPrompt={setPrompt}
          mode={
            lastMessage?.role === 'user' && lastMessage?.status === 'pending'
              ? 'waiting'
              : lastMessage?.role === 'assistant' && lastMessage?.status === 'pending'
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
