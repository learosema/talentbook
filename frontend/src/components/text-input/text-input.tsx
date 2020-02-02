import React from 'react';
import './text-input.scss';

type TextInputProps = {
  name?: string;
  id?: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: any;
}

export const TextInput: React.FC<TextInputProps> = ({name, id, type = 'text', value, onChange}) => (
  <input className="text-input" name={name} id={id} type={type} onChange={onChange} value={value} />
);