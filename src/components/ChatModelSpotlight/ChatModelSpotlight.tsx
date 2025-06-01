import { ChatModelPullProgress } from "@/components/ChatPullModelProgress";
import { LoadingSpinner } from "@/components/LoadingSpinner/LoadingSpinner";
import { Abortable } from "@/types/abortable";
import { PullProgress } from "@/types/pull-progress";
import { Button, Skeleton } from "@mantine/core";
import {
  closeSpotlight,
  spotlight,
  Spotlight,
  SpotlightActionData,
} from "@mantine/spotlight";
import {
  IconChevronDown,
  IconCloudDownload,
  IconCloudOff,
  IconSearch,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ollama from "ollama";
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./ChatModelSpotlight.module.css";

export interface ChatModelSpotlightProps {
  model: string | undefined;
  setModel: Dispatch<SetStateAction<string | undefined>>;
  disabled?: boolean;
}

export const ChatModelSpotlight: FC<ChatModelSpotlightProps> = ({
  model,
  setModel,
  disabled,
}) => {
  const [search, setSearch] = useState("");
  const [pullProgress, setPullProgress] = useState<PullProgress>();
  const pullStreamRef = useRef<Abortable>(null);
  const queryClient = useQueryClient();

  const {
    data: localModels,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["get-local-models"],
    queryFn: async () => {
      const response = await ollama.list();

      return response.models.map((model) => model.name);
    },
  });

  useLayoutEffect(() => {
    if (!localModels?.length || (model && localModels.includes(model))) return;

    setModel(localModels[0]);
  }, [localModels, model, setModel]);

  const { mutate: pullModel } = useMutation({
    mutationKey: ["pull-model", search],
    mutationFn: async () => {
      if (pullProgress) throw new Error("Model is already pulling");
      setPullProgress({ model: search, percent: 0 });

      return await ollama.pull({ model: search, stream: true });
    },

    onSuccess: async (stream) => {
      pullStreamRef.current = stream;

      try {
        for await (const chunk of stream) {
          if (chunk.completed === undefined || chunk.total === undefined) continue;

          setPullProgress((prev) => ({
            ...prev!,
            percent: Math.round((chunk.completed / chunk.total) * 100),
          }));
        }

        queryClient.invalidateQueries({ queryKey: ["get-local-models"] });
      } catch (error: any) {
        if (error?.name !== "AbortError") throw error;
      } finally {
        setPullProgress(undefined);
      }
    },
  });

  useEffect(() => {
    if (pullProgress)
      window.onbeforeunload = () => "Are you sure you want to cancel the download?";
    else window.onbeforeunload = null;
  }, [pullProgress]);

  const abortModelPull = useCallback(() => pullStreamRef.current?.abort(), []);

  const actions = useMemo(() => {
    const actions: SpotlightActionData[] =
      localModels?.map((model) => ({
        id: model,
        label: model,
        leftSection: <IconCloudOff size={18} />,
        rightSection: <p style={{ fontSize: "0.8rem" }}>Local model</p>,
        onClick: () => {
          setModel(model);
          closeSpotlight();
        },
      })) ?? [];

    if (!pullProgress && search.length > 0 && !localModels?.includes(search))
      actions.push({
        id: "pull-model",
        label: `Download model '${search}'`,
        leftSection: <IconCloudDownload size={18} />,
        rightSection: <p style={{ fontSize: "0.8rem" }}>Remote model</p>,
        onClick: () => pullModel(),
      });

    if (pullProgress)
      actions.push({
        id: "pull-model-progress",
        label: `Downloading model '${pullProgress.model}' (${pullProgress.percent}%)`,
        description: "Select to cancel the download...",
        leftSection: <LoadingSpinner size={18} />,
        rightSection: <p style={{ fontSize: "0.8rem" }}>Remote model</p>,
        onClick: () => abortModelPull(),
      });
    return actions;
  }, [localModels, search, setModel, pullModel, abortModelPull, pullProgress]);

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
        <h2 className={styles.modelName}>{model ?? "Model not selected"}</h2>
        <IconChevronDown size={22} />
      </Button>

      {pullProgress && (
        <ChatModelPullProgress pullProgress={pullProgress} onAbort={abortModelPull} />
      )}

      <Spotlight
        actions={actions}
        nothingFound="Nothing found..."
        query={search}
        onQueryChange={(query) => setSearch(query)}
        closeOnActionTrigger={false}
        highlightQuery
        searchProps={{
          leftSection: <IconSearch size={18} />,
          placeholder: "Type to find or download a model...",
        }}
      />
    </>
  );
};
