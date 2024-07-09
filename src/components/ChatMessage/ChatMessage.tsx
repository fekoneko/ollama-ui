import { MarkdownView } from '@/components/MarkdownView';
import { MessageStatus } from '@/types/chat';
import clsx from 'clsx';
import { FC } from 'react';
import styles from './ChatMessage.module.css';

export interface ChatMessageProps {
  role: 'user' | 'assistant';
  status: MessageStatus;
  children?: string;
}

export const ChatMessage: FC<ChatMessageProps> = ({ role, status, children }) => (
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
