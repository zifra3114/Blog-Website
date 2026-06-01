import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFollow } from '../../features/user/userSlice.js';
import Avatar from '../ui/Avatar.jsx';

const SuggestedUsers = ({ users = [], loading = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);

  const handleFollow = (userId) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    dispatch(toggleFollow(userId));
  };

  if (loading) {
    return (
      <div
        className="insta-card"
        style={{ padding: '16px' }}
      >
        <div
          style={{
            height: '16px',
            width: '128px',
            backgroundColor: 'var(--insta-bg-tertiary)',
            borderRadius: '4px',
            marginBottom: '16px',
            animation: 'pulse-glow 1.5s ease-in-out infinite',
          }}
        />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--insta-bg-tertiary)',
                animation: 'pulse-glow 1.5s ease-in-out infinite',
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  height: '12px',
                  width: '96px',
                  backgroundColor: 'var(--insta-bg-tertiary)',
                  borderRadius: '4px',
                  marginBottom: '4px',
                  animation: 'pulse-glow 1.5s ease-in-out infinite',
                }}
              />
              <div
                style={{
                  height: '8px',
                  width: '128px',
                  backgroundColor: 'var(--insta-bg-tertiary)',
                  borderRadius: '4px',
                  animation: 'pulse-glow 1.5s ease-in-out infinite',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) return null;

  return (
    <div className="insta-card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '16px 16px 8px 16px' }}>
        <h3
          className="insta-text-primary"
          style={{
            fontSize: 'var(--insta-font-size-sm)',
            fontWeight: 'var(--insta-font-weight-semibold)',
          }}
        >
          Suggested for you
        </h3>
      </div>
      <div>
        {users.map((suggestedUser) => (
          <div
            key={suggestedUser._id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              transition: 'background-color 0.2s ease',
              borderBottom: '1px solid var(--insta-border-secondary)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--insta-bg-tertiary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Avatar
              user={suggestedUser}
              size="md"
              linkTo={`/profile/${suggestedUser.username}`}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <Link
                to={`/profile/${suggestedUser.username}`}
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
                {suggestedUser.name}
              </Link>
              {suggestedUser.headline && (
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
                  {suggestedUser.headline}
                </p>
              )}
              <p
                className="insta-text-tertiary"
                style={{ fontSize: 'var(--insta-font-size-xs)', margin: '2px 0 0 0' }}
              >
                {suggestedUser.followerCount} follower
                {suggestedUser.followerCount !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => handleFollow(suggestedUser._id)}
              style={{
                padding: '6px 12px',
                fontSize: 'var(--insta-font-size-xs)',
                fontWeight: 'var(--insta-font-weight-medium)',
                borderRadius: 'var(--insta-radius-full)',
                transition: 'all 0.2s ease',
                border: suggestedUser.isFollowing
                  ? '1px solid var(--insta-border-tertiary)'
                  : '1px solid var(--insta-accent-blue)',
                backgroundColor: 'transparent',
                color: suggestedUser.isFollowing
                  ? 'var(--insta-text-secondary)'
                  : 'var(--insta-accent-blue)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = suggestedUser.isFollowing
                  ? 'var(--insta-bg-elevated)'
                  : 'rgba(0, 149, 246, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {suggestedUser.isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
      {users.length >= 5 && (
        <Link
          to="/search"
          className="insta-link"
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '12px',
            fontSize: 'var(--insta-font-size-sm)',
            fontWeight: 'var(--insta-font-weight-medium)',
            color: 'var(--insta-accent-blue)',
            borderTop: '1px solid var(--insta-border-secondary)',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--insta-bg-tertiary)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          Show more
        </Link>
      )}
    </div>
  );
};

export default SuggestedUsers;
