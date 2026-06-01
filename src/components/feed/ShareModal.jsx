import { useState } from 'react';
import Modal from '../ui/Modal.jsx';

const ShareModal = ({ url, title, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareLinks = [
    {
      name: 'Twitter',
      icon: (
        <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      hoverBg: 'var(--insta-bg-secondary)',
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      hoverBg: 'rgba(0, 149, 246, 0.1)',
    },
    {
      name: 'Facebook',
      icon: (
        <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      hoverBg: 'rgba(0, 149, 246, 0.1)',
    },
    {
      name: 'WhatsApp',
      icon: (
        <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      url: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      hoverBg: 'rgba(48, 209, 88, 0.1)',
    },
  ];

  return (
    <Modal isOpen onClose={onClose} title="Share this post" size="sm">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Copy link */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px',
            backgroundColor: 'var(--insta-bg-tertiary)',
            borderRadius: 'var(--insta-radius-lg)',
          }}
        >
          <input
            type="text"
            value={url}
            readOnly
            style={{
              flex: 1,
              fontSize: 'var(--insta-font-size-sm)',
              color: 'var(--insta-text-secondary)',
              backgroundColor: 'transparent',
              outline: 'none',
              border: 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          />
          <button
            onClick={handleCopy}
            style={{
              padding: '6px 12px',
              fontSize: 'var(--insta-font-size-sm)',
              fontWeight: 'var(--insta-font-weight-medium)',
              borderRadius: 'var(--insta-radius-md)',
              transition: 'background-color 0.2s ease',
              backgroundColor: copied ? 'rgba(48, 209, 88, 0.1)' : 'var(--insta-accent-blue)',
              color: copied ? 'var(--insta-accent-success)' : 'var(--insta-text-primary)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Social share buttons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
          }}
        >
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                border: '1px solid var(--insta-border-secondary)',
                borderRadius: 'var(--insta-radius-lg)',
                fontSize: 'var(--insta-font-size-sm)',
                fontWeight: 'var(--insta-font-weight-medium)',
                color: 'var(--insta-text-primary)',
                transition: 'background-color 0.2s ease',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = link.hoverBg}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {link.icon}
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
