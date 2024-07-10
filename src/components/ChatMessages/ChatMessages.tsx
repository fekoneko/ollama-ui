import { forwardRef } from 'react';
import styles from './ChatMessages.module.css';
import { Message } from '@/types/chat';
import { ChatMessage } from '@/components/ChatMessage/ChatMessage';

export interface ChatMessagesProps {
  messages: Message[];
}

export const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(({ messages }, ref) => (
  <div ref={ref} className={styles.messagesWrapper}>
    <div className={styles.messagesContainer}>
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
    </div>
  </div>
));
