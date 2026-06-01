import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostBySlug, updatePost, clearCurrentPost, clearMutationError } from './blogSlice.js';
import { uploadImage } from '../../api/uploadApi.js';
import Input from '../../components/ui/Input.jsx';
import Textarea from '../../components/ui/Textarea.jsx';
import TagInput from '../../components/ui/TagInput.jsx';
import ImageUploadZone from '../../components/ui/ImageUploadZone.jsx';

const postSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(300, 'Title must be at most 300 characters'),
  content: z
    .string()
    .min(50, 'Content must be at least 50 characters')
    .max(50000, 'Content must be at most 50,000 characters'),
});

const EditBlogPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPost: post, detailLoading, detailError, mutationLoading, mutationError } =
    useSelector((state) => state.blog);
  const { user } = useSelector((state) => state.auth);

  const [tags, setTags] = useState([]);
  const [status, setStatus] = useState('draft');
  const [coverImage, setCoverImage] = useState({ url: '', publicId: '' });
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(postSchema),
  });

  // Load post
  useEffect(() => {
    dispatch(fetchPostBySlug(slug));
    return () => {
      dispatch(clearCurrentPost());
      dispatch(clearMutationError());
    };
  }, [dispatch, slug]);

  // Populate form when post loads
  useEffect(() => {
    if (post && !initialized) {
      // Redirect if not author
      if (user && post.author?._id !== user._id) {
        navigate('/');
        return;
      }

      reset({
        title: post.title,
        content: post.content,
      });
      setTags(post.tags || []);
      setStatus(post.status);
      setCoverImage(post.coverImage || { url: '', publicId: '' });
      setInitialized(true);
    }
  }, [post, initialized, reset, user, navigate]);

  const handleCoverImageUpload = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setCoverImageFile(file);
    setUploadingCover(true);

    try {
      const result = await uploadImage(file, 'post');
      setCoverImage({ url: result.url, publicId: result.publicId });
    } catch (err) {
      alert('Failed to upload image: ' + (err.response?.data?.error?.message || err.message));
      setCoverImageFile(null);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleRemoveCoverImage = () => {
    setCoverImage({ url: '', publicId: '' });
    setCoverImageFile(null);
  };

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      tags,
      status,
    };
    if (coverImage.url) {
      payload.coverImage = coverImage;
    } else {
      payload.coverImage = { url: '', publicId: '' };
    }

    const result = await dispatch(updatePost({ id: post._id, data: payload }));
    if (!result.error) {
      navigate(`/blog/${result.payload.slug}`);
    }
  };

  if (detailLoading) {
    return (
      <div className="flex justify-center py-20">
        <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (detailError) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h1>
        <p className="text-gray-500 mb-6">{detailError}</p>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--insta-text-primary)' }}>
          Edit story
        </h1>
        <p style={{ color: 'var(--insta-text-secondary)' }}>
          Make changes to your post.
        </p>
      </div>

      {mutationError && (
        <div className="insta-error-banner-dark mb-6">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{mutationError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* Cover image upload */}
        <div>
          <label className="insta-label" style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>
            Cover Image <span style={{ color: 'var(--insta-text-tertiary)', fontWeight: '400' }}>(optional)</span>
          </label>
          <ImageUploadZone
            onUpload={handleCoverImageUpload}
            loading={uploadingCover}
            currentImage={coverImage.url}
            onRemove={handleRemoveCoverImage}
            type="cover"
          />
        </div>

        <Input
          label="Title"
          name="title"
          type="text"
          placeholder="Your story title..."
          register={register}
          error={errors.title?.message}
        />

        <Textarea
          label="Content"
          name="content"
          rows={15}
          placeholder="Write your story here... (HTML supported)"
          register={register}
          error={errors.content?.message}
        />

        {/* Tags */}
        <div>
          <label className="insta-label" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
            Tags <span style={{ color: 'var(--insta-text-tertiary)', fontWeight: '400' }}>(up to 10)</span>
          </label>
          <TagInput tags={tags} onChange={setTags} maxTags={10} />
        </div>

        {/* Action Buttons - Beautiful Design */}
        <div className="editor-action-buttons">
          <button
            type="button"
            onClick={() => {
              setStatus('draft');
              handleSubmit(onSubmit)();
            }}
            disabled={mutationLoading}
            className="editor-btn editor-btn-draft"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            {mutationLoading && status === 'draft' ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            type="button"
            onClick={() => {
              setStatus('published');
              handleSubmit(onSubmit)();
            }}
            disabled={mutationLoading}
            className="editor-btn editor-btn-publish"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {mutationLoading && status === 'published' ? 'Publishing...' : 'Update & Publish'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlogPage;
