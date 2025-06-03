import { ChatModelPicker } from "@/features/chat/ui/ChatModelPicker";
import { ActionIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { Dispatch, FC, SetStateAction } from "react";
import classes from "./ChatHeader.module.css";

export interface ChatHeaderProps {
  model: string | undefined;
  setModel: Dispatch<SetStateAction<string | undefined>>;
  onClear: () => void;
  disabledSelectModel?: boolean;
}

export const ChatHeader: FC<ChatHeaderProps> = ({
  model,
  setModel,
  onClear,
  disabledSelectModel,
}) => (
  <header className={classes.chatHeader}>
    <div className={classes.leftSection}>
      <h1 role="banner" className={classes.siteTitle}>
        Ollama UI
      </h1>

      <p className={classes.separator}>/</p>

      <ChatModelPicker model={model} setModel={setModel} disabled={disabledSelectModel} />
    </div>

    <ActionIcon
      onClick={onClear}
      variant="subtle"
      title="Clear chat"
      className={classes.clearButton}
    >
      <IconTrash />
    </ActionIcon>
  </header>
);
