import { Button, Skeleton } from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import ollama from 'ollama';
import { IconChevronDown, IconSearch } from '@tabler/icons-react';
import styles from './ChatModelSpotlight.module.css';
import { spotlight, Spotlight } from '@mantine/spotlight';
import { useSpotlightActions } from '@/hooks/useSpotlightActions';
import { Abortable } from '@/types/abortable';
import { ChatModelPullProgress } from '@/components/ChatModelPullProgress';
import { PullProgress } from '@/types/pull-progress';

export interface ChatModelSpotlightProps {
  model: string | undefined;
  setModel: Dispatch<SetStateAction<string | undefined>>;
  disabled?: boolean;
}

export const ChatModelSpotlight: FC<ChatModelSpotlightProps> = ({
  model: selectedModel,
  setModel,
  disabled,
}) => {
  const [search, setSearch] = useState('');
  const [pullProgress, setPullProgress] = useState<PullProgress>();
  const pullStreamRef = useRef<Abortable>();
  const queryClient = useQueryClient();

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
    if (!localModels?.length || (selectedModel && localModels.includes(selectedModel))) return;

    setModel(localModels[0]);
  }, [localModels, selectedModel, setModel]);

  const { mutate: pullModel } = useMutation({
    mutationKey: ['pull-model', search],
    mutationFn: async () => {
      if (pullProgress) throw new Error('Model is already pulling');
      setPullProgress({ model: search, percent: 0 });

      return await ollama.pull({ model: search, stream: true });
    },

    onSuccess: async (stream) => {
      pullStreamRef.current = stream;

      try {
        for await (const chunk of stream) {
          const newPercent = Math.round((chunk.completed / chunk.total) * 100);
          setPullProgress((prev) => ({
            ...prev!,
            percent: isNaN(newPercent) ? prev!.percent : newPercent,
          }));
        }

        queryClient.invalidateQueries({ queryKey: ['get-local-models'] });
      } catch (error: any) {
        if (error?.name !== 'AbortError') throw error;
      } finally {
        setPullProgress(undefined);
      }
    },
  });

  useEffect(() => {
    if (pullProgress) window.onbeforeunload = () => 'Are you sure you want to cancel the download?';
    else window.onbeforeunload = null;
  }, [pullProgress]);

  const abortModelPull = useCallback(() => pullStreamRef.current?.abort(), []);

  const actions = useSpotlightActions(
    localModels,
    search,
    setModel,
    spotlight.close,
    pullModel,
    abortModelPull,
    pullProgress,
  );

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
        <h2 className={styles.modelName}>{selectedModel ?? 'Model not selected'}</h2>
        <IconChevronDown size={22} />
      </Button>

      {pullProgress && (
        <ChatModelPullProgress pullProgress={pullProgress} abortModelPull={abortModelPull} />
      )}

      <Spotlight
        actions={actions}
        nothingFound="Nothing found..."
        onQueryChange={(query) => setSearch(query)}
        closeOnActionTrigger={false}
        highlightQuery
        searchProps={{
          leftSection: <IconSearch size={18} />,
          placeholder: 'Type to find or download a model...',
        }}
      />
    </>
  );
};
