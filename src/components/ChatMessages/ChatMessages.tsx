import { MarkdownView } from '@/components/MarkdownView';
import { FC } from 'react';
import styles from './ChatMessages.module.css';
import clsx from 'clsx';
import { Message } from '@/types/chat';

export type MessageStatus = 'waiting' | 'streaming' | 'success' | 'error';

export interface MessageBoxProps {
  role: 'user' | 'assistant';
  status: MessageStatus;
  children?: string;
}

const MessageBox: FC<MessageBoxProps> = ({ role, status, children }) => (
  <div
    className={clsx(
      styles.messageBox,
      role === 'user' && styles.user,
      role === 'assistant' && styles.assistant,
      status === 'waiting' && styles.waiting,
      status === 'error' && styles.error,
    )}
  >
    <MarkdownView withTyping={status === 'streaming'}>{children}</MarkdownView>
  </div>
);

export interface ChatMessagesProps {
  chatHistory: Message[];
  status: MessageStatus;
}

export const ChatMessages: FC<ChatMessagesProps> = ({ chatHistory, status }) => {
  return (
    <div className={styles.messagesContainer}>
      {chatHistory.map((message, index) => {
        const isLastMessage = index === chatHistory.length - 1;

        return (
          <MessageBox key={index} role={message.role} status={isLastMessage ? status : 'success'}>
            {message.content}
          </MessageBox>
        );
      })}
    </div>
  );
};
