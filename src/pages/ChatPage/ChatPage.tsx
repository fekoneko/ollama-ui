import { useMutation } from '@tanstack/react-query';
import styles from './ChatPage.module.css';
import ollama from 'ollama/browser';
import { FC, useRef, useState } from 'react';
import { MessageInput } from '@/components/MessageInput';
import { ChatMessages, MessageStatus } from '@/components/ChatMessages';
import { useChatHistory } from '@/hooks/useChatHistory';
import { Message } from '@/types/chat';

interface Abortable {
  abort: () => void;
}

export const ChatPage: FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [reply, setReply] = useState<string>();
  const replyStreamRef = useRef<Abortable>();
  const { chatHistory, pushToChatHistory } = useChatHistory();

  const {
    mutate: generateReply,
    isPending,
    isSuccess,
  } = useMutation({
    mutationKey: ['generate'],
    mutationFn: async (messages: Message[]) =>
      await ollama.chat({ model: 'llama3', messages, stream: true }),

    onMutate: () => {
      setReply(undefined);
      replyStreamRef.current?.abort();
    },

    onSuccess: async (stream) => {
      replyStreamRef.current = stream;
      let currentReply = '';

      try {
        for await (const chunk of stream) {
          currentReply += chunk.message.content;
          setReply(currentReply);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') throw error;
      }

      pushToChatHistory({ role: 'assistant', content: currentReply });
    },
  });

  const handleSend = () => {
    if (status === 'waiting') return;
    const newChatHistory = pushToChatHistory({ role: 'user', content: inputMessage });
    generateReply(newChatHistory);
  };

  const status: MessageStatus =
    isPending && reply === undefined
      ? 'waiting'
      : isPending && reply !== undefined
        ? 'streaming'
        : isSuccess
          ? 'success'
          : 'error';

  return (
    <div className={styles.page}>
      <ChatMessages
        chatHistory={
          status === 'streaming'
            ? [...chatHistory, { role: 'assistant', content: reply ?? '' }]
            : chatHistory
        }
        status={status}
      />

      <MessageInput
        message={inputMessage}
        setMessage={setInputMessage}
        onSend={handleSend}
        disabled={status === 'waiting'}
      />
    </div>
  );
};
