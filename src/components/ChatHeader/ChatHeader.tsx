import { ActionIcon } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { Dispatch, FC, SetStateAction } from 'react';
import styles from './ChatHeader.module.css';
import { ModelSelector } from '@/components/ModelSelector';

export interface ChatHeaderProps {
  model: string | undefined;
  setModel: Dispatch<SetStateAction<string | undefined>>;
  onClear: () => void;
  modelSelectionDisabled?: boolean;
}

export const ChatHeader: FC<ChatHeaderProps> = ({
  model,
  setModel,
  onClear,
  modelSelectionDisabled,
}) => (
  <header className={styles.chatHeader}>
    <div className={styles.leftSection}>
      <h1 role="banner" className={styles.siteTitle}>
        Ollama UI
      </h1>

      <p className={styles.separator}>/</p>

      <ModelSelector
        model={model}
        setModel={setModel}
        modelSelectionDisabled={modelSelectionDisabled}
      />
    </div>

    <ActionIcon
      onClick={onClear}
      variant="subtle"
      title="Clear chat"
      className={styles.clearButton}
    >
      <IconTrash />
    </ActionIcon>
  </header>
);
