import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { FC } from "react";

export const ThemeToggle: FC = () => {
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
    >
      {colorScheme === "light" ? <IconSun /> : <IconMoon />}
    </ActionIcon>
  );
};
