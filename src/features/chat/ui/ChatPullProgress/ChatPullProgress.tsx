import { PullProgress } from "@/features/chat/types/pull-progress";
import { LoadingSpinner } from "@/ui/LoadingSpinner/LoadingSpinner";
import { CloseButton, Progress } from "@mantine/core";
import { FC } from "react";
import classes from "./ChatPullProgress.module.css";

export interface ChatPullProgressProps {
  pullProgress: PullProgress;
  onAbort: () => void;
}

export const ChatPullProgress: FC<ChatPullProgressProps> = ({
  pullProgress,
  onAbort,
}) => (
  <div className={classes.progressContainer}>
    <div className={classes.progressInner}>
      <p>
        <LoadingSpinner size={16} />
        Downloading '{pullProgress.model}' ({pullProgress.percent}%)
      </p>
      <Progress value={pullProgress.percent} color="gray.6" />
    </div>
    <CloseButton onClick={onAbort} />
  </div>
);
