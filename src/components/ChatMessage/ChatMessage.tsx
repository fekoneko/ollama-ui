import { MarkdownView } from '@/components/MarkdownView';
import { Message, MessageStatus } from '@/types/chat';
import clsx from 'clsx';
import { FC } from 'react';
import styles from './ChatMessage.module.css';

export interface ChatMessageProps {
  message: Message;
  messageStatus: MessageStatus;
}

export const ChatMessage: FC<ChatMessageProps> = ({ message, messageStatus }) => (
  <div
    className={clsx(styles.messageBox, {
      [styles.user]: message.role === 'user',
      [styles.assistant]: message.role === 'assistant',
      [styles.waiting]: messageStatus === 'waiting',
      [styles.error]: messageStatus === 'error',
    })}
  >
    <MarkdownView withTyping={messageStatus === 'streaming'}>{message.content}</MarkdownView>
  </div>
);
