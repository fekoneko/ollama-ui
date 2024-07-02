import { FC } from 'react';
import styles from './Header.module.css';

export const Header: FC = () => {
  return (
    <header className={styles['header']}>
      <h1 role="banner">Ollama UI</h1>
    </header>
  );
};
