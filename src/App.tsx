import { Header } from '@/components/layout/Header';
import { PromptModePage } from '@/pages/PromptModePage';
import { FC } from 'react';
import styles from './App.module.css';

export const App: FC = () => {
  return (
    <div className={styles['app']}>
      <Header />
      <PromptModePage />
    </div>
  );
};
