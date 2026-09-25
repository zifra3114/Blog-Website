import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, clearMutationError } from './userSlice.js';
import { uploadImage } from '../../api/uploadApi.js';
import { setAccessToken } from '../../api/client.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import Input from '../../components/ui/Input.jsx';
import Textarea from '../../components/ui/Textarea.jsx';
import Button from '../../components/ui/Button.jsx';
import TagInput from '../../components/ui/TagInput.jsx';
import ImageUpload from '../../components/ui/ImageUpload.jsx';

const EditProfilePage = () => {
  useDocumentTitle('Edit Profile');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { mutationLoading, mutationError } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    name: '',
    username: '',
    headline: '',
    bio: '',
    location: '',
    website: '',
  });
  const [skills, setSkills] = useState([]);
  const [socialLinks, setSocialLinks] = useState({
    twitter: '',
    linkedin: '',
    github: '',
    facebook: '',
    instagram: '',
    youtube: '',
  });

  // Image upload states
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [avatar, setAvatar] = useState({ url: '', publicId: '' });
  const [coverImage, setCoverImage] = useState({ url: '', publicId: '' });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        username: user.username || '',
        headline: user.headline || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
      });
      setSkills(user.skills || []);
      setSocialLinks({
        twitter: user.socialLinks?.twitter || '',
        linkedin: user.socialLinks?.linkedin || '',
        github: user.socialLinks?.github || '',
        facebook: user.socialLinks?.facebook || '',
        instagram: user.socialLinks?.instagram || '',
        youtube: user.socialLinks?.youtube || '',
      });
      setAvatar(user.avatar || { url: '', publicId: '' });
      setCoverImage(user.coverImage || { url: '', publicId: '' });
    }
  }, [user]);

  useEffect(() => {
    return () => dispatch(clearMutationError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = async (file) => {
    setAvatarFile(file);
    setAvatarUploading(true);
    try {
      const result = await uploadImage(file, 'avatar');
      setAvatar({ url: result.url, publicId: result.publicId });
    } catch (err) {
      alert('Failed to upload avatar: ' + (err.response?.data?.error?.message || err.message));
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleCoverUpload = async (file) => {
    setCoverFile(file);
    setCoverUploading(true);
    try {
      const result = await uploadImage(file, 'cover');
      setCoverImage({ url: result.url, publicId: result.publicId });
    } catch (err) {
      alert('Failed to upload cover: ' + (err.response?.data?.error?.message || err.message));
    } finally {
      setCoverUploading(false);
    }
  };

  const handleSocialLinkChange = (e) => {
    setSocialLinks((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      skills,
      socialLinks: {
        twitter: socialLinks.twitter || '',
        linkedin: socialLinks.linkedin || '',
        github: socialLinks.github || '',
        facebook: socialLinks.facebook || '',
        instagram: socialLinks.instagram || '',
        youtube: socialLinks.youtube || '',
      },
    };

    if (avatar.url) {
      payload.avatar = avatar;
    }

    if (coverImage.url) {
      payload.coverImage = coverImage;
    }

    const result = await dispatch(updateProfile(payload));
    if (!result.error) {
      setTimeout(() => {
        navigate(`/profile/${form.username}`);
      }, 100);
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-header">
        <div className="edit-profile-header-content">
          <h1 className="edit-profile-title">Edit Profile</h1>
          <p className="edit-profile-subtitle">
            Manage your personal information and public profile
          </p>
        </div>
      </div>

      {mutationError && (
        <div className="edit-profile-error">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{mutationError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="edit-profile-form">
        {/* Photos Section */}
        <div className="edit-profile-section">
          <div className="section-header">
            <h2 className="section-title">Photos</h2>
            <p className="section-description">Update your profile and cover photos</p>
          </div>

          <div className="section-content">
            {/* Cover Image */}
            <div className="photo-upload-group">
              <label className="photo-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                Cover Image
              </label>
              <ImageUpload
                type="cover"
                currentUrl={coverImage.url}
                onUpload={handleCoverUpload}
                loading={coverUploading}
              />
              <p className="photo-hint">Recommended: 1500x500px • JPG, PNG • Max 5MB</p>
            </div>

            {/* Avatar */}
            <div className="photo-upload-group">
              <label className="photo-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Profile Photo
              </label>
              <ImageUpload
                type="avatar"
                currentUrl={avatar.url}
                onUpload={handleAvatarUpload}
                user={user}
                loading={avatarUploading}
              />
              <p className="photo-hint">Recommended: 400x400px • Square • JPG, PNG • Max 2MB</p>
            </div>
          </div>
        </div>

        {/* Basic Info Section */}
        <div className="edit-profile-section">
          <div className="section-header">
            <h2 className="section-title">Basic Information</h2>
            <p className="section-description">Your public profile information</p>
          </div>

          <div className="section-content">
            <div className="form-row">
              <Input
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <Input
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <Input
                label="Headline"
                name="headline"
                value={form.headline}
                onChange={handleChange}
                placeholder="e.g. Senior Software Engineer at Google"
              />
            </div>

            <div className="form-row">
              <Textarea
                label="Bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Tell the community about yourself..."
              />
            </div>

            <div className="form-row-group">
              <Input
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. San Francisco, CA"
              />
              <Input
                label="Website"
                name="website"
                type="url"
                value={form.website}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="edit-profile-section">
          <div className="section-header">
            <h2 className="section-title">Skills & Expertise</h2>
            <p className="section-description">Add skills that describe your expertise</p>
          </div>

          <div className="section-content">
            <TagInput tags={skills} onChange={setSkills} maxTags={30} />
            <p className="form-hint">Press Enter or comma to add • Maximum 30 skills</p>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="edit-profile-section">
          <div className="section-header">
            <h2 className="section-title">Social Links</h2>
            <p className="section-description">Connect your social media accounts</p>
          </div>

          <div className="section-content">
            <div className="social-links-grid">
              <div className="social-input-wrapper">
                <div className="social-icon twitter">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                </div>
                <Input
                  label="Twitter"
                  name="twitter"
                  value={socialLinks.twitter}
                  onChange={handleSocialLinkChange}
                  placeholder="https://twitter.com/username"
                />
              </div>

              <div className="social-input-wrapper">
                <div className="social-icon linkedin">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </div>
                <Input
                  label="LinkedIn"
                  name="linkedin"
                  value={socialLinks.linkedin}
                  onChange={handleSocialLinkChange}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="social-input-wrapper">
                <div className="social-icon github">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                  </svg>
                </div>
                <Input
                  label="GitHub"
                  name="github"
                  value={socialLinks.github}
                  onChange={handleSocialLinkChange}
                  placeholder="https://github.com/username"
                />
              </div>

              <div className="social-input-wrapper">
                <div className="social-icon facebook">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </div>
                <Input
                  label="Facebook"
                  name="facebook"
                  value={socialLinks.facebook}
                  onChange={handleSocialLinkChange}
                  placeholder="https://facebook.com/username"
                />
              </div>

              <div className="social-input-wrapper">
                <div className="social-icon instagram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="none" stroke="white" strokeWidth="2" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="white" strokeWidth="2" />
                  </svg>
                </div>
                <Input
                  label="Instagram"
                  name="instagram"
                  value={socialLinks.instagram}
                  onChange={handleSocialLinkChange}
                  placeholder="https://instagram.com/username"
                />
              </div>

              <div className="social-input-wrapper">
                <div className="social-icon youtube">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white" />
                  </svg>
                </div>
                <Input
                  label="YouTube"
                  name="youtube"
                  value={socialLinks.youtube}
                  onChange={handleSocialLinkChange}
                  placeholder="https://youtube.com/@username"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="edit-profile-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="action-btn btn-cancel"
            disabled={mutationLoading}
          >
            Cancel
          </button>
          <Button type="submit" loading={mutationLoading} className="action-btn btn-save">
            {mutationLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>

      <style jsx>{`
        .edit-profile-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 32px 20px;
        }

        .edit-profile-header {
          margin-bottom: 32px;
        }

        .edit-profile-header-content {
          text-align: center;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--insta-border-secondary);
        }

        .edit-profile-title {
          font-size: 32px;
          font-weight: 700;
          color: var(--insta-text-primary);
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
        }

        .edit-profile-subtitle {
          font-size: 15px;
          color: var(--insta-text-secondary);
          margin: 0;
        }

        .edit-profile-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          padding: 14px 18px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #dc2626;
          font-size: 14px;
        }

        .edit-profile-form {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .edit-profile-section {
          background: var(--insta-bg-secondary);
          border: 1px solid var(--insta-border-primary);
          border-radius: 16px;
          padding: 24px;
        }

        .section-header {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--insta-border-secondary);
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--insta-text-primary);
          margin: 0 0 6px 0;
        }

        .section-description {
          font-size: 14px;
          color: var(--insta-text-secondary);
          margin: 0;
        }

        .section-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .photo-upload-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .photo-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--insta-text-primary);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .photo-hint {
          font-size: 12px;
          color: var(--insta-text-tertiary);
          margin: 0;
        }

        .form-row {
          width: 100%;
        }

        .form-row-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-hint {
          font-size: 12px;
          color: var(--insta-text-tertiary);
          margin: 8px 0 0 0;
        }

        .social-links-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .social-input-wrapper {
          position: relative;
          display: flex;
          align-items: flex-end;
          gap: 12px;
        }

        .social-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-bottom: 2px;
        }

        .social-icon.twitter {
          background: #1DA1F2;
          color: white;
        }

        .social-icon.linkedin {
          background: #0A66C2;
          color: white;
        }

        .social-icon.github {
          background: #333;
          color: white;
        }

        .social-icon.facebook {
          background: #1877F2;
          color: white;
        }

        .social-icon.instagram {
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
          color: white;
        }

        .social-icon.youtube {
          background: #FF0000;
          color: white;
        }

        .edit-profile-actions {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
          padding-top: 24px;
          border-top: 1px solid var(--insta-border-secondary);
        }

        .action-btn {
          padding: 12px 32px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn-cancel {
          background: var(--insta-bg-secondary);
          color: var(--insta-text-primary);
          border: 1px solid var(--insta-border-primary);
        }

        .btn-cancel:hover:not(:disabled) {
          background: var(--insta-bg-tertiary);
        }

        .btn-save {
          background: var(--insta-accent-blue);
          color: white;
          min-width: 140px;
        }

        .btn-save:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .edit-profile-container {
            padding: 20px 16px;
          }

          .edit-profile-title {
            font-size: 24px;
          }

          .edit-profile-subtitle {
            font-size: 14px;
          }

          .edit-profile-section {
            padding: 20px 16px;
          }

          .form-row-group {
            grid-template-columns: 1fr;
          }

          .social-links-grid {
            grid-template-columns: 1fr;
          }

          .edit-profile-actions {
            flex-direction: column-reverse;
          }

          .action-btn {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .edit-profile-container {
            padding: 16px 12px;
          }

          .edit-profile-title {
            font-size: 20px;
          }

          .edit-profile-section {
            padding: 16px 12px;
            border-radius: 12px;
          }

          .section-title {
            font-size: 16px;
          }

          .social-input-wrapper {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default EditProfilePage;
