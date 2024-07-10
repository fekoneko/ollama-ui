import { Button, CloseButton, TextInput } from '@mantine/core';
import { IconLoader2, IconPlayerStop, IconSend2 } from '@tabler/icons-react';
import { FC } from 'react';
import styles from './ChatBottomBar.module.css';
import clsx from 'clsx';

interface ChatBottomBarProps {
  prompt: string;
  setPrompt: (message: string) => void;
  mode: 'send' | 'stop' | 'waiting';
  onSend?: () => void;
  onStop?: () => void;
}

export const ChatBottomBar: FC<ChatBottomBarProps> = ({
  prompt,
  setPrompt,
  mode,
  onSend,
  onStop,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === 'send') onSend?.();
    else if (mode === 'stop') onStop?.();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <TextInput
        placeholder="Enter your message..."
        autoFocus
        autoComplete="off"
        value={prompt}
        onChange={(e) => setPrompt(e.currentTarget.value)}
        rightSection={
          prompt && <CloseButton onClick={() => setPrompt('')} className={styles.clearButton} />
        }
        classNames={{
          root: styles.inputRoot,
          input: styles.input,
          section: styles.inputRightSection,
        }}
      />

      <Button
        type="submit"
        disabled={mode === 'waiting' || (!prompt && mode === 'send')}
        classNames={{ root: styles.submitButtonRoot, label: styles.submitButtonLabel }}
      >
        {mode === 'send' && <IconSend2 className={styles.submitIcon} title="Send message" />}
        {mode === 'stop' && (
          <IconPlayerStop className={styles.submitIcon} title="Cancel generation" />
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
