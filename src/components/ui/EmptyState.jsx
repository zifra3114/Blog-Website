const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="insta-empty-state">
      {icon && (
        <div className="insta-empty-icon">
          {icon}
        </div>
      )}
      <h3 className="insta-empty-title">{title}</h3>
      {description && (
        <p className="insta-empty-description">{description}</p>
      )}
      {action}
    </div>
  );
};

export default EmptyState;
