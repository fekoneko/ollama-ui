import { PullProgress } from '@/components/ChatModelSpotlight';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { SpotlightActionData } from '@mantine/spotlight';
import { IconCloudDownload, IconCloudOff } from '@tabler/icons-react';
import { useMemo } from 'react';

export const useSpotlightActions = (
  localModels: string[] | undefined,
  search: string,
  setModel: (model: string) => void,
  closeSpotlight: () => void,
  pullModel: () => void,
  abortModelPull: () => void,
  pullProgress: PullProgress | undefined,
) => {
  const actions = useMemo(() => {
    const actions: SpotlightActionData[] =
      localModels?.map((model) => ({
        id: model,
        label: model,
        leftSection: <IconCloudOff size={18} />,
        rightSection: <p style={{ fontSize: '0.8rem' }}>Local model</p>,
        onClick: () => {
          setModel(model);
          closeSpotlight();
        },
      })) ?? [];

    if (!pullProgress && search.length > 0 && !localModels?.includes(search))
      actions.push({
        id: 'pull-model',
        label: `Download model '${search}'`,
        leftSection: <IconCloudDownload size={18} />,
        rightSection: <p style={{ fontSize: '0.8rem' }}>Remote model</p>,
        onClick: () => pullModel(),
      });

    if (pullProgress)
      actions.push({
        id: 'pull-model-progress',
        label: `Downloading model '${pullProgress.model}' (${pullProgress.percent}%)`,
        description: 'Select to cancel the download...',
        leftSection: <LoadingSpinner size={18} />,
        rightSection: <p style={{ fontSize: '0.8rem' }}>Remote model</p>,
        onClick: () => abortModelPull(),
      });

    return actions;
  }, [localModels, search, setModel, closeSpotlight, pullModel, abortModelPull, pullProgress]);

  return actions;
};
