import React from 'react';

import './field-set.scss';

export type FieldSetProps = {
  legend?: string;
};

export const FieldSet: React.FC<FieldSetProps> = ({ legend, children }) => (
  <fieldset className="field-set">
    {legend && <legend>{legend}</legend>}
    {children}
  </fieldset>
);
