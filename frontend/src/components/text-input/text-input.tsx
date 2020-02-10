import React from 'react';
import './text-input.scss';

type TextInputProps = {
  name?: string;
  id?: string;
  className ?: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: any;
  disabled ?: boolean;
  readOnly ?: boolean;
}


export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(({
  name, id, type = 'text', value, onChange, className = '', disabled = false, readOnly = false
}, ref) => {
  return (
    <input className={'text-input ' + className}
      name={name} ref={ref} id={id} type={type} 
      onChange={onChange} value={value} disabled={disabled} readOnly={readOnly} />
  );
});
