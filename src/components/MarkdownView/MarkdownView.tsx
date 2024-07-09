import { FC, isValidElement, PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './MarkdownView.module.css';
import { CodeHighlight, InlineCodeHighlight } from '@mantine/code-highlight';
import clsx from 'clsx';

interface CodeComponentProps {
  className?: string;
  children?: ReactNode;
}

const CodeBlock = ({ children, className }: CodeComponentProps): JSX.Element | null => {
  if (!isValidElement(children)) return null;

  return (
    <CodeHighlight
      code={children.props.children ?? ''}
      language={className?.replace('language-', '')}
      className={styles.codeBlock}
    />
  );
};

const InlineCode = ({ children }: PropsWithChildren): JSX.Element => (
  <InlineCodeHighlight code={children?.toString() ?? ''} />
);

interface MarkdownViewProps {
  withTyping?: boolean;
  children?: string;
}

export const MarkdownView: FC<MarkdownViewProps> = ({ withTyping, children }) => {
  const [animateCursor, setAnimateCursor] = useState(false);

  useEffect(() => {
    if (!withTyping) return;

    setAnimateCursor(false);
    const timeout = setTimeout(() => setAnimateCursor(true), 200);

    return () => clearTimeout(timeout);
  }, [withTyping, children]);

  return (
    <Markdown
      skipHtml
      className={clsx(styles.markdownView, {
        [styles.typing]: withTyping,
        [styles.animateCursor]: animateCursor,
      })}
      remarkPlugins={[remarkGfm]}
      components={{ pre: CodeBlock, code: InlineCode }}
    >
      {children}
    </Markdown>
  );
};
