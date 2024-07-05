import { FC, isValidElement, PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './MarkdownView.module.css';
import { CodeHighlight, InlineCodeHighlight } from '@mantine/code-highlight';

interface CodeComponentProps {
  className?: string;
  children?: ReactNode;
}

const BlockCodeComponent = ({ children, className }: CodeComponentProps): JSX.Element => {
  if (!isValidElement(children)) return <></>;
  return (
    <CodeHighlight
      code={children.props.children ?? ''}
      language={className?.replace('language-', '')}
      className={styles.codeBlock}
    />
  );
};

const InlineCodeComponent = ({ children }: PropsWithChildren): JSX.Element => (
  <InlineCodeHighlight code={children?.toString() ?? ''} />
);

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
      components={{ pre: BlockCodeComponent, code: InlineCodeComponent }}
    >
      {children}
    </Markdown>
  );
};
