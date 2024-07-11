import { SpotlightActionData } from '@mantine/spotlight';
import { IconCloudDownload, IconCloudOff } from '@tabler/icons-react';
import { useMemo } from 'react';

export const useSpotlightActions = (
  localModels: string[] | undefined,
  setModel: any,
  search: string,
) => {
  const actions = useMemo(() => {
    const actions: SpotlightActionData[] =
      localModels?.map((model) => ({
        id: model,
        label: model,
        leftSection: <IconCloudOff size={18} />,
        rightSection: <p style={{ fontSize: '0.8rem' }}>Local model</p>,
        onClick: () => setModel(model),
      })) ?? [];

    if (search.length > 0)
      actions.push({
        id: 'pull-model',
        label: `Download model '${search}'`,
        leftSection: <IconCloudDownload size={18} />,
        rightSection: <p style={{ fontSize: '0.8rem' }}>Remote model</p>,
        onClick: () => undefined,
      });

    return actions;
  }, [localModels, setModel, search]);

  return actions;
};
