import { FC } from 'react';
import styles from './TypingAnimation.module.css';

export const TypingAnimation: FC = () => {
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
