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
      console.log('Loading user data into form:', user);
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
    } else {
      console.warn('No user data available for form initialization');
    }
  }, [user]);

  useEffect(() => {
    return () => dispatch(clearMutationError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Form field changed: ${name} = ${value}`);
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

    // Build payload with only non-empty values for nested objects
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

    // Only include avatar if it has a URL
    if (avatar.url) {
      payload.avatar = avatar;
    }

    // Only include coverImage if it has a URL
    if (coverImage.url) {
      payload.coverImage = coverImage;
    }

    const result = await dispatch(updateProfile(payload));
    if (!result.error) {
      // Wait a bit for state to update before navigating
      setTimeout(() => {
        navigate(`/profile/${form.username}`);
      }, 100);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="insta-post-title-text" style={{ fontSize: '20px', marginBottom: '8px' }}>Edit profile</h2>
      <p className="insta-text-secondary" style={{ fontSize: '14px', marginBottom: '32px' }}>
        Update your profile information and photos.
      </p>

      {mutationError && (
        <div className="insta-error-banner-dark">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{mutationError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* ─── Cover Image ─── */}
        <div>
          <label className="insta-label" style={{ display: 'block', marginBottom: '8px' }}>
            Cover Image
          </label>
          <ImageUpload
            type="cover"
            currentUrl={coverImage.url}
            onUpload={handleCoverUpload}
            loading={coverUploading}
          />
        </div>

        {/* ─── Avatar ─── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
          <div>
            <label className="insta-label" style={{ display: 'block', marginBottom: '8px' }}>
              Profile Photo
            </label>
            <ImageUpload
              type="avatar"
              currentUrl={avatar.url}
              onUpload={handleAvatarUpload}
              user={user}
              loading={avatarUploading}
            />
          </div>
          <p className="insta-text-tertiary" style={{ fontSize: '12px', paddingBottom: '8px' }}>
            Recommended: Square, at least 400x400px
          </p>
        </div>

        {/* ─── Text fields ─── */}
        <Input
          label="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <Input
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <Input
          label="Headline"
          name="headline"
          value={form.headline}
          onChange={handleChange}
          placeholder="e.g. Senior Software Engineer at Google"
        />

        <Textarea
          label="Bio"
          name="bio"
          value={form.bio}
          onChange={handleChange}
          rows={4}
          placeholder="Tell the community about yourself..."
        />

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

        {/* ─── Skills ─── */}
        <div>
          <label className="insta-label" style={{ display: 'block', marginBottom: '8px' }}>
            Skills
          </label>
          <TagInput tags={skills} onChange={setSkills} maxTags={30} />
          <p className="insta-text-tertiary" style={{ fontSize: '12px', marginTop: '8px' }}>
            Add skills that describe your expertise (press Enter or comma to add)
          </p>
        </div>

        {/* ─── Social Links ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 className="insta-label" style={{ fontSize: '16px', marginBottom: '0' }}>
            Social Links
          </h3>

          <Input
            label="Twitter"
            name="twitter"
            value={socialLinks.twitter}
            onChange={handleSocialLinkChange}
            placeholder="https://twitter.com/username"
          />

          <Input
            label="LinkedIn"
            name="linkedin"
            value={socialLinks.linkedin}
            onChange={handleSocialLinkChange}
            placeholder="https://linkedin.com/in/username"
          />

          <Input
            label="GitHub"
            name="github"
            value={socialLinks.github}
            onChange={handleSocialLinkChange}
            placeholder="https://github.com/username"
          />

          <Input
            label="Facebook"
            name="facebook"
            value={socialLinks.facebook}
            onChange={handleSocialLinkChange}
            placeholder="https://facebook.com/username"
          />

          <Input
            label="Instagram"
            name="instagram"
            value={socialLinks.instagram}
            onChange={handleSocialLinkChange}
            placeholder="https://instagram.com/username"
          />

          <Input
            label="YouTube"
            name="youtube"
            value={socialLinks.youtube}
            onChange={handleSocialLinkChange}
            placeholder="https://youtube.com/@username"
          />
        </div>

        {/* ─── Actions ─── */}
        <div style={{ display: 'flex', gap: '12px', paddingTop: '24px', borderTop: '1px solid var(--insta-border-secondary)' }}>
          <Button type="submit" loading={mutationLoading} style={{ flex: 1 }}>
            Save changes
          </Button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="insta-btn insta-btn-secondary"
            style={{ flex: 1 }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
