import { FC, RefObject } from 'react';
import styles from './ChatMessages.module.css';
import { Message, MessageStatus } from '@/types/chat';
import { ChatMessage } from '@/components/ChatMessage/ChatMessage';

export interface ChatMessagesProps {
  chatHistory: Message[];
  status: MessageStatus;
  scrollContainerRef?: RefObject<HTMLDivElement>;
}

export const ChatMessages: FC<ChatMessagesProps> = ({
  chatHistory,
  status,
  scrollContainerRef,
}) => (
  <div ref={scrollContainerRef} className={styles.messagesWrapper}>
    <div className={styles.messagesContainer}>
      {chatHistory.map((message, index) => {
        const isLastMessage = index === chatHistory.length - 1;

        return (
          <ChatMessage key={index} role={message.role} status={isLastMessage ? status : 'success'}>
            {message.content}
          </ChatMessage>
        );
      })}
    </div>
  </div>
);
