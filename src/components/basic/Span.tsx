import DOMPurify from 'dompurify';

type SpanProps = React.HTMLAttributes<HTMLSpanElement> & {
    /** If true, children (or `html`) will be injected via dangerouslySetInnerHTML */
    allowHtml?: boolean;
    /** Optional explicit HTML string. If provided and allowHtml=true, this takes precedence over children */
    html?: string;
};

export function Span({ allowHtml = false, html, children, ...rest }: SpanProps) {
    if (allowHtml) {
        // Prefer explicit `html` prop; otherwise use string children.
        const raw = html ?? (typeof children === 'string' || typeof children === 'number' ? String(children) : '');

        // Sanitize the HTML before injecting
        const safeHtml = DOMPurify.sanitize(raw);

        return <span {...rest} dangerouslySetInnerHTML={{ __html: safeHtml }} />;
    }

    return <span {...rest}>{children}</span>;
}
