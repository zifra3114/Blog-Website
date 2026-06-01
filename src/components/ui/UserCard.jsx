import { Link } from 'react-router-dom';
import Avatar from './Avatar.jsx';

const UserCard = ({ user, onFollow, isFollowing, showFollowButton = false }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        borderRadius: 'var(--insta-radius-lg)',
        transition: 'var(--insta-transition-fast)',
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--insta-bg-tertiary)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <Avatar user={user} size="md" linkTo={`/profile/${user.username}`} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link
          to={`/profile/${user.username}`}
          className="insta-link"
          style={{
            fontSize: 'var(--insta-font-size-sm)',
            fontWeight: 'var(--insta-font-weight-medium)',
            color: 'var(--insta-text-primary)',
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {user.name}
        </Link>
        {user.headline && (
          <p
            className="insta-text-secondary"
            style={{
              fontSize: 'var(--insta-font-size-xs)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              margin: '2px 0 0 0',
            }}
          >
            {user.headline}
          </p>
        )}
        <p
          className="insta-text-tertiary"
          style={{ fontSize: 'var(--insta-font-size-xs)', margin: '2px 0 0 0' }}
        >
          @{user.username}
        </p>
      </div>
      {showFollowButton && onFollow && (
        <button
          onClick={() => onFollow(user._id)}
          style={{
            padding: '6px 12px',
            fontSize: 'var(--insta-font-size-xs)',
            fontWeight: 'var(--insta-font-weight-semibold)',
            borderRadius: 'var(--insta-radius-md)',
            transition: 'var(--insta-transition-fast)',
            border: isFollowing ? '1px solid var(--insta-border-tertiary)' : '1px solid var(--insta-accent-blue)',
            backgroundColor: 'transparent',
            color: isFollowing ? 'var(--insta-text-secondary)' : 'var(--insta-accent-blue)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = isFollowing ? 'var(--insta-bg-tertiary)' : 'rgba(0, 149, 246, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      )}
    </div>
  );
};

export default UserCard;
