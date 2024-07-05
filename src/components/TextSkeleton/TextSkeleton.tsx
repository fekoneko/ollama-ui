import { FC } from 'react';
import { Skeleton } from '@mantine/core';
import styles from './TextSkeleton.module.css';

export const TextSkeleton: FC = () => (
  <div className={styles.container}>
    {['40%', '55%', '15%', '70%', '60%'].map((width, index) => (
      <Skeleton key={index} width={width} className={styles.wordSkeleton} />
    ))}
  </div>
);
