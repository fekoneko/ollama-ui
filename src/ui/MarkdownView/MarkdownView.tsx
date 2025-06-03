import { CodeHighlight, InlineCodeHighlight } from "@mantine/code-highlight";
import { Loader } from "@mantine/core";
import { FC, isValidElement, JSX, PropsWithChildren, ReactNode } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import classes from "./MarkdownView.module.css";

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
      className={classes.codeBlock}
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

export const MarkdownView: FC<MarkdownViewProps> = ({ withTyping, children }) => (
  <span className={classes.markdownView}>
    <Markdown
      skipHtml
      remarkPlugins={[remarkGfm]}
      components={{ pre: CodeBlock, code: InlineCode }}
    >
      {children}
    </Markdown>

    {withTyping && <Loader type="dots" size="sm" color="white" mt={-10} />}
  </span>
);
