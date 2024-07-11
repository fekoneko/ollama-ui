import { Button, Skeleton } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { Dispatch, FC, SetStateAction, useLayoutEffect } from 'react';
import ollama from 'ollama';
import { IconChevronDown, IconCloudOff, IconSearch } from '@tabler/icons-react';
import styles from './ChatModelSpotlight.module.css';
import { spotlight, Spotlight, SpotlightActionData } from '@mantine/spotlight';

export interface ChatModelSpotlightProps {
  model: string | undefined;
  setModel: Dispatch<SetStateAction<string | undefined>>;
  disabled?: boolean;
}

export const ChatModelSpotlight: FC<ChatModelSpotlightProps> = ({ model, setModel, disabled }) => {
  const {
    data: localModels,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['get-local-models'],
    queryFn: async () => {
      const response = await ollama.list();

      return response.models.map((model) => model.name);
    },
  });

  useLayoutEffect(() => {
    if (!localModels?.length || (model && localModels.includes(model))) return;

    setModel(localModels[0]);
  }, [localModels, model, setModel]);

  if (isLoading) return <Skeleton className={styles.loadingSkeleton} />;

  if (isError)
    return (
      <p className={styles.error} aria-invalid="true">
        Failed to load models
      </p>
    );

  const actions: SpotlightActionData[] =
    localModels?.map((model) => ({
      id: model,
      label: model,
      leftSection: <IconCloudOff />,
      rightSection: <p className={styles.spotlightRightSection}>Local model</p>,
      onClick: () => setModel(model),
    })) ?? [];

  return (
    <>
      <Button
        onClick={() => spotlight.open()}
        variant="subtle"
        className={styles.selectModelButton}
        disabled={disabled}
      >
        <h2 className={styles.modelName}>{model ?? 'Model not selected'}</h2>
        <IconChevronDown size={22} />
      </Button>

      <Spotlight
        actions={actions}
        nothingFound="Nothing found..."
        highlightQuery
        searchProps={{
          leftSection: <IconSearch />,
          placeholder: 'Search models...',
        }}
      />
    </>
  );
};
