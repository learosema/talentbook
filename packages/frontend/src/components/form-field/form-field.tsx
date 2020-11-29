import React from 'react';
import './form-field.scss';

type FormFieldProps = {
  htmlFor: string;
  label: string;
  error?: string;
  className?: string;
};

export const FormField: React.FC<FormFieldProps> = ({
  htmlFor,
  label,
  error,
  className,
  children,
}) => (
  <div
    className={['form-field', Boolean(error) && 'form-field--error', className]
      .filter(Boolean)
      .join(' ')}
  >
    <label className="form-field__label" htmlFor={htmlFor}>
      {label}
    </label>
    {children}
    {error && <aside className="form-field__error">{error}</aside>}
  </div>
);
