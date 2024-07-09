import { MarkdownView } from '@/components/MarkdownView';
import { MessageStatus } from '@/types/chat';
import clsx from 'clsx';
import { FC } from 'react';
import styles from './ChatMessage.module.css';

export interface ChatMessageProps {
  role: 'user' | 'assistant';
  messageStatus: MessageStatus;
  children?: string;
}

export const ChatMessage: FC<ChatMessageProps> = ({ role, messageStatus, children }) => (
  <div
    className={clsx(
      styles.messageBox,
      role === 'user' && styles.user,
      role === 'assistant' && styles.assistant,
      messageStatus === 'waiting' && styles.waiting,
      messageStatus === 'error' && styles.error,
    )}
  >
    <MarkdownView withTyping={messageStatus === 'streaming'}>{children}</MarkdownView>
  </div>
);
