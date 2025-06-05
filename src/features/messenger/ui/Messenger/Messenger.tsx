import { Chat } from "@/features/chat/ui/Chat";
import { MessengerProvider } from "@/features/messenger/providers/MessengerProvider";
import { ChatList } from "@/features/messenger/ui/ChatList";
import { AppShell } from "@mantine/core";
import { FC, PropsWithChildren, useState } from "react";
import classes from "./Messenger.module.css";

export const Messenger: FC<PropsWithChildren> = () => {
  const [chatId, setChatId] = useState<string | null>(null);

  return (
    <MessengerProvider selectedChatId={chatId} selectChat={setChatId}>
      <AppShell navbar={{ width: "max(18rem, 20%)", breakpoint: "sm" }}>
        <AppShell.Navbar className={classes.navbar} bg="dark.7">
          <ChatList />
        </AppShell.Navbar>

        <AppShell.Main className={classes.main} bg="dark.8">
          <Chat />
        </AppShell.Main>
      </AppShell>
    </MessengerProvider>
  );
};
