import { useEffect } from 'react';

/**
 * Set the document title.
 * @param {string} title - Page title (appended to base title)
 */
export const useDocumentTitle = (title) => {
  useEffect(() => {
    const base = 'DevBlog';
    document.title = title ? `${title} | ${base}` : base;
    return () => {
      document.title = base;
    };
  }, [title]);
};
