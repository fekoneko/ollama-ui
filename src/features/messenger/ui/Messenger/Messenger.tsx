import { Chat } from "@/features/chat/ui/Chat";
import { useChats } from "@/features/messenger/hooks/use-chats";
import { SidePanel } from "@/features/messenger/ui/SidePanel";
import { AppShell } from "@mantine/core";
import { FC, PropsWithChildren } from "react";
import classes from "./Messenger.module.css";

export const Messenger: FC<PropsWithChildren> = () => {
  const { chats } = useChats();

  return (
    <AppShell navbar={{ width: "max(18rem, 20%)", breakpoint: "sm" }}>
      <AppShell.Navbar className={classes.sidebar}>
        <SidePanel />
      </AppShell.Navbar>

      <AppShell.Main className={classes.main}>
        {chats.map((chat) => (
          <Chat key={chat.id} chatId={chat.id} />
        ))}
      </AppShell.Main>
    </AppShell>
  );
};
