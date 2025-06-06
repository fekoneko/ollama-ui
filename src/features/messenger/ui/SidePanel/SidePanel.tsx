import { ChatList } from "@/features/messenger/ui/ChatList";
import { ThemeToggle } from "@/features/messenger/ui/ThemeToggle";
import { FC } from "react";
import classes from "./SidePanel.module.css";

export const SidePanel: FC = () => (
  <div className={classes.sidePanel}>
    <div className={classes.titleContainer}>
      <h1 role="banner" className={classes.title}>
        Ollama UI
      </h1>
    </div>

    <ChatList />

    <div className={classes.settingsContainer}>
      <ThemeToggle />
    </div>
  </div>
);
