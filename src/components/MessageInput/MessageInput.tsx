import { Button, CloseButton, TextInput } from '@mantine/core';
import { IconCancel, IconLoader2, IconSend2 } from '@tabler/icons-react';
import { FC } from 'react';
import styles from './MessageInput.module.css';
import clsx from 'clsx';

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  mode: 'send' | 'cancel' | 'waiting';
  onSend?: () => void;
  onCancel?: () => void;
}

export const MessageInput: FC<MessageInputProps> = ({
  message,
  setMessage,
  mode,
  onSend,
  onCancel,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === 'send') onSend?.();
    else if (mode === 'cancel') onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <TextInput
        placeholder="Enter your message..."
        autoFocus
        autoComplete="off"
        value={message}
        onChange={(e) => setMessage(e.currentTarget.value)}
        rightSection={
          message && <CloseButton onClick={() => setMessage('')} className={styles.clearButton} />
        }
        classNames={{
          root: styles.inputRoot,
          input: styles.input,
          section: styles.inputRightSection,
        }}
      />

      <Button
        type="submit"
        disabled={mode === 'waiting' || (!message && mode === 'send')}
        classNames={{ root: styles.submitButtonRoot, label: styles.submitButtonLabel }}
      >
        {mode === 'send' && <IconSend2 className={styles.submitIcon} title="Send message" />}
        {mode === 'cancel' && (
          <IconCancel className={styles.submitIcon} title="Cancel generation" />
        )}
        {mode === 'waiting' && (
          <IconLoader2
            className={clsx(styles.submitIcon, styles.loadingSpinner)}
            title="Waiting for response..."
          />
        )}
      </Button>
    </form>
  );
};
