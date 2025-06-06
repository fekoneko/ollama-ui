import { MessengerProvider } from "@/features/messenger/providers/MessengerProvider";
import { Messenger } from "@/features/messenger/ui/Messenger";
import { theme } from "@/theme";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC } from "react";

const queryClient = new QueryClient();

export const App: FC = () => (
  <QueryClientProvider client={queryClient}>
    <MantineProvider defaultColorScheme="auto" theme={theme}>
      <MessengerProvider>
        <Messenger />
      </MessengerProvider>
    </MantineProvider>
  </QueryClientProvider>
);
