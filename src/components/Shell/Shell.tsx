import { AppShell } from "@mantine/core";
import { FC, PropsWithChildren } from "react";
import classes from "./Shell.module.css";

export const Shell: FC<PropsWithChildren> = ({ children }) => (
  <AppShell>
    <AppShell.Main className={classes.main}>{children}</AppShell.Main>
  </AppShell>
);
