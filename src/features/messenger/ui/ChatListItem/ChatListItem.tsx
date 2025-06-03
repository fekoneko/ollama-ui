import { ChatData } from "@/features/chat/types/chat-data";
import { withStopPropagation } from "@/utils/events";
import { Button } from "@mantine/core";
import { FC } from "react";
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
}) => (
  <Button
    rightSection={<span onClick={withStopPropagation(onRemove)}>Remove</span>}
    onClick={onSelect}
    classNames={{ root: classes.root, section: classes.section }}
    data-selected={isSelected}
  >
    {chat.model} ({chat.id})
  </Button>
);
