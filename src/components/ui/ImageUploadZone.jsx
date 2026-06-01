import { useState, useRef } from 'react';

const ImageUploadZone = ({ onUpload, loading, currentImage, onRemove, type = 'cover' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);
  const inputRef = useRef(null);

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
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, GIF, WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Call upload handler
    onUpload(file);
  };

  const handleRemoveImage = () => {
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

  if (preview || currentImage) {
    return (
      <div className="image-upload-preview-container">
        <img
          src={preview || currentImage}
          alt="Upload preview"
          className="image-upload-preview"
        />
        <div className="image-upload-overlay">
          <button
            type="button"
            onClick={handleRemoveImage}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
          accept="image/*"
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
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={loading}
      />

      {loading ? (
        <div className="image-upload-loading-state">
          <div className="image-upload-spinner"></div>
          <span className="image-upload-loading-text">Uploading your image...</span>
          <span className="image-upload-loading-subtext">Please wait</span>
        </div>
      ) : (
        <div className="image-upload-empty-state">
          <div className="image-upload-icon-wrapper">
            <svg className="image-upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="image-upload-title">
            {isDragging ? 'Drop your image here' : 'Upload cover image'}
          </h3>
          <p className="image-upload-description">
            Drag and drop or click to browse
          </p>
          <p className="image-upload-specs">
            PNG, JPG, GIF or WebP • Max 5MB
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploadZone;
