import React from 'react';

export type FieldSetProps = {
  legend?: string;
};

export const FieldSet: React.FC<FieldSetProps> = ({ legend, children }) => (
  <fieldset className="field-set">
    {legend && <legend>{legend}</legend>}
    {children}
  </fieldset>
);
