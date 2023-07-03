import React from 'react';

type FormFieldProps = {
  htmlFor?: string;
  label?: string;
  error?: string;
  className?: string;
  children?: React.ReactNode;
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
    {(label && htmlFor) && (
      <label className="form-field__label" htmlFor={htmlFor}>
        {label}
      </label>
    )}
    {children}
    {error && <div className="form-field__error">{error}</div>}
  </div>
);
