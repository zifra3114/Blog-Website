import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUserByUsername,
  toggleFollow,
  clearProfile,
} from './userSlice.js';
import { fetchPosts } from '../blog/blogSlice.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import Avatar from '../../components/ui/Avatar.jsx';
import BlogCard from '../../components/ui/BlogCard.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

const TABS = ['posts', 'about'];

const ProfilePage = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  
  // Auth state check karne ke liye loading state bhi nikalen
  const { profile, profileLoading, profileError } = useSelector(
    (state) => state.user
  );
  const { user: currentUser, loading: authLoading } = useSelector((state) => state.auth);
  const { posts: blogPosts, listLoading: postsLoading } = useSelector((state) => state.blog);
  const [activeTab, setActiveTab] = useState('posts');

  useDocumentTitle(profile?.name);

  // 1. Fetch User Profile (Username change hone par chalega)
  useEffect(() => {
    if (username) {
      dispatch(fetchUserByUsername(username));
    }
    return () => {
      dispatch(clearProfile());
    };
  }, [dispatch, username]);

  // 2. Fetch Posts Fix: Sirf tab chalega jab profile confirm aa jaye aur activeTab 'posts' ho
  useEffect(() => {
    if (profile?._id && activeTab === 'posts') {
      console.log('Fetching profile posts for author:', profile._id);
      dispatch(fetchPosts({ author: profile._id, status: 'published', limit: 50 }));
    }
  }, [dispatch, profile?._id, activeTab]); // activeTab ko dependency me dala taaki tab badalne par data sync rahe

  const isOwnProfile = currentUser?._id === profile?._id;

  const handleFollow = () => {
    if (!currentUser) return;
    dispatch(toggleFollow(profile._id));
  };

  // Jab tak auth complete na ho ya profile load ho rahi ho, loading dikhao
  if (profileLoading || authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
        <div className="insta-spinner insta-spinner-lg"></div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="insta-app-content-surface" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h1 className="insta-visual-title" style={{ fontSize: '24px' }}>
          User not found
        </h1>
        <p className="insta-text-secondary">{profileError}</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="insta-app-content-surface" style={{ maxWidth: '935px' }}>
      {/* ─── Cover image with modern developer banner ─── */}
      <div style={{ position: 'relative', marginBottom: '80px', isolation: 'isolate' }}>
        {profile.coverImage?.url ? (
          <div style={{ position: 'relative', width: '100%', height: '280px', borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
            <img
              src={profile.coverImage.url}
              alt="Profile cover"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div className="profile-banner-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 100%)', borderRadius: '12px' }}></div>
          </div>
        ) : (
          <div className="profile-banner-gradient" style={{ position: 'relative' }}>
            <div className="profile-banner-pattern"></div>
            <div className="profile-banner-content">
              <svg className="profile-banner-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <div className="profile-banner-text">
                <div className="profile-banner-title">Developer Profile</div>
                <div className="profile-banner-subtitle">Building the future, one commit at a time</div>
              </div>
            </div>
          </div>
        )}

        {/* Avatar (overlapping cover) */}
        <div style={{ position: 'absolute', bottom: '-56px', left: '32px', zIndex: 100 }}>
          {profile.avatar?.url ? (
            <img
              src={profile.avatar.url}
              alt={profile.name}
              className="insta-avatar"
              style={{ width: '120px', height: '120px', border: '4px solid var(--insta-bg-primary)', boxShadow: 'var(--insta-shadow-sm)' }}
            />
          ) : (
            <div
              className="insta-avatar"
              style={{
                width: '120px',
                height: '120px',
                backgroundColor: 'var(--insta-bg-tertiary)',
                border: '4px solid var(--insta-bg-primary)',
                boxShadow: 'var(--insta-shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--insta-text-primary)' }}>
                {profile.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ─── Profile header ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <h1 className="insta-visual-title" style={{ fontSize: '24px', margin: 0 }}>
                {profile.name}
              </h1>
              {isOwnProfile ? (
                <Link
                  to="/settings"
                  className="insta-btn insta-btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '13px', minWidth: 'auto' }}
                >
                  Edit profile
                </Link>
              ) : (
                <button
                  onClick={handleFollow}
                  className={profile.isFollowing ? "insta-btn insta-btn-secondary" : "insta-btn insta-btn-primary"}
                  style={{ padding: '6px 16px', fontSize: '13px', minWidth: 'auto' }}
                >
                  {profile.isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>

            <p className="insta-text-secondary" style={{ fontSize: '16px', marginBottom: '12px' }}>@{profile.username}</p>

            {profile.headline && (
              <p className="insta-text-primary" style={{ fontSize: '15px', fontWeight: '500', marginBottom: '8px' }}>{profile.headline}</p>
            )}

            {profile.bio && (
              <p className="insta-text-secondary" style={{ fontSize: '14px', marginBottom: '16px', maxWidth: '600px', lineHeight: '1.5' }}>{profile.bio}</p>
            )}

            {/* Stats */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px', color: 'var(--insta-text-secondary)', marginBottom: '16px' }}>
              <Link
                to={`/profile/${profile.username}/followers`}
                style={{ textDecoration: 'none', color: 'inherit' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--insta-text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
              >
                <strong style={{ color: 'var(--insta-text-primary)' }}>{profile.followerCount}</strong> followers
              </Link>
              <Link
                to={`/profile/${profile.username}/following`}
                style={{ textDecoration: 'none', color: 'inherit' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--insta-text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
              >
                <strong style={{ color: 'var(--insta-text-primary)' }}>{profile.followingCount}</strong> following
              </Link>
              <span>
                <strong style={{ color: 'var(--insta-text-primary)' }}>{blogPosts ? blogPosts.length : 0}</strong> posts
              </span>
            </div>

            {/* Location & Website */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'var(--insta-text-tertiary)' }}>
              {profile.location && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {profile.location}
                </span>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="insta-link"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}
                >
                  <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {profile.website.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>

            {/* Social Links */}
            {profile.socialLinks && Object.values(profile.socialLinks).some(link => link) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
                {profile.socialLinks.twitter && (
                  <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="insta-link" style={{ fontSize: '13px' }}>
                    Twitter
                  </a>
                )}
                {profile.socialLinks.linkedin && (
                  <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="insta-link" style={{ fontSize: '13px' }}>
                    LinkedIn
                  </a>
                )}
                {profile.socialLinks.github && (
                  <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="insta-link" style={{ fontSize: '13px' }}>
                    GitHub
                  </a>
                )}
                {profile.socialLinks.facebook && (
                  <a href={profile.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="insta-link" style={{ fontSize: '13px' }}>
                    Facebook
                  </a>
                )}
                {profile.socialLinks.instagram && (
                  <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="insta-link" style={{ fontSize: '13px' }}>
                    Instagram
                  </a>
                )}
                {profile.socialLinks.youtube && (
                  <a href={profile.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="insta-link" style={{ fontSize: '13px' }}>
                    YouTube
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {profile.skills?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="insta-badge"
                style={{ padding: '4px 12px', fontSize: '12px' }}
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ─── Tabs ─── */}
      <div style={{ borderBottom: '1px solid var(--insta-border-secondary)', marginBottom: '24px', display: 'flex', justifyContent: 'center', gap: '48px' }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 0',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              backgroundColor: 'transparent',
              color: activeTab === tab ? 'var(--insta-text-primary)' : 'var(--insta-text-tertiary)',
              border: 'none',
              borderTop: activeTab === tab ? '1px solid var(--insta-text-primary)' : '1px solid transparent',
              marginTop: '-1px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ─── Tab content ─── */}

      {/* Posts tab */}
      {activeTab === 'posts' && (
        <div style={{ padding: '0 16px' }}>
          {postsLoading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
              <div className="insta-spinner"></div>
            </div>
          )}
          {!postsLoading && (!blogPosts || blogPosts.length === 0) && (
            <div className="insta-empty-state">
              <div className="insta-empty-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="insta-empty-title">No posts yet</h3>
              <p className="insta-empty-description">
                {isOwnProfile
                  ? 'Start writing to share your ideas with the world.'
                  : "This user hasn't published any posts yet."}
              </p>
              {isOwnProfile && (
                <Link
                  to="/blog/new"
                  className="insta-nav-accent-solid-btn"
                  style={{ padding: '10px 20px', textDecoration: 'none' }}
                >
                  Write a story
                </Link>
              )}
            </div>
          )}
          {!postsLoading && blogPosts && blogPosts.length > 0 && (
            <div style={{ display: 'grid', gap: '24px' }}>
              {blogPosts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* About tab */}
      {activeTab === 'about' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '0 16px' }}>
          {/* Bio */}
          <div className="insta-card" style={{ padding: '24px' }}>
            <h3 className="insta-post-title-text" style={{ fontSize: '18px', marginBottom: '12px' }}>About</h3>
            {profile.bio ? (
              <p className="insta-text-secondary" style={{ fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{profile.bio}</p>
            ) : (
              <p className="insta-text-tertiary" style={{ fontStyle: 'italic', fontSize: '14px' }}>No bio provided.</p>
            )}
          </div>

          {/* Details */}
          <div className="insta-card" style={{ padding: '24px' }}>
            <h3 className="insta-post-title-text" style={{ fontSize: '18px', marginBottom: '16px' }}>
              Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--insta-text-secondary)' }}>
                <svg style={{ width: '18px', height: '18px', color: 'var(--insta-text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  Joined{' '}
                  {new Date(profile.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Experience */}
          {profile.experience?.length > 0 && (
            <div className="insta-card" style={{ padding: '24px' }}>
              <h3 className="insta-post-title-text" style={{ fontSize: '18px', marginBottom: '16px' }}>
                Experience
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {profile.experience.map((exp, index) => (
                  <div key={index} style={{ borderBottom: index < profile.experience.length - 1 ? '1px solid var(--insta-border-secondary)' : 'none', paddingBottom: index < profile.experience.length - 1 ? '20px' : '0' }}>
                    <h4 className="insta-text-primary" style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>
                      {exp.title}
                    </h4>
                    <p className="insta-text-secondary" style={{ fontSize: '14px', marginBottom: '4px' }}>
                      {exp.company} {exp.location && `• ${exp.location}`}
                    </p>
                    <p className="insta-text-tertiary" style={{ fontSize: '13px', marginBottom: exp.description ? '8px' : '0' }}>
                      {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      {' - '}
                      {exp.current ? 'Present' : exp.endDate && new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                    {exp.description && (
                      <p className="insta-text-secondary" style={{ fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {profile.education?.length > 0 && (
            <div className="insta-card" style={{ padding: '24px' }}>
              <h3 className="insta-post-title-text" style={{ fontSize: '18px', marginBottom: '16px' }}>
                Education
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {profile.education.map((edu, index) => (
                  <div key={index} style={{ borderBottom: index < profile.education.length - 1 ? '1px solid var(--insta-border-secondary)' : 'none', paddingBottom: index < profile.education.length - 1 ? '20px' : '0' }}>
                    <h4 className="insta-text-primary" style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>
                      {edu.school}
                    </h4>
                    <p className="insta-text-secondary" style={{ fontSize: '14px', marginBottom: '4px' }}>
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </p>
                    <p className="insta-text-tertiary" style={{ fontSize: '13px', marginBottom: edu.description ? '8px' : '0' }}>
                      {edu.startDate && new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      {' - '}
                      {edu.current ? 'Present' : edu.endDate && new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                    {edu.description && (
                      <p className="insta-text-secondary" style={{ fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;