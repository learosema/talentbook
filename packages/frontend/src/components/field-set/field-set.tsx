import React from 'react';

export type FieldSetProps = {
  className?: string;
  legend?: string;
  children?: React.ReactNode;
};

export const FieldSet: React.FC<FieldSetProps> = ({ legend, className, children }) => (
  <fieldset className={["field-set flow", className].filter(Boolean).join(' ')}>
    {legend && <legend>{legend}</legend>}
    {children}
  </fieldset>
);
