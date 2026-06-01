import { useState, useRef } from 'react';
import Avatar from './Avatar.jsx';

/**
 * Image upload with preview.
 * @param {string} type - 'avatar' | 'cover'
 * @param {string} currentUrl - Current image URL
 * @param {Function} onUpload - Called with the File object
 * @param {Function} onUploadComplete - Called with { url, publicId } after API upload
 * @param {object} user - User object for avatar fallback
 * @param {boolean} loading - Upload in progress
 */
const ImageUpload = ({
  type = 'avatar',
  currentUrl,
  onUpload,
  user,
  loading = false,
  className = '',
}) => {
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
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

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    onUpload(file);
  };

  const displayUrl = preview || currentUrl;

  if (type === 'avatar') {
    return (
      <div className={className} style={{ position: 'relative', display: 'inline-block' }}>
        {displayUrl ? (
          <img
            src={displayUrl}
            alt="Avatar"
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid white',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          />
        ) : (
          <Avatar user={user} size="xl" style={{ border: '4px solid white', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} />
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '32px',
            height: '32px',
            backgroundColor: 'var(--insta-accent-blue)',
            color: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s ease',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
            opacity: loading ? 0.5 : 1,
          }}
          onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = 'var(--insta-accent-blue-hover)')}
          onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = 'var(--insta-accent-blue)')}
        >
          {loading ? (
            <svg
              style={{ width: '16px', height: '16px', animation: 'insta-spin 0.8s linear infinite' }}
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    );
  }

  // Cover image type
  return (
    <div className={className} style={{ position: 'relative' }}>
      {displayUrl ? (
        <img
          src={displayUrl}
          alt="Cover"
          style={{
            width: '100%',
            height: '192px',
            objectFit: 'cover',
            borderRadius: 'var(--insta-radius-lg)',
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '192px',
            background: 'linear-gradient(135deg, var(--insta-accent-blue) 0%, var(--insta-accent-blue-alt) 100%)',
            borderRadius: 'var(--insta-radius-lg)',
          }}
        />
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          padding: '6px 12px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          color: 'var(--insta-text-primary)',
          fontSize: 'var(--insta-font-size-sm)',
          fontWeight: 'var(--insta-font-weight-medium)',
          borderRadius: 'var(--insta-radius-lg)',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s ease',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          opacity: loading ? 0.5 : 1,
        }}
        onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)')}
        onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)')}
      >
        {loading ? (
          <svg
            style={{ width: '16px', height: '16px', animation: 'insta-spin 0.8s linear infinite' }}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
        Change cover
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageUpload;
