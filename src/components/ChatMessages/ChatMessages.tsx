import { forwardRef } from 'react';
import styles from './ChatMessages.module.css';
import { Message, MessageStatus } from '@/types/chat';
import { ChatMessage } from '@/components/ChatMessage/ChatMessage';

export interface ChatMessagesProps {
  messages: Message[];
  messageStatus: MessageStatus;
}

export const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(
  ({ messages, messageStatus }, ref) => (
    <div ref={ref} className={styles.messagesWrapper}>
      <div className={styles.messagesContainer}>
        {messages.map((message, index) => {
          const isLastMessage = index === messages.length - 1;

          return (
            <ChatMessage
              key={index}
              role={message.role}
              messageStatus={isLastMessage ? messageStatus : 'success'}
            >
              {message.content}
            </ChatMessage>
          );
        })}
      </div>
    </div>
  ),
);
