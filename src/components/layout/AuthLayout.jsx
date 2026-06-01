import { Outlet, Link } from 'react-router-dom';
import '../../styles/globals.css'; 

const AuthLayout = () => {
  return (
    <div className="insta-auth-layout-viewport">
      <div className="insta-auth-card-wrapper">
        
        {/* Naya Centered Layout Header (Logo Section) */}
        <div className="insta-auth-brand-header">
          <Link to="/" className="insta-auth-brand-link">
            <span className="text-gradient-accent text-logo-glow">
              My Blog App
            </span>
          </Link>
        </div>

        {/* Dynamic Inner Card Content Window */}
        <div className="insta-auth-content-window">
          <Outlet />
        </div>
        
      </div>
    </div>
  );
};

export default AuthLayout;