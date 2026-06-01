import { useEffect, useRef } from 'react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside.js';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const ref = useRef(null);
  useOnClickOutside(ref, onClose);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="insta-modal-overlay">
      <div
        ref={ref}
        className={`insta-modal-content ${sizes[size]}`}
      >
        {title && (
          <div className="insta-modal-header">
            <h2 className="insta-modal-title">{title}</h2>
            <button
              onClick={onClose}
              className="insta-text-secondary"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--insta-text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--insta-text-secondary)'}
            >
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="insta-modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
