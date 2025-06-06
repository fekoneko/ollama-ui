import { ActionIcon, Text } from "@mantine/core";
import { FC } from "react";
import { useTranslation } from "react-i18next";

const LANGS = ["en", "ru", "ja"];

export const LanguageToggle: FC = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const language = LANGS[(LANGS.indexOf(i18n.language || "en") + 1) % LANGS.length];
    i18n.changeLanguage(language);
  };

  return (
    <ActionIcon
      variant="subtle"
      color="gray.7"
      size="lg"
      radius="md"
      onClick={toggleLanguage}
      title={t("change-language")}
    >
      <Text size="sm" fw="bold">
        {i18n.language}
      </Text>
    </ActionIcon>
  );
};
