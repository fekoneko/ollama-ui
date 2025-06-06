import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { FC } from "react";
import { useTranslation } from "react-i18next";

export const ThemeToggle: FC = () => {
  const { t } = useTranslation();
  const preferredColorscheme = useColorScheme();
  const { colorScheme: mantineColorScheme, setColorScheme } = useMantineColorScheme();

  const colorScheme =
    mantineColorScheme === "auto" ? preferredColorscheme : mantineColorScheme;

  const toggleColorScheme = () =>
    setColorScheme(colorScheme === "light" ? "dark" : "light");

  return (
    <ActionIcon
      variant="subtle"
      color="gray.7"
      size="lg"
      radius="md"
      onClick={toggleColorScheme}
      title={t("toggle-theme")}
    >
      {colorScheme === "light" ? <IconSun /> : <IconMoon />}
    </ActionIcon>
  );
};
