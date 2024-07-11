import { Button, Combobox, Skeleton, useCombobox } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { Dispatch, FC, SetStateAction, useLayoutEffect } from 'react';
import ollama from 'ollama';
import { IconChevronDown } from '@tabler/icons-react';
import styles from './ChatModelCombobox.module.css';

export interface ChatModelComboboxProps {
  model: string | undefined;
  setModel: Dispatch<SetStateAction<string | undefined>>;
  disabled?: boolean;
}

export const ChatModelCombobox: FC<ChatModelComboboxProps> = ({ model, setModel, disabled }) => {
  const combobox = useCombobox();

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

  return (
    <Combobox
      store={combobox}
      width={250}
      withArrow
      onOptionSubmit={(selectedModel) => {
        if (!disabled) setModel(selectedModel);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <Button
          onClick={() => combobox.toggleDropdown()}
          variant="subtle"
          className={styles.modelSelector}
          disabled={disabled}
        >
          <h2 className={styles.modelName}>{model ?? 'Model not selected'}</h2>
          <IconChevronDown size={22} />
        </Button>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {!localModels?.length && <Combobox.Empty>No models available</Combobox.Empty>}

          {localModels?.map((model) => (
            <Combobox.Option key={model} value={model}>
              {model}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
