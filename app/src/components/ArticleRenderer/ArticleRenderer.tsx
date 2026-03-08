'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './ArticleRenderer.module.css';

interface ArticleRendererProps {
    content: string;
    title?: string;
}

export default function ArticleRenderer({ content, title }: ArticleRendererProps) {
    return (
        <div className={styles.articleContent}>
            {title && <h2>{title}</h2>}
            <div className={styles.articleBody}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h2: ({ children }) => <h2>{children}</h2>,
                        h3: ({ children }) => <h3>{children}</h3>,
                        h4: ({ children }) => <h4>{children}</h4>,
                        blockquote: ({ children }) => <blockquote>{children}</blockquote>,
                        ul: ({ children }) => <ul>{children}</ul>,
                        ol: ({ children }) => <ol>{children}</ol>,
                        li: ({ children }) => <li>{children}</li>,
                        strong: ({ children }) => <strong>{children}</strong>,
                        em: ({ children }) => <em>{children}</em>,
                        p: ({ children }) => <p>{children}</p>,
                        table: ({ children }) => (
                            <div className={styles.tableWrapper}>
                                <table className={styles.table}>{children}</table>
                            </div>
                        ),
                        thead: ({ children }) => <thead>{children}</thead>,
                        tbody: ({ children }) => <tbody>{children}</tbody>,
                        tr: ({ children }) => <tr>{children}</tr>,
                        th: ({ children }) => <th>{children}</th>,
                        td: ({ children }) => <td>{children}</td>,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
}
