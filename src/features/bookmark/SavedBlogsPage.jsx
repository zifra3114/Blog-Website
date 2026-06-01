import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSavedPosts } from '../blog/blogSlice.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import BlogCard from '../../components/ui/BlogCard.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Pagination from '../../components/ui/Pagination.jsx';

const SavedBlogsPage = () => {
  useDocumentTitle('Saved Blogs');
  const dispatch = useDispatch();
  const { savedPosts, savedMeta, savedLoading, savedError } = useSelector(
    (state) => state.blog
  );

  useEffect(() => {
    dispatch(fetchSavedPosts({ page: 1, limit: 20 }));
  }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Blogs</h1>
      <p className="text-gray-500 mb-8">Posts you&apos;ve bookmarked for later.</p>

      {savedError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {savedError}
        </div>
      )}

      {savedLoading && <LoadingSpinner className="py-12" />}

      {!savedLoading && savedPosts.length === 0 && (
        <EmptyState
          icon={
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          }
          title="No saved posts yet"
          description="Bookmark posts to save them for later reading."
        />
      )}

      {!savedLoading && savedPosts.length > 0 && (
        <>
          <div className="grid gap-6">
            {savedPosts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
          <Pagination meta={savedMeta} onPageChange={() => {}} />
        </>
      )}
    </div>
  );
};

export default SavedBlogsPage;
