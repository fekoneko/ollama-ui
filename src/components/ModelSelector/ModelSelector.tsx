import { Button, Combobox, Skeleton, useCombobox } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { Dispatch, FC, SetStateAction, useLayoutEffect } from 'react';
import ollama from 'ollama';
import { IconChevronDown } from '@tabler/icons-react';
import styles from './ModelSelector.module.css';

export interface ModelSelectorProps {
  model: string | undefined;
  setModel: Dispatch<SetStateAction<string | undefined>>;
  modelSelectionDisabled?: boolean;
}

export const ModelSelector: FC<ModelSelectorProps> = ({
  model,
  setModel,
  modelSelectionDisabled,
}) => {
  const combobox = useCombobox();

  const {
    data: availableModels,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['available-models'],
    queryFn: async () => {
      const response = await ollama.list();
      return response.models.map((model) => model.name);
    },
  });

  useLayoutEffect(() => {
    if (!availableModels?.length || (model && availableModels.includes(model))) return;
    setModel(availableModels[0]);
  }, [availableModels, model, setModel]);

  if (isLoading) return <Skeleton className={styles.loadingSkeleton} />;

  if (isError)
    return (
      <p className={styles.error} aria-invalid="true">
        Failed to load models
      </p>
    );

  return (
    <Combobox
      store={combobox}
      width={250}
      withArrow
      onOptionSubmit={(selectedModel) => {
        if (!modelSelectionDisabled) setModel(selectedModel);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <Button
          onClick={() => combobox.toggleDropdown()}
          variant="subtle"
          className={styles.modelSelector}
          disabled={modelSelectionDisabled}
        >
          <h2 className={styles.modelName}>{model ?? 'Model not selected'}</h2>
          <IconChevronDown size={22} />
        </Button>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {!availableModels?.length && <Combobox.Empty>No models available</Combobox.Empty>}

          {availableModels?.map((model) => (
            <Combobox.Option key={model} value={model}>
              {model}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
