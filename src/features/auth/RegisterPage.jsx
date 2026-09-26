import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema } from '../../utils/validators.js';
import { useAuth } from '../../hooks/useAuth.js';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import '../../styles/auth.css';
import Logo from "../../assets/logo.png";
import Image1 from "../../assets/img.jpg";
import Image2 from "../../assets/img1.jpg";
import Image3 from "../../assets/img3.jpg";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, loading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    clearError();
    const result = await registerUser(data);
    if (!result.error) {
      navigate('/');
    }
  };

  return (
    <div className="insta-viewport-wrapper">
      <div className="insta-split-master">

        {/* LEFT SIDE: Showcase Panel with Drop-In Cards */}
        <div className="insta-left-panel">
          <div className="insta-left-content-box">

            <div className="insta-brand-logo-holder">
              <img src={Logo} alt="DevBlog Logo" className="insta-gradient-logo" />
            </div>

            <h2 className="insta-visual-title">
              Share your code, ideas, and <br />developer <span className="text-gradient-accent">journey.</span>
            </h2>

            <div className="insta-stacked-showcase">
              <div className="insta-mock-photo photo-left drop-card-1">
                <div className="insta-card-img-placeholder">
                  <img src={Image1} alt="DevBlog Post Left" className="insta-post-image" />
                </div>
              </div>

              <div className="insta-mock-photo photo-center drop-card-2">
                <div className="photo-card-top-bar">
                  <div className="photo-profile-badge"></div>
                  <div className="photo-profile-line"></div>
                </div>
                <div className="insta-card-img-placeholder pic-main">
                  <img src={Image2} alt="DevBlog Post Center" className="insta-post-image" />
                </div>
              </div>

              <div className="insta-mock-photo photo-right drop-card-3">
                <div className="insta-card-img-placeholder">
                  <img src={Image3} alt="DevBlog Post Right" className="insta-post-image" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE: Register Form (Single Column Fields) */}
        <div className="insta-right-panel">
          <div className="insta-login-container register-card-override">

            <div className="insta-brand-logo-holder login-mini-logo">
              <img src={Logo} alt="DevBlog Logo" className="insta-gradient-logo" />
            </div>

            <div className="insta-header-section">
              <h3>Create Your Account</h3>
              <p className="auth-subtitle-text">Join DevBlog community today</p>
            </div>

            {error && (
              <div className="insta-error-banner-dark">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="insta-form-layout">

              <div className="insta-input-box-wrapper">
                <label className="modern-input-label">Full Name</label>
                <Input
                  label=""
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  register={register}
                  error={errors.name?.message}
                />
              </div>

              <div className="insta-input-box-wrapper">
                <label className="modern-input-label">Username</label>
                <Input
                  label=""
                  name="username"
                  type="text"
                  placeholder="Choose a username"
                  register={register}
                  error={errors.username?.message}
                />
              </div>

              <div className="insta-input-box-wrapper">
                <label className="modern-input-label">Email Address</label>
                <Input
                  label=""
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  register={register}
                  error={errors.email?.message}
                />
              </div>

              <div className="insta-input-box-wrapper">
                <label className="modern-input-label">Password</label>
                <Input
                  label=""
                  name="password"
                  type="password"
                  placeholder="Create a password (min. 8 characters)"
                  register={register}
                  error={errors.password?.message}
                />
              </div>

              <Button type="submit" loading={loading} className="insta-login-btn-override">
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="auth-divider-section">
              <div className="auth-divider-line"></div>
              <span className="auth-divider-text">OR</span>
              <div className="auth-divider-line"></div>
            </div>

            <div className="insta-signin-footer-box">
              <span>Already have an account? </span>
              <Link to="/login" className="insta-blue-anchor-link">
                Sign in
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
