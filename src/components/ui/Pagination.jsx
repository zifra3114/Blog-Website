const Pagination = ({ meta, onPageChange }) => {
  const { page, totalPages } = meta;

  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const buttonStyle = {
    padding: '8px 12px',
    fontSize: 'var(--insta-font-size-sm)',
    borderRadius: 'var(--insta-radius-md)',
    border: 'none',
    cursor: 'pointer',
    transition: 'var(--insta-transition-fast)',
    backgroundColor: 'transparent',
    color: 'var(--insta-text-secondary)',
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'var(--insta-accent-blue)',
    color: 'var(--insta-text-primary)',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '32px' }}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        style={{ ...buttonStyle, opacity: page <= 1 ? 0.4 : 1, cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
        onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'var(--insta-bg-secondary)')}
        onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        Previous
      </button>

      {getPages()[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            style={buttonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--insta-bg-secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            1
          </button>
          {getPages()[0] > 2 && (
            <span style={{ padding: '0 8px', color: 'var(--insta-text-tertiary)' }}>...</span>
          )}
        </>
      )}

      {getPages().map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          style={p === page ? activeButtonStyle : buttonStyle}
          onMouseEnter={(e) => p !== page && (e.currentTarget.style.backgroundColor = 'var(--insta-bg-secondary)')}
          onMouseLeave={(e) => p !== page && (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          {p}
        </button>
      ))}

      {getPages()[getPages().length - 1] < totalPages && (
        <>
          {getPages()[getPages().length - 1] < totalPages - 1 && (
            <span style={{ padding: '0 8px', color: 'var(--insta-text-tertiary)' }}>...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            style={buttonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--insta-bg-secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        style={{ ...buttonStyle, opacity: page >= totalPages ? 0.4 : 1, cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
        onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'var(--insta-bg-secondary)')}
        onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
