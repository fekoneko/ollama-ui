import { PromptModePage } from '@/pages/PromptModePage';
import { FC } from 'react';
import { AppShell, Title } from '@mantine/core';
import styles from './App.module.css';

export const App: FC = () => {
  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header className={styles.header}>
        <Title>Ollama UI</Title>
      </AppShell.Header>

      <AppShell.Main className={styles.main}>
        <PromptModePage />
      </AppShell.Main>
    </AppShell>
  );
};
