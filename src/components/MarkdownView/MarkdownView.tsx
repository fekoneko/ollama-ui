import { CodeHighlight, InlineCodeHighlight } from "@mantine/code-highlight";
import clsx from "clsx";
import {
  FC,
  isValidElement,
  JSX,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./MarkdownView.module.css";

interface CodeComponentProps {
  className?: string;
  children?: ReactNode;
}

const CodeBlock = ({ children, className }: CodeComponentProps): JSX.Element | null => {
  if (!isValidElement(children)) return null;

  return (
    <CodeHighlight
      code={(children.props as any).children ?? ""} // TODO: wtf
      language={className?.replace("language-", "")}
      className={styles.codeBlock}
    />
  );
};

const InlineCode = ({ children }: PropsWithChildren): JSX.Element => (
  <InlineCodeHighlight code={children?.toString() ?? ""} />
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
    <span
      className={clsx(styles.markdownView, {
        [styles.typing]: withTyping,
        [styles.animateCursor]: animateCursor,
      })}
    >
      <Markdown
        skipHtml
        remarkPlugins={[remarkGfm]}
        components={{ pre: CodeBlock, code: InlineCode }}
      >
        {children}
      </Markdown>
    </span>
  );
};
