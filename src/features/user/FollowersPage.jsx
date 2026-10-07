  import { useEffect, useState } from 'react';
  import { useParams, Link } from 'react-router-dom';
  import { useDispatch, useSelector } from 'react-redux';
  import {
    fetchUserByUsername,
    fetchFollowers,
    fetchFollowing,
    toggleFollow,
    clearProfile,
  } from './userSlice.js';
  import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
  import Avatar from '../../components/ui/Avatar.jsx';
  import Pagination from '../../components/ui/Pagination.jsx';
  import '../../styles/globals.css'; // CSS file import ki hai yahan

  const FollowersPage = () => {
    const { username } = useParams();
    const dispatch = useDispatch();
    const {
      profile,
      profileLoading,
      followers,
      followersMeta,
      following,
      followingMeta,
      listLoading,
    } = useSelector((state) => state.user);
    const { user: currentUser } = useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState('followers');

    useDocumentTitle(`${username} - ${activeTab}`);

    useEffect(() => {
      dispatch(fetchUserByUsername(username));
      return () => dispatch(clearProfile());
    }, [dispatch, username]);

    useEffect(() => {
      if (!profile?._id) return;
      if (activeTab === 'followers') {
        dispatch(fetchFollowers({ userId: profile._id, page: 1, limit: 20 }));
      } else {
        dispatch(fetchFollowing({ userId: profile._id, page: 1, limit: 20 }));
      }
    }, [dispatch, profile?._id, activeTab]);

    const handleFollow = (userId) => {
      if (!currentUser) return;
      dispatch(toggleFollow(userId));
    };

    const handlePageChange = (newPage) => {
      if (activeTab === 'followers') {
        dispatch(fetchFollowers({ userId: profile._id, page: newPage, limit: 20 }));
      } else {
        dispatch(fetchFollowing({ userId: profile._id, page: newPage, limit: 20 }));
      }
    };

    const users = activeTab === 'followers' ? followers : following;
    const meta = activeTab === 'followers' ? followersMeta : followingMeta;

  if (profileLoading) {
    return (
      <div className="state-container">
        <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
        <p className="mt-3 text-sm text-gray-500">Loading profile...</p>
      </div>
    );
  }

    if (!profile) {
      return (
        <div className="followers-container text-center">
          <h1 className="error-title">User not found</h1>
        </div>
      );
    }

    return (
      <div className="followers-container">
        {/* Header */}
        <div className="profile-header">
          <Avatar user={profile} size="md" linkTo={`/profile/${profile.username}`} />
          <div className="profile-info">
            <Link to={`/profile/${profile.username}`} className="profile-name">
              {profile.name}
            </Link>
            <p className="profile-username">@{profile.username}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <Link
            to={`/profile/${username}/followers`}
            onClick={() => setActiveTab('followers')}
            className={`tab-button ${activeTab === 'followers' ? 'active' : ''}`}
          >
            Followers ({profile.followerCount})
          </Link>
          <Link
            to={`/profile/${username}/following`}
            onClick={() => setActiveTab('following')}
            className={`tab-button ${activeTab === 'following' ? 'active' : ''}`}
          >
            Following ({profile.followingCount})
          </Link>
        </div>

       {listLoading && (
  <div className="state-container">
    <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
    <p className="mt-3 text-sm text-gray-500">
      Loading {activeTab}...
    </p>
  </div>
)}

        {!listLoading && users.length === 0 && (
          <div className="state-container">
            <p className="empty-text">
              {activeTab === 'followers'
                ? 'No followers yet.'
                : 'Not following anyone yet.'}
            </p>
          </div>
        )}

        {!listLoading && users.length > 0 && (
          <div className="users-list">
            {users.map((u) => {
              const userData = u.follower || u.following || u;
              return (
                <div key={userData._id} className="user-card">
                  <Avatar
                    user={userData}
                    size="md"
                    linkTo={`/profile/${userData.username}`}
                  />
                  <div className="user-card-info">
                    <Link to={`/profile/${userData.username}`} className="user-card-name">
                      {userData.name}
                    </Link>
                    {userData.headline && (
                      <p className="user-card-headline">{userData.headline}</p>
                    )}
                  </div>

                  {currentUser?._id !== userData._id && (
                    <button
                      onClick={() => handleFollow(userData._id)}
                      className={`follow-btn ${userData.isFollowing ? 'following' : 'follow'}`}
                    >
                      {userData.isFollowing ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <Pagination meta={meta} onPageChange={handlePageChange} />
      </div>
    );
  };

  export default FollowersPage;