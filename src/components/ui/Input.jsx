const Input = ({ label, error, type = 'text', register, name, ...rest }) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label htmlFor={name} className="insta-label">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        className={`insta-input ${error ? 'error' : ''}`}
        {...(register ? register(name) : {})}
        {...rest}
      />
      {error && <p className="insta-form-error">{error}</p>}
    </div>
  );
};

export default Input;
