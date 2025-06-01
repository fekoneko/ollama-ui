import { AppShell } from "@mantine/core";
import { FC, PropsWithChildren } from "react";
import styles from "./Shell.module.css";

export const Shell: FC<PropsWithChildren> = ({ children }) => (
  <AppShell>
    <AppShell.Main className={styles.main}>{children}</AppShell.Main>
  </AppShell>
);
