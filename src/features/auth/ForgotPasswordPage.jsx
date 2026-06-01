import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { forgotPasswordSchema } from '../../utils/validators.js';
import { useAuth } from '../../hooks/useAuth.js';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import '../../styles/globals.css'; 

const ForgotPasswordPage = () => {
  const { forgotPassword, loading, error, message, clearError, clearMessage } =
    useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    clearError();
    clearMessage();
    await forgotPassword(data.email);
  };

  return (
    <div className="insta-viewport-wrapper insta-global-center-layout">
      <div className="insta-login-container spec-forgot-container-width">
        
        <div className="insta-header-section text-center-override">
          {/* Premium Lock Illustration Badge */}
          <div className="insta-lock-badge-wrapper">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="insta-lock-icon">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h3>Trouble Logging In?</h3>
          <p className="insta-register-subtitle">
            Enter your email and we'll send you a link to get back into your account.
          </p>
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

        {/* Success Message Alert */}
        {message && (
          <div className="insta-success-banner-dark">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>{message}</span>
          </div>
        )}

        {/* Conditional Input Rendering */}
        {!message && (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="insta-form-layout">
            <div className="insta-input-box-wrapper">
              <Input
                label=""
                name="email"
                type="email"
                placeholder="Email Address"
                register={register}
                error={errors.email?.message}
              />
            </div>

            <Button type="submit" loading={loading} className="insta-login-btn-override font-change-forgot">
              Send login link
                </Button>
              </form>
            )}

        {/* Divider Line */}
        <div className="insta-forgot-divider">
          <div className="divider-line"></div>
          <span>OR</span>
          <div className="divider-line"></div>
        </div>

        {/* Bottom Actions Switch Button */}
        <div className="insta-bottom-box mt-0-override">
          <Link to="/register" className="insta-create-new-text-link">
            Create new account
          </Link>
        </div>

        <div className="insta-bottom-box back-to-login-panel">
          <Link to="/login" className="insta-back-login-btn">
            Back to login
          </Link>
        </div>

        <div className="meta-footer-brand">
          <span>∞ Meta</span>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;