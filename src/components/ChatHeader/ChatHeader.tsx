import { Button } from '@mantine/core';
import { IconSparkles, IconTrash } from '@tabler/icons-react';
import { FC } from 'react';
import styles from './ChatHeader.module.css';

export interface ChatHeaderProps {
  model: string;
  onClear: () => void;
}

export const ChatHeader: FC<ChatHeaderProps> = ({ model, onClear }) => (
  <header className={styles.chatHeader}>
    <div className={styles.leftSection}>
      <h1 role="banner" className={styles.siteTitle}>
        Ollama UI
      </h1>

      <p className={styles.separator}>/</p>

      <div className={styles.modelNameContainer}>
        <i className={styles.sparkles}>
          <IconSparkles />
        </i>
        <h2 className={styles.modelName}>{model}</h2>
      </div>
    </div>

    <Button onClick={onClear} variant="subtle" title="Clear chat" className={styles.clearButton}>
      <IconTrash />
    </Button>
  </header>
);
