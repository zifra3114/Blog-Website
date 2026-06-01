import { useState, useRef } from 'react';

const TagInput = ({ tags = [], onChange, maxTags = 10 }) => {
  const [input, setInput] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const addTag = (tag) => {
    const normalized = tag.toLowerCase().trim();
    if (
      normalized &&
      !tags.includes(normalized) &&
      tags.length < maxTags
    ) {
      onChange([...tags, normalized]);
    }
    setInput('');
  };

  const removeTag = (index) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        padding: '12px',
        backgroundColor: 'var(--insta-bg-input)',
        border: focused ? '1px solid var(--insta-accent-blue)' : '1px solid var(--insta-border-tertiary)',
        borderRadius: 'var(--insta-radius-lg)',
        transition: 'border-color 0.2s ease',
        cursor: 'text',
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag, index) => (
        <span
          key={tag}
          className="insta-badge insta-badge-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--insta-accent-blue)',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={tags.length < maxTags ? 'Add a tag...' : `Max ${maxTags} tags`}
        disabled={tags.length >= maxTags}
        style={{
          flex: 1,
          minWidth: '120px',
          fontSize: 'var(--insta-font-size-base)',
          outline: 'none',
          backgroundColor: 'transparent',
          color: 'var(--insta-text-primary)',
          border: 'none',
        }}
      />
    </div>
  );
};

export default TagInput;
