import { FC } from 'react';
import styles from './Typing.module.css';

export const Typing: FC = () => {
  return (
    <i className={styles.container}>
      {Array(3)
        .fill(null)
        .map((_, i) => (
          <span key={i} className={styles.dot} />
        ))}
    </i>
  );
};
