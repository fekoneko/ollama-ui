import { FC, useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './MarkdownView.module.css';

interface MarkdownViewProps {
  typing?: boolean;
  children?: string;
}

export const MarkdownView: FC<MarkdownViewProps> = ({ typing, children }) => {
  const [animateCursor, setAnimateCursor] = useState(false);

  useEffect(() => {
    if (!typing) return;

    setAnimateCursor(false);
    const timeout = setTimeout(() => setAnimateCursor(true), 200);

    return () => clearTimeout(timeout);
  }, [typing, children]);

  return (
    <Markdown
      skipHtml
      className={[
        styles.markdownView,
        typing ? styles.typing : '',
        animateCursor ? styles.animateCursor : '',
      ].join(' ')}
      remarkPlugins={[remarkGfm]}
    >
      {children}
    </Markdown>
  );
};
