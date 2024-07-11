import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { CloseButton, Progress } from '@mantine/core';
import { FC } from 'react';
import styles from './ChatModelPullProgress.module.css';
import { PullProgress } from '@/types/pull-progress';

export interface ChatModelPullProgressProps {
  pullProgress: PullProgress;
  abortModelPull: () => void;
}

export const ChatModelPullProgress: FC<ChatModelPullProgressProps> = ({
  pullProgress,
  abortModelPull,
}) => {
  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressInner}>
        <p>
          <LoadingSpinner size={16} />
          Downloading '{pullProgress.model}' ({pullProgress.percent}%)
        </p>
        <Progress value={pullProgress.percent} />
      </div>
      <CloseButton onClick={abortModelPull} />
    </div>
  );
};
