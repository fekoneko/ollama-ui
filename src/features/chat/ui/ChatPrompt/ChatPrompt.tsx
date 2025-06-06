import { Message } from "@/features/chat/types/message";
import { LoadingSpinner } from "@/ui/LoadingSpinner/LoadingSpinner";
import { ActionIcon, CloseButton, TextInput } from "@mantine/core";
import { IconPlayerStop, IconSend2 } from "@tabler/icons-react";
import clsx from "clsx";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import classes from "./ChatPrompt.module.css";

interface ChatPromptProps {
  prompt: string;
  setPrompt: (message: string) => void;
  lastMessage?: Message | null;
  onSend?: () => void;
  onStop?: () => void;
  disabled?: boolean;
}

export const ChatPrompt: FC<ChatPromptProps> = ({
  prompt,
  setPrompt,
  lastMessage,
  onSend,
  onStop,
  disabled,
}) => {
  const { t } = useTranslation();
  const isLoading = lastMessage?.role === "user" && lastMessage?.status === "pending";
  const isActionStop =
    lastMessage?.role === "assistant" && lastMessage?.status === "pending";
  const isActionSend = !isLoading && !isActionStop;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isActionSend) onSend?.();
    else if (isActionStop) onStop?.();
  };

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <TextInput
        placeholder={t("enter-message")}
        autoFocus
        autoComplete="off"
        value={prompt}
        disabled={disabled}
        onChange={(e) => setPrompt(e.currentTarget.value)}
        rightSection={
          prompt.length > 0 && (
            <CloseButton onClick={() => setPrompt("")} className={classes.clearButton} />
          )
        }
        classNames={{
          root: classes.inputRoot,
          input: classes.input,
          section: classes.inputRightSection,
        }}
      />

      <ActionIcon
        type="submit"
        disabled={disabled || isLoading || (prompt.length === 0 && isActionSend)}
        classNames={{ root: classes.submitButtonRoot }}
      >
        {isActionSend && (
          <IconSend2 className={classes.submitIcon} title={t("send-message")} />
        )}
        {isActionStop && (
          <IconPlayerStop className={classes.submitIcon} title={t("cancel-generation")} />
        )}
        {isLoading && (
          <LoadingSpinner
            className={clsx(classes.submitIcon)}
            title={t("waiting-for-response")}
          />
        )}
      </ActionIcon>
    </form>
  );
};
