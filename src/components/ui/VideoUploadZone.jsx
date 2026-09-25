import { useState, useRef, useEffect } from 'react';

const VideoUploadZone = ({ onUpload, loading, currentVideo, onRemove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(currentVideo || null);
  const inputRef = useRef(null);

  // Sync preview with currentVideo prop (when upload completes)
  useEffect(() => {
    if (currentVideo) {
      // Clear local preview and use Cloudinary URL
      setPreview(currentVideo);
    }
  }, [currentVideo]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    // Validate file type
    const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('Please select a video file (MP4, WebM, MOV, MKV)');
      return;
    }

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('Video must be less than 50MB');
      return;
    }

    // Create local preview (object URL for immediate preview)
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Call upload handler (this will upload to cloudinary)
    onUpload(file);
  };

  const handleRemoveVideo = () => {
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    if (onRemove) {
      onRemove();
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  if (preview || currentVideo) {
    return (
      <div className="video-upload-preview-container">
        <video
          src={preview || currentVideo}
          controls
          className="video-upload-preview"
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
        <div className="image-upload-overlay">
          <button
            type="button"
            onClick={handleRemoveVideo}
            className="image-upload-remove-btn"
            disabled={loading}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Remove
          </button>
          <button
            type="button"
            onClick={handleClick}
            className="image-upload-change-btn"
            disabled={loading}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Change
          </button>
        </div>
        {loading && (
          <div className="image-upload-loading-overlay">
            <div className="image-upload-spinner"></div>
            <span className="image-upload-loading-text">Uploading...</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div
      className={`image-upload-dropzone ${isDragging ? 'dragging' : ''} ${loading ? 'loading' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
        onChange={handleFileChange}
        className="hidden"
        disabled={loading}
      />

      {loading ? (
        <div className="image-upload-loading-state">
          <div className="image-upload-spinner"></div>
          <span className="image-upload-loading-text">Uploading your video...</span>
          <span className="image-upload-loading-subtext">Please wait</span>
        </div>
      ) : (
        <div className="image-upload-empty-state">
          <div className="image-upload-icon-wrapper">
            <svg className="image-upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="image-upload-title">
            {isDragging ? 'Drop your video here' : 'Upload video'}
          </h3>
          <p className="image-upload-description">
            Drag and drop or click to browse
          </p>
          <p className="image-upload-specs">
            MP4, WebM, MOV or MKV • Max 50MB
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoUploadZone;