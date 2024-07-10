import { ChatPage } from '@/pages/ChatPage';
import { FC } from 'react';
import { AppShell } from '@mantine/core';
import styles from './App.module.css';

export const App: FC = () => {
  return (
    <AppShell>
      <AppShell.Main className={styles.main}>
        <ChatPage />
      </AppShell.Main>
    </AppShell>
  );
};
