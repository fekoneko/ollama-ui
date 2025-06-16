import { MessengerProvider } from "@/features/messenger/providers/MessengerProvider";
import { Messenger } from "@/features/messenger/ui/Messenger";
import { i18n } from "@/lib/i18next";
import { SHIKI_LANGUAGES } from "@/lib/shiki";
import { theme } from "@/theme";
import {
  CodeHighlightAdapterProvider,
  createShikiAdapter,
} from "@mantine/code-highlight";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC } from "react";
import { I18nextProvider } from "react-i18next";

const queryClient = new QueryClient();

async function loadShiki() {
  const { createHighlighter } = await import("shiki");
  const shiki = await createHighlighter({
    langs: SHIKI_LANGUAGES,
    themes: [],
  });

  return shiki;
}

const shikiAdapter = createShikiAdapter(loadShiki);

export const App: FC = () => (
  <QueryClientProvider client={queryClient}>
    <MantineProvider defaultColorScheme="auto" theme={theme}>
      <CodeHighlightAdapterProvider adapter={shikiAdapter}>
        <I18nextProvider i18n={i18n}>
          <MessengerProvider>
            <Messenger />
          </MessengerProvider>
        </I18nextProvider>
      </CodeHighlightAdapterProvider>
    </MantineProvider>
  </QueryClientProvider>
);
