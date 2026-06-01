import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../auth/authSlice.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import EditProfilePage from '../user/EditProfilePage.jsx';

const TABS = [
  { id: 'profile', label: 'Edit Profile' },
  { id: 'account', label: 'Account' },
];

const SettingsPage = () => {
  useDocumentTitle('Settings');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className="insta-app-content-surface" style={{ maxWidth: '935px' }}>
      <h1 className="insta-visual-title" style={{ fontSize: '28px', marginBottom: '32px', textAlign: 'left' }}>Settings</h1>

      <div style={{ display: 'flex', flexDirection: 'row', gap: '32px', minHeight: '60vh' }}>
        {/* Sidebar */}
        <div style={{ width: '200px', flexShrink: 0, borderRight: '1px solid var(--insta-border-secondary)', paddingRight: '12px' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="insta-btn"
                style={{
                  textAlign: 'left',
                  padding: '12px 16px',
                  fontSize: '14px',
                  borderRadius: '8px',
                  justifyContent: 'flex-start',
                  backgroundColor: activeTab === tab.id ? 'var(--insta-bg-secondary)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--insta-text-primary)' : 'var(--insta-text-secondary)',
                  border: 'none',
                  fontWeight: activeTab === tab.id ? '600' : '400',
                  minWidth: 'auto'
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          {activeTab === 'profile' && <EditProfilePage />}

          {activeTab === 'account' && (
            <div className="insta-card" style={{ padding: '32px' }}>
              <h2 className="insta-post-title-text" style={{ fontSize: '20px', marginBottom: '24px' }}>
                Account Settings
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Email */}
                <div>
                  <label className="insta-label" style={{ display: 'block', marginBottom: '4px' }}>
                    Email
                  </label>
                  <p className="insta-text-primary" style={{ fontSize: '14px', margin: 0 }}>{user?.email}</p>
                  <p className="insta-text-tertiary" style={{ fontSize: '12px', marginTop: '4px' }}>
                    {user?.isEmailVerified ? 'Verified' : 'Not verified'}
                  </p>
                </div>

                {/* Role */}
                <div>
                  <label className="insta-label" style={{ display: 'block', marginBottom: '4px' }}>
                    Role
                  </label>
                  <p className="insta-text-primary" style={{ fontSize: '14px', margin: 0, textTransform: 'capitalize' }}>
                    {user?.role || 'user'}
                  </p>
                </div>

                {/* Member since */}
                <div>
                  <label className="insta-label" style={{ display: 'block', marginBottom: '4px' }}>
                    Member since
                  </label>
                  <p className="insta-text-primary" style={{ fontSize: '14px', margin: 0 }}>
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </p>
                </div>

                {/* Danger zone */}
                <div style={{ paddingTop: '24px', borderTop: '1px solid var(--insta-border-secondary)' }}>
                  <h3 className="insta-text-error" style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                    Danger Zone
                  </h3>
                  <button
                    onClick={handleLogout}
                    className="insta-btn insta-btn-danger"
                    style={{ padding: '8px 16px', fontSize: '13px', width: 'fit-content' }}
                  >
                    Sign out of all devices
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
