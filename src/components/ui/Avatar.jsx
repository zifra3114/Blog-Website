import { Link } from 'react-router-dom';

const sizeClasses = {
  xs: 'insta-avatar-sm',
  sm: 'insta-avatar-sm',
  md: 'insta-avatar-md',
  lg: 'insta-avatar-lg',
  xl: 'insta-avatar-xl',
};

const textSizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-2xl',
};

const Avatar = ({ user, size = 'md', className = '', linkTo }) => {
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const textSize = textSizeClasses[size] || textSizeClasses.md;

  const content = user?.avatar?.url ? (
    <img
      src={user.avatar.url}
      alt={user.name}
      className={`insta-avatar ${sizeClass} ${className}`}
    />
  ) : (
    <div
      className={`insta-avatar ${sizeClass} ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--insta-bg-tertiary)',
        borderColor: 'var(--insta-border-tertiary)'
      }}
    >
      <span className={`${textSize} insta-text-primary`} style={{ fontWeight: 600 }}>
        {user?.name?.charAt(0)?.toUpperCase() || '?'}
      </span>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} style={{ flexShrink: 0 }}>
        {content}
      </Link>
    );
  }

  return content;
};

export default Avatar;
