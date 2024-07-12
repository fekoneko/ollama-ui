import { ActionIcon, CloseButton, TextInput } from '@mantine/core';
import { IconPlayerStop, IconSend2 } from '@tabler/icons-react';
import { FC } from 'react';
import styles from './ChatBottomBar.module.css';
import clsx from 'clsx';
import { Message } from '@/types/chat';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';

interface ChatBottomBarProps {
  prompt: string;
  setPrompt: (message: string) => void;
  lastMessage?: Message;
  onSend?: () => void;
  onStop?: () => void;
  disabled?: boolean;
}

export const ChatBottomBar: FC<ChatBottomBarProps> = ({
  prompt,
  setPrompt,
  lastMessage,
  onSend,
  onStop,
  disabled,
}) => {
  const isLoading = lastMessage?.role === 'user' && lastMessage?.status === 'pending';
  const isActionStop = lastMessage?.role === 'assistant' && lastMessage?.status === 'pending';
  const isActionSend = !isLoading && !isActionStop;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isActionSend) onSend?.();
    else if (isActionStop) onStop?.();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <TextInput
        placeholder="Enter your message..."
        autoFocus
        autoComplete="off"
        value={prompt}
        disabled={disabled}
        onChange={(e) => setPrompt(e.currentTarget.value)}
        rightSection={
          prompt.length > 0 && (
            <CloseButton onClick={() => setPrompt('')} className={styles.clearButton} />
          )
        }
        classNames={{
          root: styles.inputRoot,
          input: styles.input,
          section: styles.inputRightSection,
        }}
      />

      <ActionIcon
        type="submit"
        disabled={disabled || isLoading || (prompt.length === 0 && isActionSend)}
        classNames={{ root: styles.submitButtonRoot }}
      >
        {isActionSend && <IconSend2 className={styles.submitIcon} title="Send message" />}
        {isActionStop && <IconPlayerStop className={styles.submitIcon} title="Cancel generation" />}
        {isLoading && (
          <LoadingSpinner className={clsx(styles.submitIcon)} title="Waiting for response..." />
        )}
      </ActionIcon>
    </form>
  );
};
