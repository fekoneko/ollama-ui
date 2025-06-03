import { PullProgress } from "@/features/chat/types/pull-progress";
import { LoadingSpinner } from "@/ui/LoadingSpinner/LoadingSpinner";
import { CloseButton, Progress } from "@mantine/core";
import { FC } from "react";
import classes from "./ChatPullModelProgress.module.css";

export interface ChatPullModelProgressProps {
  pullProgress: PullProgress;
  onAbort: () => void;
}

export const ChatModelPullProgress: FC<ChatPullModelProgressProps> = ({
  pullProgress,
  onAbort,
}) => (
  <div className={classes.progressContainer}>
    <div className={classes.progressInner}>
      <p>
        <LoadingSpinner size={16} />
        Downloading '{pullProgress.model}' ({pullProgress.percent}%)
      </p>
      <Progress value={pullProgress.percent} />
    </div>
    <CloseButton onClick={onAbort} />
  </div>
);
