import { ChatData } from "@/features/chat/types/chat-data";
import { withStopPropagation } from "@/utils/events";
import { ActionIcon, Button } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import classes from "./ChatListItem.module.css";

export interface ChatListItemProps {
  chat: ChatData;
  isSelected?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
}

export const ChatListItem: FC<ChatListItemProps> = ({
  chat,
  isSelected,
  onSelect,
  onRemove,
}) => {
  const { t } = useTranslation();

  return (
    <Button
      variant="subtle"
      rightSection={
        <ActionIcon
          component="span"
          size="sm"
          variant="subtle"
          color="gray"
          onClick={withStopPropagation(onRemove)}
        >
          <IconTrash title={t("remove-chat")} />
        </ActionIcon>
      }
      onClick={onSelect}
      classNames={{ root: classes.root, inner: classes.inner, section: classes.section }}
      data-selected={isSelected}
    >
      {chat.model ?? t("new-chat")}
    </Button>
  );
};
