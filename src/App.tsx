import { MessengerProvider } from "@/features/messenger/providers/MessengerProvider";
import { Messenger } from "@/features/messenger/ui/Messenger";
import { FC } from "react";

export const App: FC = () => (
  <MessengerProvider>
    <Messenger />
  </MessengerProvider>
);
