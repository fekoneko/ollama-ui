export const withStopPropagation =
  (callback: (() => void) | null | undefined) => (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    callback?.();
  };
