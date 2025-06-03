import { ChatPage } from "@/features/chat/ui/Chat";
import { AppShell } from "@mantine/core";
import { FC, PropsWithChildren } from "react";
import classes from "./Layout.module.css";

export const Layout: FC<PropsWithChildren> = () => (
  <AppShell>
    <AppShell.Main className={classes.main}>
      <ChatPage />
    </AppShell.Main>
  </AppShell>
);
