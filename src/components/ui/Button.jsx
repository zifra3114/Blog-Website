const Button = ({
  children,
  loading = false,
  variant = 'primary',
  type = 'button',
  className = '',
  ...rest
}) => {
  const variants = {
    primary: 'insta-btn insta-btn-primary',
    secondary: 'insta-btn insta-btn-secondary',
    ghost: 'insta-btn insta-btn-ghost',
    danger: 'insta-btn insta-btn-danger',
  };

  return (
    <button
      type={type}
      className={`${variants[variant]} ${className}`}
      style={{ width: '100%' }}
      disabled={loading}
      {...rest}
    >
      {loading ? (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span className="insta-spinner insta-spinner-sm"></span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
