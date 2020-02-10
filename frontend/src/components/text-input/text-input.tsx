import React from 'react';
import './text-input.scss';

type TextInputProps = {
  name?: string;
  id?: string;
  className ?: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ref?: React.MutableRefObject<HTMLInputElement | null>;
  value: any;
  disabled ?: boolean;
  readOnly ?: boolean;
}

// TODO: https://reactjs.org/docs/forwarding-refs.html
export const TextInput: React.FC<TextInputProps> = ({name, id, type = 'text', value, onChange, className = '', disabled = false, readOnly = false, ref = null}) => (
  <input className={'text-input ' + className} 
    name={name} ref={ref} id={id} type={type} onChange={onChange} value={value} disabled={disabled} readOnly={readOnly} />
);