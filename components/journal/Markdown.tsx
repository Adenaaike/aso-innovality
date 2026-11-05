import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-a:text-royal dark:prose-a:text-light-azure prose-img:rounded-lg prose-blockquote:border-royal">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}