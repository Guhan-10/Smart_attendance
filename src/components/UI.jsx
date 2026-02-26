import React from 'react';

export const Card = ({ children, className = '', ...props }) => (
  <div className={`card ${className}`} {...props}>
    {children}
  </div>
);

export const Button = ({ children, variant = 'primary', className = '', type = 'button', ...props }) => (
  <button type={type} className={`btn btn-${variant} ${className}`} {...props}>
    {children}
  </button>
);

export const Input = ({ label, type = 'text', id, className = '', ...props }) => (
  <div className={`input-group ${className}`}>
    {label && <label htmlFor={id} className="input-label">{label}</label>}
    <input type={type} id={id} className="input-field" {...props} />
  </div>
);

export const Select = ({ label, id, className = '', options = [], ...props }) => (
  <div className={`input-group ${className}`}>
    {label && <label htmlFor={id} className="input-label">{label}</label>}
    <select id={id} className="input-field" {...props}>
      <option value="" disabled>Select {label}</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt.value || opt}>{opt.label || opt}</option>
      ))}
    </select>
  </div>
);

export const Badge = ({ children, variant = 'primary', className = '' }) => (
  <span className={`badge badge-${variant} ${className}`}>
    {children}
  </span>
);

export const Avatar = ({ initials, className = '' }) => (
  <div className={`avatar ${className}`}>
    {initials}
  </div>
);
