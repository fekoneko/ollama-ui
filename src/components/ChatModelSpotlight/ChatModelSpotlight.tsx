import { Button, Skeleton } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { Dispatch, FC, SetStateAction, useLayoutEffect, useState } from 'react';
import ollama from 'ollama';
import { IconChevronDown, IconSearch } from '@tabler/icons-react';
import styles from './ChatModelSpotlight.module.css';
import { spotlight, Spotlight } from '@mantine/spotlight';
import { useSpotlightActions } from '@/hooks/useSpotlightActions';

export interface ChatModelSpotlightProps {
  model: string | undefined;
  setModel: Dispatch<SetStateAction<string | undefined>>;
  disabled?: boolean;
}

export const ChatModelSpotlight: FC<ChatModelSpotlightProps> = ({ model, setModel, disabled }) => {
  const [search, setSearch] = useState('');

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

  const actions = useSpotlightActions(localModels, setModel, search);

  if (isLoading) return <Skeleton className={styles.loadingSkeleton} />;

  if (isError)
    return (
      <p className={styles.error} aria-invalid="true">
        Failed to load models
      </p>
    );

  return (
    <>
      <Button
        onClick={spotlight.open}
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
        onQueryChange={(query) => setSearch(query)}
        highlightQuery
        searchProps={{
          leftSection: <IconSearch size={18} />,
          placeholder: 'Type to find download a model...',
        }}
      />
    </>
  );
};
