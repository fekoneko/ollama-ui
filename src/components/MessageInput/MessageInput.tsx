import { Button, CloseButton, TextInput } from '@mantine/core';
import { IconSend2 } from '@tabler/icons-react';
import { FC } from 'react';
import styles from './MessageInput.module.css';

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const MessageInput: FC<MessageInputProps> = ({ message, setMessage, onSend, disabled }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSend(message);
    setMessage('');
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
        disabled={disabled || !message}
        classNames={{ root: styles.sendButtonRoot, label: styles.sendButtonLabel }}
      >
        <p>Send</p>
        <IconSend2 className={styles.sendIcon} />
      </Button>
    </form>
  );
};
