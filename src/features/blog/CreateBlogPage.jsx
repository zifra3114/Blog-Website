import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, clearMutationError } from './blogSlice.js';
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

const CreateBlogPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutationLoading, mutationError } = useSelector((state) => state.blog);

  const [tags, setTags] = useState([]);
  const [status, setStatus] = useState('draft');
  const [coverImage, setCoverImage] = useState({ url: '', publicId: '' });
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(postSchema),
  });

  useEffect(() => {
    return () => {
      dispatch(clearMutationError());
      setSuccessMessage('');
    };
  }, [dispatch]);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleCoverImageUpload = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB)
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

  const onSubmit = async (data, submissionStatus) => {
    console.log('📝 Submitting post with status:', submissionStatus);

    const payload = {
      ...data,
      tags,
      status: submissionStatus, // Use the passed status directly, not state
    };
    if (coverImage.url) {
      payload.coverImage = coverImage;
    }

    console.log('📤 Post payload:', { title: payload.title, status: payload.status, tagsCount: payload.tags.length });

    try {
      const result = await dispatch(createPost(payload)).unwrap();

      console.log('✅ Post created successfully:', { slug: result.slug, status: result.status });

      // Show success message
      if (submissionStatus === 'published') {
        setSuccessMessage('Post published successfully! Redirecting...');
      } else {
        setSuccessMessage('Draft saved successfully! Redirecting...');
      }

      // Navigate after a short delay to show the success message
      setTimeout(() => {
        navigate(`/blog/${result.slug}`);
      }, 1500);
    } catch (error) {
      // Error is already in Redux state, will be displayed below
      console.error('❌ Failed to create post:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ color: 'var(--insta-text-primary)' }}>
          Write a story
        </h1>
        <p className="text-gray-500" style={{ color: 'var(--insta-text-secondary)' }}>
          Share your knowledge and expertise with the developer community.
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

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.3)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'rgb(34, 197, 94)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span style={{ color: 'rgb(21, 128, 61)', fontSize: '14px', fontWeight: '500' }}>{successMessage}</span>
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
          placeholder="Write your story here..."
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
              console.log('💾 Save as Draft clicked');
              handleSubmit((data) => onSubmit(data, 'draft'))();
            }}
            disabled={mutationLoading}
            className="editor-btn editor-btn-draft"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            {mutationLoading ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            type="button"
            onClick={() => {
              console.log('🚀 Publish Now clicked');
              handleSubmit((data) => onSubmit(data, 'published'))();
            }}
            disabled={mutationLoading}
            className="editor-btn editor-btn-publish"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {mutationLoading ? 'Publishing...' : 'Publish Now'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlogPage;
