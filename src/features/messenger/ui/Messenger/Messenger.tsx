import { Chat } from "@/features/chat/ui/Chat";
import { ChatList } from "@/features/messenger/ui/ChatList";
import { AppShell } from "@mantine/core";
import { FC, PropsWithChildren, useState } from "react";
import classes from "./Messenger.module.css";

export const Messenger: FC<PropsWithChildren> = () => {
  const [chatId, setChatId] = useState<string | null>(null);

  return (
    <AppShell navbar={{ width: "max(18rem, 20%)", breakpoint: "sm" }}>
      <AppShell.Navbar className={classes.navbar}>
        <ChatList chatId={chatId} onSelect={setChatId} />
      </AppShell.Navbar>

      <AppShell.Main className={classes.main}>
        {chatId && <Chat chatId={chatId} />}
      </AppShell.Main>
    </AppShell>
  );
};
