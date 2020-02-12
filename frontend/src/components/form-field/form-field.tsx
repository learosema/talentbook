import React from 'react';
import './form-field.scss';

type FormFieldProps = {
  htmlFor: string;
  label: string;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({htmlFor, label, className, children}) => (
  <div className={'form-field ' + className}>
    <label className="form-field__label" htmlFor={htmlFor}>{label}</label>
    {children}
  </div>
);