import { IconLoader2, IconProps } from '@tabler/icons-react';
import clsx from 'clsx';
import { FC } from 'react';
import styles from './LoadingSpinner.module.css';

export const LoadingSpinner: FC<IconProps> = (iconProps) => (
  <IconLoader2 {...iconProps} className={clsx(iconProps.className, styles.loadingSpinner)} />
);
