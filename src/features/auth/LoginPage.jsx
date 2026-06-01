import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema } from '../../utils/validators.js';
import { useAuth } from '../../hooks/useAuth.js';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import '../../styles/globals.css'; 
import Logo from "../../assets/logo.png";
import Image1 from "../../assets/img.jpg";
import Image2 from "../../assets/img1.jpg";
import Image3 from "../../assets/img3.jpg";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    clearError();
    const result = await login(data);
    if (!result.error) {
      navigate('/');
    }
  };

  return (
    <div className="insta-viewport-wrapper">
      <div className="insta-split-master">
        
        {/* LEFT SIDE: DevBlog Premium Brand Grid Layout */}
        <div className="insta-left-panel">
          <div className="insta-left-content-box">

            {/* Logo Image */}
            <div className="insta-brand-logo-holder">
              <img src={Logo} alt="DevBlog Logo" className="insta-gradient-logo" />
            </div>

            <h2 className="insta-visual-title">
              Share your code, ideas, and <br />developer <span className="text-gradient-accent">journey.</span>
            </h2>

            {/* Floating Posts Photo Illustration Grid */}
            <div className="insta-stacked-showcase">
              
              {/* Left Dynamic Photo Card */}
              <div className="insta-mock-photo photo-left">
                <div className="insta-card-img-placeholder">
                  <img src={Image1} alt="DevBlog Post Left" className="insta-post-image" />
                </div>
              </div>

              {/* Center Premium Main Photo Card */}
              <div className="insta-mock-photo photo-center">
                <div className="photo-card-top-bar">
                  <div className="photo-profile-badge"></div>
                  <div className="photo-profile-line"></div>
                </div>
                <div className="insta-card-img-placeholder pic-main">
                  <img src={Image2} alt="DevBlog Post Center" className="insta-post-image" />
                </div>
              </div>

              {/* Right Dynamic Photo Card */}
              <div className="insta-mock-photo photo-right">
                <div className="insta-card-img-placeholder">
                  <img src={Image3} alt="DevBlog Post Right" className="insta-post-image" />
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* RIGHT SIDE: Perfect Centered Dark Login Form */}
        <div className="insta-right-panel">
          <div className="insta-login-container">
            
            <div className="insta-header-section">
              <h3>Login</h3>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="insta-error-banner-dark">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="insta-form-layout">
              <div className="insta-input-box-wrapper">
                <Input
                  label=""
                  name="email"
                  type="email"
                  placeholder="Enter Your Email"
                  register={register}
                  error={errors.email?.message}
                />
              </div>

              <div className="insta-input-box-wrapper">
                <Input
                  label=""
                  name="password"
                  type="password"
                  placeholder="Enter Your Password"
                  register={register}
                  error={errors.password?.message}
                />
              </div>

              <Button type="submit" loading={loading} className="insta-login-btn-override">
                Log in
              </Button>

              <div className="insta-forgot-container">
                <Link to="/forgot-password" className="insta-forgot-anchor">
                  Forgot password?
                </Link>
              </div>
            </form>

            {/* Bottom Actions Layout */}
            <div className="insta-bottom-box">
              <Link to="/register" className="insta-create-account-btn">
                Create new account
              </Link>
            </div>

            <div className="meta-footer-brand">
              <span>∞ Meta</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;