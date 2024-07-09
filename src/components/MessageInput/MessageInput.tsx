import { Button, CloseButton, TextInput } from '@mantine/core';
import { IconCancel, IconSend2 } from '@tabler/icons-react';
import { FC } from 'react';
import styles from './MessageInput.module.css';

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  mode: 'send' | 'cancel';
  onSend?: () => void;
  onCancel?: () => void;
  disabled?: boolean;
}

export const MessageInput: FC<MessageInputProps> = ({
  message,
  setMessage,
  mode,
  onSend,
  onCancel,
  disabled,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disabled) return;

    if (mode === 'send') onSend?.();
    else onCancel?.();
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
        disabled={disabled || (!message && mode === 'send')}
        classNames={{ root: styles.submitButtonRoot, label: styles.submitButtonLabel }}
      >
        {mode === 'send' && <IconSend2 className={styles.submitIcon} />}
        {mode === 'cancel' && <IconCancel className={styles.submitIcon} />}
      </Button>
    </form>
  );
};
