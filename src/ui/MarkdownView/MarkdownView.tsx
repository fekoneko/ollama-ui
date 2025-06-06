import { SHIKI_LANGUAGES } from "@/shiki-languages";
import { CodeHighlight, InlineCodeHighlight } from "@mantine/code-highlight";
import { FC, isValidElement, JSX, PropsWithChildren, ReactNode } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import classes from "./MarkdownView.module.css";

interface CodeComponentProps {
  children?: ReactNode;
}

const CodeBlock = ({ children }: CodeComponentProps): JSX.Element | null => {
  if (!isValidElement(children)) return null;

  const code = (children?.props as any)?.children?.toString() ?? "";
  let language = (children?.props as any)?.className?.replace("language-", "");
  if (!SHIKI_LANGUAGES.includes(language)) language = "text";

  return (
    <CodeHighlight
      code={code}
      language={language}
      radius="md"
      className={classes.codeBlock}
    />
  );
};

const InlineCode = ({ children }: PropsWithChildren): JSX.Element => (
  <InlineCodeHighlight code={children?.toString() ?? ""} />
);

interface MarkdownViewProps {
  children?: string;
}

export const MarkdownView: FC<MarkdownViewProps> = ({ children }) => (
  <span className={classes.markdownView}>
    <Markdown
      skipHtml
      remarkPlugins={[remarkGfm]}
      components={{ pre: CodeBlock, code: InlineCode }}
    >
      {children}
    </Markdown>
  </span>
);
