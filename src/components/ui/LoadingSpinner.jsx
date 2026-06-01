const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'insta-spinner-sm',
    md: 'insta-spinner-md',
    lg: 'insta-spinner-lg',
  };

  return (
    <div className={className} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className={`insta-spinner ${sizes[size]}`}></div>
    </div>
  );
};

export default LoadingSpinner;
