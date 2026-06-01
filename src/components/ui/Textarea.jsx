const Textarea = ({ label, error, register, name, rows = 6, ...rest }) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label htmlFor={name} className="insta-label">
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        rows={rows}
        className={`insta-textarea ${error ? 'error' : ''}`}
        {...(register ? register(name) : {})}
        {...rest}
      />
      {error && <p className="insta-form-error">{error}</p>}
    </div>
  );
};

export default Textarea;
