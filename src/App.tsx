import { PromptModePage } from '@/pages/PromptModePage';
import { FC } from 'react';
import { AppShell, Burger, NavLink, Title } from '@mantine/core';
import styles from './App.module.css';
import { useDisclosure } from '@mantine/hooks';

export const App: FC = () => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: '30%', breakpoint: 'sm', collapsed: { mobile: !opened } }}
    >
      <AppShell.Header className={styles['header']}>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Title>Ollama UI</Title>
      </AppShell.Header>

      <AppShell.Navbar>
        <NavLink label="Prompt Mode" href="/" leftSection="💬" active />
        <NavLink label="Chat Mode" href="/" leftSection="💬" />
      </AppShell.Navbar>

      <AppShell.Main>
        <PromptModePage />
      </AppShell.Main>
    </AppShell>
  );
};
