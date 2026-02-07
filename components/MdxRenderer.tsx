import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import type { MDXComponents } from "mdx/types";

// const MermaidComponent = lazy(() => import("./Mermaid"));

function generateId(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
}

export const mdxComponentsBlog: MDXComponents = {
    h1: (props) => {
        const id = generateId(props.children?.toString() || "");
        return <h1 id={id} className="font-semibold text-3xl md:text-5xl" {...props} />;
    },
    h2: (props) => {
        const id = generateId(props.children?.toString() || "");
        return <h2 id={id} className="font-semibold text-xl md:text-2xl" {...props} />;
    },
    h3: (props) => {
        const id = generateId(props.children?.toString() || "");
        return <h3 id={id} className="font-medium text-lg md:text-xl" {...props} />;
    },
    p: (props) => <p {...props} />,
    code: (props) => (
        <code
            className="bg-muted px-2 py-1 rounded font-mono text-sm"
            {...props}
        />
    ),
    pre: (props) => (
        <pre
            className="bg-muted p-4 rounded-lg overflow-x-auto font-mono border"
            {...props}
        />
    ),
    blockquote: (props) => (
        <blockquote
            className="border-l-4 border-primary/30 pl-6 italic text-muted-foreground"
            {...props}
        />
    ),
    ul: (props) => <ul className="list-disc pl-6 space-y-2" {...props} />,
    ol: (props) => <ol className="list-decimal pl-6 space-y-2" {...props} />,
    li: (props) => <li {...props} />,
    a: (props) => (
        <a
            className="text-primary hover:text-primary/80 underline"
            {...props}
        />
    ),
    table: (props) => (
        <div className="overflow-x-auto mb-6 -mx-2 sm:mx-0">
            <table
                className="min-w-full sm:w-full border-collapse border"
                {...props}
            />
        </div>
    ),
    thead: (props) => <thead className="bg-muted" {...props} />,
    tbody: (props) => <tbody {...props} />,
    tr: (props) => <tr className="border" {...props} />,
    th: (props) => (
        <th
            className="border p-2 sm:p-2.5 text-left font-semibold"
            {...props}
        />
    ),
    td: (props) => <td className="border p-2 sm:p-2.5" {...props} />,
};

function RenderMDX({ source }: { source: string }) {
    return (
        <MDXRemote
            source={source}
            components={mdxComponentsBlog}
            options={{
                mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeHighlight],
                },
            }}
        />
    );
}

export default RenderMDX;
