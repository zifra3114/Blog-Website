import { useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const BlogContent = ({ content }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Find all code blocks and apply syntax highlighting
    const codeBlocks = contentRef.current.querySelectorAll('pre code, code');

    codeBlocks.forEach((block) => {
      const parent = block.parentElement;
      const isInline = parent.tagName !== 'PRE';

      if (isInline) {
        // Style inline code
        block.style.backgroundColor = 'var(--insta-bg-tertiary)';
        block.style.color = 'var(--insta-accent-cyan)';
        block.style.padding = '2px 6px';
        block.style.borderRadius = '4px';
        block.style.fontSize = '0.9em';
        block.style.fontFamily = 'Monaco, Consolas, "Courier New", monospace';
      } else {
        // For code blocks in <pre>, we'll let the CSS handle it
        parent.style.backgroundColor = '#1e1e1e';
        parent.style.padding = '16px';
        parent.style.borderRadius = '8px';
        parent.style.overflow = 'auto';
        parent.style.marginBottom = '16px';
        block.style.color = '#d4d4d4';
        block.style.fontFamily = 'Monaco, Consolas, "Courier New", monospace';
        block.style.fontSize = '14px';
        block.style.lineHeight = '1.6';
      }
    });
  }, [content]);

  return (
    <div
      ref={contentRef}
      className="blog-content-wrapper"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default BlogContent;
